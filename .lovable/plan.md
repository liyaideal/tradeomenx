

# 卡片层级调整：交换 Stats 和 Top Market 行的位置

## 问题
当前从上到下：Title → Stats（Vol）→ CTA（Top Market + CHG）。但 Top Market + CHG 是用户做点击决策的核心信息，却被压在最底部。

## 方案：纯位置互换 + 视觉微调

保持现有样式不变，只把两个区块的顺序对调：

```text
┌─────────────────────────────────────┐
│ ★ [Crypto]  NEW              4mo   │
│ Bitcoin Price End of Q3             │
│ ▾ 6 markets                        │
│                                     │
│ Above $100K      ▲ +3.52%         │  ← 上移：决策信息
│ ─────────────────────────────────── │
│ 24H VOL  $1.2M      TOTAL  $12.5M │  ← 下沉：辅助数据
│                      View Mkts  →  │
└─────────────────────────────────────┘
```

要点：
- **Top Market + CHG 行**上移到标题/market count 下方，紧跟标题，视觉权重最高
- **Stats（Vol）行**下移，字号可略缩小（`text-xs` → `text-[10px]`），降低权重
- **CTA 按钮**（View Markets → / Trade →）保持在最底部右对齐，与 Vol 行同行或紧接其下
- 单 market 事件（无 topMarket）：CHG 独立显示在同一位置

## 改动

### MarketCard.tsx（Version A）
- 将第 96-117 行的 CTA 区块中 top market label + CHG 部分移到第 83 行（stats 上方）
- Stats 行保留在下方，与 CTA 按钮合并为一行（左侧 Vol 数据，右侧 View Markets →）

### MarketCardB.tsx（Version B）
- 同样调整顺序

约改动 2 个文件，每文件重排约 15 行，无新增组件。

