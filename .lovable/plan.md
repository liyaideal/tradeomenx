# 统一 Verify withdrawal 顶部排版

## 问题
- 桌面：右上 `Step 1 of 2` 跟关闭按钮 X 叠在一起。
- 移动：MobileDrawer 标题独占一行，step 单独靠右又是一行，整体很散。

## 方案（两端统一）
把 step 指示符作为**标题下方的副标题**统一呈现，跟说明文字合并成一行，避开 X 关闭按钮，桌面/移动结构一致。

格式：`Step 1 of 2 · Confirm it's you before sending funds off-platform.`
- text-xs / text-muted-foreground
- 居左，紧贴标题下方
- 只 1 个步骤时省略 `Step X of Y · ` 前缀

## 文件改动
`src/components/withdraw/WithdrawVerifyDialog.tsx`
- 删除 `stepBadge` 单独的 JSX 与桌面端 title 右侧、移动端 section 顶部的占位
- 桌面：`DialogDescription` 内容改为 `{stepPrefix}Confirm it's you …`
- 移动：在 `MobileDrawerSection` 最上方加同样格式的一行小字（左对齐、text-xs、muted），替换原先靠右的 step 行

不动 PanelHeading（图标+标题+描述居中），只动 dialog/drawer 顶部副标题。

## 验证
- 桌面 1021px：标题不与 X 重叠；副标题为 `Step 1 of 2 · …`
- 移动 390px：标题下方紧跟一行小字 `Step 1 of 2 · …`（不再单独右上一行）
- 单步骤场景下副标题只剩说明文字
