

# 优化卡片底图加载速度 + 文档更新

## 问题

| 文件 | 当前大小 | 目标 |
|------|---------|------|
| sports.jpg | 1.4 MB | ~50 KB |
| politics.jpg | 689 KB | ~40 KB |
| finance.jpg | 607 KB | ~40 KB |
| tech.jpg | 462 KB | ~35 KB |
| social.jpg | 243 KB | ~30 KB |
| crypto.jpg | 195 KB | ~25 KB |
| entertainment.jpg | 154 KB | ~25 KB |

卡片宽度最多 ~400px，且图片只以 15% 透明度显示，完全不需要高分辨率原图。

## 改动

### 1. 压缩所有底图（脚本处理）
- 使用 ImageMagick 将所有 7 张图片缩放到 **600px 宽度**
- JPEG 质量降到 **60%**（反正只有 15% 透明度，看不出画质差异）
- 预计总大小从 3.7MB 降到 ~250KB

### 2. 添加 CSS 预加载提示
- 在 `MarketCardB` 中把 `loading="lazy"` 保留（已有），确保首屏外的卡片不阻塞加载

### 3. 更新 DESIGN.md
- 新增「Category Card Backgrounds」章节，记录：
  - 每个分类对应的底图文件路径
  - 透明度规范（0.15）
  - 渐变遮罩参数
  - 图片尺寸/质量要求（≤600px, JPEG 60%）

### 4. 更新 Style Guide
- 在 Design Tokens 或 Trading section 新增底图预览子区域
- 展示 7 个分类的底图缩略图 + 对应的分类名和文件路径

## 效果
- 页面总图片负载从 **3.7MB → ~250KB**（减少 93%）
- 加载速度显著提升，特别是移动端
- 底图规范有据可查

