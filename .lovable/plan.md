# /mainnet-launch 全页文案重写方案

## 一、核心问题诊断

通读全页后，发现大量"产品经理 / 后台系统"视角的措辞被当成 UI 文案使用，给用户的感觉是"我在看一份内部 spec"。典型病症：

| 类型 | 现状例子 | 问题 |
|---|---|---|
| 模块名当标题 | `FINAL WINDOW`、`REWARD METER`、`Account` | 这些是设计稿里的"模块代号"，不是用户语言 |
| 系统术语外泄 | `Event 1 / Event 2`、`Pre-tier`、`Activation threshold`、`Campaign position` | 用户不关心后台事件编号 |
| 公文体长句 | "Complete the first qualifying trade before the campaign closes." | 像合规通知 |
| 自指元描述 | "the dashboard now tracks…"、"the rules fit on one screen" | 说"页面在做什么"而不是说"用户能得到什么" |
| 重复 CTA 文案 | 4 处都是 `Claim My Bonus` | 节奏单调，没有递进 |

---

## 二、逐模块重写

### 1. Hero (Hero.tsx)
- Eyebrow 保留：`Mainnet Launch · May 14 – 28`
- H1 微调：`Your first mainnet trade pays you back.` ✅ 已经不错，保留
- Sub 改为更口语：
  现：`Trade $5K in volume to unlock a guaranteed USDC bonus. Keep trading to climb the rebate ladder up to $200.`
  改：`Hit $5K in trading volume and we'll send you USDC. Keep going and we'll send you more — up to $250 over the launch window.`
- 副信息行：`Mainnet live · settle in USDC` 改为 `Live on mainnet · withdraw anytime`（"settle in USDC"是行业黑话）
- `Rewards paid daily, 18:00 UTC+8` 改为 `Paid out every day at 18:00 UTC+8`

### 2. RewardMeter (Hero 右侧视觉)
- Eyebrow `REWARD METER` → 删除（这是模块名，不该出现在 UI）。换成 `Your reward, at a glance`（小标题）或者直接不要 eyebrow，让 H2 顶上去。
- `Up to $250 in USDC` 保留
- 副文 `Guaranteed first-trade bonus + volume rebate, paid daily.` → `A guaranteed bonus on your first $5K. A bigger rebate the more you trade.`
- 进度条下 `$5K · activate` → `$5K · bonus unlocks`（"activate"是系统语）
- `$1M · max` → `$1M · top tier`
- 卡片 `First Trade` → `First $5K bonus`，副文 `guaranteed at $5K volume` → `guaranteed payout`
- 卡片 `Volume Rebate` 副文 `7 tiers · highest reached` → `the more you trade, the more you keep`
- 个人进度行 `your volume:` → `You're at` （首字母大写、口语）

### 3. RewardSnapshot
- Eyebrow `What you can earn` ✅ 保留
- 标题 `Two rewards. One trade path.` → `Two ways to get paid. Same trade.`（更口语）
- 描述精简：`Cross $5K in volume and we'll send you a guaranteed bonus. Keep trading and we'll keep sending more.`
- 卡片 1：
  - `Guaranteed Reward` → `Guaranteed bonus`
  - "You do" → `Step 1`，`Trade $5K volume` → `Trade your first $5K`
  - 副文 `open + close, any market` → `any market, any leverage`
  - "you get" → `we send you`，`paid daily · 18:00 UTC+8` → `in your account by tomorrow 18:00 UTC+8`
- 卡片 2：
  - `Volume Rebate` → `Volume rebate`
  - `Keep trading` → `Keep trading after that`
  - `across the 14-day window` → `until May 28`
  - `7 tiers · $10K to $1M` → `the higher you go, the bigger the payout`
- "See how it works ↓" → `See the 3 steps`（明确说"3"，更具体）

### 4. ProgressDashboard
- Eyebrow `Account` → 删除，或改成 `Your progress`
- 标题 `Your campaign position` → `You're in. Here's where you stand.`
- 描述 `Your live trading volume is already above the activation threshold. The dashboard now tracks the next rebate unlock.` →
  `You've cleared the $5K bonus threshold. Now every trade pushes you up the rebate ladder.`
- 数据卡：
  - `Event 1 Status / Qualified / $2-$50 USDC · processing` → `First-trade bonus / Unlocked / $2 – $50 USDC on the way`
  - `Current Tier / $100K / rebate $20` → `Current tier / $100K volume / $20 rebate locked in`
  - `Pre-tier` → `Not yet on the ladder`
  - `Next Unlock / $250K / $X remaining` → `Next tier / $250K volume / $X to go`
  - `Time Left / 5d 12h / ends May 28, 2026` → `Time left / 5d 12h / closes May 28`
- CTA `Go to Events` → `Place a trade →` （动作明确，不是"去某个页面"）

### 5. HowItWorks
- Eyebrow `How it works` ✅
- 标题 `Three steps. No tricks.` → `Three steps. That's it.`（去掉"no tricks"——主动说"没有套路"反而像有套路）
- 描述：`Sign up. Trade. Get paid in USDC.`（一行就够）
- Step 文案保留（已经够口语）
  - `30-second signup. Email is enough — no KYC for the bonus.` ✅
  - `Open + close on any contract market. Leverage counts.` → `Any market, any leverage. Open and close adds to your volume.`
  - `USDC lands in your trading account by 18:00 UTC+8.` → `USDC shows up in your account by 18:00 UTC+8 the next day.`
- CTA `Claim My Bonus` → `Start my first trade →`（这一屏的语境是"开始"，不是"领取"）

### 6. RewardLadder
- Eyebrow `Volume rebate ladder` → `Volume rebates`
- 标题 `Trade more, earn more.` ✅ 保留
- 描述 `Rebates pay the highest tier you reach — not cumulative. Hit the top tier for a $200 USDC payout.` →
  `You get paid for the highest tier you hit. Reach $1M and we send you $200.`
- 列头 `Status` → `Progress`
- `you are here` → `You're here` （首字母大写一致性）
- `max payout` → `Top tier`
- 底部说明：`Highest tier reached at campaign close = your rebate. Volume from your first $5K counts toward both rewards.` →
  `Whatever tier you're at on May 28, that's what you get paid. Your first $5K counts twice — toward the bonus and toward the ladder.`
- CTA `Claim My Bonus` → `Start climbing →`

### 7. TrustAndRules
- Eyebrow `Trust & rules` → `Why you can trust this`
- 标题 `Real money. Clear terms.` ✅ 保留
- 描述 `The reward window runs on real settlement rails — and the rules fit on one screen.` →
  `Real USDC, paid from our marketing budget. Here's exactly how it works.`（去掉"settlement rails"这种内部词；去掉"the rules fit on one screen"这种自指）
- 信任卡保留，措辞已经 OK
- 规则表 label 保留，但 body 改口语：
  - Volume body 已 OK
  - Settlement → 改 label `Payout time`，body `Every day by 18:00 UTC+8 for yesterday's volume.`
  - Highest tier ✅
  - Wash trading body → `We screen out self-matching and bot-like patterns. Trade normally and you're fine.`

### 8. FAQ
- Eyebrow `FAQ` ✅
- 标题 `Common questions.` → `Questions traders actually ask.`（更人味，且暗示"我们听过这些问题"）
- 描述 `Everything traders ask before claiming the bonus.` → 删除或改 `Quick answers before you start.`
- FAQ 内问题改：
  - `Can I win both Event 1 and Event 2 rewards?` → `Can I get both the bonus and the rebate?`
  - `Are Event 2 tier rewards cumulative?` → `Do the tier rewards stack?`
  - 答案里所有 "Event 1 / Event 2" 替换为 "the bonus / the rebate"
  - `What's the catch?` ✅ 保留（这条已经很好）

### 9. FinalCTA  ← **用户重点吐槽的一屏**
- Eyebrow `Final window` → 删除（"final window"听起来像后台 enum 状态）
- H2 现状 `Complete the first qualifying trade before the campaign closes.` → 像合规公告。改为：
  `Don't let your bonus expire.`
  备选：`The window closes May 28. Your move.`
- 副文现状 `The launch reward window is fixed. After May 28, new first-trade rewards and ladder rebates stop qualifying.` →
  `On May 29, the rewards turn off. Whatever volume you've traded by then is what you get paid for.`
- CTA 保持 `Claim My Bonus →` 或改 `Take my bonus →`

- 下方 `Campaign Timeline` 模块标题 → `Timeline`（已经是上下文里的，无需"campaign"前缀）
- 中间格子 `Day 7 of 14 / reward window active` → `Day 7 of 14 / rewards active`
- 右侧 `Event Ends` → `Window closes`

### 10. MobileFloatingCTA
- 保持 `Claim My Bonus` ✅（移动端简短 CTA 没问题）

### 11. 页面 SEO meta（MainnetLaunch.tsx）
- title `OmenX Mainnet Launch — First Trade Bonus` → `OmenX Mainnet Launch — Up to $250 USDC for trading`
- description 已经 OK，可微调：`Make your first trade on OmenX mainnet and we'll send you USDC. $2–$50 guaranteed plus up to $200 in volume rebates. Ends May 28.`

---

## 三、贯穿全页的语气规则（写进 memory）

1. **不要把模块代号当 UI 文案**：`Final window`、`Reward Meter`、`Campaign position`、`Account` 这类是 spec 用语，UI 上要么删掉要么换成用户语言。
2. **避开行业黑话 / 系统术语**：`activate`、`activation threshold`、`settlement rails`、`pre-tier`、`Event 1/Event 2`、`processing` 全部翻译为人话。
3. **CTA 要随上下文递进**，不要每屏都是 `Claim My Bonus`：
   - Hero / Floating / FinalCTA → `Claim My Bonus`
   - HowItWorks → `Start my first trade`
   - ProgressDashboard → `Place a trade`
   - RewardLadder → `Start climbing`
4. **第二人称、主动语态、动词开头**："we send you" 而不是 "rewards are distributed"。
5. **规则解释用"如果你 → 我们就"句式**，不用"qualifying trade"、"reward window is fixed"这种被动公文。

---

## 四、技术落地清单

需要改动的文件（仅文案，不动结构与样式）：

- `src/components/mainnet-launch/Hero.tsx` — sub / 副信息行
- `src/components/mainnet-launch/RewardMeter.tsx` — eyebrow、卡片标题与说明
- `src/components/mainnet-launch/RewardSnapshot.tsx` — 卡片 eyebrow、动作/奖励文案
- `src/components/mainnet-launch/ProgressDashboard.tsx` — eyebrow、标题、4 项 row 标签 + CTA
- `src/components/mainnet-launch/HowItWorks.tsx` — 标题、描述、step body、CTA
- `src/components/mainnet-launch/RewardLadder.tsx` — 描述、列头、底部说明、CTA
- `src/components/mainnet-launch/TrustAndRules.tsx` — eyebrow、描述、规则 label/body
- `src/components/mainnet-launch/FAQ.tsx` — 标题、描述、Event 1/2 替换
- `src/components/mainnet-launch/FinalCTA.tsx` — eyebrow、H2、副文、timeline 标签
- `src/pages/MainnetLaunch.tsx` — `<title>` 与 meta description
- `.lovable/memory/design/campaign-landing-design-system.md` — 新增"campaign 落地页文案语气规则"小节，沉淀上面四条规则供后续 campaign 复用

确认后我会按上面的逐模块次序改文案，一次一文件，不动布局与样式。
