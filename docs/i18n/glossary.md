# 翻譯詞彙表

`glossary.csv` 是產品名、導覽、頁面名稱與介面字串的 zh-TW／en／vi 對照（M7-01，#38）。M7-02、M7-03 翻譯 en、vi 內容與 `src/data/strings/` 時，用語以這份為準。

## 欄位

| 欄位 | 誰寫 | 內容 |
|---|---|---|
| `id` | script | `node:<節點 id>`、`nav:<選單標籤>`、`ui:<字串路徑>`；手動加的列用 `brand:<名稱>`、`term:<名稱>` |
| `category` | script | 見下方「分類」 |
| `zh-TW` | script | 節點取 `docs/ia/nodes.csv` 的 `title`，選單標籤取 `docs/ia/navigation.csv` 的 `label`，介面字串取 `src/data/strings/zh-TW.ts` |
| `en`、`vi` | 人工 | 譯名。新列由 script 帶入現站寫法，見「現站寫法怎麼來」 |
| `status` | 人工 | 見下方「狀態」 |
| `source` | script | 建立這一列時的出處：zh-TW 的出處，帶入現站寫法時改為 en、vi 寫法的出處（內容檔路徑或現站網址）。之後重跑不變，M7 加的 en、vi 內容檔不會被當成現站寫法 |
| `note` | 人工 | 新列由 script 寫入現站的其他寫法，之後人工自由補充 |

字串前後的半形空格是譯文的一部分（例如 `ui:listing.pageSuffix` 的 ` (page {n})` 直接接在標題後面），script 會替這些值加上引號，編輯時不要刪掉。`{n}` 這類大括號是程式帶入的參數。

### 分類

| `category` | 範圍 |
|---|---|
| `brand` | 公司名（手動加） |
| `term` | 跨頁共用、但不是節點也不是介面字串的名詞（手動加，目前沒有） |
| `product` | `nodes.csv` 的 offering 節點，以及 `產品總覽` 底下的產品家族 hub |
| `page` | 其他節點。`kind` 是 `group`、`asset` 的節點不顯示名稱，不列；其餘節點的名稱會出現在麵包屑、卡片或頁面標題，en、vi 頁面讀這裡的譯名（`docs/ia/navigation.md`「語系」） |
| `nav` | `navigation.csv` 中不是任何節點 `title` 的選單標籤。和某個節點 `title` 相同的標籤（例如「資源」）算在那個節點的列 |
| `ui` | `src/data/strings/zh-TW.ts` 的介面字串。`pages`（列表頁等的 description）是頁面內容，不列 |

### 狀態

| `status` | 意義 |
|---|---|
| `to-confirm` | en、vi 取自現站，或還沒有譯名（空白），等人工確認 |
| `draft` | AI 草擬的譯名，等人工確認 |
| `confirmed` | 人工確認過；en 與 vi 都必須有值 |

產品名、頁面名稱與公司名只放現站用過的寫法，現站沒有就留空，不由 AI 補。`ui`、`nav` 的譯名由 AI 草擬（`draft`），現站有同樣用法的標 `to-confirm` 並在 `note` 註明。

## 已確認的規則

- 產品名不加描述，en、vi 一律用產品名（使用者 2026-10-24 決定，PR #113）。產品名取 zh-TW `title` 裡的名稱，例如 `digiRunner API 管理平台` 的 en、vi 都是 `digiRunner`，產品家族用家族名（`AI（SysTalk.ai）` → `SysTalk.ai`）。`title` 只有描述、沒有產品名的列（smartclaim、gis、服務頁等）不適用這條規則
- 公司名 en、vi 都用 `TPIsoftware`（`brand:tpisoftware`，使用者 2026-10-24 決定，PR #113）
- `title` 只有描述、沒有產品名的 `product` 列與所有 `page` 列不算專有名詞，在 M7-02、M7-03 翻譯內文時一起確認（使用者 2026-10-24 決定，PR #113）

## 現站寫法怎麼來

script 依 `docs/ia/page-map.csv` 找出對到同一個節點的 en、vi 現站網址，`disposition` 為 `keep`、`rewrite` 的排在 `merge` 前面（併入的頁面，例如 systalk-chat 的 `/vn/genai-solution`，不當第一個寫法）。再依序取：

1. 該節點的 en、vi 內容檔 `title`（`src/content/{offering,hub,page,whitepaper}/<locale>/`）
2. `docs/research/inventory.csv` 的 `nav_location` 中，header 最淺一層的選單標籤。同一網址底下更深的項目是頁內篩選或錨點（例如成功案例的產業篩選），不取；結尾是 `→` 的是按鈕文字，改取上一層
3. 同一欄的 footer 標籤

同一語系有兩個以上節點共用的選單標籤是通用標籤（例如每個產品的文件選單底下都叫 White Paper），不當名稱。

第一個寫法填進 `en` 或 `vi`，其他寫在 `note` 的「現站 en 其他寫法」。現站同一個產品常有好幾種寫法（選單用功能名、頁面用產品名），確認時選一個，其他刪掉或留在 `note` 說明。確認後的 en、vi 和現站寫法不同時（例如依產品名規則改成 `digiRunner`），現站的寫法全部記在 `note` 的「現站 en 寫法」，譯者翻內文時可以參考。

## 確認譯名

1. 打開 `glossary.csv`，修改 `en`、`vi`
2. 確認後把 `status` 改為 `confirmed`
3. 執行 `node scripts/i18n/glossary.mjs --check`

`--check` 會擋下：`confirmed` 但 en 或 vi 是空的列、重複的 `id`、不在上表的 `category` 或 `status`、`id` 前綴與 `category` 不符，以及 script 重跑後會改變的檔案。`npm run check` 包含這一步。

## 來源改了之後重跑

改了 `nodes.csv`、`navigation.csv` 或 `src/data/strings/zh-TW.ts` 後，執行：

```bash
node scripts/i18n/glossary.mjs
```

- 新的節點、標籤或字串會加一列，`status` 是 `to-confirm`
- 已有的列保留 `en`、`vi`、`status`、`note`、`source`；`node:`、`ui:` 列的 `zh-TW` 改了時退回 `to-confirm`，`note` 開頭記下原本的 zh-TW
- `nav:` 列的 `id` 就是選單標籤，`navigation.csv` 改了標籤等於換一列：舊列連同 en、vi 一起移除，新標籤是新的一列。改標籤前先記下舊列的譯名
- 來源刪掉的列會從 `glossary.csv` 移除；手動加的 `brand`、`term` 列不動，排在最上方
