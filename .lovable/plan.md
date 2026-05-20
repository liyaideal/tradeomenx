## 问题诊断

当前 `SecurityCard` 把两类概念混在一起，导致体验割裂：

1. **凭证绑定**（Email、Authenticator）：属于账户级安全，未来可能用于登录、改密、改邮箱、API key、敏感操作确认等多个场景。
2. **提现验证策略**（Email only / Authenticator only / Both）：只是 withdraw 这一个业务对凭证的"使用方式"。

具体不合逻辑的点：
- 用户根本没绑邮箱，默认却显示选中 "Email only"。
- 在 "Withdrawal verification" 区里选 Email 模式，却要滚到上面的 Profile 去绑邮箱，跳来跳去。
- Authenticator 既是"凭证"又是"选项"，状态语义重叠。

## 调整方案

把一张卡拆成两张，职责清晰、可复用：

### 模块 A — Account security（账户级，凭证管理）

位置：Settings 页面，替换现在的 Security 卡片上半部分。

内容：
- **Email**：显示绑定状态。未绑定 → "Add email"；已绑定 → 显示邮箱 + Verified badge + "Change"（后续可加）。绑定流程复用现有 demo OTP（111111）。
- **Authenticator app**：显示 Enabled / Not set，按钮 Set up / Disable，复用 `Setup2FADialog`。

这张卡只回答一个问题："我这个账号绑了哪些验证方式？"
未来登录 2FA、修改密码、改邮箱、API key 等场景都从这里读这些凭证。

### 模块 B — Withdrawal verification（业务级，使用偏好）

独立的小卡片，紧跟 Account security 之后。

内容：
- 标题 "Withdrawal verification"，副标题 "Choose how to verify when submitting a withdrawal"。
- 3 选项：Email only / Authenticator only / Email + Authenticator。
- 每个选项是否**可选**取决于模块 A 的凭证状态：
  - 未绑邮箱 → "Email only" 和 "Email + Authenticator" 置灰，附提示 "Add an email in Account security"，点击可滚动/高亮模块 A。
  - 未启用 TOTP → "Authenticator only" 和 "Email + Authenticator" 置灰，同样指引到模块 A。
- **默认值修正**：profiles 表 `withdraw_2fa_mode` 默认仍为 `email`，但 UI 渲染时如果当前用户没邮箱也没 TOTP，显示为"未配置"状态而不是假装选中 Email only；提交 withdraw 时若用户绑定状态不满足所选模式，强制要求先去绑定（已有逻辑保留作兜底）。
- 切换到需要 TOTP 的模式时，如果 TOTP 没启用，弹 `Setup2FADialog`（保留现有逻辑）。

这张卡只回答一个问题："提现时怎么验证？"

### 为什么这样拆

- **可扩展**：以后加 "登录 2FA"、"改密验证"、"大额转账验证" 等模块，全部读模块 A 的凭证、各自维护自己的策略卡片，不会再臃肿。
- **认知一致**：模块 A = "我有什么"，模块 B = "用哪个"，符合用户心智。
- **去掉跳转**：绑定动作和它的状态展示在同一张卡里完成，不再让用户跨模块跳。

## 技术改动

仅前端结构调整，DB / hooks 不动：

- 新文件 `src/components/settings/AccountSecurityCard.tsx`：承接现 SecurityCard 中 Email 行 + Authenticator 行 + `Setup2FADialog` 触发。Email 行未绑定时提供 "Add email" 按钮，内联弹一个简单 Dialog/MobileDrawer 跑 demo OTP（111111）后写 `profiles.email`（如果当前 useUserProfile 没暴露 setEmail，加一个 `updateEmail` mutation）。
- 新文件 `src/components/settings/WithdrawalVerificationCard.tsx`：只放 3 个 RadioGroup 选项 + 校验逻辑 + 触发 `Setup2FADialog`（共享）。读 profile 状态决定禁用项。
- `src/pages/Settings.tsx`：把原 `<SecurityCard />` 替换为 `<AccountSecurityCard />` + `<WithdrawalVerificationCard />`，两张卡之间用现有 spacing。
- 删除或废弃 `src/components/settings/SecurityCard.tsx`（保留文件但不再引用，或直接删除——倾向直接删除，避免混淆）。
- StyleGuide `DepositWithdrawSection.tsx` 中如有 SecurityCard 预览，同步更新为两张新卡。
- 文案使用 sentence case，移动端 MobileDrawer 遵循 mobile-drawer-content-spec。

不动后端：`profiles.withdraw_2fa_mode` 字段、`enableTotp/disableTotp` mutation 等保持不变。

## 验收点

- 未绑定邮箱 + 未启用 TOTP 的新用户：Withdrawal verification 卡显示"未配置"提示，3 个选项均置灰并引导到上面的 Account security。
- 在 Account security 绑定邮箱后，Withdrawal verification 的 Email only 选项立即可用并自动选中（如果之前没人为选过）。
- Withdraw 流程的拦截行为不变（已有 WithdrawVerifyDialog 兜底）。
