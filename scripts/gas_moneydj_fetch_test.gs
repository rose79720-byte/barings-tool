/**
 * B 探路測試：驗證從 GAS 抓 MoneyDJ + Big5 解碼是否可行（資料管線的命脈）。
 * 用法：貼進 Apps Script → 執行 testMoneyDJFetch → 看「執行紀錄 / Log」。
 *
 * 判讀：
 *  - HTTP 200 + 關鍵字都 ✅（尤其「報酬率」「標準差」「霸菱」）→ GAS 抓得到也解得開，B 通。
 *  - 關鍵字亂碼/❌ → Big5 解碼失敗或被擋 → 需改架構（小後端代理）。
 *  - regex 那行有抓到數字 → 純 GAS regex 解析可行；太脆則備案：小後端(Python+BeautifulSoup)給 GAS 呼叫。
 *
 * 背景：抓取+解析邏輯已用 Python 實測通過（見 scripts/moneydj_probe.py）；
 *       此測試只驗「從 GAS 跑」這一段 GAS 特有風險。
 */
function testMoneyDJFetch() {
  var code = 'PLB04';
  var url = 'https://www.moneydj.com/funddj/yp/yp012001.djhtm?a=' + code; // 績效頁
  var resp = UrlFetchApp.fetch(url, {
    muteHttpExceptions: true,
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  Logger.log('HTTP ' + resp.getResponseCode());
  var text = resp.getBlob().getDataAsString('Big5'); // MoneyDJ 是 Big5 編碼
  Logger.log('解碼後長度: ' + text.length);
  ['報酬率', '標準差', 'Sharpe', '霸菱'].forEach(function (kw) {
    Logger.log(kw + ' → ' + (text.indexOf(kw) >= 0 ? '✅ 找到' : '❌ 沒有'));
  });
  // 示範 regex 解析可行性（GAS 無 DOM，只能 regex）
  var m = text.match(/標準差[\s\S]{0,120}?(-?\d+\.\d+)/);
  Logger.log('regex 試抓一個數字: ' + (m ? m[1] : '未匹配'));
}
