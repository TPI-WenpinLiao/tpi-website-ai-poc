---
# Rewritten from docs/strategy/briefs/digilism.md (#202), laid out per section
# The h1 is the title, not the node's name 數位轉型（DigiLism）: the product name with its category (brief 取捨第 5 項)
title: DigiLism 企業服務中台
seoTitle: DigiLism 企業服務中台：iPaaS 整合平台
# brief「description」: no 100% SLA, no bank case
description: DigiLism 是昕力資訊的企業服務中台，由 API 管理、日誌與大數據管理等產品組成，可代替 ESB 處理核心銀行系統與大型主機的資料轉換，支援地端、雲端與混合雲部署。
translationKey: family-dx
node: family-dx
# brief 第 1 段: who it is for and what it does. Wording, no facts
tagline: 金融與保險業的整合中台，接得上核心系統
# brief 第 1 段的說明句: the products the family is made of
heroLead: DigiLism 由 API 管理、日誌、資料庫與流程等產品組成，把既有系統和新的服務接在同一個中台上。
heroPoints:
  - "兼具高度擴充、延展能耐的應用整合服務平台 （iPaaS），可在雲端、地端及地雲混和環境中佈署， 適於金融、保險及各領域應用。"
  - "DigiLism 產品系列擁有7項發明專利"
heroCta: contact
heroImage: ../../../assets/design/ribbon/page-digilism.webp
# The blocks on the hero picture (src/lib/scene/ribbon/pictures.json), in section 4's words
heroLabels:
  core: 核心銀行系統
  legacy: 傳統 ESB
  product: DigiLism
# Sections 2–7 of the brief, each in the layout its 段落表 gives. Headings, bodies, labels and diagram
# words are wording; items, rows and fragment rows are fact texts or words taken from them
sections:
  - layout: claim
    id: areas
    heading: 一個中台管 API、日誌與大數據
    body: 銀行、金融服務與保險業（BFSI）要接的 API、要追的日誌與要管的資料，由同一套中台處理，不必各自找工具再串起來。
    items:
      - body: "DigiLism 系列提供 API 管理、日誌管理及大數據管理三大面向解決方案"
      - body: "基於 API 優先（API First）與雲原生架構，並具備全場景應用的特性，滿足企業打造企業整合中台所需，協助企業組織活用數位科技，靈活地適應不同的市場使用場景。"
      - body: "昕力資訊能為 BFSI 全應用場景提供安全可靠、高效運作的服務應用中台， 滿足企業 API 治理需求，以軟體創新實現差異化戰略。"
  # The family page's product cards (brief 取捨第 3 項); digiLogs' card says 業界唯一 (「待確認」第 1 項)
  # and its page's description is not a fact, so its row has the name only (#202 評審)
  - layout: index
    id: products
    heading: DigiLism 的產品
    body: 依要處理的事挑產品：API 與 AI 流量、日誌、資料庫、表單流程，或醫療資料交換。
    items:
      - node: digirunner
        body: "整合 MCP 協定與 AI Gateway 架構，讓 AI 模型安全串接企業 API、資料與業務流程。協助企業落實 AI 治理與流量控管，從 API 管理邁向 AI 驅動整合。"
      - node: digilogs
      - node: digimars
        body: "將 MongoDB 社群版升級至商用等級，提供效能監控、告警與備份還原，降低資料庫管理成本，並附 7×24 技術支援。"
      - node: digiflexis
        body: "以零代碼設計快速建立數位表單與自動化流程，搭配智能報表即時洞察營運數據"
      - node: digicare
        body: "以 HL7 FHIR 為核心架構，將異質系統的分散資料整併為可互通的標準格式，實現跨系統、跨院交換，並遵循衛福部 FHIR 實作指引。"
  - layout: junction
    id: integration
    heading: 接上核心系統與傳統 ESB，不必先汰換
    body: 核心銀行系統與大型主機的資料轉換、通訊機制變更交給 DigiLism，既有的傳統 ESB 也接得上，部署在地端、雲端或混合環境。
    diagram:
      caption: 核心銀行系統、大型主機與傳統 ESB 經 DigiLism 轉換資料與通訊機制，接上現代化框架與新興技術。
      columns:
        - title: 既有系統
          tone: legacy
          nodes:
            - label: 核心銀行系統
            - label: 大型主機
            - label: 傳統 ESB
        - title: DigiLism
          tone: product
          nodes:
            - label: 資料轉換
            - label: 通訊機制變更
        - title: 新的服務
          tone: new
          nodes:
            - label: 現代化框架
            - label: 新興技術
    items:
      - body: "以微服務架構的 DigiLism 專門協助處理核心銀行系統或過時大型機的資料轉換及通訊機制變更，可代替企業服務匯流排（ESB）"
      - body: |-
          結合 DevOps 與 CI/CD 流程
          整合 API 管理、BPM、日誌管理
          支援地端、雲端、雲地混合與多雲架構
          介接大型企業的傳統 ESB
      - body: "新舊兼容 弭平既有系統與現代化框架之差異，企業可更輕易採用新興技術。"
    # brief 取捨第 10 項: the finance page carries the bank side of this
    link:
      label: 金融業如何接上核心銀行系統
      node: industry-finance
  - layout: ui
    id: security
    heading: 驗身與日誌都集中控管
    body: 身分驗證、權限與單一登入在同一個模組設定；各系統的日誌集中起來，出問題時查得到來源。
    fragment:
      title: 驗證整合模組
      rows:
        - label: 多元身分驗證
          state: "on"
        - label: 訪問控制
          state: "on"
        - label: 資料加密
          state: "on"
        - label: 單一登入（SSO）
          state: "on"
        - label: 組織階層管理
          state: "on"
    items:
      - body: "提供多元身分驗證、驗身機制及安控機制的整合，包含訪問控制、資料加密和單一登入（SSO）等，同時內建組織階層管理"
      - body: "記錄分散於各系統或 AP 的所有日誌，透過集中控管、即時監控告警，提供第一線 IT 人員精確即時查找、分析系統問題來源"
  - layout: spec
    id: scale
    fill: subtle
    heading: 尖峰流量與擴容有專利機制
    body: 瞬間湧進大量請求、要調配運算資源或擴容時，各有一個機制處理。
    image: ../../../assets/design/sec-deployment.webp
    rows:
      - label: 背景服務運算處理
        values: ["具備專利技術的背景服務運算處理，支援處理瞬間大量的數據或請求，達到零阻塞式運行。"]
      - label: 運算資源調度
        values: ["專利技術的運算資源調度機制、靈活調配，以提高資訊系統可用性。"]
      - label: 高可用與自動擴容
        values: ["DigiLism 以 K8S 滿足系統高可用性，直接實踐微服務架構的 BFF （Backend for Frontend），並以自有自動擴容 （Auto-scaling）研發專利技術，讓系統具備佈署彈性。"]
  - layout: claim
    id: awards
    heading: 家族產品的外部評選
    body: 這些評選來自昕力以外的單位，得獎的是家族裡的 digiRunner 與 digiLogs。
    items:
      - body: "digiRunner、digiLogs、SysTalk.ai 獲得「2024 台灣精品獎」"
      - body: "digiRunner、digiLogs、SysTalk.Chat 獲得「2023 台灣精品獎」"
      - body: "2022 創新商務獎 digiRunner 獲得「最佳技術創新獎」； SysTalk.Chat 獲得「最佳產品創新獎」"
# Not listed until it is known to be on sale (nodes.csv 待確認, brief「待確認」第 3 項); hasPart still names it
omitParts: [interactivehealth]
# brief 第 8 段: the band's heading is linking the platform to the core systems
contactTitle: 談整合中台怎麼接上核心系統
facts:
  - digilism-ipaas
  - digilism-patents-7
  - digilism-solution-areas
  - digilism-api-first
  - digilism-bfsi
  - digilism-family-digirunner
  - digilism-family-digirunner-ai
  - digilism-family-digimars
  - digilism-family-digiflexis
  - digilism-family-digicare
  - digilism-protocol-integration
  - digilism-system-integration
  - digilism-compatibility
  - digilism-auth-module
  - digilism-log-audit
  - digilism-patent-background-processing
  - digilism-patent-resource-scheduling
  - digilism-microservice-framework
  - award-taiwan-excellence-2023
  - award-taiwan-excellence-2024
  - award-innovative-business-2022
sourceUrl: https://www.tpisoftware.com/products/digilism
migratedAt: 2026-10-23
---
