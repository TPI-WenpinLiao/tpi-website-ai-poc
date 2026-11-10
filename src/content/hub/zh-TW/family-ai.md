---
# Rewritten from docs/strategy/briefs/systalk-ai.md (#200), laid out per section
# brief「取捨」第 5 項: the h1 is the family; 「企業級 AI Agent 應用平台」 is not in the fact library
title: SysTalk.ai 產品家族
# brief「取捨」第 13 項
seoTitle: SysTalk.ai 企業 AI 產品家族與地端一體機
# brief「description」: no user count, no AISO or OrientAI, no VRAM numbers
description: SysTalk.ai 是昕力資訊的 AI 產品家族，客服、培訓、質檢、知識與文件辨識各有產品；地端一體機硬體內建軟體，機型依知識庫規模挑選，導入由昕力負責。
translationKey: family-ai
node: family-ai
heroImage: ../../../assets/design/ribbon/page-systalk-ai.webp
# brief 第 1 段: the kinds of AI work the family takes on. Wording, no facts
tagline: 客服、培訓、知識與文件，每個部門的 AI 工作各有一個產品
# brief 第 1 段的說明句: who it is for and how it deploys. Wording, no facts
heroLead: 金融與政府的客服、業務與作業部門都用得上：雲端或地端都能部署，從導入規劃到上線後的健檢由昕力負責。
# Two proof points (brief 第 1 段): cloud and on-premises, and the award with its year (取捨第 4 項)
heroPoints:
  - "打造企業 雲/地端 AI 完整解決方案"
  - "digiRunner、digiLogs、SysTalk.ai 獲得「2024 台灣精品獎」"
heroCta: contact
# The blocks on the hero picture (src/lib/scene/ribbon/pictures.json), in section 2's words
heroLabels:
  ai0: 客服機器人
  ai1: 語音質檢
  ai2: 會議紀錄
  service: 理賠資料自動建檔
  product: SysTalk.ai
# Sections 2–6 of the brief, each in the layout its 段落表 gives; section 7 is the template's child
# pages (partsTitle), leaving out the five section 2 links to. Headings, bodies, row labels and
# fragment titles are wording; items, values, records and fragment rows are fact texts or words
# taken from them
sections:
  - layout: spec
    id: products
    fill: subtle
    heading: 從客服中心到單據建檔，一個工作對應一個產品
    body: 每一列寫出部門的工作與處理它的產品，產品頁有各自的功能細節。
    rows:
      - label: 客服中心
        values:
          - "SysTalk.Chat\n7/24 智能語音、文字客服機器人\n兩腦一流程專利"
        link:
          label: SysTalk.Chat AI 智能客服
          node: systalk-chat
      - label: 員工培訓與考核
        values:
          - "SysTalk.Coach\n員工知識與應對測驗\n員工專業季度考核"
        link:
          label: SysTalk.Coach AI 業務培訓
          node: systalk-coach
      - label: 客服質檢
        values:
          - "SysTalk.Audit\n智能客服語音質檢報告"
        link:
          label: SysTalk.Audit AI 語音質檢
          node: systalk-audit
      - label: 產品知識與會議紀錄
        values:
          - "SysTalk.VIKI\n新產品知識學習\n跨部門會議紀錄、摘要總結"
        link:
          label: SysTalk.VIKI 企業生成式 AI 應用平台
          node: systalk-viki
      - label: 單據辨識與建檔
        values:
          - "醫療理賠資料自動建檔\n智能理賠專利"
        link:
          label: SysTalk.ICR AI 智慧光學字元辨識
          node: systalk-icr
  - layout: ui
    id: data
    itemsBelow: true
    heading: 地端方案：資料與權限不出機房
    body: 選擇地端方案時，AI 在企業自己的機房運算，不限 Token 用量；權限、存取控管與稽核紀錄都內建在系統裡。
    fragment:
      title: 權限與稽核
      rows:
        - label: 權限管理
          state: "on"
        - label: 存取控管
          state: "on"
        - label: 稽核紀錄
          state: "on"
    items:
      - body: "地端AI不限Token流量，團隊無需顧慮用量成本，放心大量使用。"
      - body: "軟硬一體消除相容性風險；私密資料不上公有雲，杜絕資安疑慮與合規風險。"
      - body: "讓 AI 運算在地化、數據不出門， 防堵外洩風險；內建權限管理、存取控管與稽核紀錄，每筆操作有跡可查，同時兼顧資安與效能。"
  - layout: band
    id: onboarding
    heading: 導入前、中、後都由昕力負責
    link:
      label: 聯絡業務
      node: contact
    fragment:
      title: 導入後健檢
      kind: steps
      rows:
        - label: AI大腦健檢優化
          state: "on"
        - label: 回答品質與準確率檢測
          state: "on"
        - label: Prompt健檢
          state: "on"
        - label: 問題診斷報告
          state: next
    items:
      - body: "導入前（AI 應用規劃與導入）：AI 導入情境分析、解決方案搭配建議、效益評估、AI 服務導入\n導入中：模型評估、微調"
      - body: "協助評估及選擇企業最適合模型\n針對企業專業領域fine-tune，打造貼近業務需求的專屬 AI"
      - body: "導入後：\nAI大腦健檢優化\n回答品質與準確率檢測\nPrompt健檢\n提供問題診斷報告與優化建議"
  - layout: ui
    id: platform
    flip: true
    itemsBelow: true
    heading: 模組依產業組合，模型依場景挑選
    body: SysTalk.ai 平台由功能模組組成，依產業挑選搭配；模型可以從主流的開源與企業級 LLM 中，依場景選擇。
    fragment:
      title: LLM 與模組設定
      rows:
        - label: LLM 設置模組
          state: "on"
        - label: RAG 模組
          state: "on"
        - label: Rerank 模組
          state: "on"
        - label: Guardrail 模組
          state: "on"
        - label: Prompt 管理模組
          state: "on"
    items:
      - body: "搭載昕力資訊的 SysTalk.ai 企業級 AI 應用平台，透過多元功能模組，因應各產業隨選搭配應用"
      - body: "SysTalk.ai 支援主流開源與企業級 LLM（如 70B 模型），企業可依場景選擇最合適的模型"
      - body: "Rerank 模組\nRAG 模組\n向量/混合檢索模組\n同義詞模組\nFAQ 模組\n網站 URL 爬取模組\nOCR 視覺解析模組\nPrompt 管理模組\nLLM 設置模組\nGuardrail 模組\nSTT/TTS 模組\n虛擬人模組\nAgent Flow 模組\n意圖判斷模組\n視窗記憶模組"
  - layout: spec
    id: appliance
    fill: subtle
    heading: 地端一體機：硬體內建軟體，機型照知識庫規模挑
    body: SysTalk.ai 搭配群聯 aiDAPTIV 的地端一體機，軟體與硬體一起交付，導入工作由昕力負責；兩個機型依知識庫規模與使用範圍挑選。
    items:
      - body: "硬體內建軟體，省去分開詢價、規格對接與人工導入的繁瑣流程。"
      - body: "昕力資訊提供完整的導入規劃、模型設定、建置與應用模組設計服務"
    compare:
      label: 品名
      values:
        - aiDAPTIV 4-GPU Server
        - aiDAPTIV 8-GPU Server
    rows:
      - label: VRAM
        values:
          - 192GB
          - 384GB
      - label: 特性
        values:
          - 中型知識庫 / 支援 100B 級別 LLM
          - 超大型知識庫 / 支援 200B 級別 LLM
      - label: 適用場景
        values:
          - 專攻特定領域任務 / 內部單一部門應用、PoC 概念驗證
          - 具備多樣化 AI 需求 / 跨部門 AI 中台
    record: "關鍵在 PHISON 的 aiDAPTIV 專利技術。透過記憶體管理與資料調度優化，在相同 GPU 條件下，可支援更大模型規模並顯著提升推論速度"
partsTitle: 其他產品與解決方案
# brief 第 8 段: the band's heading is a department's AI needs
contactTitle: 談部門的 AI 需求
facts:
  - systalk-ai-service
  - award-taiwan-excellence-2024
  - systalk-ai-chat-patent
  - systalk-ai-day-coach
  - systalk-ai-day-audit
  - systalk-ai-day-scenarios
  - systalk-ai-claim-patent
  - aiso-no-token-limit
  - systalk-phison-hw-sw-integrated
  - systalk-phison-local-audit
  - systalk-ai-onboarding
  - systalk-ai-onboarding-finetune
  - systalk-ai-after-onboarding
  - systalk-phison-platform
  - aiso-llm-support
  - aiso-modules
  - aiso-bundled
  - aiso-onboarding
  - aiso-memory-optimization
  - aiso-servers
  - systalk-phison-use-cases
sourceUrl:
  - https://www.tpisoftware.com/products/systalk-ai
  - https://www.tpisoftware.com/products/systalk-ai-phison
migratedAt: 2026-10-23
---
