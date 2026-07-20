## 目标

优化 `/developers` mobile 页面 §02 Access tiers 左侧那三颗小空心圆点（现在只是 `w-3 h-3 border-2` 空圆，视觉弱、又不成体系），换成工程蓝图语言的 tier 索引徽章，并在 style-guide 里补上真组件预览。

## 新的圆点设计（替换现有空心圆）

保留左侧竖线（rail），把节点从"3 个一样的空心圆"升级为**分层实心徽章**，一眼看得出 tier 等级差异：

```text
┌──────────────────────────────┐
│ ┌──┐                         │
│ │01│  Read-only              │  ← muted 环 + 数字，无填充
│ └──┘  Free · instant         │
│  │                           │
│ ┌──┐                         │
│ │02│  Trading                │  ← primary 填充 + 白字 + 微 glow
│ └──┘  Self-serve             │
│  │                           │
│ ┌──┐                         │
│ │03│  Pro / Market Maker     │  ← amber 描边 + amber 数字，虚线角
│ └──┘  Manual review          │
└──────────────────────────────┘
```

具体规范：

- 尺寸：`w-7 h-7 rounded-md`（不再是圆，改小方章 —— 呼应 §03 quickstart 已有的数字节点、SectionHead 的 `01/02` 语言）。
- 位置：`absolute -left-[14px] top-4`，rail 从 `left-2` 调到 rail 穿过徽章中心（`left-[10px]`），保证竖线视觉贯穿。
- 三档差异（由 `TIER_META`-风格 map 驱动，不散写 class）：
  - `muted`：`border border-border bg-background text-muted-foreground`
  - `primary`：`border border-primary/60 bg-primary/15 text-primary` + `shadow-[0_0_0_3px_hsl(var(--primary)/0.08)]`
  - `amber`：`border border-amber-400/60 bg-amber-400/10 text-amber-400`
- 内容：`font-mono text-[11px] font-semibold` 显示 `01 / 02 / 03`。
- 徽章外多加一层 1px `ring-background`，避免和 rail 竖线糊在一起。

其它保持不动（tag、body、chips、rail 渐变色都不改）。

## 变更清单

**1. 抽出组件** `src/components/developers/TiersStepperMobile.tsx`
- 输入：`tiers: typeof TIERS`（复用 `DevelopersPageMobile` 里的常量结构）。
- 内部包含 rail + 徽章 + tier 内容渲染。
- 徽章样式来自本文件顶部的 `TIER_NODE_STYLES` map（单一 token 源，符合 Core 规则）。

**2. `src/pages/DevelopersPageMobile.tsx`**
- 删除 §02 内联的 stepper JSX（289–333 行），改为 `<TiersStepperMobile tiers={TIERS} />`。
- `TIERS` 常量原地保留导出，供 style-guide 复用。
- 桌面版 `DevelopersPage.tsx` 一行不动。

**3. Style-guide 镜像**
- `src/pages/StyleGuide/preview/` 新建 `developersPreviews.tsx`，导出一个 `<TiersStepperMobile tiers={TIERS} />` 预览。
- `registry.tsx` 注册 key `developers-mobile-tiers`。
- `src/pages/StyleGuide/sections/ApiSection.tsx` 在 "A · Open API Portal (/n)" 分组下追加一个 SubSection "Access tiers (mobile stepper)"，用 `DualDevicePreview previewKey="developers-mobile-tiers"`，`minHeight≈420`，label 说明"移动端专属；桌面走 DevelopersPage 三卡片"。

## 验收

- `/developers` 移动端 §02：左列出现 `01/02/03` 分层徽章，muted / primary / amber 三档一眼可辨；rail 竖线穿徽章中心不断裂。
- 桌面 `/developers` 完全零变化。
- `/style-guide` API section 底部（或 A 组内）新增 "Access tiers (mobile stepper)" 预览，DeviceFrame 里 375px 呈现新徽章。
- `bunx tsgo --noEmit` clean。
