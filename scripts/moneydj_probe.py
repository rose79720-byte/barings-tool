#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MoneyDJ 資料探測腳本（競品比較圖 — 階段一）

目的：對 registry 裡的基金 code 清單，逐檔逐子頁抓 MoneyDJ，
      抽出所有表格的「欄位名稱 + 值」，輸出一張覆蓋度報表，
      讓 Rose 一眼看出每個比較維度到底哪些能從 MoneyDJ 直接拿、
      哪些抓不到要靠人工 curate 或自算。

特性：
  - MoneyDJ 為 Big5 編碼，抓下來用 big5 解碼再 parse
  - 有禮貌地抓：設 User-Agent、每檔每頁 sleep、結果 cache 到本地
  - 產出三份報表：
      1. scripts/probe_output/coverage_long.csv  逐欄位長表
      2. scripts/probe_output/report.html        人類可讀、分檔分頁
      3. scripts/probe_output/dimension_matrix.csv / .html  比較維度 × 基金 覆蓋矩陣

用法：
  python3 scripts/moneydj_probe.py                 # 跑 data/funds.json（無則用內建樣本）
  python3 scripts/moneydj_probe.py --codes AY01,AY02
  python3 scripts/moneydj_probe.py --no-cache      # 強制重抓
"""

import argparse
import csv
import html
import json
import os
import re
import time
from datetime import datetime

import requests
from bs4 import BeautifulSoup

# ------------------------------------------------------------------
# 路徑
# ------------------------------------------------------------------
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REGISTRY = os.path.join(ROOT, "data", "funds.json")
CACHE_DIR = os.path.join(ROOT, "scripts", "probe_cache")
OUT_DIR = os.path.join(ROOT, "scripts", "probe_output")

# ------------------------------------------------------------------
# 子頁地圖（§4.2，{code} 代入）
# ------------------------------------------------------------------
BASE = "https://www.moneydj.com/funddj"
# (顯示名稱, ascii slug 供 cache 檔名用, URL pattern)
#
# ⚠️ 子頁地圖已用實測「左側選單」校正過，與交接文件 §4.2 的推測不同：
#   - 各期間報酬率/std/Sharpe/Beta → yp012001「績效」（非文件的 yp902，yp902 是報告書 PDF，直接 GET 會 401）
#   - 持股/產業/信評/duration       → yp013001「持股」（非文件的 wb06，wb06 其實是「報酬比較」）
#   - 投資標的/區域/規模/成立日/幣別 → yp011001「基本資料」（文件正確）
#   - 「公司」yp020001 連結不帶 code（公司級頁），per-fund 抓不到，已移除
SUBPAGES = [
    ("基本資料", "yp011001", f"{BASE}/yp/yp011001.djhtm?a={{code}}"),
    ("績效",     "yp012001", f"{BASE}/yp/yp012001.djhtm?a={{code}}"),
    ("持股",     "yp013001", f"{BASE}/yp/yp013001.djhtm?a={{code}}"),
    ("配息",     "wb05",     f"{BASE}/yp/wb05.djhtm?a={{code}}"),
    ("報酬比較", "wb06",     f"{BASE}/yp/wb06.djhtm?a={{code}}"),
    ("風險評比", "wb07",     f"{BASE}/yp/wb07.djhtm?a={{code}}"),
    ("淨值",     "yp010001", f"{BASE}/ya/yp010001.djhtm?a={{code}}"),
]

# ------------------------------------------------------------------
# 比較維度 → 關鍵字（用來在抓到的欄位名裡比對，產覆蓋矩陣）
# ------------------------------------------------------------------
DIMENSIONS = {
    "波動度（年化標準差）": ["年化標準差", "標準差"],
    "Sharpe":              ["sharpe", "夏普"],
    "Beta / 利率敏感度":    ["beta"],
    "各期間報酬率":         ["報酬率"],
    "最大回撤":            ["回撤", "最大跌幅", "drawdown"],
    "殖利率／配息率":       ["配息率", "殖利率", "年化配息", "每單位分配"],
    "投資標的／區域":       ["投資標的", "投資區域", "投資地區", "產業"],
    "平均信評／信用品質":    ["信評", "信用評", "債信"],
    "存續期間 duration":    ["存續", "duration", "天期", "到期"],
    "基金規模":            ["基金規模", "淨資產", "規模"],
    "成立日／計價幣別":     ["成立日", "計價幣別", "幣別"],
    "風險報酬等級 RR":      ["風險報酬等級", "rr"],
}

# nav / footer / 雜訊表的特徵字（命中即略過整張表）
NAV_MARKERS = ("手機版", "加入會員", "MoneyDJ理財網", "FundDJ基智網", "粉絲團",
               "國內基金 境外基金", "FFilterJS")

# 整張表只是「無資料」提示時略過
NODATA_MARKERS = ("查無資料", "目前無資料", "目前暫無", "無資料")

# 視為「沒抓到值」的內容
EMPTY_VALUES = {"", "-", "--", "n/a", "na", "—"}

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0 Safari/537.36 (MoneyDJ internal eval probe)"
    )
}

SLEEP_SEC = 1.5  # 每次請求之間禮貌等待


# ------------------------------------------------------------------
# 抓取（含本地 cache）
# ------------------------------------------------------------------
def fetch(url, code, slug, use_cache=True):
    os.makedirs(CACHE_DIR, exist_ok=True)
    safe = re.sub(r"[^A-Za-z0-9]+", "_", f"{code}_{slug}")
    cache_path = os.path.join(CACHE_DIR, safe + ".html")

    if use_cache and os.path.exists(cache_path):
        with open(cache_path, "r", encoding="utf-8") as f:
            return f.read(), True  # (html, from_cache)

    resp = requests.get(url, headers=HEADERS, timeout=25)
    resp.encoding = "big5"
    text = resp.text
    with open(cache_path, "w", encoding="utf-8") as f:
        f.write(text)
    time.sleep(SLEEP_SEC)
    return text, False


# ------------------------------------------------------------------
# 解析：把一頁裡所有「資料表」抽成 (caption, field, values) 列
# ------------------------------------------------------------------
def cell_text(c):
    return c.get_text(" ", strip=True)


def is_nav_table(tbl_text):
    return any(m in tbl_text for m in NAV_MARKERS)


def is_value_present(v):
    s = (v or "").strip().lower()
    if s in EMPTY_VALUES:
        return False
    if "未更新" in s or "不參與評比" in s:
        return False
    return True


def parse_page(htmltext):
    """回傳 list of dict: {caption, field, values(list), success(bool)}"""
    soup = BeautifulSoup(htmltext, "lxml")
    rows = []
    for tbl in soup.find_all("table"):
        # 只處理「葉表」：MoneyDJ 用巢狀 table 排版，外層表會把內層文字
        # 整段塞進一格，造成超長垃圾列；跳過含子表的外層表。
        if tbl.find("table") is not None:
            continue
        ttext = tbl.get_text(" ", strip=True)
        if len(ttext) < 6 or is_nav_table(ttext):
            continue
        if any(m in ttext for m in NODATA_MARKERS) and len(ttext) < 30:
            continue
        if ttext[:6].startswith("附註"):  # 法律附註條文，非資料
            continue

        caption = ""
        for tr in tbl.find_all("tr"):
            cells = tr.find_all(["td", "th"])
            texts = [cell_text(c) for c in cells]
            nonempty = [t for t in texts if t]

            # 單格列 → 視為表格標題 / 區段名
            if len(nonempty) == 1 and len(cells) <= 2:
                caption = nonempty[0]
                continue
            if not nonempty:
                continue

            field = texts[0] if texts else ""
            values = [t for t in texts[1:] if t != ""]
            if not field and not values:
                continue
            # 純表頭列（如 "2025 2024 2023"）也記錄下來，當作該表的欄位定義
            success = any(is_value_present(v) for v in values)
            rows.append({
                "caption": caption,
                "field": field,
                "values": values,
                "success": success,
            })
    return rows


# ------------------------------------------------------------------
# registry / codes 載入
# ------------------------------------------------------------------
DEFAULT_SAMPLE = [
    {"fund_id": "barings_plb22", "moneydj_code": "AY01", "display_name_zh": "PLB22（待補名）"},
    {"fund_id": "barings_plb24", "moneydj_code": "AY02", "display_name_zh": "PLB24（待補名）"},
    {"fund_id": "barings_plb15", "moneydj_code": "BQ07", "display_name_zh": "PLB15（待補名）"},
    {"fund_id": "barings_plb04", "moneydj_code": "BQ01", "display_name_zh": "PLB04（待補名）"},
    # 活資料對照組：證明 pipeline 正常、示範「有資料的基金長怎樣」
    {"fund_id": "_live_control", "moneydj_code": "HHZ50",
     "display_name_zh": "【對照】駿利日本小型 I2美元避險"},
]


def load_funds(codes_arg):
    if codes_arg:
        return [
            {"fund_id": c, "moneydj_code": c, "display_name_zh": c}
            for c in codes_arg.split(",") if c.strip()
        ]
    if os.path.exists(REGISTRY):
        with open(REGISTRY, "r", encoding="utf-8") as f:
            data = json.load(f)
        funds = data.get("funds", data) if isinstance(data, dict) else data
        out = [f for f in funds if f.get("moneydj_code")]
        if out:
            return out
    return DEFAULT_SAMPLE


# ------------------------------------------------------------------
# 報表輸出
# ------------------------------------------------------------------
def write_coverage_csv(records, path):
    with open(path, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(["fund_id", "moneydj_code", "子頁", "表格", "欄位名稱", "抓到的值", "是否成功"])
        for r in records:
            w.writerow([
                r["fund_id"], r["code"], r["page"], r["caption"],
                r["field"], " | ".join(r["values"]),
                "✅" if r["success"] else "✗",
            ])


def build_dimension_matrix(records, funds):
    """維度 × 基金：該基金的欄位名是否命中該維度的關鍵字，且有抓到值"""
    by_fund = {}
    for r in records:
        by_fund.setdefault(r["code"], []).append(r)

    matrix = {}  # dim -> {code -> "✅/⚠️/—"}
    for dim, kws in DIMENSIONS.items():
        matrix[dim] = {}
        for fund in funds:
            code = fund["moneydj_code"]
            recs = by_fund.get(code, [])
            hit_any = False
            hit_val = False
            for r in recs:
                # 只採計有欄位名的資料列，排除純表頭列（field 為空、只有年份/期間標籤）
                if not r["field"]:
                    continue
                hay = (r["field"] + " " + r["caption"]).lower()
                if any(kw.lower() in hay for kw in kws):
                    hit_any = True
                    if r["success"]:
                        hit_val = True
            matrix[dim][code] = "✅" if hit_val else ("⚠️欄位有值缺" if hit_any else "—")
    return matrix


def write_dimension_csv(matrix, funds, path):
    codes = [f["moneydj_code"] for f in funds]
    with open(path, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(["比較維度"] + codes)
        for dim, row in matrix.items():
            w.writerow([dim] + [row.get(c, "—") for c in codes])


def write_html_report(records, matrix, funds, fetch_log, path):
    esc = html.escape
    codes = [f["moneydj_code"] for f in funds]
    name_of = {f["moneydj_code"]: f.get("display_name_zh", f["moneydj_code"]) for f in funds}

    parts = [
        "<!DOCTYPE html><html lang='zh-TW'><head><meta charset='UTF-8'>",
        "<title>MoneyDJ 覆蓋度探測報表</title>",
        "<style>",
        "body{font-family:'Noto Sans TC',sans-serif;background:#eef0f5;margin:0;padding:24px;color:#1a2a52}",
        "h1{font-size:22px;letter-spacing:2px}h2{font-size:17px;margin-top:32px;border-left:4px solid #1a2a52;padding-left:10px}",
        "h3{font-size:14px;color:#374151;margin:18px 0 6px}",
        "table{border-collapse:collapse;background:#fff;font-size:13px;margin:6px 0 18px;box-shadow:0 1px 4px rgba(0,0,0,.08)}",
        "th,td{border:1px solid #e5e7eb;padding:5px 9px;text-align:left;vertical-align:top}",
        "th{background:#1a2a52;color:#e8c275;position:sticky;top:0}",
        ".ok{color:#15803d;font-weight:700}.no{color:#b91c1c}.warn{color:#b45309}",
        ".cap{color:#6b7280;font-size:11px}.meta{color:#6b7280;font-size:12px;margin-bottom:18px}",
        ".matrix td:first-child{font-weight:600}",
        "</style></head><body>",
        "<h1>MoneyDJ 覆蓋度探測報表</h1>",
        f"<div class='meta'>產生時間：{esc(datetime.now().strftime('%Y-%m-%d %H:%M'))}　"
        f"樣本：{esc(', '.join(codes))}</div>",
    ]

    # 維度矩陣
    parts.append("<h2>① 比較維度 × 基金 覆蓋矩陣</h2>")
    parts.append("<table class='matrix'><tr><th>比較維度</th>" +
                 "".join(f"<th>{esc(name_of[c])}<br><span class='cap'>{esc(c)}</span></th>" for c in codes) +
                 "</tr>")
    for dim, row in matrix.items():
        cells = []
        for c in codes:
            v = row.get(c, "—")
            cls = "ok" if v == "✅" else ("warn" if v.startswith("⚠") else "no")
            cells.append(f"<td class='{cls}'>{esc(v)}</td>")
        parts.append(f"<tr><td>{esc(dim)}</td>{''.join(cells)}</tr>")
    parts.append("</table>")
    parts.append("<div class='cap'>✅=抓到值　⚠️=有對應欄位但值缺(N/A/未更新)　—=該頁找不到對應欄位</div>")

    # 抓取狀態
    parts.append("<h2>② 各子頁抓取狀態</h2><table><tr><th>基金</th><th>子頁</th><th>HTTP</th><th>資料列數</th></tr>")
    for log in fetch_log:
        parts.append(f"<tr><td>{esc(log['code'])}</td><td>{esc(log['page'])}</td>"
                     f"<td>{esc(str(log['status']))}</td><td>{esc(str(log['rows']))}</td></tr>")
    parts.append("</table>")

    # 逐檔逐頁明細
    parts.append("<h2>③ 逐欄位明細</h2>")
    by_fund = {}
    for r in records:
        by_fund.setdefault(r["code"], {}).setdefault(r["page"], []).append(r)
    for fund in funds:
        code = fund["moneydj_code"]
        parts.append(f"<h3>{esc(name_of[code])}（{esc(code)}）</h3>")
        pages = by_fund.get(code, {})
        if not pages:
            parts.append("<div class='cap'>（無資料）</div>")
            continue
        for page_name, _slug, _url in SUBPAGES:
            recs = pages.get(page_name)
            if not recs:
                continue
            parts.append(f"<b>{esc(page_name)}</b>")
            parts.append("<table><tr><th>表格</th><th>欄位</th><th>值</th><th>成功</th></tr>")
            for r in recs:
                cls = "ok" if r["success"] else "no"
                mark = "✅" if r["success"] else "✗"
                parts.append(
                    f"<tr><td class='cap'>{esc(r['caption'])}</td>"
                    f"<td>{esc(r['field'])}</td>"
                    f"<td>{esc(' | '.join(r['values']))}</td>"
                    f"<td class='{cls}'>{mark}</td></tr>"
                )
            parts.append("</table>")

    parts.append("</body></html>")
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(parts))


# ------------------------------------------------------------------
# main
# ------------------------------------------------------------------
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--codes", help="逗號分隔的 MoneyDJ code，覆蓋 registry")
    ap.add_argument("--no-cache", action="store_true", help="強制重抓，不用本地 cache")
    args = ap.parse_args()

    funds = load_funds(args.codes)
    os.makedirs(OUT_DIR, exist_ok=True)

    print(f"探測 {len(funds)} 檔基金：{', '.join(f['moneydj_code'] for f in funds)}")
    records = []
    fetch_log = []

    for fund in funds:
        code = fund["moneydj_code"]
        for page_name, slug, pattern in SUBPAGES:
            url = pattern.format(code=code)
            try:
                htmltext, from_cache = fetch(url, code, slug, use_cache=not args.no_cache)
                status = "cache" if from_cache else 200
            except Exception as e:
                print(f"  ✗ {code} {page_name}: {e}")
                fetch_log.append({"code": code, "page": page_name, "status": "ERR", "rows": 0})
                continue

            page_rows = parse_page(htmltext)
            for pr in page_rows:
                records.append({
                    "fund_id": fund.get("fund_id", code),
                    "code": code,
                    "page": page_name,
                    "caption": pr["caption"],
                    "field": pr["field"],
                    "values": pr["values"],
                    "success": pr["success"],
                })
            fetch_log.append({"code": code, "page": page_name,
                              "status": status, "rows": len(page_rows)})
            print(f"  {'·' if from_cache else '↓'} {code} {page_name}: {len(page_rows)} 列")

    matrix = build_dimension_matrix(records, funds)

    csv_path = os.path.join(OUT_DIR, "coverage_long.csv")
    dim_csv = os.path.join(OUT_DIR, "dimension_matrix.csv")
    html_path = os.path.join(OUT_DIR, "report.html")
    write_coverage_csv(records, csv_path)
    write_dimension_csv(matrix, funds, dim_csv)
    write_html_report(records, matrix, funds, fetch_log, html_path)

    print(f"\n完成。共 {len(records)} 列。")
    print(f"  覆蓋度長表：{csv_path}")
    print(f"  維度矩陣：  {dim_csv}")
    print(f"  HTML 報表： {html_path}")


if __name__ == "__main__":
    main()
