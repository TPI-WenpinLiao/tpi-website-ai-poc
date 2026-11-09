---
# Rewritten from docs/strategy/briefs/finance.md (#167, laid out per section in #187)
title: 金融
# docs/strategy/briefs/finance.md「title 與 description 方向」: the h1 stays the node's name
seoTitle: 金融業的開放銀行、API 管理與 AI 應用
# briefs/finance.md「description」: no AI for fraud, the platform's text names no AI (messaging「缺少證據的主張」第 15 項)
description: 昕力資訊替銀行、保險與證券業者，把開放銀行與金融檢查的 API 管理要求做進 digiRunner，以 AI 處理理賠與文件建檔，也提供身分驗證與導入規劃。
translationKey: industry-finance
node: industry-finance
industry: finance
# Comma after 要求, so a 375px line breaks there, not after 銀行、 (new-finance D6, #187)
tagline: 銀行、保險與證券的法規要求，做在產品裡；AI 用在核心作業
# brief 第 1 段的說明句（30–50 字）: what TPIsoftware sells, so the first screen says it. Wording
heroLead: 昕力資訊提供 API 管理平台、AI 應用與身分驗證，也負責規劃與導入，替金融業者把法規要求與 AI 接進既有系統。
heroPoints:
  - 2008 年首度跨足金融產業，為華南銀行建置 CRM 系統
heroCta: contact
heroImage: ../../../assets/design/ribbon/page-finance.webp
# The blocks on the hero picture that land in its frame (src/lib/scene/ribbon/pictures.json)
heroLabels:
  core: 核心銀行系統
  ai1: 理賠
  ai2: 建檔
  service: 第三方服務業者（TSP）
# Sections 2–7 of the brief (#187), each in the layout design-principles.md「hub：金融產業頁」gives
# it. Headings, bodies, labels and diagram words are wording; items, rows, steps and results are
# fact texts verbatim (facts below)
sections:
  - layout: timeline
    id: regulations
    fill: subtle
    heading: 法規要求已做在產品裡
    body: 開放銀行的規範與金融檢查的 API 管理作業，都對應到 digiRunner 的功能。
    intro: Open Banking 起源於 2015 年歐盟的 The Revised Payment Services Directive (PSD2)，隔年（2016）八月，由英國率先要求其國內九家大型銀行要採用，並於 2018 年強制導入。2019 年，台灣金管會拍板定案，將台灣 Open Banking 導入分為三階段。
    steps:
      - year: "2019"
        body: 2019 第一階段：公開資訊開放。開放商品資訊，如：匯率、房貸利息等。
      - year: "2020"
        body: 2020 第二階段：個人資訊開放。可透過第三方 APP 整合個人銀行帳戶及查詢餘額等。
      - year: 2021 Q1
        body: 2021 Q1 第三階段：全面開放。可透過第三方產品進行支付、交易、轉帳等。
    rows:
      - label: 開放銀行法規
        values:
          - 昕力資訊 digiRunner API 管理平台反應台灣開放銀行金管會法規要求
          - 昕力資訊實現三階段開放銀行規範
          - 用戶在授權TSP處理相關銀行資訊時，不會留下或儲存用戶帳密紀錄，而是透過用戶授權才能整合相關資訊
        link:
          label: digiRunner API 管理平台的法規對應功能
          node: digirunner
      - label: 金融檢查
        values:
          - "針對金融檢查，完善 API 管理：\nAPI 生命週期作業\n訂定交易限制\n訂定連線識別名稱產製方式\n定期盤點作業及風險評估\n進行資源與服務監控作業\n完善之服務憑證管理規範\n進行分類分級管理\nAPI Key 識別認證\n採用 OAuth 2.0"
      - label: 三層防護
        values:
          - 從資料傳輸層「隱密性、完整性、訊息來源、不可重覆」、資料層（資料完整性驗證、機敏個資加密、防駭攻擊）、行為層（OAuth2認證機制及授權時效、Client 授權及 IP Check）全方位防堵資安風險
  - layout: junction
    id: core-systems
    heading: 接上核心系統，不必先汰換
    body: 核心銀行系統與大型機可以透過微服務與 API 接進來，資料庫配置照金融業常用的高可用架構。
    link:
      label: digiRunner API 管理平台如何接上核心系統
      node: digirunner
    diagram:
      caption: 核心銀行系統與大型機接到 DigiLism 與 digiRunner，由它們做資料轉換、通訊機制與 API 組合，再開放給第三方服務業者。
      columns:
        - title: 既有系統
          tone: legacy
          nodes:
            - label: 核心銀行系統
            - label: 大型機
        - title: DigiLism 與 digiRunner
          tone: product
          nodes:
            - label: 資料轉換及通訊機制
            - label: API Composer
        - title: 新的服務
          tone: new
          nodes:
            - label: 新的 API
            - label: 第三方服務業者（TSP）
    items:
      - title: DigiLism：核心銀行系統與大型主機的串接
        body: 以微服務架構的 DigiLism 專門協助處理核心銀行系統或過時大型機的資料轉換及通訊機制變更，可代替企業服務匯流排（ESB）
        node: family-dx
      - body: 使用 API 組合與設計（API Composer）功能，支援多種 API 格式轉換，拖拉即可輕鬆組合打造出新的 API
      - body: 數據將以 RDB 格式保存在 Redis 資料庫。資料庫可根據客戶需求進行配置。 我們的金融產業合作夥伴多採用具高可用性的 Active/Standby 架構。若預算較高，可結合 Active/Active 架構與災難恢復，或採 Active/Active/Standby 三模式架構，以便能在故障發生後快速備份及復原。
  - layout: results
    id: ai
    heading: AI 用在理賠與建檔
    body: 金融業的 AI 應用，兩個作業已經上線，模型是昕力自己研發的。
    items:
      - title: AI 智慧理賠
        sub: 以自主研發 NLP 自然語言技術為核心，對於自有演算法可高度掌握
        result: 全自動執行理賠立案到派件，精確解析診斷書，節省逾80%​人工作業時間
        link:
          label: AI 智能理賠解決方案
          node: smartclaim
        fragment:
          title: 理賠案件
          kind: steps
          rows:
            - label: 立案
              state: "on"
            - label: 解析診斷書
              state: "on"
            - label: 派件
              state: next
      - title: 金融業應用－傳統文件數位化管理第一步
        sub: 以獨家自建 AI 演算法模型，改良 OCR 坐標定位之限制，無須依文件版型建立模板
        result: 以 AI 取代傳統二登流程，節省將近 52% 委外成本，於三校時反饋系統再學習訓練模型，不但讓辨識資訊無縫介接內部系統，更有效降低維運人力約 45%。
        link:
          label: AI 智慧建檔解決方案
          node: smartfilling
        fragment:
          title: 文件辨識
          kind: steps
          rows:
            - label: 辨識資訊
              state: "on"
            - label: 介接內部系統
              state: next
    record: "完整錄所有AI使用歷程，確保業務流程和數據使用符合監管要求\nAI Governance 確保AI應用合規，強化企業風險控管"
    link:
      label: digiRunner API 管理平台的 AI 使用歷程紀錄與 AI 治理
      node: digirunner
  - layout: spec
    id: identity
    fill: subtle
    image: ../../../assets/design/sec-identity.webp
    heading: 金融通路的身分驗證
    body: 金融集團的各個通路共用一套身分驗證，客戶註冊一次就能跨通路使用。
    rows:
      - label: 集團式的統一身分驗證
        values: [gadoDIDO 為金融機構提供集團式的統一身分驗證管理，實現虛實整合的無縫體驗。用戶僅需註冊一次，即可在集團內各通路輕鬆驗證身份，享受24小時不間斷的金融服務。]
      - label: 適用的金融業務
        values: ["網路銀行/行動銀行\n數位帳戶/數位信用卡\n證券/期貨開戶\n線上數位申辨\n投信交易"]
      - label: 保險申辦與投保
        values: [gadoDIDO可實現集團統一管控，用戶只需驗證一次，即可使用於集團內所有應用，大幅簡化用戶申辦與投保流程。]
      - label: 認證
        values: [gadoDIDO 為通過 FIDO 認證的身份驗證應用]
    link:
      label: gadoDIDO 無密碼身分驗證
      node: gadodido
  - layout: ui
    id: insurance
    heading: 保險業務的專用模組
    body: 保險公司依業務挑選需要的模組，商品上下架與核保規則的調整交給規則引擎。
    fragment:
      title: InsureRing 規則檢核
      rows:
        - label: 保險商品上下架
          state: "on"
        - label: 核保規則調整
          state: "on"
        - label: 法令規範因應
          state: "on"
    items:
      - body: InsureBrick是專為產壽險保險公司及保經代公司打造的保險科技平台，我們的系統採用了先進的微服務技術，每個功能都是獨立的模組
      - body: 只需購買所需模組，也可串接客戶內外部系統
      - body: 28個多元且彈性的模組
      - title: 新光金保代
        body: 新光金保代核心系統應用 InsureBrick 模組規劃設計，透過多元且彈性的模組，整合內部各項業務流程，縮短進件作業時間
      - body: 以建立新型態自動化檢核，滿足保險商品上下架彈性、核保規則調整及法令規範因應等需求
      - title: 新光人壽
        body: 協助新光人壽建置集中化規則引擎，e化整合產品及計費資料，如：保險核心計算、公式、檢核模組等，整體降低50%作業成本。簡化商品上架流程，節省60%上架時間
    index:
      - node: insurebrick
      - node: insurering
  - layout: band
    id: planning
    image: ../../../assets/design/sec-planning.webp
    heading: 規劃與導入由同一家負責
    body: 產品與導入不必分兩家找：昕力的顧問協助規劃架構，AI 導入從情境分析到模型微調。
    items:
      - body: 昕力資訊專業顧問團隊，協助規劃建立符合各國開放銀行規範之技術架構。
      - body: "導入前（AI 應用規劃與導入）：AI 導入情境分析、解決方案搭配建議、效益評估、AI 服務導入\n導入中：模型評估、微調"
      - body: 由企業服務中台、交談式 AI 產品、雲服務，再到全方位軟體解決方案
# Section 8 (#187): cases as rows, the ones with a result first (brief「取捨」第 14 項). The fraud
# platform has no client or case page, so no link (第 13 項); 安泰、國泰世華、臺灣銀行 have no work or
# result fact (「待確認」第 8 項). The testimonial follows the rows (#186, user's decision)
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
  - work: 金融聯防阻詐平台
    result: 標準化聯防流程，詐騙事件即時共享，提升跨行交換的效率與透明度
  - client: 安泰銀行
    caseStudy: zh-TW/entie-bank-api-management-platform
  - client: 國泰世華銀行
    caseStudy: zh-TW/cathay-united-bank-ai-intelligent-customer-service-system
  - client: 臺灣銀行
    caseStudy: zh-TW/bank-of-taiwan-robotic-process-automation-rpa
testimonial:
  quote: 在這個平台上它提供IT人員可以做後台管理也考慮到很多安控，昕力在這個產品上已經蠻替IT人員想到蠻多; 昕力在一些新進的技術上面其實一直都走得蠻前面的，也很願意分享給我們，那整個團隊的服務都非常棒，我們一定會再繼續跟他們合作。
  speaker: Dora 徐靜婷 ｜新光銀行數位資訊部資深經理
facts:
  - insurebrick-buy-modules
  - insurebrick-28-modules
  - smartclaim-nlp
  - smartfilling-template-free
  - digirunner-ai-governance
  - testimonial-shin-kong-bank
  - testimonial-shin-kong-bank-speaker
  - award-global-finance-2020
  - digirunner-case-taishin
  - open-banking-history
  - open-banking-taiwan-2019
  - open-banking-stage-1
  - open-banking-stage-2
  - open-banking-stage-3
  - digirunner-open-banking-fsc
  - digirunner-open-banking-3-stages
  - digirunner-open-banking-no-credentials
  - digirunner-financial-inspection
  - digirunner-open-banking-security
  - digilism-protocol-integration
  - digirunner-api-composer
  - digirunner-redis-storage
  - smartclaim-title
  - smartclaim-result
  - smartfilling-case-bank-title
  - smartfilling-case-bank
  - fraud-platform-title
  - fraud-platform-result
  - digirunner-ai-usage-log
  - gadodido-finance-group
  - gadodido-finance-uses
  - gadodido-insurance
  - gadodido-fido-certified
  - insurebrick-platform
  - insurebrick-case-shin-kong
  - insurering-automated-rules
  - insurering-case-shin-kong-life
  - digirunner-open-banking-consulting
  - systalk-ai-onboarding
  - company-offerings
  - client-taishin-bank
  - client-entie-bank
  - client-cathay-united-bank
  - client-bank-of-taiwan
  - company-milestone-2008-finance
sourceUrl: https://www.tpisoftware.com/products/open-banking
migratedAt: 2026-10-23
---
