

# 动态生成分类 Tabs

## 问题
`EventTabs` 中的分类列表是硬编码的，缺少 `entertainment` 等新增分类。当数据库中出现新分类的 event 时，Tab 栏不会自动显示。

## 改动

**文件：`src/components/events/EventTabs.tsx`**

1. 改为接收一个 `categories` prop（从实际市场数据中提取的分类列表）
2. 固定 tabs：`All`、`Hot`、`Watchlist` 始终显示在最前面
3. 分类 tabs：根据传入的 `categories` 动态渲染，按 `categoryUtils.ts` 中定义的顺序排列
4. `EventTab` 类型改为 `string`（不再是固定联合类型）

**文件：`src/pages/EventsPage.tsx`**

1. 从 `markets` 数据中提取去重的分类列表：`[...new Set(markets.map(m => m.category))]`
2. 将分类列表传给 `EventTabs`
3. `activeTab` 类型放宽为 `string`

**排序逻辑：** 分类 tab 按 `CATEGORY_STYLES`（categoryUtils.ts）中定义的键顺序排列，确保一致性。未在样式表中定义的新分类排在最后。

