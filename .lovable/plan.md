## Goal
将 `HedgeUpsetsStrip` 改成两层互补叙事的 infographic：**Ticker 讲"发生了什么"，Ledger 讲"后果有多严重"**。两者数据维度不重叠，整体保持报纸式静态论据，不带卡片感、不可点击。

## 结构

```text
┌──────────────────────────────────────────────────────────────┐
│  Eyebrow + H2（沿用现有文案）                                │
├──────────────────────────────────────────────────────────────┤
│ ░ TICKER —— 发生了什么（4 场 upset 比分速览） ░               │
│  ✱ DRAW  SPAIN 0–0 CAPE VERDE   ✱ STOPPED  BRAZIL 1–1 …      │
│  · 黑底 #0E0E0E / 黄字 #FACC15 mono / 40px 高 / 自动横滚      │
├──────────────────────────────────────────────────────────────┤
│ ░ LEDGER —— 后果有多严重（报纸式 stat 列表） ░                │
│  ── LIQUIDATED ──────  $12.4M           ── on Polymarket     │
│  ── POSITIONS WIPED ─  4,382            ── in 90 minutes     │
│  ── ODDS COLLAPSE ───  Brazil 1.05 → 2.30 ── after 75'       │
│  ── FAVORITE WIN % ──  61% → 28%        ── this tournament   │
│  · 4 行，细黑分隔线，左红 mono 标签 / 中间 #1D4ED8 display    │
│    大数字 / 右黑灰描述                                        │
├──────────────────────────────────────────────────────────────┤
│  收束句（沿用，黄底高亮 "This time, give your pick a hedge."）│
└──────────────────────────────────────────────────────────────┘
```

关键去卡片化：去掉 `HedgePosterFrame`（poster frame 是"可点击海报"语义）；ledger 行只用 `border-b border-[#0E0E0E]/15` 细分隔，没有圆角、没有背景块、没有 hover。

## 文件变更

1. **`src/components/hedge/HedgeUpsetsStrip.tsx`** — 重写
   - 数据拆成两组常量：`UPSETS_TICKER`（4 场比分，仅 fav/score/under/tag）和 `LEDGER_STATS`（4 条后果，label/value/note）。值先用占位数字，文件顶部 `// Numbers pending business verification.`
   - 内联两个子组件 `<UpsetsTicker />` 和 `<ConsequenceLedger />`，不新建文件
   - Ticker：`bg-[#0E0E0E] h-10 overflow-hidden`，内部 `flex animate-[hedge-ticker_40s_linear_infinite]`，内容渲染两遍以实现无缝循环；每项 `font-mono text-xs uppercase tracking-[0.2em] text-[#FACC15]`，用 `✱` 分隔
   - Ledger：桌面 `grid grid-cols-[160px_1fr_1fr]` 三列（标签 / 大数字 / 注释），4 行 `border-b border-[#0E0E0E]/15`，最后一行去边
     - 标签：`font-mono text-[11px] uppercase tracking-widest text-[#E11D48]`，前缀 `──`
     - 数字：`font-display text-3xl md:text-5xl text-[#1D4ED8]`
     - 注释：`font-mono text-xs uppercase tracking-widest text-[#0E0E0E]/60`
   - 移动端 ledger：每行内部改成 `flex flex-col`，标签在上、数字大字、注释紧随；ticker 保持全宽
   - 保留 eyebrow + H2 + 收束黄底高亮 + verification 脚注（脚注文案改成 "Stats & match data pending business verification."）

2. **`src/index.css`** — 新增局部样式
   - `@keyframes hedge-ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`
   - 仅 keyframes，不加工具类（直接用 Tailwind arbitrary `animate-[hedge-ticker_40s_linear_infinite]`）

3. **`src/pages/CampaignStyleGuide/Playground.tsx`** — 给 Upsets 模块新增 playground entry "Upsets Infographic (Ticker + Ledger)"，沿用现有 `PresetRail` 桌面 1280 / 移动 390 两态；旧的 card-grid 预览删除

4. **`.lovable/memory/design/retro-poster-campaign-style.md`** — 在已有 "Evidence strip (locked)" 处更新：明确"两层叙事，Ticker = 事件，Ledger = 后果，数据维度不得重复，禁止套 HedgePosterFrame"

## 不做的事

- 不接真实数据 / 不接 `useActiveEvents`（本模块定位为叙事论据）
- 不加 `onClick` / 不加 link / 不加 hover 态
- 不改 Hero、不改下一模块、不改其它 hedge 组件
- 不改文案语义（eyebrow、H2、收束句保持不变；只新增 ledger 4 条标签和占位数字）
