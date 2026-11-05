---
# Rewritten from docs/strategy/briefs/smartfilling.md (#200), laid out per section
# The h1 is the node's name; the family (SysTalk.ai) is in the breadcrumb (brief「與現有頁面的差異」)
title: AI 智慧建檔解決方案
# brief「title 與 description 方向」
seoTitle: AI 智慧建檔解決方案：OCR 文件辨識自動建檔
# brief「description」: no numbers
description: AI 智慧建檔解決方案以自建的 AI 模型辨識基金配息單、居留證等文件，不必依版型建模板，經前處理與文本分析校正後介接內部系統；文件變了，企業可以自己再訓練模型。
translationKey: smartfilling
node: smartfilling
kind: solution
# brief 第 1 段: what it is for (recognising and filing paper documents). Wording, no facts
tagline: 紙本文件辨識完，直接建檔進系統
# brief 第 1 段的說明句: who it is for (a financial firm's intake and filing). Wording, no facts
heroLead: 給金融業的收件與建檔流程：收進來的紙本文件由 AI 辨識、校正，再把資料介接到內部系統，減少人工登打。
# One proof point (brief 第 1 段): the in-house recognition model and its retraining
heroPoints:
  - "獨家自建 AI 演算法模型，建構 SysTalk.ICR 智慧光學字元辨識和 SysTalk.PUZZLE 模型再訓練機制"
heroImage: ../../../assets/design/ribbon/page-smartfilling.webp
# The blocks on the hero picture (src/lib/scene/ribbon/pictures.json), in section 4's words
heroLabels:
  legacy: 基金配息單、居留證
  product: AI 智慧建檔解決方案
  service: 內部系統
# Sections 2–6 of the brief, each in the layout its 段落表 gives. Headings, bodies, labels and diagram
# words are wording; items, results and fragment rows are fact texts or words taken from them
sections:
  - layout: results
    id: results
    heading: 金融業與醫療單據的建檔成果
    body: 委外的二次登打換成 AI 辨識，辨識結果直接進內部系統；單據格式變了，也不必重做模板。
    items:
      - title: "金融業應用－傳統文件數位化管理第一步"
        result: "以 AI 取代傳統二登流程，節省將近 52% 委外成本，於三校時反饋系統再學習訓練模型，不但讓辨識資訊無縫介接內部系統，更有效降低維運人力約 45%。"
        fragment:
          title: 辨識結果介接內部系統
          rows:
            - label: 二登流程
              state: "off"
            - label: AI 辨識
              state: "on"
            - label: 三校反饋再學習
              state: "on"
            - label: 介接內部系統
              state: next
      - title: "AI 智慧建檔"
        result: "透過免模板辨識醫療單據​解決格式變動痛點，提升辨識率並降低40%維護人力"
        fragment:
          title: 醫療單據
          rows:
            - label: 免模板辨識
              state: "on"
  - layout: ui
    id: template-free
    heading: 文件版型變了，不必重建模板
    body: 傳統 OCR 靠座標定位，版型一變就要重建模板。昕力自建的 AI 演算法模型不依版型，模型也照企業的文件與需求建構。
    fragment:
      title: 辨識設定
      rows:
        - label: 依文件版型建立模板
          state: "off"
        - label: AI 演算法模型
          state: "on"
    items:
      - body: "以獨家自建 AI 演算法模型，改良 OCR 坐標定位之限制，無須依文件版型建立模板"
      - body: "從企業需求角度出發，為客戶建構獨家 AI 模型，改善傳統 OCR 辨識困難，最大化資料再利用與維運"
  - layout: junction
    id: flow
    heading: 從收件到內部系統：前處理、辨識、校正
    body: 基金配息單、居留證這類收件文件，先校正影像的瑕疵與色彩，辨識後再用 AI 文本分析校正資料，最後介接到內部系統。
    diagram:
      caption: 收件文件經前處理校正影像，辨識後以 AI 文本分析校正資料，再介接到內部系統。
      columns:
        - title: 收件文件
          tone: legacy
          nodes:
            - label: 基金配息單
            - label: 居留證
        - title: AI 智慧建檔解決方案
          tone: product
          nodes:
            - label: 前處理
            - label: AI 文本分析
        - title: 建檔
          tone: new
          nodes:
            - label: 內部系統
    items:
      - body: "透過 AI + OCR 的前沿技術，協助金融業如基金配息單、居留證等收件流程應用，提升判讀精準度。"
      - body: "透過自研發前處理技術，自動校正文件影像瑕疵與色彩處理"
      - body: "依客戶需求量身打造，同時也將 AI 文本分析技術用其中，精準且快速校正資料。"
      - body: "透過 AI 機器辨識，精簡手動登打文件人力與誤差，擴大員工產值，提升服務效率。"
  - layout: ui
    id: retraining
    flip: true
    heading: 模型由企業自己再訓練
    body: 文件換了樣式，企業可以自己再訓練模型；系統會自動增加訓練資料，模擬不同情境的影像。
    fragment:
      title: 模型再訓練
      rows:
        - label: 自動增加訓練資料
          state: "on"
        - label: 模擬不同情境影像
          state: "on"
        - label: 再訓練
          state: next
    items:
      - body: "SysTalk.ICR 加上再訓練機制，高辨識、高精準度，協助您輕鬆自主維運優化模型、擴展應用場景。"
      - body: "內建自動增加訓練資料機制，模擬不同情境影像"
  - layout: index
    id: related
    heading: 相關產品
    items:
      - node: systalk-icr
        body: 辨識技術本身寫在這個產品頁，同屬 SysTalk.ai 家族。
      - node: industry-finance
        label: 金融業的 AI 應用
        body: 保險、銀行與證券業的 AI 應用、法規要求與案例。
cta: contact
facts:
  - smartfilling-icr-puzzle
  - smartfilling-case-bank-title
  - smartfilling-case-bank
  - smartfilling-title
  - smartfilling-result
  - smartfilling-template-free
  - smartfilling-custom-model
  - smartfilling-documents
  - smartfilling-preprocessing
  - smartfilling-text-analysis
  - smartfilling-less-keying
  - smartfilling-flow
  - smartfilling-data-augmentation
sourceUrl: https://www.tpisoftware.com/solutions/smartfilling
migratedAt: 2026-10-23
---
