## 范围
3 个 home 页面修复，全部为 frontend 调整，无业务逻辑/数据改动。

---

### 1. Campaign banner 左侧贴边

**文件：** `src/components/home/HomeCampaignRail.tsx`

当前横滑容器用 `-mx-4 ... px-4` 让左右都 bleed 到屏幕边缘，第一张卡片紧贴左边没有 lead-in。

改为只保留右侧 bleed（横滑时右侧露一截作为可滑动暗示），左侧由父级 `<main className="px-4">` 的 16px gutter 决定，与 greeting / Top Events 标题对齐：

```
-mx-4 ... px-4   →   -mr-4 ... pr-4
```

效果：第一张 banner 与 "CAMPAIGNS" 标题左缘对齐，最后一张仍可滑出右侧屏幕。

---

### 2. Top Events 卡片连成一片

**文件：** `src/components/home/HomeTopEvents.tsx`（仅修改本组件传给 MarketCardB 的 prop，不改 MarketCardB 文件本身，遵循 A/B/C 卡片隔离规则）

当前传了 `noBackground` 给 `MarketCardB`，导致每张卡只剩透明边框 + 行间 10px gap，相邻卡片视觉粘在一起。

去掉 `noBackground` prop（恢复 MarketCardB 默认深色渐变背景 + 分类底图 15% opacity + border）。这样每张卡有明显容器，不再视觉合并；其它布局（间距、动画）保持不变。

---

### 3. 暂时隐藏搜索框

**文件：** `src/pages/MobileHome.tsx`

删除 search 区块（保留 import 以便后续恢复，或一起删掉再加回 — 我倾向直接删 import + JSX，等需要时由 git/历史恢复）：

```
- import { HomeSearchBar } from "@/components/home/HomeSearchBar";
...
- <div className="mt-3">
-   <HomeSearchBar />
- </div>
```

`HomeSearchBar.tsx` 文件本身保留不删，方便后面 events 多了直接加回。

---

### 不动的内容
- `HomeGreeting`、`PersonalSlot`、`MarketCardB` 等组件实现
- 事件数据/筛选逻辑
- Campaign banner 内容、配色、尺寸
