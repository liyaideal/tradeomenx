

## /hedge 页面"AI 感重 + 不吸引人"诊断与重构方案

### 一、根因诊断（为什么看起来像 AI 写的）

**1. 模板化结构 — 8 个 section 全部"标题居中 + 副标题 + 卡片网格"**
Hero → How it Works → Live Example → Trust Bar → Key Rules → FAQ → Campaign Rules → Final CTA。每个 section 都是「居中 h2 + 灰色 muted 副标题 + 一行 grid 卡片」，节奏完全一致，看 3 屏后大脑自动跳过。

**2. 视觉语言极度均质**
- 几乎每个 section 都用 `rounded-2xl border border-border/40 bg-card`
- 每个图标都用 `bg-primary/10 text-primary` 圆角方块容器（HowItWorks/TrustBar/KeyRules 全一样）
- 整页只有 primary 一个强调色，绿色/红色只在 LiveExample 用了一次
- 全是占位符（"BTC > $100K"反复出现 4 次），无真实截图、无人脸、无实盘数据

**3. 文案是"营销 GPT"标准腔**
- "Three steps. No deposit. No catch." / "Six rules. Zero hidden terms." / "The fine print isn't fine print" — 全是工整的 3-5-7 字对仗短句
- 缺数字钩子：通篇看不到"已发放 X USDC"、"Y 个用户已领取"、"今日剩余 Z 份"
- 缺紧迫感：只有 Final CTA 末尾一行小字提"limited"，没有真实倒计时或剩余配额

**4. 缺少"人"和"证据"**
- 没有用户截图 / Twitter 推文 / Discord 真实对话
- 没有团队信息 / 联创头像 / 公开承诺
- "Why you can trust us" 4 个理由全是抽象概念（Read-only / Real USDC / On-chain proof / Open audit），无可点击验证的链接

**5. 重复内容稀释吸引力**
- Hero 右侧已有 Polymarket↔OmenX 双卡演示
- LiveExample 又来一遍同样的双卡（更大、更详细）
- KeyRules 6 条 + CampaignRules 又把 6 条详细化重写一遍
- HedgeCTAButton 出现了 5 次，按钮疲劳

**6. 价值主张表述偏弱**
"Got a Polymarket position? We'll hedge it — for free." 是功能描述，不是用户痛点。Polymarket 用户的真实痛点是：**"赢了一半还是亏的（YES 涨到 $0.95 卖不出好价）"、"想锁利润但平台流动性差"** —— 我们没有戳到这些。

---

### 二、重构方案（按 ROI 排序，分阶段执行）

#### Phase 1 — 高 ROI 改动（必做）

**A. 重写 Hero 价值主张**
- 主标题改成痛点 + 钩子：`Holding a Polymarket bet? Lock in profit — on us.`
- 副标题：`We'll airdrop you a free counter-position worth up to $10. Win or lose, you walk away with real USDC.`
- 加一行**实时数据条**（mock）：`$47,320 distributed · 1,284 users claimed · 213 spots left today`
- 把 4 个 trust signal 合并成 Hero 下方一行 inline 小字 + 链接（"EIP-712 read-only · Settled on Base · View on-chain audit →"）

**B. 删除 HedgeTrustBar section**
- 内容并入 Hero 上述 inline 小字
- 砍掉一个完整 section，节奏立刻改善

**C. 合并 KeyRules + CampaignRules**
- 现在「6 条精简 + 同样 6 条详细」严重重复
- 改为：保留 KeyRules 的 6 条卡片视觉，每条点击展开 = CampaignRules 对应详情段落（accordion）
- 删除独立的 HedgeCampaignRules section
- III. Risk & Disclaimer 折叠为页面末尾一个 `<details>` 小字

**D. 砍多余 CTA**
- 现在 5 个 CTA（Hero / HowItWorks 末尾 / KeyRules 末尾 / FinalCTA / 移动浮动）
- 删除 HowItWorks 和 KeyRules 末尾的 CTA，只留 Hero / FinalCTA / 浮动

**E. LiveExample 注入"人味"**
- 替换占位符为真实活跃 market 标题（如当时热门的政治/体育/加密事件，由运营提供）
- Scenario 卡片底部加引用："*'Held my Trump 2028 long, hedged with OmenX, made $8 when it dipped.'* — @cryptotrader_xyz"（标注 mock，运营后续替换）
- 删掉"You have nothing to lose. Literally."这种 AI 腔，换成数据：`Average claim settled +$6.40 within 7 days`

#### Phase 2 — 视觉破均质（强烈推荐）

**F. Hero 下方加 RecentActivity feed bar**（新文件 `HedgeRecentActivity.tsx`）
- 横向自动滚动的窄条（深色背景），mock 数据：`@user_a claimed $10 · @user_b settled +$7.20 · @user_c just linked Polymarket · ...`
- 立刻有"交易所最近成交"那种活感

**G. HowItWorks 改横向连线**
- 不再是 3 张同款卡片，改成大数字 1 → 2 → 3 横向连线（去掉每张卡的图标方块）
- 打破"卡片网格"模板感

**H. FAQ 背景换 `bg-card`（深色）**
- 现在 8 个 section 一半 `bg-muted/20`、一半 `bg-background`，灰度均质
- FAQ 改深色制造节奏对比

**I. KeyRules 6 条 check 颜色分组**
- 第 1-3 条（资格类）用 trading-green check
- 第 4-6 条（奖励类）用 primary check
- 视觉立刻分组

#### Phase 3 — 信任与社交证明（可选，最强反 AI 信号）

**J. 新增 FoundersNote section**（替代 TrustBar 位置）
- 第一人称短文 80-120 字：为什么做这个活动 + 资金来源 + 公开承诺
- 旁边放 Discord 链接、X 账号、链上金库地址（可点击跳 Basescan）
- AI 写不出"具体地址 + 个人语气"，这是最强反 AI 信号

**K. Social proof 条带**
- FAQ 之前加 3 张推文/Discord 截图（静态 `<img>`，不需要嵌入 SDK）
- 占位符待运营提供真实截图

---

### 三、最终 section 顺序

```
Hero (痛点 + 实时数据条 + inline trust)
  ↓
RecentActivity (横向 feed bar)        [Phase 2 新增]
  ↓
HowItWorks (3 步横向连线，无尾部 CTA)
  ↓
LiveExample (真实 market + 真实引用)
  ↓
FoundersNote (第一人称信任)            [Phase 3 新增]
  ↓
KeyRules (可展开 accordion，吸收 Campaign 详情，无尾部 CTA)
  ↓
SocialProof (推文截图)                  [Phase 3 新增]
  ↓
FAQ (深色背景)
  ↓
FinalCTA + disclaimer <details>
```

### 四、文件改动清单

| 优先级 | 文件 | 操作 |
|---|---|---|
| P0 | `HedgeHero.tsx` | 改主副标题 + 加实时数据条 + 加 inline trust 小字 |
| P0 | `HedgeTrustBar.tsx` | **删除** |
| P0 | `HedgeKeyRules.tsx` | 改为 accordion，吸收 CampaignRules；6 条按颜色分两组；删尾部 CTA |
| P0 | `HedgeCampaignRules.tsx` | **删除**（合入 KeyRules + 末尾 `<details>` disclaimer） |
| P0 | `HedgeHowItWorks.tsx` | 删尾部 CTA；3 卡改横向连线（去图标方块） |
| P0 | `HedgeLiveExample.tsx` | 替换为真实 market + testimonial 引用 + 删 AI 腔结尾 |
| P0 | `HedgeLanding.tsx` | 移除 TrustBar、CampaignRules 引用；调整顺序 |
| P1 | `HedgeRecentActivity.tsx`（新） | 横向滚动 mock feed |
| P1 | `HedgeFAQ.tsx` | 背景改 `bg-card` |
| P2 | `HedgeFoundersNote.tsx`（新） | 第一人称信任段落 + 链上信息 |
| P2 | `HedgeSocialProof.tsx`（新） | 静态推文截图条带 |

### 五、不改动

- HedgeCTAButton 三状态逻辑（auth → connect → navigate）
- HedgeMobileFloatingCTA 悬浮行为
- EventsDesktopHeader / SeoFooter
- 不引入新依赖；mock 数据写常量，运营可改

### 六、需要你确认的 3 件事

1. **执行范围**：只做 Phase 1（最小止血），还是 Phase 1+2（推荐），还是 Phase 1+2+3（全套）？
2. **实时数据**：Hero 数据条和 RecentActivity 用 ① 全 mock 写死、② mock 但按日期 seed 微随机、还是 ③ 接 Supabase 真数据（工时多）？
3. **LiveExample 引用**：① 用明显 mock 的 @用户名（标注待替换）、② 完全删掉引用、还是 ③ 留位置 + TODO 注释等运营提供？

