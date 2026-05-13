## 问题
`CampaignBannerCarousel` 中每张 banner 用 `min-h-[200px]`（mobile）/ `min-h-[220px]`（desktop）。当某张 banner 文案/标签更多时，会撑得更高，于是轮播切换时容器随内容跳动，视觉不一致。

## 方案
把 banner 容器改成**定高**（不再是 min-h），所有 banner 共用同一高度。内容超出时由内部 truncate / 换行控制，不再撑开外框。

### 改动点（`src/components/campaign/CampaignBannerCarousel.tsx` 第 226 行附近）

```diff
- isMobile ? "min-h-[200px] p-4" : "min-h-[220px] p-6"
+ isMobile ? "h-[200px] p-4" : "h-[220px] p-6"
```

同时给 banner 内的文本块加上 `min-w-0` + 必要的 `line-clamp` 防止文字溢出（如标题已是 `text-2xl/tight`，限定 `line-clamp-2`，副文案 `line-clamp-1`），保持视觉对齐。

## 不会动的
- 轮播逻辑、自动切换、theme map、图片资源、indicator 点
- 桌面端逻辑只是把 `min-h` 替换为 `h`，比例保持原样
- 其它任何首页文件

## 文件改动
- `src/components/campaign/CampaignBannerCarousel.tsx`（仅样式调整 + 必要 line-clamp）