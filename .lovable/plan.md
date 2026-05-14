## 改动
**文件：** `src/hooks/useHotMarkets.ts`

把 `all` bucket 的排序简化为单一规则：所有市场按 `volume24h` 降序，不再把 closing soon 浮到顶。

```diff
- // Float closing-soon to the top of "all" so they're always visible,
- // then rank everything else by 24h volume desc.
- const all = [...markets].sort((a, b) => {
-   const aClose = closingIds.has(a.id) ? 1 : 0;
-   const bClose = closingIds.has(b.id) ? 1 : 0;
-   if (aClose !== bClose) return bClose - aClose;
-   return b.volume24h - a.volume24h;
- });
+ // Rank by 24h volume desc — closing-soon users use the dedicated chip.
+ const all = [...markets].sort((a, b) => b.volume24h - a.volume24h);
```

`trending`、`closingSoon`、`justLaunched` 三个 bucket 的逻辑保持不变，独立 chip 仍可一键切到 Closing Soon。

不动的内容：UI、chips、HomeTopEvents、events 页 HotShelf 复用同一 hook，会一起生效。
