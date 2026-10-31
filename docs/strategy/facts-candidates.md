# 事實候選（自動產生）

由 `scripts/strategy/extract-facts.mjs` 產生，不要手改。範圍是 `docs/research/inventory.csv` 中 zh-TW、HTTP 200、類型為 `home`、`about`、`product-index`、`product`、`solution`、`service`、`case-study` 的頁面（轉址的取最終網址），共 59 頁。

每頁列出含數字、認證、獎項、客戶與產業名稱等字樣的文字區塊（出現在三分之一以上頁面的視為選單與 footer，不列），以及收進事實庫的 id，或 `facts-source.yaml` 的 `ignore` 規則寫的略過原因。「（他頁）」表示這頁沒有涵蓋它的事實，只有別頁來源的事實文字相符，那筆事實講的可能是別的產品，要人工確認。「**未收**」是還沒判斷的區塊。

合計：已收 490（其中他頁 60）、略過 173、未收 0。

## https://www.tpisoftware.com/

| 段落 | 狀態 |
|---|---|
| 透過免模板辨識醫療單據解決格式變動痛點，提升辨識率並降低40%維護人力 | `smartfilling-result` |
| 全自動執行理賠立案到派件，精確解析診斷書，節省逾80%人工作業時間 | `smartclaim-result` |
| 強化線上互動體驗，提高線上服務解決率，轉化客戶滿意度 | `remote-insurance-result` |
| 更以客戶利益為導向，致力於提供創新技術及軟體解決方案，在安全面、執行面和可靠性皆贏得客戶信賴及各界的肯定。 | 略過：核心價值、產業背景或概念說明的敘述，沒有昕力可查證的事實 |
| 客戶證言 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 昕力是台灣本土在 API 管理平台上，相較於國際來說，走得最前面，且是第一家開始投入相關技術的企業。昕力在 API 管理平台的技術和 Al 都提供很好的服務，在未來的開放銀行有很大的發揮效果，可擔任領頭羊，引領其他公司投入。 | `testimonial-nccu-fintech` |
| ｜國泰金控數數發中心資深副總 | `testimonial-cathay-fhc-speaker` |
| 此次與昕力的合作我們就像同一個團隊般合作無間，目前SysTalk已經涵蓋了我們旗下50％以上的用戶服務量，在滿意度回饋上也超過了真人客服，透過昕力的最佳技術與完整客戶體驗的合作，我們獲得了相當好的成果。 | `testimonial-cathay-fhc` |
| 卓新是結構化綜合佈線領導廠商，客戶遍及全球各地，此次與昕力資訊合作，導入 RPA 流程自動化，不但改善了員工工作的效率，讓人才發揮最大的價值，在內部流程革新之下，促使企業營運朝數位轉型前進，以因應快速轉變的時代，為卓新發展帶來極大助益，並保持競爭力的關鍵！ | `testimonial-excellence-wire` |
| ｜新光銀行數位資訊部資深經理 | `testimonial-shin-kong-bank-speaker` |
| 服務客戶 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |

## https://www.tpisoftware.com/about-us

| 段落 | 狀態 |
|---|---|
| 昕力資訊為企業數位轉型軟體領導品牌，滿足各式企業前瞻軟體技術需求，由企業服務中台、交談式 AI 產品、雲服務，再到全方位軟體解決方案，具有高安全性、高執行性及高可靠性之開發質量，服務產業遍及金融保險、政府單位、零售電商、製造生產、醫療照護等產業，皆贏得客戶信賴與良好商譽，於海內外累積大型專案開發經驗，更能幫助企業客戶彈性、靈活地因應市場情勢。以優質技術創新加速轉型，打造在地化服務網絡，為企業佈局海外數位戰略，提升全球市場競爭力。 | `company-offerings` `company-industries` |
| 我們傾聽客戶需求，量身打造專屬的解決方案，是值得信賴的好夥伴。 | 略過：核心價值、產業背景或概念說明的敘述，沒有昕力可查證的事實 |
| 卓越的專業團隊、豐富的實戰經驗攜手客戶達成完美交付。 | 略過：核心價值、產業背景或概念說明的敘述，沒有昕力可查證的事實 |
| 台灣第一的企業軟體與解決方案提供商 : 以榮獲台灣精品獎肯定之兩大自有研發軟體產品系列及八大數位轉型領域，為企業客戶轉型賦能，彈性應對未來、靈活打造新商模。 | `company-product-lines` `company-claim-taiwan-first` |
| 國際企業客戶第一選擇 : 昕力除了深耕台灣之外，亦於新加坡、越南、日本與泰國皆設立據點，在東南亞與東北亞各地擁有合作夥伴，透過跨國在地化策略，以因應亞洲市場數位技術需求，協助企業客戶快速跨足國際市場，是國際化企業尋求資訊軟體服務的第一選擇。 | `company-asia-presence` |
| 保持人才與技術領先 : 我們掌握雲、地最新關鍵人才與技術，協助企業突破實體與虛擬疆界，迎接雲端經濟之無限商機。我們協助客戶創新轉型，提升核心實力，進而強化產業競爭力。 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 2005 | `company-founded` `office-taichung-phone` |
| 2006 - 2010 | 略過：時間軸的年份頁籤，內容見各年份的事實 |
| 2011 - 2015 | 略過：時間軸的年份頁籤，內容見各年份的事實 |
| 2016 - 2019 | 略過：時間軸的年份頁籤，內容見各年份的事實 |
| 2020 - 2022 | 略過：時間軸的年份頁籤，內容見各年份的事實 |
| 昕力資訊創立於 2005 年，透過扎實軟體技術提供企業客製化數位系統服務，創辦人 Ben Yao 的創業核心是以務實精神與優質服務，與企業客戶發展長遠的夥伴關係，並與其一同成長。同時，Ben 堅信台灣擁有足以與國際巨頭競爭之軟體人才、工作文化，因此將台灣軟體服務與人才帶領至國際舞台，是 Ben 始終堅持的目標。 | `company-founded` `company-founder` |
| 為台灣易利信、台積電提供軟體品質管理與顧問服務，不斷累積經驗、汲取多方養分；2008 年首度跨足金融產業，為華南銀行建置 CRM 系統，同年也名列為傑出企業成就，專業服務受到多家知名客戶信任，優質的服務於業界不斷獲得好評。 | `company-milestone-2008-finance` `award-2008-outstanding-enterprise` `client-ericsson-taiwan` `client-tsmc` `client-hua-nan-bank` |
| 透過豐富的軟體經驗實踐，逐步發展自有軟體產品，2011年開發第一個 產品 – TPRS 推薦系統；同時於金融業界獲得國泰世華、台新銀行、保誠人壽、澳盛銀行、法國巴黎人壽等指標性客戶信賴，成功為銀行客戶建置多項金融系統服務，推動銀行數位轉型成果斐然。 | `company-milestone-2011-tprs` `client-prudential-uk-short` |
| 成為台灣金融科技解決方案領導廠商，累積超過 400個不同的專案成功經驗，分別在2017、2019年設立新加坡與越南子公司，前進東南亞市場；積極發展兩大產品系列 DigiLism 與 SysTalk.ai，而 AI Chatbot 產品於 2018 年更獲頒 Gartner 亞太地區 Cool Vendor 獎項。 | `company-projects-400` `company-subsidiaries-sg-vn` `company-product-families` |
| 2020年以「TPIsoftware」 邁入國際，全球員工超過 630 名，成為台灣資訊軟體業領導廠商，不僅奠基海外金融科技服務供應商，更跨足零售產業，同時，無懼疫情逆勢成長，入選英國金融時報 (Financial Times) 2022 亞太地區快速成長 500 強企業。接連榮獲 2021 第一屆數位金融獎與 CX Asia Excellence Awards、2022 創新商務獎、2022 中小企業創新研究獎、2023 台灣精品獎等多項肯定。 | `company-milestone-2020-brand` `company-employees-630` `company-milestone-retail` `award-ft-high-growth-2022` |
| digiRunner、digiLogs、SysTalk.Chat 獲得「2023 台灣精品獎」 | `award-taiwan-excellence-2023` |
| digiRunner、digiLogs、SysTalk.ai 獲得「2024 台灣精品獎」 | `award-taiwan-excellence-2024` |
| DigiLism 企業服務中台獲 「第29屆中小企業創新研究獎」 | `award-sbir-29` |
| 2022 創新商務獎 digiRunner 獲得「最佳技術創新獎」； SysTalk.Chat 獲得「最佳產品創新獎」 | `award-innovative-business-2022` |
| 獲「第一屆數位金融獎」 金融科技新創公司推薦獎 | `award-digital-finance-1st` |
| 獲新加坡 「2021 CX Asia Excellence Awards」- 卓越供應商金獎 | `award-cx-asia-2021` |
| 獲 Best in Singapore 肯定， 入選「最佳軟體服務開發商」 | `award-best-in-singapore` |
| 企業產品中台之開發流程 獲ISO27001 認證 | `cert-iso27001-product-platform` |
| 獲頒 Gartner 亞太地區 2018 年 Cool Vendor 獎項 | `award-gartner-cool-vendor-2018` |
| 獲104人力銀行「雇主品牌大賞」評選 2024年科技業組【104 最佳吸引力獎】 | `award-104-employer-2024` |
| 114台北市內湖區瑞光路335號12樓 | `office-taipei-address` |
| 7 Straits View, Marina One East Tower, #05-01, Singapore 018936 | `office-singapore-address` |
| +65 8737 4703 | `office-singapore-phone` |
| Lầu 7, phòng 706-707-708, Tòa nhà Văn phòng Safomec, số 7/1 Thành Thái, Phường 14, Quận 10, TpHCM | `office-vietnam-address` |
| +84 28 2250 8332 | `office-vietnam-phone` |
| 〒107-0052 東京都港区赤坂二丁目8番14-504号 | `office-japan-address` |
| 新竹市公道五路二段158號2樓之3、之5（C、D戶）（中壽大樓） | `office-hsinchu-address` |
| +886 3 516 6290 | `office-hsinchu-phone` |
| 台中市南屯區五權西路二段131號7樓 | `office-taichung-address` |
| +886 4 2472 0050 | `office-taichung-phone` |
| 台南市中西區公園路56號5樓A室（窩空間） | `office-tainan-address` |
| +886 6 221 0525 | `office-tainan-phone` |
| 高雄市苓雅區輔仁路155號15樓之1 | `office-kaohsiung-address` |
| +886 7 722 0462 | `office-kaohsiung-phone` |

## https://www.tpisoftware.com/aiso

沒有像事實的段落。

## https://www.tpisoftware.com/chatgpt-enterprise

| 段落 | 狀態 |
|---|---|
| Microsoft 365 Copilot | `chatgpt-enterprise-comparison` |
| 從新人訓練、主管培訓到 AI 種子教練認證，協助企業建立 AI 應用發展。 | `chatgpt-enterprise-training` |
| 依企業需求而定，一般約需4-6個月，導入後流程：治理對焦、系統設定與帳號開通、顧問導入與流程落地。 | `chatgpt-enterprise-4-6-months` |
| ChatGPT Enterprise 偏向企業 AI 平台，可跨部門使用並整合各種系統，而 Microsoft 365 Copilot 主要強化 Word、Excel、PowerPoint 等 Microsoft 365 工作流程、Gemini 則多與 Google Workspace整合，作為文件與協作工具的 AI 助理。 | `chatgpt-enterprise-comparison` |
| 與昕力資訊預約免費 30 分鐘諮詢，我們將評估企業需求並提供導入建議。 | `chatgpt-enterprise-free-consultation` |
| 與昕力資訊預約免費 30 分鐘諮詢 我們將評估企業需求並提供導入建議 | `chatgpt-enterprise-free-consultation` |

## https://www.tpisoftware.com/cloudservice

| 段落 | 狀態 |
|---|---|
| 科技進展與經濟的變遷，無論您是金融、製造抑或科技業，沒有一個產業可以忽視數位轉型的必要，我們掌握並熟悉地、雲開發技術，能夠為企業客戶提供高彈性、高效益、高安全性的雲端服務。透過為您的組織進行部署策略、系統整合、上雲顧問，讓企業未來擁有更好的應變力。 | `cloud-services-scope` |
| 優化客戶體驗 加速創新打造新商模 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| DigiLism 完善企業雲端服務中台及數據交換中台，以微服務與 PaaS 架構為企業導入 API 管理、BPM 流程管理、集中 Log 管理、FIDO認證等，提供快速、彈性、可擴充性之服務，並能進一步整合 CI/CD 流程，強化企業雲端服務能力與市場競爭力。 | `cloud-digilism` |
| 針對各國對於監管法規的不同，以雲端 BNPL 因應全球在地化效益加倍，我們分析各國特色，採用低耦合系統架構設計使系統具備高可用性，符合開放銀行法規標準，在安全合規的基礎上協助企業上雲，快速擴展數位金融海內外業務拓展、搶攻市場。 | `cloud-bnpl` |
| 雲端服務加值 保險商品走向電商化 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| InsureBrick 為領先業界的保險數位平台解決方案，以雲端技術與微服務模組加乘，串接客戶既有系統或外部系統，有效解決傳統保險公司數位化的痛點，且可依不同需求靈活組合，無限延展出創新應用，符合保險商品需快速更迭的趨勢。 | `cloud-insurebrick` |
| PMD&360績效管理系統 | `cloud-case-pmd360-title` |
| 整合集團旗下8間公司績效評核系統，透過部分資料上雲，且在無需考慮 IT 基礎架構之下，改善跨系統資料未同步問題，可加速數據分析，節省時間、儲存空間及提升系統效率。 | `cloud-case-pmd360` |

## https://www.tpisoftware.com/esg-advisory

| 段落 | 狀態 |
|---|---|
| 3年內需完成 ESG 評鑑與數位化 您的企業準備好了嗎？ | `esg-3-years` |
| 2023~2024 | 略過：時間軸的年份頁籤，內容見各年份的事實 |
| 2023 年通過《氣候變遷因應法》和金管會發布《上市櫃公司永續發展行動方案》等相關法政 | `esg-regulation-2023` |
| 2024 年開放國內碳權交易，資本額百億元的上市櫃公司為第一波碳盤查對象 | `esg-regulation-2024` |
| 2025~2027 | 略過：時間軸的年份頁籤，內容見各年份的事實 |
| 2025 年國內碳費開徵且企業需編制永續報告書 | `esg-regulation-2025-carbon-fee` |
| 2025 年資本額50~100億的上市櫃公司為第二波碳盤查對象 | `esg-regulation-2025-second-wave` |
| 2027 年全體上市櫃公司完成溫室氣體盤查 | `esg-regulation-2027` |
| 2030~2050 | 略過：時間軸的年份頁籤，內容見各年份的事實 |
| ✔︎ 2030 年達成台灣減碳24%±1目標 | `esg-regulation-2030` |
| ✔︎ 2050 年實現淨零轉型計畫 | `esg-regulation-2050` |
| 華法國際有限公司 客戶服務處 | `esg-consultant-lai-jungu` |
| 以台灣 2050 淨零排放路徑及策略為主軸，整合企業資源進行內部人員 ESG 培訓和外部溝通，擬定數據搜集與佐證策略，督導企業建置數據平台。 | `esg-advisory-net-zero-strategy` |
| 透過獨家 GreenSwift 永續管理平台，輔導您依照 ISO 14064-1 標準進行碳盤查，建立有效的碳數據監控機制，並撰寫盤查清冊與公開報告書。 | `esg-advisory-iso14064` |
| 昕力資訊提供企業安全、合規、彈性且靈活的一站式資料收集與分析平台，開發團隊全面通過專業永續人才培訓，並成功取得國際 ISO 證書。視覺化熱點分析，為企業後續資訊揭露、熱點分析、減碳實踐及碳權交易做好準備。 | `esg-advisory-team-iso` |
| Q1：為什麼要做 ESG？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| 因應國際減碳協議與國內淨零政策，ESG 不再只是口號，而是可透過數據評估企業績效的方式。重視 ESG 概念有助於提升企業形象與投資評比，碳盤查流程為ESG重要的第一步，為了降低出口成本風險、分析管理與改善計畫和掌握內部資訊以控管成本與風險，透過全面的ESG整合，企業將能夠更具競爭力地應對日益嚴峻的環境挑戰，並在可持續發展的道路上取得長遠成功。 | 略過：核心價值、產業背景或概念說明的敘述，沒有昕力可查證的事實 |
| Q2：誰需要做 ESG ? | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| A：隨著金管會發布「上市櫃公司永續發展路徑圖」，明確企業溫室氣體盤查資訊揭露的時程。第一階段針對資本額百億元的上市櫃公司、鋼鐵、水泥和金融業進行盤查，並於 2024 年完成查驗。未來所有企業須於 2029 年完成查驗，並公開經過驗證的盤查結果。 | `esg-regulation-roadmap` |
| Q3：何時開始做 ESG？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| Q4：怎麼做 ESG ? | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| Q5：昕力顧問團隊可以為您做什麼？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| Q6：昕力永續顧問與眾不同之處？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| Q7：碳盤查怎麼做？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| Q8：永續報告書怎麼寫？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| A：撰寫永續報告書必須依照 GRI、SASB 和 TCFD 3 種國際通用準則之規範與架構來編寫。我們的顧問團隊可以協助您完成報告書之撰寫，若您有相關需求，歡迎與我們聯繫。 | `esg-advisory-report-standards` |

## https://www.tpisoftware.com/esg-advisory/chen-zhengrui

| 段落 | 狀態 |
|---|---|
| TAISE台灣企業永續獎見習評審 | `esg-consultant-chen-zhengrui-experience` |
| ISO 14064-1:2018內稽人員授課講師 | `esg-consultant-chen-zhengrui-experience` |
| ISO 14067:2018內稽人員授課講師 | `esg-consultant-chen-zhengrui-experience` |
| 勞動部產業人才投資計畫政策性產業ISO14064-1、ISO14067、ISO14068、零碳建築學士學分班授課師資 | `esg-consultant-chen-zhengrui-experience` |
| CQI/IRCA ISO 14001 環境管理主任稽核員 | `esg-consultant-chen-zhengrui-certifications` |
| CQI&IRCA ISO 50001能源管理系統主任稽核員 | `esg-consultant-chen-zhengrui-certifications` |
| ISO 14064-1:2018 溫室氣體盤查標準主導查證員 | `esg-consultant-chen-zhengrui-certifications` |
| ISO 14064-2:2018 溫室氣體盤查標準主導查證員 | `esg-consultant-chen-zhengrui-certifications` |
| ISO 14067:2018 產品碳足跡標準主導查證員 | `esg-consultant-chen-zhengrui-certifications` |
| ISO 14068:2023 碳中和標準主導查證員 | `esg-consultant-chen-zhengrui-certifications` |

## https://www.tpisoftware.com/esg-advisory/chuang-binyuan

| 段落 | 狀態 |
|---|---|
| TAISE台灣企業永續獎見習評審 | `esg-consultant-chuang-binyuan-experience` |
| ISO 14064-1:2018內稽人員授課講師 | `esg-consultant-chuang-binyuan-experience` |
| ISO 14067:2018內稽人員授課講師 | `esg-consultant-chuang-binyuan-experience` |
| 勞動部產業人才投資計畫政策性產業ISO14064-1、ISO14067、ISO14068、零碳建築學士學分班授課師資 | `esg-consultant-chuang-binyuan-experience` |
| ISO 14064-1:2018 溫室氣體盤查標準主導查證員 | `esg-consultant-chuang-binyuan-certifications` |
| ISO 14064-2:2018 溫室氣體盤查標準主導查證員 | `esg-consultant-chuang-binyuan-certifications` |
| ISO 14067:2018 產品碳足跡標準主導查證員 | `esg-consultant-chuang-binyuan-certifications` |

## https://www.tpisoftware.com/esg-advisory/huang-weineng

| 段落 | 狀態 |
|---|---|
| 經濟部創新育成中心-國立高雄第一科技大學 專案經理 | `esg-consultant-huang-weineng-experience` |
| TUV NORD ISO 14067 產品碳足跡內稽人員授課講師 | `esg-consultant-huang-weineng-experience` |
| ISO 14001 環境管理主任稽核員認證 | `esg-consultant-huang-weineng-certifications` |
| ISO 27001 資訊安全認證 | `esg-consultant-huang-weineng-certifications` |
| ISO 27701 隱私資訊安全認證 | `esg-consultant-huang-weineng-certifications` |

## https://www.tpisoftware.com/esg-advisory/huang-weisheng

| 段落 | 狀態 |
|---|---|
| 政府研發補助計畫審查委員 | `esg-consultant-huang-weisheng-experience` |
| 第一科技技術有限公司總經理、技術長 | `esg-consultant-huang-weisheng-experience` |
| 國立高雄第一科技大學工程科技研究所博士 | `esg-consultant-huang-weisheng-education` |

## https://www.tpisoftware.com/esg-advisory/li-shuhui

| 段落 | 狀態 |
|---|---|
| ISO 14064-1:2018 溫室氣體盤查標準主導查證員 | `esg-consultant-li-shuhui-certifications` |
| ISO 14067:2018 產品碳足跡標準主導查證員 | `esg-consultant-li-shuhui-certifications` |

## https://www.tpisoftware.com/esg-advisory/yang-zhengrong

| 段落 | 狀態 |
|---|---|
| TUV NORD ISO 14067 碳產品足跡內部查證員訓練班講師 | `esg-consultant-yang-zhengrong-experience` |
| ISO 14064-1 主任稽核證明 | `esg-consultant-yang-zhengrong-certifications` |
| ISO 45001 主任稽查證明 (CQI / IRCA) | `esg-consultant-yang-zhengrong-certifications` |

## https://www.tpisoftware.com/esg-advisory/ye-jiamao

| 段落 | 狀態 |
|---|---|
| ISO 27001主導稽核員 | `esg-consultant-ye-jiamao-certifications` |
| ISO 14064-1主任稽核員 | `esg-consultant-ye-jiamao-certifications` |
| ISO 14064-2內部查證員 | `esg-consultant-ye-jiamao-certifications` |
| ISO 14067主任查證員 | `esg-consultant-ye-jiamao-certifications` |

## https://www.tpisoftware.com/esg-advisory/zhao-boyuan

| 段落 | 狀態 |
|---|---|
| 第一資通科技股份有限公司專案經理 | `esg-consultant-zhao-boyuan-experience` |
| TUV-NORD, ISO27001:2013 Lead Auditor Training course | `esg-consultant-zhao-boyuan-certifications` |
| TUV-NORD, ISO27701:2019 PIMS Lead Auditor Training course | `esg-consultant-zhao-boyuan-certifications` |
| TUV-NORD, 14064-1:2018 Lead Verifier Training Course | `esg-consultant-zhao-boyuan-certifications` |

## https://www.tpisoftware.com/genai-solution

| 段落 | 狀態 |
|---|---|
| 讓 AI 訓練師事半功倍 以 2 成力氣達成高效訓練 | `genai-solution-20-percent-effort` |
| 透過 AI 大腦學習增強，減少 60% 訓練團隊人力。 | `genai-solution-60-percent` |

## https://www.tpisoftware.com/orient-aI

| 段落 | 狀態 |
|---|---|
| 40-60% | `orientai-benefits`（他頁） |
| 20-30% | `esgswift-power-cost` `orientai-benefits`（他頁） |
| 1-5人團隊 | `orientai-hardware-small`（他頁） |
| 5人以上 跨部門應用 | `orientai-hardware-large`（他頁） |

## https://www.tpisoftware.com/orient-ai

| 段落 | 狀態 |
|---|---|
| 40-60% | `orientai-benefits` |
| 20-30% | `orientai-benefits` |
| 1-5人團隊 | `orientai-hardware-small` |
| 5人以上 跨部門應用 | `orientai-hardware-large` |

## https://www.tpisoftware.com/outsourcing

| 段落 | 狀態 |
|---|---|
| 我們的技術領域與客戶 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 「透過昕力的最佳技術與完整客戶體驗的合作，我們獲得了相當好的成果！」 | `testimonial-cathay-fhc-excerpt` |
| ⏤ 國泰金控數數發中心 資深副總 姚旭杰 | `client-cathay-fhc`（他頁） |
| 昕力資訊擁有業界最頂尖的軟體研發團隊，公司成立多年來服務的客戶遍及海內外，屢獲客戶好評與肯定，其中不乏大型企業集團，產業橫跨金融、保險、科技業、醫療、交通以及政府單位等，累積的卓越技術實力與豐厚產業經驗能夠快速回應與解決客戶遇到的開發瓶頸、有效幫助客戶縮短開發時程，以達成客戶設定的成果目標，我們服務的內容包含：各類企業級客製化軟體與解決方案、企業網站建置、行動App開發、系統整合…等等。 | `outsourcing-industries` `outsourcing-scope` |
| 常駐客戶端溝通無礙 | `outsourcing-benefits` |
| 資料庫： Oracle, MySQL, MSSQL, PostgreSQL, NoSQL (MongoDB, Neo4j, Elasticsearch) | `outsourcing-tech-database` |
| 開放銀行 | `outsourcing-domains` |
| 保險3-in-1規則引擎 | `outsourcing-domains` |
| 國泰金控 | `testimonial-cathay-fhc-speaker` `client-cathay-fhc`（他頁） |
| 渣打銀行 | `client-standard-chartered`（他頁） |
| 星展銀行 | `client-dbs-bank` |
| 澳盛銀行 | `client-anz-short` |
| 法國巴黎人壽 | `client-bnp-paribas-cardif`（他頁） |
| 富邦人壽 | `client-fubon-life` `insurebrick-case-fubon-life`（他頁） |
| 台北市政府 | `client-taipei-city-alt` |
| 英國保誠人壽 | `client-prudential-uk` `client-prudential-uk-short`（他頁） |

## https://www.tpisoftware.com/partners

沒有像事實的段落。

## https://www.tpisoftware.com/products

| 段落 | 狀態 |
|---|---|
| 市面唯一整合人、文件、流程，彈性自動化企業作業，提升協作效率與流程彈性 | `digiflexis-claim-only` |
| 採用仿人化設計的智能客服，7x24 即時互動，有效提高服務完成率與客戶滿意度 | `systalk-chat-7x24` |
| 整合碳排數據鏈，一站式完成盤查、認證與報告，協助企業達成 ESG 目標 | `greenswift-one-stop` |
| 可跨平台使用、簡化並提升登入體驗，符合國際 FIDO 資安認證標準，保障身份安全 | `gadodido-fido-standard` |

## https://www.tpisoftware.com/products/digicare

| 段落 | 狀態 |
|---|---|
| 醫院轉型最常卡在兩件事：行政過載、資料不通。昕力資訊以「臺灣醫療資訊標準大平台」的標準為基礎，採 HL7 FHIR 作為核心架構，協助醫院把分散在 HIS、LIS、PACS、EMR 的資料整理成可互通的標準格式，讓照護流程真正以病人為中心。 | `digicare-fhir-core` |
| 跟上政府推動的 FHIR 與 醫療 AI 治理方向 | `orientai-governance`（他頁） |
| 醫院需符合政府推動電子病歷標準化的規範，並接軌國際醫學資料標準 FHIR規範趨勢 | `digicare-ehr-standard` |
| 護理師照顧病人已經很忙，每班結束前還要花 1~2 小時「補寫」護理紀錄 | `digicare-nursing-burden` |
| 360度醫囑紀錄 | `digicare-modules` |
| 協助台灣台中榮總、成大醫院、萬芳醫院等醫療院所，除醫學中心外，也協助區域醫院或地區醫院建置 FHIR 標準平台於院內實際上線應用 | `client-taichung-vgh` `client-ncku-hospital` `client-wanfang-hospital` `digicare-hospitals` |
| 與社團法人台北醫療聯盟協會和國立空中大學，跨產官學醫合作備忘錄簽署，以AI技術為核心的長照 3.0 人才培育與場域實證合作 | `digicare-mou-long-term-care` |
| Q：FHIR 是什麼？（HL7 FHIR／醫療資料交換標準） | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| A：FHIR 是 HL7 制定的醫療資料交換標準，目標是讓不同系統用一致的資料模型與介面交換資料。台灣也有對應的在地實作指引（TW Core IG）協助落地。 | `digicare-fhir-definition` |
| Q：360 度醫囑紀錄怎麼做到一眼看全貌？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |

## https://www.tpisoftware.com/products/digiflexis

| 段落 | 狀態 |
|---|---|
| 自2020年以來，在混合辦公、居家辦公等多元工作模式下，衍生出各式工作情境與需求，例如：數位簽核、線上文件審核機制等，這顯示企業亟需轉型與升級，為內部組織打造順暢的工作流程是未來企業整體發展中不可或缺的基礎。尤其在因應法規與稽核變動時，企業需要能夠快速調整內部流程，以符合相關規範，這不僅能減少企業的開發成本，還能縮短上線時間。此外，藉由舊有的內部流程再造，企業可以達到增強動能、加速效率等目的。 | 略過：核心價值、產業背景或概念說明的敘述，沒有昕力可查證的事實 |
| digiFlexis 為輕量化流程管理平台，遵循世界標準 BPMN 2.0 規範，並透過開放式API整合，可彈性擴展系統延展性，支援各種進階流程與應用，滿足企業高彈性客製需求。 | `digiflexis-bpmn` |
| 服務客戶 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |

## https://www.tpisoftware.com/products/digilism

| 段落 | 狀態 |
|---|---|
| 兼具高度擴充、延展能耐的應用整合服務平台 （iPaaS），可在雲端、地端及地雲混和環境中佈署， 適於金融、保險及各領域應用。 | `digilism-ipaas` |
| 具備專利技術的背景服務運算處理，支援處理瞬間大量的數據或請求，達到零阻塞式運行。 | `digilism-patent-background-processing` |
| 專利技術的運算資源調度機制、靈活調配，,以提高資訊系統可用性。 | `digilism-patent-resource-scheduling` |
| 自適應負載平衡機制及紅黑佈署策略的專利技術，確保100% 符合服務水平協議（SLA）。 | `digilism-patent-sla` |
| DigiLism 以 K8S 滿足系統高可用性，直接實踐微服務架構的 BFF （Backend for Frontend），並以自有自動擴容 （Auto-scaling）研發專利技術，讓系統具備佈署彈性。 | `digilism-microservice-framework` |
| 記錄分散於各系統或 AP 的所有日誌，透過集中控管、即時監控告警，提供第一線 IT 人員精確即時查找、分析系統問題來源，進一步快速排除故障，高效且安全的運用數位軌跡。 | `digilism-log-audit` |
| 以微服務架構的 DigiLism 專門協助處理核心銀行系統或過時大型機的資料轉換及通訊機制變更，可代替企業服務匯流排（ESB），以確保系統的高可用性和可靠性。 | `digilism-protocol-integration` |
| 100 % SLA | `digilism-sla-100` |
| 智慧快取、負載平衡、平行處理、容器延展四大原生內建機制，可確保每個 API、服務、通道和佈署皆擁有優異效能，讓系統服務穩定、運行不中斷，從而實現 100％ 的服務水平協定 （SLA）。 | `digilism-sla-100` |
| 隨著時代更迭，銀行、保險產業現階段都遇到新舊服務串接、系統更新等問題，DigiLism 作為整合中台，妥善解決一切，得以彈性建立、管理及介接。 | 略過：核心價值、產業背景或概念說明的敘述，沒有昕力可查證的事實 |
| 以業界唯一鏈路追蹤技術集中管理系統日誌，整合可視化拓樸、EDR、RCA 與智慧告警，協助企業即時除錯、高效維運。 | `digilism-family-digilogs` |
| 將 MongoDB 社群版升級至商用等級，提供效能監控、告警與備份還原，降低資料庫管理成本，並附 7×24 技術支援。 | `digilism-family-digimars` |
| 以 HL7 FHIR 為核心架構，將異質系統的分散資料整併為可互通的標準格式，實現跨系統、跨院交換，並遵循衛福部 FHIR 實作指引。 | `digilism-family-digicare` |

## https://www.tpisoftware.com/products/digilogs

| 段落 | 狀態 |
|---|---|
| 業界唯一主動識別科技 2分鐘定位問題 | `digilogs-claim-2-minutes` |
| 2分鐘除錯 高效復歸 | `digilogs-rca-2-minutes` |
| digiLogs 集中化日誌管理平台，支援超過 55 種系統資料格式的無差別蒐集，提供解析邏輯、日誌資料萃取保存，以及多元的查詢機制—全文檢索、關鍵字查詢、和鏈路式關聯查詢。配合視覺化報表與數位儀表板，不僅確保企業日誌完整無遺，同時也提升IT維運效率、維持企業營運不中斷。 | `digilogs-55-formats` |
| 支援 10,000 EPS，整合多條件的複合告警設定。 | `digilogs-10000-eps` |
| ISO 27001合規的 關鍵武器！ | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 在日誌收集、傳輸的過程中，透過 SSL / mTLS、RSA 加密技術及私鑰解密驗證等機制，達到資料的來源不可否認性與資料完整性，不僅使系統具備可擴展性、高可用性，還確保了異常狀況下的災難復原能力，從而大幅提升資訊安全性，助力企業進一步通過 ISO 27001 稽核。 | `digilogs-iso27001-encryption` `digilogs-iso27001-audit` |
| 我們協助企業面對多樣化的系統日誌挑戰，從前期的系統評估到後期的專案優化，我們堅持在每一個環節為客戶提供卓越與專業的後援。 | 略過：核心價值、產業背景或概念說明的敘述，沒有昕力可查證的事實 |
| digiLogs 協助為某銀行蒐集系統資料，而後進行資料統合、解析及重新定義後於單一平台呈現，並透過交易路徑地圖，以不同權限層級的劃分，當系統發生問題時，快速標記出問題點，同步自動向維運人員提出示警，加快查找問題所在並進行修復。 | `digilogs-case-bank-path-map` |
| 國泰人壽每月約需存取 6 TB 的 logs日誌數據，透過 digiLogs 快速的水平擴展機制（分片），能夠整合多台系統資料運作記錄，進一步整合及分析，並匯入同一平台輕鬆管理大量且每日增長的數據資料。 | `digilogs-case-cathay-life` |
| 網路銀行日誌管理 | `digilogs-case-online-banking-title` |
| 銀行端系統客戶單日日誌收集數據量多達 50 GB（每月約1.5 TB），舊有系統維運能力有限且難應對日趨複雜的管理需求。導入昕力自有研發產品「 digiLogs 」後，因其單一介面跨平台 log 查詢、流量監控、視覺化報表統計、即時告警等特點，管理效率大增。 | `digilogs-case-online-banking` |

## https://www.tpisoftware.com/products/digilogs/iso27001logging

| 段落 | 狀態 |
|---|---|
| ISO27001 日誌存錄 - digiLogs - 昕力資訊TPIsoftware | 略過：頁面的 title，沒有可查證的內容 |
| ISO 27001 稽核 | `digilogs-iso27001-audit`（他頁） |
| 不只強化ICT策略 日誌管理更是您邁向 ISO 27001合規的關鍵武器！ | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 日誌是 ICT 策略的關鍵角色，不僅詳實記錄事件、追蹤軌跡的來龍去脈，更可幫助組織以大局視角進行監控、分析，讓組織可以快速識別和回應潛在威脅，從而大幅提升資訊安全性，以進一步通過 ISO 27001 稽核。擁有可視式化、易於使用的日誌管理系統是企業組織維護系統安全不可或缺的利器。 | 略過：核心價值、產業背景或概念說明的敘述，沒有昕力可查證的事實 |
| 1日支援 | `digilogs-10-million-logs-a-day` |
| 1000 | `digilogs-10-million-logs-a-day` |
| 1次監管 | `digilogs-100-servers` |
| 以每秒處理 10,000 事件數的優質效能，集中管理日誌資料滿足大量監控需求，因應稽查所需，不須逐台登入蒐集稽核資訊，大幅縮短時程，提高效率。 | `digilogs-10000-events-per-second` |
| 1站控管 | `digilogs-access-control` |
| 可視化系統地圖一眼看穿問題所在 2分鐘除錯 迅速解決問題！ | `digilogs-iso-2-minutes` |
| 遵循 ISO 27001:2022 A.8.15 日誌存錄(控制) | `digilogs-iso27001-a815` |
| digiLogs 以單一瀏覽器即可管理企業的大量日誌資料，強大的主動偵錯(EDR)及根因分析(RCA)，迅速地提升系統效能並確定問題之源。同時支援超過55種以上資料來源格式，並提供全文檢索、關鍵字和路徑式關聯查詢，強化了IT維運的效率和確保企業營運的連續性。其視覺化的報表和數位儀表板，使日誌管理更為完善且具彈性。 | `digilogs-55-sources-edr-rca` |

## https://www.tpisoftware.com/products/digilogs/log-detection

沒有像事實的段落。

## https://www.tpisoftware.com/products/digimars

| 段落 | 狀態 |
|---|---|
| 讓企業用戶的 MongoDB 社群版達到商用管理等級，且提供全天候7*24的 技術支援服務，為商用系統打造最佳 MongoDB 監控、管理及維運平台。 | `digimars-commercial-grade` |
| RedHat Linux v7 | `digimars-os-support` |
| RedHat Linux v8 | `digimars-os-support` |
| (支援至 MongoDB 6.0) | `digimars-os-support` |
| 深受企業客戶讚譽、信賴 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| MongoDB 是市佔第一的 NoSQL 資料庫 | `digimars-mongodb-market-share` |
| 彈性的資料結構、分散式水平擴充能力及高可用性、跨區域部署之三大特點，讓企業用戶在大量或非結構化資料的儲存與管理，如圖檔管理、內容管理、Log 管理、客戶資料管理(貼標) 等情境，適合以 MongoDB 作為您的資料儲存解決方案，透過資料遷移至 NoSQL 資料庫存放，有效提升系統效率並降低 RDBMS 授權成本。 | `digimars-mongodb-use-cases` |
| 內建 50 多個常用監控指標，自動顯示適合閱覽的圖表。 | `digimars-50-metrics` |
| 7 x 24 全天候技術支援 為企業管理把關 | `digimars-support-7x24` |
| 一站式的流程服務及技術支援，確保企業客戶在使用社群版 MongoDB 時無後顧之憂，滿足了 IT 管理人員在使用 MongoDB 時的全方位管理需求。 | `digimars-one-stop-service` |
| 原系統每日超過 4000 萬筆 CDR 通話紀錄，採用傳統 RDB 資料庫，無法有效進行資料處理與彙整，且耗費過多時間與人力監控龐大資料庫，每年需負擔高額 RDB(Oracle) 授權成本，改用 MongoDB Cluster 機制後，資料處理效能提高 5 倍，監控機制採用 digiMars 自動即時監控，優化管理效率。 | `digimars-case-cdr` |
| 原採用傳統 RDB 資料庫，每日需處理海量的保險契約，資料庫不僅需即時同步，更需被安全地儲存。國泰人壽選擇 digiMars 來管理超過 20 台 MongoDB 伺服器，及進行高達 100 TB 的數據備份和監控，顯著提高了 MongoDB 監控效率，成功達到資料庫安全需求，贏得了客戶的信任。 | `digimars-case-cathay-life` |

## https://www.tpisoftware.com/products/digirunner

| 段落 | 狀態 |
|---|---|
| 30 天免費試用 | `digirunner-trial-30-days` |
| DigiLism 產品系列擁有7項發明專利 | `digilism-patents-7` |
| 通過 ISO27001 資訊安全認證 | `cert-iso27001-digirunner` |
| 內建零信任的 API 存取防護機制，支援 OIDC /OAuth2 等技術標準，具備即時監控與告警，可防止 API 惡意攻擊與資料外洩，有效維持系統服務的安全性。 | `digirunner-zero-trust` |
| 提供完整 API 生命周期管理，更遵循 Open API 規範，支援 OAuth2.0 及 OIDC（OpenID Connect）的安全規範，確保與國際標準一致，在擁有管理、分析和部署 API 的安全環境下，以適於開放銀行、政府，及企業跨系統管理應用，為企業實現 API 為核心的 API-First 策略。 | `digirunner-api-lifecycle` |
| 支援地、雲端部署及 K8s 微服務架構 | `digirunner-deployment` |
| 保險產業 | `insurering-rule-engine` `insurering-business-logic`（他頁） |
| 政府機關 | `systalk-chat-solutions` `systalk-rpa-government`（他頁） |
| 全面滿足前端體驗 提升客戶滿意度和互動性 | 略過：digiRunner、InsureRing 各產業頁籤的標語，沒有具體功能或數字 |
| 遵循監管機關稽核 100 % 符合金融檢查規範 | `digirunner-finance-compliance-100` |
| 開放銀行與上雲創新服務 構建金融生態系 | 略過：digiRunner、InsureRing 各產業頁籤的標語，沒有具體功能或數字 |
| 一站整合 驅動保險數位轉型 | 略過：digiRunner、InsureRing 各產業頁籤的標語，沒有具體功能或數字 |
| 全通路擴展 擴大保險產品覆蓋範圍 | 略過：digiRunner、InsureRing 各產業頁籤的標語，沒有具體功能或數字 |
| 加快保險商品上架流程及管理效率 | 略過：digiRunner、InsureRing 各產業頁籤的標語，沒有具體功能或數字 |
| 全面遵循主管機關監管 100 % 合規金融檢查 | `digirunner-insurance-compliance-100` |
| 內外通達 實現政府數位治理 | 略過：digiRunner、InsureRing 各產業頁籤的標語，沒有具體功能或數字 |
| 達到跨平台資訊交換 加速落實政府資料開放 | 略過：digiRunner、InsureRing 各產業頁籤的標語，沒有具體功能或數字 |
| 提升企業、公眾與政府三方之溝通效率 | 略過：digiRunner、InsureRing 各產業頁籤的標語，沒有具體功能或數字 |
| 政府服務個人化、民眾資料自主運用 | 略過：digiRunner、InsureRing 各產業頁籤的標語，沒有具體功能或數字 |
| 多元認證與授權 成為安全之數位政府服務 | 略過：digiRunner、InsureRing 各產業頁籤的標語，沒有具體功能或數字 |
| 符合政府資安規範 保障公眾資料安全 | 略過：digiRunner、InsureRing 各產業頁籤的標語，沒有具體功能或數字 |
| digiRunner 支援 OAuth 2.0 認證、OIDC (OpenID Connect) 與 API Key 授權方式，資安機制包含 mTLS 憑證安全、 JWT 金鑰加密，提供企業對外 Domain URL 設定、支援硬體加密模組 (HSM) 介接。 | `digirunner-security` |
| 國內唯一符合遵循金管會法令 | `digirunner-claim-fsc-only` |
| API Key 識別認證 | `digirunner-financial-inspection` |
| 採用 OAuth 2.0 | `digirunner-financial-inspection` |
| 深受企業客戶讚譽、信賴 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 與台新銀行合作，以 digiRunner 模組開發 API 管理平台，整合複雜的現金管理業務模組，讓企業客戶在整合多元通路的收付款作業更為便利，帳務處理更輕鬆。該平台獲全球金融雜誌 (Global Finance)頒發「The Innovators 2020 Cash Management」獎。 | `digirunner-case-taishin` `award-global-finance-2020` |
| 為臺北市政府建置符合統一標準的API管理平台，使各機關的異質應用系統資料介接，讓市府推動資料開放政策，拓展創新應用之可行性，極大化開放資料加值應用與民眾參與公共政策。此外，昕力顧問團隊更協助市府建立API管理制度，並輔導各級機關一一導入上線。 | `digirunner-case-taipei-city` |
| API管理（APIM）平台如何打造開放銀行，落地共享金融 | 略過：部落格文章連結的標題 |

## https://www.tpisoftware.com/products/digirunner-cloud

| 段落 | 狀態 |
|---|---|
| 在我們支持的雲平台中選擇最適合您的環境，點擊“開始免費使用”，即可立即體驗 30天 digiRunner Cloud 的強大功能。 | `digirunner-cloud-trial` |
| 0.49 | `digirunner-cloud-price-hourly`（他頁） |
| 3,999 | `digirunner-cloud-price-annual`（他頁） |
| < 50 million | `digirunner-cloud-api-calls`（他頁） |
| 500GB | `digirunner-cloud-throughput`（他頁） |
| 0.29 | `digirunner-cloud-price-hourly`（他頁） |
| 2,499 | `digirunner-cloud-price-annual`（他頁） |
| > 50 million | `digirunner-cloud-api-calls`（他頁） |
| > 500GB | `digirunner-cloud-throughput`（他頁） |
| 0.59 | `digirunner-cloud-price-hourly`（他頁） |
| 4,999 | `digirunner-cloud-price-annual`（他頁） |
| 0.35 | `digirunner-cloud-price-hourly`（他頁） |
| 2,999 | `digirunner-cloud-price-annual`（他頁） |
| 數據將以 RDB 格式保存在 Redis 資料庫。資料庫可根據客戶需求進行配置。 我們的金融產業合作夥伴多採用具高可用性的 Active/Standby 架構。若預算較高，可結合 Active/Active 架構與災難恢復，或採 Active/Active/Standby 三模式架構，以便能在故障發生後快速備份及復原。 | `digirunner-redis-storage`（他頁） |
| digiRunner 內建專利認證的獨家智慧快取技術（Smart Caching），可依據 API 負載情形動態式儲存多個節點的數據。 | `digirunner-smart-caching-patent`（他頁） |
| 安裝，免費試用 30 天。 | `digirunner-aws-regions`（他頁） |
| 每秒交易量（Transactions Per Second）係指系統每秒能處理的交易數量。 常規 2 Core CPU / 4GB RAM 的 digiRunner 已足以應付企業一般用量。我們建議採用 4 Core CPU / 8GB RAM 的型號，每秒交易量的效能可達 300-1000 TPS。實際每秒交易量取決於不同環境的配置。 | `digirunner-tps`（他頁） |
| digiRunner 透過 Nginx 將流量分配到各個伺服器端點，以確保 API 服務的穩定性。此外，也可整合現有的 WAF 廠商，如 F5 或 No Name Security。 | `digirunner-nginx-waf`（他頁） |
| digiRunner 支援 OAuth 2.0、API Key、X API Key、白名單（Whitelist）與 HTTP 基本認證。為確保數據完整性和保密性，可選擇使用 JWT 標準（RFC-7519）的JWS (RFC-7515) 或 JWE (RFC-7516) 對數據進行加密或解密。 | `digirunner-auth-methods`（他頁） |
| digiRunner 可否達到 99.9% 的正常運行時間？ | `digirunner-uptime-999` |
| 針對系統的高可用性，digiRunner 能否支援 5 個以上的 Pod？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| 能支援，但目前在 AWS Marketplace 上，我們設了一項 5 個 Pod 的限制。如您有意洽談需求，請主動聯繫我們。 | `digirunner-aws-pod-limit` |
| Amazon EC2 | `digirunner-cloud-infrastructure`（他頁） |

## https://www.tpisoftware.com/products/digirunner/awsmarketplace

| 段落 | 狀態 |
|---|---|
| digiRunner AWS 認證雲原生 API 管理平台 - 昕力資訊TPIsoftware | `cert-digirunner-aws` |
| 雲上啟動 20分鐘無縫整合 | `digirunner-cloud-20-minutes` |
| AWS 認證雲原生 API 管理平台 | `cert-digirunner-aws` |
| 完整功能30天 無需任何費用 | `digirunner-cloud-trial-full` |
| < 50 million | `digirunner-cloud-api-calls` |
| > 50 million | `digirunner-cloud-api-calls` |
| 500GB | `digirunner-cloud-throughput` |
| > 500GB | `digirunner-cloud-throughput` |
| 0.49 USD / pod | `digirunner-cloud-price-hourly` |
| 0.29 USD / pod | `digirunner-cloud-price-hourly` |
| 0.59 USD / pod | `digirunner-cloud-price-hourly` |
| 0.35 USD / pod | `digirunner-cloud-price-hourly` |
| 3,999 USD / pod | `digirunner-cloud-price-annual` |
| 2,499 USD / pod | `digirunner-cloud-price-annual` |
| 4,999 USD / pod | `digirunner-cloud-price-annual` |
| 2,999 USD / pod | `digirunner-cloud-price-annual` |
| Q1：如果兩個 API 伺服器的其中一個發生故障，流量會被導流到另一個伺服器嗎？若使用 digiRunner 上的負載平衡器，是否需要手動操作才能重新配置？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| Q2：數據儲存在哪裡？方式為何？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| A：數據將以 RDB 格式保存在 Redis 資料庫。資料庫可根據客戶需求進行配置。 我們的金融產業合作夥伴多採用具高可用性的 Active/Standby 架構。若預算較高，可結合 Active/Active 架構與災難恢復，或採 Active/Active/Standby 三模式架構，以便能在故障發生後快速備份及復原。 | `digirunner-redis-storage` |
| Q3：digiRunner 有什麼內建快取機制？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| A：digiRunner 內建專利認證的獨家智慧快取技術（Smart Caching），可依據 API 負載情形動態式儲存多個節點的數據。 | `digirunner-smart-caching-patent` |
| Q4：digiRunner 在哪些區域或網站？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| 安裝，免費試用 30 天。 | `digirunner-aws-regions` |
| Q5：每秒交易量（TPS）是什麼？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| A：每秒交易量（Transactions Per Second）係指系統每秒能處理的交易數量。 常規 2 Core CPU / 4GB RAM 的 digiRunner 已足以應付企業一般用量。我們建議採用 4 Core CPU / 8GB RAM 的型號，每秒交易量的效能可達 300-1000 TPS。實際每秒交易量取決於不同環境的配置。 | `digirunner-tps` |
| Q6：digiRunner 是否有內建的負載平衡器或網路應用程式防火牆（Web Application Firewall）？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| A：digiRunner 透過 Nginx 將流量分配到各個伺服器端點，以確保 API 服務的穩定性。此外，也可整合現有的 WAF 廠商，如 F5 或 No Name Security。 | `digirunner-nginx-waf` |
| Q7：digiRunner 具備哪些安全機制？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| A：digiRunner 支援 OAuth 2.0、API Key、X API Key、白名單（Whitelist）與 HTTP 基本認證。為確保數據完整性和保密性，可選擇使用 JWT 標準（RFC-7519）的JWS (RFC-7515) 或 JWE (RFC-7516) 對數據進行加密或解密。 | `digirunner-auth-methods` |
| Q8：digiRunner 可否達到 99.9% 的正常運行時間？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| Q9：針對系統的高可用性，digiRunner 能否支援 5 個以上的 Pod？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| A：能支援，但目前在 AWS Marketplace 上，我們設了一項 5 個 Pod 的限制。如您有意洽談需求，請主動聯繫我們。 | `digirunner-aws-pod-limit`（他頁） |
| Q10：免費試用期間可使用哪些功能？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| Amazon EC2 | `digirunner-cloud-infrastructure` |
| 1.基礎設施價格 | 略過：AWS Marketplace 注意事項的編號標題，內容已另收 |
| 需要 Amazon EC2 或 AWS Fargate。有關詳細的基礎設施成本，請參閱 | `digirunner-cloud-infrastructure` |
| 2.免費試用 | 略過：AWS Marketplace 注意事項的編號標題，內容已另收 |
| 每項產品試用 30 天，試用期間不會收取任何軟體費用，但 AWS仍會收取基礎設施費用。 免費試用期到期後將自動轉換為付費訂閱，並且您將需要支付超出所提供免費單位的額外使用費用。 | `digirunner-cloud-trial-terms` |

## https://www.tpisoftware.com/products/electriswift

| 段落 | 狀態 |
|---|---|
| 建物的內外環境資訊(溫度,濕度,CO2...) | `electriswift-environment-data` |
| 透過 AI 24 小時監控設備運行狀態，建立用電異常告警機制，快速排除障礙降低能源浪費。 | `electriswift-24h-monitoring` |
| 根據「能源管理法」，800 瓩以上的能源用戶需向中央主管機關申報前一年度節電措施執行情形。 立即啟動 AI 智慧節能計畫，自動化盤點用電流向、提升能源效率，建構經濟與環境雙贏的未來。 | `energy-management-act-800kw` |
| 工廠設備的能源管理可分為空調、電力、照明、加熱器、空壓機系統等，其中以空調設備耗能占比最高。透過 AI 智慧能源管理系統可遠端監控，即時掌握設備運行狀態，也可依戶外溫度進行節能控制，並於非上班時間自動進入節電狀態，避免人為忘記關閉導致的浪費，讓廠房 24 小時運行仍達到能源最佳化。 | `electriswift-factory` |
| 碳盤查輔導認證服務 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |

## https://www.tpisoftware.com/products/esgswift

| 段落 | 狀態 |
|---|---|
| ESG國際認證標準 | `esgswift-standards` |
| ISO 14064 溫室氣體排放查證 | `esgswift-standards` |
| ISO 14067 碳足跡查證 CBAM 歐盟碳邊境機制 | `esgswift-standards` |
| 降低 30% 人力成本 | `esgswift-labor-30` |
| 國際認證信任 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 通過 ARES 國際查驗機構 AUP 認證 | `cert-esgswift-ares-aup` |
| 符合 ISO 27001 國際資安標準 | `esgswift-iso27001` |
| 平均節能 15% | `esgswift-energy-saving-15` |
| 節能成效 15-25% 能源效率 | `esgswift-energy-efficiency` |
| 降低 20-30% 電力成本 | `esgswift-power-cost` |
| 協助達成 RE100 綠電轉型 | `esgswift-re100` |
| 依 ISO 14064-1、ISO 14067 標準導入 | `esgswift-consulting-standards` |
| 專業認證 | `esgswift-team-certified` |
| 團隊成員具備國際 ISO 與 ESG 永續專業認證，實戰經驗覆蓋多產業 | `esgswift-team-certified` |

## https://www.tpisoftware.com/products/gadoDIDO

| 段落 | 狀態 |
|---|---|
| 實現零信任身份認證 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| FIDO2 | `gadodido-fido2-uaf` `gadodido-passwordless` `gadodido-mfa` `gadodido-standards` `gadodido-transactions`（他頁） |
| gadoDIDO 為通過 FIDO 認證的身份驗證應用，能強化身份驗證安全,有效防止帳號盜用和釣魚攻擊，而透過生物辨識登入與驗證能簡化登入流程,大幅提升用戶體驗。企業不僅可實現跨平台身份驗證,達到簡化IT管理,同時符合法規要求,為企業數位轉型奠定堅實基礎。 | `gadodido-fido-certified`（他頁） |
| 透過 FIDO 身分鑑別和身分認證以確認使用者身分，減少多組密碼登入、帳號盗用。 | `gadodido-account-takeover`（他頁） |
| FIDO2 無密碼 零信任身分驗證 | `gadodido-passwordless`（他頁） |
| gadoDIDO結合FIDO2和UAF的生物辨識驗證識別與多因子核身流程，協助各產業提供數位服務應用之時， 杜絕網路威脅並大幅降低資料外洩風險。 | `gadodido-mfa`（他頁） |
| 壽險產險業 | `gadodido-industries`（他頁） |
| gadoDIDO 為金融機構提供集團式的統一身分驗證管理，實現虛實整合的無縫體驗。用戶僅需註冊一次，即可在集團內各通路輕鬆驗證身份，享受24小時不間斷的金融服務。 | `gadodido-finance-group`（他頁） |
| 網路銀行/行動銀行 | `gadodido-finance-uses`（他頁） |
| 證券/期貨開戶 | `gadodido-finance-uses`（他頁） |
| gadoDIDO可實現集團統一管控，用戶只需驗證一次，即可使用於集團內所有應用，大幅簡化用戶申辦與投保流程。 | `gadodido-insurance`（他頁） |
| 支援包括FIDO2和UAF，提高解決方案的可擴展性和互通性。 | `gadodido-standards`（他頁） |
| gadoDIDO 運用國際 FIDO 認證的身份認證技術，為企業和用戶構建堅實的安全防線。在日益複雜的網路環境中，不僅保護數據安全，同時實踐數位創新和轉型。 | `gadodido-fido-technology`（他頁） |
| 為 OWASP Top 10 / CWE Top 25 | `gadodido-owasp`（他頁） |
| 有效的雙因子驗證/強認證 | `gadodido-2fa`（他頁） |
| 集團或全行集中授權後台管理 | `gadodido-central-admin`（他頁） |
| 授權認證費用統一管控 -通路與各應用平台成本分攤 | `gadodido-cost-control`（他頁） |
| gadoDIDO結合國際標準FIDO2、UAF，提供用戶在APP與網頁端都能以無密碼方式進行登入及身分驗證進行線上交易，可縮短交易時間並確保每筆交易的安全性。 | `gadodido-transactions`（他頁） |

## https://www.tpisoftware.com/products/gadodido

| 段落 | 狀態 |
|---|---|
| 實現零信任身份認證 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| FIDO2 | `gadodido-fido2-uaf` `gadodido-passwordless` `gadodido-mfa` `gadodido-standards` `gadodido-transactions` |
| gadoDIDO 為通過 FIDO 認證的身份驗證應用，能強化身份驗證安全,有效防止帳號盜用和釣魚攻擊，而透過生物辨識登入與驗證能簡化登入流程,大幅提升用戶體驗。企業不僅可實現跨平台身份驗證,達到簡化IT管理,同時符合法規要求,為企業數位轉型奠定堅實基礎。 | `gadodido-fido-certified` |
| 透過 FIDO 身分鑑別和身分認證以確認使用者身分，減少多組密碼登入、帳號盗用。 | `gadodido-account-takeover` |
| FIDO2 無密碼 零信任身分驗證 | `gadodido-passwordless` |
| gadoDIDO結合FIDO2和UAF的生物辨識驗證識別與多因子核身流程，協助各產業提供數位服務應用之時， 杜絕網路威脅並大幅降低資料外洩風險。 | `gadodido-mfa` |
| 壽險產險業 | `gadodido-industries` |
| gadoDIDO 為金融機構提供集團式的統一身分驗證管理，實現虛實整合的無縫體驗。用戶僅需註冊一次，即可在集團內各通路輕鬆驗證身份，享受24小時不間斷的金融服務。 | `gadodido-finance-group` |
| 網路銀行/行動銀行 | `gadodido-finance-uses` |
| 證券/期貨開戶 | `gadodido-finance-uses` |
| gadoDIDO可實現集團統一管控，用戶只需驗證一次，即可使用於集團內所有應用，大幅簡化用戶申辦與投保流程。 | `gadodido-insurance` |
| 支援包括FIDO2和UAF，提高解決方案的可擴展性和互通性。 | `gadodido-standards` |
| gadoDIDO 運用國際 FIDO 認證的身份認證技術，為企業和用戶構建堅實的安全防線。在日益複雜的網路環境中，不僅保護數據安全，同時實踐數位創新和轉型。 | `gadodido-fido-technology` |
| 為 OWASP Top 10 / CWE Top 25 | `gadodido-owasp` |
| 有效的雙因子驗證/強認證 | `gadodido-2fa` |
| 集團或全行集中授權後台管理 | `gadodido-central-admin` |
| 授權認證費用統一管控 -通路與各應用平台成本分攤 | `gadodido-cost-control` |
| gadoDIDO結合國際標準FIDO2、UAF，提供用戶在APP與網頁端都能以無密碼方式進行登入及身分驗證進行線上交易，可縮短交易時間並確保每筆交易的安全性。 | `gadodido-transactions` |

## https://www.tpisoftware.com/products/gadoscout

| 段落 | 狀態 |
|---|---|
| 24/7全天候監控 | `gadoscout-24-7` |
| 設定層級警報，確保關鍵威脅第一時間被處理 | `gadoscout-tiered-alerts` |
| 業界唯一主動識別科技 2分鐘定位問題 | `digilogs-claim-2-minutes`（他頁） |

## https://www.tpisoftware.com/products/greenswift

| 段落 | 狀態 |
|---|---|
| 通過國際查證機構核發AUP認證 | `cert-greenswift-aup` |
| 系統內建碳排計算公式 ，自動計算完整碳排放量，並可一鍵下載為符合環保署登錄平台之表單格式(3.0.0)，在提交數據同時完成環保署資料蒐集。 | `greenswift-epa-format` |
| 系統內建最新的碳盤查標準和國際係數，可自由切換使用 GHG Protocol 及 ISO 14064-1:2018 標準，並定期更新 IPCC 的最新係數，確保企業合規。 | `greenswift-standards` |
| 支援ISO14064-1標準的碳盤查流程 | `greenswift-carbon-plan` |
| 碳盤查輔導認證服務 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| Q1：組織型碳盤查完成後會獲得哪些資料？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| A：在完成全廠活動數據的收集與計算後，我們將得到年度總排放量，單位為每公噸二氧化碳當量（tCO2e）。此外，我們會整理所有活動數據，形成活動數據總表，並將計算結果以盤查清冊的形式呈現。根據ISO 14064-1:2018規範，我們會在溫室氣體盤查報告中詳細描述數據鑑別、收集過程及計算方法。報告還包括數據品質評分表與不確定性分析等內容。如有查證需求，第三方查證機構將依據這些文件進行審核，最終核發查證聲明書。 | `greenswift-inventory-output` |
| Q2：溫室氣體盤查報告的結果可以用來做什麼？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| Q3：如果系統平台中沒有所需的排放係數，GreenSwift會協助新增至資料庫，還是需要企業客戶自行新增？如果GreenSwift新增，會收取額外費用嗎？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| Q4：系統是否有使用者數量上限？系統是否有組織邊界的上限？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| Q5：GreenSwift 碳盤查平台使用的是雲端還是地端？有提供什麼樣的安全性部分?系統支援哪些語言？系統導入後的培訓和支援是否提供英文服務？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| A：GreenSwift 碳盤查平台採用雲端SaaS服務，基於 Amazon SLA 服務水準之下，GreenSwift保證所提供之雲端服務系統可用性可達到 99% 以上之服務水準。GreenSwift採用零信任架構並且所有研發過程均符合 ISO 27001 安全標準，並遵守相關的隱私和數據保護法規。GreenSwift 僅收集為實現服務功能所必需的數據，避免過度或不相關的數據收集，且客戶有權隨時查詢其個人數據的收集情況，並可通過指定渠道聯繫我們以獲取詳細信息。系統支援繁體中文與英文兩種語言。系統導入後，如有操作上的問題，我們提供英文支援服務。 | `greenswift-sla-99` `greenswift-zero-trust-iso27001` `greenswift-languages` |
| Q6：使用 GreenSwift 碳盤查系統後，企業用戶是否會獲得輔導服務？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| A：GreenSwift 提供操作教學影片，專業的碳盤查輔導則由合作的顧問公司執行。GreenSwift 與多家顧問機構合作，企業客戶可在評估系統時選擇搭配適合的輔導服務。 | `greenswift-consulting-partners` |
| Q7：GreenSwift是否支援多部門和跨廠區的運用？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| Q8：GreenSwift 與市面上常見的碳盤查工具及政府公開小工具有何不同？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| A：GreenSwift 平台不僅用於每年度的申報和報告書生成的功能，針對 ISO 14064-1 標準進行碳盤查的同時，未來還將整合 ISO 14067 和 ISO 14068 等標準，支持集團級別的自主管理及淨零目標實現。GreenSwift 特別強調權責分工、系統主動提醒、數據分析、儀表板設置及減碳計劃自訂，確保各部門能有效協作完成數據收集。此外，平台具備快速切換不同全球暖化潛勢（GWP）的功能，能針對不同情境一鍵轉換，減少顧問公司或組織在處理不同 IPCC 報告（如 AR5 或 AR6）時的重新計算和盤點時間。GreenSwift 還支持靈活的組織分工和角色設定，促進數據彙整和報告產出，滿足多方利害關係人的需求。 | `greenswift-roadmap-iso14067` `greenswift-gwp-switch` |
| Q9：我是顧問公司，可以使用 GreenSwift 作為工具來協助客戶進行溫室氣體盤查嗎？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| A：是的，GreenSwift 支援顧問公司使用。顧問可以登入系統，針對所輔導的客戶進行線上盤點和協助。顧問能夠查看所輔導客戶的所有資料，同一顧問公司內的不同顧問帳號可以根據需要進行分權設定，確保資料的安全與私密性，除非是共同輔導，否則彼此間的資料無法互通。 | `greenswift-consultant-accounts` |
| Q10：GreenSwift 可以與公司現有的 ERP、HR 系統或其他模組進行串接整合嗎？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| A：目前 GreenSwift 主要聚焦於集團式運行和滿足多種利害關係人要求的報告產出。雖然目前不支援直接與 ERP、HR 系統或其他模組的整合，但如果貴公司已經整理好相關資料，可以直接透過 GreenSwift 的介面進行資料匯入並上傳佐證資料，以確保程序的文件化和數據的準確性。 | `greenswift-no-erp-integration` |
| Q11：GreenSwift提供試用嗎? 若試用上有問題如何取得協助? | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| 審核通過後即開始30天試用，試用到期將自動關閉帳號權限。 | `greenswift-trial-30-days` |

## https://www.tpisoftware.com/products/insurebrick

| 段落 | 狀態 |
|---|---|
| InsureBrick 保險科技模組化平台 - 昕力資訊TPIsoftware | 略過：頁面的 title，沒有可查證的內容 |
| 保險科技模組化平台 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 革新保險科技，引領數位轉型 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 創新保險微服務平台 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| InsureBrick是專為產壽險保險公司及保經代公司打造的保險科技平台，我們的系統採用了先進的微服務技術，每個功能都是獨立的模組，專為滿足不同客戶的需求而設計。這種模組化的統一串接格式，為您提供了多項無可比擬的優勢。 | `insurebrick-platform` |
| 業界唯一 | `insurebrick-claim-only` |
| 具備輕量化、碎片化特性的保險模組平台 | `insurebrick-lightweight` |
| 只需購買所需模組，也可串接客戶內外部系統 | `insurebrick-buy-modules` |
| 為保險業提升服務效率加值 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 28個多元且彈性的模組 | `insurebrick-28-modules` |
| 涵蓋核心業務、客戶管理、報表分析等模組。 | `insurebrick-module-scope` |
| 協助保險產業領域完整導入 進一步掌握市場利基 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 純網路保險公司 | `insurebrick-scenarios` |
| 保險電商中台 | `insurebrick-scenarios` |
| 產險中台 | `insurebrick-scenarios` |
| InsureBrick 為純網銀業者以微服務部屬建立網路投保平台，快速串接核心系統，模組化讓資訊功能易於擴充、彈性整合，更便於保險商品之上架，利於整體業務擴展，掌握市場商機。 | `insurebrick-case-online-insurance` |
| 跨平台數位整合富邦人壽的行動投保網頁及App，導入昕力獨家4種系統模組，可彈性調整功能介面、快速上/下架商品。完善檢核機制模組，降低錯誤率及照會率。3分鐘快速成案，整合第三方支付平台，有效提高成交率，提供最速、最佳的保單購買體驗。 | `insurebrick-case-fubon-life` |
| 更多保險科技成功案例 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 服務客戶 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |

## https://www.tpisoftware.com/products/open-banking

| 段落 | 狀態 |
|---|---|
| 開放銀行 Open Bankning - 昕力資訊TPIsoftware | 略過：頁面的 title，沒有可查證的內容 |
| 開放銀行 | `digirunner-open-banking-3-stages` `digirunner-open-banking-fsc` `digirunner-open-banking-consulting` |
| 在銀行客戶（消費者）的同意下，將資料開放給第三方平台（Third-Party Service Provider, TSP）使用，以開放應用程式介面（OpenAPI）共享相關數據資料，為客戶提供更多元及便利的服務。 | 略過：核心價值、產業背景或概念說明的敘述，沒有昕力可查證的事實 |
| 什麼是開放銀行 (Open Banking)？ | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| Open Banking 起源於 2015 年歐盟的 The Revised Payment Services Directive (PSD2)，隔年（2016）八月，由英國率先要求其國內九家大型銀行要採用，並於 2018 年強制導入，之後各國政府如美國、澳洲、新加坡也紛紛定相關法令，鼓勵銀行加入 Open Banking 的行列。而這股風潮也從歐洲吹向台灣，2019 年，台灣金管會拍板定案，將台灣 Open Banking 導入分為三階段。 | `open-banking-history` `open-banking-taiwan-2019` |
| 台灣開放銀行三階段 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 2019 | `open-banking-taiwan-2019` `open-banking-stage-1` |
| 第一階段 | `open-banking-stage-1` |
| 2020 | `open-banking-stage-2` |
| 可透過第三方APP整合 個人銀行帳戶及查詢餘額等。 | `open-banking-stage-2` |
| 2021 Q1 | `open-banking-stage-3` |
| 昕力資訊實現三階段開放銀行規範 | `digirunner-open-banking-3-stages` |
| 昕力資訊 digiRunner API 管理平台反應台灣開放銀行金管會法規要求，透過一致的標準規格與安全控管機制，加速金融業者與 TSP 業者更廣泛的合作，達到業務延伸拓展效益。 | `digirunner-open-banking-fsc` |
| 傳統銀行 VS 開放銀行 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 傳統銀行 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 第一階段-公開資訊開放 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| digiRunner API 管理平台擁有專利的服務不中斷熱部署特點，在跨平台開發速度以及與下游應用系統的對接效率提升高達 50%；其 API 自動探索、即時告警、交易控管等功能，能做到傳輸層、資料層及行為層的安全控管，讓 IT 人員毋須煩惱主機平台的資安，且可從平台直接對不同系統進行授權，免除過去修改程式的程序，大幅減少管理與維運的時間。 | `digirunner-hot-deploy-50` |
| 符合 Open Banking API 規格，個資、交易機敏資訊防護面面俱到。從資料傳輸層「隱密性、完整性、訊息來源、不可重覆」、資料層（資料完整性驗證、機敏個資加密、防駭攻擊）、行為層（OAuth2認證機制及授權時效、Client 授權及 IP Check）全方位防堵資安風險，協助整合行內現有 Token 機制，有效管理 API 用戶包含授權模式、流量控管。 | `digirunner-open-banking-security` |
| 藉由全方位 digiRunner API 管理平台架構實現開放銀行最終目的，在用戶同意下，TSP 業者可在整合帳戶資訊後透過 APP 連結帳戶付款、扣款、交易，真正達到「金融數據安全共享」，推動銀行和科技公司的合作創新，提供給消費者更佳完善的金融歷程體驗。 | 略過：核心價值、產業背景或概念說明的敘述，沒有昕力可查證的事實 |
| 昕力資訊專業顧問團隊，協助規劃建立符合各國開放銀行規範之技術架構。實現開放銀行，安心又快速。 | `digirunner-open-banking-consulting` |
| 銀行或外部驗身 | 略過：開放銀行、開放政府流程圖的標籤與步驟編號 |
| 會員 啟用銀行服務 | 略過：開放銀行、開放政府流程圖的標籤與步驟編號 |
| 回傳銀行授權 | 略過：開放銀行、開放政府流程圖的標籤與步驟編號 |
| 傳送 Authorization Code 至銀行端 | 略過：開放銀行、開放政府流程圖的標籤與步驟編號 |
| 取得銀行提供之服務 | 略過：開放銀行、開放政府流程圖的標籤與步驟編號 |
| (支援第三方或銀行驗證Sever) | 略過：開放銀行、開放政府流程圖的標籤與步驟編號 |
| 銀行後台 系統服務 | 略過：開放銀行、開放政府流程圖的標籤與步驟編號 |
| 客戶登入 | 略過：開放銀行、開放政府流程圖的標籤與步驟編號 |
| 登入網路銀行 | 略過：開放銀行、開放政府流程圖的標籤與步驟編號 |
| 網路銀行 | `digilogs-case-online-banking-title` `gadodido-finance-uses`（他頁） |
| 1. 核身畫面彈出 (外部URL) 2. User 輸入 ID/PWD | 略過：開放銀行、開放政府流程圖的標籤與步驟編號 |
| 3. 驗證成功，取得 TSP Server (Client) 可取用Group List 4. 跳頁面供User勾選同意授權 | 略過：開放銀行、開放政府流程圖的標籤與步驟編號 |
| 銀行回傳授權許可 | 略過：開放銀行、開放政府流程圖的標籤與步驟編號 |
| 5.取得Authorization Code | 略過：開放銀行、開放政府流程圖的標籤與步驟編號 |
| 用戶在授權TSP處理相關銀行資訊時，不會留下或儲存用戶帳密紀錄，而是透過用戶授權才能整合相關資訊 | `digirunner-open-banking-no-credentials` |
| 選擇一個對的 API 管理平台，除了提高彼此 API 對接的效率外，也能大大的降低內部人員管理 API 時間，是雙方在邁入 Open Banking 時代過程中，不可或缺的好幫手。現在市面上的 API 管理平台，都提供介接格式統一及資料加密的功能，除此之外，如果平台還有提供圖形化的操作介面，讓任何人都可以馬上上手操作，也可省下內部熟悉系統及管理的時間，另外平台是否提供外部合作夥伴的權限控管功能也是一個考慮的重點；在身份驗證及 API 授權部份，現今各國的作法大都是參照 Oauth2 的規範再去做加強管理，因此選擇一個滿足所有身份驗證方法及授權規範的平台也可以幫助金融機購及 TSP 節省另外開發相關 API 的時間。 | 略過：核心價值、產業背景或概念說明的敘述，沒有昕力可查證的事實 |
| TPI digiRunner 協助打造 API 平台戰略，讓銀行更靈活 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 符合 Oauth2 規範的身份驗證及 API 授權機制，介接格式統一，資料加密。 | `digirunner-oauth2` |
| 依需求彈性調整、擴增 API 應用，賦能銀行金融產業靈活運用金融資訊與開放 API。 | 略過：digiRunner、InsureRing 各產業頁籤的標語，沒有具體功能或數字 |

## https://www.tpisoftware.com/products/open-government

| 段落 | 狀態 |
|---|---|
| 開放政府 Open Government - 昕力資訊TPIsoftware | 略過：頁面的 title，沒有可查證的內容 |
| 開放銀行 Open Government - 昕力資訊TPIsoftware | 略過：頁面的 title，沒有可查證的內容 |
| 開放政府 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 智慧政府 Open API 開放資料應用 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 落實服務型政策推動~台灣「智慧政府2.0」 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 我國為接軌世界先進國家推動數位服務轉型趨勢，並厚植我國數位競爭力，政府將推動「服務型智慧政府推動計畫」，因應行政院推動的推動智慧政府轉型趨勢，並厚植數位競爭力，配合智慧政府發展規劃，以「數位身分識別證New eID」、「資料交換骨幹網路 T-Road」及「數位服務個人化 MyData」為三大基礎架構，以資料為骨幹，應用微服務、API 服務平臺及區塊鏈等串連各機關間點對點政府資料流通服務，優化決策品質，建構下一階段智慧政府公私協力治理模式，落實智慧政府「以民為本數位政府」願景。 | 略過：核心價值、產業背景或概念說明的敘述，沒有昕力可查證的事實 |
| 各縣市政府皆已逐一建置公部門內部的 API 管理平臺，包括2018年臺北市政府 API 平臺建置（昕力資訊建置已於2019年建置完成，預計三年內導入上百個 API 服務）、國發會於2020年二個大型API相關建置案(政府資料傳輸平臺( T-Road )建置委外服務案、智慧生活數位服務 MyData )、109年內政部資料交換整合管理平臺。 | `digirunner-case-taipei-city-2019` |
| 第一階段 | `open-banking-stage-1` `esg-regulation-roadmap`（他頁） |
| digiRunner - 100% 合規、智慧政府的推手 | `digirunner-claim-gov-compliance-100` |

## https://www.tpisoftware.com/products/systalk-ai

| 段落 | 狀態 |
|---|---|
| 1.4億用戶 | `systalk-ai-140-million-users` |
| 洽談兩組客戶 | `systalk-ai-products` |
| 智能理賠專利 | `systalk-ai-products` `systalk-ai-claim-patent` |
| 7/24 智能語音、文字客服機器人 | `systalk-ai-chat-patent` |
| 兩腦一流程專利 | `systalk-ai-chat-patent` |

## https://www.tpisoftware.com/products/systalk-ai-phison

| 段落 | 狀態 |
|---|---|
| 100% | `aiso-100-percent-control` |
| 超過 60% | `aiso-cio-survey` |
| AISO 將世界級 AI 算力 安全地帶進企業內部， 讓 AI 不只是工具，而是企業長期可控的核心算力資產。 | 略過：核心價值、產業背景或概念說明的敘述，沒有昕力可查證的事實 |
| AISO 整合企業所需的 AI 軟硬體 導入零困難 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| PHISON 群聯電子運用 | `aiso-phison-patent` |
| 獨家專利 aiDAPTIV 技術， | `aiso-phison-patent` |
| 政府部門 | `aiso-industries` |
| PHISON 獨家專利技術 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 別人跑不動的，PHISON 跑得動 + 跑得快 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 140 GB | `aiso-finetune-benchmark` |
| 260 GB | `aiso-finetune-benchmark` |
| 1400 GB | `aiso-finetune-benchmark` |
| Single node 4x GPU configuration comparing GPU only and GPU with | `aiso-finetune-benchmark` |
| Training is based on 10M tokens | `aiso-finetune-benchmark` |
| 同樣 4 張 GPU 的配置下，競品無法順利運行 70B 等級的模型， 而搭載 aiDAPTIV 的 SysTalk.ai 順利運行！ | `aiso-70b-on-4-gpus` |
| 能支援的模型大小，是同級 Dell、HPE 的 10 倍以上，速度更快上 4 倍！ | `aiso-10x-dell-hpe` |
| PHISON 獨家 aiDAPTIV 技術 | `aiso-25x-response` |
| 讓 AI 回應變快 25 倍 | `aiso-25x-response` |
| System: RAM: 64 GB GPU: RTX 4060Ti GDDR: 16GB aiDAPTIVCache: 320 GB | `aiso-25x-response` |
| Llama 3.1-70B-AWQ | `aiso-25x-response` |
| 64 GB | `aiso-25x-response` |
| RTX 4060Ti | `aiso-25x-response` |
| 16GB | `aiso-25x-response` |
| 320 GB | `aiso-25x-response` |
| Estimated figures are based on Llama 3.1-70B-AWQ | `aiso-25x-response` |
| 當資料量一變大，一般 AI 回應時間急遽拉長， 但搭載 aiDAPTIV 的 SysTalk.ai，能超高速給答案。 在相同設備、不增加任何硬體的情況下，回應時間從原本的 52 秒， | `aiso-52-to-2-seconds` |
| 大幅縮短到 2 秒內完成。 | `aiso-52-to-2-seconds` |
| AISO 打造 — All-in-one 訓練一體機方案 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| aiDAPTIV 4-GPU Server | `aiso-servers` |
| aiDAPTIV 8-GPU Server | `aiso-servers` |
| 192GB | `aiso-servers` |
| 384GB | `aiso-servers` |
| 中型知識庫 / 支援 100B 級別 LLM | `aiso-servers` |
| 超大型知識庫 / 支援 200B 級別 LLM | `aiso-servers` |
| 關鍵在 PHISON 的 aiDAPTIV 專利技術。透過記憶體管理與資料調度優化，在相同 GPU 條件下，可支援更大模型規模並顯著提升推論速度，突破一般伺服器的記憶體限制。 | `aiso-memory-optimization` |
| SysTalk.ai 支援主流開源與企業級 LLM（如 70B 模型），企業可依場景選擇最合適的模型，並保留未來更換與升級的彈性。 | `aiso-llm-support` |

## https://www.tpisoftware.com/products/systalk-audit

| 段落 | 狀態 |
|---|---|
| 情緒感知：可精準分辨客戶的真實情緒，不會因片段字詞誤判 | `systalk-audit-emotion` |
| 全天候 24/7 自動分析：全天候自動分析，無需人工干預，即時完成通話紀錄分析與報告生成，快速支援稽核需求 | `systalk-audit-24-7` |
| 高準確率轉錄：語音轉錄準確率達 95% 以上 | `systalk-audit-95-percent` |
| 24/7 | `systalk-audit-24-7` `systalk-audit-coverage` |
| Q1 是否可以整合現有錄音系統？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| Q2 資料是否會外流？平台如何保護安全 | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| Q3 需要具備技術背景才能操作嗎？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| Q4 STT 支援哪些語言？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| 準備好確認你的客服品質了嗎？ 實現你的客戶體驗優勢 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |

## https://www.tpisoftware.com/products/systalk-audit/quality-analysis

| 段落 | 狀態 |
|---|---|
| 客服質檢還在抽查 2%？ 直擊「合規與效率」雙重瓶頸 全面翻轉客服質檢盲區 | 略過：標題重述同頁 2% 抽樣的說法（systalk-audit-sampling-2-percent） |
| 每日海量客戶通話、面對嚴格的金融監管， 僅靠 2% 的人工抽樣已不足以防禦風險， 您正面臨前所未有的營運與管理挑戰！ 點擊進入昕力數位診斷通道， | `systalk-audit-sampling-2-percent` |
| 完成 3 分鐘評估，即可獲得： | `systalk-audit-3-minute-assessment` |

## https://www.tpisoftware.com/products/systalk-audit/quality-analysis/quiz

| 段落 | 狀態 |
|---|---|
| 偵查員您好，請輸入第一道憑證，正式開啟搜查行動... | 略過：互動測驗的提示文字 |

## https://www.tpisoftware.com/products/systalk-chat

| 段落 | 狀態 |
|---|---|
| Step 1 | `systalk-chat-nlu-steps` |
| Step 2 | `systalk-chat-nlu-steps` |
| Step 3 | `systalk-chat-nlu-steps` |
| Step 4 | `systalk-chat-nlu-steps` |
| 政府機關 | `systalk-chat-solutions` |
| 醫療集團 | `systalk-chat-solutions` |
| YouBike 小管家 AI 客服透過 SysTalk.Chat 在官方網站、官方App 等渠道建立完整且最擬人的客服問答機制，全天候輔助真人客服服務廣大的用戶群，包含了場站資訊、租借狀態、失物招領、通報協尋等項目，提供24小時不間斷的線上資訊服務。 | `systalk-chat-case-youbike` |
| 昕力團隊協助Wemo Scooter打造智能客服威威，於App提供24小時諮詢服務，可即時回答操作使用、保險車禍相關、騎乘注意事項，並提供方案介紹服務，讓使用者不論是否在客服上班時間，都能完整獲得資訊，輕鬆上手租用服務。 | `client-wemo` `systalk-chat-case-wemo` |
| 編、派、執三大模組搭配獨家AI技術 昕力SysTalk.RPA 打造Intel RRK認證RPA解決方案 | `cert-systalk-rpa-intel-rrk` |
| SysTalk.Chat 提供全通道 AI 智能客服，確保文字和語音客服進線不漏接。歡迎聯繫我們，讓客戶滿意度快速提升的客服系統！ | `systalk-chat-omnichannel` |

## https://www.tpisoftware.com/products/systalk-coach

| 段落 | 狀態 |
|---|---|
| SysTalk.Coach 以生成式 AI 打造企業專屬的情境化陪練與智能考核系統，讓業務、客服、金融理專等第一線人員在上線前完成足夠的實戰演練，縮短 70% 新人養成週期，主管從帶人瑣事中解放，幫助企業將經驗有效傳承。 | `systalk-coach-70-percent` `systalk-coach-overview` |
| 7×24 不限次數自主訓練 | `systalk-coach-7x24` |
| 24/7 | `systalk-coach-stats` |
| 100% | `systalk-coach-stats` |
| 直接上線面對客戶 | 略過：SysTalk.Coach 「傳統培訓」流程圖的標籤 |
| # 練習量不足即上第一線 失誤風險高 | 略過：SysTalk.Coach 「傳統培訓」流程圖的標籤 |
| 依企業產品、話術與合規要求設定貼近實務的客戶互動情境，不需依賴現有完整課程素材即可啟動。 | `systalk-coach-five-steps` |
| 系統自動分析情境設定，生成符合企業業務邏輯的 AI 模擬客戶角色，難度可依員工資歷調整。 | `systalk-coach-ai-customer` |
| 員工與 AI 客戶進行真實對話練習，不限次數，所有記錄完整留存可供複盤，不影響任何真實客戶。 | `systalk-coach-practice` |
| 打造 AI 虛擬客戶，每一位都有個性、有立場、有反應慣性。提供 | `systalk-coach-persona` |
| 讓員工像跟真客戶練習一樣練到熟 主管不用一對一帶練 | `systalk-coach-six-modules` |
| 可設定不同客戶角色與情境模板，打造貼近真實業務或客服的互動對話場景 | `systalk-coach-six-modules` |
| 模擬真實客戶對話，提升臨場應對能力 | `systalk-coach-realtime` |
| 以 AI 模擬演練取代純課堂學習，新人上手時間縮短，第一線表現更穩定 | `systalk-coach-onboarding` |
| Q1：SysTalk.Coach 適合哪類用戶群與產業？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| A：適合需要強化專業知識、銷售話術與服務標準制度化管理的企業，特別是金融業（銀行財管、保險業務、帳戶顧問）、客服中心（電話客服、線上客服、品質管理）、高客單值業務（企業軟體、不動產）等情境中，企業對專業度、一致性與合規要求較高，SysTalk.Coach 能協助建立標準化陪練與評測機制，提升團隊整體戰力。 | `systalk-coach-industries` |
| Q2：一定要有完整教材才能導入嗎？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| Q3：AI 教練如何確保回饋的精確性與專業標準？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| Q4：資深員工也適合使用嗎？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| A：適用。主管可依員工資歷與職能指派不同的練習與考核內容，資深員工的重點通常放在合規話術複習、複雜客戶情境演練，以及讓自身優秀對話沉澱為公司訓練素材。同時可透過數據分析模組比對不同資歷員工的能力差距，作為晉升與輪調的客觀依據。 | `systalk-coach-seniority` |
| Q5：為什麼不直接用免費的 AI 練習就好？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| Q6：支援哪些部署方式？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| A：我們依據客戶需求提供對應部署方案。針對金融、醫療等高度監管產業，我們能提供完整地端部署，符合資安與法規要求。 | `systalk-coach-on-prem` |

## https://www.tpisoftware.com/products/systalk-icr

| 段落 | 狀態 |
|---|---|
| 打造專屬於企業客戶的模型 | `systalk-icr-custom-model` |
| 透過 SysTalk.ICR 與 SysTalk.PUZZLE，全面改造資料建檔流程，依客戶需求建構 AI 模型，有效運用歷史資料，持續精進模型，提高辨識精準度，逐步實現無紙化的辦公需求。 | `systalk-icr-filling` |
| 掌握保險業數位轉型核心 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 提供消金、數金、信託業務等多管道前台進件，可批次進行 AI 文件辨識、無縫串接內部系統、持續精進 AI 模型，降低 40% 維運人力，提升工作效率。 | `systalk-icr-account-opening-40` |
| 以 AI 人機協作，有效解決 ICD 辨識一致性，打造全年 24 小時無休的智能理賠 AI 系統，告別繁瑣的手動建檔流程，優化理賠體驗。 | `systalk-icr-medical-24h` |

## https://www.tpisoftware.com/products/systalk-rpa

| 段落 | 狀態 |
|---|---|
| 昕力資訊｜SysTalk.RPA｜機器人流程自動化 實現數位勞動力第一步 | 略過：頁面的 title，沒有可查證的內容 |
| RPA流程自動化： 企業數位轉型的第一哩路 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 內建30種以上操作類別 | `systalk-rpa-studio` |
| 透過250種以上的模擬動作建立流程 | `systalk-rpa-studio` |
| 經多家客戶實例導入並取得驗證，兼顧效率、質量與成本控制，自動化流程更聰明！ | `systalk-rpa-proven` |
| 我們會於1-2工作天請專人與您聯絡。 敬請耐心等候，若有任何問題請 | `systalk-rpa-response-time` |

## https://www.tpisoftware.com/products/systalk-rpa/enterp-diagnosis

| 段落 | 狀態 |
|---|---|
| 2小時以內 | 略過：RPA 數位勞動力分析量表的選項與說明 |
| 2~8小時 | 略過：RPA 數位勞動力分析量表的選項與說明 |
| 8~16小時 | 略過：RPA 數位勞動力分析量表的選項與說明 |
| 16小時以上 | 略過：RPA 數位勞動力分析量表的選項與說明 |
| 備註：1 為完全不重複，5 為完全重複。 | 略過：RPA 數位勞動力分析量表的選項與說明 |
| 備註：1 為完全不需操作，5 為完全需操作電腦。 | 略過：RPA 數位勞動力分析量表的選項與說明 |
| 備註：1為完全不固定，5為完全固定。 | 略過：RPA 數位勞動力分析量表的選項與說明 |
| 備註：1 為完全不會變動，5 為確定會變動。 | 略過：RPA 數位勞動力分析量表的選項與說明 |
| 備註：1 為不需人為判斷，5 為完全需人為判斷。 | 略過：RPA 數位勞動力分析量表的選項與說明 |
| 備註：1 為完全沒有，5 為有許多例外狀況。 | 略過：RPA 數位勞動力分析量表的選項與說明 |
| 政府機關 | `systalk-rpa-government` |
| SysTalk.RPA 協助政府機關與時俱進，應用自動化工具改善繁複報表處理、老舊系統串接和無紙化政策支援，從墨守成規的體制框架中跳脫，打造為民服務的創新思維，兼顧效率、創新與民眾滿意度的提升。 | `systalk-rpa-government` |
| 精簡人力，客戶至上 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 從處理繁瑣流程到專注在客戶服務，RPA 可應用 e-KYC 數位識別身份認證、客戶關係管理、即時匯率更新和新聞輿情資料蒐集，安全合規的法規遵從，賦能銀行組織更好的彈性，成就非凡的金融服務體驗。 | `systalk-rpa-banking` |
| 客戶驅動，奪得商機 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 翻轉保險思維，從保單銷售到即時回應客戶需求，應用 RPA 智慧業務助理報價自動化、續保作業自動化，結合 AI 智慧助理服務，加速理賠處理進度，搶先提供報價，及早取得商機。 | `systalk-rpa-insurance` |
| 24/7 | `gadoscout-24-7` `systalk-audit-24-7` `systalk-audit-coverage` `systalk-coach-stats`（他頁） |
| Q1： SysTalk.RPA 相較市面上的他牌 RPA 產品有甚麼優勢？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| A： 公司員工80%以上技術人員組成，與原廠技術合作偕同在地化開發，實現 RPA 落地至台灣各產業。自有 AI 研發團隊，結合客製化擴增模組，小至快速見效大至長期規模導入，均已獲得客戶實證。 | `company-engineers-80` `systalk-rpa-local-dev` |
| Q2： SysTalk.RPA 的計價方式為何？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| A： 軟體採年訂閱制，其中流程開發、顧問服務、技術移轉、擴充核心模組、延伸套件等，則依流程樣態及客戶預算和效益等需求而有所差異。歡迎 | `systalk-rpa-subscription` |
| Q3： 真的人人都可以使用 RPA 嗎？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| Q4： SysTalk.RPA 一式三套真的都要買嗎？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| Q5： RPA 可以做延伸的應用嗎？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |
| Q6： SysTalk.RPA 還提供哪些服務？ | 略過：FAQ 的問題句；可查證的內容在答案裡 |

## https://www.tpisoftware.com/products/systalk-viki

| 段落 | 狀態 |
|---|---|
| TCO 比業界低50% | `systalk-viki-tco-50` |
| 內建雙專業評測之主流 LLM (如 Phi-4..) | `systalk-viki-bundle-llm` |
| Server + L40S x2 | `systalk-viki-bundle-hardware` |
| Server + H100 x1 | `systalk-viki-bundle-hardware` |
| Server + H100 x2 | `systalk-viki-bundle-hardware` |

## https://www.tpisoftware.com/products/systalk-viki/vikibundle

| 段落 | 狀態 |
|---|---|
| 企業 AI 解決方案平台｜降低成本 50%，快速導入、安全穩定 | `vikibundle-cost-50` |
| 企業 AI 即戰力！ AI 一體機 TCO 比業界低50% | `vikibundle-tco-50` |
| 硬體*[1] (GPU) | `vikibundle-hardware` |
| RTX PRO6000 x2 | `vikibundle-hardware` |
| H100 x1 | `vikibundle-hardware` |
| 6000Ada x6 | `vikibundle-hardware` |
| 文件梳理 (30份檔案) | `vikibundle-services` |
| 1個企業內部助理 (如：HR 助理) | `vikibundle-scenarios` |
| 2個企業內部助理 (如：HR 助理 + MIS 助理) | `vikibundle-scenarios` `vikibundle-heavy` |
| 2個企業內部助理 (如：HR 助理 + MIS 助理) + LLM Fine-tune*[2] 或 1個企業智能客服 + LLM Fine-tune*[2] | `vikibundle-heavy` |
| [1]將視應用需求建議硬體規格 | `vikibundle-notes` |
| [2]依實際需求另行報價 | `vikibundle-notes` |
| 1. 即時查詢與答覆企業政策 | `vikibundle-hr` |
| 2. 訓練教材 / 報到流程說明 / 員工問答機器人 | `vikibundle-hr` |
| 1. 系統使用問題第一線應答 | `vikibundle-mis` |
| 2. IT SOP 說明 / 系統教學文件 / 員工問答機器人 | `vikibundle-mis` |
| VIKI：SysTalk.VIKI 係以標準軟體產品的架構進行開發，可依據客戶需求快速完成進行安裝、佈署，相較客製化開發，企業可更快導入生成式AI應用平台。 | `vikibundle-standard-product` |

## https://www.tpisoftware.com/solutions/gis

| 段落 | 狀態 |
|---|---|
| 2D、3D與虛實整合平台建立可視化圖形介面，連結虛擬與實際空間，滿足各式場景使用。 | `gis-2d-3d` |
| 我們擁有最專業的團隊，協助企業集團建立 GIS Engine 公/私有雲架構，並提供GIS策略規劃、系統整合與架構設計。 | `gis-engine-cloud` |
| 保險標的圖資系統 | `gis-case-insurance-map-title` |
| 核保前，提供保險標的物週遭的地理環境資訊，協助行員判斷。以登入機制進行權限卡控，利用公式將經緯度轉換為麥卡托投影，並透過 ArcGIS 的客製化圖層，提供行員保險標的物週遭的地理環境資訊，亦可橫向與 Google 雙地圖、街景進行整合。 | `gis-case-insurance-map` |

## https://www.tpisoftware.com/solutions/insurering

| 段落 | 狀態 |
|---|---|
| InsureRing 保險自動化規則檢核 - 昕力資訊TPIsoftware | 略過：頁面的 title，沒有可查證的內容 |
| 保險自動化規則檢核解決方案 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 新型態管理 解決保險產業當前潛在挑戰 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 提升保險商品管理效率 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 從建立保險自動化規則檢核開始 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 因應市場的快速變化，提升保險商品管理效率，以建立新型態自動化檢核，滿足保險商品上下架彈性、核保規則調整及法令規範因應等需求，並同時提供各式保險平台之延展運用。 | `insurering-automated-rules` |
| 建立完善保險管理之公式 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 提高伺服器可擴展性，並加強客戶端的擴充能力 | `insurering-scalability` |
| 保險計算公式集中管理 | `insurering-central-formulas` |
| 專屬保險產業的規則引擎 | `insurering-rule-engine` |
| 符合保險產業商業邏輯，可降低長期維運成本 | `insurering-business-logic` |
| InsureRing 涵蓋公式、規則、檢核三大模組，可依客戶需求彈性組合模組，使保險管理最佳化。 | `insurering-three-modules` |
| 迅速完成保險產品測試及驗證 一周內迅速上市 | `insurering-one-week` |
| 新產品上架縮短時間達90%以上，迅速搶占市場商機。 | `insurering-90-percent` |
| 由驗證到保險產品上下架，皆能快速進行，提高營運效率。 | 略過：digiRunner、InsureRing 各產業頁籤的標語，沒有具體功能或數字 |
| 純網路保險公司 | `insurebrick-scenarios`（他頁） |
| 保險電商中台 | `insurebrick-scenarios`（他頁） |
| 產險中台 | `insurebrick-scenarios`（他頁） |
| 跨平台數位整合富邦人壽的行動投保網頁及App，導入昕力獨家4種系統模組，可彈性調整功能介面、快速上/下架商品。完善檢核機制模組，降低錯誤率及照會率。3分鐘快速成案，整合第三方支付平台，有效提高成交率，提供最速、最佳的保單購買體驗。 | `client-fubon-life` `insurebrick-case-fubon-life`（他頁） |
| 協助新光人壽建置集中化規則引擎，e化整合產品及計費資料，如：保險核心計算、公式、檢核模組等，整體降低50%作業成本。簡化商品上架流程，節省60%上架時間，資料線上即時歸檔，資料一致且正確，全面優化團險內部資料統整流程。 | `insurering-case-shin-kong-life` |
| 服務客戶 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |

## https://www.tpisoftware.com/solutions/interactivehealth

| 段落 | 狀態 |
|---|---|
| 智慧科技不斷發展，傳統醫療系統持續數位轉型，各式手機 APP、穿戴裝置的出現，保險產業、醫療院所及企業順應用戶習慣推出數位化、遊戲化來增加雙向互動體驗，讓個人健康管理、健康狀況監測等更為便利及有趣，同時也完善自身服務或達到關懷患者之目的，更利於將健康意識落實於大眾生活中。 | 略過：核心價值、產業背景或概念說明的敘述，沒有昕力可查證的事實 |
| 整合智慧型手機及 IoT 量測裝置，搭配遊戲設計、行銷活動及獎勵機制讓用戶參與管理及邁向健康生活。 | `interactivehealth-iot` |
| 結合線上線下行銷、獎勵回饋、衛教等多面向體驗，提升員工與會員自我健康管理能力。 | `interactivehealth-omo` |
| 醫院照護服務 | `interactivehealth-scenarios` |
| 保險客戶互動 | `interactivehealth-scenarios` |
| 政府健康宣導 | `interactivehealth-scenarios` |
| 昕力協助永豐銀行以健康生活角度出發建置『汗水不白流』APP，透過整合跨系統串接及監管海量運動數據，建立高效體驗的同時，讓用戶運動燃燒卡路里能轉換為信用卡點數回饋。 | `interactivehealth-case-sinopac` |
| 昕力協助好適康開發個人健康管理 APP，將使用者每日健康數據儲存於雲端，並以圖表方式呈現健康記錄及臨床數值，且建置就診預約、用藥提醒、疫苗接種日期記錄等功能，遇緊急狀況，可由 APP 啟動電話撥號，聯絡醫院醫師。 | `interactivehealth-case-good-health` |
| 醫院服務 APP | `interactivehealth-case-hospital-title` |
| 為擁有良好醫療品質，減少民眾就醫等待時間，昕力協助輔大醫院建置全方位服務 APP，整合醫院現有系統，提供預約掛號、看診檢查進度查詢、行動繳費、住院申請、慢箋領藥等功能，也提供如家戶設定、衛教說明等即時健康資訊。 | `interactivehealth-case-fu-jen` |
| 服務客戶 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |

## https://www.tpisoftware.com/solutions/smartclaim

| 段落 | 狀態 |
|---|---|
| 全球保險業的轉型新未來 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 過去在受理理賠案件時，保險業者需投注大量人力成本進行單據登打、格式整合、資料判定與理賠審核，而近年保險業面臨各式挑戰，全球不穩定的經濟局勢、節節上升人力成本等，以數位科技精進企業流程效率，其中 AI 技術更是保險業佈局轉型的數位策略之一。 | 略過：核心價值、產業背景或概念說明的敘述，沒有昕力可查證的事實 |
| AI 保險智能理賠解決方案 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 結合 NLP、AI OCR、RPA技術 讓保險理賠流程自動化 | `smartclaim-technologies` |
| 可自動統整保戶診斷書及單據格式，即使各醫院格式大不相同也能迅速輸入對應欄位，大幅降低資料登打、判讀的時間成本。 | `smartclaim-auto-filing` |
| 各醫院收據、發票等格式不一且繁雜，透過 AI 再訓練機制，可維持高度準確率。 | `smartclaim-retraining` |
| 引領保險業趨勢 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
| 為保險從業人員簡化工作流程、降低人為誤差，透過系統讓人力成本節省達 80% 以上。 | `smartclaim-80-percent` |
| 保險業 - 醫療文件解析 | `smartclaim-case-medical-documents-title` |
| 藉由自然語言技術，分析診斷證明書、單據等文件，強化保險業智能理賠系統，解決傳統流程中大量人力需求，作業效率大幅的提升，並透過進化系統持續優化模型精準度，提供最佳化理賠給付計算結果。 | `smartclaim-case-medical-documents` |

## https://www.tpisoftware.com/solutions/smartfilling

| 段落 | 狀態 |
|---|---|
| 從企業需求角度出發，為客戶建構獨家 AI 模型，改善傳統 OCR 辨識困難，最大化資料再利用與維運 | `smartfilling-custom-model` |
| 透過導入再訓練機制，企業能夠自行訓練重要資料而無需仰賴第三方，達到 100% 自主維運目標。 | `smartfilling-self-maintained` |
| 依客戶需求量身打造，同時也將 AI 文本分析技術用其中，精準且快速校正資料。 | `smartfilling-text-analysis` |
| 金融業應用－傳統文件數位化管理第一步 | `smartfilling-case-bank-title` |
| 因應銀行業務量上升，智慧建檔解決方案針對銀行業數位金融與資訊部門等，以 AI 取代傳統二登流程，節省將近 52% 委外成本，於三校時反饋系統再學習訓練模型，不但讓辨識資訊無縫介接內部系統，更有效降低維運人力約 45%。 | `smartfilling-case-bank` |

## https://www.tpisoftware.com/solutions/textualanalysis

| 段落 | 狀態 |
|---|---|
| 強大的軟體導入服務，為客戶完善內外部系統整合、串接及功能建置需求，滿足多元應用產業及場景。 | `detect-integration-service` |
| 簡化工作流程、降低人為誤差，快速解決 80% 之文書工作，提升企業營運效率。 | `detect-80-percent` |
| 建立推薦模型以分析民眾陳情來信，提供政府部門回覆文稿範本，以精準回應民眾之訴求，並減輕逐一撰稿回覆所耗費之人力與時間，案件處理更有效率。 | `detect-case-petitions` |
| 藉由自然語言技術，分析診斷證明書、單據等文件，強化保險業智能理賠系統，解決傳統流程中大量人力需求，作業效率大幅的提升，並透過進化系統持續優化模型精準度，提供最佳化理賠給付計算結果。 | `smartclaim-case-medical-documents`（他頁） |

## https://www.tpisoftware.com/solutions/uiux

| 段落 | 狀態 |
|---|---|
| 以使用者中心的設計思維出發，從創意發想、原型打造、介面設計到實際導入數位產品服務，提升線上線下終端用戶體驗，掌握跨屏接觸點與客戶互動，聆聽客戶心聲，並從中啟發，共創顧客旅程。 | 略過：核心價值、產業背景或概念說明的敘述，沒有昕力可查證的事實 |
| 政府單位 | `uiux-industries` |
| 透過使用者洞察，從當地使用者角度出發，除了傳承母集團企業形象，亦塑造在地化新元素，鮮明的視覺設計，情境式的描述產品，認真雕琢每一個設計細節，規劃契合企業形象與設計體驗一致性的形象網頁。 | `uiux-case-brand-site` |
| 結合社群與支付，提供P2P轉帳、分帳，電支交易等服務，從日常交易到週期性帳單處理。介面設計遵循Line集團規範，適度引導與透過文字字級與字重區分資訊內容權重，讓使用者一眼掌握帳戶餘額與消費動態。 | `uiux-case-e-payment` |

## https://www.tpisoftware.com/success-story

| 段落 | 狀態 |
|---|---|
| 客戶成就 ⬝ 共同喝采 | 略過：區塊標題、標語或 CTA，沒有可查證的內容 |
