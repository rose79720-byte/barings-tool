# 夥伴環境準備 Checklist

> 這份只處理「把環境跨過去」——裝工具、拿權限、把專案跑起來。
> 純環境設定，不含程式規格；規格等環境就緒後另外給。
> 照著一步一步做，卡住就回報卡在第幾步。

---

## 這個專案是什麼（30 秒背景）

- 一個**純前端網頁工具**（HTML + JavaScript，沒有後端、沒有資料庫）。
- 已經上線在 GitHub Pages：https://rose79720-byte.github.io/barings-tool/
- ⚠️ **重點：`main` 分支 = 正式站。** push 到 `main`，外部客戶馬上就看得到。
  所以**不要直接在 `main` 上改**，一律開自己的分支（第 5 步教）。

---

## Step 1 — 安裝 Cursor

1. 到 https://cursor.com 下載對應系統版本（Mac / Windows）。
2. 安裝、開啟、登入。
3. 熟悉一下：左側是檔案、右側是 AI 對話，可以直接叫它讀專案、改程式。

---

## Step 2 — 安裝 Git

Cursor 本身不含 Git，要另外裝。

- **Mac**：打開「終端機」輸入 `git --version`。若沒裝，系統會跳出安裝視窗，按確定即可。
- **Windows**：到 https://git-scm.com/download/win 下載安裝，全部按預設下一步就好。

裝完在終端機／命令列輸入 `git --version`，有看到版本號就成功。

---

## Step 3 — 設定 GitHub 帳號與連線金鑰

1. 沒有 GitHub 帳號的話，先到 https://github.com 註冊。
2. **把你的 GitHub 帳號（或註冊 email）給 Rose**，她會把你加進專案（沒有這步你無法 push）。
3. 收到 Rose 寄的 collaborator 邀請信 → 點 **Accept invitation**。
4. 設定 SSH 金鑰（讓你的電腦能安全連上 GitHub，只需設一次）：
   - 終端機輸入：`ssh-keygen -t ed25519 -C "你的email"`，一路按 Enter（預設就好）。
   - 顯示金鑰內容：`cat ~/.ssh/id_ed25519.pub`，把整段複製起來。
   - 到 GitHub → 右上頭像 → **Settings → SSH and GPG keys → New SSH key** → 貼上 → 存檔。
   - 測試連線：`ssh -T git@github.com`，看到 "successfully authenticated" 就成功。

> 卡在 SSH 金鑰是新手最常見的關卡，卡住就把終端機的錯誤訊息截圖給 Rose。

---

## Step 4 — 把專案複製到自己電腦（clone）

在終端機切到你想放專案的資料夾，執行：

```bash
git clone git@github.com:rose79720-byte/barings-tool.git
cd barings-tool
```

> ⚠️ **一定要用 clone，不要自己 `git init`。** clone 會自動設好「和 GitHub 同步」的對應關係；手動 init 會漏掉，之後 push/pull 會很麻煩。

在 Cursor 裡用 **File → Open Folder** 打開這個 `barings-tool` 資料夾。

---

## Step 5 — 開自己的工作分支（不要動 main）

每次要做新東西，先開一條屬於這個任務的分支：

```bash
git checkout -b feat/我的任務名稱
# 例如：git checkout -b feat/banktable-line-a4
```

---

## Step 6 — 在本地把網頁跑起來看

這個專案用了 ES modules + `fetch`，**不能直接雙擊 HTML 開**（會因為瀏覽器安全限制讀不到資料）。要開一個本地小伺服器：

```bash
# 在 barings-tool 資料夾裡執行（擇一）：
python3 -m http.server 8000        # Mac 內建 python3
# 或   npx serve                    # 有裝 Node 的話
```

然後瀏覽器打開 http://localhost:8000/ 就能看到工具。改完程式**重整瀏覽器**就會更新。

---

## Step 7 — 日常流程（做完一段就這樣交出去）

```bash
git add <你改的檔案>          # 例：git add materials/bankTable.js
git commit -m "簡短說明改了什麼"
git push -u origin feat/我的任務名稱   # 第一次推這條分支用 -u，之後只要 git push
```

> ⚠️ 這個 repo **不要用 `git add -A` / `git add .`**，工作目錄有不該提交的快取檔。只 add 你真正改的檔案。

推上去後，到 GitHub 專案頁會出現 **Compare & pull request** 按鈕 → 開 PR → 標記 Rose review。
**Rose 看過、合併進 main，網站才會更新**——你自己的分支不會影響正式站，可以放心試。

---

## 完成後回報

跑到 Step 6 能在 http://localhost:8000/ 看到工具、Step 7 能成功 push 一個測試分支，就代表環境全通了。
回報 Rose「環境就緒」，她會把你負責那塊（bankTable）的規格交接給你。
