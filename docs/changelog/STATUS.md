# 交付实施对照表（STATUS）

> 跨文档汇总，看实施进度从这里开始。
>
> **同步约定**
> - 研发每完成一项，把对应行的 `Status` 改成 ✅；遇阻塞改成 ⚠️ 并在 `Notes` 列写原因
> - 新增交付文档时，在本文件 **顶部** 追加新节，所有条目初始为 ⬜
> - PM 每周三回顾本表，未完成项进入下周需求会议

## 状态图例

| 标记 | 含义 |
|---|---|
| ⬜ | 未开始 |
| 🟡 | 进行中 |
| ✅ | 已完成且自测通过 |
| ⚠️ | 阻塞 / 有疑问（在 Notes 写原因） |
| ➖ | 不适用 / 已废弃（不需要研发处理） |

---

## 2026-05-21 — 资金费率审计：结算周期列表中间页

源文档：[2026-05-21-funding-rate-periods-step.md](./2026-05-21-funding-rate-periods-step.md)

| # | 需求条目 | 参考位置 | Status | QA 测试要点 | Notes |
|---|---|---|---|---|---|
| 1 | `useFundingRateAudit` 增加 `periods` step + `loadPeriods/selectPeriod/backToPeriods` | `src/hooks/useFundingRateAudit.ts` | ⬜ | 选持仓后 step 变为 `periods` 并发起 ledger 查询；selectPeriod 后走 fetching→comparing→result | |
| 2 | Periods 结算列表页（持仓头卡 + 倒序列表 + 空态） | `FundingRateAudit.tsx` periods 分支 | ⬜ | 列表与 `position_funding_ledger`（按 position、`amount≠0`、倒序）一致；空 ledger 显示空态 | |
| 3 | Result 详情页新增 "Settlement Window" 卡 + on-chain 字段表追加 windowStart/End/SettlementTsMs | `FundingRateAudit.tsx` result 分支 | ⬜ | 详情页 rate/amount/window/settledAt 与所选 ledger 行一致 | |
| 4 | Result 按钮拆分：Verify Another Settlement / Change Position | `FundingRateAudit.tsx` result actions | ⬜ | 前者回 periods、后者回 select；BaseScan 链接照常打开 | |
| 5 | Position/Periods 列表 ≤18 条按内容自适应高度，>18 才出现内部滚动 | `FundingRateAudit.tsx` select / periods 分支 | ⬜ | 3 / 18 / 25 三档：≤18 无滚动条且不留空白，>18 锁 `min(70vh, 1100px)` 并出现内部滚动 | |

---

## 2026-05-21 — Style Guide 增量

源文档：[2026-05-21-style-guide-tx-row.md](./2026-05-21-style-guide-tx-row.md)

| # | 需求条目 | 参考位置 | Status | QA 测试要点 | Notes |
|---|---|---|---|---|---|
| 1 | StyleGuide WalletSection 新增 "Transaction History Row" playground | `/style-guide` → Wallet | ⬜ | 进入页面能看到该 section，桌面/移动两种示例同屏可对照 | 仅参考用，不影响业务 |
| 2 | StyleGuide 顶部增加 `/campaign-style-guide` 入口按钮 | `/style-guide` 顶部 | ⬜ | 桌面显示 Megaphone + 文字；移动端仅图标；点击跳转 `/campaign-style-guide` | |

---

## 2026-05-20 — 迭代批次（Recovery / Settings / Withdraw / TX History）

源文档：[2026-05-20-requirements.md](./2026-05-20-requirements.md)
（与 [2026-05-20-recovery-v2.md](./2026-05-20-recovery-v2.md) 关于 Recovery 的描述以 v2 为准）

### Recovery 简化

| # | 需求条目 | 参考位置 | Status | QA 测试要点 | Notes |
|---|---|---|---|---|---|
| R1 | 申请表单精简字段（移除 quote 相关）| `/wallet/recovery` 新建申请 | ⬜ | 表单只剩 tx_hash / wrong_network / wrong_token / claimed_amount / sender_address / user_note | |
| R2 | 状态机收敛为 3 态 `submitted / completed / rejected` | DB + 详情页 Badge | ⬜ | 提交后默认 submitted；Admin 操作后变 completed/rejected；用户无法改 status | v1 的 5 个中间态应清理 |
| R3 | 详情页移除 Quote Accept/Decline 卡 | `/wallet/recovery/:id` | ⬜ | 详情页模块顺序：Timeline → Summary → Fee breakdown → Credited(only completed) → Admin note(only rejected) → Support footer | |
| R4 | Fee breakdown 固定 10%（不再走报价）| 详情页 Fee 卡 | ⬜ | `Recovery fee (10%) -$Y.YY`；`Estimated return $Z.ZZ` 永久显示 | |
| R5 | "Contact support" 改跳 Discord | 详情页 footer | ⬜ | 点击新标签页跳 `discord.gg/qXssm2crf9` | 与 FloatingDiscordButton 一致 |
| R6 | DB：`recovery_requests` 表 + RLS + Trigger | `public.recovery_requests` | ⬜ | 用户只能 select 自己；UPDATE 被 trigger 拦截 `status` 等关键字段；admin 全开 | migration `...042031_*.sql` + v2 CHECK/trigger |
| R7 | StyleGuide → Deposit & Withdraw → Recovery Status playground | `/style-guide` | ⬜ | 可见 3 状态 Badge + 3 状态 Timeline | |
| R8 | v1 遗留字段处理（`quoted_at / accepted_at` 保留但不写）| DB schema | ➖ | 兼容性字段，研发无需新动作 | 仅做 schema 备注 |

### Settings 安全模块重构

| # | 需求条目 | 参考位置 | Status | QA 测试要点 | Notes |
|---|---|---|---|---|---|
| S1 | 删除旧 `SecurityCard.tsx`，拆为两张卡 | `/settings` | ⬜ | 原合并卡已消失 | |
| S2 | 新增 `AccountSecurityCard`（TOTP 绑定）| `/settings` | ⬜ | 未绑定显示 Setup；绑定后显示绿色 Enabled + Disable | |
| S3 | 新增 `WithdrawalVerificationCard`（3 模式）| `/settings` | ⬜ | 凭据全缺：黄色提示 + 全部禁用；仅邮箱：只 Email only 可选 | |
| S4 | `Setup2FADialog` TOTP 绑定向导（二维码 + 6 位码）| 唤起入口：上述卡片 | ⬜ | 选 TOTP/Both 但未绑定 → 内联打开 → 绑定成功自动写回选择 | |
| S5 | Settings 顺序：Email → Account Security → Withdrawal Verification | `/settings` | ⬜ | 顺序固定 | |
| S6 | DB：`profiles` 表新增 `totp_enabled` / `withdraw_2fa_mode` | `public.profiles` | ⬜ | 字段存在；migration `...094029_*.sql` | |
| S7 | Disable TOTP 时若提现模式依赖 TOTP，自动回落 Email | `/settings` | ⬜ | Disable 后 mode 自动变 Email only 并 toast 提示 | |

### Withdraw 二次验证

| # | 需求条目 | 参考位置 | Status | QA 测试要点 | Notes |
|---|---|---|---|---|---|
| W1 | `WithdrawVerifyDialog` 按 mode 渲染 1 步或 2 步 | `/withdraw` 提交流程 | ⬜ | Email-only → 1 步邮件 OTP；TOTP-only → 1 步 TOTP；Both → 2 步带进度指示 | |
| W2 | Dialog header 排版修复（关闭按钮不与 step 标题重叠）| Dialog 顶部 | ⬜ | 桌面 Dialog + 移动 MobileDrawer 均不重叠 | |
| W3 | 验证通过才调 `submitWithdrawal` | `useWithdraw` | ⬜ | 关闭/失败 dialog 后不会触发实际提交 | |
| W4 | 表单地址格式校验修正 + 携带 `network` 字段 | `WithdrawForm` | ⬜ | 非法地址按钮禁用；提交 payload 含 network | |

### Withdraw 流水落库

| # | 需求条目 | 参考位置 | Status | QA 测试要点 | Notes |
|---|---|---|---|---|---|
| WH1 | `useWithdraw` 校验后向 `transactions` 表 insert | DB `public.transactions` | ⬜ | type=withdraw / amount=负 / status=processing / network 写入 / tx_hash=null | |
| WH2 | 使用 insert 返回 id 替代本地 `wd-${Date.now()}` | 客户端状态 | ⬜ | 状态追踪用真实 id | |
| WH3 | `invalidateQueries(['wallet-fund-transactions'])` 立即刷新 | `/wallet` | ⬜ | 提交后 Transaction History 顶部立即出现新行 | |
| WH4 | 提交失败不写库 | error path | ⬜ | 后端报错时 transactions 表无脏数据 | |

### Transaction History 移动端排版

| # | 需求条目 | 参考位置 | Status | QA 测试要点 | Notes |
|---|---|---|---|---|---|
| T1 | 移动两层结构（描述+金额 / 第二行 pl-[52px] date·badge·status） | `/wallet` 390px | ⬜ | 描述不被截成 `Bri...`；金额右对齐不被遮挡；第二行换行后仍与图标对齐 | |
| T2 | 桌面单行结构保持不变 | `/wallet` ≥md | ⬜ | 桌面布局与之前一致 | 回归即可 |
| T3 | 共用：状态图标 `w-3.5 h-3.5` + `processing` 旋转 | 各行 status icon | ⬜ | processing 行图标在转 | |
| T4 | 共用：金额按正负 trading-green/trading-red + `font-mono` | 各行金额 | ⬜ | 颜色 + 字体一致 | |
| T5 | 共用：chevron 仅 `hasDetails(tx)` 时显示 + 整行可点击展开 | 各行右侧 | ⬜ | 无 details 的行不显示 chevron 且不可展开 | |

---

## 2026-05-20 — Recovery v2（与上节 Recovery 同源，以本节为准）

源文档：[2026-05-20-recovery-v2.md](./2026-05-20-recovery-v2.md)

| # | 需求条目 | 参考位置 | Status | QA 测试要点 | Notes |
|---|---|---|---|---|---|
| RV1 | WalletDeposit 三段独立 checkbox（token / network / 合约地址）全勾才解锁地址 | `/wallet/deposit` | ⬜ | 任一未勾：地址区不可见；全勾后才显示；localStorage key=`deposit-ack-v2` | |
| RV2 | WalletDeposit 底部小字入口 "Sent to wrong chain? → 申请找回" | `/wallet/deposit` 底部 | ⬜ | 点击跳 `/wallet/recovery` | |
| RV3 | `/wallet/recovery` 顶部 intro 卡（10% 手续费 / 3–7 business days / No quote needed） | 列表页 | ⬜ | 黄色 Info 图标 + 三条描述 | |
| RV4 | 表单底部预览 `You will receive ≈ $X.XX (after 10% fee)` | 新建表单 | ⬜ | 随 claimed_amount 实时计算 | |
| RV5 | PendingConfirmations 卡片底部 inline 链接（"看到错链的 tx？申请找回"） | `/wallet` 主页 | ⬜ | 链接跳 `/wallet/recovery` | |
| RV6 | 删除：`respondToQuote` mutation、Quote 卡、5 中间态、用户改 status 能力、"Wait for quote" 文案 | 全局清理 | ➖ | 研发参考实现时确认不要保留以上代码 | v1 → v2 主要废弃项 |

---

## 2026-05-11 — 已上线需求合集 v2（历史基线）

源文档：[2026-05-11-shipped-requirements-v2.md](./2026-05-11-shipped-requirements-v2.md)

> 此批次为 5 月初已上线基线，默认全部 ✅；如研发那边某项未实现/有 gap，把对应行改成 ⬜ 并在 Notes 说明。

| # | 需求条目 | 参考位置 | Status | QA 测试要点 | Notes |
|---|---|---|---|---|---|
| H1 | H2E Welcome Gift 兜底（无匹配仓位发 $10）| H2E 流程 | ✅ | Polymarket 无匹配 → 发 $10；终身 1 次；独立 `WELCOME GIFT` 绿色徽章 | |
| H2 | Pending Airdrop 倒计时（按钮内嵌 `46h` / `12m` urgent 红） | `/portfolio/airdrops`、桌面/移动 | ✅ | <1h 转红；过期按钮隐藏；激活中显示 `Activating…` | |
| H3 | H2E 6 档解锁阶梯（含 $0 Starter 档 +$5 starter unlock）| `/wallet` H2E 卡片 | ✅ | 6 节点 / 阶梯非线性 / Starter 独立绿色显示 | |
| H4 | Available for Withdraw = `max(0, balance + trialBalance − lockedAmount)` | `/wallet`、`/withdraw` | ✅ | balance=0 无 H2E 时仍显示 $5 可提 | |
| H5 | Withdraw 最低额 UX（placeholder `Min 20` / 同行展示 / 实时红字 / Submit 禁用）| `/withdraw` 输入区 | ✅ | <20 立即红字；按钮禁用 | |
| H6 | Withdraw 弹窗移除 H2E 文案模块（与 Wallet 页面去重）| `/withdraw` | ✅ | Available 行下方无 H2E 锁定文案 | 余额扣减逻辑保留 |
| H7 | 登录页常驻两个 demo 账号入口（matched / welcome）| `/login` | ✅ | 两账号数据互不干扰；可重复登录 | password 仅内部 |

---

## 维护历史

- 2026-05-21：首次建立 STATUS.md，覆盖 4 份历史交付文档；新交付按顶部追加规则维护
