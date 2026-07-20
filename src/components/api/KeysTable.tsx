import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { STATUS_STYLES } from "@/lib/statusStyles";
import { formatDistanceToNow } from "date-fns";
import type { ApiKey } from "@/hooks/useApiKeys";
import { TIER_META } from "./tierMeta";

export const KeysTable = ({
  keys,
  onRevoke,
}: {
  keys: ApiKey[];
  onRevoke: (k: ApiKey) => void;
}) => {
  return (
    <div className="border-y border-border/40">
      {/* Header (desktop) */}
      <div className="hidden md:grid grid-cols-[1.2fr_1.6fr_0.8fr_1.8fr_0.6fr_0.9fr_0.9fr_0.7fr_0.7fr] gap-3 px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground/70 border-b border-border/40">
        <div>Label</div>
        <div>Key</div>
        <div>Tier</div>
        <div>Scopes</div>
        <div>IP</div>
        <div>Created</div>
        <div>Last used</div>
        <div>Status</div>
        <div className="text-right">Action</div>
      </div>
      <div className="divide-y divide-border/30">
        {keys.map((k) => {
          const active = k.status === "active";
          const meta = TIER_META[k.tier];
          return (
            <div
              key={k.id}
              className="md:grid md:grid-cols-[1.2fr_1.6fr_0.8fr_1.8fr_0.6fr_0.9fr_0.9fr_0.7fr_0.7fr] gap-3 items-center px-3 py-3 text-xs hover:bg-muted/20 transition-colors"
            >
              <div className="font-medium text-sm md:text-xs mb-1 md:mb-0">{k.label}</div>
              <div className="font-mono text-[11px] text-muted-foreground truncate">{k.key_prefix}</div>
              <div className="mb-1 md:mb-0">
                <Badge variant="outline" className={cn("text-[10px]", meta.chip)}>
                  {meta.label}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1 mb-1 md:mb-0">
                {k.scopes.slice(0, 4).map((s) => (
                  <span
                    key={s}
                    className="px-1.5 py-0.5 rounded bg-background/60 border border-border/40 font-mono text-[10px]"
                  >
                    {s}
                  </span>
                ))}
                {k.scopes.length > 4 && (
                  <span className="px-1.5 py-0.5 rounded bg-background/60 border border-border/40 font-mono text-[10px] text-muted-foreground">
                    +{k.scopes.length - 4}
                  </span>
                )}
              </div>
              <div className="font-mono text-muted-foreground">
                {k.ip_whitelist.length > 0 ? `${k.ip_whitelist.length} IP${k.ip_whitelist.length > 1 ? "s" : ""}` : "—"}
              </div>
              <div className="font-mono text-muted-foreground">
                {formatDistanceToNow(new Date(k.created_at), { addSuffix: true })}
              </div>
              <div className="font-mono text-muted-foreground">
                {k.last_used_at ? formatDistanceToNow(new Date(k.last_used_at), { addSuffix: true }) : "Never"}
              </div>
              <div>
                {active ? (
                  <Badge variant="outline" className={cn("text-[10px]", STATUS_STYLES.active.badge)}>
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className={cn("text-[10px]", STATUS_STYLES.neutral.badge)}>
                    Revoked
                  </Badge>
                )}
              </div>
              <div className="md:text-right mt-2 md:mt-0">
                {active && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-trading-red hover:text-trading-red hover:bg-trading-red/10"
                    onClick={() => onRevoke(k)}
                  >
                    Revoke
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
