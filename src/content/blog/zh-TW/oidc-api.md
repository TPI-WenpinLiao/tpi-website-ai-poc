---
title: OIDC 如何解決密碼安全與 API 管理混亂的問題？
description: OIDC 是基於 OAuth 2.0 的身分驗證與授權開放標準。本文說明如何以 API Token 驗證身分、授權並限制次數與時間，解決 API 管理混亂。
translationKey: oidc-api
category: enterprise-management
tags: [api-management]
publishedAt: 2023-11-08
author: Brandon Fang
authorType: Person
# https://tpi.dev/tpi-dev/private/article/IMG/1f06062b-6dcc-69db-8cfc-bf8fc57a6792.png
coverImage: ../../../assets/blog/zh-TW/oidc-api/cover.webp
sourceUrl: https://www.tpisoftware.com/blog/smartm/oidc-api
migratedAt: 2026-10-23
sourceUpdatedAt: 2023-11-08
---

*據 Home Security Heroes 研究，使用 AI 破解程式測試 1,568 萬組密碼，其中超過 50％在1分鐘內被破解。在 OAuth 2.0 Password Grant 中，甚至完全禁止用密碼交換憑證，取而代之，OAuth 建議使用 Authorization Code 無密碼驗證機制。*

## 無密碼驗證機制OIDC是什麼？

OIDC（OpenID Connect）是基於 OAuth 2.0、用於身份驗證和授權的開放標準協定，使網路應用程式彼此間，建立一個安全的信任關係，並簡化用戶身份的驗證流程。

OIDC 通過驗證伺服器（Authentication server）驗證用戶身份，將驗證成功的訊息回傳給客戶端應用程式，讓用戶只需要一組憑證就能訪問多個應用程式，不需要重新驗證。

OIDC 的好處是提供更好的用戶體驗，同時也提高安全性，幫助開發者確認用戶身份，並讓使用者體驗更便捷。另一方面，對企業而言除身分驗證、授權外， API 的驗證與管理也至關重要， API 過於混亂是企業常見痛點，如何妥善運用 API Token 驗證身份、授權、限制次數及使用時間，更是資安管理的重點項目之一。

### 輕忽 API 管理將暴露企業於風險之下

企業或機構常遇到 API 過多而造成管理上的困難，過多的 API 格式，常常一有需求就要重寫，而要授權內、外部使用 API，權限往往也不一樣，管理上容易混亂又難以清查，甚至連 API 安不安全，企業內部可能都不確定。

早在 2019 年，Gartner 的研究《API Security: What You Need to Do to Protect Your APIs》就指出，API 的攻擊持續不斷發生中，企業必須設計並執行有效的 API 管理策略，保護企業的 API。

政治大學資訊管理學系教授陳恭在 2020 年臺灣資安大會提到，API 安全有2大挑戰：第一，被企業遺忘、少用、廢棄的 API 是駭客最愛攻擊的目標；第二，駭客會從合法管道進入企業內部伺機攻擊，許多企業甚至過了很久才察覺到這些漏洞。

為了解決 API 管控及身份驗證的困擾，昕力資訊開發 digiRunner API 管理平台，協助企業和組織輕鬆管理 API，同時省去建置 AuthN 與 AuthZ 機制的時間和成本，免開發、免單元測試、免爬文、免欠技術債，是實踐核身與授權機制的上上之選。

### digiRunner 採用 OIDC 徹底解決密碼安全和 API 混亂問題

[digiRunner](/products/digirunner) 採用 OIDC 的授權流程，它是OAuth 2.0 的進階版本，扮演驗證伺服器（Authentication server）的角色，簽發 Access Token 與 ID Token 處理身份驗證和授權，確保資料安全，只有經過驗證的用戶可以訪問特定資源，甚至對機敏交易也可以實現二次核身流程。

digiRunner 除了處理身份驗證外，還可藉由 API 管理主控台和 API 入口網，有效管理API 混亂、安全、格式轉換之困難。對內部 IT 和 API 開發人員而言，API 管理主控台可將 API 串接到 digiRunner 統一代管；內、外部開發人員則可藉由 API 入口網，以單一入口就能找到上架到入口網的所有 API。

在監控方面，digiRunner 可設定閥值，當條件滿足會立即以 E-mail 或 Line 進行通知，企業也可設定流量與 IP 黑、白名單，無論是 API Key 或 Token 機制 都能透過 API 主控台輕鬆設定，甚至限制使用者特定時間訪問、呼叫 API 也沒有問題。

digiRunner 內含 API 統計報表可以快速查詢 API 使用狀況與使用次數，了解哪一個 API 最受歡迎與最少使用，同時 API Log 也可以快速滿足企業內外部稽核需求。

即使擁有這麼多強大的功能，digiRunner 的操作介面卻非常直覺且便利，舉例來說，digiRunner 透過拖拉功能節點到操作工作頁，就可以輕鬆建立一支新的 API。

導入 digiRunner 可協助企業降低 API 維護控管的成本、快速偵測資安風險，同時符合OAuth2、OIDC 技術標準與國內規範，大幅縮短企業建立 API 管理的時間，省去 API 授權、流量管理、加密、日誌等繁瑣事務，只需專心處理自身 API 服務，大大提升公司整體效率。

[digiRunner](/products/digirunner) 可獨立做為驗證伺服器(Auth Server)，幫助您解決驗證與 API 管理問題，若您在密碼安全及 API 管控遭遇困難，歡迎[聯繫昕力資訊](/contact-us)，我們將免費為您提供專業諮詢服務。

了解當前趨勢分析、面臨的挑戰及最佳實踐，[立即下載API管理白皮書](https://tpisoftware07781.pse.is/000-3)
