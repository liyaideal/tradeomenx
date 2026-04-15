

# 方案 B：CHG 合并到 CTA 行

## 改动

### MarketCard.tsx（Version A）
1. **Stats grid**：从 2×2 改为 1×2，只保留 `24H Vol` + `Total Vol`
2. **删除** 独立的 Top Market 预览行
3. **CTA 行改造**：
   - 左侧：top market label + CHG 值（带颜色箭头），如 `Above $100K  ▲ +3.52%`
   - 右侧：`View 6 Markets →` 或 `Trade →`
   - 单 market 事件无 topMarket 时，左侧只显示 CHG 值
4. Expires in 保持在右上角不动

```text
┌─────────────────────────────────────┐
│ ★ [Crypto]  NEW              4mo   │
│ Bitcoin Price End of Q3             │
│ 6 markets                          │
│                                     │
│ 24H VOL           TOTAL VOL        │
│ $1.2M             $12.5M           │
│ ─────────────────────────────────── │
│ Above $100K ▲+3.52%   View Mkts → │
└─────────────────────────────────────┘
```

### MarketCardB.tsx（Version B）
- 同样逻辑：stats 只留 Vol，CTA 行左侧放 top market label + CHG

### useMarketListData.ts
- `topMarket` 字段已有 label，删除 price 字段（不再需要）

约改动 3 个文件，每文件 ~15 行。

