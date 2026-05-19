## 问题
`/style-guide` 的 MobileHome 区域目前是把每个模块（Header / HomeGreeting / PersonalSlot / CampaignRail / TopEvents）单独 playground，缺一个**组合预览** —— 看不到"在某个用户状态下，整页是怎么拼出来的、哪个模块出现、哪个隐藏"。截图里的 PersonalSlot 卡片就是这种孤立状态，无法回答"什么时候真正会看见这张卡 / 不会看见"。

## 改动范围
仅改 `src/pages/StyleGuide/sections/MobileHomeSection.tsx`，新增一个置顶的 **"Composed Preview"** SubSection；现有 5 个独立 playground 保留不动。

### 1. 新增 Composed Preview（在 Page Skeleton 之后、HomeGreeting 之前）
- 顶部 State 切换器（5 个 chip）：
  - `Guest`
  - `S0_NEW`（已登录、未充值）
  - `S1_DEPOSITED`（已充值、未交易）
  - `S2_TRADED`（已交易、volume < $5k，含持仓）
  - `S3_ACTIVE`（volume ≥ $5k，含持仓）
- 在一个 `<Frame>`（mobile 360px）里**完整组合**：HeaderReplica → HomeGreeting → PersonalSlot → CampaignRail → TopEvents，按真实 `mt-3 / mt-5` 间距。
- 每个状态用一张组合表驱动现有 4 个 replica（复用 `HomeGreetingGuest/Authed`、`OnboardingCardReplica`、`PositionAlertReplica`、`CampaignBannerReplica`、`TopEventsReplica`），不引入新替身。

### 2. 组合表（驱动逻辑，纯展示用）
```text
State          Greeting             PersonalSlot         TopEvents title              Interlude
Guest          guest                — (empty:hidden)     Top Events                   TrialCallout
S0_NEW         authedEmpty          OnboardingCard       Pick your first prediction   —
S1_DEPOSITED   authedEmpty          OnboardingCard       Pick your first prediction   —
S2_TRADED      authedActive         PositionAlertCard    Top Events                   —
S3_ACTIVE      authedActive         PositionAlertCard    Top Events                   —
```
表下方加一段 caption 直接列出"此状态下 PersonalSlot 显隐 / TopEvents title / Interlude"，回答"到底怎么展示"。

### 3. 在现有 PersonalSlot SubSection 里补充
- 在 Resolution order 下加一行小注："想看整页效果请回到顶部 Composed Preview"，避免用户在孤立卡上误判。

## 不动
- `MobileHome.tsx` 业务代码
- `useActivationState` / 数据层
- 其他 StyleGuide section
- 现有 replica 组件本身

## 交付
单文件 diff：`src/pages/StyleGuide/sections/MobileHomeSection.tsx`（约 +120 行）。
