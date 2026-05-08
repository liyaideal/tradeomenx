## Hedge-to-Earn 优化(最终方案)

三个决定已确认:
1. ✅ 文案沿用 Welcome Gift 口径
2. ✅ 真实 volume 本轮一起做
3. ✅ 每用户终身 1 条 welcome_gift(跨 connected_account)

---

## 一、阶梯解锁:补真实 volume

`useH2eRewardsSummary.ts` 5 档阶梯逻辑(10K/50K/100K/200K/400K → 10/25/50/75/100%)已完整,只需把 `volumeCompleted` 从 mock `12500` 换成真实成交额。

接入:
- 真实模式:`trades` 表 `status='Filled'` 的 `amount` 累加(SUM)
- Demo 模式:复用 `useSupabaseOrders` / 本地订单数据累加,保持演示一致

---

## 二、Welcome Gift 兜底空投

### 触发
连账号扫描完成后:
- 命中真实 Polymarket 仓位匹配 → 走原 airdrop 流程(matched)
- 完全无匹配 → 检查"该用户是否已领过 welcome_gift"
  - 已领 → 不发
  - 未领 → 从选池随机 1 条发放(welcome_gift)

### 选池规则
`events` 表筛选:`is_resolved=false` + 距 `end_date` ≥ 48h + option price 0.30-0.70 + 按 volume desc 取 Top 20 后随机 1 条。

### 配额
- **每用户终身 1 条**(关键):用 `airdrop_positions` 表查询 `user_id + source='welcome_gift'` count = 0 才允许发
- DB 层加 partial unique index:`(user_id) where source='welcome_gift'`
- 与 matched airdrop 互斥:扫描有任何 matched 时不发 welcome_gift

### 文案口径
- **Toast**:`Welcome gift unlocked — free $10 hedge position`
- **Modal 标题**:`Welcome gift unlocked`
- **Modal 副标题**:`Thanks for connecting your Polymarket wallet — here's a free $10 position on us.`
- **Modal 提示卡**(底部低权重):`Want to hedge it? You can open the opposite side on Polymarket anytime — totally optional.`
- **Position Card Source 列**:`Welcome gift`
- **Position Card Badge**:`AIRDROP` 旁加 `WELCOME GIFT` 浅色徽章

### UI 渲染分支
按 `source` 字段分支:
- `matched`(默认):现有 UI 完全不变(Polymarket 仓位 + 箭头 + OmenX 仓位 + "Hedging:" 行)
- `welcome_gift`:
  - Modal:**移除**上半区"Your Polymarket Position"和中间箭头,只剩 OmenX 仓位卡 + 底部 optional hedge 提示
  - Card:**移除**"Hedging: {externalEventName}"行,Source 列改为"Welcome gift"

### 结算
welcome_gift 没有源仓位,`settlement_trigger` 固定 `event_resolved`,其余结算逻辑复用。

### 风控开关
`points_config` 加 key `welcome_gift_enabled`(默认 true),后台可一键叫停。沿用 `h2e_fund` 总额度。

---

## 三、改动清单

```text
DB migration
  └─ airdrop_positions
      ├─ + source text default 'matched' check (source in ('matched','welcome_gift'))
      ├─ external_event_name / external_side / external_price 改 nullable
      └─ + unique index (user_id) where source='welcome_gift'

points_config
  └─ + row { key: 'welcome_gift_enabled', value: true }

新建
  └─ src/lib/welcomeGift.ts  // 选池 + 资格判定

修改
  ├─ src/hooks/useH2eRewardsSummary.ts          // 真实 volume
  ├─ src/hooks/useConnectedAccounts.ts          // 扫描完成回调:无匹配 → 发 welcome_gift
  ├─ src/hooks/useAirdropPositions.ts           // 类型加 source 字段
  ├─ src/components/AirdropHomepageModal.tsx    // welcome_gift 分支渲染
  ├─ src/components/AirdropPositionCard.tsx     // welcome_gift 分支渲染
  └─ src/components/AirdropNotificationToast.tsx // toast 文案分支
```

---

## 四、记忆更新

完工后更新两处 memory:
- `mem://features/h2e/welcome-gift-fallback`(新建):触发规则、配额、文案口径
- `mem://features/h2e/wallet-and-anti-abuse`:把 volumeCompleted mock → 真实成交额这点补上

确认后我即进入实施。
