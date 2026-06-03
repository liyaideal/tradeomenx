
## 目标

把 Vouchers 这套需求里所有 UI 模块 + 每个模块的全部状态，集中在 `/style-guide` 新建一个 **Vouchers** tab 的 playground 里，研发/QA 一处即可看清。不动业务代码，只新增 style-guide section。

## 模块清单（来自实际代码）

| 模块 | 文件 | 状态枚举 |
|---|---|---|
| VoucherBanner | `components/vouchers/VoucherBanner.tsx` | 0 张可用 / 有 N 张可用 / 即将过期 |
| VoucherCard | `components/vouchers/VoucherCard.tsx` | issued · 正常 / issued · 即将过期(<24h) / redeemed · position open / redeemed · position closed / settled / expired / revoked |
| VoucherEarningsCard | `components/vouchers/VoucherEarningsCard.tsx` | pending 累积中（< 50k 名义额）/ 达标可 claim / claim 处理中 / 空池 |
| EventPickerList (片段) | `components/vouchers/EventPickerList.tsx` | 含 eligible / locked-band / locked-time / locked-resolved 四种 option 行；binary vs multi-market 两种事件行 |
| RedeemVoucherContent | `components/vouchers/RedeemVoucherContent.tsx` | 未选 / 已选 binary / 已选 multi-market · YES / 已选 multi-market · NO / 提交中 / 已有活动 voucher 持仓阻断 |
| CloseVoucherContent | `components/positions/CloseVoucherContent.tsx` | 盈利 / 亏损 / 持有时间未到（disable）/ 提交中 |
| Redeemed Voucher Row（Vouchers 页 Redeemed 区） | `pages/Vouchers.tsx` `RedeemedSection` | binary 别名（alias 在第二行）/ multi-market（market chip + YES/NO chip）/ 已结算 +pnl / 已结算 −pnl |
| Position chip（持仓表里 voucher 来源标记） | `PositionCard.tsx` / `DesktopPositionsPanel.tsx` | "Voucher" 标 + 倒计时（>1d / <1h / 已超时待结算）|

## /style-guide 改动

1. 新文件 `src/pages/StyleGuide/sections/VouchersSection.tsx`
   - 顶部一段 §intro：face value / max profit / hold window / price band / voucher code 字段定义（直接引用 `docs/copy-dictionary.md` 措辞，不引入新 copy）
   - 按上面 8 个模块各开一个 `SectionWrapper` 子卡，每个模块用横向 `PresetRail`（已有的 playground 状态切换 pattern，见 mem://design/playground-state-coverage）让研发点切状态
   - 用静态 mock prop 渲染真实组件，**不发请求**：为每个组件做一个 `mockVoucher / mockPickedOption / mockEarnings` 工厂
   - 连续型参数（hold window 剩余小时、price band 边距、earnings 累积进度）用 Slider + tick rail，实时派生状态读数
2. 注册到 `sections/index.ts`
3. `StyleGuide/index.tsx` `tabs` 数组里加 `{ id: "vouchers", label: "Vouchers", icon: "🎫" }`，并加 `<TabsContent value="vouchers">`
4. mock 数据集中放 `sections/_vouchersMocks.ts`，供 Section 复用

## 不做

- 不改 Vouchers 业务页 (`pages/Vouchers.tsx`) 或任何 voucher 组件的真实行为
- 不改 copy-dictionary、不新增字段名
- 不新建数据库/edge function
- 移动端只复用 `ViewportSwitcher`（已存在），不写专门的 mobile-only 变体

## 验收

- `/style-guide` 顶部 tab 多一项 Vouchers
- 每个模块的全部状态在一屏内可切换浏览
- 切换 Viewport 后移动/桌面变体都能正常渲染
- 研发改组件时，对 playground 的所有状态都不破坏
