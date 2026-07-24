## /settings/api — IP 列悬浮查看具体白名单

用户反馈：Keys 表 IP 列只显示计数（如 `2 IPs`），忘了具体 IP 后没入口查看。

### 改动

**`src/pages/ApiManagement.tsx` — `KeysTable` 内 IP 单元格**
- 当 `ip_whitelist.length > 0` 时，将 `N IP(s)` 文本包一层 `Tooltip`（shadcn），`TooltipContent` 用 `font-mono text-xs` 列出每条 IP，一行一个。
- 视觉：数字加 `underline decoration-dotted decoration-muted-foreground/40 underline-offset-4 cursor-help`，暗示可悬浮。
- `ip_whitelist` 为空时保持 `—`，不加 tooltip。
- 移动端（若同表在 drawer/list 中出现）改成 tap 触发（Tooltip 已内建 touch 支持，无需额外处理）。

### 不动
- 不改 schema、不改 hook、不改创建向导。
- Style Guide ApiSection 中的 KeysTable 预览会自动继承（同一组件）。

### 技术细节
- `Tooltip / TooltipTrigger / TooltipContent` 已在项目内使用（`@/components/ui/tooltip`），无需新增依赖。
- 若 KeysTable 外层未包 `TooltipProvider`，在表格根节点加一个 `TooltipProvider delayDuration={100}`。
