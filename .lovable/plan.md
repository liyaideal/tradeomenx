## 目标
1. 把 AuthDialog/AuthSheet 弹窗里的 "Demo accounts" 区块（Matched user A / Welcome gift user B）从生产 UI 中移除。
2. 把它挪到 `/style-guide` 的 UserIdentitySection，作为 QA/demo 状态预览。
3. 新增一条永久 memory 规则：**禁止在产品页面新增 demo 入口**，多状态演示一律放 style-guide。

## 改动

### 1. `src/components/auth/AuthContent.tsx`
- 删除第 447–473 行的 Demo accounts 区块（dashed border + 两个按钮）。
- 删除 `handleDemoAccountLogin` 函数（178–199 行）以及只为它服务的 import（如 `supabase` 若没其他用途则保留，因为 AuthContent 其他地方还会用）。
- AuthDialog / AuthSheet 文件本身不动。

### 2. 新建 `src/components/auth/DemoAccountsBlock.tsx`
- 抽出独立组件，封装 UI（dashed 容器 + 两列 outline 按钮）+ `ensure-demo-user` edge function 调用 + toast 反馈 + loading 状态。
- 视觉与原弹窗内一致。
- 不在 AuthContent 内引用 —— 仅供 style-guide 使用。

### 3. `src/pages/StyleGuide/sections/UserIdentitySection.tsx`
- 新增 `SubSection` "Demo accounts (QA only)"：
  - 描述：用于预览不同用户首次登录后看到的空投弹窗状态（matched 用户 vs welcome gift 用户）。
  - 渲染 `<DemoAccountsBlock />`。
  - 注明：生产 Auth 弹窗已下线该入口，研发如需复用直接引用此组件。

### 4. Memory 更新

**4a. 新增** `mem://workflow/no-demo-entries-in-product`
```
---
name: 产品页禁止新增 demo 入口
description: 多状态/多用户类型演示一律放 /style-guide，禁止在产品页面塞 demo 按钮或入口
type: constraint
---
任何功能只要有"按不同用户/不同状态展示不同 UI"的演示需求，必须放进 /style-guide
对应 section，**严禁**在产品页面（首页、弹窗、Header、Settings 等）新增 demo 账号
切换、状态切换按钮、scenario chips 等入口。

Why: 生产 UI 中混入 demo 入口会污染真实用户体验、被截图传播、产生信任问题。

How to apply:
- 看到"展示一下不同状态"类需求 → 默认在 /style-guide 加 SubSection
- 已有的 demo 入口若混在产品页，下次涉及该模块时一并迁出
- 与已有 new-feature-playground-mandate 配套使用
```

**4b. 更新** `mem://index.md` Core 段，追加一行：
```
- **Demo 入口隔离:** 多状态/多角色的演示一律放 /style-guide，禁止在产品页面新增 demo 切换入口。详见 no-demo-entries-in-product。
```

**4c. 更新** `mem://features/demo-accounts-fixed-identities`：注明入口已从 Auth 弹窗下线，仅保留在 `/style-guide` UserIdentity section。

## 不改动
- `supabase/functions/ensure-demo-user` 不动。
- `useAirdropPositions.ts` 的 `pickMockByEmail` 不动 —— 两个 demo 账户登录行为保持完全一致。
- AuthDialog / AuthSheet 容器不动。
