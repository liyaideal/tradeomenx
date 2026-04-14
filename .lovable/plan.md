

# 卡片 24h Change 标签优化

卡片空间充裕，不需要像桌面表头那样用 tooltip，可以直接在标签文字中说明口径。

## 改动

**`src/components/events/MarketCard.tsx`** 第 77 行：

将 `24h Change` 改为 `24h Chg (top mkt)`，明确告诉用户这是取自成交量最大的子市场的变化值。

```text
之前: 24H CHANGE
之后: 24H CHG (TOP MKT)
```

只改这一行标签文案，其他不动。

