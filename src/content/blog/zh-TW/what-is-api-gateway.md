---
title: API Gateway 是什麼？跟 API 管理平台差在哪
description: API Gateway 是所有 API 呼叫進到後端服務前的單一入口。說明它在路由、認證授權、限流、快取與監控各做什麼，Gateway 故障時怎麼處理，以及它跟 API 管理平台的差別。
translationKey: what-is-api-gateway
category: enterprise-management
tags: [api-management]
publishedAt: 2026-11-03
author: TPIsoftware
authorType: Organization
coverImage: ../../../assets/design/cover-integration.webp
relatedOfferings: [zh-TW/digirunner]
sourceUrl: []
facts:
  - digirunner-failover
  - digirunner-load-balancing
  - digirunner-zero-downtime
  - digirunner-redis-storage
  - digirunner-five-applications
  - digirunner-api-lifecycle
  - digirunner-console
  - digirunner-ai-gateway
---

API Gateway 是所有 API 呼叫進到後端服務前經過的單一入口，負責把請求轉送到對應的服務，並集中處理每支 API 都要遵守的規則。沒有 Gateway 時，每個後端服務各自做認證、限流與紀錄，寫法不一致，出問題時也得一個服務一個服務查。規則收到 Gateway 之後，後端服務只需要處理自己的業務邏輯。

## 路由與反向代理

Gateway 收到請求後，依網址路徑、主機名稱或標頭判斷要轉給哪個後端服務，再把回應交還給呼叫端。這種站在服務前面、代替後端接收請求的角色，叫做反向代理。

對外只露出一個網址，呼叫端不必知道後端有幾個服務、各自在哪台機器上。後端搬家、換版本，或把一套大系統拆成微服務時，改的是 Gateway 的路由設定，呼叫端的程式不用動。

有些 Gateway 也能在轉送時轉換資料格式或協定，例如把舊系統的介面包成新的 API，這是常見的延伸用法。

## 認證與授權

認證確認「你是誰」，授權決定「你能做什麼」。兩件事都在 Gateway 檢查，請求還沒進到後端，身分不明或權限不足的呼叫就先擋下來，後端服務不必各寫一套。

常見的做法各自解決不同的問題：

- API 金鑰：發給每個呼叫方一組識別碼，Gateway 用它認出是誰在呼叫，適合系統對系統的簡單串接
- OAuth：讓使用者授權第三方應用程式代為存取資料，應用程式拿到的是有範圍、有期限的存取權杖，不必經手使用者的密碼
- JWT：把身分與權限資訊包進權杖並加上簽章的格式，Gateway 驗過簽章，就能確認權杖內容沒有遭到竄改
- mTLS：連線兩端都出示憑證、互相驗證，常用在服務與服務之間，確認連進來的是認得的系統

## 限流與配額

限流管速度：同一個呼叫方在一段時間內能呼叫幾次，超過上限的請求會遭到拒絕。配額管總量：每個呼叫方在一個計費週期或合約期間內，總共能用多少。

限流讓後端撐過瞬間湧入的尖峰流量；配額避免單一呼叫方吃掉大部分資源，拖慢其他人。對外開放 API 時，兩者也是分級服務的基礎，不同方案給不同的上限，就能依用量分級收費。

## 快取

有些 API 常有人呼叫，回應內容卻不常變，例如商品目錄。Gateway 可以把這類回應暫存起來，同樣的請求再進來時直接回覆，後端少處理重複的工作，呼叫方也更快拿到結果。

快取要先想清楚兩件事。第一是資料多久要更新，過期多久的資料還能接受；第二是哪些回應不能快取，像是帶個人資料、或每次結果都不同的請求。設定錯了，呼叫方會拿到舊資料，甚至別人的資料。

## 監控與紀錄

所有呼叫都經過 Gateway，所以它是看流量最集中的地方。每支 API 的呼叫量、錯誤率與延遲，都能在同一處統計。

出問題時，Gateway 的紀錄寫著是哪個呼叫方、什麼時間、呼叫了哪支 API、得到什麼回應，排查範圍一下子就縮小，不必到每個後端服務翻紀錄。這些紀錄也是調整限流上限與快取設定的依據。

## 自己架開源 Gateway 要負責什麼

常見的開源選項有 NGINX、Kong、Traefik 與 HAProxy。選擇自己架，代表安裝、設定、升級、高可用架構與監控都由團隊負責：新版本要自己測過再上線，路由與認證設定要自己維護，Gateway 本身的狀態也要有人看。

自己架起來之後，接著要回答兩個問題：Gateway 自己掛掉怎麼辦，以及 Gateway 以外還缺什麼。

## API Gateway 故障時怎麼辦

所有流量都經過 Gateway，它一停，後面的服務再正常也呼叫不到，Gateway 因此成了單點故障。實務上會部署多台 Gateway，前面用負載平衡分散請求；限流的計數、權杖這類狀態資料放在共用的資料庫，任一台停下，其他台接手時看得到同一份資料。

昕力的 API 管理平台 digiRunner 是一個例子。在高可用架構下，任一台故障時，請求自動轉到另一台，不必有人值班切換，流量變大時也能加開節點：

- 在高可用性的架構下，如果其中一個 API 伺服器（指 digiRunner）出現故障，所有請求都會自動分流至另一個伺服器，全程無需人為操作。
- 內建原生負載平衡機制，透過平台介面直接設定、即時啟動。
- 雲原生容器化佈署架構，支援橫向擴展叢集機制，可建構高可用性系統架構。

資料庫的備援架構，可以依需求與預算選擇：「數據將以 RDB 格式保存在 Redis 資料庫。資料庫可根據客戶需求進行配置。我們的金融產業合作夥伴多採用具高可用性的 Active/Standby 架構。若預算較高，可結合 Active/Active 架構與災難恢復，或採 Active/Active/Standby 三模式架構，以便能在故障發生後快速備份及復原。」

## API Gateway 跟 API 管理平台差在哪

Gateway 管的是執行期的流量：請求進來時轉給誰、放不放行、要不要快取。API 管理平台在 Gateway 之外，還管 API 從設計到下架的整段過程，以及誰在用、用了多少：

- API 生命週期：設計、發布、版本管理到下架，舊版要留多久、呼叫方怎麼換到新版
- 開發者入口網站：讓要呼叫 API 的人申請與取得存取權限的地方
- 使用紀錄與分析：誰在用哪支 API、用了多少，作為容量規劃、計費與下架的依據

企業開始用 AI 模型之後，應用程式呼叫模型的請求也是一種要管理的流量：誰能用哪個模型、用了多少、送出去的內容安不安全。這部分可以接著讀[用 AI Gateway 管理生成式 AI 與模型整合](/blog/ai-infrastructure-operations-governance)。

digiRunner 把 API Gateway 列為平台的應用之一：「API Gateway：一站式的 API 管理，確保資料交換的速度與安全。」Gateway 之外，平台另外提供生命週期管理、即時主控台與 AI Gateway：

- 提供完整 API 生命周期管理，更遵循 Open API 規範，支援 OAuth2.0 及 OIDC（OpenID Connect）的安全規範
- 即時主控台完整保留 API 活動與軌跡
- AI Gateway 智能負載平衡與安全防護，全面監控AI運作

各項功能的細節，見[digiRunner API 管理平台的 API 生命週期管理與 AI Gateway](/products/digirunner)。

## 評估要 Gateway 還是 API 管理平台前，先問的問題

- Gateway 要裝在哪裡：自己的機房、雲端，還是兩邊都有？
- 要接哪些既有系統，這些系統的介面能不能直接包成 API？
- Gateway 故障時誰處理，半夜也有人接手嗎？
- 需不需要管 API 的生命週期與使用紀錄，還是只要轉送與認證？
- AI 模型的呼叫，要不要跟 API 一起管？

這些問題的答案，決定需要的是一台 Gateway，還是一套 API 管理平台。想看一套平台的部署方式、資安機制與導入案例，可以到 [digiRunner API 管理平台](/products/digirunner)；想先自己操作看看，可以[試用 digiRunner on Cloud](/products/digirunner-cloud)。
