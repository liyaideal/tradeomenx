

# Style A 参照 Style C 风格重构

## Style C 的设计优点

Style C 的数据区采用**开放式三列布局**（无背景容器、无分隔线），标签在上、值在下，简洁干净。而 Style A 当前的中间区域用了封闭的表格容器 + 竖线分隔 + 表头行/值行分离，显得笨重且不协调。

## 改造方案（仅改 MarketCardA.tsx）

### 中间数据区（核心改动）

移除封闭的 `bg-white/[0.04]` 表格容器和所有 `border-r` 分隔线，改为 Style C 风格的开放式三列：

```text
┌──────────────────────────────────────┐
│ ⭐ NEW  Crypto              14d     │
│ Bitcoin Price Year End...  10X  ↗   │
│                                      │
│ TOP MARKET    24H CHG    PRICE       │  ← 10px 标签
│ Above 120K    ▲ +3.42%   0.67       │  ← 14px 值
│                                      │
│      View 4 Markets →               │
│ ─────────────────────────────────── │
│ Total Vol. $2.1M         14d →      │
└──────────────────────────────────────┘
```

具体调整：

| 项目 | 当前 Style A | 改为（参照 C） |
|------|-------------|---------------|
| 数据区容器 | `bg-white/[0.04] rounded-md overflow-hidden` 封闭表格 | 移除背景容器，改为 `grid grid-cols-3 gap-2 mb-2` |
| 表头 | 独立行 `grid-cols-3` + `border-r` | 每列内部的 `div`，`text-[10px] text-muted-foreground uppercase tracking-wide` |
| 数据值 | 独立行 `grid-cols-3` + `border-t` + `border-r` | 紧跟标签下方，`text-sm font-mono mt-0.5` |
| 分隔线 | `border-r border-border/20` 竖线 | 全部移除 |
| 第三列 | PRICE 左对齐 | 保持左对齐（与 C 一致） |
| 数据区间距 | `mb-1` | `mb-2`（与 C 的 `mb-3` 接近但更紧凑） |

### 其他微调

- 标题行 `mb-2` → `mb-3`（与 C 一致，给数据区更多呼吸空间）
- 底栏分隔：移除 `bg-white/[0.03]` 背景，改为 `pt-2 border-t border-border/20`（与 C 底部一致）
- 保留 Style A 独有元素：10X badge、ExternalLink 图标、"View N Markets" 居中链接

### 不改动

- MarketCardB.tsx — 不动
- MarketCardC.tsx — 不动
- 卡片外层结构（背景渐变、category 背景图、hover 效果）— 保留

