---
title: digiRunner入口網功能及特色簡介
description: digiRunner 是完整的 APIM 解決方案。其入口網前台是民眾與企業組織之間的溝通橋樑，後台則整合 digiRunner 平台與入口網資訊共同管理。
translationKey: digirunner-webportal
category: enterprise-management
tags: [api-management]
publishedAt: 2023-11-25
author: 原作：陳瑞泰 John Chen | 編撰：Annie Chou
authorType: Person
# https://tpi.dev/tpi-dev/private/article/IMG/1f05d6c0-0410-6d33-8cfc-bf8fc57a6792.png
coverImage: ../../../assets/blog/zh-TW/digirunner-webportal/cover.webp
sourceUrl: https://www.tpisoftware.com/blog/smartm/digirunner-webportal
migratedAt: 2026-10-23
sourceUpdatedAt: 2023-11-25
---

開發者入口網是什麼？首先，我們來看看[維基百科](https://zh.wikipedia.org/zh-tw/%E9%97%A8%E6%88%B7%E7%BD%91%E7%AB%99)上對「開發者入口網」的定義：「開發者入口網站（英語對應詞：Developer Portal），指的是將不同來源的資訊以一種整齊劃一的形式整理、儲存並呈現的網站。用戶可以根據資訊來源、資訊類型、關鍵字檢索以及其他方式，來篩選並取得在開發者入口網站內發布的所有內容。」從定義上可知開發者入口網一定具備一般大眾使用的前台網站及管理員使用的後台網站，而 digiRunner 作為 API 管理平台，其開發者入口網的主要功能為API開發者提供其應用程式專案的管理及平台API的露出。

## 為什麼digiRunner需要開發者入口網?

[digiRunner API 管理平台](/products/digirunner)是一套包含 API Gateway、管理主控台和開發者入口網的完整 APIM (API Management) 平台，支援多種後台管理功能，使得開發與串接 API 的流程更有效率。與市場產品相較之下，digiRunner 具備完整 API 開發設計、佈署發佈、監控管理、存取權限控管、交易安全管理、Token 與 Session 管理、既有 API 組合與串接、大數據處理等功能並提供各式管理報表等功能，一個平台集中管理，滿足企業所有微服務架構的管理需求。

上述這些功能都是針對 APIM 設計，那麼在平台外部的呼叫者要如何使用這些 API 呢？

digiRunner 開發者入口網前台扮演外界開發者與企業組織之間溝通的重要橋樑，也是企業組織服務外界開發者的網路單一窗口。而後台則整合 digiRunner 平台與開發者入口網資訊共同管理，不僅專注在提升digiRunner API 管理平台內容的品質，同時也重視使用介面的可用性 (usability) 以達到有效率 (efficient) 及滿意 (satisfaction) 等三項網站建置目標。使企業不僅可以快速管理 API ，也可管理 API 與企業外部世界串接的機制。

digiRunner 基本組成元素包含 APIM、開發者入口網前台及後台管理功能，因本文旨在簡介開發者入口網故APIM核心不再論述。其中開發者入口網後台可分為四種大類別：

1.  前台資料基本維謢與查詢作業

2.  各式申請作業

3.  各式簡易簽核作業

4.  開發者入口網的後台維護

這些作業均為前後台互相對應，前台主要負責 API 及甪戶資料的查詢及申請，而後台則負責維護 API 資料使之能顯示於前台，另外對於全體系統而言只要經過申請作業都會需要交由簽核作業同意放行，當然也可以利用後台維護作業設定為不需管理者審核的無人值守模式，二種模式滿足不同企業文化情境。

## digiRunner 開發者入口網系統特色

以 RWD 操作介面為主，相容多種載具。前台提供帳號申請、API 使用授權申請、API 查詢和 API 測試功能。API 開發者可查看系統提供之 Swagger 文件或是 PDF 之類的文件，方便快速開發。此外，digiRunner 開發者入口網更提供 API 沙盒模擬測試功能，可自訂測試資料利於前後端平行開發，以便開發人員輕鬆測試 API。

歡迎至官網了解更多 [digiRunner](/products/digirunner) 產品資訊，或與我們聯繫[預約產品Demo](/products/digirunner#bookademoch)。
