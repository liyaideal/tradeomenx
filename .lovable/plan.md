

## 问题
桌面端 `/trade/order` 左面板（TradeForm）的 Buy/Sell 按钮因加了双价从 1 行变 2 行，整体变高，但右面板 OrderBook 高度没变，导致左侧延伸到 OrderBook 底部下方，视觉上左右不齐、底部留白不对称。

## 思考几个方案

**A. 让 OrderBook 跟着拉长** - 增加显示档位（比如从 10 档变 12 档）
- 优点：自然填满、内容也更丰富
- 缺点：依赖具体档位数据，且 OrderBook 高度本身和 TradeForm 不是 1:1 同步关系，容易再次失衡

**B. 让 OrderBook 撑满父容器** - 用 flex / h-full 让它自动拉伸到和左面板一样高，多出来的空间留给中间档位价格区或底部 Depth 选择器
- 优点：彻底解耦，以后左面板再变化也不会再失衡
- 缺点：需要 OrderBook 内部有可伸缩区域（中间 spread 区或档位列表用 flex-1）

**C. 压缩 Buy/Sell 按钮高度** - 让双价更紧凑（比如价格用更小字号、和 Buy/Sell 文字同行而不是另起一行）
- 优点：根治高度增量
- 缺点：双价可读性下降，违背最初"价格要醒目"的目标

**D. 接受不齐，仅在底部加视觉补偿** - 比如 OrderBook 底部加一个 "Recent Trades" mini 区或拉长 Depth 选择器区
- 优点：不动结构
- 缺点：治标不治本

## 推荐方案：B（OrderBook 撑满父容器）

理由：
- 最干净的工程方案，"左右等高"应该由布局约束保证，而不是靠手动调档位数
- OrderBook 本身就有天然的可伸缩区（买卖盘档位列表），多出的空间正好用来多显示几档，信息密度更高
- 以后 TradeForm 再增减元素（如 TP/SL 展开），右侧自动跟随，不需要再调

## 具体改动

**改动文件**：`src/pages/DesktopTrading.tsx` + `src/components/DesktopOrderBook.tsx`

1. **DesktopTrading.tsx 左右容器**
   - 确认左右两栏的父容器是 `flex` 且 `items-stretch`（默认就是 stretch，确认即可）
   - 给右侧 OrderBook 容器加 `h-full flex flex-col`，让它填满父容器高度

2. **DesktopOrderBook.tsx 内部布局**
   - 根容器：`flex flex-col h-full`
   - 顶部 header（Price / Amount 标题行）：固定高度
   - 卖单区（Asks）：`flex-1 overflow-hidden`，按可用高度自适应渲染档位数
   - 中间 spread / mark price 行：固定高度
   - 买单区（Bids）：`flex-1 overflow-hidden`，同上
   - 底部 Depth 选择器：固定高度
   - 档位渲染：根据容器高度动态计算显示数量（或者简单粗暴 `overflow-y-hidden` 让多余档位自然被裁掉，因为档位本来就是分级深度，下面的不那么重要）

## 不改动
- 左面板 TradeForm（Buy/Sell 按钮的双价设计保留）
- OrderBook 数据源、档位生成逻辑
- 移动端布局（移动端是上下排列，不存在等高问题）

## 一句话总结
**把 OrderBook 改成 `h-full + flex-col`，让 Asks/Bids 区域用 `flex-1` 自动撑满**，左右两栏永远等高，多出来的空间正好多显示几档买卖盘。

