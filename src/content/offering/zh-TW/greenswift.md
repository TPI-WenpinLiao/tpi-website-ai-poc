---
# Rewritten from docs/strategy/briefs/greenswift.md (#202), laid out per section
# The h1 is the node's name; the title adds the query words (brief「title 與 description 方向」)
title: GreenSwift 智慧碳管理平台
seoTitle: GreenSwift 碳盤查平台：碳足跡與 CBAM 申報
# brief「description」: no trial days, no 免費, no ISO 14067
description: GreenSwift 智慧碳管理平台處理碳盤查、產品碳足跡與 CBAM 申報資料，內建 GHG Protocol 與 ISO 14064-1:2018 標準，可下載環保署登錄平台的表單格式，申請經審核通過後可以試用。
translationKey: greenswift
node: greenswift
kind: product
# brief 第 1 段: what it is for, the three plans in one place. Wording, no facts
tagline: 碳盤查、碳足跡與 CBAM 申報，在同一個平台
# brief 第 1 段的說明句: how it works (standards built in, departments and consultants together)
heroLead: 盤查標準與係數已經內建，負責碳盤查的部門與合作的顧問一起收數據、算排放、出報告。
heroPoints:
  - "通過國際查證機構核發AUP認證"
  - "可整合七大溫室氣體排放"
heroImage: ../../../assets/design/ribbon/page-greenswift.webp
# The block on the hero picture (src/lib/scene/ribbon/pictures.json), named by fact:greenswift-scope's plans
heroLabels:
  greenswift: 碳盤查、CBAM、碳足跡
# The trial's conditions are in section 9; the hero's button goes there first (brief 取捨第 3 項)
secondaryCta:
  label: 申請試用
  href: "#trial"
# Sections 2–9 of the brief, each in the layout its 段落表 gives (section 8, the case, is caseNotes
# below). Headings, bodies, labels and diagram words are wording; items, rows and fragment rows are
# fact texts or words taken from them
sections:
  - layout: spec
    id: plans
    fill: subtle
    heading: 碳盤查、CBAM 與碳足跡，各有方案
    body: 組織的碳盤查、出口要的 CBAM 數據和產品碳足跡各有方案，數據不必分散在不同工具裡。
    image: ../../../assets/design/sec-planning.webp
    # A row is a plan: its scope (fact:greenswift-scope) leads, what the plan has follows
    rows:
      - label: 碳盤查
        values:
          - |-
            盤查企業自身碳排放，包括跨地區/廠區/設備/系統：
            支援ISO14064-1標準的碳盤查流程
            提供碳排放清單編制工具
            AI生成碳盤查報告
            數據進度即時追蹤功能
            無組織邊界數量限制
            無帳號數量限制
      - label: CBAM
        values:
          - |-
            自動文件資訊化碳排，並產出申報清冊：
            CBAM（碳邊境調整機制）報表格式下載
            提供進出口供應鏈符合CBAM要求的數據支持
      - label: 碳足跡
        values:
          - |-
            計算企業產品碳足跡，計算相關供應鏈碳足跡：
            專注於產品碳足跡計算
            提供產品生命周期碳排放報告
            支援國際及地方排放係數的自動更新
            無產品碳足跡盤查報告數量限制
  - layout: ui
    id: standards
    heading: ISO 14064-1 與 GHG Protocol 的盤查步驟已內建
    body: 系統照六個步驟帶著做，兩種標準可以切換，係數會跟著 IPCC 更新，不必自己查表。
    fragment:
      title: 盤查流程
      kind: steps
      rows:
        - label: 盤查計畫
          state: "on"
        - label: 組織邊界
          state: "on"
        - label: 排放源鑑別
          state: next
        - label: 排放量計算
        - label: 盤查報告
        - label: 查證作業
        - label: 標準
          value: GHG Protocol／ISO 14064-1:2018
    items:
      - body: "以六大步驟系統化管理類別一至類別四溫室氣體排放源盤查流程"
      - body: "系統內建最新的碳盤查標準和國際係數，可自由切換使用 GHG Protocol 及 ISO 14064-1:2018 標準，並定期更新 IPCC 的最新係數"
      - body: "平台具備快速切換不同全球暖化潛勢（GWP）的功能"
      - body: |-
          範疇一：可全面追蹤源頭排放，精確管理直接 GHG 排放量。
          範疇二：聚焦進口能源產生的間接 GHG 排放。
          範疇三：覆蓋其他間接排放，為您提供全方位的環境影響洞察。
  - layout: junction
    id: output
    heading: 自動計算，產出清冊與申報格式
    body: 不必先改動現有系統，資料整理好就能開始算排放，年度之間的資料也接得起來。目前不直接串接 ERP、HR 系統。
    diagram:
      caption: 企業已整理好的資料與佐證資料從介面匯入，系統內建的公式計算碳排放量，產出環保署登錄平台的表單格式、盤查清冊與溫室氣體報告。
      columns:
        - title: 企業已整理好的資料
          tone: legacy
          nodes:
            - label: 相關資料
            - label: 佐證資料
        - title: GreenSwift
          tone: product
          nodes:
            - label: 碳排計算公式
        - title: 產出
          tone: new
          nodes:
            - label: 環保署登錄平台表單格式
            - label: 盤查清冊
            - label: 溫室氣體報告
    items:
      - body: "雖然目前不支援直接與 ERP、HR 系統或其他模組的整合，但如果貴公司已經整理好相關資料，可以直接透過 GreenSwift 的介面進行資料匯入並上傳佐證資料"
      - body: "系統內建碳排計算公式 ，自動計算完整碳排放量，並可一鍵下載為符合環保署登錄平台之表單格式(3.0.0)"
      - body: "在完成全廠活動數據的收集與計算後，我們將得到年度總排放量，單位為每公噸二氧化碳當量（tCO2e）。此外，我們會整理所有活動數據，形成活動數據總表，並將計算結果以盤查清冊的形式呈現。"
      - body: "AI 協力，一鍵生成溫室氣體報告"
      - body: "根據ISO 14064-1:2018規範，我們會在溫室氣體盤查報告中詳細描述數據鑑別、收集過程及計算方法。報告還包括數據品質評分表與不確定性分析等內容。"
      - body: "透過一站整合盤查數據，不僅過往所有資料得以方便查詢及管理，新年度更可自行帶入過往資料，不須擔心人員變動造成管理不善等問題，讓資料具連續性，確保每次盤查順利完成。"
  - layout: ui
    id: departments
    flip: true
    heading: 部門分工收數據，帳號與組織邊界不設上限
    body: 各部門照權責收數據，系統會主動提醒；內部人員和外部顧問在雲端編同一份文稿。
    fragment:
      title: 帳號管理
      rows:
        - label: 主要管理者帳號
          state: "on"
        - label: 子管理者帳號
          state: "on"
        - label: 使用者數量
          value: 不限
        - label: 組織邊界數量
          value: 不限
    items:
      - body: "GreenSwift 特別強調權責分工、系統主動提醒、數據分析、儀表板設置及減碳計劃自訂，確保各部門能有效協作完成數據收集。"
      - body: "企業內部人員、及外部顧問團隊皆可在雲端上，共同編輯各項指標文稿"
      - body: "對企業而言，系統分為主要管理者帳號和子管理者帳號，且沒有使用者數量的上限。主要管理者帳號可以審核和管理該公司申請的所有子帳號。系統也不限制使用者設立的組織邊界數量，支持靈活配置和擴展。"
  - layout: spec
    id: security
    fill: subtle
    heading: 資安、可用性與語言
    body: 導入前要確認的三件事：資安架構、服務可用性，以及介面與支援用的語言。
    image: ../../../assets/design/sec-identity.webp
    rows:
      - label: 資安
        values: ["GreenSwift採用零信任架構並且所有研發過程均符合 ISO 27001 安全標準"]
      - label: 可用性
        values: ["GreenSwift 碳盤查平台採用雲端SaaS服務，基於 Amazon SLA 服務水準之下，GreenSwift保證所提供之雲端服務系統可用性可達到 99% 以上之服務水準。"]
      - label: 語言
        values: ["系統支援繁體中文與英文兩種語言。系統導入後，如有操作上的問題，我們提供英文支援服務。"]
  - layout: ui
    id: consultants
    heading: 合作的顧問公司登入平台輔導
    body: 合作的顧問公司可以登入平台，替輔導的客戶線上盤點；顧問帳號可以分權，沒有共同輔導的資料彼此看不到。
    fragment:
      title: 顧問帳號權限
      rows:
        - label: 所輔導客戶的資料
          value: 可查看
        - label: 非共同輔導的資料
          value: 不互通
        - label: 顧問帳號分權設定
          state: "on"
    items:
      - body: "是的，GreenSwift 支援顧問公司使用。顧問可以登入系統，針對所輔導的客戶進行線上盤點和協助。"
      - body: "顧問能夠查看所輔導客戶的所有資料，同一顧問公司內的不同顧問帳號可以根據需要進行分權設定，確保資料的安全與私密性，除非是共同輔導，否則彼此間的資料無法互通。"
      - body: "GreenSwift 提供操作教學影片，專業的碳盤查輔導則由合作的顧問公司執行。GreenSwift 與多家顧問機構合作"
    # A sentence of its own, apart from the partner consultants (brief 取捨第 4 項)
    link:
      label: 昕力的 ESG 永續發展與顧問服務
      node: esg-advisory
  - layout: band
    id: trial
    heading: 先試用再決定
    body: 審核通過就能用全部功能試用，先在自己的資料上跑過一輪再決定。
    items:
      - body: "註冊成功後，您的申請將於一個工作日進行審核。"
      - body: "審核通過後即開始30天試用，試用到期將自動關閉帳號權限。"
      - body: "你可以直接在 GreenSwift 上透過 Gmail 登入進行試用。試用期間可使用系統所有功能，惟下載報告書時會有浮水印。"
    fragment:
      title: 試用申請
      kind: steps
      rows:
        - label: 註冊
          state: "on"
        - label: 審核
          state: "on"
        - label: 試用
          state: next
        - label: 到期自動關閉帳號權限
    # The current site's sign-up page (brief「待確認」第 6 項)
    link:
      label: 申請試用
      href: https://greenswift.tpisoftware.com/website/esg/ui
# brief 第 8 段: the one named client, told in news 580; no result in the fact library, so no result row
casesBefore: trial
caseNotes:
  - client: "和鼎隆建築"
    news: zh-TW/580
cta: demo
# brief 第 11 段: the band's heading is seeing the platform carry an inventory
contactTitle: 看平台怎麼帶著完成一次盤查
facts:
  - cert-greenswift-aup
  - greenswift-seven-ghg
  - greenswift-scope
  - greenswift-carbon-plan
  - greenswift-cbam-plan
  - greenswift-footprint-plan
  - greenswift-six-steps
  - greenswift-categories
  - greenswift-standards
  - greenswift-gwp-switch
  - greenswift-scopes
  - greenswift-no-erp-integration
  - greenswift-epa-format
  - greenswift-inventory-output
  - greenswift-ai-report
  - greenswift-report-method
  - greenswift-file-center
  - greenswift-collaboration
  - greenswift-cloud-collaboration
  - greenswift-accounts
  - greenswift-zero-trust-iso27001
  - greenswift-sla-99
  - greenswift-languages
  - greenswift-consultant-accounts
  - greenswift-consultant-access
  - greenswift-consulting-partners
  - client-hedinglong
  - greenswift-case-hedinglong
  - greenswift-review-one-day
  - greenswift-trial-30-days
  - greenswift-trial
sourceUrl:
  - https://www.tpisoftware.com/products/greenswift
  - https://www.tpisoftware.com/carbon
migratedAt: 2026-10-23
---
