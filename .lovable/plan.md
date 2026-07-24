当前 `KeysTable.tsx` 的 Key 列只显示被截断的 `key_prefix`（如 `omx_live_196…8403`），用户无法查看完整识别串或复制。IP 列已实现 `IpHoverList` 悬浮展示完整列表的交互。本次计划将 Key 列对齐该模式。

## 改动范围

仅修改 `src/components/api/KeysTable.tsx`（纯 UI/交互，不动数据模型）。

## 具体实现

1. **新增 `KeyHover` 组件**
   - 触发区域：带下划线的 `key_prefix` 文本（与 IP 列样式一致）。
   - 悬浮内容（TooltipContent）：
     - 顶部标签 "Key prefix" / "API key prefix"。
     - 完整 `key_prefix` 字符串（monospace 展示）。
     - 复制按钮：使用 `navigator.clipboard.writeText` 复制完整 prefix；点击后图标从 `Copy` 切换为 `Check` 1.5s 反馈。
   - 说明：Tooltip 展示的是 **key_prefix（识别串）**，而非一次性 secret；secret 仍只在创建向导展示一次，后端不存明文。

2. **桌面表格 Key 列替换**
   - 将第 74 行 `<div className="font-mono ... truncate">{k.key_prefix}</div>` 替换为 `<KeyHover apiKey={k} />`。
   - 保持 `truncate` 与 `font-mono` 视觉不变。

3. **移动端卡片 Key 区替换**
   - 将第 160–161 行 `<code ...>{k.key_prefix}</code>` 替换为 `<KeyHover apiKey={k} />`。
   - 保持深色卡片内的 monospace 风格。

4. **导入更新**
   - 引入 `Copy`、`Check` 两个 Lucide 图标。

## 验证

- 桌面端：hover Key 列出现 Tooltip，可复制 prefix。
- 移动端：点击/点按 Key 区域触发 Tooltip，可复制。
- 不改动 `api_keys` 表结构或 `useApiKeys.ts` 逻辑。