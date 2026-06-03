## 问题根因

`useConnectedAccounts` 里 `DEMO_MODE = true`（硬编码），导致 `useAirdropPositions` 走 demo 分支，只读 localStorage 的 mock airdrops，**完全不查询 Supabase**。

但是 voucher 兑换流程（`redeem-position-voucher` edge function）实际是把记录写到 Supabase 的 `airdrop_positions` 表里——刚已经确认数据库里有一条 `source='voucher' status='activated'` 的 UFC 仓位。结果：仓位写进去了，但前端读不到。

`DesktopPositionsPanel` 渲染 `activatedAirdrops` 没有按 event 过滤，所以只要 hook 能拿到这条记录，就会出现在 Positions tab。

## 修复

只改 `src/hooks/useAirdropPositions.ts` 的 `queryFn`：

demo 分支保留原有 mock + localStorage 合并逻辑，**额外**从 Supabase 拉取当前用户 `source='voucher'` 的 airdrop_positions，把它们 prepend 到结果数组里（按 created_at 倒序）。

- 仅拉 `source = 'voucher'` 这一类（matched/welcome_gift 在 demo 下仍然是 mock）。
- 用现有的 row→`AirdropPosition` 映射函数（把 lines 207-232 抽成一个 helper，demo 和非 demo 两个分支共用），避免代码重复。
- 不写回 localStorage（voucher 仓位是 Supabase 真实数据，每次刷新都重新拉，避免和服务端状态错位）。
- 不需要 SQL 变更、不需要改 edge function、不需要改 panel。

## 验证

刷新 `/trade?event=ufc-316-headline`（或任意 event）后，Positions tab 出现一行 `No · UFC 316 Headliner…` 带 AIRDROP 徽章的绿底行；Portfolio → Airdrops 也能看到同一仓位（已经在用同一 hook）。

## 不动

- `DesktopPositionsPanel.tsx` / `EventPickerList.tsx` / `RedeemVoucherContent.tsx` / edge functions / DB schema / `DEMO_MODE` 开关。
