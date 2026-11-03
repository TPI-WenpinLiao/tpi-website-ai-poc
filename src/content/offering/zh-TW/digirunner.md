---
title: digiRunner API 管理平台
# docs/strategy/briefs/digirunner.md「title 與 description 方向」: the title adds AI Gateway, the h1
# stays the node's name
seoTitle: digiRunner API 管理平台與 AI Gateway
# docs/strategy/briefs/digirunner.md「description」: the category, one Gateway for APIs and AI
# models, where it deploys, one security mechanism and the trial, without numbers (#167)
description: digiRunner 是昕力資訊的 API 管理平台，把既有系統與 AI 模型的串接集中在同一道 Gateway 管理，支援地端、雲端與 Kubernetes 部署，內建零信任存取防護，可先試用再導入。
translationKey: digirunner
node: digirunner
kind: product
# Rewritten from the brief (#167): the category and what it is for. Wording, no facts
tagline: 關鍵系統的 API 與 AI 串接，交給同一個管理平台
# brief「段落結構」第 1 段的說明句（40–60 字）: the category, who it is for and what it does.
# Wording, no facts
heroLead: digiRunner 是 API 管理平台：金融與政府的關鍵系統要開放出去的 API、要接進來的 AI 模型，都經過同一道 Gateway，權限、流量與紀錄在同一處管理。
# Three proof points (brief 第 1 段, #187): 30 天免費試用 moved to section 9 with its terms
heroPoints:
  - 通過 ISO27001 資訊安全認證
  - 支援地、雲端部署及 K8s 微服務架構
  # No year: the current site gives none (#180)
  - DigiLism 產品系列擁有7項發明專利
# The blocks on the hero picture that land in its frame (src/lib/scene/ribbon/pictures.json)
heroLabels:
  core: 核心系統
  legacy: 既有系統
  product: digiRunner
  model: AI 模型
secondaryCta:
  label: 試用 digiRunner on Cloud
  node: digirunner-cloud
# Sections 2–9 of the brief, in its order (the IT lead's questions), each in the layout
# design-principles.md「offering：digiRunner 產品頁」gives it. Headings, bodies, labels and diagram
# words are wording; items, rows and fragment rows are fact texts or words taken from them (facts below)
sections:
  - layout: junction
    id: connect
    heading: 接上既有系統，不必先汰換
    body: digiRunner 包含 API Gateway、API 生命週期管理與 AI Gateway。它放在既有系統前面，負責 API 的組合、格式轉換與串接，後端不必先汰換。
    link:
      label: DigiLism 數位轉型產品家族
      node: family-dx
    diagram:
      caption: 既有系統的 DB、FTP 等協定接到 digiRunner，由它組合、轉換成新的 API，流量經過 Nginx 與現有的 WAF。
      columns:
        - title: 既有系統
          tone: legacy
          nodes:
            - label: DB
            - label: FTP
        - title: digiRunner
          tone: product
          nodes:
            - label: API Composer
            - label: JSON、XML、SOAP 格式轉換
            - label: Nginx 與現有的 WAF
        - title: 新的服務
          tone: new
          nodes:
            - label: 新的 API
    items:
      - body: "API Gateway：一站式的 API 管理，確保資料交換的速度與安全。\n既有系統重構：透過 API 化、微服務化，提升系統效能並確保長期維護的彈性。\n企業中台建構"
      - body: 使用 API 組合與設計（API Composer）功能，支援多種 API 格式轉換，拖拉即可輕鬆組合打造出新的 API
      - body: 圖形化管理介面可快速便利開發，以流程視覺化方式串接各種 Protocol（如 DB、FTP），並支援各種格式轉換（如 JSON、XML、SOAP）。
      - body: digiRunner 透過 Nginx 將流量分配到各個伺服器端點，以確保 API 服務的穩定性。此外，也可整合現有的 WAF 廠商，如 F5 或 No Name Security。
      - body: 支援使用者自助註冊與登入。
  - layout: ui
    id: ai-gateway
    heading: AI 流量走同一道 Gateway
    body: 企業接 AI 模型時，模型配置、內容審查與流量監控沿用 API 管理的機制，不必另外建一套。
    fragment:
      title: AI Gateway
      rows:
        - label: 模型配置
          state: "on"
        - label: 內容審查
          state: "on"
        - label: 流量監控
          state: "on"
      note: 企業的 API 與 AI 模型之間，隔著同一道 Gateway。
    items:
      - body: AI Gateway 智能負載平衡與安全防護，全面監控AI運作
      - body: 根據需求調配不同類型的AI模型，靈活平衡效能與成本
      - body: 在輸入內容時與產生輸出前，皆可自動檢測，防止不適當內容產生
      - body: 快速整合企業內部AI應用，實時監控AI流量，強化服務穩定性
      - body: AI Governance 確保AI應用合規，強化企業風險控管
  - layout: spec
    id: deployment
    fill: subtle
    image: ../../../assets/design/sec-deployment.webp
    heading: 部署環境由企業決定
    body: 地端、雲端、Kubernetes、多雲與混合雲都能部署；要用雲端版，可以直接從雲端市集開始。
    rows:
      - label: 地端與雲端
        values: [支援地、雲端部署及 K8s 微服務架構]
      - label: 多雲與混合雲
        values: [digiRunner提供高效的雲端 API 管理解決方案，支援多雲和混合雲環境，並整合 Kubernetes 微服務架構。]
      - label: 容器化
        values: [透過容器化架構可快速簡便完成部署與管理、確保應用環境一致性]
      - label: 雲平台
        values: [AWS GCP Azure]
    link:
      label: digiRunner on Cloud 支援的雲平台與部署方式
      node: digirunner-cloud
  - layout: ui
    id: security
    flip: true
    heading: 資安機制內建
    body: 認證、授權、加密與惡意行為防護都在平台裡，不必另外拼裝。
    fragment:
      title: API 認證方式
      rows:
        - label: OAuth 2.0
          state: "on"
        - label: API Key
          state: "on"
        - label: X API Key
          state: "off"
        - label: 白名單（Whitelist）
          state: "off"
        - label: HTTP 基本認證
          state: "off"
      note: 外部呼叫進到 Gateway 時，先過這一道認證。
    items:
      - body: digiRunner 支援 OAuth 2.0、API Key、X API Key、白名單（Whitelist）與 HTTP 基本認證。為確保數據完整性和保密性，可選擇使用 JWT 標準（RFC-7519）的JWS (RFC-7515) 或 JWE (RFC-7516) 對數據進行加密或解密。
      - body: digiRunner 支援 OAuth 2.0 認證、OIDC (OpenID Connect) 與 API Key 授權方式，資安機制包含 mTLS 憑證安全、 JWT 金鑰加密，提供企業對外 Domain URL 設定、支援硬體加密模組 (HSM) 介接。
      - body: 內建零信任的 API 存取防護機制，支援 OIDC /OAuth2 等技術標準，具備即時監控與告警，可防止 API 惡意攻擊與資料外洩，有效維持系統服務的安全性。
      - body: 具備惡意行為防護功能，可以識別程式碼注入、跨站台腳本攻擊、SQL 攻擊語法與 XML、JSON 結構語法威脅；並能搭配防毒軟體偵測病毒攻擊。
  - layout: spec
    id: regulations
    fill: subtle
    heading: 金融與政府的規範要求
    body: 開放銀行與金融檢查的法規要求、政府的共通性 API 規範，已經做在 digiRunner 的功能裡。
    rows:
      - label: 台灣開放銀行
        values:
          - 昕力資訊 digiRunner API 管理平台反應台灣開放銀行金管會法規要求
          - 昕力資訊實現三階段開放銀行規範
        link:
          label: 金融業的開放銀行與金融檢查要求
          node: industry-finance
      - label: 金融檢查
        values:
          - "針對金融檢查，完善 API 管理：\nAPI 生命週期作業\n訂定交易限制\n訂定連線識別名稱產製方式\n定期盤點作業及風險評估\n進行資源與服務監控作業\n完善之服務憑證管理規範\n進行分類分級管理\nAPI Key 識別認證\n採用 OAuth 2.0"
      - label: 政府共通性 API 規範
        # The OAS fact goes with the government's spec (brief 第 6 段、取捨第 11 項): three rows
        values:
          - 符合國家發展委員會【共通性應用程式介面規範】。
          - 符合國際 Open API Initiative 組織之 OpenAPI Specification（以下簡稱 OAS）標準來定義 RESTful APIs。
        link:
          label: 政府與公部門的共通性 API 規範
          node: industry-government
  - layout: junction
    id: availability
    heading: 尖峰流量與單點故障
    body: 一台伺服器故障時，請求自動分流到另一台；尖、離峰時段，容量跟著擴充或縮減。
    diagram:
      caption: 兩台 digiRunner 之中一台故障時，請求分流到另一台；資料存在 Redis，採 Active/Standby 架構。
      columns:
        - title: 請求
          tone: legacy
          nodes:
            - label: API 呼叫
        - title: digiRunner
          tone: product
          nodes:
            - label: API 伺服器
              state: down
            - label: 另一個伺服器
        - title: Redis 資料庫
          tone: legacy
          nodes:
            - label: Active
            - label: Standby
              state: standby
    items:
      - body: 在高可用性的架構下，如果其中一個 API 伺服器（指 digiRunner）出現故障，所有請求都會自動分流至另一個伺服器，全程無需人為操作。
      - body: 彈性動態橫向延展，可因應系統尖、離峰時段，進行擴充或縮減
      - body: 內建原生負載平衡機制，透過平台介面直接設定、即時啟動
      - body: digiRunner 內建專利認證的獨家智慧快取技術（Smart Caching），可依據 API 負載情形動態式儲存多個節點的數據。
      - body: 零阻塞式運行模式增強 API 處理的效率和速度，讓多支 API 之間的運行互不干擾
      - body: 數據將以 RDB 格式保存在 Redis 資料庫。資料庫可根據客戶需求進行配置。 我們的金融產業合作夥伴多採用具高可用性的 Active/Standby 架構。若預算較高，可結合 Active/Active 架構與災難恢復，或採 Active/Active/Standby 三模式架構，以便能在故障發生後快速備份及復原。
    rows:
      - label: 硬體與每秒交易量
        values: [常規 2 Core CPU / 4GB RAM 的 digiRunner 已足以應付企業一般用量。我們建議採用 4 Core CPU / 8GB RAM 的型號，每秒交易量的效能可達 300-1000 TPS。實際每秒交易量取決於不同環境的配置。]
  - layout: ui
    id: logs
    heading: API 與 AI 的使用軌跡
    body: 出問題時查得到來源，稽核時拿得出紀錄。
    fragment:
      title: 即時主控台
      tabs: [API 活動與軌跡, AI 使用歷程]
      rows:
        - label: API 活動與軌跡
        - label: OpenSearch 圖表
    items:
      - body: 即時主控台完整保留 API 活動與軌跡
      - body: 完整錄所有AI使用歷程，確保業務流程和數據使用符合監管要求
      - body: 可視化的 OpenSearch 圖表，有助於掌控系統狀態且降低維運成本。
  - layout: band
    id: trial
    heading: 先試用再決定
    body: 導入前，可以先用完整功能試用雲端版。
    items:
      - title: 30 天免費試用
        body: 每項產品試用 30 天，試用期間不會收取任何軟體費用，但 AWS仍會收取基礎設施費用。 免費試用期到期後將自動轉換為付費訂閱
      - body: 在免費試用期間，各方案（digiRunner Enterprise High Availability/Standalone 及 digiRunner Lite High Availability/Standalone）所具備的功能皆可使用，且不會收取任何授權費。
      - body: 在不影響現行服務運作下，讓開發人員在安全環境中自訂模擬資料，快速進行測試，同時支持前後端平行開發。
    fragment:
      title: digiRunner on Cloud 方案
      rows:
        - label: Lite (Standalone)
        - label: Lite (High Availability)
        - label: Enterprise (Standalone)
        - label: Enterprise (High Availability)
    link:
      label: 試用 digiRunner on Cloud
      node: digirunner-cloud
# Section 6 of the brief: what the rules of finance and government ask, and what does it. After the
# fourth feature (資安機制內建), before 尖峰流量. `industry` lets the industry pages find this page
useCasesTitle: 金融與政府的規範要求
useCasesAfter: 4
useCases:
  - title: 開放銀行的法規要求
    body: 昕力資訊 digiRunner API 管理平台反應台灣開放銀行金管會法規要求
    industry: finance
  - title: 三階段開放銀行規範
    body: 昕力資訊實現三階段開放銀行規範
    industry: finance
  - title: 金融檢查的 API 管理作業
    body: 針對金融檢查，完善 API 管理： API 生命週期作業 訂定交易限制 訂定連線識別名稱產製方式 定期盤點作業及風險評估 進行資源與服務監控作業 完善之服務憑證管理規範 進行分類分級管理 API Key 識別認證 採用 OAuth 2.0
    industry: finance
  - title: 政府共通性 API 規範
    body: 符合國家發展委員會【共通性應用程式介面規範】。
    industry: government
  - title: OpenAPI 規格
    body: 符合國際 Open API Initiative 組織之 OpenAPI Specification（以下簡稱 OAS）標準來定義 RESTful APIs。
# Section 10 of the brief: cases as rows (design-principles.md「案例列」). client, work, result
# and award are fact texts; Taishin's award sits on its row (messaging.md DM-8). 安泰銀行 has no
# work or result fact (brief「待確認」第 8 項), Pharmacity no zh-TW case page (第 9 項)
caseNotes:
  - client: 台新銀行
    work: 與台新銀行合作，以 digiRunner 模組開發 API 管理平台，整合複雜的現金管理業務模組，讓企業客戶在整合多元通路的收付款作業更為便利，帳務處理更輕鬆。
    award: 該平台獲全球金融雜誌 (Global Finance)頒發「The Innovators 2020 Cash Management」獎。
    caseStudy: zh-TW/taishin-cash-sales-api-management-platform
    fragment:
      title: 現金管理 API 平台
      rows:
        - label: 收付款作業
          state: "on"
        - label: 帳務處理
          state: "on"
  - client: 臺北市政府
    work: 為臺北市政府建置符合統一標準的API管理平台，使各機關的異質應用系統資料介接，讓市府推動資料開放政策，拓展創新應用之可行性，極大化開放資料加值應用與民眾參與公共政策。此外，昕力顧問團隊更協助市府建立API管理制度，並輔導各級機關一一導入上線。
    caseStudy: zh-TW/taipei-city-api-management-platform
  - client: Pharmacity
    work: digiRunner 為 Pharmacity 於雲端建構 API 管理平台，透過 API 策略推動電子商務模式，在平台上整合第三方 API 並進行管理、監控
  - client: 安泰銀行
    caseStudy: zh-TW/entie-bank-api-management-platform
heroImage: ../../../assets/design/ribbon/page-digirunner.webp
cta: demo
facts:
  - cert-iso27001-digirunner
  - digirunner-five-applications
  - digirunner-auth-methods
  - digirunner-ai-governance
  - digirunner-cloud-platforms
  - digirunner-redis-storage
  - digirunner-cloud-plans
  - digirunner-case-taipei-city
  - client-taipei-city
  - digirunner-case-pharmacity
  - client-pharmacity
  - client-entie-bank
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
  - digirunner-open-banking-3-stages
  - digirunner-financial-inspection
  - digirunner-ndc-spec
  - digirunner-oas
  - digilism-patents-7
  - digirunner-case-taishin
  - client-taishin-bank
  - award-global-finance-2020
sourceUrl: https://www.tpisoftware.com/products/digirunner
migratedAt: 2026-10-22
---
