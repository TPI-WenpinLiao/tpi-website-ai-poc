---
title: digiRunner on Cloud API 管理平台
# The current site's meta description, rewritten to the seo-checklist length; AWS Marketplace and the
# 30-day trial are on the merged /products/digirunner/awsmarketplace page
description: digiRunner on Cloud 以一鍵啟動為企業帶來簡潔、高效的雲端 APIM，可在 AWS Marketplace 訂閱並免費試用 30 天，擺脫複雜部署，享受流暢的 API 管理、分析與部署體驗。
translationKey: digirunner-cloud
node: digirunner-cloud
kind: product
tagline: 雲地環境 服務不中斷
# The five items under 「Empower your Cloud API」
features:
  - title: Zero Downtime
    body: 高可用性雲原生部署架構，確保關鍵系統穩定運行，實現服務不中斷。
  - title: 有效率的API開發
    body: 低程式碼設計，簡化 API Gateway 和管理流程，提升開發效率。
  - title: 靈活的業務擴展
    body: 靈活且自動擴展的容器化架構，可跨多雲環境部署和高效管理。
  - title: 輕鬆的可視化管理
    body: 統一管理平台，簡化 API 維護和監控，提升維運效率與可控性。
  - title: 最嚴謹的安全管控
    body: 完善的身份驗證授權與資料加密機制，確保系統安全與合規。
# 「API 管理 常見問題集」, the same ten questions as on the AWS Marketplace page. Q4 leaves out
# 「現在點擊安裝，免費試用 30 天」, which pointed at a Marketplace link
faq:
  - question: 如果兩個 API 伺服器的其中一個發生故障，流量會被導流到另一個伺服器嗎？若使用 digiRunner 上的負載平衡器，是否需要手動操作才能重新配置？
    answer: 在高可用性的架構下，如果其中一個 API 伺服器（指 digiRunner）出現故障，所有請求都會自動分流至另一個伺服器，全程無需人為操作。
  - question: 數據儲存在哪裡？方式為何？
    answer: 數據將以 RDB 格式保存在 Redis 資料庫。資料庫可根據客戶需求進行配置。 我們的金融產業合作夥伴多採用具高可用性的 Active/Standby 架構。若預算較高，可結合 Active/Active 架構與災難恢復，或採 Active/Active/Standby 三模式架構，以便能在故障發生後快速備份及復原。
  - question: digiRunner 有什麼內建快取機制？
    answer: digiRunner 內建專利認證的獨家智慧快取技術（Smart Caching），可依據 API 負載情形動態式儲存多個節點的數據。
  - question: digiRunner 在哪些區域或網站？
    answer: digiRunner 現已上架於所有 AWS 區域及網站。
  - question: 每秒交易量（TPS）是什麼？
    answer: 每秒交易量（Transactions Per Second）係指系統每秒能處理的交易數量。 常規 2 Core CPU / 4GB RAM 的 digiRunner 已足以應付企業一般用量。我們建議採用 4 Core CPU / 8GB RAM 的型號，每秒交易量的效能可達 300-1000 TPS。實際每秒交易量取決於不同環境的配置。
  - question: digiRunner 是否有內建的負載平衡器或網路應用程式防火牆（Web Application Firewall）？
    answer: digiRunner 透過 Nginx 將流量分配到各個伺服器端點，以確保 API 服務的穩定性。此外，也可整合現有的 WAF 廠商，如 F5 或 No Name Security。
  - question: digiRunner 具備哪些安全機制？
    answer: digiRunner 支援 OAuth 2.0、API Key、X API Key、白名單（Whitelist）與 HTTP 基本認證。為確保數據完整性和保密性，可選擇使用 JWT 標準（RFC-7519）的JWS (RFC-7515) 或 JWE (RFC-7516) 對數據進行加密或解密。
  - question: digiRunner 可否達到 99.9% 的正常運行時間？
    answer: 可以。請主動聯繫我們以了解 digiRunner 可如何幫助您提升效率，並進一步討論您的具體需求。
  - question: 針對系統的高可用性，digiRunner 能否支援 5 個以上的 Pod？
    answer: 能支援，但目前在 AWS Marketplace 上，我們設了一項 5 個 Pod 的限制。如您有意洽談需求，請主動聯繫我們。
  - question: 免費試用期間可使用哪些功能？
    answer: 在免費試用期間，各方案（digiRunner Enterprise High Availability/Standalone 及 digiRunner Lite High Availability/Standalone）所具備的功能皆可使用，且不會收取任何授權費。唯 AWS 會針對每個 Pod 的用量收取基礎建置及流量費用（按時計費）。費用詳情請參考 Amazon EC2 定價 與 AWS Fargate 定價。
cta: demo
# digirunner-aws-guide in nodes.csv, downloaded by scripts/content/offering-files.mjs to its
# current-site path (download files keep their URL, docs/ia/redirects.md)
downloads:
  - label: digiRunner on AWS Marketplace 買家指南
    file: /pdf/digiRunner%20on%20AWS%20Marketplace_%E8%B2%B7%E5%AE%B6%E6%8C%87%E5%8D%97_v1.4_TC.pdf
sourceUrl:
  - https://www.tpisoftware.com/products/digirunner-cloud
  - https://www.tpisoftware.com/products/digirunner/awsmarketplace
migratedAt: 2026-10-23
---
