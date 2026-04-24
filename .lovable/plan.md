

## /hedge 页面新增「Campaign Rules」详细规则模块

### 放置位置建议

**插入位置：`HedgeFAQ` 之后、`HedgeFinalCTA` 之前**

理由：
- FAQ 解决"快速疑问"，规则模块承载"完整法律条款"，两者性质相邻，自然递进
- 放在 Final CTA 之前，让用户在最终行动前能找到完整条款（合规友好）
- 不打断 Hero → How it Works → Live Example → Trust → Key Rules → FAQ 的转化漏斗
- 与现有 `HedgeKeyRules`（6 条精简规则）形成"概要 → 详情"的层级关系，避免重复

### 新增组件

**文件**：`src/components/hedge/HedgeCampaignRules.tsx`（新建）

**结构**：纯文字排版，不加图标/卡片堆叠，遵循 `legal-prose` 风格基调
- Section 容器：`border-b border-border/40`，与其它 section 一致
- 内容容器：`max-w-3xl mx-auto px-4 py-16 md:py-24`
- 标题：`Campaign Rules`（h2，与其它 section 标题同级），副标题 `Full terms for the Hedge-to-Earn program`
- 正文：3 大块（I/II/III），每块用 h3 标题，内部用 `<ol>`/`<ul>` 有序列表
- 字号：标题用 `text-foreground`，正文 `text-sm md:text-base text-muted-foreground leading-relaxed`
- 数字/金额/时间：用 `font-mono text-foreground`（如 `$200`、`72 hours`、`$100`、`May 31, 2026 23:59 UTC+8`、`150,000 USDC` 等），与现有 `HedgeKeyRules` 一致
- Discord/外链：使用 `<a>` 标签 + `text-primary hover:underline`
- 末尾加一行小字 disclaimer：`Last updated: Apr 2026 · OmenX reserves the right of final interpretation.`

### 文案（EN 翻译草稿）

**Heading**: Campaign Rules

**I. Eligibility**
- Open to invited users in supported regions only. Users in restricted jurisdictions cannot participate.

**II. Reward & Settlement Rules**
1. Airdrop positions are **simulated positions** used solely to track PnL — they do not lock real funds. They cannot be traded, closed, increased, or reversed. The airdrop direction is always **opposite** to the user's original Polymarket position (e.g. if you are LONG BTC > $100K on Polymarket, the airdrop will be SHORT).
2. Once your Polymarket account is linked, the system scans your positions **every 15 minutes**. Airdrops are issued only after a scan confirms eligibility — actual delivery time prevails. A maximum of **3 airdrops** can be issued per account during the campaign.
3. After issuance, users must **manually claim** the airdrop within the campaign period. Unclaimed airdrops expire automatically and cannot be reissued.
4. **Settlement triggers**:
   - **Event settlement** — when the corresponding Polymarket event resolves.
   - **Original position close** — when the system detects the user has reduced their original Polymarket position by **≥ 80%**, PnL is calculated at that moment's Market Price.
5. Settled positive PnL is credited to the user's OmenX trading balance, capped at **$100 per account** (lifetime).
6. **Unlock threshold**: settled PnL becomes tradable/withdrawable only after the user reaches **≥ $400,000** cumulative trading volume on OmenX.
7. Unlocked balance **expires on May 31, 2026 23:59 (UTC+8)**. Any unused portion is forfeited.
8. Daily issuance is capped at **500 airdrops platform-wide**. No new airdrops are issued once the daily cap is reached.
9. Total reward pool: **150,000 USDC**. When the pool is exhausted the campaign ends early, and any locked PnL that has not been unlocked will become unusable.
10. Airdrops can be viewed via in-app notifications and the **Positions** page.

**III. Risk Control & Disclaimer**
1. Users flagged by our risk-control system for abnormal behavior will be disqualified and forfeit all rewards.
2. If the platform determines that a user has engaged in cheating or violations, OmenX reserves the right to disqualify them and claw back distributed rewards without prior notice.
3. Disputes regarding rewards must be submitted via our [Discord](https://discord.gg/j658YbRY) within **7 days** of campaign end. Late submissions are treated as waiver.
4. OmenX reserves the right to modify these rules at any time without prior notice.
5. The final interpretation of this campaign belongs to OmenX.

### HedgeLanding 改动

**文件**：`src/pages/HedgeLanding.tsx`

```tsx
import { HedgeCampaignRules } from "@/components/hedge/HedgeCampaignRules";

// ...
<HedgeFAQ />
<HedgeCampaignRules />   {/* ← 新增 */}
<HedgeFinalCTA />
```

### 不改动

- 不动 `HedgeKeyRules`（精简版仍是营销利器）
- 不动 FAQ / FinalCTA / Hero 等
- 不引入图标、卡片、Accordion（用户明确要求"纯文字排版"）
- 不接后端，运营修改时直接改 `HedgeCampaignRules.tsx` 文案常量

### 预期效果

- 用户在转化漏斗末端能看到完整、可读性强的合规规则
- 运营/法务后续维护时只改一个文件即可
- 与 KeyRules（速览）+ FAQ（高频疑问）+ CampaignRules（详尽条款）形成完整三层信息架构

