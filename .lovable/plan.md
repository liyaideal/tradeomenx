
## 背景

`src/components/deposit/BuyWithFiat.tsx` 当前 Fiat 充值表单存在两个不符合 Banxa 实际计费模型的展示问题：

1. 底部只写死 `Min. $10`，而 Banxa 的最小/最大限额会按 **法币 × 支付方式** 动态变化（例如美区 Card $20–$5,000，Bank $50–$25,000，EU Bank $10–$10,000 等）。用户极易因金额不在区间被打回。
2. 手续费按支付方式硬编码固定百分比（Card/Apple 2.5%、Bank 1.0%），并且支付方式行常驻显示 "2.5% fee" 字样。实际上手续费需要 Banxa 实时计算（含链上 gas + Banxa 手续费），既不固定也不是百分比，应在输入金额后展示具体数值。

## 改动方案（仅前端展示，无业务逻辑改动）

### 1. 数据结构

在 `BuyWithFiat.tsx` 顶部新增按 `currency × method` 的限额表（mock，结构匹配未来 Banxa quote 接口）：

```ts
const LIMITS: Record<string, Record<string, { min: number; max: number }>> = {
  USD: { card: { min: 20, max: 5000 }, bank: { min: 50, max: 25000 }, apple: { min: 20, max: 2000 } },
  EUR: { card: { min: 15, max: 4500 }, bank: { min: 10, max: 10000 }, apple: { min: 15, max: 1800 } },
  GBP: { card: { min: 15, max: 4000 }, bank: { min: 10, max: 9000 },  apple: { min: 15, max: 1500 } },
  AUD: { card: { min: 30, max: 7500 }, bank: { min: 80, max: 30000 }, apple: { min: 30, max: 3000 } },
};
```

派生：`const { min, max } = LIMITS[currency][paymentMethod];`

将 `PAYMENT_METHODS` 项里的 `fee: '2.5%'` 字段移除（不再常驻显示百分比）。

### 2. 输入区限额提示

在 "You pay" label 旁右侧追加一行小字，随 currency / paymentMethod 实时更新：

```
You pay                     Min {min} / Max {max.toLocaleString()} {currency}
```

校验态：
- `parsedAmount > 0 && parsedAmount < min` → 输入框 ring 改 `border-destructive`，下方一行 `text-destructive text-xs`：`Minimum is {min} {currency} for {method.label}`。
- `parsedAmount > max` → 同上文案改为 `Maximum is {max.toLocaleString()} {currency} for {method.label}`。
- Continue 按钮 disabled 条件改为 `parsedAmount < min || parsedAmount > max`。

### 3. 支付方式行：移除固定 % 文案

`PAYMENT_METHODS.map` 渲染时删掉右侧 `{method.fee} fee`，改成展示该方式的 `Min–Max` 区间小字（仍是动态值），帮助用户在选择前就知道范围：

```
Credit / Debit Card               $20 – $5,000     ✓
```

### 4. Fee breakdown：动态数值 + 输入前占位

把原本 "Processing fee = parsedAmount × feePercent" 的硬编码替换为分项展示，且只在输入金额后才有数值；未输入金额时显示占位提示。

未输入金额 (`parsedAmount <= 0`)：

```
Fees                                  Enter amount to see fees
```

单行 muted 文案，提示用户费用需先输入金额由 Banxa 实时报价。

已输入合法金额：拆三行（mock 数值，后续替换为 Banxa quote 返回）：

```
Banxa processing fee        $ {banxaFee.toFixed(2)} {currency}
Network fee (Base)          $ {networkFee.toFixed(2)} {currency}
─────────────────────────────────────────
Total fees                  $ {totalFee.toFixed(2)} {currency}
Exchange rate               1 USDC = {rate} {currency}
```

mock 计算（仅前端占位，便于联调时一行替换为接口字段）：

```ts
const banxaFee = paymentMethod === 'bank'
  ? Math.max(1.5, parsedAmount * 0.009)
  : Math.max(2.5, parsedAmount * 0.022);
const networkFee = 0.35; // Base gas 占位
const totalFee = banxaFee + networkFee;
const usdcReceive = (parsedAmount - totalFee) / selectedCurrency.rate;
```

> 注释中写明：`// TODO: replace with Banxa quote endpoint (fees + min/max are dynamic per region & method)`。

### 5. 底部页脚

把 `Powered by Banxa • Min. $10` 改成：

```
Powered by Banxa • Limits and fees vary by region and payment method
```

去掉误导性的固定 $10。

### 6. Checkout step 同步

`step === 'checkout'` 的 Order summary 内 `Fee` 行同样使用 `totalFee` 而非旧 `fee`，保持口径一致。

## 技术细节

- 改动文件：仅 `src/components/deposit/BuyWithFiat.tsx`。
- 不动 hooks、edge function、Supabase。
- 类型：限额表用上面定义的 `Record<string, Record<string, {min,max}>>`，访问加 `LIMITS[currency]?.[paymentMethod] ?? { min: 10, max: 10000 }` fallback 防止后续新增币种崩溃。
- 移动端 / 桌面端样式沿用现有 `cn(isMobile ? ... : ...)` 节奏，限额提示 `text-xs text-muted-foreground`，错误态 `text-destructive`。
- 不引入新依赖。

## 未在本轮改动

- 真正的 Banxa quote API 接入（min/max、fee 实时拉取）。
- 链上 gas 实时查询。
- Style guide / Playground 状态枚举（如需要后续单独补 `/style-guide` Fiat deposit 段，对应 mem `new-feature-playground-mandate`）。
