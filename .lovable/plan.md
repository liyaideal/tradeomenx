# 合并 Greeting + Equity 模块

把目前两行（`HomeGreeting` + `HomeStatusStrip`）合并成一个上下结构的「身份+资产」头部块，节省 ~60px 垂直空间，并让 authed 状态视觉更紧凑。

## 变化前后

**Before** (authed):
```
Hello,                          [+]
WADE_WARREN
─────────────────────────
[ EQUITY  $123.45      Today +1.9% ]
─────────────────────────
[ 🔍 Search markets… ]
```

**After** (authed):
```
Hello,                                    [+]
WADE_WARREN
$123.45  ·  Today +1.9%   →  Wallet
─────────────────────────
[ 🔍 Search markets… ]
```

**After** (guest):
```
Hello,                                    [+]
THERE
Sign in to trade  →                          (单行 CTA，紧贴名字下方)
─────────────────────────
[ 🔍 Search markets… ]
```

## 设计规则

- 把 equity / PnL / "Sign in to trade" 作为问候头的**第三行 metadata**，去掉胶囊 border / bg，改为内联文字。
- `+` 按钮垂直居中对齐整个三行块（authed）/ 两行块（guest）。
- 整个三行块作为单一可点击区域：
  - Authed: 点击 → `/wallet`（除 `+` 按钮自身的 deposit 跳转外）
  - Guest: 点击 → 打开 AuthSheet
- Equity 行 typography:
  - `$123.45` — `font-mono text-[15px] font-semibold text-foreground`
  - 分隔点 `·` — muted
  - `Today +1.9%` — `font-mono text-[12px]` + 涨跌色
  - 末尾 `→ Wallet` — `text-[11px] text-muted-foreground`，作为 affordance 提示

## 实现

**改 1 个文件**：`src/components/home/HomeGreeting.tsx`
- 接管原 `HomeStatusStrip` 的内容（合并入 props：`onSignIn` 已有；新增隐式 `useUserProfile` 取 `balance`）。
- 三态分支（Guest / Authed）内联渲染。
- 整块包成 `<div>`，问候行 + `+` 按钮用 `flex justify-between`；metadata 行单独一行 `mt-1.5`。

**改 1 个文件**：`src/pages/MobileHome.tsx`
- 删掉 `HomeStatusStrip` 的独立挂载点。
- `HomeGreeting` 一个就够了。

**保留不动**：
- `HomeStatusStrip.tsx` 文件本身保留（其他地方未引用，但删除会影响 git 历史；可后续清理）。或直接删，看用户决定。

## 文件清单

- ✏️ `src/components/home/HomeGreeting.tsx` — 接管 equity/PnL 显示
- ✏️ `src/pages/MobileHome.tsx` — 移除 `HomeStatusStrip` 挂载
- ✏️ `.lovable/memory/features/home-page-purpose.md` — 更新结构说明
- 🗑️ (可选) 删除 `src/components/home/HomeStatusStrip.tsx`

## 1 个待确认

合并后 **`HomeStatusStrip.tsx` 文件**：直接删除 vs 保留以备 desktop 复用？
