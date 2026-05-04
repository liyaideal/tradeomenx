
# /mainnet-launch 改版方案

## 核心思路

把页面从"项目里程碑公告 + 规则手册"改造成"**奖励驱动的转化漏斗**"。一句话定位：用户进来的第一屏就清楚 **能拿多少 / 怎么拿 / 现在就能开始**，后续每一屏都在为这个动作服务。

漏斗节奏：**钩子 → 奖励快照 → 进度反馈 → 三步指引 → 阶梯激励 → 信任 → 细则/FAQ → 收口 CTA**。

---

## 一、Hero 改版（最重要）

**问题**：H1 是 "OmenX Mainnet Launch"，把项目名当卖点；金额 `$2–$50`、`$200` 被埋在 metric 小格子里。

**改法**：

- **Eyebrow**：`Mainnet Launch · May 14–28`（合并现两个 chip，减少视觉碎片）
- **H1**：`Your first trade on mainnet pays you back.`
  备选：`Trade $5K. Get up to $50 USDC. Plus $200 in rebates.`
- **Sub**：一句话翻译两件事 —— "完成首笔合格交易拿保底奖励，继续交易解锁体量返佣阶梯。"
- **主 CTA**：`Claim My Bonus →`（替换 `Start Trading`，benefit-led）
- **副信息行**：倒计时 + "1,284 traders already qualified"（社会证明前置，从下方 TrustBar 抽上来一条）
- **右侧 Visual**：替换现在的 `LaunchVisual`（dashboard 风格，与下方 ProgressDashboard 重复）。改为**单一视觉锚点 —— "Reward Meter"**：一根从 $0 → $5K 的填充进度条，两侧标 "First $2 unlocked at $5K" 和 "Up to $50"，配一个简洁的金币 / 奖牌图形（保持 mainnet-gold 主色，不要花哨 3D）。
- **去掉**：Hero 内的 3 个 metric 小格子 —— 它们的内容由下面"奖励快照"模块承接，避免重复。

---

## 二、新增模块：Reward Snapshot（紧跟 Hero）

替代/前置于现在的 `ProgressDashboard`，承担"翻译规则"的职责。

布局：两张并列大卡片，每张就是一个 "Do X → Get Y" 公式。

```text
┌─────────────────────────┬─────────────────────────┐
│ EVENT 1 · Guaranteed    │ EVENT 2 · Volume Rebate │
│                         │                         │
│ Trade $5K volume        │ Keep trading            │
│  →  $2–$50 USDC         │  →  up to $200 USDC     │
│                         │                         │
│ [paid daily 18:00 UTC+8]│ [7 tiers · $10K → $1M]  │
└─────────────────────────┴─────────────────────────┘
```

每张卡底部一行 micro-CTA：`See how it works ↓` 锚点到 HowItWorks。

---

## 三、ProgressDashboard 重定位

现在它承担太多角色（既解释规则又显示进度）。改为**仅对登录用户显示个人进度**：
- 未登录 → 折叠/隐藏，或换成 `Sign in to track your progress` 占位条；
- 登录 → 显示 "Your volume: $X / $5K"、距离下个阶梯还差多少、预计奖励。

把"规则解释"职责完全交给 Reward Snapshot 和 HowItWorks，避免三处重复。

---

## 四、HowItWorks 三步精简

保留组件，但每步只一句话 + 一个图标，去掉冗长副本：

1. **Sign up & deposit** — 30 秒开户，邮箱即可
2. **Trade $5K volume** — 开仓 + 平仓累计，任意市场
3. **Get paid daily** — USDC 自动到交易账户

去掉每步内的二级解释段落，把它们移到 FAQ。

---

## 五、RewardLadder 视觉升级

现在是 7 个等高柱状图，信息密度低且与 Hero 视觉重复。改为**横向阶梯表**：

```text
Volume      Rebate    Status
$10K   →    $5        ─────
$50K   →    $10       ─────
$100K  →    $20       ─── you are here
$250K  →    $50
$500K  →    $100
$1M    →    $200      ⭐ max
```

登录用户的"you are here"实时高亮当前阶梯，未登录显示 max tier 高亮。

---

## 六、TrustBar / KeyRules 合并瘦身

- 现在 TrustBar（4 格 Production Proof）+ KeyRules 信息重叠。合并为单个 "Trust & Rules" 模块：左列 3 条信任点（daily settlement / on-chain verifiable / no lockup），右列 3 条关键规则链接到 FAQ。
- 节省一屏垂直高度。

---

## 七、文案语气统一

全局替换：

| 旧（系统视角） | 新（用户视角） |
|---|---|
| Activation first | Unlock your bonus |
| Event 1 / Event 2 | Guaranteed reward / Volume rebate |
| Operational details | Common questions |
| Start Trading | Claim my bonus / Start earning |
| Launch Console | （删除，不再使用 dashboard 比喻） |

---

## 八、视觉节奏与背景

现在每个 section 都是同样的深色 + 网格 + 边框，用户视觉疲劳。引入**节奏切换**：

- Hero / RewardSnapshot / FinalCTA → 深色 + mainnet-gold 强调（"高光屏"）
- ProgressDashboard / RewardLadder → 中性背景 + 数据感（"工作屏"）
- HowItWorks / Trust / FAQ → 更轻的背景，密度更低（"阅读屏"）

通过 section 背景色微差和留白节奏区分，无需新增颜色 token。

---

## 九、最终页面顺序

```text
1. Hero (with Reward Meter visual)
2. Reward Snapshot  ← 新增
3. ProgressDashboard (登录可见 / 未登录占位)
4. HowItWorks (3 步精简)
5. RewardLadder (横向阶梯表)
6. Trust & Rules  ← TrustBar + KeyRules 合并
7. FAQ
8. FinalCTA
```

---

## 技术落地清单

需要改动的文件：

- `src/components/mainnet-launch/Hero.tsx` — 重写文案、CTA、metric 行；右侧 visual 替换为 RewardMeter
- `src/components/mainnet-launch/LaunchVisual.tsx` — 替换为 `RewardMeter.tsx`（新组件，单一进度条 + 金额标注）
- `src/components/mainnet-launch/RewardSnapshot.tsx` — **新建**，两张并列卡
- `src/components/mainnet-launch/ProgressDashboard.tsx` — 改为登录态依赖；未登录态用占位
- `src/components/mainnet-launch/HowItWorks.tsx` — 文案精简
- `src/components/mainnet-launch/RewardLadder.tsx` — 改为横向阶梯表
- `src/components/mainnet-launch/TrustBar.tsx` + `KeyRules.tsx` — 合并为 `TrustAndRules.tsx`
- `src/components/mainnet-launch/FinalCTA.tsx` + `MobileFloatingCTA.tsx` — CTA 文案统一为 `Claim My Bonus`
- `src/pages/MainnetLaunch.tsx` — 调整 section 顺序
- 文档同步：`CAMPAIGN_DESIGN.md` 和 `mem://design/campaign-landing-design-system.md` 增加"campaign 落地页转化漏斗节奏"和"benefit-led 文案规则"。

埋点保持现有 `trackMainnetLaunch` 事件不变，新增 `mainnet_launch_reward_snapshot_view` / `_cta_click` 区分位置来源。

---

确认后我会按这个顺序逐模块落地，先做 Hero + RewardSnapshot（影响最大），再处理后续模块。
