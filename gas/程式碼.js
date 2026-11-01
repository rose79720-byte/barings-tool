const SHEET_ID = '1-FskvmgoaLsR_UP7RZVJHQBlM1a2rqlpReCRgWEFkPc';

function doGet(e) {
  const action = e.parameter.action;
  
  try {
    if (action === 'getDates') {
      return jsonResponse(getDates());
    } else if (action === 'getRates') {
      return jsonResponse(getRates());
    } else if (action === 'getFunds') {
      return jsonResponse(getFunds());
    } else if (action === 'getCompare') {
      return jsonResponse(getCompare(e.parameter.codes));
    } else if (action === 'getSeries') {
      return jsonResponse(getSeries(e.parameter.codes));
    } else if (action === 'getAll') {
      const dates = getDates();
      const rates = getRates();
      return jsonResponse({ ...dates, ...rates });
    }
    return jsonResponse({ error: 'unknown action' });
  } catch (err) {
    return jsonResponse({ error: err.toString() });
  }
}

// 從 Sheet 讀取當月配息基準日
function getDates() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('config');
  const rows = sheet.getDataRange().getValues();
  
  const today = new Date();
  const currentMonth = today.getFullYear() + '-' + 
    String(today.getMonth() + 1).padStart(2, '0');
  
  // 找當月資料，找不到就用最近的未來月份
  let target = null;
  for (let i = 1; i < rows.length; i++) {
    const month = rows[i][0];
    const date = rows[i][1];
    const weekday = rows[i][2];
    if (month >= currentMonth && !target) {
      target = { month, date, weekday };
    }
  }
  
  if (!target && rows.length > 1) {
    const last = rows[rows.length - 1];
    target = { month: last[0], date: last[1], weekday: last[2] };
  }
  
  return target || { month: '', date: '', weekday: '' };
}

// 從 MoneyDJ 抓最新年化配息率
function getRates() {
  const funds = [
    { key: 'fund1', code: 'PLB22', name: '霸菱優先順位資產抵押債' },
    { key: 'fund2', code: 'PLB24', name: '霸菱環球非投資等級債' },
  ];

  const result = {};

  for (const fund of funds) {
    try {
      const url = `https://www.moneydj.com/funddj/yp/wb05.djhtm?a=${fund.code}`;
      const response = UrlFetchApp.fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Referer': 'https://www.moneydj.com/funddj/',
        },
        muteHttpExceptions: true
      });

      const bytes = response.getContent();
      const html = Utilities.newBlob(bytes).getDataAsString('Big5');

      // 策略：找到第一個日期（配息基準日），
      // 然後抓緊接其後的兩個數字：
      //   第1個 = 每單位配息金額（多位小數，例如 0.832156）
      //   第2個 = 年化配息率（2位小數，例如 10.46）← 這個才是我們要的
      const match = html.match(
        /(\d{4}\/\d{2}\/\d{2})[\s\S]*?(\d+\.\d+)[\s\S]*?(\d{1,2}\.\d{2})(?!\d)/
      );

      if (match) {
        const rate = parseFloat(match[3]);
        // 合理性檢查：年化配息率應在 3~25% 之間
        if (rate >= 3 && rate <= 25) {
          result[fund.key] = {
            name: fund.name,
            rate: rate.toFixed(2),
            asOf: match[1]
          };
        } else {
          // 數字不合理，回退：找所有 XX.XX 數字，取第一個在 3~25 之間的
          const allNums = [...html.matchAll(/(\d{1,2}\.\d{2})(?!\d)/g)]
            .map(m => parseFloat(m[1]))
            .filter(v => v >= 3 && v <= 25);
          result[fund.key] = {
            name: fund.name,
            rate: allNums.length > 0 ? allNums[0].toFixed(2) : '—',
            asOf: match[1]
          };
        }
      } else {
        result[fund.key] = { name: fund.name, rate: '—', asOf: '' };
      }

    } catch (err) {
      result[fund.key] = { name: fund.name, rate: '—', asOf: '', error: err.toString() };
    }
  }

  return result;
}

// 競品比較：從 yp012001（績效頁）抓各期間報酬率、年化標準差、Sharpe、Beta。
// codes 以逗號分隔（例 PLB04,PIM41,ANZ91）；未給則用工具目前的清單。
// regex 已於 Python 對真實頁面驗證：頂列「淨值日期 + 6 數字（淨值/漲跌/YTD/年化標準差/Sharpe/Beta）」，
// 期間報酬取「單筆申購(原幣)」列（1月/3月/6月/1年/2年/3年/5年/10年/成立）。
function getCompare(codesParam) {
  const codes = codesParam
    ? codesParam.split(',').map(s => s.trim()).filter(Boolean)
    : getFunds().map(f => f.code);   // 未指定 → 抓 funds 分頁「上架」清單
  const out = {};
  const extras = fetchCompareExtras_(codes);   // yield / maxdd（並行抓 wb05 + wb06）

  for (const code of codes) {
    try {
      const url = `https://www.moneydj.com/funddj/yp/yp012001.djhtm?a=${code}`;
      const response = UrlFetchApp.fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Referer': 'https://www.moneydj.com/funddj/',
        },
        muteHttpExceptions: true
      });
      const html = Utilities.newBlob(response.getContent()).getDataAsString('Big5');
      const rec = { code };

      // 頂列：淨值日期 + 之後 6 個數字 = 最新淨值 / 漲跌幅 / YTD / 年化標準差 / Sharpe / Beta
      const m = html.match(/(\d{4}\/\d{2}\/\d{2})((?:[\s\S]{0,300}?-?\d+\.\d+){6})/);
      if (m) {
        const nums = (m[2].match(/-?\d+\.\d+/g) || []).slice(0, 6);
        if (nums.length === 6) {
          rec.asOf = m[1]; rec.ytd = nums[2]; rec.vol = nums[3];
          rec.sharpe = nums[4]; rec.beta = nums[5];
        }
      }
      // 期間報酬：單筆申購(原幣) 列
      const mm = html.match(/單筆申購\(原幣\)([\s\S]{0,400}?)(?:定期定額|單筆申購\(台幣\))/);
      if (mm) {
        const ns = (mm[1].match(/-?\d+\.\d+|N\/A/g) || []).slice(0, 9);
        if (ns.length >= 7) { rec.y1 = ns[3]; rec.y2 = ns[4]; rec.y3 = ns[5]; rec.y5 = ns[6]; }
      }
      out[code] = Object.assign(rec, extras[code] || {});
    } catch (err) {
      out[code] = Object.assign({ code, error: err.toString() }, extras[code] || {});
    }
  }
  return out;
}

// ── 新增：配息率 / 含息累積報酬序列 / 最大回撤 ─────────────────────────────

const MDJ_HEADERS_ = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  'Referer': 'https://www.moneydj.com/funddj/',
};
const wb05Url_ = code => `https://www.moneydj.com/funddj/yp/wb05.djhtm?a=${code}`;
// wb06「績效比較-走勢圖」的 image-map；tooltip 即 MoneyDJ 已含息還原的累積報酬 %。
// 實測：視窗固定為近一年（約 242 個日點），A 的首位數字、B/C 起訖等參數皆無效。
const wb06Url_ = code =>
  `https://www.moneydj.com/funddj/chart/DAQChart.xdjjs?A=3,wb06,${code},1&cw=660&ch=300&mtyp=js&mid=map`;

function mdjFetchAll_(urls) {
  const resps = UrlFetchApp.fetchAll(urls.map(url => ({ url, headers: MDJ_HEADERS_, muteHttpExceptions: true })));
  return resps.map(r => Utilities.newBlob(r.getContent()).getDataAsString('Big5'));
}

// wb05 配息表最新一列：配息基準日 / 除息日 / 發放日 / 狀態 / 每單位分配金額 / 年化配息率%
// 回傳 { yield: '9.17', yieldAsOf: '2026/09/30' }；不配息（累積型）或抓不到 → {}
function parseYield_(html) {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
  const i = text.indexOf('年化配息率');
  if (i < 0) return {};
  const D = '(\\d{4}\\/\\d{2}\\/\\d{2})';
  const m = text.slice(i).match(new RegExp(D + ' \\S+ \\S+ \\S+ (\\d+\\.\\d+) (\\d+\\.\\d+)'));
  if (!m) return {};
  return { yield: m[3], yieldAsOf: m[1] };
}

// wb06 tooltip：data="<序列名> 2025/10/29 = 0.00 %"。圖上有 3 條（本基金 / 同類平均 / 指數），
// 本基金為第一條 → 只取與第一筆同名的點。回傳 [[ 'YYYY/MM/DD', cumPct(number) ], ...]
function parseWb06_(js) {
  const re = /data="(.*?) (\d{4}\/\d{2}\/\d{2}) = (-?\d+(?:\.\d+)?) %"/g;
  const pts = [];
  let name = null, m;
  while ((m = re.exec(js)) !== null) {
    if (name === null) name = m[1];
    if (m[1] === name) pts.push([m[2], parseFloat(m[3])]);
  }
  return pts;
}

// 最大回撤（%，負值）：財富指數 W=1+c/100 的 min(W/peak - 1)。
function maxDrawdown_(pts) {
  let peak = -Infinity, dd = 0;
  for (const p of pts) {
    const w = 1 + p[1] / 100;
    if (w > peak) peak = w;
    dd = Math.min(dd, w / peak - 1);
  }
  return (dd * 100).toFixed(2);
}

// getCompare 的新增欄位：yield、yieldAsOf（wb05）、maxdd（wb06 近一年含息序列）
function fetchCompareExtras_(codes) {
  const out = {};
  if (!codes.length) return out;
  let bodies;
  try {
    bodies = mdjFetchAll_(codes.map(wb05Url_).concat(codes.map(wb06Url_)));
  } catch (err) {
    return out;   // 新增欄位失敗不影響既有欄位
  }
  codes.forEach((code, i) => {
    const x = {};
    try { Object.assign(x, parseYield_(bodies[i])); } catch (e) {}
    try {
      const pts = parseWb06_(bodies[codes.length + i]);
      if (pts.length >= 2) x.maxdd = maxDrawdown_(pts);
    } catch (e) {}
    out[code] = x;
  });
  return out;
}

// action=getSeries&codes=PLB04,PIM41
// → { PLB04: { asOf: '2026/10/29', points: [['2025/10/29', 0], ...] }, ... }
// 照 MoneyDJ 原樣：wb06 含息累積報酬（%），固定近一年全段，不截取區間。
function getSeries(codesParam) {
  const codes = codesParam
    ? codesParam.split(',').map(s => s.trim()).filter(Boolean)
    : getFunds().map(f => f.code);
  const out = {};
  if (!codes.length) return out;
  const bodies = mdjFetchAll_(codes.map(wb06Url_));
  codes.forEach((code, i) => {
    try {
      const pts = parseWb06_(bodies[i]);
      out[code] = pts.length
        ? { asOf: pts[pts.length - 1][0], points: pts }
        : { error: 'no series' };
    } catch (err) {
      out[code] = { error: err.toString() };
    }
  });
  return out;
}

// 讀「funds」分頁，回傳「上架」的基金清單（供前端下拉選單 + getCompare 預設清單）。
function getFunds() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('funds');
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  const out = [];
  for (let i = 1; i < rows.length; i++) {
    const type = rows[i][0], house = rows[i][1], name = rows[i][2];
    const cls = rows[i][3], code = rows[i][4], listed = rows[i][5];
    if (!code) continue;
    const on = listed === true || ['TRUE', 'V', '✔', '是', '1'].indexOf(String(listed).trim().toUpperCase()) >= 0;
    if (!on) continue;
    out.push({ type, house, name, shareClass: cls, code: String(code).trim() });
  }
  return out;
}

// 一次性：建立「funds」分頁，供客戶與 PIC 每月共同維護（上架/下架基金）。
// 只在分頁不存在或空白時寫入表頭+種子，不覆蓋既有維護內容。
function setupFundSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName('funds');
  if (!sheet) sheet = ss.insertSheet('funds');
  if (sheet.getLastRow() > 0) return '已存在 funds 分頁（' + sheet.getLastRow() + ' 列），未覆蓋。';
  const headers = ['類型', '基金公司', '基金名稱', '級別', 'MoneyDJ代碼', '上架'];
  const rows = [
    ['自品', '霸菱', '霸菱優先順位資產抵押債券基金', 'G類美元月配息型', 'PLB04', true],
    ['自品', '霸菱', '霸菱優先順位資產抵押債券基金', 'BM類美元月配息型', 'PLB22', true],
    ['自品', '霸菱', '霸菱成熟及新興市場高收益債券基金', 'A類美元月配息型', 'PLZ45', true],
    ['自品', '霸菱', '霸菱成熟及新興市場高收益債券基金', 'A類美元配息型(季配)', 'PLZ15', true],
    ['競品', 'PIMCO', 'PIMCO多元收益債券基金', 'M級類別(月收息)', 'PIM41', true],
    ['競品', '高盛', '高盛投資級公司債基金', 'X股美元(月配息)', 'ANZ91', true],
    ['競品', '聯博', '聯博全球非投資等級債券基金', 'A2級別美元', 'alz45', true],
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
  sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);
  return '已建立 funds 分頁，' + rows.length + ' 檔種子。';
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}