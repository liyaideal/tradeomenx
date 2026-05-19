把 `/wallet/recovery` 和 `/wallet/recovery/:id` 改造成响应式（mobile + desktop 两套布局）。沿用 `Wallet.tsx`/`Settings.tsx` 的 desktop 规范：`EventsDesktopHeader` + 居中容器 + `BottomNav`（移动），桌面无 sticky 移动 header。

## RecoveryRequest.tsx

引入 `useIsMobile`、`EventsDesktopHeader`、`BottomNav`。

### Desktop 分支 (`!isMobile`)

```
<EventsDesktopHeader />
<main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
  Page title row: 
    - Back link "← Wallet" (text-sm muted)
    - H1 "Recovery requests" (text-2xl font-semibold)
    - Subtitle "Submit and track wrong-chain deposit recoveries." (text-sm muted)
  
  Intro card (info-style, 不再是黄色警告):
    - rounded-xl border bg-muted/30 p-5
    - Title row: Info icon + "Wrong-chain recovery service"
    - 两段说明文字，10% 用 trading-yellow 高亮
    - 关键参数用 inline pill 排成一行: "10% fee · 3–7 business days · 48h review"
  
  Section: "Your requests" 标题 + 右侧 "New request" 按钮 (h-9)
  
  - 空态: rounded-xl border bg-card/40 p-10 text-center, 加个 inbox icon + "No recovery requests yet" + sub text
  - 列表: 单列 rounded-xl border bg-card hover:bg-accent/30, padding p-4，左侧 amount + token/network + status badge + date，右侧 ChevronRight
  
  Form 展开时: 替换列表区域，标题 "New recovery request" + Cancel
</main>
```

不渲染 `BottomNav`（桌面）。

### Mobile 分支

保留现有 sticky header + 现有结构（基本不动），加 `BottomNav` 保持和 Wallet 一致。

## RecoveryRequestDetail.tsx

同样响应式：

### Desktop

```
<EventsDesktopHeader />
<main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
  Back link "← Recovery requests"
  Header row: H1 "Recovery #xxxx" + RecoveryStatusBadge
  
  两列网格 (lg:grid-cols-[2fr_1fr]):
    左侧主卡 rounded-xl border bg-card p-6:
      - Timeline (status)
      - Quote / accept-decline 区（如果 status=quoted）
      - Admin note（如果有）
    右侧 details 卡 rounded-xl border bg-card p-6:
      - Tx hash (copy)
      - Wrong network / token
      - Claimed amount (mono)
      - Sender address (truncated First6...Last6, copy)
      - User note
      - Submitted at
</main>
```

### Mobile

保留原单列布局。

## 设计约束

- 不改任何 hook / 数据逻辑 / mutation
- 颜色仍走语义 token：`border`, `bg-card`, `bg-muted/30`, `text-muted-foreground`, `trading-yellow` 仅用于 fee 数字高亮
- Typography：数字/地址 `font-mono`，标题 sentence/Title case 按现有规范
- 按钮：desktop 主按钮 `h-9 rounded-lg`，mobile 保持 `h-8`
- 不动 `RecoveryForm.tsx` / `RecoveryStatusTimeline.tsx`（form 自身已可在窄宽度工作；如桌面下太宽可包一层 `max-w-xl`）

## 文件改动

- `src/pages/RecoveryRequest.tsx` — 加 isMobile 分支 + desktop 布局
- `src/pages/RecoveryRequestDetail.tsx` — 加 isMobile 分支 + desktop 两列布局

不动：hooks、components/recovery/*、路由、数据库。
