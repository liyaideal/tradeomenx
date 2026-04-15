

# MarketCardB 紧凑版卡片

## 布局

```text
┌──────────────────────────┐
│ ⭐ [Crypto] NEW      3d ⏱│
│ BTC to hit $100K?        │
│ CHG       Vol       OI   │
│ ▲+2.31%   $45K     $120K │
│ View 3 Markets >         │
└──────────────────────────┘
```

## 与 A 版差异

- padding `p-4` → `p-3`
- 标题 `line-clamp-2` → `line-clamp-1`
- 倒计时移到右上角（与 ⭐/Category/NEW 同行）
- 数据区从 2×2 grid 改为 1×3（label 在上，值在下，保留 label 文字）
- 删除中间 "▽ X markets" 行，合并到底部 CTA："View X Markets >" 或 "Trade >"
- CTA 行去掉 `border-t`，间距缩小 `mt-3 pt-2` → `mt-2`

## 改动

| 文件 | 改动 |
|------|------|
| `MarketCardB.tsx` | 完全重写为独立紧凑组件，不再包裹 MarketCard |

数据行结构：
```text
<div className="grid grid-cols-3 gap-2">
  <div>
    <div className="text-[10px] text-muted-foreground uppercase">CHG</div>
    <div className="text-xs font-mono text-trading-green">▲+2.31%</div>
  </div>
  <div>
    <div className="text-[10px] text-muted-foreground uppercase">Vol</div>
    <div className="text-xs font-mono text-muted-foreground">$45K</div>
  </div>
  <div>
    <div className="text-[10px] text-muted-foreground uppercase">OI</div>
    <div className="text-xs font-mono text-muted-foreground">$120K</div>
  </div>
</div>
```

只改一个文件。

