---
title: digiRunner .NET Executor 簡介
description: digiRunner .NET Executor 讓既有專案不須繁瑣重構，只需在類別、方法加上 digiRunner 屬性，重新發布成模組並上傳至管理平台啟用。
translationKey: digirunner-net-executor
category: enterprise-management
tags: [api-management]
publishedAt: 2021-08-04
author: Rex
authorType: Person
# https://tpi.dev/tpi-dev/private/article/IMG/1f060591-7058-6850-8cfc-bf8fc57a6792.jpg
coverImage: ../../../assets/blog/zh-TW/digirunner-net-executor/cover.webp
sourceUrl: https://www.tpisoftware.com/blog/smartm/digirunner-net-executor-
migratedAt: 2026-10-23
sourceUpdatedAt: 2021-08-04
---

## [ASP.NET](http://asp.net/)發展

自從微軟發表 .NET Framework 1.0 以來，[ASP.NET](http://asp.net/) 已經發展18個年頭。 [微軟發展了.NET](http://xn--ykq894aprch16a311a.net/) Remoting (TCP/HTTP/Pipeline communication)、Web Service (SOAP with HTTP communication) 以及基礎的 Winsock 等通訊方法。 雖然通訊方法的設計方法不同，但彼此之間也有相互的重疊性([例如.NET](http://xn--fsqu6v.net/) Remoting可以開發SOAP, HTTP通訊)。 而對開發人員來說，每一種通訊方法都有不同的設計模型，而每種設計模型都必須要重新學習。

現今服務導向架構 (Service-Oriented Architecture) 在軟體業開始風行。 微軟在 .NET Framework 3.0 加入了 WCF (Windows Communication Foundation)，這是一種提供 SOA 支援的安全的網路服務框架，也是提供 Web Service 及 .NET Remoting 之外的另一種框架的選擇。 經過了這些年的發展， Web Service 、 .NET Remoting 及 WCF 這三種框架都各有許多開發者選擇使用，普遍存在許多專案之中。而近幾年開始流行的 Web API 開始成為新寵兒，其跨平台界接得能力，相較於 Web Service 及 .NET Remoting 可以使用 HTTP 的全部特點(比如URIs、Request/Response Header，暫存，版本控制，多種內容格式)，再加上開發設定難度都易於 WCF ，逐漸成為新專案首選的框架。

## 使用多種框架的專案中，如何有效的管理

而在使用這麼多種框架的專案中，如何有效的管理並且提供共同的通訊界面，或者讓 Web Service 、 .NET Remoting 及 WCF 享有 Web API 的優點，將變成一種難題。開發者都只能依照已經存在的服務來選擇實作通訊界面，數量累積起來也造成開發時程上的損失。 而現在 digiRunner .NET Executor 提供更有效率的管理，既有的專案不須反鎖的重構 (Rebuild) ，例如將 WCF 專案重構成 Web API 專案。 僅需將既有的類別 (Class) 、方法 (Method) 加上 digiRunner 的屬性 (Attribute) 並且重新發布成新的模組 (Module)。 然後上傳至 [digiRunner](/products/digirunner) 管理平台，並且啟用。 此時 digiRunner .NET Executor 會將模組掛載起來，再設定好權限及管理規則之後，即可使用統一的控制器 (Controller) 來呼叫。 如此一來省去了實作不同通訊界面的時間，也省下了過去佈署在 IIS 上需要遠端桌面 (RDP) 進到主機內進行人工手動佈署，也能減輕維護上的成本。

## 了解更多昕力資訊產品：[digiRunner](/products/digirunner)
