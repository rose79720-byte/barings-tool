// ============================================================
// 競品比較圖 素材模組（階段一：殼 + mock 資料）
//
// 這支模組沿用現有素材契約（CSS / HTML / renderFields / renderMsg /
// update / showPoster / getActivePosterEl / getDownloadFileName /
// onDownloadClone）。資料目前全為 mock，數字取自 pitch 範例圖。
//
// 之後 Task 5 會把 ChatGPT 產的正式比較圖 HTML/CSS 換進 export const
// HTML / CSS，update() 的資料綁定邏輯可大致沿用。
// ============================================================

// 種子基金主檔（registry）。module import 時即載入（top-level await），
// 確保 renderFields 執行前 REGISTRY 已就緒。
const REGISTRY = await fetch('./data/funds.json')
  .then(r => r.json())
  .then(d => d.funds)
  .catch(() => []);

// ------------------------------------------------------------
// 比較維度定義（對應 pitch 圖的列）
// ------------------------------------------------------------
const CORE_DIMS = [
  { key: 'target',    label: '投資標的',  sub: '' },
  { key: 'vol',       label: '波動度',    sub: '年化標準差' },
  { key: 'rate_sens', label: '利率敏感度', sub: '' },
  { key: 'credit',    label: '信用品質',  sub: '平均信評' },
  { key: 'yield',     label: '收益率',    sub: '殖利率' },
  { key: 'maxdd',     label: '最大回撤',  sub: '過去 3 年' },
  { key: 'duration',  label: '存續期間',  sub: '' },
  { key: 'features',  label: '投資特色',  sub: '' },
];
const RET_DIMS = [
  { key: 'custom', label: '自訂區間／今年以來', sub: 'YTD' },
  { key: 'y1',     label: '近一年',           sub: '' },
  { key: 'y2',     label: '近兩年',           sub: '年化' },
  { key: 'y3',     label: '近三年',           sub: '年化' },
];
const ALL_DIMS = [...CORE_DIMS, ...RET_DIMS];

// ------------------------------------------------------------
// mock 數據（取自 pitch 範例圖）。key = registry 的 fund_id。
// 真實串接前，未列出的基金以 '—' 顯示（業務可手動填）。
// ------------------------------------------------------------
const MOCK = {
  barings_plb04: {
    target: '有擔保、清償順位高（優先順位資產抵押債券／貸款）',
    vol: '2.02%', rate_sens: '低（浮動利率為主）', credit: 'BBB-',
    yield: '6.35%', maxdd: '-4.12%', duration: '2.50 年',
    features: ['浮動利率為主，抗利率風險佳', '優先順位，有擔保，清償順位高', '收益穩定，波動度低'],
    custom: '2.81%', y1: '7.24%', y2: '8.67%', y3: '7.98%',
  },
  pimco_diversified_income_pim41: {
    target: '全球多元債（投資級、高收益、新興市場債）',
    vol: '4.88%', rate_sens: '中高（含長天期債）', credit: 'BB+',
    yield: '5.20%', maxdd: '-10.35%', duration: '5.25 年',
    features: ['全球多元配置，追求更高收益', '靈活操作，橫跨市場機會', '資本利得機會較高'],
    custom: '-0.23%', y1: '5.12%', y2: '6.21%', y3: '5.34%',
  },
  gs_us_dollar_credit_anz91: {
    target: '全球投資等級公司債（高信評為主）',
    vol: '3.25%', rate_sens: '中（中天期為主）', credit: 'A-',
    yield: '4.15%', maxdd: '-6.21%', duration: '6.65 年',
    features: ['投資等級信用品質佳', '收益相對穩定', '利率風險高於霸菱'],
    custom: '-1.12%', y1: '3.85%', y2: '4.92%', y3: '4.35%',
  },
};
const EMPTY_FUND = { features: [] };

// ------------------------------------------------------------
// 價值主張範本（hardcode，先不串 AI）
// ------------------------------------------------------------
const VALUE_PROPS = [
  '穩定度 · 抗波動 · 利率風險，三檔債券基金一次看懂',
  '低波動、低回撤，攻守兼備的核心配置',
  '優先順位有擔保，清償順位高，收益穩定度佳',
  '浮動利率為主，利率敏感度低，適合升息環境',
  '同類型中波動最低，風險調整後報酬突出',
];

// ------------------------------------------------------------
// 模組狀態
// ------------------------------------------------------------
const S = {
  lead: null,        // 主打 fund_id
  comp1: null,       // 競品 1 fund_id
  comp2: null,       // 競品 2 fund_id
  mode: '1v1v1',     // '1v1' | '1v1v1'
  showAllCat: false, // 放寬同類別限制
  dims: Object.fromEntries(ALL_DIMS.map(d => [d.key, true])), // 預設全勾
  valueProp: VALUE_PROPS[0],
  crown: false,      // 皇冠／徽章（合規預設關）
};

// ============================================================
// 海報 CSS（含控制區樣式）
// ============================================================
export const CSS = `
/* ---- 控制區（競品比較專屬）---- */
.cmp-mode-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}
.cmp-mode-btn{padding:10px;border-radius:10px;border:2px solid #e5e7eb;background:#fff;font-weight:700;font-size:13px;color:#6b7280;cursor:pointer;font-family:'Noto Sans TC',sans-serif;transition:all .15s}
.cmp-mode-btn.active{background:#1a2a52;color:#e8c275;border-color:#1a2a52}
.cmp-select{width:100%;border:1.5px solid #d1d5db;border-radius:8px;padding:8px 10px;font-size:13px;font-weight:600;color:#1a2a52;font-family:'Noto Sans TC',sans-serif;outline:none;background:#fff}
.cmp-select:focus{border-color:#1a2a52}
.cmp-field{margin-bottom:12px}
.cmp-field>label{display:block;font-size:12px;color:#6b7280;font-weight:700;margin-bottom:5px}
.cmp-lead label{color:#a17536}
.cmp-checkrow{display:flex;align-items:center;gap:7px;padding:5px 0;font-size:13px;color:#374151}
.cmp-checkrow input{width:16px;height:16px;accent-color:#1a2a52}
.cmp-dim-group{font-size:11px;font-weight:700;color:#1a2a52;letter-spacing:1px;margin:10px 0 2px;border-left:3px solid #e8c275;padding-left:8px}
.cmp-toggle{display:flex;align-items:center;justify-content:space-between;background:#f8f9ff;border:1px solid #e0e7ff;border-radius:10px;padding:10px 12px;margin-bottom:12px}
.cmp-toggle .lbl{font-size:13px;font-weight:700;color:#1a2a52}
.cmp-toggle .hint{font-size:10px;color:#9ca3af}
.cmp-switch{position:relative;width:42px;height:24px;flex-shrink:0}
.cmp-switch input{opacity:0;width:0;height:0}
.cmp-switch .slider{position:absolute;inset:0;background:#cbd5e1;border-radius:24px;transition:.2s;cursor:pointer}
.cmp-switch .slider:before{content:'';position:absolute;width:18px;height:18px;left:3px;top:3px;background:#fff;border-radius:50%;transition:.2s}
.cmp-switch input:checked+.slider{background:#1a2a52}
.cmp-switch input:checked+.slider:before{transform:translateX(18px)}
.cmp-warn{font-size:11px;color:#b45309;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:6px 9px;margin-top:6px}

/* ---- 比較圖海報（placeholder 版型，待換 ChatGPT HTML）---- */
#poster-compare{width:1024px;height:1024px;background:#fbfaf7;position:relative;overflow:hidden;flex-shrink:0;font-family:'Noto Sans TC',sans-serif;display:flex;flex-direction:column;padding:46px 46px 30px}
.cmp-brandbar{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px}
.cmp-brand{font-family:'Cormorant Garamond',serif;font-size:34px;font-weight:700;letter-spacing:4px;color:#1a2a52;border-bottom:3px solid #1a7a4a;padding-bottom:2px}
.cmp-asof{font-size:12px;color:#6b7280;border:1px solid #e5e7eb;border-radius:8px;padding:5px 10px}
.cmp-headline{font-family:'Noto Serif TC',serif;font-size:34px;font-weight:900;color:#1a2a52;letter-spacing:1px;line-height:1.25;margin-bottom:16px}
.cmp-grid{flex:1;display:grid;gap:0;align-content:start}
.cmp-trow{display:grid;align-items:stretch;border-bottom:1px solid #eee}
.cmp-trow .cell{padding:9px 10px;font-size:14px;color:#1a2a52;display:flex;flex-direction:column;justify-content:center}
.cmp-trow .dim{color:#374151}
.cmp-trow .dim b{font-size:14px;font-weight:700;color:#1a2a52}
.cmp-trow .dim span{font-size:10px;color:#9ca3af}
.cmp-trow .val{text-align:center;align-items:center;font-weight:700;font-size:18px}
.cmp-trow .val.txt{font-size:12px;font-weight:500;line-height:1.35;color:#374151}
.cmp-trow .val ul{list-style:none;text-align:left;font-size:11px;font-weight:500;color:#374151;line-height:1.5}
.cmp-trow .val ul li:before{content:'• ';color:#e8c275}
.cmp-headrow{border-bottom:2px solid #1a2a52}
.cmp-headrow .cell{font-weight:900;font-size:15px;text-align:center;align-items:center;padding:12px 8px;line-height:1.3}
.cmp-headrow .fund-house{font-size:11px;font-weight:600;color:#6b7280;margin-top:2px}
.cmp-lead-col{background:#fff9ec}
.cmp-lead-col.cmp-headrow-lead{box-shadow:inset 0 0 0 2px #e8c275}
.cmp-crown{font-size:20px;margin-bottom:2px}
.cmp-section-label{font-size:12px;font-weight:700;color:#1a7a4a;letter-spacing:1px;margin:14px 0 4px;padding-left:2px}
.cmp-vp{background:#1a2a52;color:#fff;border-radius:12px;padding:12px 16px;margin:14px 0 8px;font-size:15px;font-weight:700;letter-spacing:.5px}
.cmp-foot{font-size:10px;color:#9ca3af;line-height:1.5;border-top:1px solid #eee;padding-top:8px;margin-top:auto}
.cmp-edit{outline:none}
.cmp-edit:focus{background:#fffbe6;border-radius:4px}
`;

// ============================================================
// 海報 HTML（骨架，內容由 update() 動態生成）
// ============================================================
export const HTML = `
<div id="poster-compare">
  <div class="cmp-brandbar">
    <div class="cmp-brand">BARINGS</div>
    <div class="cmp-asof" contenteditable="true">數據更新至：2026/04/21</div>
  </div>
  <div class="cmp-headline cmp-edit" id="cmpHeadline" contenteditable="true"></div>
  <div class="cmp-grid" id="cmpCore"></div>
  <div class="cmp-vp cmp-edit" id="cmpVP" contenteditable="true"></div>
  <div class="cmp-section-label">報酬率表現比較</div>
  <div class="cmp-grid" id="cmpRet"></div>
  <div class="cmp-foot" id="cmpFoot" contenteditable="true">
    資料來源：MoneyDJ／各基金公司官網（部分維度為人工 curate）　|　計算基準：美元計價<br>
    波動度、最大回撤為過去 3 年資料，報酬率已含息。基金過去績效不代表未來表現，投資人申購前應詳閱公開說明書。
  </div>
</div>`;

// ============================================================
// 工具：依目前 mode 取得參與比較的 fund_id 陣列
// ============================================================
function activeFunds() {
  const ids = [S.lead, S.comp1];
  if (S.mode === '1v1v1') ids.push(S.comp2);
  return ids.filter(Boolean);
}

function fundById(id) {
  return REGISTRY.find(f => f.fund_id === id) || null;
}

// 與主打同類別（且非主打本身）的基金清單；showAllCat 時放寬為全部
function competitorPool() {
  const lead = fundById(S.lead);
  return REGISTRY.filter(f => {
    if (f.fund_id === S.lead) return false;
    if (S.showAllCat) return true;
    return lead && f.category === lead.category;
  });
}

// ============================================================
// 渲染左側控制區
// ============================================================
// ② 選擇比較模式（1v1 / 1v1v1）— 由 index.html 呼叫
export const STEP2_TITLE = '選擇比較模式';
export function renderStep2(grid) {
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:10px';
  [{ key:'1v1', big:'1 vs 1', sub:'一對一比較' },
   { key:'1v1v1', big:'1 vs 1 vs 1', sub:'一對二比較' }].forEach(m => {
    row.appendChild(window.step2BigButton({
      label: m.big, sub: m.sub, active: S.mode === m.key,
      onclick: () => {
        S.mode = m.key;
        const g = document.getElementById('tplGrid'); g.innerHTML = ''; renderStep2(g);
        renderFields(document.getElementById('fieldsContainer'));
      },
    }));
  });
  grid.appendChild(row);
}

export function renderFields(container) {
  // 預設值：主打 = 第一檔霸菱；競品 = 前兩檔同類別競品
  if (!S.lead) {
    const firstBarings = REGISTRY.find(f => f.is_barings);
    S.lead = firstBarings ? firstBarings.fund_id : (REGISTRY[0]?.fund_id || null);
  }
  const pool = competitorPool();
  if (!S.comp1) S.comp1 = pool.find(f => !f.is_barings)?.fund_id || pool[0]?.fund_id || null;
  if (!S.comp2) S.comp2 = pool.find(f => f.fund_id !== S.comp1 && !f.is_barings)?.fund_id
                          || pool.find(f => f.fund_id !== S.comp1)?.fund_id || null;

  container.innerHTML = `
    <div class="data-card">
      <div class="cmp-field cmp-lead">
        <label>★ 主打基金（霸菱）</label>
        <select class="cmp-select" id="cmpLead"></select>
      </div>

      <div class="cmp-field">
        <label>競品 1</label>
        <select class="cmp-select" id="cmpComp1"></select>
      </div>
      <div class="cmp-field" id="cmpComp2Wrap">
        <label>競品 2</label>
        <select class="cmp-select" id="cmpComp2"></select>
      </div>

      <label class="cmp-checkrow" style="margin-bottom:4px">
        <input type="checkbox" id="cmpAllCat"> 顯示全部分類（跨類別比較）
      </label>
      <div class="cmp-warn" id="cmpCatWarn" style="display:none">⚠️ 跨類別比較，需法遵確認</div>
    </div>

    <div class="data-card">
      <div class="cmp-dim-group">核心數據比較</div>
      <div id="cmpCoreChecks"></div>
      <div class="cmp-dim-group">報酬率表現比較</div>
      <div id="cmpRetChecks"></div>
      <div class="cmp-warn" style="margin-top:8px">＊「自訂區間」起算點需法遵確認，預設採今年以來（YTD）中性區間</div>
    </div>

    <div class="data-card">
      <div class="cmp-field">
        <label>價值主張（範本，可自行編輯）</label>
        <select class="cmp-select" id="cmpVPSelect"></select>
        <input class="data-input" id="cmpVPText" style="width:100%;text-align:left;margin-top:8px"
          placeholder="或自行輸入價值主張…">
      </div>
      <div class="cmp-toggle">
        <div>
          <div class="lbl">皇冠／徽章標記</div>
          <div class="hint">合規考量，預設關閉</div>
        </div>
        <label class="cmp-switch">
          <input type="checkbox" id="cmpCrown">
          <span class="slider"></span>
        </label>
      </div>
    </div>`;

  // 維度 checkbox
  const coreWrap = container.querySelector('#cmpCoreChecks');
  const retWrap = container.querySelector('#cmpRetChecks');
  const mkCheck = (d) => {
    const lab = document.createElement('label');
    lab.className = 'cmp-checkrow';
    lab.innerHTML = `<input type="checkbox" data-dim="${d.key}" ${S.dims[d.key] ? 'checked' : ''}> `
      + d.label + (d.sub ? `（${d.sub}）` : '');
    return lab;
  };
  CORE_DIMS.forEach(d => coreWrap.appendChild(mkCheck(d)));
  RET_DIMS.forEach(d => retWrap.appendChild(mkCheck(d)));

  // 價值主張下拉
  const vpSel = container.querySelector('#cmpVPSelect');
  VALUE_PROPS.forEach(v => {
    const o = document.createElement('option');
    o.value = v; o.textContent = v.length > 22 ? v.slice(0, 22) + '…' : v;
    vpSel.appendChild(o);
  });

  // 初始 UI 狀態
  container.querySelectorAll('.cmp-mode-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.mode === S.mode));
  container.querySelector('#cmpAllCat').checked = S.showAllCat;
  container.querySelector('#cmpCrown').checked = S.crown;
  vpSel.value = S.valueProp;

  _refreshSelects(container);
  _wireEvents(container);
  _applyModeUI(container);

  document.getElementById('secFields').textContent = '③ 比較設定（數字可手動修改）';

  update();
}

// ============================================================
// 「取得資料」：本素材無需連網（mock 資料），僅重繪海報。
// 透過 autoFetch 路徑讓 index.html 啟用「下載 JPG」按鈕。
// ============================================================
export async function fetchData(_SCRIPT) {
  update();
}

// 重新填充三個下拉（排除已被選的基金，避免重複）
function _refreshSelects(root) {
  const c = root || document;
  const leadSel = c.querySelector('#cmpLead');
  const c1 = c.querySelector('#cmpComp1');
  const c2 = c.querySelector('#cmpComp2');
  if (!leadSel) return;

  const fill = (sel, list, current) => {
    sel.innerHTML = '';
    list.forEach(f => {
      const o = document.createElement('option');
      o.value = f.fund_id;
      o.textContent = f.display_name_zh + (f.share_class_zh ? `（${f.share_class_zh}）` : '');
      if (f.fund_id === current) o.selected = true;
      sel.appendChild(o);
    });
  };

  fill(leadSel, REGISTRY.filter(f => f.is_barings), S.lead);
  const pool = competitorPool();
  fill(c1, pool.filter(f => f.fund_id !== S.comp2), S.comp1);
  fill(c2, pool.filter(f => f.fund_id !== S.comp1), S.comp2);
}

function _applyModeUI(root) {
  const wrap = (root || document).querySelector('#cmpComp2Wrap');
  if (wrap) wrap.style.display = S.mode === '1v1v1' ? '' : 'none';
}

function _wireEvents(root) {
  const c = root;
  c.querySelector('#cmpLead').addEventListener('change', e => {
    S.lead = e.target.value;
    // 主打改變後，競品若與主打同檔或脫離類別則重設
    const pool = competitorPool();
    if (!pool.find(f => f.fund_id === S.comp1)) S.comp1 = pool[0]?.fund_id || null;
    if (!pool.find(f => f.fund_id === S.comp2) || S.comp2 === S.comp1)
      S.comp2 = pool.find(f => f.fund_id !== S.comp1)?.fund_id || null;
    _refreshSelects(c); update();
  });
  c.querySelector('#cmpComp1').addEventListener('change', e => {
    S.comp1 = e.target.value;
    if (S.comp2 === S.comp1)
      S.comp2 = competitorPool().find(f => f.fund_id !== S.comp1)?.fund_id || null;
    _refreshSelects(c); update();
  });
  c.querySelector('#cmpComp2').addEventListener('change', e => {
    S.comp2 = e.target.value; _refreshSelects(c); update();
  });
  c.querySelectorAll('.cmp-mode-btn').forEach(b =>
    b.addEventListener('click', () => {
      S.mode = b.dataset.mode;
      c.querySelectorAll('.cmp-mode-btn').forEach(x =>
        x.classList.toggle('active', x.dataset.mode === S.mode));
      _applyModeUI(c); update();
    }));
  c.querySelector('#cmpAllCat').addEventListener('change', e => {
    S.showAllCat = e.target.checked;
    c.querySelector('#cmpCatWarn').style.display = e.target.checked ? '' : 'none';
    _refreshSelects(c); update();
  });
  c.querySelectorAll('input[data-dim]').forEach(cb =>
    cb.addEventListener('change', () => { S.dims[cb.dataset.dim] = cb.checked; update(); }));
  c.querySelector('#cmpVPSelect').addEventListener('change', e => {
    S.valueProp = e.target.value;
    c.querySelector('#cmpVPText').value = '';
    update();
  });
  c.querySelector('#cmpVPText').addEventListener('input', e => {
    S.valueProp = e.target.value.trim() || c.querySelector('#cmpVPSelect').value;
    update();
  });
  c.querySelector('#cmpCrown').addEventListener('change', e => {
    S.crown = e.target.checked; update();
  });
}

// ============================================================
// LINE 罐頭文字
// ============================================================
export function renderMsg(container) {
  container.innerHTML = `
    <div class="sec-title">⑤ LINE 罐頭文字</div>
    <div class="msg-box" id="msgBox">…</div>
    <div class="btn-row">
      <button class="btn btn-copy" onclick="copyMsg()">📋 複製文字</button>
    </div>`;
}

// ============================================================
// 更新海報內容
// ============================================================
export function update() {
  const funds = activeFunds().map(fundById).filter(Boolean);
  const n = funds.length;
  if (!n) return;

  const colTmpl = `minmax(150px, 1.1fr) ` + `repeat(${n}, 1fr)`;
  const dataOf = (f) => MOCK[f.fund_id] || EMPTY_FUND;
  const v = (f, key) => {
    const d = dataOf(f);
    if (key === 'features') return Array.isArray(d.features) ? d.features : [];
    return d[key] != null ? d[key] : '—';
  };

  // headline
  const head = document.getElementById('cmpHeadline');
  if (head && document.activeElement !== head) head.textContent = S.valueProp;

  // value prop bar
  const vp = document.getElementById('cmpVP');
  if (vp && document.activeElement !== vp) vp.textContent = '💡 ' + S.valueProp;

  // 表頭列
  const headerRow = (idPrefix) => {
    let h = `<div class="cmp-trow cmp-headrow" style="grid-template-columns:${colTmpl}">`;
    h += `<div class="cell"></div>`;
    funds.forEach((f, i) => {
      const isLead = f.fund_id === S.lead;
      h += `<div class="cell ${isLead ? 'cmp-lead-col cmp-headrow-lead' : ''}">`
        + (isLead && S.crown ? `<div class="cmp-crown">👑</div>` : '')
        + `<div>${f.display_name_zh}</div>`
        + `<div class="fund-house">${f.fund_house}</div></div>`;
    });
    return h + `</div>`;
  };

  // 一般資料列
  const dataRow = (dim) => {
    if (!S.dims[dim.key]) return '';
    let h = `<div class="cmp-trow" style="grid-template-columns:${colTmpl}">`;
    h += `<div class="cell dim"><b>${dim.label}</b>${dim.sub ? `<span>${dim.sub}</span>` : ''}</div>`;
    funds.forEach(f => {
      const isLead = f.fund_id === S.lead;
      const leadCls = isLead ? 'cmp-lead-col' : '';
      if (dim.key === 'features') {
        const items = v(f, 'features');
        h += `<div class="cell val ${leadCls}"><ul contenteditable="true" class="cmp-edit">`
          + (items.length ? items.map(x => `<li>${x}</li>`).join('') : '<li>—</li>')
          + `</ul></div>`;
      } else {
        const txtCls = (dim.key === 'target' || dim.key === 'rate_sens') ? 'txt' : '';
        h += `<div class="cell val ${txtCls} ${leadCls}" contenteditable="true">${v(f, dim.key)}</div>`;
      }
    });
    return h + `</div>`;
  };

  const core = document.getElementById('cmpCore');
  if (core) core.innerHTML = headerRow() + CORE_DIMS.map(dataRow).join('');

  const ret = document.getElementById('cmpRet');
  if (ret) ret.innerHTML = headerRow() + RET_DIMS.map(dataRow).join('');

  // LINE 文字
  const mb = document.getElementById('msgBox');
  if (mb) mb.textContent = _buildMsg(funds);
}

function _buildMsg(funds) {
  const lead = fundById(S.lead);
  const names = funds.map(f => `▸ ${f.display_name_zh}`).join('\n');
  return `📊【${S.valueProp}】

本次比較：
${names}

主打：${lead ? lead.display_name_zh : ''}

詳情請見附圖 ⬇️

＊本資料僅供參考，基金過去績效不代表未來表現，投資人申購前應詳閱公開說明書。`;
}

// ============================================================
// 顯示 / 隱藏海報（目前僅一個版型）
// ============================================================
export function showPoster(_tplKey) {
  const el = document.getElementById('poster-compare');
  if (el) el.style.display = 'flex';
}

// ============================================================
// html2canvas 修正（placeholder 版型暫無特殊效果需修）
// ============================================================
export function onDownloadClone(_doc, _tplKey) { /* no-op for now */ }

export function getDownloadFileName(_state) {
  const lead = fundById(S.lead);
  const nm = lead ? lead.short_name_zh : 'compare';
  return `霸菱競品比較_${nm}.jpg`;
}

export function getActivePosterEl(_tplKey) {
  return document.getElementById('poster-compare');
}
