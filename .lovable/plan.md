

## 问题分析

`/trade/order` 顶部的 Price 区域当前结构：
```
┌────────────────────────────────┬─────────────┐
│ Price                          │ ⓘ Event Info│
│ 0.6234            ← 单价        │             │
│ Funding: -0.0001% / Next: 28min│             │
└────────────────────────────────┴─────────────┘
```

确实和下面 TradeForm 里 Buy/Sell 按钮内的双价**信息重复**，且 Price 区只显示一个数（实际是 Long 价），切到 Sell 时这里也不变，语义模糊。

但 `Funding` 和 `Event Info` 入口必须保留。

## 几个方案对比

**A. Price 区跟着 side 切换**
- Buy 时显示 Long 价、Sell 时显示 Short 价
- 优点：和按钮联动，无歧义
- 缺点：还是和按钮重复，Price 区存在意义不大

**B. 删除 Price 数字，保留一行 meta（Funding + Event Info）**
- 优点：最干净，按钮里已经有双价了
- 缺点：损失一个"价格速览"的视觉锚点

**C. Price 区改成"市场速览条"——保留位置但换内容**
- 把 Price 数字换成更有用的市场元信息：`24H Vol · Open Interest · Funding · Next funding`
- 右侧保留 Event Info 入口
- 优点：信息不重复、空间利用率高、和桌面端 Header 信息维度一致
- 缺点：要决定展示哪几个字段

**D. Price 区缩成单行紧凑 meta bar**
- 一行搞定：`Funding -0.0001% · Next 28min · 📊 Event Info`
- 完全去掉大字号 Price 数字
- 优点：最省垂直空间，给下面 TradeForm 让位
- 缺点：信息密度高，需要排版细致

## 推荐：D + C 的组合

**保留 Price 区位置，但改成单行紧凑 meta bar**：

```
┌──────────────────────────────────────────────────┐
│ Vol $1.2M · OI $480K · Funding -0.01% / 28min  ⓘ │
└──────────────────────────────────────────────────┘
```

理由：
1. **去重**：删掉大字号 Price 数字（按钮里已有双价）
2. **保留必要信息**：Funding/Next 不丢
3. **信息升级**：补上 24H Vol 和 Open Interest（这两个是用户决策时真正关心的"市场热度"）
4. **节省垂直空间**：从原来 ~60px 高度压缩到 ~32px，给 TradeForm 更多空间
5. **Event Info 入口保留**：右侧 ⓘ 图标，点击打开原 Sheet

## 具体改动

**改动文件**：`src/pages/TradeOrder.tsx`（第 102-129 行的 Price Header 区块）

1. 删除 `<div className="text-xl font-bold font-mono">{price}</div>` 大字号价格
2. 删除 "Price" label
3. 把 Funding/Next 行升级为带分隔点（`·`）的紧凑 meta bar
4. 在前面加上 24H Vol 和 Open Interest（数据从 selectedEvent 取，如果没有就降级只显示 Funding）
5. 右侧 Event Info 入口保留，但视觉简化为只有图标 + "Info"（更紧凑）
6. 容器从 `py-2` 改成 `py-1.5`，`text-[10px]` 保持

视觉示意：
```
Vol $1.2M · OI $480K · Funding -0.01% (28min)         ⓘ Info
```

字号统一 `text-[10px] text-muted-foreground`，分隔点用 `·` 配 `text-border`，Funding 数值如果是负数用 `text-trading-red`，正数 `text-trading-green`。

## 不改动
- Event Info Sheet 内容（仍是原 EventInfoContent）
- TradeForm Buy/Sell 双价按钮
- 桌面端 `/trade` 布局
- 右侧 OrderBook

## 一句话总结
**砍掉大字号 Price（按钮已显示双价），把那块位置改成"Vol · OI · Funding · Info"一行紧凑 meta bar**，去重 + 信息升级 + 省空间，三全。

