## 改动
在 `CampaignBannerCarousel.tsx` 给标题和副文案加 `line-clamp`，并稍稍上提 CTA 区域，避免按钮贴边。

### 1. 标题（行 305-312）
```diff
- "font-semibold leading-tight text-foreground",
+ "font-semibold leading-tight text-foreground line-clamp-2",
```
最多 2 行，超出省略号。

### 2. heroMetric 标签（行 313-320）
副标签 `line-clamp-1`，避免单词换行撑高。

### 3. 内容容器减小 gap（行 277）
`gap-5` → `gap-4`，让 CTA 与标题之间留更多缓冲，按钮不贴底边。

### 4. 信息列内部 gap（行 286）
`gap-4` → `gap-3`，与 1 / 2 配合。

不改任何其它内容、动画、配色。

## 文件
- `src/components/campaign/CampaignBannerCarousel.tsx`