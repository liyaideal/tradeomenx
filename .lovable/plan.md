## 目标
把左侧 voucher rail 的 compact 卡片重做成"两区票券（two-zone stub v2）"风格，保留全部 4 个字段：**Face value / Expires in / Voucher code / Max payout**。

## 视觉结构（每张卡）

```
┌─────────────────────────────────────────┐  ← selected 时顶部居中一小段 primary tab 指示
│ FACE VALUE              ●  167h 53m     │
│ $10.00                                  │
│                                         │
○─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─○  ← 虚线穿孔 + 左右半圆缺口（背景色挖空）
│ VOUCHER CODE         MAX PAYOUT         │
│ [ 6D96F701 ]                  [ $5.00 ] │  ← 都包在小 chip 里
└─────────────────────────────────────────┘
```

- **上区**：左侧 `Face value` 小标签 + `$10.00`（mono，4xl，bold，主色）；右侧倒计时 chip — 普通态 `Clock` icon + muted；urgent 用 `trading-red` 配 ping 脉冲点。
- **穿孔**：`border-dashed` 横线 + 左右各一个 `bg-background` 圆形缺口，营造票根撕线。
- **下区**：左 `Voucher code` chip（mono，tracking-widest，bordered）；右 `Max payout` chip（mono，`trading-green`）。selected 时整条下区加 `from-primary/[0.03] to-primary/[0.08]` 微渐变。

## 状态规范
| 状态 | 边框 | 内容色 | 其他 |
|---|---|---|---|
| **Selected** | `border-primary/40` + `shadow-[0_0_25px_-5px_hsl(var(--primary)/0.35)]` | 全亮 | 顶部 primary tab 指示；下区 primary 微渐变 |
| **Default** | `border-border/60` + `opacity-60` | muted | hover → `opacity-100` + `border-border` |
| **Urgent (<2h)** | — | 倒计时变红 | 红色 ping 脉冲点 |

## 改动范围
- **仅** `src/components/vouchers/VoucherCard.tsx` 的 `if (compact)` 分支整段重写为上述结构。
- 全部颜色走语义 token：`primary` / `foreground` / `muted-foreground` / `border` / `background` / `card` / `muted` / `trading-red` / `trading-green`。不写裸 hex。
- 字体：所有数字 / 券号 `font-mono`（JetBrains Mono），标签 `font-sans`。
- 图标：`Clock` 用 lucide-react，符合 "NO EMOJIS" 规则。

## 不改的地方
- `VoucherCard.tsx` 的非 compact full 分支、`RedeemVoucherContent.tsx` 右侧详情面板、`Vouchers.tsx` 布局、mobile snap rail、数据层、redeem 流程、seed migration 一概不动。
- DESIGN.md / memory：暂不写入，先在线上看几张真实卡片，确认观感稳定再沉淀规则。
