

## 我的判断结论：哪些地方"必须"加 Buy/Sell 双价格？

我系统过了一遍所有用户可见的页面，按"加上是否真的对用户决策有帮助"分成 3 类：

---

### ✅ 强烈建议加（用户在这些场景需要做交易决策）

**1. 事件列表 - 列表视图 `MarketListView.tsx`（桌面端 /events）**
- 当前：展开的子市场行只显示一个 `Mark Price` 列（`$child.markPrice.toFixed(2)`）
- 问题：用户在列表上扫一眼想判断"现在 buy/sell 大概多少钱"，但只看到一个 mark price，进交易页才发现 sell 完全是另一个数字
- 建议：把 `Price` 列拆成 `Buy / Sell` 两列（或一列双行 `Buy 0.62 / Sell 0.38`）

**2. 事件卡片 - 卡片视图 `MarketCardB.tsx`（移动端 /events）**
- 当前：只显示百分比变化，根本没显示价格
- 问题：双向价格本来就缺失。但卡片空间小，硬塞两个价格会很挤
- 建议：**只显示 Long 价格**（保持现状），不强行加。理由：列表卡片是"发现"场景不是"下单"场景，进入交易页后再看双价就够了

**3. EventCard 老版（HotShelf/MobileHome 用）`EventCard.tsx`**
- 当前：每个 option 只显示一个价格
- 类似 MarketCardB 的判断 — 卡片是发现场景，**不强加**

---

### ⚠️ 可加可不加（持仓 / 订单类，已成交价是事实，不是行情）

**4. `PositionCard.tsx` / `DesktopPositionsPanel.tsx` 的 Mark Price**
- 当前：显示一个 `markPrice`（按 position 方向 long/short 对应）
- 判断：**不需要加双价**。Mark Price 的语义是"按你这个仓位方向标记的价"，已经隐含了方向。再加另一个方向的 mark price 反而会让人困惑"我的盈亏到底按哪个算"
- Entry Price 同理 — 是历史成交事实，单向就够

**5. `OrderCard.tsx` / 挂单列表**
- 当前显示 Order Price（用户挂单时填的价）
- 判断：**不需要**。挂单价就是用户自己填的那个数，没有"另一个方向"的概念

**6. `OrderPreview.tsx` 订单预览页**
- 当前 Order Price 显示用户下单方向的执行价
- 判断：**不需要**。这是"你即将以多少钱成交"的确认页，方向已经在 Side 字段明确了

---

### ❌ 不要加（已结算 / 历史数据）

**7. `ResolvedEventDetail.tsx` / `EventShareCard` / `SettlementShareCard`**
- 已结算事件的 final_price 是"最终结算价"，本身就是单一确定值（0 或 1，或最终概率），没有 buy/sell 的概念
- Settlement 的 entry/exit 是历史成交事实

**8. `EventInfoContent.tsx` 的 "Current Price" 卡片**
- 这是事件级别的"当前指标"（比如 BTC 现货价、Tesla 股价），是**外部参考价**不是 OmenX 的交易价
- 不需要加 buy/sell

---

### 🎯 最终建议：**只改 1 个地方**

只在 **`MarketListView.tsx` 的展开子市场行** 把 `Mark Price` 列拆成 `Buy / Sell` 双价格。

理由：这是用户在交易主路径上、最容易"看到一个价格→进去发现是另一个价格"产生困惑的场景。其他地方要么是发现场景（卡片）要么是历史事实（持仓/订单/结算），加了反而增加噪音。

---

## 改动方案

### 文件：`src/components/MarketListView.tsx`

1. 表头展开子行的 sub-header：把第三列 `Price` 改成两列 `Buy` / `Sell`（或一列 `Buy / Sell`）
2. `ChildRowContent` 的 Mark Price 单元格：
   - 显示 `$buyPrice` 和 `$sellPrice`（其中 `sellPrice = 1 - buyPrice`）
   - 推荐写法：`<span>${buy}</span> <span class="text-muted-foreground">/</span> <span>${sell}</span>`
   - 颜色：buy 用 `text-trading-green`，sell 用 `text-trading-red`，让"看到颜色就知道方向"

### 不改动
- 所有移动端卡片（MarketCardB / EventCard / HotShelf）
- 所有 PositionCard / OrderCard / OrderPreview
- 所有 Resolved / Settlement 相关展示
- EventInfoContent 的 Current Price（外部参考价）

### 结论一句话
**主动加只在一个地方：桌面端事件列表展开子行的价格列。其他地方都不加，避免噪音。**

