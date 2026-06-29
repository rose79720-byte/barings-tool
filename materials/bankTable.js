// ============================================================
// 銀行基金資訊表
//   ② 通路選擇：台新 / 富邦（各自版型）
//   台新 = 精選基金核心數據（2 張基金卡 + 配息級別）；③ 可選兩檔基金 + 勾代碼
//   富邦 = 債券收益雙核心 · 全級別總覽；③ 勾選要呈現的級別代碼
//   資料先 hardcode（之後接 MoneyDJ）。
// ============================================================

const ICON = { globe:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.55)" stroke-width="1.5"/><ellipse cx="12" cy="12" rx="4.5" ry="10" stroke="rgba(255,255,255,.55)" stroke-width="1.5"/><line x1="2" y1="12" x2="22" y2="12" stroke="rgba(255,255,255,.55)" stroke-width="1.3"/></svg>`, shield:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;"><path d="M12 2.5L4 6.5v5.5c0 4.8 3.5 8.4 8 10 4.5-1.6 8-5.2 8-10V6.5L12 2.5z" stroke="rgba(255,255,255,.55)" stroke-width="1.5"/></svg>` };
const FO_ICON = { f1:`<svg width="27" height="27" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9.5" stroke="#C9A227" stroke-width="1.5"/><ellipse cx="12" cy="12" rx="4" ry="9.5" stroke="#C9A227" stroke-width="1.3"/><line x1="2.5" y1="12" x2="21.5" y2="12" stroke="#C9A227" stroke-width="1.3"/></svg>`, f2:`<svg width="27" height="27" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 9.5L12 4l9 5.5" stroke="#C9A227" stroke-width="1.5" stroke-linejoin="round"/><line x1="4" y1="20" x2="20" y2="20" stroke="#C9A227" stroke-width="1.6" stroke-linecap="round"/></svg>` };
const FO_BADGE = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7l4 4 5-7 5 7 4-4-2 13H5L3 7z" stroke="#A9822B" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
const SCHED_ICON = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="5" width="18" height="16" rx="2" stroke="#C9A227" stroke-width="1.6"/><line x1="3" y1="9" x2="21" y2="9" stroke="#C9A227" stroke-width="1.6"/></svg>`;

// ---- 台新基金主檔 ----
const FUNDS = [
  { id:'global', name:'環球非投資等級債券基金', icon:'globe', star:5,
    ytm:'7.3%', duration:'2.6 年', credit:'BB-',
    allocPct:'46%', allocType:'優先擔保 + 非投等級債券', allocSub:'美國、歐洲為主',
    perf:{ y1:'7.6%', y3:'32.4%', y5:'28.1%' },
    front:[ {code:'BEA7',name:'G 美元月配',rate:'9.3%'},{code:'BEA8',name:'G 美元累積',rate:''},
            {code:'BEA9',name:'G 澳幣避險月配',rate:'10.1%'},{code:'BEB1',name:'G 澳幣避險累積',rate:''},
            {code:'BEB2',name:'G 歐元避險月配',rate:'7.1%'},{code:'BEB3',name:'G 歐元避險累積',rate:''} ],
    back:[ {code:'BI01',name:'BM類 美元月配',rate:'11.1%'},{code:'BI02',name:'BM類 澳幣避險月配',rate:'11.5%'} ] },
  { id:'priority', name:'優先順位資產抵押債券基金', icon:'shield', star:4,
    ytm:'7.1%', duration:'2.5 年', credit:'BB-',
    allocPct:'100%', allocType:'優先順位擔保債券', allocSub:'美國、歐洲為主',
    perf:{ y1:'6.2%', y3:'27.6%', y5:'23.8%' },
    front:[ {code:'BEA1',name:'G 美元月配',rate:'8.7%'},{code:'BEA2',name:'G 美元累積',rate:''},
            {code:'BEA3',name:'G 澳幣避險月配',rate:'9.5%'},{code:'BEA4',name:'G 澳幣避險累積',rate:''},
            {code:'BEA5',name:'G 歐元避險月配',rate:'6.5%'},{code:'BEA6',name:'G 歐元避險累積',rate:''} ],
    back:[ {code:'BI03',name:'BM類 美元月配',rate:'10.3%'},{code:'BI04',name:'BM類 澳幣避險月配',rate:'10.8%'} ] },
];
const fundById = id => FUNDS.find(f => f.id === id) || FUNDS[0];

// ---- 富邦基金主檔（全級別總覽）----
const FUBON = [
  { id:'fb_global', name:'霸菱環球非投資等級債券基金', icon:'f1',
    back:[ {code:'AY03',name:'BM類美元月配息型',rate:'11.3%'},{code:'AY04',name:'BM類澳幣避險月配息型',rate:'12.0%'} ],
    front:[ {code:'BQ07',name:'G類美元月配息型',rate:'9.4%'},{code:'BQ08',name:'G類美元累積型',rate:''},
            {code:'BQ09',name:'G類澳幣避險月配息型',rate:'10.6%'},{code:'BQ10',name:'G類澳幣避險累積型',rate:''},
            {code:'BQ11',name:'G類歐元避險月配息型',rate:'7.4%'},{code:'BQ12',name:'G類歐元避險累積型',rate:''} ] },
  { id:'fb_priority', name:'霸菱優先順位資產抵押債券基金', icon:'f2',
    back:[ {code:'AY01',name:'BM類美元月配息型',rate:'10.5%'},{code:'AY02',name:'BM類澳幣避險月配息型',rate:'11.2%'} ],
    front:[ {code:'BQ01',name:'G類美元累積型',rate:''},{code:'BQ02',name:'G類美元月配息型',rate:'8.8%'},
            {code:'BQ03',name:'G類歐元避險累積型',rate:''},{code:'BQ04',name:'G類歐元避險月配息型',rate:'6.9%'},
            {code:'BQ05',name:'G類澳幣避險累積型',rate:''},{code:'BQ06',name:'G類澳幣避險月配息型',rate:'9.9%'} ] },
];

// ---- 狀態 ----
let curChannel = '台新';
let sel1 = 'global', sel2 = 'priority';
const checkedTS = new Set();
FUNDS.forEach(f => [...f.front, ...f.back].forEach(it => checkedTS.add(it.code)));
const checkedFB = new Set();
FUBON.forEach(f => [...f.front, ...f.back].forEach(it => checkedFB.add(it.code)));

export function getPoster() { return curChannel === '台新' ? { w:1080 } : { w:1080 }; }
export const FONTS = [ '700 30px "Noto Serif TC"', '700 42px "Inter"', '600 14px "Noto Sans TC"' ];

// ============================================================
// CSS
// ============================================================
export const CSS = `
#poster-taishin{ width:1080px; background:#fff; padding:44px 46px; box-sizing:border-box; }
/* 修正：富邦的全域 .nm（深色）會洩漏到台新卡片字名，強制白字 */
#poster-taishin .ch .nm{ color:#fff !important; }
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

#poster-fubon{ width:1080px; background:#fff; padding:46px 40px; box-sizing:border-box; }
.fo{
  --navy:#15294C; --navy-2:#21386B; --navy-line:rgba(255,255,255,.14);
  --teal:#16463F; --teal-2:#1E5C54;
  --gold:#A9822B; --gold-2:#C9A227; --gold-soft:#F8F1DA; --gold-border:#E4CF8E;
  --ink:#16294B; --body:#3A4456; --muted:#7B8494; --line:#E7E9EE;
  --surface:#F5F7FA; --bg:#FFFFFF;
  font-family:'Inter','Noto Sans TC',sans-serif;
  color:var(--body); -webkit-font-smoothing:antialiased;
  container-type:inline-size; width:100%;
  background:
    radial-gradient(120% 60% at 50% -10%, #EAEFF6 0%, rgba(234,239,246,0) 60%),
    linear-gradient(180deg,#EEF2F7 0%,#E7ECF3 100%);
  padding:44px clamp(16px,4cqw,56px) 40px;
}
.fo *{box-sizing:border-box;}
.fo-inner{max-width:1000px;margin:0 auto;}

/* ---- title ---- */
.fo-title{text-align:center;margin-bottom:30px;}
.fo-title h1{margin:0;font-family:'Noto Sans TC','Inter',sans-serif;font-weight:900;font-size:clamp(32px,5.4cqw,48px);color:var(--navy);letter-spacing:.06em;line-height:1.05;}
.fo-title h1 .em{color:var(--gold);}
.fo-sub{display:flex;align-items:center;justify-content:center;gap:16px;margin-top:16px;color:var(--navy);font-size:clamp(14px,1.9cqw,17px);font-weight:600;letter-spacing:.14em;}
.fo-sub .fl{height:1px;width:clamp(34px,7cqw,72px);background:linear-gradient(90deg,rgba(169,130,43,0),var(--gold-2));}
.fo-sub .fl.r{background:linear-gradient(90deg,var(--gold-2),rgba(169,130,43,0));}
.fo-sub .dia{width:6px;height:6px;background:var(--gold-2);transform:rotate(45deg);flex:none;}

/* ---- fund card ---- */
.fund{background:var(--bg);border:1px solid var(--line);border-radius:14px;box-shadow:0 2px 14px rgba(16,32,64,.07);overflow:hidden;margin-bottom:26px;}
.fund-head{display:flex;align-items:center;gap:16px;flex-wrap:wrap;background:var(--navy);padding:18px 22px;}
.fund2 .fund-head{background:var(--navy);}
.fo.accent-teal .fund2 .fund-head{background:linear-gradient(115deg,var(--teal),var(--teal-2));}
.fh-icon{flex:none;width:48px;height:48px;border-radius:12px;border:1.5px solid var(--gold-border);background:rgba(201,162,39,.10);display:flex;align-items:center;justify-content:center;}
.fh-name{font-family:'Noto Sans TC','Inter',sans-serif;color:#fff;font-weight:700;font-size:clamp(18px,2.5cqw,23px);letter-spacing:.02em;line-height:1.2;flex:1;min-width:0;}
.fh-badge{display:inline-flex;align-items:center;gap:7px;background:var(--gold-soft);border:1px solid var(--gold-border);color:var(--navy);font-size:13px;font-weight:700;padding:7px 13px;border-radius:8px;white-space:nowrap;}

.cols{display:grid;grid-template-columns:96px 1fr auto;align-items:center;gap:12px;padding:11px 24px;background:var(--surface);border-bottom:1px solid var(--line);font-size:12px;font-weight:600;color:var(--muted);letter-spacing:.04em;}
.cols .c3{text-align:right;}

.grp{padding:15px 24px 5px;}
.glabel{display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:700;letter-spacing:.04em;padding:5px 13px;border-radius:7px;color:#fff;white-space:nowrap;}
.glabel.back{background:var(--navy);}
.glabel.front{background:var(--navy);}
.glabel .sub{font-weight:500;color:rgba(255,255,255,.7);font-size:12px;}
.fo.accent-teal .fund2 .glabel.back,.fo.accent-teal .fund2 .glabel.front{background:var(--teal-2);}

.rows{padding:2px 24px 8px;}
.row{display:grid;grid-template-columns:96px 1fr auto;align-items:center;gap:12px;padding:11px 0;border-bottom:1px dashed var(--line);}
.row:last-child{border-bottom:none;}
.code{display:inline-flex;align-items:center;justify-content:center;height:30px;padding:0 10px;border-radius:8px;font-size:13px;font-weight:700;letter-spacing:.04em;font-variant-numeric:tabular-nums;background:var(--gold-soft);border:1.5px solid var(--gold-border);color:var(--gold);}
.fo.code-navy .code{background:var(--navy);border-color:var(--navy);color:#fff;}
.fo.accent-teal.code-navy .fund2 .code{background:var(--teal-2);border-color:var(--teal-2);}
.nm{font-size:15px;color:var(--ink);font-weight:500;min-width:0;}
.rt{font-size:20px;font-weight:700;color:var(--navy);font-variant-numeric:tabular-nums;white-space:nowrap;text-align:right;}
.rt.dash{color:#C4CAD4;font-weight:600;}

/* ---- schedule ---- */
.sched{background:var(--bg);border:1px solid var(--line);border-radius:14px;box-shadow:0 2px 14px rgba(16,32,64,.07);overflow:hidden;margin-bottom:18px;}
.sched-head{display:flex;align-items:center;gap:10px;justify-content:center;background:var(--navy);color:#fff;padding:13px 20px;font-weight:700;font-size:15px;letter-spacing:.04em;}
.sched-head .y{color:var(--gold-2);}
.sched-row{display:grid;grid-template-columns:repeat(8,1fr);padding:18px 14px;}
.sd{display:flex;flex-direction:column;align-items:center;gap:4px;padding:4px 6px;border-right:1px solid var(--line);}
.sd:last-child{border-right:none;}
.sd b{font-size:clamp(15px,2cqw,18px);font-weight:700;color:var(--navy);font-variant-numeric:tabular-nums;}
.sd i{font-style:normal;font-size:12px;color:var(--muted);}

/* ---- footer ---- */
.fo-foot{display:flex;align-items:center;gap:13px;justify-content:center;text-align:center;background:var(--gold-soft);border:1px solid var(--gold-border);border-radius:12px;padding:15px 22px;font-size:13px;color:var(--body);line-height:1.6;}
.fo-foot .fi{flex:none;width:26px;height:26px;border-radius:50%;border:1.5px solid var(--gold);display:flex;align-items:center;justify-content:center;color:var(--gold);font-weight:700;font-size:14px;}

@container (max-width:720px){
  .sched-row{grid-template-columns:repeat(4,1fr);gap:14px 0;}
  .sd:nth-child(4n){border-right:none;}
  .fh-name{flex:1 1 100%;order:2;}
  .fh-badge{order:3;}
}
@container (max-width:460px){
  .sched-row{grid-template-columns:repeat(2,1fr);}
  .sd:nth-child(2n){border-right:none;}
  .rt{font-size:17px;}
  .cols,.row{grid-template-columns:74px 1fr auto;}
}
`;

// ============================================================
// HTML（兩個版型；卡片/級別由 update 動態填入）
// ============================================================
export const HTML = `
<div id="poster-taishin" class="fc fcv2">
  <div class="fc-top">
    <div class="fc-brand">
      <img class="fc-logo" src="./assets/barings-logo.png" alt="BARINGS">
      <div class="vr"></div><div class="fc-kicker">債券基金 · 核心比較</div>
    </div>
    <div class="fc-status"><span class="dot"></span>下次配息基準日 <b>2026/04/30</b></div>
  </div>
  <div class="fc-titlewrap">
    <span class="fc-tag"><b>特選一</b> · 2026 Q2 活動基金</span>
    <h1 class="fc-h1">精選基金 · 核心數據一覽</h1>
    <p class="fc-sub">每月配息，前收後收均有，核心數據一次完整呈現。</p>
  </div>
  <div class="cards" id="tsCards"></div>
  <div class="sc">
    <div class="sc-head"><h3>配息級別</h3><span class="rule"></span><span class="note">年化配息率 · 截至 2026.02</span></div>
    <div class="sc-grid" id="tsScGrid"></div>
  </div>
  <div class="fc-foot">
    <div>兩檔基金採每單位固定配息，每月實際配息金額將有所浮動；配息率不代表基金報酬率。</div>
    <div class="src">年化配息率截至 2026.02<br>基金過去績效不代表未來表現</div>
  </div>
</div>

<div id="poster-fubon" style="display:none">
  <div class="fo">
    <div class="fo-inner">
      <div class="fo-title">
        <h1>債券收益<span class="em">雙核心</span> · 全級別總覽</h1>
        <div class="fo-sub"><span class="fl"></span><span class="dia"></span>多元幣別選擇 · 滿足不同投資需求<span class="dia"></span><span class="fl r"></span></div>
      </div>
      <div id="fbFund1"></div>
      <div id="fbFund2"></div>
      <div class="sched">
        <div class="sched-head">${SCHED_ICON}<span><span class="y">2026 年</span>配息基準日（5 月後）</span></div>
        <div class="sched-row"><div class="sd"><b>5/29</b><i>（五）</i></div><div class="sd"><b>6/30</b><i>（二）</i></div><div class="sd"><b>7/31</b><i>（五）</i></div><div class="sd"><b>8/28</b><i>（五）</i></div><div class="sd"><b>9/30</b><i>（三）</i></div><div class="sd"><b>10/30</b><i>（五）</i></div><div class="sd"><b>11/30</b><i>（一）</i></div><div class="sd"><b>12/31</b><i>（四）</i></div></div>
      </div>
      <div class="fo-foot"><span class="fi">i</span><span>兩檔基金皆採每單位固定配息，每月配息將有所浮動；年化配息數值為截自 2026 年 4 月資訊。</span></div>
    </div>
  </div>
</div>
`;

// ============================================================
// 台新：動態組海報
// ============================================================
function _stars(n){ let s=''; for(let i=0;i<5;i++) s += i<n?'★':'<span class="off">★</span>'; return s; }
function _card(f){
  return `<div class="card">
    <div class="ch"><div class="ft">霸菱 BARINGS</div><div class="ch-icon">${ICON[f.icon]}</div>
      <div class="nm">${f.name}</div>
      <div class="stars"><span class="ml">晨星評等</span><span class="fc-star">${_stars(f.star)}</span></div></div>
    <div class="cb">
      <div class="hero-m"><span class="big">${f.ytm}</span><span class="lab"><b>到期殖利率</b>Yield to Maturity</span></div>
      <div class="statrow"><div class="stat"><div class="k">存續期間</div><div class="v">${f.duration}</div></div><div class="stat"><div class="k">平均信評</div><div class="v">${f.credit}</div></div></div>
      <div class="alloc-block"><div class="k">資產配置</div><div class="alloc-main"><span class="alloc-pct">${f.allocPct}</span><span class="alloc-type">${f.allocType}</span></div><div class="s">${f.allocSub}</div></div>
      <div class="perf2"><div class="lab">績效表現 · 截至 2026/02/28</div><div class="grid"><div><div class="k">1 年</div><div class="v">${f.perf.y1}</div></div><div><div class="k">3 年</div><div class="v">${f.perf.y3}</div></div><div><div class="k">5 年</div><div class="v">${f.perf.y5}</div></div></div></div>
    </div></div>`;
}
function _scItem(it){ const r = it.rate?`<span class="sc-rate">${it.rate}</span>`:''; return `<div class="sc-item"><span class="sc-code">${it.code}</span><span class="sc-name">${it.name}</span>${r}</div>`; }
function _scCol(f){
  const fr = f.front.filter(it=>checkedTS.has(it.code)), bk = f.back.filter(it=>checkedTS.has(it.code));
  let b=''; if(fr.length) b+=`<span class="sc-glabel front">前收型</span>`+fr.map(_scItem).join('');
  if(bk.length) b+=`<span class="sc-glabel back">後收型</span>`+bk.map(_scItem).join('');
  if(!b) b=`<div style="padding:12px 0;color:#9298a4;font-size:13px">（未勾選任何級別）</div>`;
  return `<div class="sc-col"><div class="sc-col-head"><span class="sch-icon">${ICON[f.icon]}</span><span>${f.name}</span></div><div class="sc-body">${b}</div></div>`;
}
function _updateTS(){
  const f1=fundById(sel1), f2=fundById(sel2);
  const c=document.getElementById('tsCards'), g=document.getElementById('tsScGrid');
  if(c) c.innerHTML=_card(f1)+_card(f2);
  if(g) g.innerHTML=_scCol(f1)+_scCol(f2);
}

// ============================================================
// 富邦：動態組海報
// ============================================================
function _foRow(it){ const dash = it.rate?'':' dash'; return `<div class="row"><span class="code">${it.code}</span><span class="nm">${it.name}</span><span class="rt${dash}">${it.rate||'—'}</span></div>`; }
function _foFund(f){
  const bk=f.back.filter(it=>checkedFB.has(it.code)), fr=f.front.filter(it=>checkedFB.has(it.code));
  let body='';
  if(bk.length) body+=`<div class="grp"><span class="glabel back">後收級別<span class="sub">BM 類</span></span></div><div class="rows">${bk.map(_foRow).join('')}</div>`;
  if(fr.length) body+=`<div class="grp"><span class="glabel front">前收級別<span class="sub">G 類</span></span></div><div class="rows">${fr.map(_foRow).join('')}</div>`;
  if(!bk.length && !fr.length) body=`<div style="padding:14px 4px;color:#9298a4;font-size:14px">（未勾選任何級別）</div>`;
  const cls = f.id==='fb_global' ? 'fund fund1' : 'fund fund2';
  return `<div class="${cls}">
    <div class="fund-head"><span class="fh-icon">${FO_ICON[f.icon]}</span><span class="fh-name">${f.name}</span><span class="fh-badge">${FO_BADGE}富邦核心層次 · 收益型</span></div>
    <div class="cols"><span class="c1">級別</span><span class="c2">配息級別名稱</span><span class="c3">約莫配息 %（年化）</span></div>
    ${body}</div>`;
}
function _updateFB(){
  const a=document.getElementById('fbFund1'), b=document.getElementById('fbFund2');
  if(a) a.innerHTML = _foFund(FUBON[0]);
  if(b) b.innerHTML = _foFund(FUBON[1]);
}

export function update(){ curChannel==='台新' ? _updateTS() : _updateFB(); }

// ============================================================
// ② 通路選擇
// ============================================================
export const STEP2_TITLE = '通路選擇';
export function renderStep2(grid){
  const row=document.createElement('div'); row.style.cssText='display:flex;gap:10px';
  ['台新','富邦'].forEach(ch => row.appendChild(window.step2BigButton({ label:ch, active:ch===curChannel, onclick:()=>window.onChannelChange(ch) })));
  grid.appendChild(row);
}

// ============================================================
// ③ 控制面板
// ============================================================
function _fundSelect(id, selId, label){
  const opts = FUNDS.map(f=>`<option value="${f.id}" ${f.id===selId?'selected':''}>${f.name}</option>`).join('');
  return `<div style="margin-bottom:12px"><label style="font-size:12px;font-weight:600;color:var(--ink);display:block;margin-bottom:6px">${label}</label><select id="${id}" style="width:100%;height:38px;border:1px solid var(--border);border-radius:6px;padding:0 10px;font-size:13px;font-weight:600;color:var(--ink);background:#fff;font-family:inherit;outline:none;cursor:pointer">${opts}</select></div>`;
}
// 勾選格（只顯示名稱，不顯示下單代碼，維持面板乾淨）
function _checkGroup(title, items, set){
  return `<div style="font-size:11px;font-weight:700;color:var(--ink);letter-spacing:.5px;margin:12px 0 6px">${title}</div>`
    + `<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">`
    + items.map(it=>`<label style="display:flex;align-items:center;gap:7px;padding:7px 9px;border:1px solid var(--border);border-radius:6px;background:#fafafa;font-size:12px;color:var(--ink);font-weight:500;cursor:pointer"><input type="checkbox" data-code="${it.code}" ${set.has(it.code)?'checked':''} style="accent-color:var(--accent);width:14px;height:14px;flex-shrink:0"><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${it.name}</span></label>`).join('')
    + `</div>`;
}
function _wireChecks(container, set){
  container.querySelectorAll('input[data-code]').forEach(cb =>
    cb.addEventListener('change', ()=>{ cb.checked?set.add(cb.dataset.code):set.delete(cb.dataset.code); update(); _preview(); }));
}
function _preview(){ if(window.scheduleRenderPreview) window.scheduleRenderPreview(); }

export function renderFields(container){
  if(curChannel==='台新'){
    const f1=fundById(sel1), f2=fundById(sel2);
    container.innerHTML = `
      <div style="font-size:12px;color:var(--muted-text);margin-bottom:10px">選擇呈現的兩檔基金</div>
      ${_fundSelect('tsFund1','TS1','基金 ①')}
      ${_fundSelect('tsFund2','TS2','基金 ②')}
      <div style="border-top:1px solid #f1f3f6;margin:6px 0 2px"></div>
      <div style="font-size:12px;color:var(--muted-text);margin:10px 0 2px">勾選要呈現在「配息級別」的項目</div>
      <div style="font-size:13px;font-weight:700;color:var(--ink);margin-top:8px">${f1.name}</div>
      ${_checkGroup('前收型', f1.front, checkedTS)}${_checkGroup('後收型', f1.back, checkedTS)}
      <div style="font-size:13px;font-weight:700;color:var(--ink);margin-top:16px">${f2.name}</div>
      ${_checkGroup('前收型', f2.front, checkedTS)}${_checkGroup('後收型', f2.back, checkedTS)}`;
    document.getElementById('secFields').textContent='基金與配息級別';
    const s1=container.querySelector('#tsFund1'); if(s1){ s1.value=sel1; s1.addEventListener('change',()=>{ sel1=s1.value; renderFields(container); _preview(); }); }
    const s2=container.querySelector('#tsFund2'); if(s2){ s2.value=sel2; s2.addEventListener('change',()=>{ sel2=s2.value; renderFields(container); _preview(); }); }
    _wireChecks(container, checkedTS);
  } else {
    container.innerHTML = `
      <div style="font-size:12px;color:var(--muted-text);margin-bottom:8px">勾選要呈現在「全級別總覽」的項目</div>
      ${FUBON.map(f=>`<div style="font-size:13px;font-weight:700;color:var(--ink);margin-top:14px">${f.name}</div>${_checkGroup('後收級別 BM 類', f.back, checkedFB)}${_checkGroup('前收級別 G 類', f.front, checkedFB)}`).join('')}`;
    document.getElementById('secFields').textContent='配息級別選擇';
    _wireChecks(container, checkedFB);
  }
  update();
}

// ============================================================
// 通路切換 / 顯示 / 其他契約
// ============================================================
export async function onChannelChange(channel){
  curChannel = channel;
  renderStep2(_clear(document.getElementById('tplGrid')));
  renderFields(document.getElementById('fieldsContainer'));
  showPoster(); update();
}
function _clear(el){ if(el) el.innerHTML=''; return el; }
export async function fetchData(){ update(); }

export function renderMsg(container){
  container.innerHTML = `
    <div class="cs-cardhead"><div class="cs-num">4</div><div class="cs-cardtitle">LINE 訊息</div></div>
    <div id="msgBox" style="background:#f7f9fc;border:1px solid var(--border);border-radius:8px;padding:14px;font-size:13px;line-height:1.75;color:var(--text);white-space:pre-wrap">🏦【霸菱 × ${curChannel}銀行 基金資訊】\n\n精選基金核心數據與配息級別一覽，詳見附圖 ⬇️\n＊本資料僅供參考，投資前請詳閱公開說明書</div>
    <button onclick="copyMsg()" style="margin-top:10px;width:100%;height:38px;border:1px solid var(--border);border-radius:6px;background:#fff;color:var(--text);font-size:13px;font-weight:600;cursor:pointer">📋 複製文字</button>`;
}

export function showPoster(){
  const ts=document.getElementById('poster-taishin'), fb=document.getElementById('poster-fubon');
  if(ts) ts.style.display = curChannel==='台新' ? '' : 'none';
  if(fb) fb.style.display = curChannel==='富邦' ? '' : 'none';
  update();
}
export function getActivePosterEl(){ return document.getElementById(curChannel==='台新' ? 'poster-taishin' : 'poster-fubon'); }
export function getDownloadFileName(){ return `霸菱${curChannel}基金資訊表.jpg`; }
export function onDownloadClone(){ /* 無毛玻璃/漸層 */ }
