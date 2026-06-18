# /hedge → World Cup Hedge-to-Earn (Retro Poster Edition) + Campaign Style Guide 状态规范

整页重做 `/hedge` 为复古球迷海报风世界杯 H2E 活动页（用户已选 v3 Retro Football Poster），文案严格按附件 `OmenX_WorldCup_H2E_LandingCopy.md`；同时把所有可视状态在 `/campaign-style-guide` 的 Playground 里穷尽，符合 Core 规则"新功能 ≥2 状态必须主动补 playground"。

---

## A. /hedge 整页重做

### A.1 设计基线（页面级，不污染全局）

- 仅作用于 `/hedge`，**不动** `index.css` / Tailwind 全局 token / 其他页面
- 配色（页面 scope）：`#FDFCF0` 海报米、`#0E0E0E` 油墨黑、`#E11D48` 红、`#1D4ED8` 蓝、`#FACC15` 黄
- 字体：标题 `Archivo Black`（`@fontsource/archivo-black`），正文沿用 Inter
- 视觉元件：12px 油墨黑硬边框 + 偏移硬阴影 `shadow-[12px_12px_0_#E11D48]`、`-rotate-2` 红色贴纸 chip、左侧 4px 黄竖条引文、黑底黄字"INSURED"印章、SVG noise 纸面颗粒
- 不动产品壳：`EventsDesktopHeader` / `MobileHeader` / `SeoFooter` 保留

### A.2 文件改动

**重写**

- `src/pages/HedgeLanding.tsx` — 按附件 8 模块串联，删除 `HedgeRecentActivity / HedgeFoundersNote / HedgeSocialProof / HedgeLiveExample` 引用
- `src/components/hedge/HedgeHero.tsx` — Retro Hero：海报框 + 复古足球图形 + INSURED 印章；headline/subhead/CTA 1:1 附件
- `src/components/hedge/HedgeHowItWorks.tsx` — 合并附件模块 3 + 4：双列卡（Your pick wins / Your pick misses）+ Reassurance 小字 + 3 步贴纸编号
- `src/components/hedge/HedgeKeyRules.tsx` — 附件模块 5：仓位 ≥ 20U、≥ 1 天、最多 3 个 hedge、500U cap，每条金额带 `*not guaranteed`
- `src/components/hedge/HedgeFAQ.tsx` — 4 题 accordion，红黑印章风
- `src/components/hedge/HedgeFinalCTA.tsx` — 大 CTA + campaign window + 完整 Disclaimer
- `src/components/hedge/HedgeCTAButton.tsx` — 文案 "Connect Wallet & Open Your Hedge"，蓝底 + 硬阴影
- `src/components/hedge/HedgeMobileFloatingCTA.tsx` — 同步文案 + 红黑配色

**新增**

- `src/components/hedge/HedgeUpsetsStrip.tsx` — 模块 2 痛点：硬编码附件比分（Spain 0-0 Cape Verde / Brazil 1-1 Morocco / Belgium 1-1 Egypt / Netherlands 2-2 Japan）+ kicker
- `src/components/hedge/HedgeRewardTiers.tsx` — 模块 6 Tier 1 / Tier 2 / Top tier 500U，每行 `*not guaranteed`
- `src/components/hedge/HedgePosterFrame.tsx` — 共用海报容器（硬边 + 硬阴影 + 颗粒）

**删除**

- `HedgeRecentActivity.tsx` / `HedgeFoundersNote.tsx` / `HedgeSocialProof.tsx` / `HedgeLiveExample.tsx`

**不动**：`PolymarketConnectDialog.tsx` 业务逻辑、路由、auth、wallet、所有 hooks。

### A.3 文案锁定

Headline / Subhead / CTA / 痛点 / How it works / Steps / Rules / Tier / FAQ / Disclaimer 全部 1:1 复制附件英文原句。所有金额行（500U / 各 Tier）必须带 `*not guaranteed`。

### A.4 移动端

硬边 12→6px，硬阴影偏移 12→6px，3 步纵向，CTA 全宽，Live Stats 2×2 网格，海报内边距压缩。

---

## B. Campaign Style Guide 规范化（新增 Section + 穷尽状态）

### B.1 新增 archetype

`src/pages/CampaignStyleGuide/index.tsx` 在 `archetypes` 数组里新增：

```
id: "retro-poster"
title: "Retro Poster"
fit: "World Cup / 体育主题 / 季节性 H2E 活动"
mood: "复古、印刷感、决定性、人格化"
layout: "海报硬边框 + 偏移硬阴影 + 印章贴纸 + 大写 display 字体"
avoid: "Web3 紫渐变、深色卡片堆叠、emoji、AI 渲染感插画"
accent: "text-[#E11D48] border-[#E11D48]/40 bg-[#E11D48]/10"
preview: "retroPoster"
```

### B.2 Playground 新 Section：`Retro Poster — World Cup H2E`

在 `src/pages/CampaignStyleGuide/Playground.tsx` 加一节，所有状态都要可视化，按 Core 规则横滑 PresetRail 切换：

**B.2.1 CTA Button 状态**（共用 `HedgeCTAButton`）

- Default / Hover / Pressed（border-b-0 + translate）/ Loading（连接中）/ Connected（已连）/ Disabled（活动结束）
- Mobile 全宽 vs Desktop inline 两种尺寸

**B.2.2 Poster Frame 状态**

- 红影 / 黄影 / 蓝影 三种硬阴影色
- 桌面 12px 边 vs 移动 6px 边
- 纸面颗粒 ON / OFF

**B.2.3 Hero 状态**

- 活动进行中（Hero + LIVE stats 全显）
- 名额告急（spots left < 50，数字标红 + 闪烁）
- 活动结束（Banner 灰化 + CTA 改 "Campaign Ended" + 引导查看历史）
- 用户未连钱包 vs 已连钱包 vs 已经领过 hedge（CTA 文案：Connect / Open Your Hedge / View My Hedges）

**B.2.4 Upsets Strip 状态**

- 全部比分（4 张卡）
- 数据未核实占位（业务侧未填时显示"Match data pending"）
- 移动端横滑 vs 桌面 grid

**B.2.5 Reward Tier 卡**

- Locked（用户未达档位，灰 + 锁图标）
- Unlocked（亮色 + Tier badge）
- Claimed（已领，盖"REDEEMED"印章）
- 每态都带 `*not guaranteed` 脚注

**B.2.6 Eligibility 列表状态**

- 用户钱包未连：显示要求清单
- 用户匹配中：loading skeleton
- 用户合格 N 仓位：每条带 ✓ + 仓位金额
- 用户不合格：每条带 ✗ + 原因（< 20U / < 1 天 / 无匹配市场）
- Cap 触顶：3/3 hedge 已发，提示 "Cap reached"

**B.2.7 FAQ 状态**

- 全部折叠 / 单条展开 / 全部展开
- Disclaimer 块（永久可见，不折叠）

**B.2.8 Mobile Floating CTA 状态**

- 隐藏（Hero 在视口内）/ 显示 / Hover / Pressed / Campaign ended（隐藏）

**B.2.9 排版与配色 token 展示**

- Display / Body / Mono 三种字号样本
- 5 个海报色块 + 用途说明
- 硬阴影偏移规格表（桌面 12 / 移动 6）

### B.3 实现方式

- 不复制 `/hedge` 真实组件树整页塞进 playground，而是抽出每个可视组件接受 `state` prop（如 `<HedgeCTAButton state="loading" />`、`<HedgeRewardTier state="locked" />`），Playground 用 PresetRail 切 state 渲染
- Playground 用 `MobileViewportSwitcher` 复用现有 desktop/mobile 切换组件
- 与 `/hedge` 生产端共用一份组件源码，Playground 仅注入受控 state

---

## C. 字体接入

`bun add @fontsource/archivo-black` → `src/main.tsx` 加 `import '@fontsource/archivo-black/400.css'` → `tailwind.config.ts` 加 `fontFamily.display: ['"Archivo Black"', 'system-ui']`，仅 `/hedge` 与 playground retro section 使用 `font-display`。

## D. 验收

1. `/hedge` 桌面 + 移动两断点与所选 v3 Retro Poster 一致；文案 1:1 附件；所有金额带 `*not guaranteed`
2. 主 CTA 仍唤起原 `PolymarketConnectDialog`，钱包/路由/产品壳未受影响
3. `/campaign-style-guide` 出现 Retro Poster archetype；Playground 里每个上面列出的状态都能用 PresetRail 切到、且与生产渲染 1:1
4. 删除的 4 个 hedge 子组件无残留引用

## E. 记忆更新

落地后：

- `mem://marketing/hedge-landing-architecture` 重写为 Retro Poster 新结构（替换旧 9 段 section 列表）
- 新增 `mem://design/retro-poster-campaign-style` 记录硬边/硬阴影/印章/海报米色五色板规格，加进 `mem://index.md` Memories
