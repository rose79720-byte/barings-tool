#!/usr/bin/env node
/**
 * 跨瀏覽器產圖檢查：每個素材 × 每個版型，在客戶會用的環境各產一次圖，排成對照總表。
 *
 * 為什麼需要：海報是在「使用者自己的瀏覽器」裡用 html2canvas 產圖，同一份程式碼在
 * Safari／Chrome 產出的 JPG 可能不同（2026-11 案例：Safari 夜空星光 logo 消失、晨曦整張變暗，
 * Chrome 完全正常）。push 前跑一次，左右對照即可抓出不一致。
 *
 * 環境（客戶＝Windows 電腦＋手機；Rose＝Mac Safari）：
 *   desktop-chromium  Windows Chrome／Edge
 *   desktop-webkit    Mac Safari
 *   iphone-webkit     iPhone（iOS 上所有瀏覽器都是 WebKit）
 *   android-chromium  Android Chrome
 *
 * 用法：
 *   node scripts/visual_check.mjs                 # 測本機（自動起 http server）
 *   node scripts/visual_check.mjs --prod          # 測正式站 GitHub Pages
 *   node scripts/visual_check.mjs --only=dividend # 只測某素材
 * 輸出：scripts/visual_check_output/（已 gitignore）→ 打開 report.png 看總表
 *
 * 需要 playwright（含 chromium、webkit）：npx playwright install chromium webkit
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'scripts', 'visual_check_output');
const PROD_URL = 'https://rose79720-byte.github.io/barings-tool/index.html';
const args = process.argv.slice(2);
const PROD = args.includes('--prod');
const ONLY = (args.find(a => a.startsWith('--only=')) || '').slice(7) || null;

// ---- 載入 playwright：優先專案/全域安裝，其次 npx 快取 ----
async function loadPlaywright() {
  try { return await import('playwright'); } catch {}
  const npx = path.join(os.homedir(), '.npm', '_npx');
  for (const d of fs.existsSync(npx) ? fs.readdirSync(npx) : []) {
    const p = path.join(npx, d, 'node_modules', 'playwright', 'index.mjs');
    if (fs.existsSync(p)) return import(p);
  }
  console.error('找不到 playwright。請先執行：npx playwright install chromium webkit');
  process.exit(1);
}
const pw = await loadPlaywright();

const ENVS = [
  { key: 'desktop-chromium', label: 'Windows Chrome/Edge', engine: 'chromium', ctx: { viewport: { width: 1600, height: 1000 } } },
  { key: 'desktop-webkit',   label: 'Mac Safari',          engine: 'webkit',   ctx: { viewport: { width: 1600, height: 1000 } } },
  { key: 'iphone-webkit',    label: 'iPhone',              engine: 'webkit',   ctx: pw.devices['iPhone 14'] },
  { key: 'android-chromium', label: 'Android',             engine: 'chromium', ctx: pw.devices['Pixel 7'] },
];

// ---- 檢查案例：素材 → 一連串 UI 操作 ----
const tpl = key => p => p.evaluate(k => selectTpl(k), key);
const clickStep2 = text => p => p.locator('#tplGrid button', { hasText: text }).first().click();
const clickText = text => p => p.getByText(text, { exact: true }).first().click();
const CASES = [
  { material: 'dividend',  name: '配息-晨曦-2支',   steps: [tpl('dawn')] },
  { material: 'dividend',  name: '配息-夜空-2支',   steps: [tpl('starlight')] },
  { material: 'dividend',  name: '配息-玫瑰-2支',   steps: [tpl('rosemist')] },
  { material: 'dividend',  name: '配息-晨曦-1支',   steps: [tpl('dawn'), clickText('1 支')] },
  { material: 'dividend',  name: '配息-夜空-1支',   steps: [tpl('starlight'), clickText('1 支')] },
  { material: 'dividend',  name: '配息-玫瑰-1支',   steps: [tpl('rosemist'), clickText('1 支')] },
  { material: 'compare',   name: '競品-1對2',       steps: [clickStep2('1 對 2')] },
  { material: 'compare',   name: '競品-1對1',       steps: [clickStep2('1 對 1')] },
  { material: 'bankTable', name: '銀行-台新',       steps: [clickStep2('台新')] },
  { material: 'bankTable', name: '銀行-富邦',       steps: [clickStep2('富邦')] },
].filter(c => !ONLY || c.material === ONLY);

// ---- 本機 http server（不測正式站時）----
function serve() {
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.woff2': 'font/woff2', '.css': 'text/css', '.svg': 'image/svg+xml' };
  const srv = http.createServer((req, res) => {
    const f = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise(r => srv.listen(0, '127.0.0.1', () => r(srv)));
}

// 等預覽圖（html2canvas 產出）更新且穩定
async function waitPreview(page, prevSrc, timeout = 60000) {
  const t0 = Date.now();
  let last = null, stableSince = 0;
  while (Date.now() - t0 < timeout) {
    const src = await page.evaluate(() => document.getElementById('previewImg')?.src || '');
    if (src && src.startsWith('data:') && src !== prevSrc) {
      if (src === last) { if (Date.now() - stableSince > 1500) return src; }
      else { last = src; stableSince = Date.now(); }
    }
    await page.waitForTimeout(300);
  }
  return last || prevSrc;   // 逾時：回傳最後一張（報告會標註）
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const srv = PROD ? null : await serve();
const BASE = PROD ? PROD_URL : `http://127.0.0.1:${srv.address().port}/index.html`;
console.log(`檢查對象：${PROD ? '正式站' : '本機'} ${BASE}`);

const results = [];   // {env, case, file, errors[], note}
const browsers = {};
for (const env of ENVS) {
  browsers[env.engine] ||= await pw[env.engine].launch();
  for (const c of CASES) {
    const page = await (await browsers[env.engine].newContext(env.ctx)).newPage();
    const errors = [];
    page.on('pageerror', e => errors.push('JS 錯誤：' + e.message));
    page.on('response', r => { if (r.status() >= 400 && !/favicon/.test(r.url())) errors.push(`${r.status()} ${r.url().split('?')[0]}`); });
    let note = '';
    try {
      await page.goto(BASE + '?t=' + Date.now());
      let src = await waitPreview(page, '');
      if (c.material !== 'dividend') { await page.evaluate(k => onMaterialChange(k), c.material); src = await waitPreview(page, src); }
      for (const step of c.steps) { await step(page); src = await waitPreview(page, src, 20000); }
      const file = `${c.name}__${env.key}.jpg`;
      fs.writeFileSync(path.join(OUT, file), Buffer.from(src.split(',')[1], 'base64'));
      // 手機另存整頁截圖（操作介面是否可用）
      if (env.key.includes('iphone') || env.key.includes('android')) {
        await page.screenshot({ path: path.join(OUT, `UI_${c.material}__${env.key}.png`), fullPage: false });
      }
      results.push({ env: env.key, case: c.name, file, errors });
    } catch (e) {
      note = '操作失敗：' + e.message.split('\n')[0];
      results.push({ env: env.key, case: c.name, file: null, errors, note });
    }
    console.log(`${note || errors.length ? '✗' : '✓'} ${c.name.padEnd(12)} ${env.label}${note ? '  ' + note : ''}${errors.length ? '  ' + errors.join('; ') : ''}`);
    await page.context().close();
  }
}

// ---- 對照總表：每列一個案例，每欄一個環境 ----
const rel = f => f ? `./${encodeURIComponent(f)}` : '';
const html = `<!doctype html><meta charset="utf-8"><style>
body{font:14px -apple-system,"Noto Sans TC",sans-serif;margin:16px;background:#f3f4f6}
table{border-collapse:collapse}td,th{border:1px solid #d1d5db;padding:6px;vertical-align:top;background:#fff}
th{background:#1a2a52;color:#fff}img{width:300px;display:block}.err{color:#b91c1c;font-size:12px;max-width:300px;word-break:break-all}
</style><h2>跨瀏覽器產圖對照（${PROD ? '正式站' : '本機'}・${new Date().toLocaleString('zh-TW')}）</h2>
<table><tr><th>案例</th>${ENVS.map(e => `<th>${e.label}</th>`).join('')}</tr>
${CASES.map(c => `<tr><td><b>${c.name}</b></td>${ENVS.map(e => {
  const r = results.find(x => x.env === e.key && x.case === c.name) || {};
  return `<td>${r.file ? `<img src="${rel(r.file)}">` : ''}${r.note ? `<div class="err">${r.note}</div>` : ''}${(r.errors || []).map(x => `<div class="err">${x}</div>`).join('')}</td>`;
}).join('')}</tr>`).join('')}</table>`;
fs.writeFileSync(path.join(OUT, 'report.html'), html);
const rp = await (await browsers.chromium.newContext({ viewport: { width: 1400, height: 800 } })).newPage();
await rp.goto('file://' + path.join(OUT, 'report.html'));
await rp.waitForTimeout(500);
await rp.screenshot({ path: path.join(OUT, 'report.png'), fullPage: true });

for (const b of Object.values(browsers)) await b.close();
if (srv) srv.close();
const bad = results.filter(r => r.note || r.errors.length);
console.log(`\n完成：${results.length} 張，${bad.length} 張有錯誤。總表：${path.join(OUT, 'report.png')}`);
process.exit(bad.length ? 1 : 0);
