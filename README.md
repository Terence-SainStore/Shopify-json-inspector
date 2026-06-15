# Shopify Template Inspector

**Shopify Template Inspector** 是一个强大的纯前端可视化工具，专为 Shopify 开发者设计。它能深度解析 Shopify Online Store 2.0 的 Page / Template JSON 文件，帮助你快速理解页面结构、统计资源并排查问题。

无需后端，开箱即用。

---

## ✨ 核心功能

### 1. 深度结构分析 (Structure Inspector)
- **可视化树形图**：清晰展示 Sections 与 Blocks 的嵌套层级关系。
- **交互式 JSON 气泡**：点击树状图中的任意节点（Section 或 Block），即可通过悬浮气泡查看该节点的原始 JSON 数据，方便调试。
- **状态标记**：自动识别并标记被禁用的（Disabled）节点。

### 2. 智能图片管理 (Image Manager)
- **按模块分组**：图片按所属 Section 分组展示，标题格式为 `sectionId (sectionType)`。
- **模块筛选**：支持「仅展示启用模块」「仅展示禁用模块」复选框，默认展示全部。
- **自动提取**：扫描 JSON 中所有的 `shopify://shop_images/` 引用。
- **高级预览**：点击缩略图打开全新的预览模态框，查看高清大图及详细元数据（尺寸、文件大小、原始 URL）。
- **批量下载**：支持配置 CDN 前缀，按当前筛选条件打包下载图片（ZIP 格式）；按钮文案随筛选变化（`打包下载 ZIP` / `打包下载 ZIP（仅启用模块）` / `打包下载 ZIP（仅禁用模块）`）。

### 3. 视频资源梳理 (Video Manager)
- **按模块分组**：与图片相同，按 Section 分组展示视频引用。
- **模块筛选**：同样支持「仅展示启用模块」「仅展示禁用模块」筛选。
- **自动提取**：识别 `shopify://shop_videos/`、`shopify://files/videos/` 及 `shopify://shop_files/` 中的视频扩展名引用。
- **一键复制**：点击视频项可复制文件名，便于在 Shopify 后台「内容 → 文件」中搜索并手动下载。

### 4. 全面统计与诊断 (Stats & Signals)
- **复杂度评分**：自动计算模板复杂度（低/中/高），帮助评估页面性能风险。
- **迁移信号**：自动检测潜在问题（如过多的 DOM 节点、废弃的设置项等）。
- **资源统计**：精确统计 Section/Block 的使用数量、类型分布及复用率。

### 5. 现代化 UI 设计
- **极简美学**：全新的卡片式布局，清爽的蓝白配色与毛玻璃效果（Backdrop Blur）。
- **响应式设计**：在各种屏幕尺寸下均有良好的操作体验。
- **纯粹前端**：基于原生 JavaScript (ES Modules) 和 CSS Variables 构建，无构建步骤，无服务器依赖。

---

## 🚀 快速开始

1. **打开工具**：直接在浏览器中打开 `index.html`（或部署后的链接）。
2. **导入数据**：
   - 点击 **"Choose JSON file"** 上传你的 Shopify 模板文件。
   - 或者直接将 JSON 内容粘贴到文本框中。
3. **配置 CDN (可选)**：
   - 如果需要预览或下载图片，可只填站点域名（例如 `uk.shokz.com`），工具会自动拼接为 `https://uk.shokz.com/cdn/shop/files/`。
   - 也支持填写完整 CDN 前缀（例如 `https://uk.shokz.com/cdn/shop/files/`）或完整图片 URL（含 `?v=` 查询参数，会自动截取前缀）。
4. **开始分析**：
   - 查看右侧的 **Stats** 卡片获取概览。
   - 在 **Structure** 区域探索页面结构。
   - 在 **Images** 区域按模块浏览、筛选并下载图片。
   - 在 **Videos** 区域按模块浏览、筛选并复制视频文件名。

---

## 🛠️ 技术栈

- **Core**: Vanilla JavaScript (ES6+ Modules)
- **Styling**: Modern CSS (Grid, Flexbox, CSS Variables)
- **Dependencies**: 
  - `jszip` (用于图片打包下载)

---

## 📝 许可证

MIT License. Free to use for everyone.
