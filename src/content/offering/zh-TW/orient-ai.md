---
# Rewritten from docs/strategy/briefs/orient-ai.md (#201), laid out per section
# brief「title」: the node's name is the title and the h1 (product name beside the category, the name
# is shared with other products), no seoTitle
title: OrientAI 企業級 Agentic AI 平台
# brief「description」: no benefit numbers, no 雲地部署 without context, no AISO
description: OrientAI 企業級 Agentic AI 平台把一句對話拆成任務，分派 AI Agent 跨系統完成；Agent 統一納管、消除影子 AI，可設定 Token 用量上限，並以 MCP 擴充，資料掌控權歸企業。
translationKey: orient-ai
node: orient-ai
kind: product
# brief 第 1 段: what it is for (agents doing work across systems, under the company's control). Wording
tagline: 讓 AI Agent 跨系統做事，權限與成本由企業統一管控
# brief 第 1 段的說明句: who it is for. Wording, no facts
heroLead: 給對資料隱私要求高的金融與政府單位：AI Agent 接進現有業務系統執行任務，權限、用量與紀錄都在企業的管控內。
# Three proof points (brief 第 1 段): the three OrientAI features named on the home page
heroPoints:
  - "多 Agent 協作"
  - "AI 治理"
  - "Token 成本控管"
heroImage: ../../../assets/design/ribbon/page-orient-ai.webp
# The blocks on the hero picture (src/lib/scene/ribbon/pictures.json), in section 3's words; one AI
# block labelled, the three labels of the same words overlap at 1280 wide
heroLabels:
  legacy: 業務系統
  product: OrientAI
  ai1: AI Agent
# Sections 2–8 of the brief, each in the layout its 段落表 gives. Fill marks the question groups (P5):
# what it does (2, 3), how it is governed (4–6, subtle), hardware (7), cost (8, brand); section 9 is the template's related
# posts (blog.relatedOfferings), section 10 its ContactCta. Headings, bodies, labels and diagram words
# are wording; items, values and fragment rows are fact texts or words taken from them
sections:
  - layout: ui
    id: execution
    itemsBelow: true
    heading: 知識問答與跨系統任務，在同一個平台
    body: 員工問企業知識、交辦跨系統的工作，都由 OrientAI 接手；模型可以換，功能模組用 MCP 接上。
    fragment:
      title: 執行層
      rows:
        - label: RAG 知識問答與文件解析
          state: "on"
        - label: AI Agent 跨系統任務自動化
          state: "on"
        - label: 彈性整合多種大語言模型
          state: "on"
        - label: MCP 擴充應用
          state: next
    items:
      - body: "RAG 知識問答與文件解析\nAI Agent 跨系統任務自動化\n彈性整合多種大語言模型\n支援雲地靈活部署架構"
      - body: "應用場景：\n企業知識查詢\n專業分析\n流程自動化\n智慧決策輔助"
      - title: "MCP 擴充應用"
        body: "標準化整合功能模組，彈性擴展業務，持續優化流程"
  - layout: junction
    id: flow
    heading: 一句對話發起，Agent 跨系統完成
    body: 使用者用對話交辦工作，OrientAI 拆解任務、分派給合適的 Agent，在現有的業務系統之間完成，跨部門的資料也能互通。
    diagram:
      caption: OrientAI 把對話轉成任務，分派 AI Agent 在現有系統之間協作完成。
      columns:
        - title: 現有系統
          tone: legacy
          nodes:
            - label: 業務系統
            - label: 業務流程
        - title: OrientAI
          tone: product
          nodes:
            - label: 對話式任務發起
            - label: AI Agent 分派與執行
            - label: Agent 管理與治理
        - title: AI Agent
          tone: new
          nodes:
            - label: 企業知識查詢
            - label: 專業分析
            - label: 流程自動化
    items:
      - title: "對話式任務發起"
        body: "理解自然語意與資料需求，轉化為可執行任務"
      - title: "AI Agent 分派與執行"
        body: "自動拆解任務、調用合適的 AI Agent，跨系統協作完成工作"
      - title: "Agent 管理與治理"
        body: "統一控管 Agent 權限、成本與資安，可降低風險並確保可擴展性"
      - title: "Agent 協作無間"
        body: "整合現有業務系統與流程\n即時查看 Agent 狀態與行為\n自動分派 Agent 執行任務\n避免運行衝突或誤觸發 Agent"
      - body: "透過標準化架構整合多套系統，打通跨部門、跨團隊間的數據孤島，促進資料共享與無縫協作，優化作業流程與效率。"
  - layout: ui
    id: governance
    flip: true
    itemsBelow: true
    fill: subtle
    heading: Agent 與影子 AI 統一納管
    body: 各部門自己接的 AI 工具與 Agent，收進同一個平台授權；每個 Agent 能碰哪些資料、誰能用，都有邊界。
    fragment:
      title: Agent 管理
      rows:
        - label: AI Agent 統一管控與授權標準化
          state: "on"
        - label: 消除影子 AI
          state: "on"
        - label: 跨部門統一權限管理與資料治理
          state: "on"
    items:
      - body: "AI Agent 統一管控與授權標準化\nToken 用量監控與資源配置最佳化\n消除影子 AI，防止機敏資料外洩\n跨部門統一權限管理與資料治理"
      - body: "對 AI 模型與 Agent 實施全週期管理，將影子 AI 統一納管，建立身分驗證機制與資料存取邊界，避免越權存取、異常行為等資安破口。"
      - body: "應用場景：\nAI 資源管理\n跨部門工具共享\n權限審核\n模型與成本控管"
  - layout: claim
    id: data
    fill: subtle
    heading: 資料掌控權歸企業
    body: OrientAI 部署在企業端，金融與政府這類對資料隱私要求高的單位，資料不必交給平台方。
    items:
      - body: "OrientAI 只會部署於企業端，資料掌控權為企業所有。"
      - body: "因此，OrientAI 適用於醫療、金融、製造業等對數據隱私要求極高的產業。"
  - layout: ui
    id: monitoring
    itemsBelow: true
    fill: subtle
    heading: 使用與異常看得到
    body: 上線之後，AI 回覆的品質、任務跑到哪裡、誰在用，都看得到；操作留有日誌，異常行為會即時告警。
    fragment:
      title: 監控
      tabs:
        - AI 回覆品質
        - 任務執行狀態
        - 使用行為
      rows:
        - label: 精細化角色權限控管
          state: "on"
        - label: 日誌追蹤與稽核
          state: "on"
        - label: 偵測異常行為，即時告警
          state: "on"
    items:
      - title: "強化 AI 治理"
        body: "精細化角色權限控管\n日誌追蹤與稽核\n偵測異常行為，即時告警"
      - body: "即時檢視 AI 回覆品質、任務執行狀態、使用行為，建立異常預警機制"
  - layout: spec
    id: hardware
    image: ../../../assets/design/sec-deployment.webp
    heading: 硬體依團隊規模選
    body: 團隊人數決定要配的設備；搭配群聯 aiDAPTIV 的記憶體擴充，地端架構離線也能運作。
    rows:
      - label: 1-5人團隊
        values: ["輕量級運算 首選 AI PC Workstation"]
      - label: 5人以上
        values: ["跨部門應用 高併發流量 & 高強度推論 必備 Workstation AI Server"]
      - label: 記憶體擴充
        values: ["結合群聯 aiDAPTIV 獨家記憶體擴充技術，突破算力與容量限制，地端架構確保離線仍可穩定運行"]
    link:
      label: 以 OrientAI 為軟體核心的地端 AI 方案：AISO 主權 AI
      node: aiso
  - layout: band
    id: token
    fill: brand
    heading: Token 用量與成本控得住
    body: Token 用了多少看得到，也能設上限；系統依任務的複雜度分派模型與 Agent。
    items:
      - body: "精準掌握 Token 消耗率，設定用量上限避免 Token 濫用與預算失控"
      - body: "針對 AI Token 消耗量進行即時監測與額度設定，讓系統依據任務複雜度自動分派模型與 Agent，將運算資源作最佳化配置。"
    fragment:
      title: Token 額度
      rows:
        - label: 設定 Token 用量上限
          state: "on"
        - label: 依據任務複雜度自動分派模型與 Agent
          state: next
    link:
      label: 預約演示
      node: contact
cta: demo
# brief 第 10 段: the band's heading is seeing agents run in the reader's own systems
contactTitle: 看 Agent 在你的系統裡怎麼跑
facts:
  - orientai-multi-agent
  - orientai-governance
  - orientai-token-cost
  - orientai-execution-layer
  - orientai-execution-scenarios
  - orientai-mcp
  - orientai-task-intake
  - orientai-agent-dispatch
  - orientai-agent-management
  - orientai-collaboration
  - orientai-data-silos
  - orientai-governance-layer
  - orientai-shadow-ai-lifecycle
  - orientai-governance-scenarios
  - orientai-on-prem-data
  - orientai-privacy-industries
  - orientai-governance-controls
  - orientai-risk-insight
  - orientai-hardware-small
  - orientai-hardware-large
  - orientai-aidaptiv
  - aiso-software-orientai
  - orientai-token-transparency
  - orientai-token-allocation
sourceUrl:
  - https://www.tpisoftware.com/orient-ai
  - https://www.tpisoftware.com/orient-aI
migratedAt: 2026-10-24
---
