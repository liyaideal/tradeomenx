## 删除 Rewards 积分卡的 "Expires: Dec 31, 2026"

### 改动

`src/pages/Rewards.tsx` 第 127–132 行积分余额卡底部：

**当前：**
```tsx
<div className="mt-4 pt-4 border-t border-border/50">
  <div className="flex items-center justify-between text-xs text-muted-foreground">
    <span>Expires: Dec 31, 2026</span>
    <span>Redemption reopening soon</span>
  </div>
</div>
```

**改为：**
```tsx
<div className="mt-4 pt-4 border-t border-border/50">
  <div className="flex items-center justify-end text-xs text-muted-foreground">
    <span>Redemption reopening soon</span>
  </div>
</div>
```

`content` 是移动端和桌面端共享的，一处改动两端生效。

### 不动

- `usePoints.ts` 中的 `points_expiry` 配置字段保留，方便后续启用过期逻辑时复用。
- 其它 Rewards UI 与文案不变。

### 顺带

更新 `mem://features/rewards/mainnet-launch-pause.md`，记录"积分卡已移除过期日展示（配置仍保留）"。
