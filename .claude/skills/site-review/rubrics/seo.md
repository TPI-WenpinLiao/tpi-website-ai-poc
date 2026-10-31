# SEO rubric（草案，待使用者確認）

評頁面能不能承接它該承接的搜尋，只評上線後的頁面（原型不評）。技術底線（canonical、hreflang、JSON-LD 格式等）由 `seo-checklist` 與 `npm run check` 負責，這裡只看內容與結構的品質。依據：`docs/strategy/search-intent.md`、`docs/strategy/briefs/<page>.md`、`dist/` 的 HTML。

| # | 項目 | 5 | 3 | 1 |
|---|---|---|---|---|
| S1 | 搜尋意圖對應 | 頁面類型與內容符合 brief 指定的查詢意圖，搜尋者點進來能直接得到想要的 | 主題對，但頁面類型或深度與意圖不完全相符 | 和指定的查詢意圖不符 |
| S2 | 主題涵蓋 | 涵蓋 `search-intent.md` 列的主要子題，且有競品沒有的資訊 | 涵蓋部分子題 | 只有產品名與口號，沒有子題 |
| S3 | title、description 與 h1 | 三者各自清楚、包含主要查詢的用詞、與頁面內容一致，description 讓人想點 | 有用詞但普通，或三者有一個不一致 | 用詞與查詢無關，或只有公司名 |
| S4 | heading 結構 | h2、h3 的文字自己就能說明段落內容，掃 heading 就知道頁面涵蓋什麼 | 結構正確，但 heading 文字是口號或泛稱 | heading 看不出段落內容 |
| S5 | 內部連結 | 照 brief 連出與連入，錨點文字描述目標頁，沒有孤立頁 | 有連結但錨點文字泛稱，或缺 brief 列的幾條 | 幾乎沒有內部連結 |
| S6 | 結構化資料與內容一致 | JSON-LD 的內容與頁面可見內容一致，類型符合 `content-model.md` | 有 JSON-LD，但欄位比頁面內容少或不一致 | 沒有或與內容不符 |

## 評分提示

- S3、S4、S6 看 `dist/` 的 HTML，不看截圖
- 沒有搜尋量資料，S1、S2 只依 `search-intent.md` 記錄的公開搜尋結果判斷
