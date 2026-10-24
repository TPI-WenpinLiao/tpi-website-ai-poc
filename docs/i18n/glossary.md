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

不加 `--check` 時也會檢查譯文是否照詞彙表：

- `src/data/strings/en.ts`、`vi.ts` 的每個介面字串都要等於對應 `ui:` 列的 en、vi，兩邊的 key 也要一致。字串檔改了就先改這份，再照抄過去
- `confirmed` 的產品，en、vi 內容檔的 `title` 要包含該語系的產品名

頁面上漏翻的中文由 `node scripts/i18n/routes.mjs` 擋下：en、vi 頁面的文字與 `alt`、`title`、`aria-label`、`placeholder`、meta 不得有漢字或全形標點（`lang="zh-TW"`、`lang="ja"` 的元素除外）。

## 來源改了之後重跑

改了 `nodes.csv`、`navigation.csv` 或 `src/data/strings/zh-TW.ts` 後，執行：

```bash
node scripts/i18n/glossary.mjs
```

- 新的節點、標籤或字串會加一列，`status` 是 `to-confirm`
- 已有的列保留 `en`、`vi`、`status`、`note`、`source`；`node:`、`ui:` 列的 `zh-TW` 改了時退回 `to-confirm`，`note` 開頭記下原本的 zh-TW
- `nav:` 列的 `id` 就是選單標籤，`navigation.csv` 改了標籤等於換一列：舊列連同 en、vi 一起移除，新標籤是新的一列。改標籤前先記下舊列的譯名
- 來源刪掉的列會從 `glossary.csv` 移除；手動加的 `brand`、`term` 列不動，排在最上方

## vi 待確認

M7-03（#40）補上 `page` 列與部分 `product` 列的 vi 譯名。取自現站 vi（`www.tpisoftware.vn` 的資源中心、footer）的，`note` 寫出處；現站 vi 沒有的由 AI 草擬，`note` 寫「vi 為 AI 草擬（#40）」。這些列的 `status` 仍是 `to-confirm`，等越南文審稿確認。

詞彙表以外、翻譯內文時用到的專有名詞也列在這裡，確認後再決定要不要加成 `term:` 列：

| zh-TW | vi 暫譯 | 出處 | 說明 |
|---|---|---|---|
| 昕力大學 | Đại học TPI | `node:tpu` | 獨立子站的名稱，現站 vi 沒有寫法 |
| 地端部署、地端 AI | triển khai on-premises／AI tại chỗ | `offering/vi/systalk-viki.md` 等、`hub/vi/family-ai.md` | 現站 vi 兩種都有（blog「Triển khai AI on-premises」、新聞「triển khai AI tại chỗ」），待統一 |
| 智慧醫療服務 | Dịch vụ y tế thông minh | `offering/vi/digicare.md` | |
| 醫囑紀錄、AI 護理紀錄 | hồ sơ y lệnh、hồ sơ điều dưỡng AI | `offering/vi/digicare.md` | |
| 健保署、衛福部 | Cục Bảo hiểm Y tế Quốc gia、Bộ Y tế và Phúc lợi Đài Loan | `offering/vi/digicare.md` | 機構名；衛福部的寫法與 vi 新聞 564 相同 |
| 台灣核心實作指引（TW Core IG） | Hướng dẫn triển khai cốt lõi Đài Loan | `offering/vi/digicare.md` | |
| 企業生成式 AI 應用平台 | Nền tảng ứng dụng AI tạo sinh cho doanh nghiệp | `offering/vi/systalk-viki.md` | |
| 知識圖譜、企業知識庫 | đồ thị tri thức、kho tri thức doanh nghiệp | `offering/vi/systalk-viki.md`、`systalk-coach.md` | |
| AI 業務培訓、AI 教練 | Đào tạo kinh doanh bằng AI、AI Coach | `offering/vi/systalk-coach.md` | 六個模組名稱也是暫譯 |
| AI 語音質檢、話術 | Kiểm soát chất lượng cuộc gọi bằng AI、kịch bản | `offering/vi/systalk-audit.md` | |
| 國語、台語、客語 | tiếng Quan Thoại、tiếng Đài、tiếng Khách Gia | `offering/vi/systalk-audit.md` | |
| AI 智慧光學字元辨識、自適應 AI | Nhận dạng ký tự quang học thông minh bằng AI、AI tự thích ứng | `offering/vi/systalk-icr.md` | |
| SysTalk.PUZZLE | SysTalk.PUZZLE | `offering/vi/systalk-icr.md` | 產品名，詞彙表沒有這一列 |
| AI Agent 應用平台 | Nền tảng ứng dụng AI Agent | `hub/vi/family-ai.md` | |
| 產品名的現站拼法 | Greenswift、Systalk.Ai、Systalk.chat、Systalk Viki／ICR／Chat／RPA | `blog/vi/` 7 篇（sovereign-ai-la-gi、ai-chu-quyen-la-gi 等） | blog 內文由 `migrate.mjs` 照抄現站，與詞彙表 `confirmed` 的寫法（GreenSwift、SysTalk.ai 等）不同；要統一時在現站改或另做內文覆寫 |
| 碳管理、能源管理、碳盤查、能源監控 | quản lý carbon、quản lý năng lượng、kiểm kê carbon、giám sát năng lượng | `hub/vi/family-esg.md` | 碳盤查照 `node:whitepaper-greenswift` 的暫譯 |
| ESG 數據鏈、雙平台 | Chuỗi dữ liệu ESG、Nền tảng kép | `hub/vi/family-esg.md` | |
