---
title: digiRunner on Cloud API Management Platform
# The current en page's meta description (the same on both pages), cut to the seo-checklist length:
# the closing sentence is dropped, the facts are unchanged
description: digiRunner, an AWS-certified cloud-native API management platform, offers one-click activation for a streamlined, high-performance cloud APIM solution.
translationKey: digirunner-cloud
node: digirunner-cloud
kind: product
tagline: Uninterrupted Services with Cloud and On-Premises Deployment
# The five items under "Empower your Cloud API"
features:
  - title: Zero Downtime
    body: High-availability cloud-native architecture ensures zero downtime and mission-critical operations.
  - title: Enhanced Efficiency
    body: Low-code development streamlines the process of building an API Gateway
  - title: Scalable and Flexible
    body: Boost efficiency and performance with a containerized architecture
  - title: Visualized Management
    body: Simplify API monitoring and maintenance with a centralized platform
  - title: Fortified Security
    body: Ensure compliance and security with advanced authentication and encryption
# "FAQ", the same ten questions as on the AWS Marketplace page. Q4 leaves out "Click to start a
# 30-day free trial.", which pointed at a Marketplace link
faq:
  - question: We have two API servers. If one of them dies, will the traffic be automatically switched to the other remaining server? Does it need to be reconfigured manually if using a router with load balancing on digiRunner?
    answer: In a high-availability architecture deployment, if one of the API servers (digiRunner) dies, all requests will be redirected to the other one automatically without manual configuration.
  - question: Where and how is the data stored?
    answer: Data is stored as RDB in the Redis database that can be configured according to customer needs. Most of our partners in the financial industry adopt an Active/Standby mode of operation (high-availability). With a bigger budget, it is possible to adopt an Active/Active mode with Disaster Recovery or an Active/Active/Standby 3-mode architecture that allows for swift backup and recovery in case of a failover.
  - question: What caching engine is embedded on digiRunner?
    answer: digiRunner is embedded with smart caching—a patented in-memory caching technique that synchronizes data across nodes and dynamically stores data based on API loading.
  - question: Which regions/sites is digiRunner available in?
    answer: digiRunner is now available in all AWS regions/sites.
  - question: What is Transactions Per Second (TPS)?
    answer: Transactions Per Second (TPS) refers to the maximum number of transactions that a system can process per second. The TPS of standard 2 Core CPU / 4GB RAM digiRunner is sufficient for regular usage. We recommend a 4 Core CPU / 8GB RAM model as it allows for a capacity of 300-1000 transactions per second. Note that actual TPS varies with different environment configurations.
  - question: Does digiRunner have a built-in load balancer or web application firewall (WAF)?
    answer: digiRunner uses Nginx to distribute traffic across endpoints on servers with mechanisms ensuring the stability of API services. It is also feasible to integrate the existing WAF providers such as F5 or No Name Security.
  - question: What security mechanisms does digiRunner have?
    answer: digiRunner supports OAuth 2.0, API key, X API key, whitelist and basic access (also known as HTTP authentication). To ensure data integrity and confidentiality, each client has an option to encrypt or decrypt messages with JWS (RFC-7515) or JWE (RFC-7516) via JWT standards (RFC-7519).
  - question: Does digiRunner offer more than 99.9% uptime availability?
    answer: Yes, it does. Please reach out to us to learn more about how digiRunner can elevate your business and further discuss your specific needs.
  - question: For High Availability, can digiRunner support more than 5 pods?
    answer: Yes, it can. The current threshold is set to a maximum of 5. Please contact us to discuss your requirements with us.
  - question: What is included during the free-trial period?
    answer: All features for each solution (digiRunner Enterprise High Availability/Standalone and digiRunner Lite High Availability/Standalone) are included. You will NOT be charged for any license fee for the first 30 days within the free-trial period. However, there is an hourly charge for the AWS infrastructure cost for each pod. For more pricing details, visit Amazon EC2 Pricing and AWS Fargate Pricing.
cta: demo
sourceUrl:
  - https://www.tpisoftware.com/en/products/digirunner-cloud
  - https://www.tpisoftware.com/en/products/digirunner/awsmarketplace
migratedAt: 2026-10-24
---
