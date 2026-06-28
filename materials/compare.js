// ============================================================
// 競品比較圖 素材模組（橫式 1920×1080，給簡報用）
//
// 沿用素材契約：CSS / HTML / renderFields / renderMsg / update /
// showPoster / getActivePosterEl / getDownloadFileName / onDownloadClone。
// 另實作新版 index.html 的 step② 慣例：renderStep2 + STEP2_TITLE。
//
// 海報版型(HTML/CSS)由 Rose 提供，本模組用 data-col / data-dim 屬性
// 把資料填進去；編輯一律在左側控制面板，海報本身不可編輯（輸出為圖片）。
// 資料目前為 mock（取自 pitch 範例圖），之後接 MoneyDJ 真值。
// ============================================================

// 海報原生尺寸 — index.html 的預覽/下載管線讀這個來決定 canvas 尺寸與比例
export const POSTER = { w: 1920, h: 1080 };

// html2canvas 截圖前要確保載入的字型
export const FONTS = [
  '700 40px "Noto Serif TC"',
  '700 30px "Noto Sans TC"',
  '400 16px "Noto Sans TC"',
];

// step② 標題（新版 index.html 用）
export const STEP2_TITLE = '選擇比較模式';

// 種子基金主檔（registry）。module import 時即載入。
const REGISTRY = await fetch('./data/funds.json')
  .then(r => r.json())
  .then(d => d.funds)
  .catch(() => []);

// ------------------------------------------------------------
// 比較維度
// ------------------------------------------------------------
const CORE_DIMS = [
  { key: 'target',    label: '投資標的' },
  { key: 'vol',       label: '波動度' },
  { key: 'rate_sens', label: '利率敏感度' },
  { key: 'credit',    label: '信用品質' },
  { key: 'yield',     label: '收益率' },
  { key: 'maxdd',     label: '最大回撤' },
  { key: 'duration',  label: '存續期間' },
  { key: 'features',  label: '投資特色' },
];
const RET_DIMS = [
  { key: 'custom', label: '今年以來 YTD' },
  { key: 'y1',     label: '近一年' },
  { key: 'y2',     label: '近兩年' },
  { key: 'y3',     label: '近三年' },
];
const ALL_DIMS = [...CORE_DIMS, ...RET_DIMS];

// 「領先勾選」規則：high=越大越好、low=越小越好、low_ord=利率敏感度(低<中<高)
// 沒列出的維度(target/credit/features)不標領先。
const WIN_RULE = {
  vol: 'low', duration: 'low', rate_sens: 'low_ord',
  yield: 'high', maxdd: 'high', custom: 'high', y1: 'high', y2: 'high', y3: 'high',
};
const WIN_SVG = '<span class="cmp-win"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>';

// ------------------------------------------------------------
// mock 數據（取自 pitch 範例圖）。key = registry 的 fund_id。
// 未列出的基金以 '—' 顯示。
// ------------------------------------------------------------
const MOCK = {
  barings_plb04: {
    target: '優先順位資產抵押債券／貸款（有擔保、清償順位高）',
    vol: '2.02%', rate_sens: '低', credit: 'BBB-',
    yield: '6.35%', maxdd: '-4.12%', duration: '2.50年',
    features: ['浮動利率為主，抗利率風險佳', '優先順位、有擔保，清償順位高', '收益穩定，波動度低'],
    custom: '2.81%', y1: '7.24%', y2: '8.67%', y3: '7.98%',
  },
  pimco_diversified_income_pim41: {
    target: '全球多元債券（投資級／高收益／新興）',
    vol: '4.88%', rate_sens: '中高', credit: 'BB+',
    yield: '5.20%', maxdd: '-10.35%', duration: '5.25年',
    features: ['全球多元配置，追求更高收益', '靈活操作，橫跨市場機會', '資本利得機會較高'],
    custom: '-0.23%', y1: '5.12%', y2: '6.21%', y3: '5.34%',
  },
  gs_us_dollar_credit_anz91: {
    target: '全球投資等級公司債（高信評為主）',
    vol: '3.25%', rate_sens: '中', credit: 'A-',
    yield: '4.15%', maxdd: '-6.21%', duration: '6.65年',
    features: ['投資等級信用品質佳', '收益相對穩定', '利率風險高於霸菱'],
    custom: '-1.12%', y1: '3.85%', y2: '4.92%', y3: '4.35%',
  },
};

// 價值主張範本（hardcode；之後可串 AI）
const VALUE_PROPS = [
  '穩定度・抗波動・利率風險 — 三檔債券基金，一次看懂',
  '低波動、低回撤，攻守兼備的核心配置',
  '優先順位有擔保，清償順位高，收益穩定度佳',
  '浮動利率為主，利率敏感度低，適合升息環境',
  '同類型中波動最低，風險調整後報酬突出',
];

// ------------------------------------------------------------
// 模組狀態
// ------------------------------------------------------------
const S = {
  lead: null, comp1: null, comp2: null,
  mode: '1v1v1',          // '1v1' | '1v1v1'
  showAllCat: false,
  dims: Object.fromEntries(ALL_DIMS.map(d => [d.key, true])),
  valueProp: VALUE_PROPS[0],
  crown: false,           // 「綜合表現領先」徽章（合規預設關）
};

// ============================================================
// 海報 CSS（Rose 提供）
// ============================================================
export const CSS = `
#poster-compare{position:relative;box-sizing:border-box;width:1920px;height:1080px;overflow:hidden;background:#fbfaf7;color:#1a2a52;font-family:'Noto Sans TC',sans-serif;padding:56px 64px 40px;display:flex;flex-direction:column;
  --cmp-label:150px;--cmp-band-left:150px;--cmp-band-width:calc((100% - 150px)/3);}
#poster-compare .cmp-topbar{position:absolute;top:0;left:0;right:0;height:6px;background:linear-gradient(90deg,#1a2a52 0%,#1a7a4a 50%,#e8c275 100%);}

/* header */
#poster-compare .cmp-header{display:flex;align-items:center;justify-content:space-between;gap:24px;box-sizing:border-box;}
#poster-compare .cmp-headleft{display:flex;align-items:center;gap:22px;}
#poster-compare .cmp-logo{width:200px;height:56px;flex:none;border:1px dashed #c9cdd6;border-radius:6px;}
#poster-compare .cmp-vrule{width:1px;height:44px;background:#dde0e6;}
#poster-compare .cmp-eyebrow{font:600 16px 'Noto Sans TC',sans-serif;letter-spacing:.22em;color:#b08a2e;}
#poster-compare .cmp-date{flex:none;display:flex;align-items:center;gap:8px;border:1px solid #dde0e6;border-radius:999px;padding:9px 18px;font:500 15px 'Noto Sans TC',sans-serif;color:#5b6573;white-space:nowrap;}
#poster-compare .cmp-date .cmp-dot{width:7px;height:7px;border-radius:50%;background:#e8c275;}
#poster-compare .cmp-title{margin:16px 0 0;font:700 40px/1.28 'Noto Serif TC',serif;color:#1a2a52;letter-spacing:.01em;}

/* main two-column */
#poster-compare .cmp-main{margin-top:18px;flex:1;display:grid;grid-template-columns:1.34fr 1fr;gap:46px;min-height:0;}
#poster-compare .cmp-col{display:flex;flex-direction:column;min-height:0;box-sizing:border-box;}
#poster-compare .cmp-right{gap:24px;}
#poster-compare .cmp-sechead{display:flex;align-items:center;gap:12px;margin-bottom:8px;}
#poster-compare .cmp-sechead .cmp-sectitle{font:700 20px 'Noto Serif TC',serif;color:#1a2a52;white-space:nowrap;}
#poster-compare .cmp-sechead .cmp-secsub{font:400 14px 'Noto Sans TC',sans-serif;color:#9298a4;}
#poster-compare .cmp-sechead .cmp-secline{flex:1;height:1px;background:#e3e0d6;}

/* table shell */
#poster-compare .cmp-table{position:relative;box-sizing:border-box;display:flex;flex-direction:column;}
#poster-compare .cmp-band{position:absolute;top:0;bottom:0;left:var(--cmp-band-left);width:var(--cmp-band-width);background:#fdf6e4;border:1.5px solid #e8c275;border-radius:13px;box-shadow:0 14px 32px -20px rgba(180,140,40,.95);z-index:0;}

/* rows */
#poster-compare .cmp-row{position:relative;z-index:1;display:grid;grid-template-columns:var(--cmp-label) 1fr 1fr 1fr;align-items:center;box-sizing:border-box;}
#poster-compare .cmp-head{align-items:stretch;}
#poster-compare .cmp-body{display:flex;flex-direction:column;flex:1;min-height:0;}
#poster-compare .cmp-body .cmp-row{flex:1;border-top:1px solid #ece6d8;}

/* label cells */
#poster-compare .cmp-headlabel{display:flex;align-items:flex-end;padding:0 12px 14px 4px;font:600 15px 'Noto Sans TC',sans-serif;letter-spacing:.06em;color:#9298a4;}
#poster-compare .cmp-rowlabel{padding:7px 12px 7px 4px;}
#poster-compare .cmp-dim{font:600 19px 'Noto Sans TC',sans-serif;color:#222a3c;}
#poster-compare .cmp-unit{display:block;margin-top:2px;font:400 13px 'Noto Sans TC',sans-serif;color:#9298a4;}

/* fund header cells */
#poster-compare .cmp-fund{padding:14px 10px 12px;text-align:center;font:600 20px/1.3 'Noto Serif TC',serif;color:#3a4452;}
#poster-compare .cmp-fund[data-col="lead"]{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;color:#1a2a52;font-weight:700;}
#poster-compare .cmp-fname{display:block;}
#poster-compare .cmp-badge{display:none;align-items:center;gap:6px;background:#1a2a52;color:#e8c275;font:700 12px 'Noto Sans TC',sans-serif;letter-spacing:.06em;padding:5px 14px;border-radius:999px;white-space:nowrap;box-shadow:0 6px 14px -6px rgba(26,42,82,.7);}
#poster-compare .cmp-badge svg{width:14px;height:14px;display:block;}
#poster-compare.cmp-badge-on .cmp-badge{display:inline-flex;}

/* value cells */
#poster-compare .cmp-cell{display:flex;align-items:center;justify-content:center;gap:9px;padding:6px 8px;font-family:'Noto Sans TC',sans-serif;font-size:26px;font-weight:600;line-height:1.18;color:#5b6573;font-variant-numeric:tabular-nums;}
#poster-compare .cmp-cell[data-col="lead"]{color:#1a2a52;font-weight:700;font-size:30px;}
#poster-compare .cmp-cell.cmp-neg{color:#c0392b;}

/* 領先勾選 */
#poster-compare .cmp-win{display:inline-flex;align-items:center;justify-content:center;width:27px;height:27px;border-radius:50%;background:#e8c275;flex:none;box-shadow:0 2px 5px -2px rgba(180,140,40,.95);}
#poster-compare .cmp-win svg{width:15px;height:15px;display:block;}

/* target row (text) */
#poster-compare .cmp-row[data-dim="target"] .cmp-cell{display:block;text-align:center;font-size:15.5px;font-weight:600;line-height:1.38;padding:8px 10px;}
#poster-compare .cmp-row[data-dim="target"] .cmp-cell .cmp-sub{display:block;margin-top:2px;font-size:12px;font-weight:400;color:#9298a4;}
#poster-compare .cmp-row[data-dim="target"] .cmp-cell[data-col="lead"] .cmp-sub{color:#8a7a45;}

/* features row (bullets) */
#poster-compare .cmp-row[data-dim="features"]{align-items:stretch;}
#poster-compare .cmp-row[data-dim="features"] .cmp-rowlabel{display:flex;align-items:flex-start;padding-top:12px;}
#poster-compare .cmp-row[data-dim="features"] .cmp-cell{display:block;padding:7px 12px;text-align:left;font-size:14px;font-weight:400;}
#poster-compare .cmp-bullets{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:5px;}
#poster-compare .cmp-bullets li{position:relative;padding-left:15px;font:400 14.5px/1.32 'Noto Sans TC',sans-serif;color:#5b6573;}
#poster-compare .cmp-bullets li::before{content:"";position:absolute;left:0;top:7px;width:5px;height:5px;background:#c9cdd6;}
#poster-compare .cmp-cell[data-col="lead"] .cmp-bullets li{color:#2a3243;}
#poster-compare .cmp-cell[data-col="lead"] .cmp-bullets li::before{background:#e8c275;}

/* 報酬率表現：深藍表頭 + 金框欄 */
#poster-compare .cmp-perf-table{flex:none;border:1px solid #e8eaee;border-radius:12px;overflow:hidden;}
#poster-compare .cmp-perfhead{background:#1a2a52;}
#poster-compare .cmp-perfhead .cmp-headlabel{align-items:center;padding:14px 16px;font:700 19px 'Noto Serif TC',serif;letter-spacing:0;color:#fff;}
#poster-compare .cmp-perfhead .cmp-fund{padding:14px 6px;font:600 18px 'Noto Sans TC',sans-serif;color:#c2cad8;}
#poster-compare .cmp-perfhead .cmp-fund[data-col="lead"]{gap:0;color:#f0e3c0;font-weight:700;box-shadow:inset 0 -3px 0 #e8c275;}
#poster-compare .cmp-perfbody{position:relative;}
#poster-compare .cmp-band-perf{top:0;bottom:0;border-radius:0 0 10px 10px;box-shadow:none;}
#poster-compare .cmp-perf-table .cmp-cell{padding:9px 6px;font-size:23px;}
#poster-compare .cmp-perf-table .cmp-cell[data-col="lead"]{font-size:27px;}
#poster-compare .cmp-perf-table .cmp-win{width:24px;height:24px;}
#poster-compare .cmp-perf-table .cmp-win svg{width:13px;height:13px;}
#poster-compare .cmp-perf-table .cmp-dim{font-size:19px;}

/* conclusion panel */
#poster-compare .cmp-conclusion{flex:1;position:relative;overflow:hidden;border-radius:14px;background:linear-gradient(135deg,#1a3a64 0%,#0e2342 100%);display:flex;flex-direction:column;justify-content:center;padding:26px 32px;box-sizing:border-box;}
#poster-compare .cmp-conclusion .cmp-cbar{position:absolute;top:0;left:0;bottom:0;width:5px;background:linear-gradient(#e8c275,#f1d99a);}
#poster-compare .cmp-conclusion .cmp-clabel{font:700 13px 'Noto Sans TC',sans-serif;letter-spacing:.2em;color:#e8c275;}
#poster-compare .cmp-conclusion .cmp-ctext{margin-top:9px;font:700 24px/1.46 'Noto Serif TC',serif;color:#fff;}
#poster-compare .cmp-conclusion .cmp-ctext em{font-style:normal;color:#f1d99a;}
#poster-compare .cmp-conclusion .cmp-cbull{list-style:none;margin:16px 0 0;padding:0;display:flex;flex-direction:column;gap:10px;}
#poster-compare .cmp-conclusion .cmp-cbull li{position:relative;padding-left:18px;font:400 16px/1.5 'Noto Sans TC',sans-serif;color:#e6edf6;}
#poster-compare .cmp-conclusion .cmp-cbull li::before{content:"";position:absolute;left:0;top:9px;width:7px;height:7px;background:#e8c275;}

/* footer */
#poster-compare .cmp-footer{margin-top:22px;padding-top:14px;border-top:1px solid #e7e4db;display:flex;justify-content:space-between;gap:24px;}
#poster-compare .cmp-source{font:400 14.5px/1.6 'Noto Sans TC',sans-serif;color:#8a8f9c;}
#poster-compare .cmp-disclaimer{font:400 14.5px/1.6 'Noto Sans TC',sans-serif;color:#9aa0ab;text-align:right;flex:none;}

/* 2 欄模式 */
#poster-compare.cmp-2col{--cmp-label:170px;--cmp-band-left:170px;--cmp-band-width:calc((100% - 170px)/2);}
#poster-compare.cmp-2col .cmp-row{grid-template-columns:var(--cmp-label) 1fr 1fr;}
#poster-compare.cmp-2col [data-col="comp2"]{display:none;}

/* 單列隱藏 */
#poster-compare .cmp-row.cmp-hidden{display:none;}
`;

// ============================================================
// 海報 HTML（Rose 提供，欄名改用 .cmp-fname 供 JS 綁定）
// ============================================================
export const HTML = `
<div id="poster-compare">
  <div class="cmp-topbar"></div>

  <div class="cmp-header">
    <div class="cmp-headleft">
      <div class="cmp-logo"></div>
      <div class="cmp-vrule"></div>
      <div class="cmp-eyebrow">債券基金・核心比較</div>
    </div>
    <div class="cmp-date"><span class="cmp-dot"></span>數據更新至&nbsp;<span class="cmp-asof">2026/04/21</span></div>
  </div>
  <h1 class="cmp-title">穩定度・抗波動・利率風險 — 三檔債券基金，一次看懂</h1>

  <div class="cmp-main">

    <div class="cmp-col cmp-left">
      <div class="cmp-sechead"><span class="cmp-sectitle">核心數據比較</span><span class="cmp-secline"></span></div>
      <div class="cmp-table cmp-core" style="flex:1;">
        <div class="cmp-band"></div>
        <div class="cmp-row cmp-head">
          <div class="cmp-headlabel">比較項目</div>
          <div class="cmp-fund" data-col="lead">
            <div class="cmp-badge"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 7l4.6 3.4L12 4l4.4 6.4L21 7l-1.7 11.2H4.7L3 7z"/></svg>綜合表現領先</div>
            <span class="cmp-fname">霸菱優先順位資產抵押債券基金</span>
          </div>
          <div class="cmp-fund" data-col="comp1"><span class="cmp-fname">PIMCO多元收益債券基金</span></div>
          <div class="cmp-fund" data-col="comp2"><span class="cmp-fname">高盛投資等級債券基金</span></div>
        </div>
        <div class="cmp-body">
          <div class="cmp-row" data-dim="target">
            <div class="cmp-rowlabel"><span class="cmp-dim">投資標的</span></div>
            <div class="cmp-cell" data-col="lead" data-dim="target"><span class="cmp-val">—</span></div>
            <div class="cmp-cell" data-col="comp1" data-dim="target"><span class="cmp-val">—</span></div>
            <div class="cmp-cell" data-col="comp2" data-dim="target"><span class="cmp-val">—</span></div>
          </div>
          <div class="cmp-row" data-dim="vol">
            <div class="cmp-rowlabel"><span class="cmp-dim">波動度</span><span class="cmp-unit">年化標準差</span></div>
            <div class="cmp-cell" data-col="lead" data-dim="vol"><span class="cmp-val">—</span></div>
            <div class="cmp-cell" data-col="comp1" data-dim="vol"><span class="cmp-val">—</span></div>
            <div class="cmp-cell" data-col="comp2" data-dim="vol"><span class="cmp-val">—</span></div>
          </div>
          <div class="cmp-row" data-dim="rate_sens">
            <div class="cmp-rowlabel"><span class="cmp-dim">利率敏感度</span></div>
            <div class="cmp-cell" data-col="lead" data-dim="rate_sens"><span class="cmp-val">—</span></div>
            <div class="cmp-cell" data-col="comp1" data-dim="rate_sens"><span class="cmp-val">—</span></div>
            <div class="cmp-cell" data-col="comp2" data-dim="rate_sens"><span class="cmp-val">—</span></div>
          </div>
          <div class="cmp-row" data-dim="credit">
            <div class="cmp-rowlabel"><span class="cmp-dim">信用品質</span><span class="cmp-unit">平均信評</span></div>
            <div class="cmp-cell" data-col="lead" data-dim="credit"><span class="cmp-val">—</span></div>
            <div class="cmp-cell" data-col="comp1" data-dim="credit"><span class="cmp-val">—</span></div>
            <div class="cmp-cell" data-col="comp2" data-dim="credit"><span class="cmp-val">—</span></div>
          </div>
          <div class="cmp-row" data-dim="yield">
            <div class="cmp-rowlabel"><span class="cmp-dim">收益率</span><span class="cmp-unit">殖利率</span></div>
            <div class="cmp-cell" data-col="lead" data-dim="yield"><span class="cmp-val">—</span></div>
            <div class="cmp-cell" data-col="comp1" data-dim="yield"><span class="cmp-val">—</span></div>
            <div class="cmp-cell" data-col="comp2" data-dim="yield"><span class="cmp-val">—</span></div>
          </div>
          <div class="cmp-row" data-dim="maxdd">
            <div class="cmp-rowlabel"><span class="cmp-dim">最大回撤</span><span class="cmp-unit">過去 3 年</span></div>
            <div class="cmp-cell" data-col="lead" data-dim="maxdd"><span class="cmp-val">—</span></div>
            <div class="cmp-cell" data-col="comp1" data-dim="maxdd"><span class="cmp-val">—</span></div>
            <div class="cmp-cell" data-col="comp2" data-dim="maxdd"><span class="cmp-val">—</span></div>
          </div>
          <div class="cmp-row" data-dim="duration">
            <div class="cmp-rowlabel"><span class="cmp-dim">存續期間</span></div>
            <div class="cmp-cell" data-col="lead" data-dim="duration"><span class="cmp-val">—</span></div>
            <div class="cmp-cell" data-col="comp1" data-dim="duration"><span class="cmp-val">—</span></div>
            <div class="cmp-cell" data-col="comp2" data-dim="duration"><span class="cmp-val">—</span></div>
          </div>
          <div class="cmp-row" data-dim="features">
            <div class="cmp-rowlabel"><span class="cmp-dim">投資特色</span></div>
            <div class="cmp-cell" data-col="lead" data-dim="features"><ul class="cmp-bullets"></ul></div>
            <div class="cmp-cell" data-col="comp1" data-dim="features"><ul class="cmp-bullets"></ul></div>
            <div class="cmp-cell" data-col="comp2" data-dim="features"><ul class="cmp-bullets"></ul></div>
          </div>
        </div>
      </div>
    </div>

    <div class="cmp-col cmp-right">
      <div>
        <div class="cmp-sechead"><span class="cmp-sectitle">報酬率表現比較</span><span class="cmp-secsub">年化／含息</span><span class="cmp-secline"></span></div>
        <div class="cmp-table cmp-perf-table">
          <div class="cmp-row cmp-head cmp-perfhead">
            <div class="cmp-headlabel">報酬率表現</div>
            <div class="cmp-fund" data-col="lead"><span class="cmp-fname">霸菱</span></div>
            <div class="cmp-fund" data-col="comp1"><span class="cmp-fname">PIMCO</span></div>
            <div class="cmp-fund" data-col="comp2"><span class="cmp-fname">高盛</span></div>
          </div>
          <div class="cmp-perfbody">
            <div class="cmp-band cmp-band-perf"></div>
            <div class="cmp-body">
              <div class="cmp-row" data-dim="custom">
                <div class="cmp-rowlabel"><span class="cmp-dim">今年以來</span><span class="cmp-unit">YTD / 自訂區間</span></div>
                <div class="cmp-cell" data-col="lead" data-dim="custom"><span class="cmp-val">—</span></div>
                <div class="cmp-cell" data-col="comp1" data-dim="custom"><span class="cmp-val">—</span></div>
                <div class="cmp-cell" data-col="comp2" data-dim="custom"><span class="cmp-val">—</span></div>
              </div>
              <div class="cmp-row" data-dim="y1">
                <div class="cmp-rowlabel"><span class="cmp-dim">近一年</span></div>
                <div class="cmp-cell" data-col="lead" data-dim="y1"><span class="cmp-val">—</span></div>
                <div class="cmp-cell" data-col="comp1" data-dim="y1"><span class="cmp-val">—</span></div>
                <div class="cmp-cell" data-col="comp2" data-dim="y1"><span class="cmp-val">—</span></div>
              </div>
              <div class="cmp-row" data-dim="y2">
                <div class="cmp-rowlabel"><span class="cmp-dim">近兩年</span><span class="cmp-unit">年化</span></div>
                <div class="cmp-cell" data-col="lead" data-dim="y2"><span class="cmp-val">—</span></div>
                <div class="cmp-cell" data-col="comp1" data-dim="y2"><span class="cmp-val">—</span></div>
                <div class="cmp-cell" data-col="comp2" data-dim="y2"><span class="cmp-val">—</span></div>
              </div>
              <div class="cmp-row" data-dim="y3">
                <div class="cmp-rowlabel"><span class="cmp-dim">近三年</span><span class="cmp-unit">年化</span></div>
                <div class="cmp-cell" data-col="lead" data-dim="y3"><span class="cmp-val">—</span></div>
                <div class="cmp-cell" data-col="comp1" data-dim="y3"><span class="cmp-val">—</span></div>
                <div class="cmp-cell" data-col="comp2" data-dim="y3"><span class="cmp-val">—</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="cmp-conclusion">
        <div class="cmp-cbar"></div>
        <div class="cmp-clabel">結論</div>
        <div class="cmp-ctext" data-cmp="conclusion">霸菱在 <em>穩定度・抗波動・利率風險</em> 三大面向<em>全面領先</em></div>
        <ul class="cmp-cbull"></ul>
      </div>
    </div>
  </div>

  <div class="cmp-footer">
    <div class="cmp-source">資料來源占位：Morningstar、各基金公司官網、Lipper｜美元計價｜截至 2026/04/21</div>
    <div class="cmp-disclaimer">投資警語占位：基金過去績效不代表未來表現，<br>投資人申購前應詳閱公開說明書。（實際警語人工填入）</div>
  </div>
</div>`;

// ============================================================
// 工具
// ============================================================
function activeFunds() {
  const ids = [S.lead, S.comp1];
  if (S.mode === '1v1v1') ids.push(S.comp2);
  return ids.filter(Boolean);
}
function fundById(id) { return REGISTRY.find(f => f.fund_id === id) || null; }
function competitorPool() {
  const lead = fundById(S.lead);
  return REGISTRY.filter(f => {
    if (f.fund_id === S.lead) return false;
    if (S.showAllCat) return true;
    return lead && f.category === lead.category;
  });
}
function dataOf(id) { return MOCK[id] || {}; }
function num(v) {
  if (v == null) return null;
  const m = String(v).replace(/[^\d.\-]/g, '');
  if (m === '' || m === '-' || m === '.') return null;
  const n = parseFloat(m);
  return Number.isFinite(n) ? n : null;
}
const ORD = { '低': 1, '中': 2, '中高': 2.5, '高': 3 };
function ordVal(v) {
  if (v == null) return null;
  const s = String(v);
  if (s.includes('中高')) return 2.5;
  if (s.includes('低')) return 1;
  if (s.includes('高')) return 3;
  if (s.includes('中')) return 2;
  return null;
}

// ============================================================
// step②：比較模式（新版 index.html 慣例）
// ============================================================
export function renderStep2(grid) {
  grid.innerHTML = '';
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:10px';
  [['1v1', '1 對 1', '主打 vs 1 檔競品'], ['1v1v1', '1 對 2', '主打 vs 2 檔競品']]
    .forEach(([mode, label, sub]) => {
      const btn = window.step2BigButton({
        label, sub, active: S.mode === mode,
        onclick: () => {
          S.mode = mode;
          if (mode === '1v1v1' && !S.comp2) {
            S.comp2 = competitorPool().find(f => f.fund_id !== S.comp1)?.fund_id || null;
          }
          renderStep2(grid);
          _applyModeUI(); _refreshSelects();
          if (window.updatePoster) window.updatePoster(); else update();
        },
      });
      row.appendChild(btn);
    });
  grid.appendChild(row);
}

// ============================================================
// step③：資料 / 設定面板
// ============================================================
export function renderFields(container) {
  if (!S.lead) {
    S.lead = (REGISTRY.find(f => f.is_barings) || REGISTRY[0] || {}).fund_id || null;
  }
  const pool = competitorPool();
  if (!S.comp1) S.comp1 = pool.find(f => !f.is_barings)?.fund_id || pool[0]?.fund_id || null;
  if (!S.comp2) S.comp2 = pool.find(f => f.fund_id !== S.comp1 && !f.is_barings)?.fund_id
                          || pool.find(f => f.fund_id !== S.comp1)?.fund_id || null;

  container.innerHTML = `
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
    <label class="cmp-checkrow" style="margin-bottom:2px">
      <input type="checkbox" id="cmpAllCat"> 顯示全部分類（跨類別比較）
    </label>
    <div class="cmp-warn" id="cmpCatWarn" style="display:none">⚠️ 跨類別比較，需法遵確認</div>

    <div class="cmp-dim-group">核心數據比較</div>
    <div id="cmpCoreChecks"></div>
    <div class="cmp-dim-group">報酬率表現比較</div>
    <div id="cmpRetChecks"></div>
    <div class="cmp-warn" style="margin-top:6px">＊「自訂區間」起算點需法遵確認，預設採今年以來（YTD）</div>

    <div class="cmp-field" style="margin-top:14px">
      <label>價值主張／標題（範本，可自行編輯）</label>
      <select class="cmp-select" id="cmpVPSelect"></select>
      <input class="data-input" id="cmpVPText" style="width:100%;text-align:left;margin-top:8px"
        placeholder="或自行輸入標題…">
    </div>
    <div class="cmp-toggle">
      <div>
        <div class="lbl">「綜合表現領先」徽章</div>
        <div class="hint">合規考量，預設關閉</div>
      </div>
      <label class="cmp-switch"><input type="checkbox" id="cmpCrown"><span class="slider"></span></label>
    </div>`;

  const mkCheck = (d) => {
    const lab = document.createElement('label');
    lab.className = 'cmp-checkrow';
    lab.innerHTML = `<input type="checkbox" data-dim="${d.key}" ${S.dims[d.key] ? 'checked' : ''}> ` + d.label;
    return lab;
  };
  CORE_DIMS.forEach(d => container.querySelector('#cmpCoreChecks').appendChild(mkCheck(d)));
  RET_DIMS.forEach(d => container.querySelector('#cmpRetChecks').appendChild(mkCheck(d)));

  const vpSel = container.querySelector('#cmpVPSelect');
  VALUE_PROPS.forEach(v => {
    const o = document.createElement('option');
    o.value = v; o.textContent = v.length > 24 ? v.slice(0, 24) + '…' : v;
    vpSel.appendChild(o);
  });
  vpSel.value = S.valueProp;
  container.querySelector('#cmpAllCat').checked = S.showAllCat;
  container.querySelector('#cmpCrown').checked = S.crown;

  _refreshSelects(); _applyModeUI(); _wireEvents(container);
  update();
}

function _refreshSelects() {
  const leadSel = document.getElementById('cmpLead');
  if (!leadSel) return;
  const c1 = document.getElementById('cmpComp1');
  const c2 = document.getElementById('cmpComp2');
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

function _applyModeUI() {
  const wrap = document.getElementById('cmpComp2Wrap');
  if (wrap) wrap.style.display = S.mode === '1v1v1' ? '' : 'none';
}

function _wireEvents(c) {
  const upd = () => { window.updatePoster ? window.updatePoster() : update(); };
  c.querySelector('#cmpLead').addEventListener('change', e => {
    S.lead = e.target.value;
    const pool = competitorPool();
    if (!pool.find(f => f.fund_id === S.comp1)) S.comp1 = pool[0]?.fund_id || null;
    if (!pool.find(f => f.fund_id === S.comp2) || S.comp2 === S.comp1)
      S.comp2 = pool.find(f => f.fund_id !== S.comp1)?.fund_id || null;
    _refreshSelects(); upd();
  });
  c.querySelector('#cmpComp1').addEventListener('change', e => {
    S.comp1 = e.target.value;
    if (S.comp2 === S.comp1) S.comp2 = competitorPool().find(f => f.fund_id !== S.comp1)?.fund_id || null;
    _refreshSelects(); upd();
  });
  c.querySelector('#cmpComp2').addEventListener('change', e => { S.comp2 = e.target.value; _refreshSelects(); upd(); });
  c.querySelector('#cmpAllCat').addEventListener('change', e => {
    S.showAllCat = e.target.checked;
    c.querySelector('#cmpCatWarn').style.display = e.target.checked ? '' : 'none';
    _refreshSelects(); upd();
  });
  c.querySelectorAll('input[data-dim]').forEach(cb =>
    cb.addEventListener('change', () => { S.dims[cb.dataset.dim] = cb.checked; upd(); }));
  c.querySelector('#cmpVPSelect').addEventListener('change', e => {
    S.valueProp = e.target.value; c.querySelector('#cmpVPText').value = ''; upd();
  });
  c.querySelector('#cmpVPText').addEventListener('input', e => {
    S.valueProp = e.target.value.trim() || c.querySelector('#cmpVPSelect').value; upd();
  });
  c.querySelector('#cmpCrown').addEventListener('change', e => { S.crown = e.target.checked; upd(); });
}

// ============================================================
// LINE 罐頭文字
// ============================================================
export function renderMsg(container) {
  container.innerHTML = `
    <div class="cs-cardhead"><div class="cs-num">4</div><div class="cs-cardtitle">LINE 罐頭文字</div></div>
    <div class="msg-box" id="msgBox" style="white-space:pre-wrap">…</div>
    <div class="btn-row" style="margin-top:10px">
      <button class="btn btn-copy" onclick="copyMsg()">📋 複製文字</button>
    </div>`;
}

// ============================================================
// 更新海報內容（用 data- 屬性綁定）
// ============================================================
export function update() {
  const root = document.getElementById('poster-compare');
  if (!root) return;
  const funds = activeFunds();

  root.classList.toggle('cmp-2col', S.mode === '1v1');
  root.classList.toggle('cmp-badge-on', S.crown);

  // 標題
  const title = root.querySelector('.cmp-title');
  if (title) title.textContent = S.valueProp;

  // 欄名（核心表用全名、報酬表用短名/公司）
  const colName = (col, id, short) => {
    const fund = fundById(id);
    const core = root.querySelector(`.cmp-core .cmp-fund[data-col="${col}"] .cmp-fname`);
    const perf = root.querySelector(`.cmp-perf-table .cmp-fund[data-col="${col}"] .cmp-fname`);
    if (core) core.textContent = fund ? fund.display_name_zh : '—';
    if (perf) perf.textContent = fund ? (fund.fund_house || fund.short_name_zh || fund.display_name_zh) : '—';
  };
  colName('lead', S.lead);
  colName('comp1', S.comp1);
  colName('comp2', S.comp2);

  // 逐維度填值
  const cols = { lead: S.lead, comp1: S.comp1, comp2: S.comp2 };
  ALL_DIMS.forEach(dim => {
    // 顯示/隱藏整列
    root.querySelectorAll(`.cmp-row[data-dim="${dim.key}"]`).forEach(r =>
      r.classList.toggle('cmp-hidden', !S.dims[dim.key]));

    Object.entries(cols).forEach(([col, id]) => {
      const cell = root.querySelector(`.cmp-cell[data-col="${col}"][data-dim="${dim.key}"]`);
      if (!cell) return;
      const d = dataOf(id);
      const v = d[dim.key];
      cell.classList.remove('cmp-neg');
      // 移除舊的領先勾選
      cell.querySelectorAll('.cmp-win').forEach(w => w.remove());

      if (dim.key === 'features') {
        const ul = cell.querySelector('.cmp-bullets');
        const items = Array.isArray(v) ? v : [];
        ul.innerHTML = items.length ? items.map(x => `<li>${esc(x)}</li>`).join('') : '<li>—</li>';
        return;
      }
      const val = cell.querySelector('.cmp-val');
      if (val) val.textContent = v != null ? v : '—';
      // 負值報酬標紅
      if (RET_DIMS.some(r => r.key === dim.key) && num(v) != null && num(v) < 0) cell.classList.add('cmp-neg');
    });
  });

  // 領先勾選（每個有規則的維度，在參與比較的基金中找最佳者）
  Object.entries(WIN_RULE).forEach(([key, rule]) => {
    if (!S.dims[key]) return;
    let best = null, bestVal = null;
    funds.forEach(id => {
      const raw = dataOf(id)[key];
      const n = rule === 'low_ord' ? ordVal(raw) : num(raw);
      if (n == null) return;
      if (bestVal == null
        || (rule === 'high' && n > bestVal)
        || ((rule === 'low' || rule === 'low_ord') && n < bestVal)) {
        bestVal = n; best = id;
      }
    });
    if (!best) return;
    const col = best === S.lead ? 'lead' : best === S.comp1 ? 'comp1' : 'comp2';
    const cell = root.querySelector(`.cmp-cell[data-col="${col}"][data-dim="${key}"]`);
    if (cell) cell.insertAdjacentHTML('beforeend', WIN_SVG);
  });

  // 結論條列 = 主打投資特色
  const cbull = root.querySelector('.cmp-cbull');
  if (cbull) {
    const f = (dataOf(S.lead).features || []);
    cbull.innerHTML = f.length ? f.map(x => `<li>${esc(x)}</li>`).join('') : '';
  }

  // LINE 文字
  const mb = document.getElementById('msgBox');
  if (mb) mb.textContent = _buildMsg(funds);
}

function esc(s) {
  return String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

function _buildMsg(funds) {
  const names = funds.map(id => `▸ ${fundById(id)?.display_name_zh || ''}`).join('\n');
  const lead = fundById(S.lead);
  return `📊【${S.valueProp}】

本次比較：
${names}

主打：${lead ? lead.display_name_zh : ''}

詳情請見附圖 ⬇️

＊本資料僅供參考，基金過去績效不代表未來表現，投資人申購前應詳閱公開說明書。`;
}

// ============================================================
// 顯示 / html2canvas 修正 / 下載
// ============================================================
export function showPoster(_tpl) {
  const el = document.getElementById('poster-compare');
  if (el) el.style.display = 'flex';
}
export function onDownloadClone(_doc, _tpl) { /* 此版型無 html2canvas 不支援的效果 */ }
export function getDownloadFileName(_state) {
  const lead = fundById(S.lead);
  return `霸菱競品比較_${lead ? lead.short_name_zh : 'compare'}.jpg`;
}
export function getActivePosterEl(_tpl) { return document.getElementById('poster-compare'); }

// autoFetch 路徑：本素材無需連網，只重繪海報（並讓 index.html 啟用下載鈕）
export async function fetchData(_SCRIPT) { update(); }
