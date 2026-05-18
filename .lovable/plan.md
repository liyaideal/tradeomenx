## 改动目标

去掉持仓详情弹窗 Funding 区块里与 Net PnL 区块重复的 "Accrued since open" 行，保留 Net PnL 拆解里的 "Funding paid"。

## 改动文件

`src/components/positions/PositionDetailContent.tsx`

## 具体改动

删除 Funding 区块中的 "Accrued since open" 行（约 L212–L226），其它字段（Current rate / hour、You pay·receive / hour、Next accrual）全部保留。Net PnL 区块里的 "Funding paid" 保持不变，作为唯一的累计资金费展示位。

改完后 Funding 区块只承担"费率上下文"职责，Net PnL 区块承担"金额拆解"职责，不再重复。