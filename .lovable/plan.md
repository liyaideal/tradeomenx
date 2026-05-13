## 方案 D：拆为独立 Hero 卡 + Header 走 Preset A

把 KPI 从 sticky header 中拆出来，让 `/` 的 header 与其他 hub 页面（`/events / /portfolio / ...`）完全一致；KPI 作为首屏第一张 Hero 卡，承载"大气"分量。

### 结构变化

**之前：**
```
[sticky header  Logo + Mainnet | Discord 🌐 🔔  ]
[                Total equity                   ]
[                $13,530.00 +$34.56     7d +1.9%]
─────────────────────────────────────────────────
[Onboarding strip]
[Airdrop strip]
[Campaign banner]
[AccountHub / Discover / More]
```

**之后：**
```
[sticky header  Logo + Mainnet | Discord 🌐 🔔  ]   ← 标准 Preset A
─────────────────────────────────────────────────
[ Hero 卡（不 sticky）                           ]
[   TOTAL EQUITY                          ]
[   $13,530.00                            ]
[   +$34.56  ·  7d +1.9%                  ]
─────────────────────────────────────────────────
[Onboarding strip]
[Airdrop strip]
[Campaign banner]
[AccountHub / Discover / More]
```

### 锁定的 token（写入 DESIGN.md §10 取代旧 Preset D）

**Preset D 重新定义：** 不再是"sticky header with KPI"，而是"`/` 走标准 Preset A header + `<HomeEquityHero>` 独立 Hero 卡"。

`<HomeEquityHero>` 卡 token：

| Slot | Token |
|------|-------|
| 容器 | `rounded-2xl border border-border/40 bg-gradient-to-br from-trading-green/[0.04] via-card/40 to-card/20 px-5 pt-5 pb-5` |
| Label | `font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground` |
| 主数字 | `font-mono text-[40px] font-bold tracking-tight text-foreground leading-none mt-2` |
| Meta 行 | `mt-3 flex items-center gap-2.5 font-mono text-[12px]` |
| · 今日 PnL | `font-semibold text-trading-green/red`，前缀无 |
| · 分隔点 | `text-muted-foreground/40` |
| · 7D % | `font-semibold text-muted-foreground`，前缀 `7D` |
| · 7D 数值绿/红 | inline span 染色 |
| Sticky 行为 | **无**（随页面滚动消失，让 Onboarding/Campaign 占据视口）|

未登录态：Hero 卡内容替换为 CTA "Sign in to start trading"，外壳样式不变。

### Header 同步改为 Preset A

`MobileHome.tsx`：
- 移除 `<HomeKPIHeader>`，改为 `<MobileHeader showLogo showBack={false} rightContent={headerActions} />`
- `MainnetBadge` 通过 `Logo size="md"` 默认 `showMainnetBadge={true}` 自然带出（无需自定义胶囊）
- Hero 卡作为 `<main>` 内第一个 section，紧跟其后是 Onboarding strip / Airdrop strip / Campaign banner

### 新文件

- `src/components/home/HomeEquityHero.tsx`（新）— 实现 Hero 卡，复用 `useUserProfile` 数据源
- `src/components/home/HomeKPIHeader.tsx`（删除）

### 文件改动（同步三处）

1. **DESIGN.md** §10 "Preset D" — 完全重写，定义为"Preset A header + HomeEquityHero 卡"组合
2. **`src/pages/StyleGuide/sections/MobilePatternsSection.tsx`** — Preset D playground 改为展示 Hero 卡静态预览（标注"`/` 专属，配合 Preset A header 使用"）
3. **`mem://design/mobile-header-preset-d`** — 同步内容

### 不变项

- `<MobileHeader>` A/B/C preset 不动
- `HomeOnboardingStrip / HomeAirdropStrip / CampaignBannerCarousel` 不动（仅顺序紧跟 Hero 卡之后）
- `HomeAccountHub / HomeDiscover / HomeMore` 不动
- 其他 hub 页面（`/events` 等）不动

### 风险/取舍

- ✅ Header 跨页面 100% 一致，规范负担最低
- ✅ KPI 卡可以放心做大气（40px 数字 + gradient + 大 padding），不挤压 sticky 高度
- ⚠️ 滚动后看不到余额（用户需回到顶部）— 这是接受的取舍
- ⚠️ Mainnet 胶囊从自定义改回标准 `MainnetBadge`，视觉略有差异（带 pulse dot 一致，但样式由 `<Logo>` 控制）
