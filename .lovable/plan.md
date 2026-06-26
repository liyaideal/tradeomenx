# Cobo 维护提示 v2

## 回应澄清
1. **恢复通知**：不做。恢复后维护期间链上交易会正常入账，无需在 UI 上单独告知用户"已恢复"。Ops 只需把对应 notice 从配置里删除/标过期即可，横幅自然消失。
2. **Style Guide 主导**：`MAINTENANCE_NOTICES` 常量默认**空数组**，`/wallet` 顶部平时不显示任何横幅。研发改样式时去 `/style-guide` 看 demo，不是去 `/wallet` 凭一条示例数据调样式。

## 新增文件

### 1. `src/config/maintenanceNotices.ts`
```ts
export interface MaintenanceNotice {
  id: string;          // e.g. 'base-eth-2026-06-26'
  network: string;     // 展示用，例如 'BASE_ETH'
  startAt: string;     // ISO，例 '2026-06-25T17:00:00Z' (= UTC+8 01:00)
  endAt?: string;      // 可选；缺省视为持续中，由 ops 手动移除
  note?: string;       // 可选补充说明
}
// 默认为空。ops 按 Cobo 通知临时追加一条；恢复后删除该条即可。
export const MAINTENANCE_NOTICES: MaintenanceNotice[] = [];
```

### 2. `src/hooks/useMaintenanceNotices.ts`
读取常量，按 `Date.now()` 过滤 active。返回 `{ active: MaintenanceNotice[] }`。注释 `// TODO: swap to remote source` 预留接口。

### 3. `src/components/wallet/MaintenanceNoticeBanner.tsx`
- shadcn `Alert`，warning 风格（`border-warning/40 bg-warning/10 text-warning-foreground`；若 token 不存在则用 amber/destructive 语义 token，绝不写死颜色）。
- `AlertTriangle` 图标 + 标题 `Network maintenance` + 描述：
  > `{network} deposits & withdrawals are temporarily suspended by our custody provider. Funds sent during this window may be delayed.`
- 可选 `note` 作为第二行 `text-xs text-muted-foreground`。
- 多条纵向堆叠 `space-y-2`。
- 无 active 通知返回 `null`。
- 额外导出 `MaintenanceNoticeBannerDemo`：内部 mock 一条 `BASE_ETH` notice 渲染同一个视觉组件，**仅供 style-guide 使用**，不读常量。

## 接入点

### `src/pages/Wallet.tsx`
顶部（页面标题下、内容前）渲染 `<MaintenanceNoticeBanner />`。默认空数组 → 不显示。

### `/style-guide` — Wallet section
在 `src/pages/StyleGuide/sections/WalletSection.tsx` 新增子节 **Maintenance Notice**：
- 用 PresetRail 切换状态：`Single network` / `Multiple networks` / `With note` / `Empty (hidden)`。
- 每种状态调用 `MaintenanceNoticeBannerDemo` 传入对应 mock 数组，确保穷尽所有视觉态（符合 playground-state-coverage 与 new-feature-playground-mandate 规则）。
- Empty 态显式渲染一行 `text-xs text-muted-foreground` 占位说明"No active notices → banner hidden"，避免空白看起来像 bug。

## 不动的地方
- Deposit / Withdraw 页面、按钮、tabs、cobo 调用逻辑全部不动。
- 不区分 deposit-only / withdraw-only，文案统一 "deposits & withdrawals temporarily suspended"。
- 不做"已恢复"提示，不引入新数据库表。

## 验收
- 默认进入 `/wallet`：无横幅。
- 在 `MAINTENANCE_NOTICES` 临时塞一条进行中通知 → `/wallet` 顶部出现警示横幅；删除该条 → 横幅消失。
- `/style-guide` Wallet section 下能看到 Single / Multiple / With note / Empty 四种状态切换。
