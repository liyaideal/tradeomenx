计划：移除 Withdraw 的 Wallet 跨链转换入口，保留链上地址提现与法币提现

改动范围：desktop + mobile 两端的 Withdraw 组件。

1. 移除 Withdraw 的三 Tab 结构中的 “Wallet” Tab
   - Desktop：`WithdrawDialog` 从 3 个 Tab 改为 2 个 Tab：
     - `Address`：Base-USDC 提现到用户保存地址
     - `Fiat`：法币出金模拟
   - Mobile：`/withdraw` 页面同样从 3 个 Tab 改为 2 个 Tab。
   - 默认打开仍然是 `Address`。

2. 删除 Cross-Chain Withdraw 的 UI 引用
   - 从 `WithdrawDialog.tsx` 和 `Withdraw.tsx` 移除 `CrossChainWithdraw` import 与对应 `<TabsContent>`。
   - TabsList 从 `grid-cols-3` 调整为 `grid-cols-2`，避免空位。
   - 文案上不再出现 “Wallet / Swap / Powered by SOCKET / Review Bridge” 等会暗示支持跨链出金的内容。

3. 清理导出，避免后续误用
   - 从 `src/components/withdraw/index.ts` 移除 `CrossChainWithdraw` export。
   - 是否保留 `CrossChainWithdraw.tsx` 文件本身：建议先不删除源文件，只移除入口和导出，避免影响历史代码引用或未来回滚；如果确认完全废弃，也可以后续单独删除文件。

4. 验证
   - 检查 `/wallet` 桌面 Withdraw Dialog：只显示 `Address / Fiat`。
   - 检查移动端 `/withdraw`：只显示 `Address / Fiat`。
   - 运行 TypeScript 检查，确保没有残留引用导致构建错误。

预期结果：Withdraw 不再提供任何跨链转换功能。用户如果需要跨链转化，需要自行在外部钱包或交易所完成。