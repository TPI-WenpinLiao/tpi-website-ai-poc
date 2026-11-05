---
# Rewritten from docs/strategy/briefs/smartclaim.md (#200), laid out per section
# The h1 is the node's name; the family (SysTalk.ai) is in the breadcrumb (brief「與現有頁面的差異」)
title: AI 智能理賠解決方案
# brief「title 與 description 方向」: the title adds 保險理賠流程自動化, the words of smartclaim-technologies
seoTitle: AI 智能理賠解決方案：保險理賠流程自動化
# brief「description」: no numbers, no award category (取捨第 3、10 項)
description: AI 智能理賠解決方案結合 NLP、AI OCR 與 RPA，解析各醫院的診斷書與單據，從掃描建檔、立案到派件自動執行，接上自動理賠引擎；文件格式改變時，企業可以自己再訓練模型。
translationKey: smartclaim
node: smartclaim
kind: solution
# brief 第 1 段: what it is for (insurance claims). Wording, no facts
tagline: 保險理賠的文件與流程，交給 AI 處理
# brief 第 1 段的說明句: who it is for (an insurer's claims work). Wording, no facts
heroLead: 給保險業的理賠作業：保戶的診斷書與單據掃描建檔後，由系統解析、立案與派件，理賠人員只做最後確認。
# Two proof points (brief 第 1 段): the technologies, and the award with its year only (DM-8)
heroPoints:
  - "結合 NLP、AI OCR、RPA技術 讓保險理賠流程自動化"
  - "昕力資訊 AI 智能理賠解決方案獲 2024 金漾獎"
heroImage: ../../../assets/design/ribbon/page-smartclaim.webp
# The blocks on the hero picture (src/lib/scene/ribbon/pictures.json), in section 3's words
heroLabels:
  legacy: 診斷書及單據
  product: AI 智能理賠解決方案
  service: 自動理賠引擎
# Sections 2–7 of the brief, each in the layout its 段落表 gives. Headings, bodies, labels and diagram
# words are wording; items, results and fragment rows are fact texts or words taken from them
sections:
  - layout: results
    id: results
    heading: 理賠從立案到派件自動執行
    body: 理賠人員不必逐件登打與派件：診斷書由系統解析，案件接著立案、派件。
    items:
      - title: "AI 智慧理賠"
        result: "全自動執行理賠立案到派件，精確解析診斷書，節省逾80%​人工作業時間"
        fragment:
          title: 理賠案件
          rows:
            - label: 立案
              state: "on"
            - label: 解析診斷書
              state: "on"
            - label: 派件
              state: next
  - layout: junction
    id: flow
    heading: 從掃描建檔到理賠引擎，接進現有流程
    body: 保戶的診斷書與單據掃描建檔後由系統分析，RPA 跨系統串起立案、理算與派件，資料再交給自動理賠引擎審核。
    diagram:
      caption: 診斷書與單據掃描建檔後由系統自動分析，串接立案、理算、派件與理賠引擎，理賠人員做最後確認。
      columns:
        - title: 保戶文件
          tone: legacy
          nodes:
            - label: 診斷書及單據
            - label: 掃描建檔
        - title: AI 智能理賠解決方案
          tone: product
          nodes:
            - label: 系統自動分析
            - label: 跨系統自動化
        - title: 理賠作業
          tone: new
          nodes:
            - label: 自動立案
            - label: 自動理算
            - label: 自動派件
            - label: 自動理賠引擎
    items:
      - body: "業者獲取保戶診斷書及單據資料證明後，只需要進行掃描建檔，系統自動分析後，由理賠人員進行最後的確認即可。"
      - body: "跨系統運行具備彈性，可串接自動立案、自動理算、自動派件等功能"
      - body: "可全天候、跨系統自動化不間斷執行任務，同時減少人為操作錯誤。"
      - body: "資料紀錄完整存取後，輕鬆連接自動理賠引擎，進行理賠審核及判讀，降低人工作業時間。"
  - layout: ui
    id: nlp
    heading: 自研 NLP 讀懂各醫院的診斷書
    body: 各醫院的診斷書與單據格式不同。昕力自己研發的 NLP 先解析語意與敘述情境，再把內容填進對應的欄位。
    fragment:
      title: 文件解析
      tabs:
        - 診斷書
        - 單據
      rows:
        - label: 解析多樣語意
          state: "on"
        - label: 敘述情境
          state: "on"
        - label: 多模型之集成學習
          state: "on"
        - label: 輸入對應欄位
          state: next
    items:
      - body: "以自主研發 NLP 自然語言技術為核心，對於自有演算法可高度掌握"
      - body: "不僅能解析多樣語意、敘述情境，並可進行多模型之集成學習。"
      - body: "可自動統整保戶診斷書及單據格式，即使各醫院格式大不相同也能迅速輸入對應欄位"
  - layout: claim
    id: medical
    heading: 保險業的醫療文件解析
    body: 保險業用自然語言技術，分析理賠收到的診斷證明書與單據。
    items:
      - title: "保險業 - 醫療文件解析"
        body: "藉由自然語言技術，分析診斷證明書、單據等文件，強化保險業智能理賠系統，解決傳統流程中大量人力需求，作業效率大幅的提升，並透過進化系統持續優化模型精準度，提供最佳化理賠給付計算結果。"
  - layout: ui
    id: retraining
    flip: true
    heading: 文件格式變了，企業自己再訓練模型
    body: 收據與發票的格式一直在變。AI 進化系統讓企業自己再訓練模型，維持辨識的準確率。
    fragment:
      title: AI 進化系統
      tabs:
        - 收據
        - 發票
      rows:
        - label: AI 再訓練機制
          state: "on"
        - label: 一鍵優化
          state: next
    items:
      - body: "各醫院收據、發票等格式不一且繁雜，透過 AI 再訓練機制，可維持高度準確率。"
      - body: "同時，獨家 AI 進化系統以直覺的介面，讓 AI 再訓練機制「一鍵優化」持續提高模型精準度，随時輕鬆維運 AI 模型。"
      - body: "AI 再訓練機制使模型維持高準確率，不僅審核效率提升，更具備高品質理賠決定。"
  - layout: index
    id: related
    heading: 相關產品
    items:
      - node: systalk-icr
        body: 理賠文件用到的文字辨識技術，寫在這個產品頁。
      - node: systalk-rpa
        body: 跨系統執行理賠作業的流程自動化產品。
      - node: industry-finance
        label: 金融業的 AI 應用與法規對應
        body: 保險、銀行與證券業的 AI 應用、法規要求與案例。
cta: contact
facts:
  - smartclaim-technologies
  - award-golden-yang-2024-smartclaim
  - smartclaim-title
  - smartclaim-result
  - smartclaim-flow
  - smartclaim-end-to-end
  - smartclaim-rpa
  - smartclaim-review-engine
  - smartclaim-nlp
  - smartclaim-ensemble
  - smartclaim-auto-filing
  - smartclaim-case-medical-documents-title
  - smartclaim-case-medical-documents
  - smartclaim-retraining
  - smartclaim-one-click-retraining
  - smartclaim-quality
sourceUrl: https://www.tpisoftware.com/solutions/smartclaim
migratedAt: 2026-10-23
---
