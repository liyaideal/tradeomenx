## 国旗动效改成 shimmer 高光扫光

只改 `WorldCupTeaserPanel.tsx` 里两面国旗的动画方式，其他东西（奖杯底图、翻牌倒计时）不动。

### 改动
1. **删掉 `wc-flag-wave` 关键帧和 `.wc-flag` 类**（skewY + scaleX 那段）
2. **国旗 SVG 外层包一层 `relative overflow-hidden`** 的 div，国旗本体改回完全静态（无 transform）
3. **加一个绝对定位的高光叠层**：
   - 宽度 60% 旗面，高度 200%（斜着扫所以要超出）
   - 用 `background: linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)`
   - `mix-blend-mode: overlay`
   - `transform: translateX(-150%)` → 通过 keyframe 推到 `translateX(250%)`
4. **新关键帧 `wc-shimmer`**：
   - `0% → 60%`：高光从左 -150% 推到右 250%（约 1.4s 实际扫光时间）
   - `60% → 100%`：高光停在右侧外面（约 2.1s 间歇）
   - 总周期 3.5s，`ease-in-out`，`infinite`
   - 两面国旗用不同 `animation-delay`（墨西哥 0s / 南非 1.4s）错峰，不同步扫
5. **不抖、不变形、不破坏圆角**

视觉效果：一束斜向白光每隔几秒从国旗左侧滑到右侧，像金属/丝绸反光，国旗本身完全静止。

### 不动的部分
- 大力神杯底图（依然在）
- 翻牌倒计时（依然在）
- 国旗的 SVG 颜色/尺寸/边框/标签
- Live 面板 / SportsLauncher / 任何其他文件
