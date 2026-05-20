## 目标

1. **Withdraw 流程**：用户点 Withdraw → 弹出验证 Dialog（邮箱 OTP / TOTP / 两者）→ 全部通过后才真正提交。
2. **Settings → Security** 新增「Withdrawal verification」偏好：Email only / Authenticator only / Both。
3. 处理「未绑定邮箱」和「未绑定 Authenticator」两种前置缺失场景。

> Demo 设定：邮箱 OTP 和 TOTP 都接受固定码 **`111111`**，不接入真实邮件、不 toast 显示验证码。UI 上仅在 Dialog 顶部小字提示 "Demo: use 111111"。

---

## 数据库变更

`profiles` 表新增字段：

| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `withdraw_2fa_mode` | text | `'email'` | `'email'` / `'totp'` / `'both'` |
| `totp_enabled` | boolean | `false` | 是否完成 Authenticator 绑定 |
| `totp_secret` | text | null | 模拟 secret（demo 用） |

约束：`CHECK (withdraw_2fa_mode IN ('email','totp','both'))`。RLS 沿用现有 profile policies。

> 注：邮箱是否绑定通过现有 `profiles.email` 字段判断，无需新增字段。

---

## 验证流程（核心：前置条件 → 验证步骤）

`WithdrawForm.handleSubmit` 改为：

```
1. 表单校验通过
2. 读取 profile.withdraw_2fa_mode
3. 计算需要的步骤：steps = []
   - 若 mode 含 email → 需要 profile.email，否则进入「Bind email」分支
   - 若 mode 含 totp  → 需要 totp_enabled,    否则进入「Bind authenticator」分支
4. 打开 WithdrawVerifyDialog（按 steps 渲染，进度 1/N → N/N）
5. 全部通过 → 真正 submitWithdrawal
```

### 缺失前置的分支

**A. 缺邮箱**（mode 含 email 但 profile.email 为空）
- Dialog 第一屏渲染「Add email to continue」面板：Email Input + "Send code" → 6 格 OTP（接受 111111）→ 写入 `profiles.email`。完成后自动进入下一步或直接通过 email 验证。
- 备用出口："Go to Settings to add email"，关闭 Dialog 跳 `/settings`。

**B. 缺 Authenticator**（mode 含 totp 但 totp_enabled 为 false）
- Dialog 直接渲染「Set up authenticator to continue」面板：复用 `Setup2FADialog` 内容（demo 二维码 + secret + 输入 111111 确认 → 写 `totp_enabled=true`）。完成后进入下一步或直接通过 totp 验证。
- 备用出口：跳 `/settings` 的 Security 卡。

**C. 都缺**：先做 A，再做 B，再走正常验证步骤（实际上 A/B 完成后等价已通过对应验证，可直接合并跳过对应步骤）。

> 兜底：如果用户在 Settings 之外（如登录刚注册）从未填过邮箱，提交 Withdraw 时一定会被 A 分支拦住，所以无需再加 deposit-style 全局 banner。

---

## Settings → Security 卡

新建 `SecurityCard.tsx`，插到 Settings 中（ConnectedAccountsCard 附近）：

1. **Withdrawal verification**
   - RadioGroup / Segmented：Email only / Authenticator only / Both
   - 切换到含 totp 的选项时，若 `totp_enabled=false`，先弹 `Setup2FADialog` 完成绑定再写偏好；用户取消则不改偏好。
   - 切换到含 email 的选项时，若 `profile.email` 为空，inline 提示 "Add an email in your profile first"（不强弹，因为 Settings 已有 email 编辑区）。

2. **Authenticator app**
   - 状态 Badge：Enabled / Not set
   - 按钮：Set up / Disable
   - Disable 时若当前 mode 是 totp/both，提示 "Will switch to Email only"，确认后同时回退 `withdraw_2fa_mode='email'`。

---

## 前端文件清单

**新建**
- `src/components/withdraw/WithdrawVerifyDialog.tsx` — Dialog（桌面）+ MobileDrawer（移动）包装，按 steps 渲染 Email OTP / TOTP / Bind email / Bind authenticator 四类面板，公用 6 格 InputOTP。
- `src/components/settings/SecurityCard.tsx`
- `src/components/settings/Setup2FADialog.tsx` — demo 二维码（SVG 占位 / `qrcode.react` 任选）+ secret + 6 格 InputOTP（接受 111111）。
- `src/lib/demoOtp.ts` — 常量 `DEMO_OTP_CODE = '111111'`，工具 `verifyDemoOtp(code)`，生成假 base32 secret。
- supabase migration（3 个字段 + check）

**改动**
- `src/components/withdraw/WithdrawForm.tsx` — 提交前打开 verify dialog；不再直接 submit。
- `src/pages/Settings.tsx` — 插入 SecurityCard。
- `src/hooks/useUserProfile.ts` — 暴露 `withdraw_2fa_mode` / `totp_enabled` / `totp_secret`，新增 `updateWithdrawMode`、`enableTotp`、`disableTotp`、`bindEmail`（若现有 `updateEmail` 已够用则复用）。
- `src/pages/StyleGuide/sections/DepositWithdrawSection.tsx` — Playground 展示 verify dialog 在 4 种状态下的渲染（email-only / totp-only / both / 缺邮箱 / 缺 totp）。

---

## 设计规范

- 桌面 Dialog + 移动 MobileDrawer（按 memory: desktop-overlay-conventions）
- MobileDrawer 内卡片 `rounded-lg border bg-muted/30 p-3`、按钮 `MobileDrawerActions` + Cancel + Primary（按 mobile-drawer-content-spec）
- OTP 6 格用现有 `InputOTP`
- 文案 sentence case，无 emoji，错误码用 `text-destructive`
- 顶部「Demo: use 111111」用 `text-xs text-muted-foreground` 的提示条

---

## 不改动

- `useWithdraw` 后端逻辑、submitWithdrawal API
- URL / 路由
- 登录流程（仅影响 Withdraw 与 Settings）
- 不接入真实邮件、不接入真实 TOTP、不调用 Lovable Auth MFA
