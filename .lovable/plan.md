# 删除单 market binary 的 Market 标签行

## 背景

单 market binary 事件（如 UFC、单场体育对阵）目前在事件标题下还保留一行：

```
Market: Alex Pereira or Magomed Ankalaev
```

这行信息**完全冗余**：
- 事件标题已经写明对阵双方（"UFC 316 Headliner: Pereira vs Ankalaev?"）
- Trade 面板里的 Yes/No 切换器也已经直接展示队名（`binaryLabels`）
- 多余的一行还压缩了 Chart/Trade 区的垂直空间，桌面和移动都不美观

多 outcome 事件（如总统大选、多队冠军）的 `Select Option:` chip 行**保留**——那是真正的功能性切换。

## 变更范围

### 1. 桌面 `src/pages/DesktopTrading.tsx`（~L924-952）
- 删除 `isBinarySingleMarket` 分支整段（含 `Market:` 标签行 + 外层 border-b 容器）
- 保留 `else` 分支的 `Select Option:` chips
- 结果：单 market binary 直接从 header 衔接到主内容，少一条分隔线

### 2. 移动 `src/components/MobileTradingLayout.tsx`（~L158-179）
- 删除 `binary` 分支整段
- 保留多 outcome 的 `<OptionChips>` 渲染
- 结果：MobileTradingHeader 下直接接 Charts/Trade tabs

### 3. 文档 `DESIGN.md` §Single-Market Binary Trade Toggle
在开头追加一条明确规则：

> **单 market binary 不渲染 Market / Option 选择行**。对阵信息已在事件标题与 Trade 面板的 Yes/No 切换器中表达，header 下方**直接**进入 Chart / Trade 主区域，不得再插入 `Market: X or Y` 标签行（视觉冗余 + 浪费纵向空间）。多 outcome 事件才保留 `Select Option:` chip 行。

### 4. Style Guide `src/pages/StyleGuide/sections/TradingSection.tsx`
在 binary toggle 的说明区追加一条：

> · 单 market binary 事件**不要**在事件 header 下再加 `Market: X or Y` 行——对阵信息已由 Yes/No 切换器承担

### 5. Memory `mem://design/single-market-binary-ui`
在已有规则下追加一条：

> 单 market binary 事件**不渲染** Market 标签行 / Option chips。对阵信息只在事件标题 + Trade 面板的 Yes/No 切换器中出现。多 outcome 才有 `Select Option:` chip。

## 不动的地方

- `isSingleMarketBinary` / `getBinarySideLabels` 工具函数保留（Yes/No 切换器仍在用）
- 多 outcome 事件的 chip 选择逻辑完全不变
- Trade 面板内部的 Yes/No 切换器（DESIGN.md §Single-Market Binary Trade Toggle 已定稿）不动
- 事件标题、收藏星标、24h Volume / OI / Funding 等 header 元素不动
