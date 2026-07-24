import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { STATUS_STYLES } from "@/lib/statusStyles";
import { formatDistanceToNow } from "date-fns";
import { Globe, Clock, CalendarPlus, Trash2, Copy, Check } from "lucide-react";
import type { ApiKey } from "@/hooks/useApiKeys";
import { TIER_META } from "./tierMeta";

const IpHoverList = ({
  ips,
  children,
}: {
  ips: string[];
  children: React.ReactNode;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        type="button"
        className="font-mono underline decoration-dotted decoration-muted-foreground/40 underline-offset-4 cursor-help text-left"
      >
        {children}
      </button>
    </TooltipTrigger>
    <TooltipContent side="top" align="start" className="max-w-xs">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
        IP whitelist
      </div>
      <ul className="font-mono text-xs space-y-0.5">
        {ips.map((ip) => (
          <li key={ip}>{ip}</li>
        ))}
      </ul>
    </TooltipContent>
  </Tooltip>
);

const KeyHover = ({ apiKey }: { apiKey: ApiKey }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(apiKey.key_prefix);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="font-mono underline decoration-dotted decoration-muted-foreground/40 underline-offset-4 cursor-help text-left text-[11px] text-muted-foreground truncate w-full block"
        >
          {apiKey.key_prefix}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" align="start" className="max-w-xs">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
          Key prefix
        </div>
        <div className="flex items-center gap-2">
          <code className="font-mono text-xs break-all">{apiKey.key_prefix}</code>
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 p-1 rounded hover:bg-muted transition-colors"
            aria-label="Copy key prefix"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-trading-green" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </button>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export const KeysTable = ({
  keys,
  onRevoke,
}: {
  keys: ApiKey[];
  onRevoke: (k: ApiKey) => void;
}) => {
  return (
    <TooltipProvider delayDuration={100}>

    <>
      {/* ---------- Desktop table (md+) ---------- */}
      <div className="hidden md:block border-y border-border/40">
        <div className="grid grid-cols-[1.2fr_1.6fr_0.8fr_1.8fr_0.6fr_0.9fr_0.9fr_0.7fr_0.7fr] gap-3 px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground/70 border-b border-border/40">
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
                className="grid grid-cols-[1.2fr_1.6fr_0.8fr_1.8fr_0.6fr_0.9fr_0.9fr_0.7fr_0.7fr] gap-3 items-center px-3 py-3 text-xs hover:bg-muted/20 transition-colors"
              >
                <div className="font-medium text-xs">{k.label}</div>
                <div className="font-mono text-[11px] text-muted-foreground truncate">{k.key_prefix}</div>
                <div>
                  <Badge variant="outline" className={cn("text-[10px]", meta.chip)}>
                    {meta.label}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1">
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
                  {k.ip_whitelist.length > 0 ? (
                    <IpHoverList ips={k.ip_whitelist}>
                      {`${k.ip_whitelist.length} IP${k.ip_whitelist.length > 1 ? "s" : ""}`}
                    </IpHoverList>
                  ) : (
                    "—"
                  )}
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
                <div className="text-right">
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

      {/* ---------- Mobile card list (<md) ---------- */}
      <div className="md:hidden space-y-3">
        {keys.map((k) => {
          const active = k.status === "active";
          const meta = TIER_META[k.tier];
          const Icon = meta.icon;
          return (
            <article
              key={k.id}
              className={cn(
                "rounded-xl border bg-card/60 p-4 space-y-3",
                active ? "border-border/50" : "border-border/30 opacity-70",
              )}
            >
              {/* Header: label + status */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-semibold text-foreground leading-tight">
                    {k.label}
                  </div>
                  <code className="mt-1 block font-mono text-[11px] text-muted-foreground truncate">
                    {k.key_prefix}
                  </code>
                </div>
                {active ? (
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", STATUS_STYLES.active.badge)}>
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", STATUS_STYLES.neutral.badge)}>
                    Revoked
                  </Badge>
                )}
              </div>

              {/* Tier chip */}
              <div>
                <Badge variant="outline" className={cn("text-[11px] gap-1", meta.chip)}>
                  <Icon className="w-3 h-3" />
                  {meta.label}
                </Badge>
              </div>

              {/* Scopes chips */}
              <div className="flex flex-wrap gap-1">
                {k.scopes.map((s) => (
                  <span
                    key={s}
                    className="px-1.5 py-0.5 rounded bg-muted/40 border border-border/40 font-mono text-[10px] text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Meta row: IP · created · last used */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/30 text-[10px]">
                <div className="min-w-0">
                  <div className="uppercase tracking-wider text-muted-foreground/60 mb-0.5 flex items-center gap-1">
                    <Globe className="w-3 h-3" /> IP
                  </div>
                  <div className="font-mono text-foreground/80">
                    {k.ip_whitelist.length > 0 ? (
                      <IpHoverList ips={k.ip_whitelist}>{k.ip_whitelist.length}</IpHoverList>
                    ) : (
                      "—"
                    )}

                  </div>
                </div>
                <div className="min-w-0">
                  <div className="uppercase tracking-wider text-muted-foreground/60 mb-0.5 flex items-center gap-1">
                    <CalendarPlus className="w-3 h-3" /> Created
                  </div>
                  <div className="font-mono text-foreground/80 truncate">
                    {formatDistanceToNow(new Date(k.created_at))}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="uppercase tracking-wider text-muted-foreground/60 mb-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Last used
                  </div>
                  <div className="font-mono text-foreground/80 truncate">
                    {k.last_used_at ? formatDistanceToNow(new Date(k.last_used_at)) : "Never"}
                  </div>
                </div>
              </div>

              {active && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-10 gap-1.5 text-trading-red hover:text-trading-red hover:bg-trading-red/10 border-trading-red/30"
                  onClick={() => onRevoke(k)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Revoke key
                </Button>
              )}
            </article>
          );
        })}
      </div>
    </>
    </TooltipProvider>
  );

};
