// ============================================================
// 台新基金資訊表（精選基金核心數據一覽）— 直式資訊文件
// 設計(HTML/CSS)由 Rose 提供；資料先 hardcode（之後接 MoneyDJ）。
// 「配息級別」各代碼可在左側勾選要呈現哪些。
// ============================================================

// 直式文件：只給寬度，高度由 index.html 量測（勾選代碼多寡會改變高度）
export const POSTER = { w: 1080 };

export const FONTS = [
  '700 30px "Noto Serif TC"',
  '700 42px "Inter"',
  '600 14px "Noto Sans TC"',
];

// ---- 配息級別資料（取自設計；之後接 MoneyDJ 真值）----
const SC = {
  fund1: {
    name: '環球非投資等級債券基金',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.55)" stroke-width="1.5"/><ellipse cx="12" cy="12" rx="4.5" ry="10" stroke="rgba(255,255,255,.55)" stroke-width="1.5"/><line x1="2" y1="12" x2="22" y2="12" stroke="rgba(255,255,255,.55)" stroke-width="1.3"/><line x1="3.5" y1="7" x2="20.5" y2="7" stroke="rgba(255,255,255,.32)" stroke-width="1"/><line x1="3.5" y1="17" x2="20.5" y2="17" stroke="rgba(255,255,255,.32)" stroke-width="1"/></svg>',
    front: [
      { code:'BEA7', name:'G 美元月配',     rate:'9.3%'  },
      { code:'BEA8', name:'G 美元累積',     rate:''      },
      { code:'BEA9', name:'G 澳幣避險月配', rate:'10.1%' },
      { code:'BEB1', name:'G 澳幣避險累積', rate:''      },
      { code:'BEB2', name:'G 歐元避險月配', rate:'7.1%'  },
      { code:'BEB3', name:'G 歐元避險累積', rate:''      },
    ],
    back: [
      { code:'BI01', name:'BM類 美元月配',     rate:'11.1%' },
      { code:'BI02', name:'BM類 澳幣避險月配', rate:'11.5%' },
    ],
  },
  fund2: {
    name: '優先順位資產抵押債券基金',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;"><path d="M12 2.5L4 6.5v5.5c0 4.8 3.5 8.4 8 10 4.5-1.6 8-5.2 8-10V6.5L12 2.5z" stroke="rgba(255,255,255,.55)" stroke-width="1.5"/><path d="M9 12l2 2.5 4.5-4.5" stroke="rgba(255,255,255,.7)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    front: [
      { code:'BEA1', name:'G 美元月配',     rate:'8.7%' },
      { code:'BEA2', name:'G 美元累積',     rate:''     },
      { code:'BEA3', name:'G 澳幣避險月配', rate:'9.5%' },
      { code:'BEA4', name:'G 澳幣避險累積', rate:''     },
      { code:'BEA5', name:'G 歐元避險月配', rate:'6.5%' },
      { code:'BEA6', name:'G 歐元避險累積', rate:''     },
    ],
    back: [
      { code:'BI03', name:'BM類 美元月配',     rate:'10.3%' },
      { code:'BI04', name:'BM類 澳幣避險月配', rate:'10.8%' },
    ],
  },
};

// 勾選狀態：預設全選
const checked = new Set();
[...SC.fund1.front, ...SC.fund1.back, ...SC.fund2.front, ...SC.fund2.back]
  .forEach(it => checked.add(it.code));

// ============================================================
// CSS（設計提供，CJK 改 Noto Sans TC）+ 海報外框
// ============================================================
export const CSS = `
#poster-taishin{ width:1080px; background:#fff; padding:44px 46px; box-sizing:border-box; }

.fc{
  --navy:#15294C; --navy-line:rgba(255,255,255,.14);
  --gold:#A9822B; --gold-2:#C9A227; --gold-soft:#F8F1DA; --gold-border:#E4CF8E;
  --ink:#16294B; --body:#3A4456; --muted:#7B8494; --line:#E7E9EE;
  --surface:#F5F7FA; --bg:#FFFFFF;
  font-family:'Inter','Noto Sans TC',sans-serif;
  color:var(--body); -webkit-font-smoothing:antialiased;
  container-type:inline-size; background:var(--bg); width:100%;
}
.fc *{box-sizing:border-box;}

/* header */
.fc .fc-top{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;padding:0 2px 16px;border-bottom:2px solid var(--navy);}
.fc .fc-brand{display:flex;align-items:center;gap:16px;}
.fc .fc-logo{height:34px;width:auto;display:block;}
.fc .fc-brand .vr{width:1px;height:30px;background:var(--line);}
.fc .fc-kicker{font-size:13px;font-weight:600;color:var(--muted);letter-spacing:.12em;}
.fc .fc-status{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--gold-border);background:var(--gold-soft);color:var(--navy);font-size:13px;font-weight:600;padding:7px 14px;border-radius:999px;white-space:nowrap;}
.fc .fc-status .dot{width:7px;height:7px;border-radius:50%;background:var(--gold-2);}
.fc .fc-status b{font-weight:700;font-variant-numeric:tabular-nums;}

.fc .fc-titlewrap{padding:22px 2px 22px;}
.fc .fc-tag{display:inline-block;background:var(--navy);color:#fff;font-size:13px;font-weight:600;padding:6px 13px;border-radius:6px;letter-spacing:.06em;margin-bottom:13px;}
.fc .fc-tag b{color:var(--gold-2);font-weight:700;}
.fc .fc-h1{font-size:30px;line-height:1.22;font-weight:700;color:var(--navy);letter-spacing:-.01em;margin:0;text-wrap:balance;}
.fc .fc-sub{margin-top:9px;font-size:14px;color:var(--muted);line-height:1.5;}

/* atoms */
.fc .fc-star{white-space:nowrap;font-size:18px;letter-spacing:2px;color:var(--gold-2);}
.fc .fc-star .off{color:#D5DAE3;}
.fc .sc-head{display:flex;align-items:center;gap:14px;margin:0 0 16px;}
.fc .sc-head h3{font-size:18px;color:var(--navy);font-weight:700;margin:0;white-space:nowrap;}
.fc .sc-head .rule{flex:1;height:1px;background:var(--line);}
.fc .sc-head .note{font-size:12px;color:var(--muted);white-space:nowrap;}
.fc .sc-item{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 0;border-bottom:1px dashed var(--line);}
.fc .sc-item:last-child{border-bottom:none;}
.fc .sc-name{flex:1;font-size:14px;color:var(--ink);font-weight:500;}
.fc .sc-code{display:inline-flex;align-items:center;justify-content:center;min-width:42px;padding:2px 9px;border:1.5px solid var(--gold-border);border-radius:999px;background:var(--gold-soft);color:var(--gold);font-size:11px;font-weight:700;letter-spacing:.04em;white-space:nowrap;font-variant-numeric:tabular-nums;}
.fc .sc-rate{font-size:15px;font-weight:700;color:var(--navy);font-variant-numeric:tabular-nums;white-space:nowrap;}
.fc .sc-glabel{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:700;letter-spacing:.04em;padding:4px 11px;border-radius:6px;margin:4px 0 2px;}
.fc .sc-glabel.front,.fc .sc-glabel.back{color:#fff;background:var(--navy);}

.fc .fc-foot{margin-top:24px;padding-top:14px;border-top:1px solid var(--line);display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap;font-size:12px;color:var(--muted);line-height:1.65;}
.fc .fc-foot .src{text-align:right;}

/* share-class grid */
.fc .sc-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px;}
.fc .sc-col{border:1px solid var(--line);border-radius:10px;overflow:hidden;box-shadow:0 1px 3px rgba(16,32,64,.05);}
.fc .sc-col-head{display:flex;align-items:center;gap:10px;background:var(--navy);color:#fff;padding:13px 16px;font-size:14px;font-weight:600;line-height:1.3;}
.fc .sch-icon{flex-shrink:0;opacity:.85;display:flex;}
.fc .sc-body{padding:8px 16px 14px;}
.fc .sc{margin-top:30px;}

/* cards */
.fc .cards{display:grid;grid-template-columns:1fr 1fr;gap:22px;}
.fc .card{border:1px solid var(--line);border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(16,32,64,.07);display:flex;flex-direction:column;}
.fc .card.spot{border-color:var(--gold-border);box-shadow:0 3px 14px rgba(169,130,43,.18);}
.fc .ch{background:var(--navy);color:#fff;padding:18px 20px;position:relative;}
.fc .card.spot .ch{background:linear-gradient(115deg,#15294C,#284472);}
.fc .ch .ft{font-size:11px;font-weight:700;letter-spacing:.16em;color:var(--gold-2);}
.fc .ch .nm{font-size:18px;font-weight:700;margin-top:4px;line-height:1.3;}
.fc .ch .stars{margin-top:11px;display:flex;align-items:center;gap:9px;}
.fc .ch .stars .ml{font-size:12px;color:rgba(255,255,255,.72);font-weight:500;}
.fc .ch-icon{margin:11px 0 5px;opacity:.75;}
.fc .cb{padding:20px;display:flex;flex-direction:column;gap:18px;}
.fc .hero-m{display:flex;align-items:flex-end;gap:11px;}
.fc .hero-m .big{font-size:42px;font-weight:700;color:var(--navy);line-height:.9;font-variant-numeric:tabular-nums;}
.fc .hero-m .lab{padding-bottom:6px;font-size:13px;color:var(--muted);}
.fc .hero-m .lab b{display:block;color:var(--gold);font-weight:700;font-size:11px;letter-spacing:.08em;margin-bottom:1px;}
.fc .statrow{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.fc .stat{background:var(--surface);border-radius:8px;padding:12px 14px;}
.fc .stat .k{font-size:12px;color:var(--muted);}
.fc .stat .v{font-size:18px;font-weight:700;color:var(--ink);margin-top:3px;font-variant-numeric:tabular-nums;}
.fc .alloc-block{background:var(--gold-soft);border:1px solid var(--gold-border);border-radius:8px;padding:13px 15px;}
.fc .alloc-block .k{font-size:11px;color:var(--gold);font-weight:700;letter-spacing:.06em;}
.fc .alloc-main{display:flex;align-items:baseline;gap:9px;margin:5px 0 2px;}
.fc .alloc-pct{font-size:22px;font-weight:700;color:var(--navy);line-height:1;font-variant-numeric:tabular-nums;}
.fc .alloc-type{font-size:13px;color:var(--body);font-weight:500;}
.fc .alloc-block .s{font-size:12px;color:var(--muted);margin-top:4px;}
.fc .perf2{border-top:1px solid var(--line);padding-top:14px;}
.fc .perf2 .lab{font-size:11px;color:var(--muted);letter-spacing:.04em;margin-bottom:8px;}
.fc .perf2 .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
.fc .perf2 .k{font-size:11px;color:var(--muted);}
.fc .perf2 .v{font-size:18px;font-weight:700;color:var(--navy);margin-top:2px;font-variant-numeric:tabular-nums;}

@container (max-width:700px){
  .fc .cards{grid-template-columns:1fr;}
  .fc .sc-grid{grid-template-columns:1fr;}
}
`;

// ============================================================
// HTML（固定的品牌頭 + 2 張基金卡；配息級別由 update 動態填入）
// ============================================================
export const HTML = `
<div id="poster-taishin" class="fc fcv2">
  <div class="fc-top">
    <div class="fc-brand">
      <img class="fc-logo" src="./assets/barings-logo.png" alt="BARINGS">
      <div class="vr"></div>
      <div class="fc-kicker">債券基金 · 核心比較</div>
    </div>
    <div class="fc-status"><span class="dot"></span>下次配息基準日 <b>2026/04/30</b></div>
  </div>

  <div class="fc-titlewrap">
    <span class="fc-tag"><b>特選一</b> · 2026 Q2 活動基金</span>
    <h1 class="fc-h1">精選基金 · 核心數據一覽</h1>
    <p class="fc-sub">每月配息，前收後收均有，核心數據一次完整呈現。</p>
  </div>

  <div class="cards">
    <div class="card spot">
      <div class="ch">
        <div class="ft">霸菱 BARINGS</div>
        <div class="ch-icon">${SC.fund1.icon}</div>
        <div class="nm">環球非投資等級債券基金</div>
        <div class="stars"><span class="ml">晨星評等</span><span class="fc-star">★★★★★</span></div>
      </div>
      <div class="cb">
        <div class="hero-m"><span class="big">7.3%</span><span class="lab"><b>到期殖利率</b>Yield to Maturity</span></div>
        <div class="statrow">
          <div class="stat"><div class="k">存續期間</div><div class="v">2.6 年</div></div>
          <div class="stat"><div class="k">平均信評</div><div class="v">BB-</div></div>
        </div>
        <div class="alloc-block"><div class="k">資產配置</div><div class="alloc-main"><span class="alloc-pct">46%</span><span class="alloc-type">優先擔保 + 非投等級債券</span></div><div class="s">美國、歐洲為主</div></div>
        <div class="perf2"><div class="lab">績效表現 · 截至 2026/02/28</div><div class="grid"><div><div class="k">1 年</div><div class="v">7.6%</div></div><div><div class="k">3 年</div><div class="v">32.4%</div></div><div><div class="k">5 年</div><div class="v">28.1%</div></div></div></div>
      </div>
    </div>
    <div class="card">
      <div class="ch">
        <div class="ft">霸菱 BARINGS</div>
        <div class="ch-icon">${SC.fund2.icon}</div>
        <div class="nm">優先順位資產抵押債券基金</div>
        <div class="stars"><span class="ml">晨星評等</span><span class="fc-star">★★★★<span class="off">★</span></span></div>
      </div>
      <div class="cb">
        <div class="hero-m"><span class="big">7.1%</span><span class="lab"><b>到期殖利率</b>Yield to Maturity</span></div>
        <div class="statrow">
          <div class="stat"><div class="k">存續期間</div><div class="v">2.5 年</div></div>
          <div class="stat"><div class="k">平均信評</div><div class="v">BB-</div></div>
        </div>
        <div class="alloc-block"><div class="k">資產配置</div><div class="alloc-main"><span class="alloc-pct">100%</span><span class="alloc-type">優先順位擔保債券</span></div><div class="s">美國、歐洲為主</div></div>
        <div class="perf2"><div class="lab">績效表現 · 截至 2026/02/28</div><div class="grid"><div><div class="k">1 年</div><div class="v">6.2%</div></div><div><div class="k">3 年</div><div class="v">27.6%</div></div><div><div class="k">5 年</div><div class="v">23.8%</div></div></div></div>
      </div>
    </div>
  </div>

  <div class="sc">
    <div class="sc-head"><h3>配息級別</h3><span class="rule"></span><span class="note">年化配息率 · 截至 2026.02</span></div>
    <div class="sc-grid">
      <div class="sc-col">
        <div class="sc-col-head"><span class="sch-icon">${SC.fund1.icon}</span><span>${SC.fund1.name}</span></div>
        <div class="sc-body" id="tsBody1"></div>
      </div>
      <div class="sc-col">
        <div class="sc-col-head"><span class="sch-icon">${SC.fund2.icon}</span><span>${SC.fund2.name}</span></div>
        <div class="sc-body" id="tsBody2"></div>
      </div>
    </div>
  </div>

  <div class="fc-foot">
    <div>兩檔基金採每單位固定配息，每月實際配息金額將有所浮動；配息率不代表基金報酬率。</div>
    <div class="src">年化配息率截至 2026.02<br>基金過去績效不代表未來表現</div>
  </div>
</div>
`;

// ============================================================
// 配息級別清單 item HTML
// ============================================================
function _item(it) {
  const rate = it.rate ? `<span class="sc-rate">${it.rate}</span>` : '';
  return `<div class="sc-item"><span class="sc-code">${it.code}</span><span class="sc-name">${it.name}</span>${rate}</div>`;
}
function _bodyHTML(fund) {
  const front = fund.front.filter(it => checked.has(it.code));
  const back  = fund.back.filter(it => checked.has(it.code));
  let h = '';
  if (front.length) h += `<span class="sc-glabel front">前收型</span>` + front.map(_item).join('');
  if (back.length)  h += `<span class="sc-glabel back">後收型</span>`  + back.map(_item).join('');
  if (!h) h = `<div style="padding:12px 0;color:#9298a4;font-size:13px">（未勾選任何級別）</div>`;
  return h;
}

// ============================================================
// 渲染海報的配息級別
// ============================================================
export function update() {
  const b1 = document.getElementById('tsBody1');
  const b2 = document.getElementById('tsBody2');
  if (b1) b1.innerHTML = _bodyHTML(SC.fund1);
  if (b2) b2.innerHTML = _bodyHTML(SC.fund2);
}

// ============================================================
// ③ 控制面板：配息級別代碼勾選
// ============================================================
function _checkGroup(title, items) {
  return `<div style="font-size:11px;font-weight:700;color:var(--ink);letter-spacing:.5px;margin:14px 0 6px">${title}</div>`
    + `<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">`
    + items.map(it => `
      <label style="display:flex;align-items:center;gap:7px;padding:7px 9px;border:1px solid var(--border);border-radius:6px;background:#fafafa;font-size:12px;color:var(--muted-text);cursor:pointer">
        <input type="checkbox" data-code="${it.code}" ${checked.has(it.code)?'checked':''} style="accent-color:var(--accent);width:14px;height:14px;flex-shrink:0">
        <span style="font-weight:700;color:var(--ink)">${it.code}</span>
        <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${it.name}${it.rate?' · '+it.rate:''}</span>
      </label>`).join('')
    + `</div>`;
}

export function renderFields(container) {
  container.innerHTML = `
    <div style="font-size:12px;color:var(--muted-text);margin-bottom:6px">勾選要呈現在「配息級別」的代碼</div>
    <div style="font-size:13px;font-weight:700;color:var(--ink);margin-top:6px">${SC.fund1.name}</div>
    ${_checkGroup('前收型', SC.fund1.front)}
    ${_checkGroup('後收型', SC.fund1.back)}
    <div style="font-size:13px;font-weight:700;color:var(--ink);margin-top:18px">${SC.fund2.name}</div>
    ${_checkGroup('前收型', SC.fund2.front)}
    ${_checkGroup('後收型', SC.fund2.back)}`;
  document.getElementById('secFields').textContent = '配息級別選擇';

  container.querySelectorAll('input[data-code]').forEach(cb =>
    cb.addEventListener('change', () => {
      if (cb.checked) checked.add(cb.dataset.code); else checked.delete(cb.dataset.code);
      update();
      if (window.scheduleRenderPreview) window.scheduleRenderPreview();
    }));
}

// ② 不需要版型/通路選擇 → 隱藏（回傳空，讓 index.html 顯示但無內容；或用 renderStep2 顯示提示）
export const STEP2_TITLE = '說明';
export function renderStep2(grid) {
  grid.innerHTML = `<div style="font-size:12px;color:var(--muted-text);line-height:1.6">此素材為固定版型；可於下方「配息級別選擇」勾選要呈現的代碼。</div>`;
}

export function renderMsg(container) {
  container.innerHTML = `
    <div class="cs-cardhead"><div class="cs-num">4</div><div class="cs-cardtitle">LINE 訊息</div></div>
    <div id="msgBox" style="background:#f7f9fc;border:1px solid var(--border);border-radius:8px;padding:14px;font-size:13px;line-height:1.75;color:var(--text);white-space:pre-wrap">🏦【霸菱 × 台新銀行 精選基金】\n\n環球非投資等級債券基金　到期殖利率 7.3%\n優先順位資產抵押債券基金　到期殖利率 7.1%\n\n完整配息級別與核心數據請見附圖 ⬇️\n＊本資料僅供參考，投資前請詳閱公開說明書</div>
    <button onclick="copyMsg()" style="margin-top:10px;width:100%;height:38px;border:1px solid var(--border);border-radius:6px;background:#fff;color:var(--text);font-size:13px;font-weight:600;cursor:pointer">📋 複製文字</button>`;
}

export async function fetchData() { update(); }
export function showPoster() { const el = document.getElementById('poster-taishin'); if (el) el.style.display = ''; update(); }
export function getActivePosterEl() { return document.getElementById('poster-taishin'); }
export function getDownloadFileName() { return '霸菱台新基金資訊表.jpg'; }
export function onDownloadClone() { /* 此版型無毛玻璃/漸層，無需特別處理 */ }
