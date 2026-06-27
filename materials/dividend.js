// ============================================================
// 配息提醒 素材模組
// 新增版型：在 CSS / HTML 兩處加入對應內容，並更新 manifest.json
// ============================================================

export const CSS = `
/* --- Dawn theme --- */
.sky{position:absolute;inset:0;background:linear-gradient(180deg,#8aa4d4 0%,#b0c0dc 18%,#d8c8d4 35%,#f0d4c0 52%,#fde0b4 65%,#fff0d4 78%,#fff8e6 90%,#fffaf0 100%)}
.sun-aura{position:absolute;width:1100px;height:1100px;border-radius:50%;left:50%;top:40%;transform:translate(-50%,-30%);background:radial-gradient(circle,rgba(255,230,180,.6) 0%,rgba(255,200,150,.3) 20%,rgba(255,180,120,.15) 40%,transparent 65%)}
.sun-disc{position:absolute;width:360px;height:360px;border-radius:50%;left:50%;top:38%;transform:translateX(-50%);background:radial-gradient(circle,#fff 0%,#fff8e0 25%,#ffe9b0 50%,rgba(255,180,120,.6) 75%,transparent 100%);box-shadow:0 0 200px 60px rgba(255,220,150,.5);z-index:1}
.clouds{position:absolute;left:0;right:0;top:18%;height:280px;z-index:2}
.cloud{position:absolute;height:14px;background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,.5) 30%,rgba(255,255,255,.85) 50%,rgba(255,255,255,.5) 70%,transparent 100%);border-radius:50%;filter:blur(3px)}
.c1{width:380px;top:40px;left:10%}
.c2{width:280px;top:100px;right:8%;height:10px;opacity:.85}
.c3{width:320px;top:170px;left:18%;height:12px;opacity:.7}
.c4{width:240px;top:230px;right:22%;height:8px;opacity:.6}
.birds{position:absolute;top:30%;left:15%;z-index:3;opacity:.5}
.sun-rays{position:absolute;width:1400px;height:1400px;left:50%;bottom:-40%;transform:translateX(-50%);opacity:.4}
.grain{position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");opacity:.5;mix-blend-mode:overlay;pointer-events:none;z-index:5}
.poster-content{position:relative;z-index:10;height:100%;display:flex;flex-direction:column;padding:52px 60px 44px}
.top-logo-wrap{text-align:center;margin-bottom:10px}
.top-logo{display:inline-block;width:300px;height:auto}
.month-header{text-align:center;margin-bottom:4px}
.month-label{display:inline-flex;align-items:center;gap:14px;font-family:'Cormorant Garamond',serif;font-size:24px;color:#a17536;letter-spacing:6px;font-weight:600;font-style:italic;margin-bottom:4px}
.month-label::before,.month-label::after{content:'';width:36px;height:1px;background:#a17536}
.hero-title{font-family:'Noto Serif TC',serif;font-size:84px;font-weight:900;color:#2a3556;letter-spacing:14px;line-height:1;text-indent:14px;text-shadow:0 4px 30px rgba(255,244,224,.8)}
.date-hero{text-align:center;margin-top:14px}
.date-prefix{font-size:28px;color:#4a5578;letter-spacing:10px;font-weight:500;margin-bottom:6px;text-indent:10px}
#poster .date-big{font-family:'Fraunces','Cormorant Garamond',serif;font-size:224px;font-weight:700;line-height:.85;letter-spacing:-8px;display:inline-flex;align-items:center;background:linear-gradient(180deg,#2a3556 0%,#4a4878 40%,#b0623a 80%,#d49a4a 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 6px 30px rgba(255,220,150,.5))}
#poster .date-big .slash{font-size:188px;font-weight:300;-webkit-text-fill-color:#ff8a6b;margin:0 4px;font-style:italic}
.date-weekday{font-size:36px;color:#ff8a6b;font-weight:700;letter-spacing:4px;margin-top:-4px;text-indent:4px}
.funds{margin-top:auto;display:grid;grid-template-columns:1fr 1fr;gap:24px;padding-top:22px}
.fund-card{background:linear-gradient(160deg,rgba(255,255,255,.7) 0%,rgba(255,255,255,.45) 50%,rgba(255,248,230,.4) 100%);backdrop-filter:blur(20px) saturate(1.4);border-radius:28px;padding:22px 22px 24px;box-shadow:0 20px 50px rgba(110,120,152,.25),inset 0 1px 0 rgba(255,255,255,.9);border:1.5px solid rgba(255,255,255,.85);overflow:hidden;text-align:center}
.fund-head{display:flex;flex-direction:column;align-items:center;gap:10px;margin-bottom:10px;position:relative;z-index:2}
.fund-icon{width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#fff8e0,#ffd896);box-shadow:0 4px 12px rgba(212,154,74,.25);display:flex;align-items:center;justify-content:center}
.fund-icon svg{width:26px;height:26px;color:#a17536}
.fund-name{font-size:30px;font-weight:700;color:#2a3556;letter-spacing:2px;line-height:1.3;text-align:center}
.fund-body{text-align:center;position:relative;z-index:2}
.fund-rate-label{font-size:20px;color:#4a5578;letter-spacing:8px;font-weight:500;margin-bottom:4px;text-indent:8px}
.fund-rate{font-family:'Fraunces','Cormorant Garamond',serif;font-size:116px;font-weight:700;line-height:1;letter-spacing:-4px;background:linear-gradient(180deg,#2a3556 0%,#a85a4a 55%,#d49a4a 100%);-webkit-background-clip:text;background-clip:text;color:transparent;display:inline-flex;align-items:baseline;justify-content:center;filter:drop-shadow(0 4px 12px rgba(255,200,140,.3))}
.fund-rate .percent{font-size:56px;margin-left:4px;-webkit-text-fill-color:#ff8a6b}

/* ===== 夜空星光版型 ===== */
.night-bg {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 50% 0%, #1a3a8f 0%, #0d1b4b 40%, #060d2e 100%);
}
.stars-layer {
  position: absolute; inset: 0; overflow: hidden;
}
.star {
  position: absolute; background: #fff; border-radius: 50%;
  animation: twinkle var(--dur, 3s) ease-in-out infinite var(--delay, 0s);
}
@keyframes twinkle {
  0%,100% { opacity: var(--min, 0.3); transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
}
.star-cross {
  position: absolute;
  animation: crossTwinkle var(--dur, 4s) ease-in-out infinite var(--delay, 0s);
}
.star-cross::before, .star-cross::after {
  content: ''; position: absolute;
  background: linear-gradient(to right, transparent, #e8d5a0, transparent);
  border-radius: 2px;
}
.star-cross::before { width: var(--sz, 28px); height: 2px; top: 50%; left: 50%; transform: translate(-50%,-50%); }
.star-cross::after  { width: 2px; height: var(--sz, 28px); top: 50%; left: 50%; transform: translate(-50%,-50%); }
.cross-glow {
  position: absolute; border-radius: 50%;
  background: radial-gradient(circle, rgba(232,213,160,0.6) 0%, transparent 70%);
}
@keyframes crossTwinkle {
  0%,100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* 夜空版型內容 */
.night-content {
  position: relative; z-index: 10; height: 100%;
  display: flex; flex-direction: column;
  padding: 48px 56px 44px;
}
.night-logo-wrap { text-align: center; margin-bottom: 14px; }
.night-logo { width: 280px; height: auto; filter: brightness(0) invert(1); }

.night-month-pill {
  display: inline-block;
  border: 1.5px solid rgba(232,197,117,0.7);
  border-radius: 100px;
  padding: 5px 22px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px; color: #e8c275; letter-spacing: 5px;
  font-weight: 600; margin-bottom: 20px;
}
.night-month-wrap { text-align: center; }

.night-date-section { text-align: center; flex: 1; display: flex; flex-direction: column; justify-content: center; }
.night-date-label {
  display: flex; align-items: center; justify-content: center; gap: 16px;
  font-size: 30px; color: #c8d8f0; letter-spacing: 6px; font-weight: 500;
  margin-bottom: 8px;
}
.night-date-label::before, .night-date-label::after {
  content: ''; flex: 1; max-width: 80px; height: 1px;
  background: linear-gradient(to right, transparent, rgba(232,197,117,0.6));
}
.night-date-label::after { background: linear-gradient(to left, transparent, rgba(232,197,117,0.6)); }
.night-date-big {
  font-family: 'Fraunces', 'Cormorant Garamond', serif;
  font-size: 230px; font-weight: 700; line-height: 0.88;
  letter-spacing: -8px;
  background: linear-gradient(180deg, #ffe8a0 0%, #e8c275 35%, #c9973a 70%, #a06820 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  filter: drop-shadow(0 4px 24px rgba(232,197,117,0.4));
  display: inline-flex; align-items: center;
  justify-content: center; width: 100%;
}
.night-date-big .slash { font-size: 190px; font-weight: 300; font-style: italic; margin: 0 2px; }
.night-weekday {
  font-size: 26px; color: #c8d8f0; letter-spacing: 8px;
  font-weight: 400; margin-top: 10px;
}
.night-tagline {
  display: flex; align-items: center; justify-content: center; gap: 14px;
  font-size: 20px; color: rgba(200,216,240,0.65); letter-spacing: 6px;
  margin-top: 8px;
}
.night-tagline::before, .night-tagline::after {
  content: ''; width: 32px; height: 1px;
  background: rgba(200,216,240,0.3);
}

/* 夜空基金卡片 — 橫式 */
.night-funds { display: flex; flex-direction: column; gap: 16px; margin-top: auto; padding-top: 20px; }
.night-fund-card {
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 20px; padding: 22px 28px;
  display: flex; align-items: center; justify-content: space-between;
  backdrop-filter: blur(12px);
}
.night-fund-left { display: flex; align-items: center; gap: 16px; }
.night-fund-icon {
  width: 46px; height: 46px; border-radius: 12px; flex-shrink: 0;
  background: linear-gradient(135deg, rgba(232,197,117,0.25), rgba(232,197,117,0.1));
  border: 1px solid rgba(232,197,117,0.35);
  display: flex; align-items: center; justify-content: center;
}
.night-fund-icon svg { width: 24px; height: 24px; color: #e8c275; }
.night-fund-name { font-size: 28px; font-weight: 700; color: #e8edf8; letter-spacing: 1px; line-height: 1.2; }
.night-fund-sub { font-size: 16px; color: rgba(200,216,240,0.55); letter-spacing: 2px; margin-top: 3px; }
.night-fund-rate {
  font-family: 'Fraunces', 'Cormorant Garamond', serif;
  font-size: 86px; font-weight: 700; line-height: 1;
  background: linear-gradient(180deg, #fff 0%, #e8d5a0 50%, #c9973a 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  white-space: nowrap; letter-spacing: -2px;
  filter: drop-shadow(0 2px 8px rgba(232,197,117,0.3));
  display: flex; align-items: baseline;
}
.night-fund-rate .pct { font-size: 44px; margin-left: 2px; }

/* ===== Garamond 字型覆寫（夜空版） ===== */
/* Screenshot-matched option 1: elegant Garamond-style numerals */
.night-date-big {
  font-family: 'Cormorant Garamond','EB Garamond','Garamond','Times New Roman',serif !important;
  font-size: 238px !important;
  font-weight: 600 !important;
  line-height: 0.84 !important;
  letter-spacing: -8px !important;
  font-variant-numeric: lining-nums proportional-nums !important;
}
.night-date-big .slash {
  font-family: 'Cormorant Garamond','EB Garamond','Garamond','Times New Roman',serif !important;
  font-size: 196px !important;
  font-weight: 500 !important;
  font-style: italic !important;
  margin: 0 8px !important;
}
.night-fund-rate {
  font-family: 'Cormorant Garamond','EB Garamond','Garamond','Times New Roman',serif !important;
  font-size: 96px !important;
  font-weight: 600 !important;
  line-height: 0.95 !important;
  letter-spacing: -3px !important;
  font-variant-numeric: lining-nums proportional-nums !important;
}
.night-fund-rate .pct {
  font-family: 'Cormorant Garamond','EB Garamond','Garamond','Times New Roman',serif !important;
  font-size: 46px !important;
  font-weight: 600 !important;
  margin-left: 4px !important;
}

/* ===== 柔霧晨光版型 ===== */
#poster-rosemist {
  --bg:#f7f3f1;
      --blush:#f0d8d2;
      --blush-2:#f5e6e1;
      --rose:#d89c8f;
      --rose-deep:#c98476;
      --rose-soft:#e6b2a8;
      --ink:#353535;
      --muted:#756f6c;
      --line:#ecd6d0;
      --shadow:0 18px 32px rgba(205,170,160,.14);
      --navy:#173a72;
      --green:#2fb65e;
  width:1024px; height:1024px; position:relative; overflow:hidden;
  background:
    radial-gradient(circle at 14% 36%, rgba(240,216,210,.58) 0, rgba(240,216,210,.58) 15%, rgba(240,216,210,0) 34%),
    radial-gradient(circle at 88% 23%, rgba(245,230,225,.8) 0, rgba(245,230,225,.8) 11%, rgba(245,230,225,0) 28%),
    linear-gradient(180deg,#f9f6f4 0%, #f5f1ef 100%);
  box-shadow:0 18px 45px rgba(0,0,0,.12);
  isolation:isolate;
  flex-shrink:0;
}

    
    *{box-sizing:border-box}
    
#poster-rosemist{
      width:1024px;
      height:1024px;
      position:relative;
      overflow:hidden;
      background:
        radial-gradient(circle at 14% 36%, rgba(240,216,210,.58) 0, rgba(240,216,210,.58) 15%, rgba(240,216,210,0) 34%),
        radial-gradient(circle at 88% 23%, rgba(245,230,225,.8) 0, rgba(245,230,225,.8) 11%, rgba(245,230,225,0) 28%),
        linear-gradient(180deg,#f9f6f4 0%, #f5f1ef 100%);
      box-shadow:0 18px 45px rgba(0,0,0,.12);
      isolation:isolate;
    }
    .poster:before,
#poster-rosemist:after{
      content:"";
      position:absolute;
      border-radius:50%;
      pointer-events:none;
      z-index:0;
    }
#poster-rosemist:before{
      width:620px;height:620px;
      left:-220px;bottom:-110px;
      background:radial-gradient(circle at 62% 38%, rgba(240,214,209,.85), rgba(240,214,209,.18) 55%, rgba(240,214,209,0) 70%);
    }
#poster-rosemist:after{
      width:440px;height:440px;
      right:-150px;top:-120px;
      background:radial-gradient(circle at 40% 60%, rgba(246,233,229,.86), rgba(246,233,229,.20) 58%, rgba(246,233,229,0) 76%);
    }
    .curve-left,
#poster-rosemist .curve-right{
      position:absolute;
      border-radius:50%;
      border:2px solid rgba(255,255,255,.55);
      z-index:0;
      pointer-events:none;
      filter:drop-shadow(0 0 12px rgba(255,255,255,.28));
    }
#poster-rosemist .curve-left{width:760px;height:760px;left:-440px;bottom:-210px}
#poster-rosemist .curve-right{width:500px;height:500px;right:-270px;top:-150px}
#poster-rosemist .sparkle{
      position:absolute;
      width:64px;height:64px;
      right:92px;top:265px;
      opacity:.92;
      z-index:1;
    }
#poster-rosemist .content{
      position:relative;
      z-index:2;
      height:100%;
      padding:52px 64px 42px;
      display:flex;
      flex-direction:column;
      align-items:center;
    }
#poster-rosemist .logo-wrap{ text-align:center; }
#poster-rosemist .rm-logo{ display:inline-block; width:300px; height:auto; }
#poster-rosemist .month-pill{
      margin-top:34px;
      padding:12px 42px;
      border-radius:999px;
      background:linear-gradient(180deg,#efb5a8 0%, #e9a89b 100%);
      color:#fff;
      font-size:28px;
      font-weight:500;
      letter-spacing:3px;
      line-height:1;
      box-shadow:0 10px 20px rgba(225,172,158,.18), inset 0 1px 0 rgba(255,255,255,.38);
    }
#poster-rosemist .label-row{
      margin-top:44px;
      display:flex;
      align-items:center;
      gap:24px;
      color:var(--rose-deep);
    }
    .label-row:before,
#poster-rosemist .label-row:after{
      content:"";
      width:92px;
      height:1px;
      background:linear-gradient(90deg, rgba(236,214,208,0) 0%, rgba(236,214,208,1) 100%);
    }
#poster-rosemist .label-row:after{
      background:linear-gradient(90deg, rgba(236,214,208,1) 0%, rgba(236,214,208,0) 100%);
    }
#poster-rosemist .label-row .diamond{
      width:6px;height:6px;border-radius:2px;background:var(--rose-soft);transform:rotate(45deg);
    }
#poster-rosemist .label-text{
      font-family:'Cormorant Garamond',serif;
      font-size:34px;
      letter-spacing:12px;
      margin-left:12px;
    }
#poster-rosemist .date-block{
      margin-top:10px;
      text-align:center;
      position:relative;
    }
#poster-rosemist .date-big{
      font-family:'Cormorant Garamond',serif;
      color:var(--rose-deep);
      font-size:255px;
      line-height:.9;
      font-weight:600;
      letter-spacing:-8px;
      text-shadow:0 2px 0 rgba(255,255,255,.42);
      white-space:nowrap;
    }
#poster-rosemist .date-big .slash{
      font-size:.86em;
      font-weight:500;
      font-style:italic;
      margin:0 12px;
      opacity:.92;
    }
#poster-rosemist .weekday{
      margin-top:16px;
      color:var(--rose-deep);
      font-size:42px;
      font-weight:900;
      letter-spacing:12px;
      line-height:1;
      padding-left:12px;
    }
#poster-rosemist .cards{
      width:100%;
      margin-top:auto;
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:36px;
      align-items:end;
      padding:0 10px 18px;
    }
#poster-rosemist .card{
      position:relative;
      min-height:322px;
      background:linear-gradient(180deg, rgba(255,255,255,.62) 0%, rgba(250,245,243,.96) 100%);
      border-radius:30px;
      border:1.5px solid rgba(255,255,255,.72);
      box-shadow:var(--shadow), inset 0 1px 0 rgba(255,255,255,.92);
      padding:68px 34px 28px;
      display:flex;
      flex-direction:column;
      justify-content:flex-start;
      align-items:center;
      backdrop-filter: blur(4px);
      text-align:center;
    }
#poster-rosemist .card:before{
      content:"";
      position:absolute;
      left:50%; top:0;
      transform:translate(-50%,-50%);
      width:76px;height:76px;
      border-radius:50%;
      background:linear-gradient(180deg,#efbcae 0%, #e6a493 100%);
      box-shadow:0 8px 16px rgba(214,161,147,.18), inset 0 1px 0 rgba(255,255,255,.6);
      border:4px solid rgba(255,255,255,.92);
    }
#poster-rosemist .icon{
      position:absolute;
      left:50%; top:0;
      transform:translate(-50%,-50%);
      width:76px;height:76px;
      display:flex;
      align-items:center;
      justify-content:center;
      color:#fff;
      z-index:2;
    }
#poster-rosemist .icon svg{width:34px;height:34px;display:block}
#poster-rosemist .fund-name{
      font-size:28px;
      font-weight:900;
      color:#333;
      line-height:1.35;
      letter-spacing:2px;
      white-space:nowrap;
    }
#poster-rosemist .fund-divider{
      width:64px;height:2px;border-radius:2px;
      background:linear-gradient(90deg, rgba(217,151,139,.18), rgba(217,151,139,.82), rgba(217,151,139,.18));
      margin:18px auto 16px;
    }
#poster-rosemist .fund-sub{
      color:var(--rose-deep);
      font-size:24px;
      font-weight:500;
      letter-spacing:8px;
      padding-left:8px;
      margin-bottom:10px;
    }
#poster-rosemist .rate{
      margin-top:auto;
      font-family:'Cormorant Garamond',serif;
      color:var(--rose-deep);
      font-size:110px;
      line-height:.95;
      font-weight:600;
      letter-spacing:-5px;
      white-space:nowrap;
    }
#poster-rosemist .rate .pct{font-size:.62em; margin-left:2px}
#poster-rosemist .footer-line{
      position:absolute;
      left:0;right:0;bottom:56px;
      height:1px;
      background:linear-gradient(90deg, rgba(224,191,183,.62) 0%, rgba(224,191,183,0) 12%, rgba(224,191,183,0) 88%, rgba(224,191,183,.62) 100%);
      z-index:1;
    }
`;

export const HTML = `
      <div id="poster">
        <div class="sky"></div>
        <div class="sun-aura"></div>
        <div class="sun-disc"></div>
        <div class="clouds">
          <div class="cloud c1"></div><div class="cloud c2"></div>
          <div class="cloud c3"></div><div class="cloud c4"></div>
        </div>
        <div class="birds">
          <svg viewBox="0 0 90 30" fill="none" stroke="#5a6280" stroke-width="1.5" stroke-linecap="round" width="90" height="30">
            <path d="M5 18 Q12 10 18 18 Q25 10 32 18"/><path d="M50 12 Q56 6 62 12 Q68 6 74 12" opacity=".7"/>
          </svg>
        </div>
        <svg class="sun-rays" viewBox="0 0 1400 1400" xmlns="http://www.w3.org/2000/svg">
          <defs><linearGradient id="ray" x1=".5" y1="0" x2=".5" y2="1"><stop offset="0%" stop-color="#ffb878" stop-opacity="0"/><stop offset="40%" stop-color="#ffd896" stop-opacity=".3"/><stop offset="100%" stop-color="#fff0c4" stop-opacity="0"/></linearGradient></defs>
          <g transform="translate(700,700)" opacity=".5">
            <path d="M0 -700 L40 -50 L-40 -50 Z" fill="url(#ray)"/>
            <path d="M0 -700 L40 -50 L-40 -50 Z" fill="url(#ray)" transform="rotate(20)"/>
            <path d="M0 -700 L40 -50 L-40 -50 Z" fill="url(#ray)" transform="rotate(-20)"/>
            <path d="M0 -700 L40 -50 L-40 -50 Z" fill="url(#ray)" transform="rotate(40)"/>
            <path d="M0 -700 L40 -50 L-40 -50 Z" fill="url(#ray)" transform="rotate(-40)"/>
            <path d="M0 -700 L40 -50 L-40 -50 Z" fill="url(#ray)" transform="rotate(60)"/>
            <path d="M0 -700 L40 -50 L-40 -50 Z" fill="url(#ray)" transform="rotate(-60)"/>
          </g>
        </svg>
        <div class="grain"></div>
        <div class="poster-content">
          <div class="top-logo-wrap">
            <img class="top-logo" src="./assets/barings-logo.png" alt="BARINGS">
          </div>
          <div class="month-header">
            <div class="month-label" id="pMonthLabel">MAY · 2026</div>
            <div class="hero-title" id="pTitle">五月配息</div>
          </div>
          <div class="date-hero">
            <div class="date-prefix">配 息 基 準 日</div>
            <div class="date-big">
              <span id="pM">5</span><span class="slash">/</span><span id="pD">29</span>
            </div>
            <div class="date-weekday" id="pWD">星 期 五</div>
          </div>
          <div class="funds">
            <div class="fund-card">
              <div class="fund-head">
                <div class="fund-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="1.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg></div>
                <div class="fund-name">霸菱優先順位資產抵押債</div>
              </div>
              <div class="fund-body">
                <div class="fund-rate-label">年 化 約</div>
                <div class="fund-rate"><span id="pR1">10.46</span><span class="percent">%</span></div>
              </div>
            </div>
            <div class="fund-card">
              <div class="fund-head">
                <div class="fund-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="9" ry="3.5"/><path d="M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/></svg></div>
                <div class="fund-name">霸菱環球非投資等級債</div>
              </div>
              <div class="fund-body">
                <div class="fund-rate-label">年 化 約</div>
                <div class="fund-rate"><span id="pR2">11.25</span><span class="percent">%</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

        <div id="poster-starlight" style="display:none;width:1024px;height:1024px;position:relative;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,.3);">
          <div class="night-bg"></div>
          <div class="stars-layer" id="starsLayer"></div>
          <div class="night-content">
            <div class="night-logo-wrap">
              <img class="night-logo" src="./assets/barings-logo.png" alt="BARINGS">
            </div>
            <div class="night-month-wrap">
              <div class="night-month-pill" id="nMonthLabel">MAY · 2026</div>
            </div>
            <div class="night-date-section">
              <div class="night-date-label">配 息 基 準 日</div>
              <div class="night-date-big">
                <span id="nM">5</span><span class="slash">/</span><span id="nD">29</span>
              </div>
              <div class="night-weekday" id="nWD">星 期 五</div>
              <div class="night-tagline">月月收息&nbsp;&nbsp;日日安心</div>
            </div>
            <div class="night-funds">
              <div class="night-fund-card">
                <div class="night-fund-left">
                  <div class="night-fund-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="1.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
                  </div>
                  <div>
                    <div class="night-fund-name">霸菱優先順位資產抵押債基金</div>
                    <div class="night-fund-sub">年化配息率約</div>
                  </div>
                </div>
                <div class="night-fund-rate"><span id="nR1">10.4</span><span class="pct">%</span></div>
              </div>
              <div class="night-fund-card">
                <div class="night-fund-left">
                  <div class="night-fund-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="9" ry="3.5"/><path d="M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/></svg>
                  </div>
                  <div>
                    <div class="night-fund-name">霸菱環球非投資等級債基金</div>
                    <div class="night-fund-sub">年化配息率約</div>
                  </div>
                </div>
                <div class="night-fund-rate"><span id="nR2">11.2</span><span class="pct">%</span></div>
              </div>
            </div>
          </div>
        </div>

        <div id="poster-rosemist" style="display:none;width:1024px;height:1024px;position:relative;overflow:hidden;flex-shrink:0;">
    <div class="curve-left"></div>
    <div class="curve-right"></div>
    <svg class="sparkle" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M32 6L35.7 28.3L58 32L35.7 35.7L32 58L28.3 35.7L6 32L28.3 28.3L32 6Z" fill="rgba(255,255,255,.7)"/>
      <path d="M32 14L34.5 29.5L50 32L34.5 34.5L32 50L29.5 34.5L14 32L29.5 29.5L32 14Z" fill="rgba(255,255,255,.95)"/>
    </svg>

    <div class="content">
      <div class="logo-wrap">
        <img class="rm-logo" src="./assets/barings-logo.png" alt="BARINGS">
      </div>

      <div class="month-pill" id="rmMonthLabel">MAY • 2026</div>

      <div class="label-row">
        <span class="diamond"></span>
        <div class="label-text">配 息 基 準 日</div>
        <span class="diamond"></span>
      </div>

      <div class="date-block">
        <div class="date-big"><span id="rmDateNum">5</span><span class="slash">/</span><span id="rmDateNum2">29</span></div>
        <div class="weekday" id="rmWeekday">星 期 五</div>
      </div>

      <div class="cards">
        <div class="card">
          <div class="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3.5L18 6V11.5C18 15.2 15.8 18.2 12 20C8.2 18.2 6 15.2 6 11.5V6L12 3.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
              <path d="M9.3 11.8L11.2 13.7L14.9 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="fund-name">霸菱優先順位資產抵押債基金</div>
          <div class="fund-divider"></div>
          <div class="fund-sub">年化配息率約</div>
          <div class="rate"><span id="rmRate1">10.4</span><span class="pct">%</span></div>
        </div>

        <div class="card">
          <div class="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.8"/>
              <path d="M4 12H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <path d="M12 4C14.5 6.2 16 9 16 12C16 15 14.5 17.8 12 20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <path d="M12 4C9.5 6.2 8 9 8 12C8 15 9.5 17.8 12 20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="fund-name">霸菱環球非投資等級債基金</div>
          <div class="fund-divider"></div>
          <div class="fund-sub">年化配息率約</div>
          <div class="rate"><span id="rmRate2">11.2</span><span class="pct">%</span></div>
        </div>
      </div>
    </div>
    <div class="footer-line"></div>
  </div>
        <!-- WIP poster -->
`;

// ============================================================
// 月份名稱
// ============================================================
const MZH = ['一','二','三','四','五','六','七','八','九','十','十一','十二'];
const MEN = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

// ============================================================
// 渲染表單欄位
// ============================================================
export function renderFields(container) {
  container.innerHTML = `
    <div class="data-card">
      <div class="data-row">
        <span class="data-label">配息基準日</span>
        <div>
          <input class="data-input" id="inDate" value="讀取中…"
            oninput="updatePoster()" style="width:120px">
        </div>
      </div>
      <div class="data-row">
        <span class="data-label">星期</span>
        <input class="data-input" id="inWeekday" value="…"
          oninput="updatePoster()" style="width:60px;text-align:center">
      </div>
      <div class="data-row">
        <span class="data-label">霸菱優先順位資產抵押債</span>
        <div>
          <input class="data-input" id="inRate1" value="…"
            oninput="updatePoster()" style="width:90px">
          <div class="data-sub" id="sub1"></div>
        </div>
      </div>
      <div class="data-row">
        <span class="data-label">霸菱環球非投資等級債</span>
        <div>
          <input class="data-input" id="inRate2" value="…"
            oninput="updatePoster()" style="width:90px">
          <div class="data-sub" id="sub2"></div>
        </div>
      </div>
    </div>`;
  document.getElementById('secFields').textContent = '③ 資料填寫（可手動修改）';
}

// ============================================================
// 渲染 LINE 罐頭文字區
// ============================================================
export function renderMsg(container) {
  container.innerHTML = `
    <div class="sec-title">⑤ LINE 罐頭文字</div>
    <div class="msg-box" id="msgBox">讀取中…</div>
    <div class="btn-row">
      <button class="btn btn-copy" onclick="copyMsg()">📋 複製文字</button>
    </div>`;
}

// ============================================================
// 從 API 取得資料並填入表單
// ============================================================
export async function fetchData(SCRIPT) {
  const r = await fetch(SCRIPT + '?action=getAll');
  const d = await r.json();
  document.getElementById('inDate').value    = d.date          || '';
  document.getElementById('inWeekday').value = d.weekday       || '';
  document.getElementById('inRate1').value   = d.fund1?.rate   || '';
  document.getElementById('inRate2').value   = d.fund2?.rate   || '';
  const s1 = document.getElementById('sub1');
  const s2 = document.getElementById('sub2');
  if (s1) s1.textContent = d.fund1?.asOf ? '資料日期：' + d.fund1.asOf : '';
  if (s2) s2.textContent = d.fund2?.asOf ? '資料日期：' + d.fund2.asOf : '';
  update();
}

// ============================================================
// 更新海報內容
// ============================================================
export function update() {
  const dateEl = document.getElementById('inDate');
  if (!dateEl) return;
  const date  = dateEl.value.trim();
  const wd    = document.getElementById('inWeekday')?.value.trim() || '';
  const r1    = document.getElementById('inRate1')?.value.trim()   || '';
  const r2    = document.getElementById('inRate2')?.value.trim()   || '';
  const parts = date.split('/');
  const mi    = parseInt(parts[0]) - 1;
  const day   = parts[1] || '??';
  const yr    = new Date().getFullYear();
  const set   = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };

  // Dawn
  set('pMonthLabel', (MEN[mi] || '???') + ' · ' + yr);
  set('pTitle',  (MZH[mi] || '?') + '月配息');
  set('pM',  parts[0] || '?');
  set('pD',  day);
  set('pWD', '星 期 ' + wd);
  set('pR1', r1);
  set('pR2', r2);
  // Starlight
  set('nMonthLabel', (MEN[mi] || '???') + ' · ' + yr);
  set('nM',  parts[0] || '?');
  set('nD',  day);
  set('nWD', '星 期 ' + wd);
  set('nR1', r1);
  set('nR2', r2);
  // Rose Mist
  set('rmMonthLabel', (MEN[mi] || '???') + ' · ' + yr);
  set('rmDateNum',  parts[0] || '?');
  set('rmDateNum2', day);
  set('rmWeekday', '星 期 ' + wd);
  set('rmRate1', r1);
  set('rmRate2', r2);

  // LINE 文字
  const mb = document.getElementById('msgBox');
  if (mb) mb.textContent = _buildMsg(MZH[mi] || '?', date, wd, r1, r2);
}

function _buildMsg(mzh, date, wd, r1, r2) {
  return `📢【霸菱 ${mzh}月配息提醒】

📅 配息基準日：${date}（${wd}）

▸ 霸菱優先順位資產抵押債
   年化約 ${r1}%

▸ 霸菱環球非投資等級債
   年化約 ${r2}%

詳情請見附圖 ⬇️

＊本資料僅供參考，實際配息金額以公告為準`;
}

// ============================================================
// 顯示 / 隱藏對應版型的海報元素
// ============================================================
export function showPoster(tplKey) {
  ['poster', 'poster-starlight', 'poster-rosemist'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  if (tplKey === 'starlight') {
    document.getElementById('poster-starlight').style.display = 'block';
  } else if (tplKey === 'rosemist') {
    const el = document.getElementById('poster-rosemist');
    if (el) el.style.display = 'block';
    _initStars();
  } else {
    document.getElementById('poster').style.display = 'block';
  }
}

// ============================================================
// html2canvas 修正
// ============================================================
export function onDownloadClone(doc, tplKey) {
  // 修正漸層文字（html2canvas 不支援 background-clip: text）
  // 注意：.date-big 限定在 #poster（晨曦），避免影響玫瑰版同名 class
  [
    ['#poster .date-big',    '#2a3556'],
    ['#poster .fund-rate',   '#2a3556'],
    ['.night-date-big',      '#e8c275'],
    ['.night-fund-rate',     '#e8c275'],
  ].forEach(([sel, col]) => {
    doc.querySelectorAll(sel).forEach(n => {
      n.style.backgroundClip       = 'initial';
      n.style.webkitBackgroundClip = 'initial';
      n.style.webkitTextFillColor  = col;
      n.style.color      = col;
      n.style.background = 'none';
      n.style.filter     = 'none';
    });
  });

  // 修正 backdrop-filter（html2canvas 不支援毛玻璃效果，改用實心背景）
  doc.querySelectorAll('.fund-card').forEach(el => {
    el.style.backdropFilter       = 'none';
    el.style.webkitBackdropFilter = 'none';
    el.style.background           = 'rgba(255,252,244,0.92)';
  });
  doc.querySelectorAll('.night-fund-card').forEach(el => {
    el.style.backdropFilter       = 'none';
    el.style.webkitBackdropFilter = 'none';
    el.style.background           = 'rgba(255,255,255,0.10)';
  });
  doc.querySelectorAll('#poster-rosemist .card').forEach(el => {
    el.style.backdropFilter       = 'none';
    el.style.webkitBackdropFilter = 'none';
    el.style.background           = 'rgba(255,251,250,0.95)';
  });

  // 修正夜空 Logo（html2canvas 不支援 CSS filter，用 canvas 手動轉白）
  if (tplKey === 'starlight') {
    const nightLogo = doc.querySelector('.night-logo');
    if (nightLogo) {
      const origLogo = document.querySelector('.night-logo');
      if (origLogo && origLogo.complete && origLogo.naturalWidth) {
        const cv = document.createElement('canvas');
        cv.width  = origLogo.naturalWidth;
        cv.height = origLogo.naturalHeight;
        const ctx = cv.getContext('2d');
        ctx.drawImage(origLogo, 0, 0);
        ctx.globalCompositeOperation = 'source-in';
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, cv.width, cv.height);
        nightLogo.src = cv.toDataURL('image/png');
      }
      nightLogo.style.filter = 'none';
    }
  }
}

export function getDownloadFileName(state) {
  const dt = document.getElementById('inDate')?.value?.replace('/','') || 'poster';
  return `霸菱配息提醒_${dt}.jpg`;
}

export function getActivePosterEl(tplKey) {
  if (tplKey === 'starlight') return document.getElementById('poster-starlight');
  if (tplKey === 'rosemist')  return document.getElementById('poster-rosemist');
  return document.getElementById('poster');
}

// ============================================================
// 星空初始化（夜空版型）
// ============================================================
function _initStars() {
  const layer = document.getElementById('starsLayer');
  if (!layer || layer.children.length > 0) return;
  for (let i = 0; i < 60; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const sz = Math.random() * 2.5 + 0.8;
    s.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random()*100}%;top:${Math.random()*70}%;--dur:${(Math.random()*3+2).toFixed(1)}s;--delay:-${(Math.random()*4).toFixed(1)}s;--min:${(Math.random()*0.3+0.2).toFixed(1)};`;
    layer.appendChild(s);
  }
  const crosses = [
    {x:75,y:8,sz:32,gw:60},{x:85,y:22,sz:18,gw:36},
    {x:12,y:18,sz:26,gw:50},{x:90,y:52,sz:14,gw:30},
    {x:8,y:55,sz:20,gw:40},{x:55,y:5,sz:16,gw:32}
  ];
  crosses.forEach(({x,y,sz,gw},i) => {
    const c = document.createElement('div');
    c.className = 'star-cross';
    c.style.cssText = `left:${x}%;top:${y}%;--sz:${sz}px;--dur:${3+i*0.7}s;--delay:-${i*0.8}s;`;
    const g = document.createElement('div');
    g.className = 'cross-glow';
    g.style.cssText = `width:${gw}px;height:${gw}px;top:${-gw/2}px;left:${-gw/2}px;`;
    c.appendChild(g);
    layer.appendChild(c);
  });
}
