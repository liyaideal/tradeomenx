## 目标
`/settings/api` 的 API keys 列表中，Created / Last used 两列出现 "about 1 hour ago" 这类模糊措辞，去掉 "about"。

## 做法
`src/components/api/KeysTable.tsx` 里 4 处调用把 `formatDistanceToNow` 换成 date-fns 的 `formatDistanceToNowStrict`：

- 桌面表格 Created：`formatDistanceToNowStrict(new Date(k.created_at), { addSuffix: true })`
- 桌面表格 Last used：同上（`last_used_at` 存在时），否则 `Never`
- 移动卡片 Created / Last used：不带 `addSuffix`，保持现状

`formatDistanceToNowStrict` 输出精确单位（`1 hour ago` / `13 days ago` / `14 minutes ago`），不会生成 `about` / `almost` / `over` 等前缀。

## 技术说明
只改 import 与调用名，无其它逻辑变动；仅影响这一个组件的时间文案。
