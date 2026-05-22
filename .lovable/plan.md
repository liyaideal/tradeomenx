## 目标

把 `CampaignStyleGuide/Playground.tsx` 里 `RewardLadderDemo` 和 `ProgressDashboardDemo` 现在的横滑按钮（14 个 preset chip）改成一根**可拖动的交易量滑杆**，研发拖到任意 volume 都能立刻看到组件在该状态下的真实表现，包括所有边界状态。

## 交互设计

滑杆控件 `VolumeSlider`（基于现有 shadcn `Slider`），统一放在 demo 顶部：

```text
TRADE VOLUME                                       $ 120,000
[●────────────────────────────────────────────]
$0    $5K   $10K   $50K   $100K   $300K   $500K   $1M   $1.5M
      bonus  t1     t2     t3      t4      t5      top
```

- **范围**：$0 → $1,500,000，`step = $500`（细到能停在 $4,999 / $5,000 / $9,999 边界）。
- **非线性映射**：用分段函数把 slider 0–100 映射到 volume，让低区（$0–$10K，含 $5K 门槛和 t1）占 ~40% 行程，避免拖到一半还没出第一个 tier。
- **刻度标记**：滑杆下方画出关键节点 tick（$0 / $5K bonus / 每个 tier / past-top），点击 tick 直接跳到该 volume——保留"一键回到典型状态"的能力，同时支持自由拖。
- **实时状态徽章**：滑杆右侧展示当前 volume 对应的**派生状态**，研发不用对照源码就能看懂：
  - `state` = GUEST / PRE_BONUS / BONUS_UNLOCKED / NO_TIER / TIER_n / TOP_TIER / PAST_TOP
  - `currentTier` / `nextTier` / `progressToNext%` / `volumeToNext`
  - `event1Qualified` (true/false)
  - ProgressDashboard 的渲染分支（renders component / renders null）
- **键盘**：← → 步进 $500，Shift+← → 步进 $10K，方便精细调试。

## 受影响范围

只动一个文件：`src/pages/CampaignStyleGuide/Playground.tsx`

- 新增内部组件 `VolumeSlider`（含 tick rail + 状态徽章面板），抽掉旧的 `VOLUME_PRESETS` 按钮分发逻辑。
- `RewardLadderDemo` / `ProgressDashboardDemo` 把 `pid` state 换成 `volume: number`，其余 props 计算不变。
- Countdown demo **保留 `PresetRail` 横滑按钮**——倒计时是离散场景（>7d / <1h / ended），滑杆不合适。
- `PresetRail` 仍然保留（Countdown 在用），`VOLUME_PRESETS` 改造成 `VOLUME_TICKS`（label + volume + 颜色），只用于在滑杆下方画刻度。

## 状态推导（统一函数）

新增 `deriveVolumeState(volume)` 返回：

```ts
{
  state: "GUEST" | "PRE_BONUS" | "BONUS_UNLOCKED" | "NO_TIER"
       | "TIER_1" | "TIER_2" | ... | "TOP_TIER" | "PAST_TOP",
  currentTier, nextTier, progressToNext, volumeToNext,
  event1Qualified, dashboardRenders: "component" | "null",
}
```

Ladder demo 和 Dashboard demo 共享同一份推导，确保两边展示一致。

## 记忆更新

更新 `mem://design/playground-state-coverage`：在"状态覆盖"原则上加一条——**连续型参数（交易量、价格、时间余量）首选 slider + tick；离散型参数（已结束/未开始、tier 命中点 demo）才用 PresetRail 按钮**。两种形态都要在右侧/下方实时展示当前派生状态，避免研发反查源码。

## 验证

在 1021×777 viewport（用户当前 viewport）下检查：
1. 拖到 $0、$4,999、$5,000、$8,000、$10,000、$1,000,000、$1,500,000，Ladder 高亮、ProgressDashboard 渲染/null 切换、状态徽章文本均正确。
2. 点击每个 tick 都能精确落到对应 volume。
3. 键盘 ← → / Shift+← → 步进正确。
4. 移动 viewport 下滑杆和状态面板自适应竖排，不溢出。
