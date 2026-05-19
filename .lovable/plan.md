# Wrong-Chain Deposit Recovery 方案

统一收取 **10% recovery fee**，分三块交付：充值前强制拦截、用户申请流程、管理员状态机。

---

## 1. 充值前：强制 Checklist 拦截

修改 `src/components/deposit/WalletDeposit.tsx`：

把现在单一的"I understand"按钮，替换成 **3 条独立 checkbox**，全部勾选才解锁地址：

- I'm sending **USDC** (not USDT, ETH, BNB, or any other token)
- I'm using the **Base network** (not Ethereum, BSC, Polygon, Arbitrum, or any other chain)
- I've verified the contract address `0x8335...2913`

ack 状态 key 升级为 `omenx:deposit:base-usdc-warning-ack-v2`（旧 ack 失效，所有用户重新勾一次新版）。

---

## 2. 数据库：recovery_requests 表

```sql
create table public.recovery_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  
  -- 用户提交内容
  tx_hash text not null,
  wrong_network text not null,         -- e.g. "Ethereum", "BSC", "Arbitrum"
  wrong_token text not null,           -- e.g. "USDT", "ETH"
  claimed_amount numeric not null,
  sender_address text not null,        -- 用户的 source 钱包
  user_note text,                      -- 用户备注
  
  -- 系统/管理员处理
  status text not null default 'submitted',
    -- submitted | reviewing | quoted | accepted | rejected | processing | completed | unrecoverable
  fee_percent numeric not null default 10,
  estimated_return numeric,            -- 报价金额（claimed_amount * 0.9）
  admin_note text,                     -- 拒绝/沟通理由
  processed_tx_hash text,              -- 入账时的内部 tx
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  quoted_at timestamptz,
  accepted_at timestamptz,
  completed_at timestamptz
);
```

**RLS**：

- 用户：SELECT/INSERT 自己的（`auth.uid() = user_id`）
- 用户：UPDATE 仅允许把 `status: quoted → accepted/rejected`（用 trigger 限制可改字段）
- 管理员：ALL（`has_role(auth.uid(), 'admin')`）

**updated_at trigger**：复用现有 `update_updated_at_column()`。

---

## 3. 用户端：申请流程

### 入口（两处）

- `WalletDeposit.tsx` 底部小字链接
- `PendingConfirmations.tsx` 卡片底部加 inline 链接 "Sent to wrong network? → Request recovery"

### 新页面 `/wallet/recovery` （`src/pages/RecoveryRequest.tsx`）

顶部说明卡（必读）：

```
Wrong-chain recovery service
We can attempt to retrieve funds sent to the wrong network or with the wrong 
token. A flat 10% recovery fee applies (covers source-chain gas, bridge cost, 
and manual processing). Estimated processing time: 3–7 business days.

We cannot recover funds sent to chains we don't operate on 
(e.g. Solana, Tron). We'll review and let you know within 48h.
```

### 表单字段

- Transaction hash (`tx_hash`) — required, 校验 0x + 64 hex
- Wrong network — required, Select（Ethereum / BSC / Polygon / Arbitrum / Optimism / Other）
- Wrong token sent — required, Select（USDT / USDC / ETH / BNB / Other → 文本框）
- Amount sent — required, numeric > 0
- Your sending wallet address — required, 0x address 校验
- Additional notes — optional, max 500 chars

提交按钮下方显示实时报价预览：

> Estimated return: **$XX.XX** (after 10% fee). Final amount may vary based on network costs.

提交后跳转 `/wallet/recovery/:id` 状态页。

### 申请列表 + 状态页

- `/wallet/recovery` 顶部展示用户历史申请列表（紧凑卡片）
- 点击进入 detail 页，显示 6 阶段状态条：
  ```
  Submitted → Reviewing → Quoted → Accepted → Processing → Completed
  ```
  失败分支：`Rejected` / `Unrecoverable`（红色 terminal 态）
- `quoted` 状态：用户看到管理员报价 + Accept / Decline 按钮
- `completed`：显示入账 tx 链接

---

## 4. 管理员端：状态机

新增 `src/pages/admin/RecoveryAdmin.tsx`（route：`/admin/recovery`，受 `has_role(admin)` 保护）：

- 列表：所有 requests，按 status 分组（pending / actionable / done）
- 详情：可执行操作
  - `submitted → reviewing`（点击"Start review"）
  - `reviewing → quoted`（填写 `estimated_return` + 提交）
  - `reviewing → unrecoverable`（填 `admin_note` 解释为什么不能处理，例如"Solana 链不支持"）
  - `accepted → processing`（开始链上操作）
  - `processing → completed`（填 `processed_tx_hash`，触发给用户 profile 余额加款）

`completed` 时同步：

- `INSERT INTO transactions (type='recovery_credit', amount=estimated_return, status='completed', ...)`
- `UPDATE profiles SET balance = balance + estimated_return WHERE user_id = ...`

通过 edge function `process-recovery-completion` 原子化处理（service role）。

---

## 5. 文件清单

**新增**

- `src/pages/RecoveryRequest.tsx` — 列表 + 入口
- `src/pages/RecoveryRequestDetail.tsx` — 单个申请状态页
- `src/pages/admin/RecoveryAdmin.tsx` — 管理后台
- `src/components/recovery/RecoveryForm.tsx`
- `src/components/recovery/RecoveryStatusTimeline.tsx`
- `src/hooks/useRecoveryRequests.ts`
- `supabase/functions/process-recovery-completion/index.ts`

**修改**

- `src/components/deposit/WalletDeposit.tsx` — 3 条 checklist + 底部入口
- `src/components/wallet/PendingConfirmations.tsx` — 卡片底部入口
- `src/App.tsx` — 注册新路由

**Migration**

- 创建 `recovery_requests` 表 + RLS + updated_at trigger

---

## 不在本次范围

- 自动错链检测（扫其他链余额）— 后续迭代
- 邮件/Toast 通知用户状态变更 — 复用现有邮件基础设施另开 task
- 退款流程（用户提交后想撤回）— v2

## 待你确认的最后一点

"管理员"角色目前 `user_roles` 表已有 `admin` enum，但项目里**没有 admin UI**。本计划会建一个最小后台页面 `/admin/recovery`。这个页面需要建立在另外一个项目里，这个需求我们分开实现。 