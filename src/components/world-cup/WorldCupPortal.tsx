import { WorldCupPanel } from "./WorldCupPanel";
import { WorldCupTeaserPanel } from "./WorldCupTeaserPanel";
import { getWorldCupPhase } from "@/lib/worldCup";

/**
 * Phase-aware portal:
 * - teaser (before kickoff): countdown + opening match preview
 * - live (during tournament): scoreboard + upcoming
 * - off: render nothing
 */
export const WorldCupPortal = () => {
  const phase = getWorldCupPhase();
  if (phase === "teaser") return <WorldCupTeaserPanel />;
  if (phase === "live") return <WorldCupPanel />;
  return null;
};

export default WorldCupPortal;
