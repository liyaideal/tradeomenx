
# 优化 binary 单 market 持仓的 Side 展示（桌面 + 移动）

## 问题

binary 单 market 持仓在持仓表/卡片里，Side 列/Side badge 与 Contracts 主标签内容重复（都是队名），还会因为 badge 窄宽折出 "Oklahoma / City Thunder" 这种丑换行。

## 方案

**binary 单 market 行的 Side 不渲染内容；把 outcome 颜色挪到 Contracts 主标签上**，让用户依然能一眼区分 Yes / No 边。

非 binary（多 outcome 事件）维持现状。

### 视觉规范

| 场景 | Contracts 主标签 | Side |
|---|---|---|
| binary Yes 边（Buy Yes Celtics / Buy Yes 无 alias） | `text-trading-green` | 空：渲染 `—`，`text-muted-foreground/40` |
| binary No 边（Buy No Thunder / Buy No 无 alias） | `text-trading-red` | 同上 `—` |
| 多 outcome（"Up >5%" / "Above $4,000"） | 保持 `text-foreground` | 现有 Buy/Sell 彩色 badge |

判定：`getBinaryOutcome(position.option) !== null` → binary 规则；否则旧规则。

事件副标题保持 `text-muted-foreground`，不上色。

## 改动文件（桌面 + 移动）

### 桌面

1. **`src/pages/DesktopTrading.tsx`** — `/trade` 持仓表（~1209-1270）
   - Contracts `<button>`：按 binary outcome 加 `text-trading-green` / `text-trading-red`
   - Side `<td>`：binary 行渲染 `—`；非 binary 保留 Buy/Sell badge

2. **`src/pages/Portfolio.tsx`** 桌面表（~622-645）
   - 同 DesktopTrading 同步处理

3. **`src/components/DesktopPositionsPanel.tsx`**（268-273 行内 Contracts chip）
   - Contracts 主标签上色；Side chip binary 时留空

### 移动

4. **`src/components/PositionCard.tsx`**（移动 `/portfolio` 与 `/trade` 移动 Positions 抽屉里的卡片）
   - 213 行头部 chip：binary 时**移除** Yes/No badge；卡片头部主标签（队名/Yes/No）改为 outcome 颜色
   - 345 行 Edit Dialog 摘要：同步逻辑（binary 不重复 Yes/No 字样）

5. **`src/pages/Portfolio.tsx`** 移动卡片块（474-490）
   - 与 PositionCard 头部一致：binary 行去掉 Yes/No badge，主标签上色

### 不动

- `src/lib/eventUtils.ts` helper 已就绪
- TPSL / Close / Detail Drawer 描述里的 Yes/No 文案保持上一轮改动（这些场景没有"列重复"问题）
- 多 outcome 渲染不变
- 数据层、PnL 公式、写库逻辑全部不动
- Style Guide / Playground 这次不动，留下次按 playground-state-coverage 统一补 binary outcome × side 全状态

## QA

桌面 + 移动镜像验证：
- Buy Yes Celtics → 主标签 "Boston Celtics" 绿色；Side 列 `—` / 移动卡片头部无 Yes badge
- Buy No Thunder → 主标签 "Oklahoma City Thunder" 红色；Side 列 `—` / 移动卡片头部无 No badge
- Buy Yes（无 alias）→ 主标签 "Yes" 绿色；Side `—`
- 多 outcome "Up >5%" → 主标签白色；Side 显示绿色 "Buy" badge（现状）
- 列表里不再出现 "Boston / Celtics"、"Oklahoma / City Thunder" 换行

## 记忆同步

更新 `mem://design/single-market-binary-ui` 追加一行：
> binary 单 market 在持仓/订单聚合表（桌面表 + 移动卡片）里，outcome 颜色挂在 Contracts 主标签上；Side 列/Side badge 对 binary 行留空（桌面 `—`，移动不渲染），避免与 Contracts 重复。

同步 `mem://index.md` 对应描述。
