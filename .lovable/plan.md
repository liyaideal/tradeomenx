## 你说得对——我违规了

DESIGN.md 第 471 行起明确定义了 `<MobileHeader>` 的 **A/B/C** 三个 preset，但完全没有写 `HomeKPIHeader` 这个新 header 的规范（它是前几轮新建的、专门给 `/` 用的"Preset A 变体"），StyleGuide 里也没有它的展示。

我刚才直接把 padding、字号、KPI 卡都加大了，这在没有 source-of-truth 的情况下，本质是给 `/` 单点打补丁，会和未来其他页面出现的 hub header 不一致。我提议两步走，**先回退、再立规范**：

### Step 1 — 回退 KPI Header 视觉改动

把 `src/components/home/HomeKPIHeader.tsx` 还原到上一个版本（`px-4 pt-3 pb-3` / `text-[26px]` / 右上角 `7D +1.9%` 小字 / 不带 Available 分组卡）。让你能在干净的基线上决策。

### Step 2 — 选一条规范路径（**我需要你定**）

> 因为这一步会影响 DESIGN.md 和 StyleGuide，必须由你拍板，不再自己发挥。

**路径 1 · 砍掉 HomeKPIHeader，回到 Preset A**
- `MobileHome` 改用 `<MobileHeader showLogo showBack={false} rightContent={...} />`，和 `/events /portfolio /leaderboard /wallet` 完全一致。
- KPI（Total Equity + 7D PnL）下沉为 `<HomeAccountHub>` 的一部分，不再占 header。
- 优点：零新规范，零不一致；缺点：首屏第一眼看不到余额。

**路径 2 · 正式新增 Preset D"Home Hub with KPI"**
- 在 DESIGN.md "Mobile Header Presets" 表里新增一行 **Preset D**，仅限 `/` 使用，明确：两行结构（brand row + KPI row）、字号阶梯（label `text-[10px]`、数字 `text-[26px]` 或 `text-4xl`、PnL `text-xs/sm`）、padding（`px-4 pt-3 pb-3` 或 `px-5 pt-5 pb-5`）。
- 在 `StyleGuide/sections/MobilePatternsSection.tsx` 加一个 Preset D Playground，把组件展示出来。
- 然后再在这个规范基础上做"大气化"——选 26px 还是 36px、要不要 Available 分组卡，由规范一次性定死。

**路径 3 · 维持现状不立规范**
- 接受 `/` 是"特例"，但 DESIGN.md 加一条注释指明这是默认中性版本，未来不要在其他地方复用，也不要再调整视觉。
- 我立刻按这条加注释，不动视觉。

### 不动项

- 不重新调 `HomeOnboardingStrip / HomeAirdropStrip / CampaignBannerCarousel`。
- 不动 `<MobileHeader>` 现有 A/B/C preset 的代码或规范。
- Step 1 回退会立刻执行；Step 2 等你选。
