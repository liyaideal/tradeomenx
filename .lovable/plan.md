

# 卡片增加 Top Market 预览行

## 问题分析
当前卡片的 3 个数据字段维度混乱：
- **24H CHG** → 来自 top market（按 volume 排名最高的子 market）
- **24H Vol** → event 级别汇总
- **Total Vol** → event 级别汇总

用户看不出 CHG 对应的是哪个具体 market，也缺乏"可交易内容"的预览，降低了点击前的决策依据。

## 方案

在卡片的统计行和 CTA 之间，新增一行 **Top Market 预览**，展示 CHG 数据的来源，同时让用户直观理解这个 event 里具体在交易什么。

```text
┌─────────────────────────────────────┐
│ ★ [Crypto]  NEW              30d   │
│ Bitcoin Price End of Q3             │
│                                     │
│ 24H CHG      24H Vol    Total Vol   │
│ ▲ +3.52%     $1.2M      $12.5M     │
│                                     │
│ ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈  │
│ 📊 Above $100K          ¢62.3  ▲3.5│  ← Top Market 行
│                                     │
│ View 4 Markets               →      │
└─────────────────────────────────────┘
```

Top Market 行显示：
- **Option label**（如 "Above $100K"）
- **Mark price**（¢ 格式）
- **CHG 值**（与卡片顶部 CHG 一致，这样用户就对上号了）

对于只有单个 market 的 event（childCount < 2），不显示此行（因为没有歧义）。

## 改动

### 1. `EventRow` 增加 `topMarket` 字段
**文件：`src/hooks/useMarketListData.ts`**
- 在 `EventRow` 接口新增 `topMarket: { label: string; price: number } | null`
- 在数据构建时从 `maxVolChild` 提取 label 和 markPrice

### 2. `MarketCard`（Version A）更新
**文件：`src/components/events/MarketCard.tsx`**
- 在 2x2 stats grid 和 CTA 之间，若 `market.topMarket` 存在，插入一行：
  - 左侧：option label（text-xs, truncate）
  - 右侧：mark price（¢格式）+ CHG 值（带颜色）
- 样式：`border-t border-border/10 pt-1.5 mt-1`，低调但可见

### 3. `MarketCardB`（Version B）更新
**文件：`src/components/events/MarketCardB.tsx`**
- 同样在 stats row 和 CTA 之间加 top market 预览行
- 适配 B 卡片的紧凑布局

### 4. CHG label 简化
- 两个卡片的 CHG 字段 label 从 `24H CHG (TOP MKT)` 简化为 `24H CHG`
- 因为底部已经明确展示了 top market 是哪个，不需要在 label 里重复说明

约改动 4 个文件，每个文件改动量约 10-20 行。

