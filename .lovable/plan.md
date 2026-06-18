## 改动 1：删除 Reward Tiers 模块

现在的"THE BIGGER YOUR EXPOSURE, THE BIGGER THE HEDGE." (Tier 1 / Tier 2 / Top Tier) 模块基于已废弃的分 tier 逻辑，实际上 reward cap 在 Key Rules 里已经写明（最多 500U，受 hedge 表现和活动规则限制），再用一整屏卡片重复展示反而会误导用户以为有 tier 划分。

- 从 `src/pages/HedgeLanding.tsx` 移除 `<HedgeRewardTiers />` 渲染和 import
- 从 `src/pages/CampaignStyleGuide/Playground.tsx` 移除 RewardTiers 演示
- 删除 `src/components/hedge/HedgeRewardTiers.tsx` 文件

后续 voucher 赚到的钱按交易量解锁兑现的逻辑，已有 `voucher-earnings-pool` memory（T1–T4 阶梯）覆盖，不在本次落地范围内，等做 Portfolio / Airdrop 那块的时候再实现。

## 改动 2：统一 How to qualify 与 Quick answers 的容器宽度

当前页面其它 section 都用 `max-w-7xl`（Hero / How it works / Final CTA），只有这两个模块定宽且互不一致：

| 模块 | 当前 max-width |
|---|---|
| HedgeKeyRules（How to qualify） | `max-w-5xl` |
| HedgeFAQ（Quick answers） | `max-w-3xl` |

把这两个 section 的外层容器都改成 `max-w-5xl`，理由：
- FAQ 行如果拉到 `max-w-7xl`，一行问题文字过长，阅读节奏会断
- KeyRules 卡片在 `max-w-5xl` 下已经验证视觉 OK
- 两者统一到 `max-w-5xl` 后，下半页（Rules → FAQ）形成一个收口的"阅读区块"，和上半页（Hero / How it works）的全宽宣发区形成层次对比，这正是用户提到的"层次感"做法

具体编辑：
- `src/components/hedge/HedgeFAQ.tsx:31` `max-w-3xl` → `max-w-5xl`
- KeyRules 已是 `max-w-5xl`，保持不变

## 验证

实现后用浏览器截图复核：
- 滚动到 How to qualify → Quick answers，两者左右边界对齐
- 页面不再出现 Reward Tiers 三卡片区
- Playground 不再引用已删除的组件
