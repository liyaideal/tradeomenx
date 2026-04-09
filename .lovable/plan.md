
### 我已经定位到这 3 个问题的根因了，不需要你再额外帮忙补信息

#### 实际问题是什么
1. **新注册账号自动“继承”旧钱包**
   - `useConnectedAccounts.ts` 现在把 demo 钱包写死存在全局 `localStorage` key：`demo_connected_accounts`
   - 这个 key **没有按用户隔离**，所以换账号后会读到上一个账号的 mock 钱包

2. **Airdrop toast 不弹**
   - `AirdropNotificationToast.tsx` 现在是按“是否有 active account”来触发，不是按“扫描完成后新增 airdrop”来触发
   - 同时它的 `sessionStorage` 记录也是**全局的，不分用户**
   - 结果就是 toast 可能：
     - 提前在连接阶段就触发并被错过
     - 或被旧账号的 session 标记直接压掉

3. **桌面交易页 Positions pending banner 不显示**
   - 之前改的是 `src/components/DesktopPositionsPanel.tsx`
   - 但桌面交易页真正使用的是 **`src/pages/DesktopTrading.tsx` 里内联的 Positions 表格**
   - 所以之前那次修改基本改到了一个**没接入当前页面的组件**

---

### 修复方案

#### 1. 先把 demo 数据彻底改成“按当前用户隔离”
**文件：`src/hooks/useConnectedAccounts.ts`**

- 把 demo storage key 改成带用户维度，例如：
  - `demo_connected_accounts:${user.id}`
- React Query 的 demo query key 也带上 `user.id`
- 登录 / 注册 / 切换账号后，只读取当前用户自己的 demo 钱包
- 这样新账号就不会自动看到旧账号的钱包

#### 2. 让 airdrop 只在“扫描完成后”出现
**文件：`src/hooks/useAirdropPositions.ts` + `src/hooks/useConnectedAccounts.ts`**

- 现在逻辑是：只要 `activeAccounts.length > 0` 就直接返回 mock airdrops
- 我会改成：只有当连接账户 `scanStatus === "complete"` 后，才返回 mock airdrops
- `queryKey` 不能只看 `activeAccounts.length`，要包含：
  - account id
  - status
  - scanStatus
- 这样页面数据会真正跟 “Scanning -> Complete” 联动

#### 3. 重写 toast 触发条件
**文件：`src/components/AirdropNotificationToast.tsx`**

- 不再按“新 active account”触发
- 改成按“扫描完成后，新出现的 pending airdrop id”触发
- `sessionStorage` key 也改成按用户隔离
- 触发时机调整为：
  - 扫描完成
  - pending airdrops 从 0 变成 >0
  - 当前这些 airdrop 还没 toast 过
- 这样 toast 才会在正确时间点出现，而不是过早或被旧状态吞掉

#### 4. 把桌面端 pending banner 修到真正生效的页面
**文件：`src/pages/DesktopTrading.tsx`**

- 在桌面交易页真实的 Positions 区块里引入 `useAirdropPositions`
- 在 `bottomTab === "Positions"` 的真实表格上方加 pending banner
- 同时把 activated airdrop 行也加到这个真实表格区域
- 不再继续改 `DesktopPositionsPanel.tsx` 这个当前未接入的实现

---

### 这次会改到的核心文件
- `src/hooks/useConnectedAccounts.ts`
- `src/hooks/useAirdropPositions.ts`
- `src/components/AirdropNotificationToast.tsx`
- `src/pages/DesktopTrading.tsx`

---

### 修完后预期行为
```text
注册新账号
  -> 不会看到旧账号连接过的钱包

Settings 连接钱包
  -> Scanning
  -> scanStatus = complete
  -> airdrops 出现
  -> toast 弹出

进入桌面交易页 Positions
  -> 顶部看到 pending activation banner
  -> 同区域能看到 activated/pending 的 airdrop 展示
```

---

### 为什么这次拖久了
不是你这边少给了信息，核心是之前有两处判断偏了：
1. **demo 状态做成了全局存储，导致跨账号串数据**
2. **桌面端改到了未实际渲染的组件，而不是 `DesktopTrading.tsx`**

这两个点解释了为什么你一直看不到预期结果。

---

### 我接下来会按这个顺序修
1. 先修 demo 数据按用户隔离
2. 再修 airdrop 只在 scan complete 后出现
3. 再修 toast 触发条件
4. 最后把桌面交易页真正的 banner 接到 `DesktopTrading.tsx` 上
5. 完成后再用你刚才那条真实复现场景重新验证
