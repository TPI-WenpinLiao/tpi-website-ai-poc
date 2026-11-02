---
# Rewritten from docs/strategy/briefs/finance.md (#167): sections 2–7 of the brief as `sections`,
# section 8 as featuredCaseStudies. Headings, bodies and item titles are wording; item bodies are
# fact texts, verbatim (facts below)
title: 金融
# docs/strategy/briefs/finance.md「title 與 description 方向」: the h1 stays the node's name
seoTitle: 金融業的開放銀行、API 管理與 AI 應用
description: 昕力資訊替銀行、保險與證券業者，把開放銀行與金融檢查的 API 管理要求做進 digiRunner，並以 AI 處理理賠、建檔與阻詐，也提供身分驗證與導入規劃。
translationKey: industry-finance
node: industry-finance
industry: finance
tagline: 銀行、保險與證券的法規要求做在產品裡，AI 用在核心作業
heroImage: ../../../assets/design/ribbon/page-finance.webp
sections:
  - heading: 法規要求已做在產品裡
    body: 開放銀行從歐洲開始，台灣由金管會推動。開放銀行的規範與金融檢查的 API 管理作業，都對應到 digiRunner 的功能。
    items:
      - title: 開放銀行的起源
        body: Open Banking 起源於 2015 年歐盟的 The Revised Payment Services Directive (PSD2)，隔年（2016）八月，由英國率先要求其國內九家大型銀行要採用，並於 2018 年強制導入
      - title: 台灣的開放銀行
        body: 昕力資訊 digiRunner API 管理平台反應台灣開放銀行金管會法規要求
        node: digirunner
      - title: 三階段規範
        body: 昕力資訊實現三階段開放銀行規範
      - title: 第三方服務業者（TSP）的授權
        body: 用戶在授權TSP處理相關銀行資訊時，不會留下或儲存用戶帳密紀錄，而是透過用戶授權才能整合相關資訊
      - title: 金融檢查
        body: 針對金融檢查，完善 API 管理： API 生命週期作業 訂定交易限制 訂定連線識別名稱產製方式 定期盤點作業及風險評估 進行資源與服務監控作業 完善之服務憑證管理規範 進行分類分級管理 API Key 識別認證 採用 OAuth 2.0
      - title: 傳輸層、資料層與行為層的防護
        body: 從資料傳輸層「隱密性、完整性、訊息來源、不可重覆」、資料層（資料完整性驗證、機敏個資加密、防駭攻擊）、行為層（OAuth2認證機制及授權時效、Client 授權及 IP Check）全方位防堵資安風險
    link:
      label: 看 digiRunner API 管理平台
      node: digirunner
  - heading: 接上核心系統，不必先汰換
    body: 核心銀行系統與大型主機可以透過微服務與 API 接進來，資料庫配置照金融業常用的高可用架構。
    items:
      - title: 核心系統的資料轉換與通訊
        body: 以微服務架構的 DigiLism 專門協助處理核心銀行系統或過時大型機的資料轉換及通訊機制變更，可代替企業服務匯流排（ESB）
        node: family-dx
      - title: API 組合與格式轉換
        body: 使用 API 組合與設計（API Composer）功能，支援多種 API 格式轉換，拖拉即可輕鬆組合打造出新的 API
        node: digirunner
      - title: 資料庫與高可用架構
        body: 數據將以 RDB 格式保存在 Redis 資料庫。資料庫可根據客戶需求進行配置。 我們的金融產業合作夥伴多採用具高可用性的 Active/Standby 架構。若預算較高，可結合 Active/Active 架構與災難恢復，或採 Active/Active/Standby 三模式架構，以便能在故障發生後快速備份及復原。
  - heading: AI 用在理賠、建檔與阻詐
    body: 金融業的 AI 應用，已經在三個核心作業上線。AI 接進金融作業時，使用歷程記錄得下來，稽核與監管查得到。
    items:
      - title: AI 智慧理賠
        body: 全自動執行理賠立案到派件，精確解析診斷書，節省逾80%​人工作業時間
        node: smartclaim
      - title: 金融業應用－傳統文件數位化管理第一步
        body: 以 AI 取代傳統二登流程，節省將近 52% 委外成本，於三校時反饋系統再學習訓練模型，不但讓辨識資訊無縫介接內部系統，更有效降低維運人力約 45%。
        node: smartfilling
      - title: 金融聯防阻詐平台
        body: 標準化聯防流程，詐騙事件即時共享，提升跨行交換的效率與透明度
        node: success-stories
      - title: AI 的使用歷程與治理
        body: 完整錄所有AI使用歷程，確保業務流程和數據使用符合監管要求
        node: digirunner
  - heading: 金融通路的身分驗證
    body: 金融集團的各個通路共用一套身分驗證，客戶註冊一次就能跨通路使用。
    items:
      - title: 集團式的統一身分驗證
        body: gadoDIDO 為金融機構提供集團式的統一身分驗證管理，實現虛實整合的無縫體驗。用戶僅需註冊一次，即可在集團內各通路輕鬆驗證身份，享受24小時不間斷的金融服務。
      - title: 適用的金融業務
        body: 網路銀行/行動銀行 數位帳戶/數位信用卡 證券/期貨開戶 線上數位申辨 投信交易
      - title: 保險申辦與投保
        body: gadoDIDO可實現集團統一管控，用戶只需驗證一次，即可使用於集團內所有應用，大幅簡化用戶申辦與投保流程。
      - title: FIDO 認證
        body: gadoDIDO 為通過 FIDO 認證的身份驗證應用
    link:
      label: 看 gadoDIDO 無密碼身分驗證
      node: gadodido
  - heading: 保險業務的專用模組
    body: 保險公司依業務挑選需要的模組，商品上下架與核保規則的調整交給規則引擎。
    items:
      - title: InsureBrick 保險科技模組化平台
        body: InsureBrick是專為產壽險保險公司及保經代公司打造的保險科技平台，我們的系統採用了先進的微服務技術，每個功能都是獨立的模組
        node: insurebrick
      - title: 新光金保代的核心系統
        body: 新光金保代核心系統應用 InsureBrick 模組規劃設計，透過多元且彈性的模組，整合內部各項業務流程，縮短進件作業時間
      - title: InsureRing 保險自動化規則檢核
        body: 以建立新型態自動化檢核，滿足保險商品上下架彈性、核保規則調整及法令規範因應等需求
        node: insurering
      - title: 新光人壽的規則引擎
        body: 協助新光人壽建置集中化規則引擎，e化整合產品及計費資料，如：保險核心計算、公式、檢核模組等，整體降低50%作業成本。簡化商品上架流程，節省60%上架時間
  - heading: 規劃與導入由同一家負責
    body: 產品與導入不必分兩家找：昕力的顧問協助規劃架構，AI 導入從情境分析到模型微調。
    items:
      - title: 開放銀行的架構規劃
        body: 昕力資訊專業顧問團隊，協助規劃建立符合各國開放銀行規範之技術架構。
      - title: AI 導入
        body: 導入前 AI應用規劃與導入 AI 導入情境分析 解決方案搭配建議 效益評估 AI 服務導入 導入中 模型評估、微調
      - title: 產品與服務
        body: 由企業服務中台、交談式 AI 產品、雲服務，再到全方位軟體解決方案
featuredCaseStudies:
  - zh-TW/taishin-cash-sales-api-management-platform
  - zh-TW/entie-bank-api-management-platform
  - zh-TW/cathay-united-bank-ai-intelligent-customer-service-system
  - zh-TW/bank-of-taiwan-robotic-process-automation-rpa
facts:
  - open-banking-history
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
sourceUrl: https://www.tpisoftware.com/products/open-banking
migratedAt: 2026-10-23
---
