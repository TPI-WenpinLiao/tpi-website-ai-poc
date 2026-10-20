---
name: typescript-best-practices
description: 讀寫 .ts、.astro、.mjs 檔案時使用。TypeScript strict 下的型別設計、邊界驗證與 Astro 專屬慣例。
paths: ["**/*.ts", "**/*.astro", "**/*.mjs"]
---

# TypeScript best practices

> 改寫自 pstack 的 `typescript-best-practices`、`principle-type-system-discipline`、`principle-boundary-discipline`（MIT，來源與授權見 [`../THIRD_PARTY_NOTICES.md`](../THIRD_PARTY_NOTICES.md)）

專案設定：`tsconfig.json` 繼承 `astro/tsconfigs/strict`；`npm run check` 的 `astro check` 會擋型別錯誤。`scripts/` 下的 `.mjs` 沒有型別檢查，但同樣遵守「邊界」一節。

## 原則

讓編譯器拒絕不可能的狀態，而不是在執行期到處補檢查。

- **外部資料在解析前都是 `unknown`**：現站 HTML、API 回應、CSV、frontmatter、環境變數、表單輸入。每個邊界都要有一個 parse 函式把它轉成具名的 domain 型別
- **在邊界驗證，內部信任型別**：驗證、型別收窄、錯誤處理集中在邊界（CLI 參數、設定檔、網路、外部 API、Pages Functions 的 request）。內部的函式不重複驗證
- **型別從權威來源推導**：content collection 用 Zod schema 推導（`z.infer`、`CollectionEntry<'x'>`），design tokens 以 `tokens.css` 為準，不另外手寫平行的型別
- **商業邏輯寫成純函式**：Astro 元件與 Pages Functions 只負責接線，判斷邏輯抽成可單獨測試的函式

## 規則

| 規則 | 說明 |
|---|---|
| Discriminated union | 用 `kind` 字面值區分變體，不用「boolean 加一堆 optional 欄位」 |
| Branded type | 意義不同但同為 string 的值（`Locale`、`Slug`、`SourceUrl`）用 `string & { readonly __brand: 'X' }` 區分；brand 只能由會驗證的 type guard 產生，不用 `as` |
| `unknown` 而非 `any` | 外部資料一律 `unknown` |
| 先用 schema 再手寫 guard | 有 Zod（`astro:content` 的 `z` 或 `astro/zod`）就用 schema 推導型別，不手寫逐欄位的 type guard |
| 不用 `as` | 只在驗證之後才 cast；`satisfies` 優先於 `as`（不會放寬字面值型別） |
| 收窄順序 | discriminant `switch` > `in` > `typeof`／`instanceof` > 使用者定義 type guard > `as` |
| Type guard 必須真的驗證 | 命名為 `isX`／`hasX`；說謊的 guard 比 `as` 更糟 |
| 窮舉檢查 | `switch` 的 `default` 寫 `const _exhaustive: never = x;`，新增變體時編譯失敗 |
| 從既有型別推導 | 先用 `Pick`／`Omit`／`Parameters`／`ReturnType`／`Awaited`／`typeof`，再考慮新宣告 interface |
| 物件參數 | 兩個以上同型別參數時改傳物件，讓呼叫端自帶語意 |
| 不 mock 能真跑的東西 | 驗證 UI 用實際 build 出的頁面；只 mock 本機無法執行的外部服務 |
| 不留 `console.log` | 出貨的程式碼不得有除錯輸出；`scripts/` 的進度輸出例外 |

## Astro 專屬

- 元件 props 用 `interface Props` 宣告，在 frontmatter 以 `Astro.props` 解構；不要用 `any` 承接
- 預設零 client JS：互動才用 island（`client:*`），並在 PR 說明為什麼需要
- `getStaticPaths` 回傳的 `params`／`props` 型別要明確；路由參數視為邊界輸入
- 圖片用 `astro:assets` 的 `<Image>`／`<Picture>`，`alt` 與尺寸必填（見 `seo-checklist`）

## 範例

```ts
// Don't: contradictory states can exist
type FetchState = { loading: boolean; data?: Page; error?: string };

// Do: only valid states exist
type FetchState =
  | { kind: 'loading' }
  | { kind: 'ready'; data: Page }
  | { kind: 'error'; error: string };

function render(state: FetchState): string {
  switch (state.kind) {
    case 'loading':
      return '…';
    case 'ready':
      return state.data.title;
    case 'error':
      return state.error;
    default: {
      const _exhaustive: never = state;
      return _exhaustive;
    }
  }
}
```

```ts
// Brand a value once at the boundary, trust it downstream
type Locale = 'zh-TW' | 'en' | 'vi';
const LOCALES = ['zh-TW', 'en', 'vi'] as const satisfies readonly Locale[];

function isLocale(input: string): input is Locale {
  return (LOCALES as readonly string[]).includes(input);
}

function parseLocale(input: unknown): Locale {
  if (typeof input !== 'string' || !isLocale(input)) throw new Error(`Unknown locale: ${String(input)}`);
  return input;
}
```
