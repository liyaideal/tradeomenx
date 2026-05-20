## 背景

你提的对——既然 `fee_percent = 10` 是固定常量，`estimated_return = claimed_amount * 0.9` 完全可以前端算出来，根本不需要 "quoted → 用户 accept → processing" 这条审批链。

当前 8 个 status（`submitted / reviewing / quoted / accepted / rejected / processing / completed / unrecoverable`）对应的管理员动作其实只有两种：
- "钱到账了，已转给用户" → completed
- "搞不定 / 不符合规则" → rejected

中间所有节点都是冗余的过程信号。

## 精简后的状态机（3 个状态）

```text
submitted ──► completed
          └─► rejected
```

| status      | 含义                                       | 触发方                |
| ----------- | ------------------------------------------ | --------------------- |
| `submitted` | 用户提交，团队处理中（含审核 + 链上找回）  | 用户提交              |
| `completed` | 资金已到账用户余额                         | 管理员（1 次点击）    |
| `rejected`  | 无法找回（混合原 rejected / unrecoverable，用 `admin_note` 说明原因） | 管理员（1 次点击）    |

去掉：`reviewing`、`quoted`、`accepted`、`processing`、`unrecoverable`。

管理员动作：原来一笔要点 3~4 次 → **现在 1 次**（complete 或 reject）。

## 用户端 UX 影响

- 提交后用户看到的就是 `Submitted · Processing recovery`（不再分多个微步骤）
- 找回金额（90% 净到账）在提交那一刻就在详情页显示出来 —— 因为可以算，不需要等"报价"
- 完成时收到 toast / 邮件，详情页变 `Completed` + 显示到账金额
- 被拒时显示 `Rejected` + 团队的解释文本（`admin_note`）

把"等报价 + 看报价 + 接受/拒绝"这套流程整个砍掉，确实更顺。

## 改动范围

### 数据库（migration）

1. 数据迁移（把现有非终态记录归并到 `submitted`，非完成终态归并到 `rejected` / `completed`）：
   ```sql
   update recovery_requests
     set status='submitted'
     where status in ('reviewing','quoted','accepted','processing');
   update recovery_requests
     set status='rejected'
     where status='unrecoverable';
   ```
2. 加 CHECK 约束限制为 3 个值：
   ```sql
   alter table recovery_requests
     add constraint recovery_status_chk
     check (status in ('submitted','completed','rejected'));
   ```
3. 更新 `enforce_recovery_request_user_update()` 触发器：
   - 删掉 `quoted → accepted/rejected` 这条分支
   - 非管理员对 `status` 的任何修改都直接拒绝（用户没有任何 status 改写权限了）
4. 可选：`quoted_at` / `accepted_at` / `fee_percent` / `estimated_return` 这些列短期保留以兼容历史数据，新流程不再写入

### Hook 改动 `useRecoveryRequests.ts`

- `RecoveryStatus` 缩为 `'submitted' | 'completed' | 'rejected'`
- 删除 `respondToQuote` mutation 和相关导出
- `useRecoveryRequest` / `useRecoveryRequests` 其它部分保持不变

### 组件改动

**`RecoveryStatusTimeline.tsx`**
- STEPS 缩成 2 步：`Submitted → Completed`
- `RecoveryStatusBadge` 配色：
  - `submitted` → primary (Loader2 旋转图标 + "Processing")
  - `completed` → trading-green
  - `rejected` → destructive

**`RecoveryRequestDetail.tsx`**
- 删掉整段 `quoteCard`（Quote received / Accept / Decline 按钮）以及 `onAccept` / `onDecline`
- 在 `detailsCard` 里增加一行 "You will receive" = `claimed_amount * 0.9`（提交时就显示）
- `creditedCard` 仍在 `status === 'completed'` 时显示

**`RecoveryForm.tsx`**（如有"预估到账"显示同步用 90%）

**`RecoveryRequest.tsx` 列表**
- 状态 badge 用新映射；其它不动

## 不动的东西

- 路由、URL、RLS 策略、`fee_percent` 列默认值（仍 10）
- mobile / desktop 布局结构

## 需要你确认的 1 个点

被拒绝时是否要给用户**退回原资产**的承诺？目前没有这一环，文案就是"无法找回，详见说明"。如果你后续要做"退回手续费 / 退回部分"那是另一个独立 feature，先不掺进这次精简里。

确认无误就开始执行。
