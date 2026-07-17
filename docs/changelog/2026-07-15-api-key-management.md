# Open API v1 — 用户侧 Key 自助管理页

> 面向做市商 / 工作室 / agent 交易者的 Open API v1 用户端入口上线。新页 `/settings/api`：三层准入 checklist（Read-only / Trading / Pro-MM）+ Key 列表 + 创建向导（label → scope → IP whitelist → 2FA → 一次性 secret）+ Revoke。三层准入对齐《创建 api 条件》，scope 枚举对齐 FD-API-04。
>
> **DEMO-STATE**：key/secret 由前端 `omx_live_<48hex>` 仿真生成、`api_keys` 只落 `key_prefix`；正式版 secret 由后端 HMAC/JWT 签发 + 哈希存储 + IP/2FA 校验在鉴权中间件执行。本轮不改 schema，仅读写既有 `api_keys` 表。

## 1. 页面 `/settings/api`

- **顶部**：`API Management` + 副标 "Programmatic access for trading bots, market makers, and agents."
- **三层状态卡**（横向 3 张）：
  - 每张卡展示 checklist（✓ / ○），未达标层禁用创建向导中的对应选项
  - Pro / MM 恒为 Manual approval，"Contact us" 邮件占位
- **Key 列表**：Label · Key（`omx_live_a1b2••••`，`font-mono`）· Tier badge · Scope chips · IP 数 · Created · Last used · Status · Revoke
- **空态**：Key 图标 + "No API keys yet" + Create CTA

## 2. 三层准入判定（`useTierEligibility`）

| Tier | 判定 |
|---|---|
| Read-only | `profile.email` 存在 + `profile.totp_enabled` |
| Trading | Read-only + 至少 1 笔 `transactions.type='deposit' & status='completed'` + `balance + trial_balance ≥ 100` + 至少 1 笔 `trades.status='Filled'` |
| Pro / MM | 近 30d filled 成交量 ≥ 50,000 或 equity ≥ 10,000；仅显示，不自助开通 |

demo 账号默认满足 Read-only + Trading。

## 3. 创建向导（3 步 Dialog）

| Step | 内容 |
|---|---|
| 1 | Label（≥2 字符）+ Tier 选择（未达标层禁用并列出缺项） |
| 2 | Scopes 多选（默认 `read_public` + `read_private`）+ IP whitelist（多行 / 逗号分隔，IPv4 / IPv6 / CIDR 基础校验）。勾选任一 `trade_*` 或 `ws_private` 时强制至少一条 IP |
| 3 | 一次性 secret 展示：`omx_live_<48hex>`，红色 warning 卡 + Copy 按钮；关闭后列表新增记录（只存 prefix） |

`X-OMENX-API-KEY` header 提示嵌在 secret 卡底部。

## 4. Scope 枚举（对齐 FD-API-04）

| Scope | 说明 | 需 IP |
|---|---|---|
| `read_public` | 公开行情 / 事件列表 | ✗ |
| `read_private` | 账户余额 / 持仓 / 历史 | ✗ |
| `trade_order` | 下单（spot & perp） | ✓ |
| `trade_cancel` | 撤单 | ✓ |
| `trade_conditional` | 条件单 / 止损单 | ✓ |
| `ws_public` | 公开 WebSocket 流 | ✗ |
| `ws_private` | 私有 WebSocket（成交 / 余额） | ✓ |

## 5. 入口

- **Settings 页**：新增 "API Management" 卡片（Key 图标）
- **桌面 EventsDesktopHeader 下拉**：Referral / Position Vouchers 同组新增 "API"（`KeyRound` 图标）
- **移动 BottomNav 抽屉**：同上，Position Vouchers 之后新增

## 6. 涉及文件

- 新增 `src/pages/ApiManagement.tsx` / `src/hooks/useApiKeys.ts`
- 新增 `src/pages/StyleGuide/sections/ApiSection.tsx`（三层卡两态 + Key 行 + 向导 scope 列表 + secret 展示）
- 编辑 `src/App.tsx`（route `/settings/api`）
- 编辑 `src/pages/Settings.tsx`（桌面 + 移动菜单条目）
- 编辑 `src/components/EventsDesktopHeader.tsx`（桌面下拉入口）
- 编辑 `src/components/BottomNav.tsx`（移动抽屉入口）
- 编辑 `docs/backend-boundary.md`（`api_keys` 🟡 append）

## 7. 保密红线

- 页面文案禁止提对冲 / 做市成本 / 内部撮合结构，只讲交易者视角（下单 / 撤单 / 私有流 / 限频）
- Pro / MM 层"更高限频 / 更多 open orders / 批量"仅描述能力，不透露具体阈值上限
