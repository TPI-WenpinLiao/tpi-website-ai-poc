---
title: API 管理（APIM）為金融企業避雷 打造零金融檢查缺失
description: 數位金融加重 API 管理需求。昕力資訊 digiRunner 遵循開放式 API 規範，提供完整 API 生命週期管理，開發流程獲 ISO27001 驗證。
translationKey: financialexamination
category: enterprise-management
tags: [api-management]
publishedAt: 2023-10-04
author: TPIsoftware
authorType: Organization
# https://tpi.dev/tpi-dev/private/article/IMG/1f0605a3-85f7-6a02-8cfc-bf8fc57a6792.png
coverImage: ../../../assets/blog/zh-TW/financialexamination/cover.webp
sourceUrl: https://www.tpisoftware.com/blog/smartm/financialexamination
migratedAt: 2026-10-23
sourceUpdatedAt: 2023-10-04
---

金融企業皆須針對金管會提出的金融檢查項目進行檢核準備，主要涵蓋防制洗錢、打擊資恐及反武器擴散落實情形、法令遵循制度實施情形、公司治理運作落實情形、資通安全管理、金融消費者保護作業、個人資料保護等 6 項。因此，不想有金融缺失，要注意別踩哪些雷？

*不定期的進行金融檢查，要注意別採哪些雷?*

而 API 管理又與這些檢查項目有什麼關聯？其實 API 管理應用情境相當多元，因應企業數位化過去20年間，各個企業對資訊系統的建置已有相當的程度，系統擴增之中 API 佔有重要的角色。而金融業更是不例外，由以近年網路銀行、行動銀行及純網銀的趨勢，更加重金融企業對於 API 管理的需求，以下就針對最多人問的五項 API 關聯金檢規則進行整理說明：

## 金檢規則 1：API 分級協助，並制定適當管理程序

API 管理平台可以設置查看 API 的使用權限、設定客戶端 API 配額及流量、Token 驗證加密功能，並可預設 API 群組功能依企業需求調整安全等級，能有效分區設定、控管組織內部及外部使用單位，任一單位轄下組織也可依使用角色進行權控，確保每一支 API 的分級與權控程序皆符合法遵原則。

### 金檢規則 2：API 部署授權，具有評估原則、避免風險

API 的部署及使用授權皆應有評估原則、避免使用風險，目前昕力的 API 管理平台 [digiRunner](/products/digirunner) 擁有 OAuth 2.0 與 API KEY 授權功能，以可直接作為銀行金融單位資安部門在評估API佈署使用授權的準則。

### 金檢規則 3：API 適當認證，憑證授權與驗身

API 應有適當的認證、授權程序與金鑰機制，預設提供了 JWE 與 TLS 等憑證管理功能，也可以串接包括 HSM等的憑證管理系統，一次解決銀行或 TSP 業者對於 API 認證、授權程序或金鑰管理等繁雜的金檢要求。

### 金檢規則 4：API 即時監控，連線存取活動監控

同時金融企業也需要對 API 連線存取活動進行監控，並能產出定期監控報表，預設提供有 API 稽核日誌，方便查看API的 Header (標題)、Body (內文)、交易 ID、發生時間、使用者等資訊；無論是 API 連線存取活動或交易的內容，都可以彈性選擇監控區間、定期匯出報表。

### 金檢規則 5：API 控管機制，設有金鑰、資料傳送加密

對於可能會存取機敏資料之第三方服務業者 (TSP)，需設有金鑰發放、傳送及保密等控管機制。API 管理平台不會儲放機敏機資料，平台在傳輸資料時，會採用JWT/JWE/JWS等加密機制；因此第三方服務業者若有存取敏感性資料的需要，平台的管控機制能確保金鑰發放、傳送與加密符合金檢規範。

### API 管理平台（APIM Platform）選擇的特點

金融企業在選擇 API 管理平台，需要注重其是否具有**嚴謹的架構設計及安全的訊息交換機制**，才能真正有效幫助企業建立最佳化管理，而 [digiRunner](/products/digirunner) 100%遵循且符合開放式 API 規範 ( Open API Specification )，可串聯既有 API，支援多種 API 格式，為企業提供完整的 API 生命週期管理，同時集結資安管理、監控管理、存取權限控管、交易安全管理等功能，其開發流程更獲得 ISO27001驗證，為金融企業帶來全方位提高 API 管理及資安防護。

最後，想了解關於digiRunner API 管理平台，可以[官方頁面](/products/digirunner)獲取更多訊息，而對於 API 管理為金融企業避雷的議題感興趣。
