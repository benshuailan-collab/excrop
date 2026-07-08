# Excrop 网站修改提示词

## 使用方法
在项目目录下启动 Codex，复制下方提示词粘贴执行。
带 [括号] 的内容请先替换成你的真实信息再发送。


---


## 提示词开始

你是一个专业的前端开发工程师。请修改这个大蒜外贸独立站的代码。
项目目录：C:\Users\Administrator\WorkBuddy\2026-07-08-14-47-34\garlic-website
品牌名：Excrop
域名：excrop.com

请按以下要求逐项修改：

### 1. 更新公司联系方式

把网站所有联系方式改成以下内容：
- 邮箱：benshuailan@gmail.com
- WhatsApp：+86 136 5898 0612
- 电话：+86 136 5898 0612
- 公司地址：[山东省济宁市金乡县XXX路XXX号]
- 工厂地址：[山东省济宁市金乡县XXX工业园]
- 工作时间：Mon-Sat 8:00-18:00 (GMT+8)

### 2. 更新产品信息

修改产品展示部分，两个产品的详细信息：

**产品1：Normal White Garlic（普通白蒜）**
- 规格：4.5cm / 5.0cm / 5.5cm / 6.0cm / 6.5cm+
- 包装：10kg网袋 / 20kg网袋 / 10kg纸箱 / 20kg纸箱 / 定制包装
- 产地：Shandong, China（山东金乡）
- 特点：Natural white skin, plump cloves, strong flavor
- 保质期：Properly stored up to 9 months
- 起订量：1×20GP container（约28吨）

**产品2：Pure White Garlic（纯白蒜）**
- 规格：5.0cm / 5.5cm / 6.0cm / 6.5cm+
- 包装：10kg网袋 / 20kg网袋 / 10kg纸箱 / 20kg纸箱 / 定制包装
- 产地：Shandong, China（山东兰陵）
- 特点：Bright white skin, uniform size, premium grade
- 保质期：Properly stored up to 9 months
- 起订量：1×20GP container（约28吨）

### 3. 更新首页Hero区域

把首页大标题和副标题改成：
- 主标题：Excrop — China's Leading Garlic Exporter
- 副标题：Premium Quality · Direct from Farm · Global Shipping to 30+ Countries
- 数据亮点保留：15+ Years Experience / 5,000+ Tons Yearly / 30+ Countries / Custom Packaging

### 4. 更新About Us公司介绍

把关于我们文案改成：

Excrop is a professional garlic export company based in Shandong Province, China — the heart of China's garlic production. With over 15 years of experience in international trade, we have established stable supply chains with local farms and reliable logistics networks worldwide.

We specialize in exporting premium fresh garlic to markets across the Middle East, Africa, Southeast Asia, South America, Europe, and South Asia. Our garlic is sourced directly from farms in Jining and Linyi, ensuring the freshest quality at competitive prices.

From farm selection to size grading, custom packaging, cold chain logistics, and complete export documentation — we handle every step with strict quality control. Our clients receive garlic that meets their exact specifications, every single time.

### 5. 更新出口市场区域

更新出口市场部分，每个区域列出主要出口国家：

- **Middle East**: Saudi Arabia, UAE, Qatar, Kuwait, Oman, Bahrain, Iran, Iraq
- **Africa**: Egypt, Nigeria, Ghana, South Africa, Kenya, Ethiopia, Morocco, Algeria
- **Southeast Asia**: Indonesia, Vietnam, Thailand, Philippines, Malaysia, Singapore
- **South America**: Brazil, Colombia, Ecuador, Peru, Chile
- **Europe**: Russia, Ukraine, Poland, Netherlands, Spain, Italy
- **South Asia**: India, Pakistan, Bangladesh, Sri Lanka

### 6. 更新质量认证

更新认证资质部分：
- GAP Certification (Good Agricultural Practice)
- Global GAP
- HACCP Certification
- ISO 22000 Food Safety Management
- Phytosanitary Certificate (per shipment)
- Certificate of Origin (per shipment)

### 7. 更新询盘表单

修改询盘表单的提交逻辑：
- 邮件发送到：benshuailan@gmail.com（通过 Formsubmit.co AJAX）
- WhatsApp 消息发送到：+86 136 5898 0612
- 表单提交后同时发送邮件和跳转WhatsApp
- 提交后显示成功提示："✓ Inquiry Sent"，1.5秒后跳转WhatsApp
- 表单字段：Name*, Email*, Phone/WhatsApp, Company, Variety*, Size*, Quantity*, Destination*, Additional Requirements

### 8. 优化SEO

更新 meta 标签：
- title: Excrop - Premium Fresh Garlic Exporter from China | Wholesale & Bulk Supply
- description: Excrop is a leading garlic exporter from Shandong, China. We supply premium normal white garlic and pure white garlic (4.5-6.5cm+) to 30+ countries. Direct from farm, competitive prices, custom packaging. Get a quote today.
- keywords: garlic exporter, fresh garlic, Chinese garlic, white garlic, pure white garlic, garlic wholesale, garlic import, garlic supplier, Shandong garlic, bulk garlic, garlic price, garlic trade

### 9. 更新Footer

Footer 底部信息：
- 左侧：Excrop logo + 一句话简介 "Premium Fresh Garlic Exporter from China"
- 中间：快速导航链接（Products, About, Markets, Quality, Contact）
- 右侧：联系方式（邮箱、WhatsApp、地址）
- 底栏：© 2026 Excrop. All rights reserved. | Shandong, China

### 10. 更新多语言翻译（i18n.js）

确保以下4种语言的翻译内容与英文版完全一致，不要遗漏任何字段：
- English (en) — 默认语言
- 中文 (zh)
- 俄语 (ru)
- 阿拉伯语 (ar) — 注意RTL排版

品牌名在所有语言中统一使用 "Excrop"。

### 11. 视觉风格优化

- 主色调保持深绿色系（#1B4332, #2D6A4F, #40916C）
- 辅助色：金色/暖色用于按钮和强调（#D4A574）
- 背景：浅米色/白色为主（#F8F9FA, #FFFFFF）
- 字体：英文用 Inter，中文用系统字体
- 卡片和区块增加微妙的阴影和圆角
- 按钮hover效果增加微动画

### 12. 性能优化

- 所有CSS和JS文件压缩
- 图片用SVG内联，不依赖外部图片
- 添加 lazy loading（如果有图片）
- 确保移动端响应式正常

### 13. 添加结构化数据

在 HTML head 中添加 JSON-LD 结构化数据：
- Organization 类型
- 包含：公司名、网站、邮箱、电话、地址、产品信息
- 帮助 Google 理解网站内容，提升搜索排名

### 14. 添加 Google Analytics

在 head 中添加 Google Analytics 4 代码（占位）：
- G-XXXXXXXXXX（用户后续替换成自己的ID）
- 同时添加 Google Search Console 验证码占位

---

修改完成后，请确保：
1. 所有4种语言的翻译完整且一致
2. 询盘表单同时发送邮件和WhatsApp
3. 没有残留的旧品牌名（不应出现"小帅牛"等旧名称）
4. 响应式布局在手机端正常显示
5. 所有链接和按钮都能正常工作

## 提示词结束
