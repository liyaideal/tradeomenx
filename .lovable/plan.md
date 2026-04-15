

# 将翻页器改为 Load More

## 改动

**文件：** `src/pages/EventsPage.tsx`

| 操作 | 说明 |
|------|------|
| 删除分页器 UI | 移除 ChevronLeft/ChevronRight 按钮和页码组件 |
| 删除 Refresh 按钮 | 移除底部的刷新按钮 |
| 新增 Load More | 点击后在当前列表下方追加下一批事件 |
| 修改状态逻辑 | `currentPage` 改为控制"已加载页数"，`paginatedMarkets` 改为 `slice(0, page * pageSize)` 累积显示 |

### 具体改动

1. **`paginatedMarkets`** — 从 `slice(start, start+pageSize)` 改为 `slice(0, visibleCount * pageSize)`，实现累积展示
2. **Load More 按钮** — 居中显示，样式：`variant="outline"` + 已加载/总数计数（如 "Load More · 20/55"）
3. **隐藏条件** — 当所有事件已展示时隐藏按钮
4. **筛选/Tab 切换时** — 重置 visibleCount 为 1

