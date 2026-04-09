

## 修复三个视图之间 Orders/Positions 数据不一致

### 根因分析

数据不一致的原因是 `useOrderSimulation` 这个 hook 的运行位置不统一：

- **Trade tab** (`TradeOrder.tsx`) — 运行了 `useOrderSimulation`
- **Desktop** (`DesktopTrading.tsx`) — 运行了 `useOrderSimulation`
- **Charts tab** (`TradingCharts.tsx`) — **没有运行** `useOrderSimulation`

`useOrderSimulation` 会自动把 Pending 订单变成 Filled（然后从列表移除），同时创建对应的 Position。这意味着：
- 在 Trade/Desktop 页面，订单会被自动消耗掉，数量会变少
- 切到 Charts 时，模拟停止，但 Zustand 状态已被修改
- 不同时间点切换 tab，看到的数据自然不同

### 解决方案

把 `useOrderSimulation` 从各个页面组件中移除，改为在全局（App 层级）运行一次。这样无论用户在哪个 tab，模拟逻辑都一致运行。

### 改动范围

#### 1. `src/App.tsx` — 添加全局 OrderSimulation
- 在 App 组件中调用 `useOrderSimulation()`
- 确保只在 guest 模式下运行（已登录用户用 Supabase 数据，不需要模拟）

#### 2. `src/pages/TradeOrder.tsx` — 移除 `useOrderSimulation`
- 删除 import 和调用

#### 3. `src/pages/DesktopTrading.tsx` — 移除 `useOrderSimulation`
- 删除 import 和调用

#### 4. `src/hooks/useOrderSimulation.ts` — 添加登录检查
- 如果用户已登录，跳过模拟（已登录用户的订单由 Supabase 管理）

这样三个视图在任何时刻看到的 orders 和 positions 都完全一致。

