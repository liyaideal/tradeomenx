

## 点击 Activate 直接激活空投仓位

用户选择了最简单的方案：点击 Activate 按钮后，pending airdrop 直接变成 activated 仓位，无需跳转或交易。

---

### 改动范围

#### 1. `useAirdropPositions.ts` — 新增 `activateAirdrop` 方法

- 新增一个 `activateAirdrop(airdropId: string)` 函数
- Demo 模式下：更新 MOCK 数据状态从 `pending` → `activated`，设置 `activatedAt = now()`
  - 因为 mock 数据是静态常量，需要改成用 `useState` 或 React Query 缓存 mutation 的方式来管理状态变更
  - 具体做法：用 `queryClient.setQueryData` 直接修改缓存中对应 airdrop 的 status
- 非 demo 模式：调用 supabase 更新 `airdrop_positions` 表的 status 和 activated_at
- 激活成功后显示 toast："Airdrop activated! Position is now live"
- 返回 `activateAirdrop` 和 `isActivating` 状态

#### 2. `DesktopTrading.tsx` — Activate 按钮调用 activateAirdrop

- 把 pending airdrop 行的 Activate 按钮从 `navigate(...)` 改成调用 `activateAirdrop(airdrop.id)`
- 按钮点击后显示 loading 状态，激活完成后该行自动从 PENDING 变成 AIRDROP（因为数据刷新）

#### 3. `AirdropPositionCard.tsx` — 移动端同步修改

- 同样把 "Activate — Make a Trade" 按钮改成直接调用 `activateAirdrop`
- 激活后卡片自动刷新为 activated 状态

#### 4. `TradingCharts.tsx` — 移动端 Charts tab 同步

- 如果 Charts tab 的 Positions 区域也有 Activate 按钮，同步改成直接激活

---

### 技术细节

**Demo 模式状态变更方案：**
```typescript
// useAirdropPositions.ts
const activateAirdrop = async (id: string) => {
  if (isDemoMode) {
    queryClient.setQueryData(queryKey, (old) =>
      old.map(a => a.id === id 
        ? { ...a, status: "activated", activatedAt: new Date().toISOString() } 
        : a
      )
    );
  } else {
    await supabase.from("airdrop_positions")
      .update({ status: "activated", activated_at: new Date().toISOString() })
      .eq("id", id);
    queryClient.invalidateQueries(queryKey);
  }
  toast.success("Airdrop activated!");
};
```

**涉及文件：**
- `src/hooks/useAirdropPositions.ts`
- `src/pages/DesktopTrading.tsx`
- `src/components/AirdropPositionCard.tsx`
- `src/pages/TradingCharts.tsx`（如有 Activate 按钮）

