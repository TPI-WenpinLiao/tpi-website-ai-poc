---
# Rewritten from docs/strategy/briefs/aiso.md (#201), laid out per section
# brief「取捨」第 3 項: the h1 is the node's name; 「解決方案」 is not part of the name
title: AISO 主權 AI
# brief「title」: the node's name alone is under the length rule
seoTitle: AISO 主權 AI：軟硬體整合交付的地端 AI
# brief「description」: no SysTalk.ai, nothing from /products/systalk-ai-phison, no 落地 or 生態系
description: AISO 主權 AI 以昕力自研的 OrientAI 為軟體核心，結合地端硬體交付；法務、人資等部門有現成的 AI 方案，AI Agent 與算力統一納管，資料掌控權留在企業。
translationKey: aiso
node: aiso
kind: product
# brief 第 1 段: what it is for (OrientAI software and on-premises hardware delivered together). Wording
tagline: OrientAI 軟體與地端硬體，一起交付
# brief 第 1 段的說明句: who it is for and what it does. Wording, no facts
heroLead: 給要把 AI 放在自己機房的企業：軟硬體廠商一起交付，法務、人資等部門的工作有現成的 AI 方案。
# Three proof points (brief 第 1 段), the facts verbatim (DM-10)
heroPoints:
  - "此次產品組合結合自研 OrientAI 系列軟體與地端硬體"
  - "AISO 主權 AI 產業聯盟成軍，主打整合式交付"
  - "集結 AI 軟體與硬體廠商打造的 AI 整合生態系 協助企業快速建置可落地、可擴充、可合規的地端 AI 平台"
heroImage: ../../../assets/design/ribbon/page-aiso.webp
# The blocks on the hero picture (src/lib/scene/ribbon/pictures.json), only words the facts give
heroLabels:
  legacy: 硬體
  product: OrientAI
  service: 地端 AI 平台
# Sections 2–5 of the brief, each in the layout its 段落表 gives; section 6 is the template's related
# posts (blog.relatedOfferings), section 7 its ContactCta. Headings, bodies and labels are wording;
# row labels are the solution names of the facts, values and items the rest of the fact texts
sections:
  - layout: spec
    id: solutions
    fill: subtle
    image: ../../../assets/design/sec-planning.webp
    heading: 各部門有現成的 AI 方案
    body: 法務、人資、教學、醫療與人才培育的工作，各有一套現成的方案，不必從空白的平台開始。
    rows:
      - label: 法務 AI 合約審閱
        values: ["整合合約審閱、擬約與條款檢索，於企業內部完成合約全流程處理。"]
      - label: 人資 AI 勞動法遵
        values: ["整合勞動法令與薪資試算，協助企業正確執行離職、資遣與調薪作業。"]
      - label: 人資 AI 員工服務
        values: ["以企業制度為依據即時回應員工提問，降低人資重複性作業負擔。"]
      - label: 教學備課 AI
        values: ["整合備課、命題與行政文書，建立校內共用的教學知識庫。"]
      - label: 醫療 AI 病歷整合
        values: ["整合 HIS、EMR、LIS 與 PACS 資料，轉換為 FHIR 標準格式，支援跨院資料交換。"]
      - label: AI 人才培育
        values: ["以多模型比對與 RAG 知識庫，培育掌握 AI 的人才。"]
  - layout: claim
    id: software
    heading: 軟體核心是 OrientAI，部署在企業端
    body: AISO 裝的是昕力自研的 OrientAI。OrientAI 部署在企業端，金融與政府這類對資料隱私要求高的單位，資料留在自己手上。
    items:
      - body: "此系列方案以昕力自主研發的企業級 Agentic AI 平台 OrientAI 為軟體核心"
      - body: "OrientAI 只會部署於企業端，資料掌控權為企業所有。"
      - body: "因此，OrientAI 適用於醫療、金融、製造業等對數據隱私要求極高的產業。"
    link:
      label: AISO 的軟體核心：OrientAI 企業級 Agentic AI 平台
      node: orient-ai
  - layout: ui
    id: governance
    heading: AI Agent 與算力管得住
    body: 不同來源的 AI Agent 收進同一處管理；算力依租戶隔開、分層設上限，用量自動出帳，部門之間分攤得清楚。
    fragment:
      title: Agent 與算力管理
      rows:
        - label: AI Agent 統一納管
          state: "on"
        - label: 租戶隔離
          state: "on"
        - label: 分層用量上限
          state: "on"
        - label: 自動出帳
          state: next
    items:
      - title: "企業 AI Agent 治理"
        body: "統一納管不同來源的 AI Agent，全面掌握企業內部 AI 使用狀況。"
      - title: "企業 AI 算力管控"
        body: "以租戶隔離、分層用量上限與自動出帳，精準分攤或計費算力資源。"
  - layout: spec
    id: hardware
    fill: subtle
    image: ../../../assets/design/sec-deployment.webp
    heading: 幾個人用，配什麼硬體
    body: 這是 OrientAI 建議的硬體配置，依使用的人數挑選。
    rows:
      - label: 1-5人團隊
        values: ["輕量級運算\n首選 AI PC、Workstation"]
      - label: 5人以上
        values: ["跨部門應用\n高併發流量 & 高強度推論\n必備 Workstation、AI Server"]
      - label: 記憶體擴充
        values: ["結合群聯 aiDAPTIV 獨家記憶體擴充技術，突破算力與容量限制，地端架構確保離線仍可穩定運行"]
cta: contact
# brief 第 7 段: the band's heading is a department's needs and the hardware for them
contactTitle: 談部門需求與硬體配置
facts:
  - aiso-orientai-hardware
  - aiso-alliance
  - aiso-ecosystem
  - aiso-legal-contract
  - aiso-hr-labor-law
  - aiso-hr-employee-service
  - aiso-teaching
  - aiso-medical-records
  - aiso-talent
  - aiso-software-orientai
  - orientai-on-prem-data-statement
  - orientai-privacy-industries
  - aiso-agent-governance
  - aiso-compute-control
  - orientai-hardware-small
  - orientai-hardware-large
  - orientai-aidaptiv
sourceUrl: https://www.tpisoftware.com/aiso
migratedAt: 2026-10-24
---
