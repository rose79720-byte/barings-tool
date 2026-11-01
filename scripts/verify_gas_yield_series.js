#!/usr/bin/env node
/**
 * 本機驗證 gas/程式碼.js 的 yield / getSeries / maxdd（不需部署）。
 * 以 Node vm 載入 GAS 檔，mock UrlFetchApp（走 curl 抓真實 MoneyDJ）與 Utilities（Big5 解碼）。
 *
 * 用法：node scripts/verify_gas_yield_series.js [codes] [baselineFile]
 *   codes        逗號分隔，預設 PLB04,PLB22,PLZ45,PLZ15,PIM41,ANZ91,alz45
 *   baselineFile 舊版 GAS 檔（例：git show main:gas/程式碼.js > /tmp/old.js），
 *                給了就比對「既有欄位完全不變」
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const codes = process.argv[2] || 'PLB04,PLB22,PLZ45,PLZ15,PIM41,ANZ91,alz45';
const baseline = process.argv[3];

const cache = {};
function curl(url, headers) {
  if (cache[url]) return cache[url];
  const args = ['-s', '--max-time', '30'];
  for (const [k, v] of Object.entries(headers || {})) args.push('-H', `${k}: ${v}`);
  args.push(url);
  return (cache[url] = execFileSync('curl', args, { maxBuffer: 64 << 20 }));
}
const resp = buf => ({ getContent: () => buf, getResponseCode: () => 200 });

function load(file) {
  const ctx = {
    console,
    UrlFetchApp: {
      fetch: (url, o) => resp(curl(url, (o || {}).headers)),
      fetchAll: reqs => reqs.map(r => resp(curl(r.url, r.headers))),
    },
    Utilities: {
      newBlob: buf => ({ getDataAsString: enc => new TextDecoder(enc.toLowerCase()).decode(buf) }),
    },
    SpreadsheetApp: { openById: () => { throw new Error('Sheet 不在本機驗證範圍，請帶 codes'); } },
    ContentService: { createTextOutput: s => ({ setMimeType: () => s }), MimeType: { JSON: 'json' } },
  };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(file, 'utf8') + '\n;this.__api={getCompare,getSeries:typeof getSeries==="function"?getSeries:null,doGet};', ctx);
  return ctx.__api;
}

const api = load(path.join(__dirname, '..', 'gas', '程式碼.js'));
const cmp = api.getCompare(codes);
const ser = api.getSeries(codes);

console.log('== getCompare（新增欄位）+ 交叉驗證 ==');
console.log('code    yield  yieldAsOf   maxdd   | y1(yp012001)  wb06終點  一致? | 點數  起點→終點');
for (const c of codes.split(',')) {
  const r = cmp[c], s = ser[c];
  const last = s.points ? s.points[s.points.length - 1] : null;
  const ok = last && r.y1 && Math.abs(parseFloat(r.y1) - last[1]) < 0.015 ? '✓' : '✗';
  console.log(
    c.padEnd(7), String(r.yield ?? '—').padStart(5), String(r.yieldAsOf ?? '—').padEnd(11),
    String(r.maxdd ?? '—').padStart(6), '  |', String(r.y1 ?? '—').padStart(8), '    ',
    String(last ? last[1].toFixed(2) : '—').padStart(6), '   ', ok, '  |',
    s.points ? s.points.length : s.error, s.points ? `${s.points[0][0]}→${s.asOf}` : ''
  );
}

console.log('\n== doGet 路由 ==');
const raw = api.doGet({ parameter: { action: 'getSeries', codes: 'PLB04' } });
const j = JSON.parse(raw);
console.log('getSeries JSON keys:', Object.keys(j), '→', Object.keys(j.PLB04), 'points[0]=', JSON.stringify(j.PLB04.points[0]));

if (baseline) {
  console.log('\n== 既有欄位不變（對照', baseline, '）==');
  const old = load(baseline).getCompare(codes);
  let bad = 0;
  for (const c of Object.keys(old)) for (const k of Object.keys(old[c])) {
    if (JSON.stringify(old[c][k]) !== JSON.stringify(cmp[c][k])) { bad++; console.log('✗', c, k, old[c][k], '→', cmp[c][k]); }
  }
  const added = [...new Set(Object.keys(cmp).flatMap(c => Object.keys(cmp[c]).filter(k => !(k in old[c]))))];
  console.log(bad ? `✗ ${bad} 個既有欄位有變動` : '✓ 既有欄位全部相同', '；新增欄位：', added.join(', '));
}
