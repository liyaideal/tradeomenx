import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Key,
  Plus,
  Check,
  X,
  Copy,
  AlertTriangle,
  Mail,
  ChevronRight,
  ShieldCheck,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { BottomNav } from "@/components/BottomNav";
import { MobileHeader } from "@/components/MobileHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { LoginPrompt } from "@/components/LoginPrompt";
import { toast } from "sonner";
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

const TIER_ORDER: ApiTier[] = ["read_only", "trading", "pro_mm"];
const TIER_BADGE: Record<ApiTier, { label: string; className: string }> = {
  read_only: { label: "Read-only", className: "bg-muted text-muted-foreground border-border" },
  trading: { label: "Trading", className: "bg-primary/10 text-primary border-primary/20" },
  pro_mm: { label: "Pro / MM", className: "bg-amber-400/10 text-amber-400 border-amber-400/20" },
};

const isValidIp = (raw: string) => {
  const s = raw.trim();
  if (!s) return false;
  // Basic IPv4 or IPv4/CIDR
  return /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/.test(s) || /^[0-9a-fA-F:]+(\/\d{1,3})?$/.test(s);
};

const ApiManagement = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { keys, isLoading, createKey, revokeKey } = useApiKeys();
  const { tiers } = useTierEligibility();

  const [createOpen, setCreateOpen] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<ApiKey | null>(null);
  const [newSecret, setNewSecret] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        {!isMobile && <EventsDesktopHeader />}
        {isMobile && <MobileHeader title="API Management" showLogo={false} />}
        <div className="max-w-3xl mx-auto p-6">
          <LoginPrompt />
        </div>
        {isMobile && <BottomNav />}
      </div>
    );
  }

  const content = (
    <div className="space-y-6">
      {/* Intro */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Key className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">API Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage API keys for programmatic access to OmenX Open API v1.
          </p>
        </div>
      </div>

      {/* Tier cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {tiers.map((t) => (
          <TierCard key={t.tier} tier={t} />
        ))}
      </div>

      {/* Keys section */}
      <div className="trading-card p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-base">Your API keys</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {keys.length} key{keys.length === 1 ? "" : "s"} · secrets are shown once at creation
            </p>
          </div>
          <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5">
            <Plus className="w-4 h-4" /> Create key
          </Button>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">Loading…</div>
        ) : keys.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted/40 mx-auto flex items-center justify-center mb-3">
              <Key className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="text-sm font-medium">No API keys yet</div>
            <div className="text-xs text-muted-foreground mt-1 mb-4">
              Create your first key to start using OmenX Open API.
            </div>
            <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5">
              <Plus className="w-4 h-4" /> Create key
            </Button>
          </div>
        ) : (
          <KeysTable keys={keys} onRevoke={setRevokeTarget} />
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {isMobile ? (
        <>
          <MobileHeader title="API Management" showLogo={false} />
          <div className="p-4 pb-24">{content}</div>
          <BottomNav />
        </>
      ) : (
        <>
          <EventsDesktopHeader />
          <main className="max-w-5xl mx-auto w-full px-6 py-8">
            <button
              onClick={() => navigate("/settings")}
              className="text-xs text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1"
            >
              ← Back to Settings
            </button>
            {content}
          </main>
        </>
      )}

      <CreateKeyDialog
        open={createOpen}
        onOpenChange={(o) => {
          setCreateOpen(o);
          if (!o) setNewSecret(null);
        }}
        onCreated={(secret) => setNewSecret(secret)}
        newSecret={newSecret}
        tiers={tiers}
        createKey={createKey}
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

/* -------------------- Tier card -------------------- */
const TierCard = ({ tier }: { tier: TierEligibility }) => {
  const statusBadge = tier.manualReview ? (
    <Badge variant="outline" className="bg-amber-400/10 text-amber-400 border-amber-400/20">
      Manual approval
    </Badge>
  ) : tier.eligible ? (
    <Badge variant="outline" className="bg-emerald-400/10 text-emerald-400 border-emerald-400/20">
      Available
    </Badge>
  ) : (
    <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
      Requirements not met
    </Badge>
  );

  return (
    <div className="trading-card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-semibold">{tier.label}</div>
          <div className="text-xs text-muted-foreground mt-0.5 leading-snug">{tier.description}</div>
        </div>
        {statusBadge}
      </div>
      <ul className="space-y-1.5">
        {tier.requirements.map((r, i) => (
          <li key={i} className="flex items-start gap-2 text-xs">
            {r.met ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
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
        <a
          href="mailto:api@omenx.io?subject=Pro%2FMM%20API%20access%20request"
          className="mt-1"
        >
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
    <div className="space-y-2">
      {/* Header (desktop) */}
      <div className="hidden md:grid grid-cols-[1.2fr_1.6fr_0.8fr_1.8fr_0.6fr_0.9fr_0.9fr_0.7fr_0.6fr] gap-3 px-3 text-[10px] uppercase tracking-wider text-muted-foreground/70">
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
      {keys.map((k) => {
        const active = k.status === "active";
        return (
          <div
            key={k.id}
            className="rounded-lg border border-border/40 bg-muted/20 md:grid md:grid-cols-[1.2fr_1.6fr_0.8fr_1.8fr_0.6fr_0.9fr_0.9fr_0.7fr_0.6fr] gap-3 items-center p-3 text-xs"
          >
            <div className="font-medium text-sm md:text-xs mb-1 md:mb-0">{k.label}</div>
            <div className="font-mono text-[11px] text-muted-foreground truncate">{k.key_prefix}</div>
            <div className="mb-1 md:mb-0">
              <Badge variant="outline" className={TIER_BADGE[k.tier].className}>
                {TIER_BADGE[k.tier].label}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1 mb-1 md:mb-0">
              {k.scopes.slice(0, 4).map((s) => (
                <span key={s} className="px-1.5 py-0.5 rounded bg-background/60 border border-border/40 font-mono text-[10px]">
                  {s}
                </span>
              ))}
              {k.scopes.length > 4 && (
                <span className="px-1.5 py-0.5 rounded bg-background/60 border border-border/40 font-mono text-[10px] text-muted-foreground">
                  +{k.scopes.length - 4}
                </span>
              )}
            </div>
            <div className="text-muted-foreground">
              {k.ip_whitelist.length > 0 ? `${k.ip_whitelist.length} IP${k.ip_whitelist.length > 1 ? "s" : ""}` : "—"}
            </div>
            <div className="text-muted-foreground">
              {formatDistanceToNow(new Date(k.created_at), { addSuffix: true })}
            </div>
            <div className="text-muted-foreground">
              {k.last_used_at ? formatDistanceToNow(new Date(k.last_used_at), { addSuffix: true }) : "Never"}
            </div>
            <div>
              {active ? (
                <Badge variant="outline" className="bg-emerald-400/10 text-emerald-400 border-emerald-400/20">
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
                  Revoked
                </Badge>
              )}
            </div>
            <div className="md:text-right mt-2 md:mt-0">
              {active && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-destructive hover:text-destructive hover:bg-destructive/10"
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
  );
};

/* -------------------- Create wizard -------------------- */
const CreateKeyDialog = ({
  open,
  onOpenChange,
  onCreated,
  newSecret,
  tiers,
  createKey,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onCreated: (secret: string) => void;
  newSecret: string | null;
  tiers: TierEligibility[];
  createKey: ReturnType<typeof useApiKeys>["createKey"];
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
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
    [ipRaw]
  );
  const ipInvalid = ipList.filter((ip) => !isValidIp(ip));
  const requiresIp = scopes.some((s) => ALL_SCOPES.find((x) => x.id === s)?.requiresIp);
  const availableScopes = ALL_SCOPES.filter((s) => {
    if (tier === "read_only") return !s.requiresIp && s.id.startsWith("read") ? true : !s.requiresIp;
    return true;
  });

  const tierEntries = tiers.filter((t) => t.tier !== "pro_mm"); // pro is manual review

  const canNext1 = label.trim().length >= 2 && (tiers.find((t) => t.tier === tier)?.eligible ?? false);
  const canNext2 =
    scopes.length > 0 &&
    (!requiresIp || (ipList.length > 0 && ipInvalid.length === 0));
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {step === 4 ? "API key created" : `Create API key — Step ${step} of 3`}
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Choose a label and tier for this key."}
            {step === 2 && "Select scopes and configure IP whitelist."}
            {step === 3 && "Verify with your 2FA code to generate the key."}
            {step === 4 && "Copy the secret now — it will not be shown again."}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="key-label" className="text-sm">Label</Label>
              <Input
                id="key-label"
                placeholder="e.g. Trading bot – prod"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                maxLength={64}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Tier</Label>
              <div className="space-y-2">
                {tierEntries.map((t) => {
                  const selected = tier === t.tier;
                  const disabled = !t.eligible;
                  return (
                    <button
                      key={t.tier}
                      type="button"
                      disabled={disabled}
                      onClick={() => setTier(t.tier)}
                      className={`w-full text-left rounded-lg border p-3 transition ${
                        selected
                          ? "border-primary bg-primary/5"
                          : disabled
                          ? "border-border/40 opacity-50 cursor-not-allowed"
                          : "border-border/40 hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{t.label}</div>
                        {disabled ? (
                          <span className="text-[10px] text-muted-foreground">Requirements not met</span>
                        ) : selected ? (
                          <Check className="w-4 h-4 text-primary" />
                        ) : null}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{t.description}</div>
                      {disabled && (
                        <div className="mt-2 space-y-0.5">
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
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm">Scopes</Label>
              <div className="rounded-lg border border-border/40 divide-y divide-border/40">
                {availableScopes.map((s) => {
                  const checked = scopes.includes(s.id);
                  return (
                    <label
                      key={s.id}
                      className="flex items-start gap-3 p-2.5 cursor-pointer hover:bg-muted/20"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(v) => {
                          setScopes((prev) =>
                            v ? [...prev, s.id] : prev.filter((x) => x !== s.id)
                          );
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
              <Label htmlFor="ip-wl" className="text-sm">
                IP whitelist {requiresIp && <span className="text-amber-400">(required for trade / private scopes)</span>}
              </Label>
              <textarea
                id="ip-wl"
                value={ipRaw}
                onChange={(e) => setIpRaw(e.target.value)}
                placeholder="203.0.113.10, 198.51.100.0/24"
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <div className="text-[11px] text-muted-foreground">
                Comma or newline separated. IPv4 / IPv6 / CIDR.
              </div>
              {ipInvalid.length > 0 && (
                <div className="text-[11px] text-destructive flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Invalid: {ipInvalid.join(", ")}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <div className="rounded-lg border border-border/40 bg-muted/30 p-3 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div className="text-xs text-muted-foreground">
                Enter the 6-digit code from your authenticator app to finalize key creation.
                <span className="block text-[10px] text-muted-foreground/70 mt-1">{DEMO_OTP_HINT}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="otp-input" className="text-sm">2FA code</Label>
              <Input
                id="otp-input"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                  setOtpError(null);
                }}
                className="font-mono tracking-[0.4em] text-center text-lg"
              />
              {otpError && (
                <div className="text-[11px] text-destructive flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {otpError}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 4 && newSecret && (
          <div className="space-y-3">
            <div className="rounded-lg border border-amber-400/30 bg-amber-400/5 p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div className="text-xs text-amber-100/90">
                This is the only time your full secret will be shown. Copy it and store it securely.
              </div>
            </div>
            <div className="rounded-lg border border-border/40 bg-muted/30 p-3 flex items-center gap-2">
              <code className="flex-1 font-mono text-xs break-all">{newSecret}</code>
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1"
                onClick={() => {
                  navigator.clipboard.writeText(newSecret);
                  setCopied(true);
                  toast.success("Secret copied");
                }}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3" /> Send this secret in the <code className="font-mono">X-OMENX-API-KEY</code> header.
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          {step === 1 && (
            <>
              <Button variant="outline" onClick={() => handleClose(false)}>Cancel</Button>
              <Button disabled={!canNext1} onClick={() => setStep(2)}>Next</Button>
            </>
          )}
          {step === 2 && (
            <>
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button disabled={!canNext2} onClick={() => setStep(3)}>Next</Button>
            </>
          )}
          {step === 3 && (
            <>
              <Button variant="outline" onClick={() => setStep(2)} disabled={createKey.isPending}>Back</Button>
              <Button disabled={!canSubmit3 || createKey.isPending} onClick={handleVerifyAndCreate}>
                {createKey.isPending ? "Creating…" : "Verify & create"}
              </Button>
            </>
          )}
          {step === 4 && (
            <Button className="w-full" onClick={() => handleClose(false)}>Done</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

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
                Revoking <span className="font-medium text-foreground">{target.label}</span> immediately
                disables all requests using this key. This action cannot be undone.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={pending}>Cancel</Button>
          <Button
            variant="destructive"
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
