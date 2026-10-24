---
title: digiRunner on Cloud Nền tảng quản lý API
# The current vi page's meta description, cut to 120–160 characters; the facts are unchanged
description: "digiRunner: Nền tảng quản lý API trên Cloud-Native được AWS chứng nhận, kích hoạt với một cú nhấp chuột, cung cấp giải pháp cloud APIM có hiệu suất cao."
translationKey: digirunner-cloud
node: digirunner-cloud
kind: product
# The line above the h1. The vi site has no digirunner-cloud page, only /products/digirunner/awsmarketplace
tagline: Tích Hợp Liền Mạch Trong 20 Phút
# The four items of 「Cách digiRunner Cloud Duy Trì Các Hệ Thống Quan Trọng Luôn Hoạt Động」: the
# heading of each item and its text. The zh-TW entry's five 「Empower your Cloud API」 items are on the
# digirunner-cloud page, which has no vi version
features:
  - title: Kiến trúc container hóa
    body: Giảm thiểu rủi ro di chuyển dữ liệu với kiến trúc container hóa. Đơn giản hóa triển khai và quản lý để đạt được sự nhất quán về môi trường và hiệu quả tài nguyên.
  - title: Tự động mở rộng
    body: Vận hành hệ thống lõi không gián đoạn trong quá trình cập nhật dịch vụ và ứng dụng. Luôn linh hoạt và nhanh nhạy trước các nhu cầu và điều kiện thị trường thay đổi.
  - title: Mô hình bảo mật không tin cậy (Zero-Trust)
    body: Bảo vệ trước các cuộc tấn công và rò rỉ dữ liệu với mô hình bảo mật không tin cậy và kiểm soát truy cập API. Luôn sẵn sàng đối phó với các mối đe dọa an ninh.
  - title: Mô hình giá linh hoạt
    body: Giảm chi phí bảo trì và quản lý bằng cách thanh toán theo nhu cầu sử dụng. Tối đa hóa tài nguyên và đưa ra quyết định thông minh với các báo cáo phân tích chi tiết.
# 「Câu Hỏi Thường Gặp」, the ten questions without the 「Q1：」 and 「A：」 prefixes. Q4 leaves out
# 「Nhấn vào đây để bắt đầu dùng thử miễn phí 30 ngày.」, which pointed at a Marketplace link
faq:
  - question: Chúng tôi có hai máy chủ API. Nếu một trong số đó ngừng hoạt động, lưu lượng truy cập có tự động chuyển sang máy chủ còn lại không? Có cần phải cấu hình lại thủ công khi sử dụng router có tính năng cân bằng tải trên digiRunner không?
    answer: Trong kiến trúc triển khai có tính khả dụng cao, nếu một trong các máy chủ API (digiRunner) ngừng hoạt động, tất cả các yêu cầu sẽ được chuyển hướng tự động sang máy chủ còn lại mà không cần cấu hình thủ công.
  - question: Dữ liệu được lưu trữ ở đâu và như thế nào?
    answer: Dữ liệu được lưu trữ dưới dạng RDB trong cơ sở dữ liệu Redis, có thể được cấu hình theo nhu cầu của khách hàng. Hầu hết các đối tác của chúng tôi trong ngành tài chính áp dụng chế độ hoạt động Active/Standby (khả dụng cao). Với ngân sách lớn hơn, có thể triển khai chế độ Active/Active với khả năng khôi phục sau thảm họa hoặc kiến trúc ba chế độ Active/Active/Standby để sao lưu và khôi phục nhanh chóng trong trường hợp sự cố.
  - question: digiRunner sử dụng động cơ bộ nhớ đệm nào?
    answer: digiRunner tích hợp công nghệ bộ nhớ đệm thông minh – một kỹ thuật bộ nhớ đệm trong RAM được cấp bằng sáng chế, đồng bộ hóa dữ liệu trên các nút và lưu trữ dữ liệu động dựa trên tải API.
  - question: digiRunner có sẵn ở các khu vực hoặc địa điểm nào?
    answer: digiRunner hiện có mặt tại tất cả các khu vực/địa điểm của AWS.
  - question: Giao dịch mỗi giây (TPS) là gì?
    answer: Giao dịch mỗi giây, Transactions Per Second (TPS) là số lượng giao dịch tối đa mà hệ thống có thể xử lý mỗi giây. TPS của digiRunner với cấu hình 2 Core CPU/4GB RAM tiêu chuẩn là đủ cho nhu cầu sử dụng thông thường. Chúng tôi khuyến nghị mô hình 4 Core CPU/8GB RAM vì nó cho phép xử lý từ 300 đến 1000 giao dịch mỗi giây. Lưu ý rằng TPS thực tế có thể khác nhau tùy theo cấu hình môi trường.
  - question: digiRunner có tích hợp bộ cân bằng tải hoặc tường lửa ứng dụng web (WAF) không?
    answer: digiRunner sử dụng Nginx để phân phối lưu lượng truy cập qua các điểm cuối trên máy chủ với các cơ chế đảm bảo sự ổn định của dịch vụ API. Cũng có thể tích hợp các nhà cung cấp WAF hiện có như F5 hoặc No Name Security.
  - question: digiRunner có những cơ chế bảo mật nào?
    answer: digiRunner hỗ trợ OAuth 2.0, API key, X API key, danh sách trắng và xác thực cơ bản (HTTP authentication). Để đảm bảo tính toàn vẹn và bảo mật dữ liệu, mỗi khách hàng có thể tùy chọn mã hóa hoặc giải mã thông điệp với JWS (RFC-7515) hoặc JWE (RFC-7516) theo tiêu chuẩn JWT (RFC-7519).
  - question: digiRunner có cung cấp độ khả dụng trên 99.9% không?
    answer: Có, xin vui lòng liên hệ với chúng tôi để tìm hiểu thêm về cách digiRunner có thể nâng cao doanh nghiệp của bạn và thảo luận thêm về các nhu cầu cụ thể.
  - question: Với tính khả dụng cao, digiRunner có thể hỗ trợ hơn 5 pods không?
    answer: Có, hệ thống hiện tại hỗ trợ tối đa 5 pods. Xin vui lòng liên hệ với chúng tôi để thảo luận thêm về các yêu cầu của bạn.
  - question: Trong thời gian dùng thử miễn phí có bao gồm những tính năng gì?
    answer: Tất cả các tính năng của từng giải pháp (digiRunner Enterprise High Availability/Standalone và digiRunner Lite High Availability/Standalone) đều được bao gồm. Bạn sẽ KHÔNG phải trả phí giấy phép trong 30 ngày đầu tiên trong thời gian dùng thử miễn phí. Tuy nhiên, sẽ có chi phí theo giờ cho hạ tầng AWS cho mỗi pod. Để biết thêm thông tin về giá cả, vui lòng truy cập Amazon EC2 Pricing và AWS Fargate Pricing.
cta: demo
# Same file as the zh-TW entry. The vi page's 「Hướng dẫn mua hàng」 links the EN guide
# (digiRunner%20on%20AWS%20Marketplace_Buyer%20Guide_v1.4_EN.pdf), which isn't downloaded yet
# The vi page links the en buyer guide
downloads:
  - label: Hướng dẫn cho người mua digiRunner on AWS Marketplace (tiếng Anh)
    file: /pdf/digiRunner%20on%20AWS%20Marketplace_Buyer%20Guide_v1.4_EN.pdf
sourceUrl: https://www.tpisoftware.vn/products/digirunner/awsmarketplace
migratedAt: 2026-10-24
---
