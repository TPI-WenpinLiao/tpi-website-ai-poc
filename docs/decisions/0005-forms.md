# 0005. 表單的送出、驗證與防垃圾

- 狀態：已採用
- 日期：2026-10-26
- issue：#33（M6-01）

## 背景

新站部署在 Cloudflare Pages，沒有自己的後端（ADR 0001 定了表單用 Pages Functions）。M1-04（`docs/research/features.md`）建議表單沿用現站的 `/tpi/api/*`，但後端是否開放新站網域的 CORS、reCAPTCHA 的網域設定都還沒確認（「待確認」1、2）。所以 M6-01 先把「收到表單之後做什麼」抽成 adapter，預設只寫 log，接後端時只換 adapter。

M6-01 只接 `/contact-us`（三語）。白皮書 4 篇都是 `draft: true`、`file: 待確認`，gated-download 的表單維持沒有 `action`；之後接上時沿用同一套。

## 決策

1. **一張規則表，前後端跑同一個函式**：`src/lib/forms/rules.ts` 的 `FORMS` 寫每張表單的欄位規則（必填、長度上限、email、電話、多選題至少一項、個資同意），`validate()` 依規則回傳 `{ field, code }`。頁面的 script 與 Pages Function 都呼叫它，所以瀏覽器只會顯示伺服器也會給的錯誤；伺服器的結果為準（`maxlength` 可以被繞過，伺服器仍然擋）。欄位的 `maxlength` 也從這張表來。不用 zod：前端也要載入規則，zod 會讓聯絡頁多出一個 schema 套件，規則表加 `validate()` 打包後的表單 script 約 2.5 KB（gzip）
2. **Pages Function 只負責接線**：`functions/api/contact.ts` 把設定交給 `src/lib/forms/handler.ts` 的 `handleSubmission()`，判斷都在這個純函式裡，`node --test` 不需要 Cloudflare 就能跑。順序：
   1. `TURNSTILE_SECRET_KEY` 沒設定 → 一律拒絕（fail closed），不會因為忘了設定就變成沒有防垃圾
   2. 欄位驗證不通過 → 400 與錯誤清單。放在 Turnstile 之前，不為一定會被拒的資料呼叫 Siteverify
   3. Turnstile 不接受 token → 403
   4. 交給 adapter；adapter 丟出錯誤 → 500，訪客看到「送出失敗」，表單內容保留
   5. 成功 → `{ kind: 'ok', next }`，頁面導到 `next`（該語系的 `/thanks`）；`next` 只接受站內路徑
3. **adapter**：`src/lib/forms/adapter.ts` 的 `SubmitAdapter` 只有 `send(submission)`。預設的 `logAdapter` 每次送出寫一行 JSON 到 Pages Function 的 log：表單 id、有填的欄位名稱、時間，不寫任何欄位的值。Cloudflare 的 log 不是給業務看資料的地方，個資不進 log
4. **Turnstile 延後載入**：`challenges.cloudflare.com` 的 script 在訪客第一次 focus 進表單時才載入，頁面載入時沒有站外請求，Lighthouse 不受影響。widget 放在 `FormPanel` 預留的空間（`--challenge-height*`，出現時不推動版面）；預留空間寬度不到 300px（flexible 的最小寬度）時用 compact，否則用 flexible。token 只能驗證一次，每次送出失敗後重設 widget
5. **金鑰**：
   - site key 是公開值，build 時讀 `PUBLIC_TURNSTILE_SITE_KEY`；沒有設定時用 Cloudflare 公開的測試 site key（必過）
   - secret 只在 Pages Function 執行時從環境變數 `TURNSTILE_SECRET_KEY` 讀，不進 repo
   - 本機與 CI 的檢查用 stub 取代 Siteverify，不需要任何金鑰。`src/lib/forms/turnstile.ts` 列出 Cloudflare 公開的測試 key，它們不是 secret
6. **沒有 script 時**：表單有 `method="post"` 與 `action`，瀏覽器會直接 POST，個資不會進到 URL。但沒有 script 就沒有 Turnstile token，送出一定失敗，Function 回 303 回到原頁

## 設定（正式上線前）

本專案是 PoC，目前不做這些設定（使用者 2026-10-27 決定），preview 上的表單送出一律失敗，表單的行為由「驗證」的兩支檢查確認。正式上線時由使用者在 Cloudflare 完成：

1. 在 Cloudflare dashboard 建立 Turnstile widget，網域加上 `*.pages.dev` 的專案網域（之後加正式網域）
2. 在 Pages 專案的 Settings → Environment variables，production 與 preview 都設定：
   - `PUBLIC_TURNSTILE_SITE_KEY`：widget 的 site key（build 時使用，改了要重新部署）
   - `TURNSTILE_SECRET_KEY`：widget 的 secret key，用 Encrypt 存成 secret

沒有設定時，表單會顯示測試 widget，送出一律失敗（第 2 點的 fail closed）。

## 驗證

- `scripts/forms/forms.test.mjs`（`npm run test:scripts`）：規則、Function 的每個分支（含 Turnstile 拒絕時 adapter 沒有被呼叫、沒有 secret 時拒絕、`next` 只接受站內路徑）、Siteverify 回應的解析、log 不含欄位值
- `scripts/forms/contact.mjs`（`npm run check`，build 之後）：對每個有送出表單的頁面，在瀏覽器裡用 `handleSubmission()` 當 Function、用 stub 取代 Turnstile，檢查載入時沒有站外請求、空白送出時錯誤摘要取得焦點且欄位與 Function 回報的相同、填好後送到 adapter 並導到 `next`、token 被拒時顯示安全驗證訊息並重設 widget、widget 在 1280px 是 flexible、375px 是 compact

## 之後

- 改送到後端：新增一個 adapter（例如呼叫 `/tpi/api/Utility/SendMail`），在 `functions/api/contact.ts` 換掉 `logAdapter`。要先確認 `features.md`「待確認」1、2
- 新表單（白皮書下載等）：在 `FORMS` 加規則、在 `functions/api/` 加 Function、頁面的 `FormPanel` 傳 `form`、`action`、`next`
