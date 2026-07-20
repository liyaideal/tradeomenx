import { useState, useMemo } from "react";
import {
  Plus,
  Check,
  X,
  Copy,
  AlertTriangle,
  Mail,
  ShieldCheck,
  KeyRound,
  Eye,
  Zap,
  Rocket,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { BottomNav } from "@/components/BottomNav";
import { MobileHeader } from "@/components/MobileHeader";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  MobileDrawer,
  MobileDrawerSection,
  MobileDrawerActions,
} from "@/components/ui/mobile-drawer";
import { useAuth } from "@/hooks/useAuth";
import { LoginPrompt } from "@/components/LoginPrompt";
import { toast } from "sonner";
import { EmptyState, LoadingState, ErrorState } from "@/components/states";
import {
  useApiKeys,
  useTierEligibility,
  ALL_SCOPES,
  type ApiKey,
  type ApiScope,
  type ApiTier,
  type TierEligibility,
} from "@/hooks/useApiKeys";
import { verifyDemoOtp, DEMO_OTP_HINT } from "@/lib/demoOtp";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { STATUS_STYLES } from "@/lib/statusStyles";

/* -------------------- Single tier token source -------------------- */
type TierMeta = {
  label: string;
  icon: LucideIcon;
  /** Text/accent color class */
  accent: string;
  /** Tinted bg + border for accent chip */
  chip: string;
  /** Dot fill when eligible */
  dotFill: string;
  /** Faint surface tint for "current tier" hint */
  surfaceHint: string;
};
const TIER_META: Record<ApiTier, TierMeta> = {
  read_only: {
    label: "Read-only",
    icon: Eye,
    accent: "text-muted-foreground",
    chip: "bg-muted text-muted-foreground border-border",
    dotFill: "bg-muted-foreground",
    surfaceHint: "bg-muted-foreground/[0.04]",
  },
  trading: {
    label: "Trading",
    icon: Zap,
    accent: "text-primary",
    chip: "bg-primary/10 text-primary border-primary/20",
    dotFill: "bg-primary",
    surfaceHint: "bg-primary/[0.04]",
  },
  pro_mm: {
    label: "Pro / Market Maker",
    icon: Rocket,
    accent: "text-amber-400",
    chip: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    dotFill: "bg-amber-400",
    surfaceHint: "bg-amber-400/[0.04]",
  },
};
const TIER_ORDER: ApiTier[] = ["read_only", "trading", "pro_mm"];

const isValidIp = (raw: string) => {
  const s = raw.trim();
  if (!s) return false;
  return /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/.test(s) || /^[0-9a-fA-F:]+(\/\d{1,3})?$/.test(s);
};

/* -------------------- Page -------------------- */
const ApiManagement = () => {
  const isMobile = useIsMobile();
  
  const { user } = useAuth();
  const { keys, isLoading, isError, refetch, createKey, revokeKey } = useApiKeys();
  const { tiers } = useTierEligibility();

  const [createOpen, setCreateOpen] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<ApiKey | null>(null);
  const [newSecret, setNewSecret] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        {!isMobile && <EventsDesktopHeader />}
        {isMobile && <MobileHeader title="Keys & access" showLogo={false} showBack={true} />}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
          <div className="max-w-md mx-auto">
            <LoginPrompt />
          </div>
        </div>
        {isMobile && <BottomNav />}
      </div>
    );
  }

  const eligibleTiers = tiers.filter((t) => t.eligible);

  const content = (
    <div>

      {!isMobile && (
        <div className="pb-8">
          <PageHeader
            title="Keys & access"
            subtitle="Generate signed keys for programmatic access. Secrets are shown once at creation and never stored in plain text."
          />
        </div>
      )}


      {/* Hairline divider */}
      <div className="border-t border-border/30" />

      {/* Quick-answer chip row */}
      <div className="py-5 flex flex-wrap items-center gap-2">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground mr-1">You can create</span>
        {TIER_ORDER.map((tid) => {
          const t = tiers.find((x) => x.tier === tid)!;
          const meta = TIER_META[tid];
          const Icon = meta.icon;
          const state = t.manualReview ? "manual" : t.eligible ? "ok" : "locked";
          return (
            <span
              key={tid}
              className={cn(
                "inline-flex items-center gap-1.5 px-2 py-1 rounded border text-[11px] font-medium",
                state === "ok" && meta.chip,
                state === "locked" && "bg-muted/40 text-muted-foreground/70 border-border/40",
                state === "manual" && "bg-amber-400/10 text-amber-400/90 border-amber-400/20",
              )}
            >
              <Icon className="w-3 h-3" />
              {meta.label}
              {state === "ok" && <Check className="w-3 h-3 opacity-80" />}
              {state === "manual" && <span className="opacity-80">· manual</span>}
              {state === "locked" && <X className="w-3 h-3 opacity-60" />}
            </span>
          );
        })}
      </div>

      {/* Hairline divider */}
      <div className="border-t border-border/30" />

      {/* Access tiers — shared-border track */}
      <section className="py-6 md:py-8">
        <div className="flex items-baseline justify-between gap-3 mb-4 min-w-0">
          <h2 className="text-sm font-semibold text-foreground flex-shrink-0">Access tiers</h2>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 hidden md:inline truncate min-w-0">
            Auto-evaluated · Read-only → Trading → Pro
          </span>
        </div>
        <TierTrack tiers={tiers} highestEligible={eligibleTiers[eligibleTiers.length - 1]?.tier} />
      </section>

      {/* Hairline divider */}
      <div className="border-t border-border/30" />

      {/* Keys section */}
      <section className="py-6 md:py-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Your API keys</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {keys.length} key{keys.length === 1 ? "" : "s"} · secrets shown once at creation
            </p>
          </div>
          {keys.length > 0 && (
            <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5">
              <Plus className="w-4 h-4" /> Create key
            </Button>
          )}
        </div>

        {isLoading ? (
          <LoadingState label="Loading keys…" />
        ) : isError ? (
          <ErrorState
            title="Couldn't load API keys"
            description="Something went wrong fetching your keys."
            onRetry={() => refetch()}
          />
        ) : keys.length === 0 ? (
          <EmptyState
            variant="card"
            icon={KeyRound}
            title="No API keys yet"
            description="Create your first key to start streaming data or placing orders programmatically."
            action={
              <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5">
                <Plus className="w-4 h-4" /> Create key
              </Button>
            }
          />
        ) : (
          <KeysTable keys={keys} onRevoke={setRevokeTarget} />
        )}
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {isMobile ? (
        <>
          <MobileHeader title="Keys & access" showLogo={false} showBack={true} />
          <div className="px-4 py-6 pb-24 max-w-7xl mx-auto">{content}</div>
          <BottomNav />
        </>
      ) : (
        <>
          <EventsDesktopHeader />
          <main className="max-w-7xl mx-auto w-full px-8 py-10">{content}</main>
        </>
      )}

      <CreateKeyFlow
        open={createOpen}
        onOpenChange={(o) => {
          setCreateOpen(o);
          if (!o) setNewSecret(null);
        }}
        onCreated={(secret) => setNewSecret(secret)}
        newSecret={newSecret}
        tiers={tiers}
        createKey={createKey}
        isMobile={!!isMobile}
      />

      <RevokeDialog
        target={revokeTarget}
        onClose={() => setRevokeTarget(null)}
        onConfirm={async (id) => {
          await revokeKey.mutateAsync(id);
          toast.success("API key revoked");
          setRevokeTarget(null);
        }}
        pending={revokeKey.isPending}
      />
    </div>
  );
};

/* -------------------- Tier track (shared-border) -------------------- */
const TierTrack = ({
  tiers,
  highestEligible,
}: {
  tiers: TierEligibility[];
  highestEligible?: ApiTier;
}) => {
  return (
    <div className="relative border-y border-border/40">
      {/* Top progress rail (desktop only) */}
      <div className="hidden md:block absolute inset-x-0 top-0 h-px bg-gradient-to-r from-border via-border to-primary/60" />
      {/* Progress nodes on the rail */}
      <div className="hidden md:grid absolute inset-x-0 -top-[5px] grid-cols-3 pointer-events-none">
        {TIER_ORDER.map((tid) => {
          const t = tiers.find((x) => x.tier === tid)!;
          const meta = TIER_META[tid];
          const active = t.eligible || t.manualReview;
          return (
            <div key={tid} className="flex justify-start pl-4">
              <span
                className={cn(
                  "block w-[10px] h-[10px] rounded-full border",
                  active ? cn(meta.dotFill, "border-transparent") : "bg-background border-border",
                )}
              />
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x divide-y md:divide-y-0 divide-border/40">
        {TIER_ORDER.map((tid) => {
          const t = tiers.find((x) => x.tier === tid)!;
          const isCurrent = highestEligible === tid;
          return <TierSegment key={tid} tier={t} current={isCurrent} />;
        })}
      </div>
    </div>
  );
};

const TierSegment = ({ tier, current }: { tier: TierEligibility; current: boolean }) => {
  const meta = TIER_META[tier.tier];
  const Icon = meta.icon;
  const statusBadge = tier.manualReview ? (
    <Badge variant="outline" className="bg-amber-400/10 text-amber-400 border-amber-400/20 text-[10px]">
      Manual approval
    </Badge>
  ) : tier.eligible ? (
    <Badge variant="outline" className={cn("text-[10px]", STATUS_STYLES.success.badge)}>
      Available
    </Badge>
  ) : (
    <Badge variant="outline" className={cn("text-[10px]", STATUS_STYLES.neutral.badge)}>
      Requirements not met
    </Badge>
  );

  return (
    <div
      className={cn(
        "p-4 md:p-5 flex flex-col gap-3 transition-colors hover:bg-muted/20",
        current && meta.surfaceHint,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Icon className={cn("w-4 h-4 shrink-0", meta.accent)} />
          <div className="text-sm font-semibold text-foreground truncate">{meta.label}</div>
          {current && (
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground/70 border border-border/40 px-1 rounded">
              you
            </span>
          )}
        </div>
        {statusBadge}
      </div>
      <p className="text-xs text-muted-foreground leading-snug">{tier.description}</p>
      <ul className="space-y-1.5">
        {tier.requirements.map((r, i) => (
          <li key={i} className="flex items-start gap-2 text-xs">
            {r.met ? (
              <Check className="w-3.5 h-3.5 text-trading-green mt-0.5 shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-muted-foreground/50 mt-0.5 shrink-0" />
            )}
            <span className={r.met ? "text-foreground" : "text-muted-foreground"}>
              {r.label}
              {r.hint && !r.met && (
                <span className="block text-[10px] text-muted-foreground/70 mt-0.5">{r.hint}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
      {tier.manualReview && (
        <a href="mailto:api@omenx.io?subject=Pro%2FMM%20API%20access%20request" className="mt-1">
          <Button variant="outline" size="sm" className="w-full gap-1.5">
            <Mail className="w-3.5 h-3.5" /> Contact us
          </Button>
        </a>
      )}
    </div>
  );
};


/* -------------------- Keys table -------------------- */
const KeysTable = ({
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

/* -------------------- Create wizard (Dialog / Drawer) -------------------- */
type WizardStep = 1 | 2 | 3 | 4;

const CreateKeyFlow = ({
  open,
  onOpenChange,
  onCreated,
  newSecret,
  tiers,
  createKey,
  isMobile,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onCreated: (secret: string) => void;
  newSecret: string | null;
  tiers: TierEligibility[];
  createKey: ReturnType<typeof useApiKeys>["createKey"];
  isMobile: boolean;
}) => {
  const [step, setStep] = useState<WizardStep>(1);
  const [label, setLabel] = useState("");
  const [tier, setTier] = useState<ApiTier>("read_only");
  const [scopes, setScopes] = useState<ApiScope[]>(["read_public"]);
  const [ipRaw, setIpRaw] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const reset = () => {
    setStep(1);
    setLabel("");
    setTier("read_only");
    setScopes(["read_public"]);
    setIpRaw("");
    setOtp("");
    setOtpError(null);
    setCopied(false);
  };

  const ipList = useMemo(
    () =>
      ipRaw
        .split(/[,\n\s]+/)
        .map((s) => s.trim())
        .filter(Boolean),
    [ipRaw],
  );
  const ipInvalid = ipList.filter((ip) => !isValidIp(ip));
  const requiresIp = scopes.some((s) => ALL_SCOPES.find((x) => x.id === s)?.requiresIp);
  const availableScopes = ALL_SCOPES.filter((s) =>
    tier === "read_only" ? !s.requiresIp : true,
  );
  const tierEntries = tiers.filter((t) => t.tier !== "pro_mm"); // pro is manual review

  const canNext1 = label.trim().length >= 2 && (tiers.find((t) => t.tier === tier)?.eligible ?? false);
  const canNext2 = scopes.length > 0 && (!requiresIp || (ipList.length > 0 && ipInvalid.length === 0));
  const canSubmit3 = /^\d{6}$/.test(otp.trim());

  const handleClose = (o: boolean) => {
    onOpenChange(o);
    if (!o) setTimeout(reset, 200);
  };

  const handleVerifyAndCreate = async () => {
    if (!verifyDemoOtp(otp)) {
      setOtpError("Invalid code. Try again.");
      return;
    }
    setOtpError(null);
    try {
      const res = await createKey.mutateAsync({
        label: label.trim(),
        tier,
        scopes,
        ip_whitelist: ipList,
      });
      onCreated(res.secret);
      setStep(4);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to create key");
    }
  };

  const stepTitles: Record<WizardStep, string> = {
    1: "Label & tier",
    2: "Scopes & IP",
    3: "Verify 2FA",
    4: "Save secret",
  };
  const title = step === 4 ? "API key created" : "Create API key";
  const description =
    step === 1
      ? "Choose a label and tier for this key."
      : step === 2
      ? "Select scopes and configure IP whitelist."
      : step === 3
      ? "Verify with your 2FA code to generate the key."
      : "Copy the secret now — it will not be shown again.";

  const body = (
    <div className="space-y-4">
      <StepIndicator current={step} titles={stepTitles} />

      {step === 1 && (
        <Step1
          label={label}
          setLabel={setLabel}
          tier={tier}
          setTier={setTier}
          tierEntries={tierEntries}
        />
      )}
      {step === 2 && (
        <Step2
          scopes={scopes}
          setScopes={setScopes}
          availableScopes={availableScopes}
          requiresIp={requiresIp}
          ipRaw={ipRaw}
          setIpRaw={setIpRaw}
          ipInvalid={ipInvalid}
        />
      )}
      {step === 3 && (
        <Step3
          otp={otp}
          setOtp={(v) => {
            setOtp(v);
            setOtpError(null);
          }}
          otpError={otpError}
        />
      )}
      {step === 4 && newSecret && (
        <Step4Secret
          secret={newSecret}
          copied={copied}
          onCopy={() => {
            navigator.clipboard.writeText(newSecret);
            setCopied(true);
            toast.success("Secret copied");
          }}
        />
      )}
    </div>
  );

  const actions = (
    <>
      {step === 1 && (
        <>
          <Button variant="outline" onClick={() => handleClose(false)} className="h-11 md:h-10">
            Cancel
          </Button>
          <Button disabled={!canNext1} onClick={() => setStep(2)} className="h-11 md:h-10">
            Next
          </Button>
        </>
      )}
      {step === 2 && (
        <>
          <Button variant="outline" onClick={() => setStep(1)} className="h-11 md:h-10">
            Back
          </Button>
          <Button disabled={!canNext2} onClick={() => setStep(3)} className="h-11 md:h-10">
            Next
          </Button>
        </>
      )}
      {step === 3 && (
        <>
          <Button variant="outline" onClick={() => setStep(2)} disabled={createKey.isPending} className="h-11 md:h-10">
            Back
          </Button>
          <Button
            disabled={!canSubmit3 || createKey.isPending}
            onClick={handleVerifyAndCreate}
            className="h-11 md:h-10"
          >
            {createKey.isPending ? "Creating…" : "Verify & create"}
          </Button>
        </>
      )}
      {step === 4 && (
        <Button className="w-full h-11 md:h-10" onClick={() => handleClose(false)}>
          Done
        </Button>
      )}
    </>
  );

  if (isMobile) {
    return (
      <MobileDrawer open={open} onOpenChange={handleClose} title={title} description={description}>
        <MobileDrawerSection>{body}</MobileDrawerSection>
        <MobileDrawerActions>{actions}</MobileDrawerActions>
      </MobileDrawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {body}
        <DialogFooter className="gap-2">{actions}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* -------------------- Step indicator (4 nodes + connector) -------------------- */
const StepIndicator = ({
  current,
  titles,
}: {
  current: WizardStep;
  titles: Record<WizardStep, string>;
}) => {
  const steps: WizardStep[] = [1, 2, 3, 4];
  return (
    <div className="flex items-center gap-1.5">
      {steps.map((s, i) => {
        const state = s < current ? "done" : s === current ? "current" : "todo";
        return (
          <div key={s} className="flex items-center flex-1 min-w-0">
            <div
              className={cn(
                "w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-mono shrink-0 transition-colors",
                state === "done" && "bg-primary text-primary-foreground border-primary",
                state === "current" && "bg-primary/15 text-primary border-primary",
                state === "todo" && "bg-background text-muted-foreground/60 border-border",
              )}
            >
              {state === "done" ? <Check className="w-3 h-3" /> : s}
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-px mx-1.5 transition-colors",
                  s < current ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </div>
        );
      })}
      {/* Screen-reader label */}
      <span className="sr-only">Step {current} of 4: {titles[current]}</span>
    </div>
  );
};

/* -------------------- Wizard steps -------------------- */
const Step1 = ({
  label,
  setLabel,
  tier,
  setTier,
  tierEntries,
}: {
  label: string;
  setLabel: (s: string) => void;
  tier: ApiTier;
  setTier: (t: ApiTier) => void;
  tierEntries: TierEligibility[];
}) => (
  <div className="space-y-4">
    <div className="space-y-1.5">
      <Label htmlFor="key-label" className="text-sm font-medium">
        Label
      </Label>
      <Input
        id="key-label"
        placeholder="e.g. Trading bot – prod"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        maxLength={64}
      />
    </div>
    <div className="space-y-2">
      <Label className="text-sm font-medium">Tier</Label>
      <div className="space-y-2">
        {tierEntries.map((t) => {
          const meta = TIER_META[t.tier];
          const Icon = meta.icon;
          const selected = tier === t.tier;
          const disabled = !t.eligible;
          return (
            <button
              key={t.tier}
              type="button"
              disabled={disabled}
              onClick={() => setTier(t.tier)}
              className={cn(
                "w-full text-left rounded-lg border p-3 transition-colors",
                selected && "border-primary bg-primary/[0.06]",
                !selected && !disabled && "border-border/40 hover:border-primary/50 hover:bg-muted/20",
                disabled && "border-border/40 opacity-50 cursor-not-allowed",
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "w-4 h-4 rounded-full border shrink-0 flex items-center justify-center",
                    selected ? "border-primary" : "border-border",
                  )}
                >
                  {selected && <span className="w-2 h-2 rounded-full bg-primary" />}
                </span>
                <Icon className={cn("w-3.5 h-3.5", meta.accent)} />
                <span className="text-sm font-medium flex-1">{meta.label}</span>
                {disabled && (
                  <span className="text-[10px] text-muted-foreground">Requirements not met</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1 pl-6">{t.description}</div>
              {disabled && (
                <div className="mt-2 pl-6 space-y-0.5">
                  {t.requirements
                    .filter((r) => !r.met)
                    .map((r, i) => (
                      <div key={i} className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <X className="w-3 h-3" /> {r.label}
                      </div>
                    ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

const Step2 = ({
  scopes,
  setScopes,
  availableScopes,
  requiresIp,
  ipRaw,
  setIpRaw,
  ipInvalid,
}: {
  scopes: ApiScope[];
  setScopes: (fn: (prev: ApiScope[]) => ApiScope[]) => void;
  availableScopes: typeof ALL_SCOPES;
  requiresIp: boolean;
  ipRaw: string;
  setIpRaw: (s: string) => void;
  ipInvalid: string[];
}) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label className="text-sm font-medium">Scopes</Label>
      <div className="rounded-lg border border-border/40 divide-y divide-border/40 overflow-hidden">
        {availableScopes.map((s) => {
          const checked = scopes.includes(s.id);
          return (
            <label
              key={s.id}
              className="flex items-start gap-3 p-2.5 cursor-pointer hover:bg-muted/30 transition-colors"
            >
              <Checkbox
                checked={checked}
                onCheckedChange={(v) => {
                  setScopes((prev) => (v ? [...prev, s.id] : prev.filter((x) => x !== s.id)));
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono">{s.label}</code>
                  {s.requiresIp && (
                    <Badge variant="outline" className="text-[9px] py-0 h-4 bg-amber-400/10 text-amber-400 border-amber-400/20">
                      IP required
                    </Badge>
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{s.description}</div>
              </div>
            </label>
          );
        })}
      </div>
    </div>

    <div className="space-y-1.5">
      <Label htmlFor="ip-wl" className="text-sm font-medium">
        IP whitelist{" "}
        {requiresIp && <span className="text-amber-400 font-normal">(required for trade / private scopes)</span>}
      </Label>
      <Textarea
        id="ip-wl"
        value={ipRaw}
        onChange={(e) => setIpRaw(e.target.value)}
        placeholder="203.0.113.10, 198.51.100.0/24"
        rows={3}
        className="font-mono text-sm"
      />
      <div className="text-[11px] text-muted-foreground">Comma or newline separated. IPv4 / IPv6 / CIDR.</div>
      {ipInvalid.length > 0 && (
        <div className="text-[11px] text-destructive flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> Invalid: {ipInvalid.join(", ")}
        </div>
      )}
    </div>
  </div>
);

const Step3 = ({
  otp,
  setOtp,
  otpError,
}: {
  otp: string;
  setOtp: (v: string) => void;
  otpError: string | null;
}) => (
  <div className="space-y-3">
    <div className="rounded-lg border border-border/40 bg-muted/30 p-3 flex items-start gap-2">
      <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
      <div className="text-xs text-muted-foreground">
        Enter the 6-digit code from your authenticator app to finalize key creation.
        <span className="block text-[10px] text-muted-foreground/70 mt-1">{DEMO_OTP_HINT}</span>
      </div>
    </div>
    <div className="space-y-1.5">
      <Label htmlFor="otp-input" className="text-sm font-medium">
        2FA code
      </Label>
      <Input
        id="otp-input"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        placeholder="123456"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
        className="font-mono tracking-[0.4em] text-center text-lg"
      />
      {otpError && (
        <div className="text-[11px] text-destructive flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> {otpError}
        </div>
      )}
    </div>
  </div>
);

const Step4Secret = ({
  secret,
  copied,
  onCopy,
}: {
  secret: string;
  copied: boolean;
  onCopy: () => void;
}) => (
  <div className="space-y-3">
    <div className="rounded-lg border border-amber-400/40 bg-amber-400/[0.06] p-3 flex items-start gap-2">
      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
      <div className="text-xs text-amber-100/90 leading-relaxed">
        <div className="font-medium text-amber-300 mb-0.5">Save this secret now.</div>
        It will never be shown again. If you lose it, you'll need to revoke the key and create a new one.
      </div>
    </div>
    <div className="rounded-lg border-2 border-primary/40 bg-gradient-to-br from-primary/[0.06] to-transparent p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Your API secret</div>
      <code className="block font-mono text-sm md:text-base text-foreground break-all leading-relaxed select-all">
        {secret}
      </code>
      <Button
        size="sm"
        variant={copied ? "outline" : "default"}
        className="w-full mt-3 gap-1.5 h-10"
        onClick={onCopy}
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copied ? "Copied to clipboard" : "Copy secret"}
      </Button>
    </div>
    <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
      <ShieldCheck className="w-3 h-3" /> Send this secret in the{" "}
      <code className="font-mono">X-OMENX-API-KEY</code> header.
    </div>
  </div>
);

/* -------------------- Revoke dialog -------------------- */
const RevokeDialog = ({
  target,
  onClose,
  onConfirm,
  pending,
}: {
  target: ApiKey | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
  pending: boolean;
}) => {
  return (
    <Dialog open={!!target} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Revoke API key</DialogTitle>
          <DialogDescription>
            {target && (
              <>
                Revoking <span className="font-medium text-foreground">{target.label}</span> immediately disables all
                requests using this key. This action cannot be undone.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button
            className="bg-trading-red text-white hover:bg-trading-red/90"
            disabled={pending}
            onClick={() => target && onConfirm(target.id)}
          >
            {pending ? "Revoking…" : "Revoke key"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiManagement;
