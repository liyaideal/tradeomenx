import type { EventOption, TradingEvent } from "@/hooks/useEvents";

/**
 * 判断一个事件是否为"单 market binary"：
 * 恰好两个 option，且 label 是 Yes/No（大小写无关）。
 * 这种事件本质上是一个 market + 两个对立方向，
 * UI 上应把方向选择收敛到 Trade 面板，顶部 chip 行折叠成一个标签。
 */
export function isSingleMarketBinary(options: EventOption[]): boolean {
  if (!options || options.length !== 2) return false;
  const labels = options.map((o) => o.label.trim().toLowerCase()).sort();
  return labels[0] === "no" && labels[1] === "yes";
}

/**
 * 获取一个 binary 事件的两端展示别名。
 * 默认 "Yes" / "No"；若事件配置了 sideLabels（如体育类的两个队名），优先使用。
 */
export function getBinarySideLabels(event: TradingEvent | null | undefined): {
  yes: string;
  no: string;
} {
  return {
    yes: event?.sideLabels?.yes ?? "Yes",
    no: event?.sideLabels?.no ?? "No",
  };
}

/**
 * 从 options 中找出 Yes 和 No 两个 option。
 * 仅在 isSingleMarketBinary 为 true 时调用。
 */
export function getYesNoOptions(options: EventOption[]): {
  yes: EventOption | undefined;
  no: EventOption | undefined;
} {
  return {
    yes: options.find((o) => o.label.trim().toLowerCase() === "yes"),
    no: options.find((o) => o.label.trim().toLowerCase() === "no"),
  };
}
