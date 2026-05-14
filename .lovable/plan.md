# Guest Header 优化方案 — 数据吸引型

## 目标

未登录状态下的 `HomeGreeting` 卡片当前只有 "WELCOME / there / Sign in to start trading →"，右半边完全空白，视觉空旷且缺少说服力。改造为展示**平台实时活跃度**，让游客一眼感知到「这里有人在交易」，再引导登录。

## 最终布局（未登录态）

```text
┌──────────────────────────────────────────────────┐
│ Hey Caller. Ready to make your next call?                                    │
│ $4.2M traded · 24h           ╱╲    ╱╲            │
│ 128 active markets         ╱    ╲╱    ╲___       │
│                                                  │
│ ─────────────────────────────────────────────    │
│ Sign in to start trading                    →    │
└──────────────────────────────────────────────────┘
```

- 顶部Slogan：Hey Caller. Ready to make your next call?，左侧加一个 2px 的脉冲绿点表示 "live"。
- 主标题行：`$4.2M` 大字（font-mono，与登录后 PnL 大小一致）+ 灰色后缀  `traded · 24h`。根据真实`trading volume数据变化，不要写死$4.2M`。
- 副标题行：`128 active markets`（font-sans，muted-foreground）（根据真实`active markets数据变化，不要写死128）`。
- 右上角放一条 60×40 的全局 sparkline（聚合 top markets 的 7D mid 走势，复用现有 `buildSparkPaths`），颜色统一用 `--primary`（不强调涨跌，避免误导）。
- 卡片底部加一条 `border-t border-border/40`，下面是 CTA 行：`Sign in to start trading` + 右侧 ArrowRight，整行 hover 时 text-primary。
- 整张卡片仍可点（沿用现有 `handleBlockClick → onSignIn`），CTA 行只是视觉强化。

## 数据来源

新增轻量 hook `useHomeStats`（src/hooks/useHomeStats.ts）：

- 复用 `useEvents()` / `useHotMarkets()` 已经在加载的 markets 列表（避免重复请求）。
- 计算：
  - `volume24h` = Σ markets.volume24h
  - `activeMarkets` = markets 中 status 为 active/open 的数量
  - `sparkPoints` = 取 top 8 markets 的 mid 序列，按时间对齐求平均（如果数据不足，退化为 `useEquity7D` 同款空 dashed 线）
- 数字格式化：`$4.2M / $812K / $23.4K`，函数放 `src/lib/format.ts` 旁边或复用已有 `formatCompactUSD`（先 grep 确认）。

加载态：数字位置显示 skeleton（`bg-muted/30 h-7 w-32 rounded`），sparkline 区显示同款 dashed 占位线，避免布局跳动。

## 文件改动

1. `src/hooks/useHomeStats.ts` — 新建，导出 `{ volume24h, activeMarkets, sparkPoints, isLoading }`。
2. `src/components/home/HomeGreeting.tsx` — 仅修改 `!isAuthed` 分支（约 line 96-101 标题区 + line 216-221 CTA 区）：
  - 未登录时不渲染当前的 "WELCOME / there"，改成上述 LIVE 布局。
  - 已登录态完全保持不变。
3. 复用：`buildSparkPaths`、`Plus`/`ArrowRight` icon、现有 card 容器样式、font-mono / tracking token。

## 不动的范围

- 登录后的 header（balance + 7D sparkline + Deposit chip）一行不改。
- `HomeCampaignRail` / `HomeTopEvents` / 搜索隐藏等之前的改动不动。
- 不新增任何后端表或 edge function，纯前端聚合。