# 0007. Cookie 同意與 GTM 的載入

- 狀態：已採用
- 日期：2026-10-28
- issue：#36（M6-04）

## 背景

M1-05 定了新站只用 GTM，三語都要有 cookie 同意機制（`docs/research/audience-and-goals.md` 第 18、19 題）。現站沒有同意機制，4 個 GTM 容器不沿用（`docs/research/features.md`「追蹤碼」）。

同一份文件的問題 6、8 還沒有答案：GTM 裡要放哪些 tag、要遵循哪些法規或公司政策、橫幅文案由誰提供。cookie 類別與文案因此沒辦法定案。使用者 2026-10-28 決定先做好機制，顯示與否看有沒有設定容器 ID。

## 決策

1. **同意前不連 Google**：訪客同意至少一個非必要類別之前，頁面不載入 gtm.js，也沒有 `dataLayer`。
   - 不用 Google Consent Mode 的 advanced 模式。那種模式在同意前就會載入 GTM，送出不帶 cookie 的 ping，跟 issue 的驗收條件「未同意前不送出追蹤請求」衝突
   - 同意後才載入（`src/lib/consent/gtm.ts`）：先推 `gtag('consent', 'default', …)`（必要類別 granted、其他 denied），接著推訪客的 `update`，最後注入 gtm.js。這樣容器裡的 tag 從一開始就看得到同意狀態，tag 是否依類別啟動，在 GTM 裡設定
   - consent 指令要以 `arguments` 物件推進 `dataLayer`，跟 Google 的 snippet 一樣。推陣列的話 GTM 不會把它當成 consent 指令
2. **沒有 `PUBLIC_GTM_ID` 就沒有橫幅**：沒有追蹤就沒有需要同意的東西。`src/lib/consent/page.ts` 只在 build 有 ID 時，才讓 `PageLayout` 輸出 `ConsentBanner` 與頁尾的「Cookie 設定」。
   - `PageLayout` 用動態 import 載入元件。靜態 import 會讓沒有 ID 的 build 每頁也多帶約 5 KB 的 CSS（實測）
   - 沒有 ID 的 `dist/` 跟沒有這個功能時一樣，Lighthouse 與視覺回歸不受影響
3. **draft 擋上線**：類別與三語文案在 `src/data/consent.ts`，目前是 `draft: true` 的佔位內容。
   - 有 ID 但還是 draft 時 build 失敗，避免佔位文案上線。ID 不符 `GTM-XXXX` 格式時也失敗
   - 只有 `scripts/consent/gtm.mjs` 的測試 build 會設 `CONSENT_ALLOW_DRAFT=1` 放行
4. **儲存**：
   - `localStorage` 的 `tpi-consent` 存 `{ version, granted, at }`（`src/lib/consent/state.ts`）
   - 不用 cookie：這是靜態站，伺服器不需要讀這個值
   - 存的 `version` 跟 `consent.ts` 的不同，或資料格式錯誤時，視為還沒選，橫幅重新出現。類別或文案改版時要把 `version` 加 1
   - `localStorage` 不能用時（無痕視窗、封鎖網站資料）不報錯，這次的選擇只在這一頁有效，下次造訪會再問
5. **撤回同意時重新載入頁面**：已經執行的 tag 無法從頁面上移除。存下新的選擇後重新載入，頁面就在新的狀態下開始。只增加類別的話不用重新載入，推一次 consent `update` 即可
6. **元件**：`ConsentBanner` 的畫面在階段一定案（`design-approved`），見 `design-system` skill 的元件表。
   - 橫幅預設 `hidden`，由 script 判斷要不要顯示。沒有 JavaScript 時不顯示，也不會載入 GTM
   - 元件放在 `PageLayout` 的 `body` 層級。放進有 transform 或自己 stacking context 的容器，固定定位的橫幅會被蓋住

## 數字

- 有 ID 時每頁多一段 inline script：2,889 bytes，gzip 後 1,328 bytes（`dist/design-system.html` 內同一段 script，2026-10-28）
- `node scripts/consent/gtm.mjs` 在本機跑一次約 75 秒，其中大部分是第二次 build

## 設定（正式上線前）

由使用者完成，列進 M8-02 launch-readiness（#44）：

1. 內容負責人提供 `src/data/consent.ts` 的類別與三語文案，依 GTM 容器裡的 tag 填好每個類別的 `consentTypes`，改成 `draft: false`
2. 在 GTM 容器裡設定 tag 的同意條件（Consent settings），確認 tag 會依 `analytics_storage`、`ad_storage` 等設定啟動
3. 在 Pages 專案的 Settings → Environment variables 設定 `PUBLIC_GTM_ID`（build 時使用，改了要重新部署）

## 驗證

- `scripts/consent/state.test.mjs`（`npm run test:scripts`）：讀寫 `localStorage`、版本不符與格式錯誤、consent 參數、何時載入 GTM、何時算撤回
- `scripts/consent/gtm.mjs`（`npm run check`，build 之後）：
  - `dist/` 除了 `/design-system` 之外沒有橫幅與 GTM
  - 用測試 ID 另外 build 一份，在 `/`、`/en`、`/vi`、`/privacy` 上檢查：首次載入沒有站外請求、鍵盤操作與焦點、axe、拒絕後重新載入仍然沒有請求、同意一個類別後只請求一次 gtm.js 且 consent 參數正確、撤回後重新載入不再請求、全部接受會載入 GTM
  - 2026-10-28 反向驗證：讓 script 不論選擇都載入 GTM，4 頁都失敗

## 取捨與限制

- 原生 modal `<dialog>` 的 Tab 走過最後一個控制項後，會跳到瀏覽器自己的 UI，不會回到第一個控制項。對話框後面的頁面是 inert，焦點不會跑到頁面上，所以不另外寫焦點循環的 script
- 撤回同意時，GTM 已經寫下的 cookie 不會被刪除。要刪除的話，要在 GTM 裡設定，或等法規需求確定後再處理（PR #142「待確認問題」）
