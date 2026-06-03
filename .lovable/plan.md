## 发现的问题

`/vouchers` 的 Redeemed 模块现在只读 `position_vouchers.status`，但关闭 voucher airdrop 仓位时，前端实际关闭的是 `airdrop_positions`。虽然 `close-trial-position` 里尝试把对应 voucher 改成 `settled`，但这里有两个漏洞：

1. **数据库约束旧枚举不包含 `settled`**
   `position_vouchers.status` 的 CHECK 约束目前只允许 `issued/redeemed/expired/revoked`。因此 edge function 里 `status: 'settled'` 很可能更新失败，但代码没有检查这个错误，导致 `/vouchers` 仍显示 `Position open`。

2. **前端显示完全信任 voucher.status**
   `/vouchers` 没有 join / 查询对应 `airdrop_positions.status`，所以即使 airdrop 已经 `settled`，只要 voucher 还是 `redeemed`，UI 就会继续显示 `Position open`。

## 修复计划

1. **修正数据库状态约束**
   - 新增 migration，把 `position_vouchers.status` 允许值扩展为：`issued`, `redeemed`, `settled`, `expired`, `revoked`。
   - 兼容已有数据，不改用户现有 voucher 记录。

2. **修正 close edge function 的错误处理**
   - `close-trial-position` 更新 `position_vouchers.status = 'settled'` 后必须检查错误。
   - 如果 voucher 状态更新失败，直接返回错误，避免前端误以为已完整关闭。

3. **让 `/vouchers` 用真实仓位状态兜底显示**
   - 在 `usePositionVouchers` 查询 redeemed/settled vouchers 后，额外读取对应 `airdrop_positions.status`。
   - 在 hook 里暴露 `redeemedAirdropStatus`（如 `activated` / `settled`）。
   - `/vouchers` 的 RedeemedSection 判断：只要 voucher 自身是 `settled`，或关联 airdrop 已经 `settled`，就显示 `Position closed`。
   - 这样即使旧数据的 voucher.status 还停在 `redeemed`，界面也会正确更新。

4. **关闭后的缓存刷新保持同步**
   - 保留关闭成功后 invalidates：`airdrop-positions`, `position-vouchers`, `voucher-earnings`, `voucher-earnings-ledger`。
   - 确保 `/vouchers` 页面重新拉取后能立刻看到 `Position closed`。