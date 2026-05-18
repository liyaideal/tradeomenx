## 目标

把目前散落在 `PositionDetailContent` / `PositionCard` 内联 TP/SL drawer / `ClosePositionForm` 三处的 MobileDrawer 内容规范统一成**单一真相**：先写进 `DESIGN.md`，再让代码对齐，最后在 `/style-guide` 加可视化样例。

---

## 1. DESIGN.md — 新增 §5.1 "MobileDrawer 内容规范"

插入位置：现有 §5 Overlays 表格之后、§5.2 Tooltips 之前。

明确取值如下：

### 容器与间距

| 项目 | 取值 |
|---|---|
| Drawer 标题区 | 由 `MobileDrawer` 组件自带，不重复写 |
| 内容根容器 | `space-y-4`（区块间距 16px） |
| 区块内行间距 | `space-y-2` |
| 单元卡片间隙（如 Position / Funding 等多卡片） | `space-y-3` |

### 卡片基底（drawer 内所有信息块统一）

| 项目 | 取值 |
|---|---|
| 圆角 | `rounded-lg`（统一，不允许 `rounded-md`/`rounded-xl`） |
| 边框 | `border border-border`（信息卡有 border，纯展示头信息可省） |
| 背景 | `bg-muted/30`（统一，不允许 `bg-muted/50` 或 `bg-muted`） |
| Padding | `p-3`（mobile compact，与 §4 Card Padding 一致） |
| 卡内行间距 | `space-y-1.5` |

### 字号体系（混合分层）

| 角色 | 取值 |
|---|---|
| 区块小标题（"Position" / "Funding"） | `text-xs font-medium text-muted-foreground uppercase tracking-wide` |
| 数据行 label | `text-xs text-muted-foreground` |
| 数据行 value | `text-xs font-mono`（数字/地址永远 `font-mono`） |
| 主表单 label（如 "Take Profit"、"Quantity"） | `text-sm font-medium` |
| 表单输入 / 主操作（输入框、滑块旁说明） | `text-sm` |
| 大数（Net PnL 头部数字） | `text-2xl font-semibold font-mono`，副数 `text-base ml-2 opacity-80` |
| 标签语义色保留 | Take Profit 绿色、Stop Loss 红色 label 允许，但 **font-size/weight 必须遵循上面的 `text-sm font-medium`** |

### 表单控件

| 项目 | 取值 |
|---|---|
| 输入框 | `h-11 rounded-lg bg-muted border-0 px-3 text-sm font-mono focus:ring-1 focus:ring-primary` |
| Segmented 切换（%/$、多选 chip） | 外壳 `rounded-lg bg-muted p-0.5`，内项 `px-2 py-1.5 text-xs rounded-md` |
| Quick-ratio 按钮（25/50/75/100） | `h-9 text-xs rounded-md`，激活 `bg-trading-red/20 text-trading-red border border-trading-red/40`，未激活 `bg-muted/50 text-muted-foreground border border-transparent` |
| Slider | `Slider` 默认尺寸 |

### 按钮 / 底部 CTA

| 项目 | 取值 |
|---|---|
| 必须包裹容器 | `MobileDrawerActions`（**所有**带提交动作的 drawer 都用这个，禁止把按钮直接散在 content 里） |
| 主按钮高度 | `h-11`（满足 44px 触控） |
| 按钮组件 | shadcn `<Button>`（禁止裸 `<button>`，保证圆角/字号/state 一致） |
| 双按钮布局 | `flex gap-2`，`Cancel` 用 `variant="outline" flex-1`，主操作 `flex-1` |
| 主操作 variant | 编辑/确认 → 默认 primary；不可逆/销毁性（平仓、撤单、删除）→ `bg-trading-red text-white hover:bg-trading-red/90`（可视为 destructive 语义） |
| 主操作文案 | sentence case：`Confirm`、`Close all`、`Close N contracts`、`Save` |
| 单按钮例外 | 仅纯展示型 drawer（如 Position Details 只读）允许无 footer；任何含"提交"语义都必须 Cancel + 主按钮 |

### 信息密度规则

- "数据展示型"区块（key-value 列表）一律用 `grid grid-cols-2 gap-y-1.5 text-xs`，value 右对齐 `text-right`
- 解释性 tooltip 触发器统一用 `<Info className="w-3 h-3 cursor-help" />` 跟在 label 右侧
- 图标统一用 Lucide，icon 在数据行内 `w-3 h-3`，在区块小标题内 `w-3 h-3` 前置 + `gap-1.5`

### 禁止项

- ❌ `bg-muted/50`、`bg-muted/20` 作 drawer 卡片底（统一 `bg-muted/30`）
- ❌ `rounded-md` 作信息卡圆角（统一 `rounded-lg`；只有内部 segmented 项可以 `rounded-md`）
- ❌ 主按钮使用裸 `<button>`
- ❌ 提交型 drawer 不带 Cancel
- ❌ 在 drawer 内直接放 `Dialog` 或嵌套 drawer

---

## 2. 代码对齐三处弹窗

### A. `src/components/positions/PositionDetailContent.tsx`（Details）

- 维持目前结构（已经最接近规范）
- **改动**：Funding 卡片当前 `p-3 space-y-2` → 改 `p-3 space-y-1.5` 与 Net PnL 卡片节奏对齐
- Net PnL 卡片当前 `p-4` → 改 `p-3` 与其他卡统一
- 维持 read-only，无 footer（符合"纯展示例外"）

### B. `src/components/PositionCard.tsx` 内 TP/SL `MobileDrawer`（行 342–467）

- Position info 卡：`bg-muted/50 rounded-lg p-3` → 改 `rounded-lg border border-border bg-muted/30 p-3 space-y-1.5`
- 行内 label 改成 `text-xs text-muted-foreground`，value `text-xs font-mono`（当前已大体一致，只是确认）
- Take Profit / Stop Loss label：保留语义色，但统一 `text-sm font-medium`（当前 `text-xs font-medium`）
- 输入框补 `h-11`（当前是 py-2 自动撑开）；其余 class 已经符合
- Segmented %/$ 切换：当前 `px-2 py-1.5 text-xs rounded-md` ✅ 符合
- `MobileDrawerActions` 内双按钮已经符合（Outline + Primary, h-11）

### C. `src/components/positions/ClosePositionForm.tsx`（Close，comfortable 分支）

最大改动在这里——目前完全自成一派。

- 移除 `variant`/`isComfy` 决定字号的逻辑分支，**Drawer 端正文一律按规范**：数据行 `text-xs`、控件 `text-sm`
- 信息汇总卡：`rounded-md bg-muted/30 px-2.5 py-2 space-y-1 ${textSize}` → 改 `rounded-lg border border-border bg-muted/30 p-3 space-y-1.5 text-xs`
- Quick ratio 按钮：`py-2.5 text-xs rounded-md` → 改 `h-9 text-xs rounded-md`（无变化，等价但显式）
- 主按钮：把现有裸 `<button>` 换成 shadcn `<Button>`，外层包 `MobileDrawerActions`，再加 `Cancel` outline
  - 这意味着 `ClosePositionForm` 需要新增 `onCancel?` prop；`ClosePositionDrawer` 传入 `() => onOpenChange(false)`，desktop 的 `ClosePositionDialog` 也同步加 Cancel（保持 desktop/mobile 一致）
- `Close all` / `Close N contracts` 文案保留；按钮 destructive 语义通过 `className="bg-trading-red text-white hover:bg-trading-red/90"` 应用到 `<Button>` 上

### D. `src/components/positions/ClosePositionDrawer.tsx`

- 把新的 `onCancel` 透传给 `ClosePositionForm`

### E. `src/components/positions/ClosePositionDialog.tsx`（desktop）

- 同步添加 Cancel 按钮，保证桌面/移动表单一致（DESIGN.md §5 已规定复用同一份表单）

---

## 3. `/style-guide` 同步

在 `src/pages/StyleGuide/sections/MobilePatternsSection.tsx` 的 "Bottom Sheet / Drawer" 卡片下方新增一节 **"Drawer Content Spec"**：

- 三个并排的真实样例卡片：Detail（read-only）/ Edit（TP/SL 类）/ Destructive（Close 类）
- 每个样例下方列出该类型的 footer 规则（无 footer / Cancel+Primary / Cancel+Destructive）
- 列出规范表（卡片、字号、按钮）的 mini reference

---

## 4. 记忆更新

往 `mem://index.md` 的 Core 增加一行：

> **MobileDrawer:** 卡片统一 `rounded-lg border bg-muted/30 p-3`；正文 `text-xs`、表单控件 `text-sm`；提交型 drawer 必须 `MobileDrawerActions` + Cancel(Outline) + Primary/Destructive(`h-11` shadcn Button)。详见 mobile-drawer-content-spec。

并新建 `mem://design/mobile-drawer-content-spec` 详细文件，引用 DESIGN.md §5.1。

---

## 不动的部分

- `MobileDrawer` 组件本身、`MobileDrawerActions` 容器、Drawer 触发/关闭逻辑、数据来源、PnL 公式
- Funding history 表格内部结构
- TP/SL 业务逻辑（保存、估算 PnL）
- Close 的 slider/quick-ratio 数学