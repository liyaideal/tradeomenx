## 复盘：当前问题

| 问题 | 原因 |
|---|---|
| 头部信息重复 | 头部已有 `MAINNET` 绿胶囊，激活卡又写 `MAINNET · ACTIVATION` |
| 同一句话讲两遍 | "You're funded — make your first trade" + "One step left — place a trade to start earning" 是同义改写 |
| 当前步骤被截断 | 已完成步骤各占一整行 + 当前步骤 + CTA 按钮挤在同一行，文字被 `truncate` 切断 |
| 整页松散 | `space-y-8` 模块间距太大，section header 自带 `border-b + pb-2.5 + mb-3`，再叠 `space-y-3` 卡片，纵向被拉得很长 |
| 余额单独一框 | 余额行又是一个独立 chip，跟当前步骤割裂 |

## 设计原则（向 Robinhood/Revolut 看齐）

**Hero 卡只回答一个问题：现在该做什么。** 已完成的步骤折叠成一行进度条，标题就是 CTA 的语言，按钮就是行动本身。不重复说话、不浪费纵向空间。

---

## 1. 激活卡彻底重做（HomeAccountHub）

新结构（按从上到下）：

```text
┌─────────────────────────────────────────┐
│ STEP 3 OF 3                    $13,530  │  ← mono eyebrow + 余额(右侧 mono)
│ ●━━━━━●━━━━━○                           │  ← 进度小圆点条 (2 done, 1 active)
│                                          │
│ Place your first trade                   │  ← 大标题(就是当前步骤名)
│ Earn launch rebates after your           │  ← 单行短描述(只在能补充信息时出现)
│ first fill.                              │
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │  Browse markets               →     │ │  ← 全宽实心绿 CTA
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

具体规则：
- **删掉 `MAINNET · ACTIVATION` eyebrow**（跟头部胶囊重复）
- **eyebrow 改成 `STEP 3 OF 3`**（mono、tracking-widest、muted-foreground），右侧 mono 直接显示余额（S1+ 才显示，S0 显示 `Get started`）
- **进度条：3 个圆点 + 连线**，已完成绿色实心，进行中绿色实心+ring，未开始 muted；高度只有 8px
- **大标题就是当前步骤名**，不是 "You're funded"。S0 显示 `Verify your account` / S1 显示 `Place your first trade` / 等等。`text-xl font-semibold tracking-tight`
- **副描述只在能补充新信息时出现**（比如解释当前步骤的好处），不能是把标题换种说法。能省就省。
- **单一全宽 CTA**，不再做行内小按钮 + 步骤列表混排，避免截断
- **已完成步骤完全不展示**，进度条已经表达了完成度

视觉容器：保留 `rounded-2xl border-trading-green/25 bg-card` + 微渐变，但 padding 从 `p-5` → `p-4`，整体高度直降一半。

## 2. 头部语言改造

把"Activation"语义从激活卡里抽走后，需要一个微弱标识。方案：
- 头部 MAINNET 胶囊**保留不动**
- 不在激活卡里再说一次"Mainnet"

## 3. 整页节奏收紧

| 位置 | 旧 | 新 |
|---|---|---|
| `<main>` 间距 | `space-y-8` | `space-y-5` |
| `<HomeDiscover>` 内部 | `space-y-8` | `space-y-6` |
| SectionHeader | `mb-3 border-b pb-2.5` + 图标 chip 7×7 | `mb-2.5 pb-2 border-b` + 图标 chip 6×6，eyebrow 跟标题同一行（不换行） |
| Hot markets / Settlement 内部卡片间 | `space-y-3` | `space-y-2.5` |

## 4. SectionHeader 紧凑化

新版结构：

```text
[icon] EYEBROW  Title                      [More →]
─────────────────────────────────────────────────
```

- eyebrow 跟 title 同一行（用 ` · ` 分隔或 inline），不再上下两行
- 整个 header 高度从 ~52px 降到 ~32px
- subtitle 取消（Settlement soon 的"Last chance to trade"挪到 eyebrow：`EXPIRING SOON`）

## 5. My positions 微调

- 卡片 `space-y-3` → `space-y-2.5`，padding `p-4` → `p-3.5`
- 标题 `min-h-[2.5rem]` 取消（让短标题不再撑高度）

---

## 文件改动

| 文件 | 动作 |
|---|---|
| `src/components/home/HomeAccountHub.tsx` | **重写 ActivationCard 内部结构**：删 eyebrow 重复 / 删副标题 / 进度点条 / 大标题=步骤名 / 全宽 CTA / 不再展示已完成步骤行 |
| `src/components/home/SectionHeader.tsx` | eyebrow 与 title 同行，整体高度收紧 |
| `src/components/home/HomeDiscover.tsx` | 内部 `space-y-8` → `space-y-6`；positions 卡片紧凑 |
| `src/pages/MobileHome.tsx` | `space-y-8` → `space-y-5` |

不动：信息架构（4 层）、配色 token、HomeMore、CampaignBannerCarousel、所有业务逻辑。

## 验收

- 激活卡纵向高度比现在缩短约 40%
- 当前步骤名完整显示，不再被 `truncate`
- 头部 MAINNET 胶囊跟激活卡之间不再有重复词
- 整页第一屏能看到激活卡 + campaign banner 上半，而不是只看到激活卡
