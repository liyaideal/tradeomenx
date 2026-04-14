

# Event/Market 维度分层重构计划

## 问题总结

当前实现将 Event 级字段和 Market 级字段混在同一行/卡片中展示。PRD V1.2 明确了维度分离原则：

```text
Event 行/卡片:  24h Change, 24h Volume, Open Interest, Expiry
Market 子行:    Mark Price, 24h Change, 24h Volume, OI, Funding Rate (无 Leverage)
```

## 改动范围

### 1. 数据层 — `useMarketListData.ts`

**拆分 `MarketRow` 接口为两个类型：**

- `EventRow`：Event 级聚合数据（id, name, icon, category, change24h, volume24h, openInterest, expiry, children, childCount, isNew, isClosingSoon）
  - 去掉 `markPrice`、`fundingRate`、`maxLeverage`
  - `change24h` 口径：取 24h Volume 最大 market 的 change（当前 mock 逻辑不变，只是从 children 中取 volume 最大的那个 child 的 change24h）
  - `volume24h` / `openInterest`：所有 children 求和（已正确）

- `MarketChildRow`：Market 级数据（id, optionLabel, markPrice, change24h, volume24h, openInterest, fundingRate）
  - 去掉 `maxLeverage`（用户确认不需要）
  - 保留独立的 change24h / volume24h / openInterest（market 自身的值）

**hook 返回类型改为 `EventRow[]`，其中 `children: MarketChildRow[]`。**

### 2. 桌面端 List View — `MarketListView.tsx`

**Event 父行：8 列（从当前 10 列精简）**

| # | 列 | 变化 |
|---|------|------|
| 1 | ★ | 不变 |
| 2 | Event | 不变，保留 ▾ N markets 标识 |
| 3 | Category | 不变 |
| 4 | 24h Change | 不变（Event 级，绿红 + %） |
| 5 | 24h Volume | 不变 |
| 6 | Open Interest | 不变 |
| 7 | Expiry | 不变 |
| 8 | → | 不变 |

**删除**：`Price` 列和 `Funding` 列从父行移除。

**Market 子行：8 列（展开后）**

| # | 列 | 说明 |
|---|------|------|
| 1 | (空) | 对齐星星列，留空 |
| 2 | Market Name | 缩进 24px + └ 图标 |
| 3 | Mark Price | `$0.65` 格式（**新增到子行**） |
| 4 | 24h Change | Market 自身的 change |
| 5 | 24h Volume | Market 自身的 volume |
| 6 | Open Interest | Market 自身的 OI |
| 7 | Funding Rate | `+0.012%/8h`（**新增到子行**） |
| 8 | → | 进入该 market 交易页 |

**表头需要适配两套列定义**：父行 8 列和子行 8 列共用同一 `<thead>`，子行 Category 列替换为 Price，Expiry 列替换为 Funding。通过 colspan 或条件渲染对齐。

### 3. 移动端 Grid View — `MarketCard.tsx`

**按 PRD 5.2 重构卡片内容，只保留 Event 级字段：**

- **删除**：Mark Price 格子
- **保留**：24h Change / 24h Volume / Open Interest / Expiry（2x2 grid）
- **新增**：标题下方加 `▾ N markets` 指示器（多 market 时显示）
- **新增**：底部 CTA 区域
  - 多 market：`[View Markets →]`
  - 单 market：`[Trade →]`
- **调整**：2x2 grid 字段标签更新（去掉 Mark Price，加上 Expires in）

### 4. 不改动的部分

- `change24h` 的 mock 逻辑保持不变（纯随机 mock）
- 排序、筛选、Watchlist 等功能不变
- 桌面端 Grid 视图 (`MarketGridView.tsx`) 复用同一 `MarketCard`，自动生效
- DESIGN.md 暂不更新（等 UI 稳定后统一补充）

## 文件清单

| 文件 | 操作 |
|------|------|
| `src/hooks/useMarketListData.ts` | 重构类型 + 数据映射逻辑 |
| `src/components/events/MarketListView.tsx` | 父行去掉 Price/Funding 列，子行加回 Price/Funding 列 |
| `src/components/events/MarketCard.tsx` | 去掉 Mark Price，加 ▾ N markets + CTA |
| `src/components/events/MarketGridView.tsx` | 可能需要微调 props 类型 |

