## 背景

当前 binary 事件（单 market、Yes/No 两端）在 `/trade` 页面同时存在两个方向选择器：
1. 顶部 "Select Option:" 行 — 两个 chip（Yes / No）
2. 右侧 Trade 面板 — Yes / No 两个按钮

二者重复。binary 本质 = 一个 market + 两个对立方向，应该收敛。同时未来体育类单 market 事件（如"今天的德比谁夺冠？"）会用到两个队名作为 Yes/No 的别名展示。

## 目标

- **单 market 事件**：顶部不再渲染 Yes/No 两个 chip，改为渲染**一个不可点击的 market 标签**（默认 "Yes or No"，体育类显示如 "上海申花 or 山东鲁能"）。
- **方向切换**：完全交给右侧 Trade 面板的两个按钮，按钮文案显示 Yes/No 或队名别名。
- **联动**：K 线、订单簿、价格行（0.5900 等）跟随右侧 Trade 面板按钮的选择更新；底层 `selectedOption` state 由右侧按钮统一驱动。
- **多 market 事件不变**：仍然展示 chip 行，每个 chip 是一个 market（如总统大选多候选人）。

## 范围

仅 UI 层与轻量数据模型扩展，不动交易/PnL/持仓逻辑（已在上一轮独立持仓改造中完成）。

## 改动清单

### 1. 数据模型（轻量扩展）

`src/hooks/useEvents.ts` 的 `TradingEvent` 增加可选字段：
```ts
sideLabels?: { yes: string; no: string }; // 单 market binary 专用；缺省时 UI fallback 到 "Yes" / "No"
```
- `useActiveEvents.ts` / DB option 转换：暂不强制后端字段，先在前端 mock/seed 数据里给体育类示例配 `sideLabels`，binary 默认走 fallback。
- `isSingleMarketBinary(event)` 工具函数：`event.options.length === 2 && labels 等于 Yes/No 或事件被标 binary`。放到 `src/lib/eventUtils.ts`。

### 2. 顶部 chip 行

`src/pages/DesktopTrading.tsx`（约 906-925 行）与 `src/components/MobileTradingLayout.tsx`（约 155-160 行）：
- 用 `isSingleMarketBinary(event)` 分支：
  - **单 market binary**：渲染 1 个只读 `<div>`：
    ```
    Market:  Yes or No        （或  上海申花 or 山东鲁能）
    ```
    使用 muted 文字，无 hover，无 border—视觉与原 chip 区别开，明示这是信息标签而非选择器。
  - **多 market**：保留现有 chip 行逻辑（不动）。

### 3. 右侧 Trade 面板按钮

`src/components/TradeForm.tsx` / `src/components/DesktopTradeForm.tsx`：
- 按钮文案：单 market binary 下读取 `event.sideLabels`；缺省 "Yes" / "No"。
- 点击按钮时，除原本切换 `side` 外，**同步写回** `setSelectedOption(yesId | noId)`，让 K 线/订单簿/价格行联动。
- 按钮下方小字仍显示当前价（0.5900 / 0.4100）。

### 4. 联动校验

- K 线（Chart）、订单簿（OrderBook）、`0.5900 -0.75%` 价格行已经由 `selectedOption` 驱动；上一步把 selectedOption 写回后，自动跟着切。
- 顶部 header 的 "Current Price"：维持现状（事件级 underlying，如 ETH 价），与 market 端无关。

### 5. Style Guide / Playground 同步

`src/pages/StyleGuide/sections/TradingSection.tsx` 和 `TradingHeaderPlayground.tsx` 增加新状态：
- 单 market binary（默认 Yes/No）
- 单 market binary + 自定义 sideLabels（体育队名）
- 多 market（保持原状）
通过 PresetRail 切换，覆盖三态。

## 不改的事

- `side: 'long' | 'short'` 字段名、PnL 公式、持仓存储结构 — 全部不动。
- 多 outcome 事件（>2 markets） chip 行 — 不动。
- 顶部 header（事件标题、价格、24h Volume、OI 等） — 不动。
- DB schema — 暂不新增列；`sideLabels` 先走前端 seed/mock，待真实体育类事件接入时再补迁移。

## 文件影响

```
src/lib/eventUtils.ts                          (新增 isSingleMarketBinary)
src/hooks/useEvents.ts                          (TradingEvent + sideLabels?)
src/pages/DesktopTrading.tsx                    (chip 行分支)
src/components/MobileTradingLayout.tsx          (chip 行分支)
src/components/TradeForm.tsx                    (按钮 label + 写回 selectedOption)
src/components/DesktopTradeForm.tsx             (同上)
src/pages/StyleGuide/sections/TradingSection.tsx (新增 playground 状态)
src/pages/StyleGuide/components/TradingHeaderPlayground.tsx
mem://design/single-market-binary-ui.md         (新增 memory + index 更新)
docs/changelog/2026-05-25-single-market-binary-collapse.md (changelog)
```

## QA Checklist

- 单 market binary 进入 /trade：顶部仅显示 `Yes or No` 标签；右侧按钮 Yes/No；点击 No → K 线变成 No 价格走势、价格行变成 0.5900、订单簿切换。
- 模拟一个 `sideLabels = { yes:"上海申花", no:"山东鲁能" }` 的事件：顶部显示 `上海申花 or 山东鲁能`，右侧按钮也是队名。
- 多 outcome 事件：chip 行不变，原行为完全保留。
- 移动端镜像验证。
