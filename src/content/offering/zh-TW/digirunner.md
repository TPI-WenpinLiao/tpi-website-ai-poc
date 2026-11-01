---
title: digiRunner API 管理平台
# docs/strategy/briefs/digirunner.md「title 與 description 方向」: the title adds AI Gateway, the h1
# stays the node's name
seoTitle: digiRunner API 管理平台與 AI Gateway
# The current site's meta description, cut to the seo-checklist length (60–80 full-width
# characters): the closing praise is dropped, the facts are unchanged
description: 昕力資訊 digiRunner 企業級 API 管理平台，為現有後端服務設立一致性的 API 閘道，提供 API 開發設計、部署發佈、權限控管、資安管理、API 組合與串接等完整管理功能。
translationKey: digirunner
node: digirunner
kind: product
# Rewritten from the brief (#167): the category and what it is for. Wording, no facts
tagline: 關鍵系統的 API 與 AI 串接，交給同一個管理平台
heroPoints:
  - 通過 ISO27001 資訊安全認證
  - 30 天免費試用
secondaryCta:
  label: 試用 digiRunner on Cloud
  node: digirunner-cloud
# Sections 2–9 of the brief, in its order (the IT lead's questions). Bodies are wording; points are
# fact texts, verbatim (facts below)
features:
  - title: 接上既有系統，不必先汰換
    body: digiRunner 涵蓋 API Gateway、API 生命週期管理與 AI Gateway。它放在既有系統前面，負責 API 的組合、格式轉換與串接，後端不必先汰換；外部夥伴也能自己註冊、登入後接上 API。
    points:
      - 使用 API 組合與設計（API Composer）功能，支援多種 API 格式轉換，拖拉即可輕鬆組合打造出新的 API
      - 圖形化管理介面可快速便利開發，以流程視覺化方式串接各種 Protocol（如 DB、FTP），並支援各種格式轉換（如 JSON、XML、SOAP）。
      - digiRunner 透過 Nginx 將流量分配到各個伺服器端點，以確保 API 服務的穩定性。此外，也可整合現有的 WAF 廠商，如 F5 或 No Name Security。
      - 支援使用者自助註冊與登入。
  - title: AI 流量走同一道 Gateway
    body: 企業接 AI 模型時，負載、模型配置、內容審查與流量監控沿用 API 管理的機制，不必另外建一套。
    points:
      - AI Gateway 智能負載平衡與安全防護，全面監控AI運作
      - 根據需求調配不同類型的AI模型，靈活平衡效能與成本
      - 在輸入內容時與產生輸出前，皆可自動檢測，防止不適當內容產生
      - 快速整合企業內部AI應用，實時監控AI流量，強化服務穩定性
      - 整合 MCP 協定與 AI Gateway 架構，讓 AI 模型安全串接企業 API、資料與業務流程
  - title: 部署環境由企業決定
    body: 地端、雲端、Kubernetes、多雲與混合雲都能部署；要用雲端版，可以直接從雲端市集開始。
    points:
      - 支援地、雲端部署及 K8s 微服務架構
      - digiRunner提供高效的雲端 API 管理解決方案，支援多雲和混合雲環境，並整合 Kubernetes 微服務架構。
      - 透過容器化架構可快速簡便完成部署與管理、確保應用環境一致性
    link:
      label: 看 digiRunner on Cloud
      node: digirunner-cloud
  - title: 資安機制內建
    body: 認證、授權、加密與惡意行為防護都在平台裡，以下是支援的標準。
    points:
      - digiRunner 支援 OAuth 2.0 認證、OIDC (OpenID Connect) 與 API Key 授權方式，資安機制包含 mTLS 憑證安全、 JWT 金鑰加密，提供企業對外 Domain URL 設定、支援硬體加密模組 (HSM) 介接。
      - 提供完整 API 生命周期管理，更遵循 Open API 規範，支援 OAuth2.0 及 OIDC（OpenID Connect）的安全規範
      - 具備惡意行為防護功能，可以識別程式碼注入、跨站台腳本攻擊、SQL 攻擊語法與 XML、JSON 結構語法威脅；並能搭配防毒軟體偵測病毒攻擊。
      - 內建零信任的 API 存取防護機制，支援 OIDC /OAuth2 等技術標準，具備即時監控與告警，可防止 API 惡意攻擊與資料外洩，有效維持系統服務的安全性。
  - title: 尖峰流量與單點故障
    body: 一台伺服器出問題時請求自動轉走，流量起落時容量跟著伸縮。效能數字取決於環境配置，以下照原文列出。
    points:
      - 在高可用性的架構下，如果其中一個 API 伺服器（指 digiRunner）出現故障，所有請求都會自動分流至另一個伺服器，全程無需人為操作。
      - 彈性動態橫向延展，可因應系統尖、離峰時段，進行擴充或縮減
      - 內建原生負載平衡機制，透過平台介面直接設定、即時啟動
      - digiRunner 內建專利認證的獨家智慧快取技術（Smart Caching），可依據 API 負載情形動態式儲存多個節點的數據。
      - 零阻塞式運行模式增強 API 處理的效率和速度，讓多支 API 之間的運行互不干擾
      - 常規 2 Core CPU / 4GB RAM 的 digiRunner 已足以應付企業一般用量。我們建議採用 4 Core CPU / 8GB RAM 的型號，每秒交易量的效能可達 300-1000 TPS。實際每秒交易量取決於不同環境的配置。
  - title: API 與 AI 的使用軌跡
    body: 出問題時查得到來源，稽核時拿得出紀錄。
    points:
      - 即時主控台完整保留 API 活動與軌跡
      - 完整錄所有AI使用歷程，確保業務流程和數據使用符合監管要求
      - 可視化的 OpenSearch 圖表，有助於掌控系統狀態且降低維運成本。
  - title: 先試用再決定
    body: 導入前可以先試。雲端版的試用條件寫在下面，包括到期後的計費方式。
    points:
      - 在免費試用期間，各方案（digiRunner Enterprise High Availability/Standalone 及 digiRunner Lite High Availability/Standalone）所具備的功能皆可使用，且不會收取任何授權費。
      - 每項產品試用 30 天，試用期間不會收取任何軟體費用，但 AWS仍會收取基礎設施費用。 免費試用期到期後將自動轉換為付費訂閱
      - 在不影響現行服務運作下，讓開發人員在安全環境中自訂模擬資料，快速進行測試，同時支持前後端平行開發。
    link:
      label: 試用 digiRunner on Cloud
      node: digirunner-cloud
# Section 6 of the brief: what the rules of finance and government ask, and what does it. After the
# fourth feature (資安機制內建), before 尖峰流量. `industry` lets the industry pages find this page
useCasesTitle: 金融與政府的規範要求
useCasesAfter: 4
useCases:
  - title: 開放銀行與金融檢查
    body: 昕力資訊 digiRunner API 管理平台反應台灣開放銀行金管會法規要求
    industry: finance
  - title: 政府共通性 API 規範
    body: 符合國家發展委員會【共通性應用程式介面規範】。
    industry: government
heroImage: ../../../assets/design/ribbon/page-digirunner.webp
cta: demo
facts:
  - cert-iso27001-digirunner
  - digirunner-trial-30-days
  - digirunner-api-composer
  - digirunner-gov-protocols
  - digirunner-nginx-waf
  - digirunner-gov-portal
  - digirunner-ai-gateway
  - digirunner-ai-model-config
  - digirunner-ai-content-review
  - digirunner-ai-traffic
  - digilism-family-digirunner
  - digirunner-deployment
  - digirunner-multi-cloud
  - digirunner-cloud-containers
  - digirunner-security
  - digirunner-api-lifecycle
  - digirunner-gov-threat-protection
  - digirunner-zero-trust
  - digirunner-failover
  - digirunner-container-scaling
  - digirunner-load-balancing
  - digirunner-smart-caching-patent
  - digirunner-parallel-processing
  - digirunner-tps
  - digirunner-console
  - digirunner-ai-usage-log
  - digirunner-cloud-opensearch
  - digirunner-trial-all-features
  - digirunner-cloud-trial-terms
  - digirunner-sandbox
  - digirunner-open-banking-fsc
  - digirunner-ndc-spec
sourceUrl: https://www.tpisoftware.com/products/digirunner
migratedAt: 2026-10-22
---
