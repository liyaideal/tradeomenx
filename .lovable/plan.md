## Banner meta row 精简（保留原有视觉骨架）

### 保留不动
- **title**（≤ 7 词，可含数字，如 `Trade once. Earn up to $200.`）—— 这是钩子，不动
- **heroMetric**（金额 + label，如 `$5K weekly pool`）—— 视觉锚点，不动
- 整体两栏布局 / CTA / countdown 位置 / theme 系统 —— 不动

### 只改一件事：meta row

**现在的问题**：meta row 有 `[Mainnet Launch] [Live]` 两个 chip，前者和 title 重复，后者站内永远为真，两个加起来 = 0 有效信息。

**改法**：删掉 eyebrow 和 status 字段，meta row 改成只承载「资格门槛」单 chip。门槛是用户做决策时唯一不能从 title/heroMetric 推出来的信息。

| Banner | 旧 meta | 新 meta |
|---|---|---|
| Mainnet Launch | `Mainnet Launch` + `Live` | `5 winners weekly` |
| Hedge Campaign | `Hedge Campaign` + `Live` | `No deposit` |

mobile 上 meta row 仍然是 `[chip] ........ [countdown]` 左右分布；desktop 上 chip 单独左对齐，countdown 仍然在 CTA 旁。

### qualifierChip 内容规则（写进模板文档，防后续退化）

只允许 3 类，必须能通过「这条信息能从 title 或 heroMetric 推出来吗？」测试 —— 推不出来才能放：

1. **门槛**：`No deposit`、`New users only`、`Verified only`
2. **付出**：`One trade`、`5 minutes`、`First deposit`
3. **稀缺**：`5 winners weekly`、`First 1,000 users`、`Limited slots`

**禁止**：站内已知状态（Live/Active/Open）、活动分类名（Mainnet Launch/Hedge Campaign）、和 heroMetric 重复的金额、伪造的社交证明数字。

如果某个活动想不出合规的 chip，**就不放 chip**，meta row 留空（mobile 上 countdown 仍在右上）。宁可空也不堆冗余。

### 改动清单

1. `src/components/campaign/CampaignBannerCarousel.tsx`
   - `CampaignBannerConfig`: 删 `eyebrow`、`status`，加 `qualifierChip?: { text: string; tone: "accent" | "success" | "neutral" }`
   - meta row 渲染：单 chip + 可选 countdown，无 chip 时不渲染左侧元素
   - 两个 banner 数据按上表更新；title / heroMetric / countdown / cta / visual / theme 全部不变
   - aria-label 改为只用 `title`

2. `.lovable/memory/design/campaign-banner-template.md`
   - 加 qualifierChip 白名单（3 类）+ 黑名单
   - 加规则：「meta row chip 必须通过『能否从 title/heroMetric 推出』测试，不能推出才放」
   - 删 eyebrow ≤ 2 words 旧约束
