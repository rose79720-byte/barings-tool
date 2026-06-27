// ============================================================
// 銀行基金資訊表 素材模組
// 版型尚未完成；完成後將 CSS / HTML 填入，並更新 manifest.json
// ============================================================

export const CSS = `
/* 版型 CSS 待補 */
`;

export const HTML = `
        <div id="poster-wip" style="display:none;">
          <div class="wip-icon">🏗️</div>
          <div class="wip-title">版型設計中</div>
          <div class="wip-sub">銀行基金資訊表</div>
          <div class="wip-badge">敬請期待</div>
        </div>

        <!-- =====================================================
             整合說明：
             當新 chat 完成 poster-fubon HTML 後，
             把內容貼進下方 div，並把 MATERIALS.bankTable.templates
             裡 fubon 的 available 改成 true 即可。
             台新同理。
             ===================================================== -->
  <div id="poster-fubon"  style="display:none;width:1024px;height:1024px;position:relative;overflow:hidden;flex-shrink:0;">
    <!-- 貼入 poster HTML 於此 -->
  </div>
  <div id="poster-tashin" style="display:none;width:1024px;height:1024px;position:relative;overflow:hidden;flex-shrink:0;">
    <!-- 貼入 poster HTML 於此 -->
  </div>
`;

// ============================================================
// 配息基準日行事曆 2026
// ============================================================
const DIV_DATES_2026 = [
  { m:5,  d:29, wd:'五' },
  { m:6,  d:30, wd:'二' },
  { m:7,  d:31, wd:'五' },
  { m:8,  d:28, wd:'五' },
  { m:9,  d:30, wd:'三' },
  { m:10, d:30, wd:'五' },
  { m:11, d:30, wd:'一' },
  { m:12, d:31, wd:'四' },
];

function _futureDivDates() {
  const today = new Date(); today.setHours(0,0,0,0);
  return DIV_DATES_2026.filter(({ m, d }) => new Date(2026, m-1, d) >= today);
}

function _formatDivDates() {
  const dates = _futureDivDates();
  if (!dates.length) return '（本年度已無配息基準日）';
  const items = dates.map(({ m, d, wd }) => `${m}/${d}(${wd})`);
  const line1 = items.slice(0,4).join('・');
  const line2 = items.slice(4).join('・');
  return line2 ? `　　${line1}\n　　${line2}` : `　　${line1}`;
}

function _nextDivDate() {
  const next = _futureDivDates()[0];
  return next ? `2026/${next.m}/${next.d}` : '—';
}

// ============================================================
// 渲染表單欄位
// ============================================================
const RATE_DEFS = {
  '富邦': {
    fund1: {
      title: '環球非投資等級債券基金',
      rows: [
        { code:'AY03', label:'BM・美元月配息',     id:'bankR_AY03', def:'11.3' },
        { code:'AY04', label:'BM・澳幣避險月配',   id:'bankR_AY04', def:'12.0' },
        { code:'BQ07', label:'G類・美元月配息',    id:'bankR_BQ07', def:'9.4'  },
        { code:'BQ09', label:'G類・澳幣避險月配', id:'bankR_BQ09', def:'10.6' },
        { code:'BQ11', label:'G類・歐元避險月配', id:'bankR_BQ11', def:'7.4'  },
      ],
    },
    fund2: {
      title: '優先順位資產抵押債券基金',
      rows: [
        { code:'AY01', label:'BM・美元月配息',     id:'bankR_AY01', def:'10.5' },
        { code:'AY02', label:'BM・澳幣避險月配',   id:'bankR_AY02', def:'11.2' },
        { code:'BQ02', label:'G類・美元月配息',    id:'bankR_BQ02', def:'8.8'  },
        { code:'BQ04', label:'G類・歐元避險月配', id:'bankR_BQ04', def:'6.9'  },
        { code:'BQ06', label:'G類・澳幣避險月配', id:'bankR_BQ06', def:'9.9'  },
      ],
    },
  },
  '台新': { fund1: { title:'（台新欄位待確認）', rows:[] }, fund2: { title:'', rows:[] } },
};

function _rateRows(rows) {
  return rows.map(r => `
    <div class="rate-row">
      <span class="rate-code">${r.code}</span>
      <span class="rate-label">${r.label}</span>
      <input class="rate-input" id="${r.id}" value="${r.def}"
        oninput="onChannelChange(document.getElementById('inChannel').value)" type="text">
      <span class="rate-pct">%</span>
    </div>`).join('');
}

export function renderFields(container) {
  const ch  = '富邦';
  const def = RATE_DEFS[ch];
  container.innerHTML = `
    <div class="data-card">
      <div class="data-row">
        <span class="data-label">銷售通路</span>
        <select class="data-input" id="inChannel" style="width:100px;cursor:pointer"
          onchange="onChannelChange(this.value)">
          <option>富邦</option><option>台新</option>
        </select>
      </div>
      <div class="rate-subhead">📊 ${def.fund1.title}</div>
      ${_rateRows(def.fund1.rows)}
      <div class="rate-subhead">📊 ${def.fund2.title}</div>
      ${_rateRows(def.fund2.rows)}
      <div class="data-row" style="padding:8px 0">
        <span style="color:#9ca3af;font-size:11px">
          💡 每月查詢最新費率後填入，海報即時更新
        </span>
      </div>
    </div>`;
  document.getElementById('secFields').textContent = '③ 費率填寫（每月更新）';
}

// ============================================================
// 渲染 LINE 罐頭文字區
// ============================================================
export function renderMsg(container) {
  container.innerHTML = `
    <div class="sec-title">⑤ LINE 罐頭文字</div>
    <div class="msg-box" id="msgBox"></div>
    <div class="btn-row">
      <button class="btn btn-copy" onclick="copyMsg()">📋 複製文字</button>
    </div>`;
}

// ============================================================
// 通路切換：更新費率欄位 + 海報 + LINE 文字
// ============================================================
export async function onChannelChange(channel, SCRIPT) {
  const tplKey = { '富邦':'fubon', '台新':'tashin' }[channel] || 'wip';
  showPoster(tplKey);
  _updateBankMsg(channel);
  await _fetchBankRates(channel, SCRIPT);
}

// ============================================================
// fetchData（bankTable 不自動 fetch，由 onChannelChange 驅動）
// ============================================================
export async function fetchData(SCRIPT) {
  await onChannelChange('富邦', SCRIPT);
}

// ============================================================
// update（從費率輸入欄同步到海報 span）
// ============================================================
export function update() {
  const channel = document.getElementById('inChannel')?.value || '富邦';
  _updateBankPoster(channel);
}

const BANK_CODE_MAP = {
  '富邦': { prefix:'f', codes:['AY01','AY02','AY03','AY04','BQ02','BQ04','BQ06','BQ07','BQ09','BQ11'] },
  '台新': { prefix:'t', codes:[] },
};

function _updateBankPoster(channel) {
  const map = BANK_CODE_MAP[channel];
  if (!map) return;
  map.codes.forEach(code => {
    const inputEl = document.getElementById(`bankR_${code}`);
    const spanEl  = document.getElementById(`${map.prefix}R_${code}`);
    if (inputEl && spanEl) spanEl.textContent = inputEl.value;
  });
  const datesEl = document.getElementById(`${map.prefix}DivDates`);
  if (datesEl) datesEl.textContent = _futureDivDates().map(({ m,d,wd }) => `${m}/${d}(${wd})`).join('・');
}

async function _fetchBankRates(channel, SCRIPT) {
  if (!SCRIPT) return;
  try {
    const r = await fetch(SCRIPT + '?action=getBankRates');
    const d = await r.json();
    if (!d.rates) throw new Error('no rates');
    Object.entries(d.rates).forEach(([code, val]) => {
      const el = document.getElementById(`bankR_${code}`);
      if (el) el.value = val;
    });
    const asOfLabel = d.asOf ? `（資料：${d.asOf}）` : '';
    document.getElementById('secFields').textContent = `③ 費率填寫（每月更新）${asOfLabel}`;
    _updateBankPoster(channel);
  } catch(e) {
    _updateBankPoster(channel);
  }
}

function _updateBankMsg(channel) {
  const mb = document.getElementById('msgBox');
  if (mb) mb.textContent = _buildBankMsg(channel);
}

function _buildBankMsg(channel) {
  if (channel === '富邦') {
    return `【霸菱基金 × 富邦銀行 優選推薦】

📊 霸菱環球非投資等級債券基金
　　富邦核心層次・收益型
　　後收 BM類美元月配息（AY03）　　　年化約 11.3%
　　後收 BM類澳幣避險月配息（AY04）　年化約 12.0%
　　前收 G類美元月配息（BQ07）　　　　年化約  9.4%
　　前收 G類澳幣避險月配息（BQ09）　　年化約 10.6%
　　前收 G類歐元避險月配息（BQ11）　　年化約  7.4%

📊 霸菱優先順位資產抵押債券基金
　　後收 BM類美元月配息（AY01）　　　年化約 10.5%
　　後收 BM類澳幣避險月配息（AY02）　年化約 11.2%
　　前收 G類美元月配息（BQ02）　　　　年化約  8.8%
　　前收 G類歐元避險月配息（BQ04）　　年化約  6.9%
　　前收 G類澳幣避險月配息（BQ06）　　年化約  9.9%

📅 2026 配息基準日
${_formatDivDates()}

詳情請見附圖 ⬇️

＊本資料僅供參考，兩檔基金每月配息將有所浮動
　年化配息數值截至 2026 年 4 月資訊`;
  }
  if (channel === '台新') {
    return `【霸菱基金 × 台新銀行 2026 Q2 精選】

⭐ 霸菱環球非投資等級債券基金（★★★★★）
　　到期殖利率 7.3%｜存續期 2.6年｜平均信評 BB-
　　46% 優先擔保，債券＋非投資等級值，美國・歐洲為主
　　績效：1年 +7.6%・3年 +32.4%・5年 +28.1%

⭐ 霸菱優先順位資產抵押債券基金（★★★★）
　　到期殖利率 7.1%｜存續期 2.5年｜平均信評 BB-
　　100% 優先擔保債券，美國・歐洲為主
　　績效：1年 +6.2%・3年 +27.6%・5年 +23.8%

📅 下次配息基準日：${_nextDivDate()}

詳情請見附圖 ⬇️

＊績效截至 2026/2/28，年化配息截至 2026.02
　實際配息金額以公告為準`;
  }
  return '';
}

// ============================================================
// 顯示 / 隱藏海報
// ============================================================
export function showPoster(tplKey) {
  ['poster-wip','poster-fubon','poster-tashin'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  const map = { fubon:'poster-fubon', tashin:'poster-tashin' };
  const targetId = map[tplKey] || 'poster-wip';
  const el = document.getElementById(targetId);
  if (el && el.children.length > 0) {
    el.style.display = '';
    _updateBankPoster(tplKey === 'fubon' ? '富邦' : '台新');
  } else {
    document.getElementById('poster-wip').style.display = 'flex';
  }
}

// ============================================================
// html2canvas 修正（目前版型 WIP，暫無需處理）
// ============================================================
export function onDownloadClone(doc, tplKey) {}

export function getDownloadFileName(state) {
  return `霸菱銀行基金資訊表.jpg`;
}

export function getActivePosterEl(tplKey) {
  if (tplKey === 'fubon')  return document.getElementById('poster-fubon');
  if (tplKey === 'tashin') return document.getElementById('poster-tashin');
  return document.getElementById('poster-wip');
}
