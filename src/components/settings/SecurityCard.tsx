import { useState } from "react";
import { Shield, Smartphone, Mail, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Setup2FADialog } from "./Setup2FADialog";
import { cn } from "@/lib/utils";

type Mode = "email" | "totp" | "both";

const MODE_OPTIONS: { value: Mode; label: string; description: string }[] = [
  {
    value: "email",
    label: "Email only",
    description: "Send a 6-digit code to your email",
  },
  {
    value: "totp",
    label: "Authenticator only",
    description: "Use codes from an authenticator app",
  },
  {
    value: "both",
    label: "Email + Authenticator",
    description: "Strongest — require both for every withdrawal",
  },
];

export const SecurityCard = () => {
  const {
    profile,
    email,
    updateWithdraw2faMode,
    enableTotp,
    disableTotp,
  } = useUserProfile();

  const mode: Mode = (profile?.withdraw_2fa_mode as Mode) || "email";
  const totpEnabled = !!profile?.totp_enabled;
  const hasEmail = !!email;

  const [setupOpen, setSetupOpen] = useState(false);
  const [pendingMode, setPendingMode] = useState<Mode | null>(null);

  const handleModeChange = async (next: Mode) => {
    if (next === mode) return;

    // If choosing a mode that requires TOTP and it's not set, open setup first.
    if ((next === "totp" || next === "both") && !totpEnabled) {
      setPendingMode(next);
      setSetupOpen(true);
      return;
    }

    const res = await updateWithdraw2faMode(next);
    if (res.success) {
      toast.success("Withdrawal verification updated");
    } else {
      toast.error(res.error || "Failed to update");
    }
  };

  const handleSetupSuccess = async (secret: string) => {
    await enableTotp(secret);
    if (pendingMode) {
      const res = await updateWithdraw2faMode(pendingMode);
      if (!res.success) {
        toast.error(res.error || "Saved authenticator, failed to update mode");
      }
      setPendingMode(null);
    }
  };

  const handleDisableTotp = async () => {
    const willResetMode = mode === "totp" || mode === "both";
    const confirmText = willResetMode
      ? "Disable authenticator? Withdrawal verification will switch to Email only."
      : "Disable authenticator?";
    if (!window.confirm(confirmText)) return;

    const res = await disableTotp();
    if (!res.success) {
      toast.error(res.error || "Failed to disable");
      return;
    }
    if (willResetMode) {
      await updateWithdraw2faMode("email");
    }
    toast.success("Authenticator disabled");
  };

  return (
    <>
      <div className="trading-card p-4 md:p-6 space-y-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Security</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Verification required when you submit a withdrawal
            </p>
          </div>
        </div>

        {/* Withdrawal verification mode */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Withdrawal verification</Label>
          </div>
          <RadioGroup value={mode} onValueChange={(v) => handleModeChange(v as Mode)}>
            <div className="space-y-2">
              {MODE_OPTIONS.map((opt) => {
                const needsEmail =
                  (opt.value === "email" || opt.value === "both") && !hasEmail;
                return (
                  <label
                    key={opt.value}
                    htmlFor={`mode-${opt.value}`}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border bg-muted/30 p-3 cursor-pointer transition-colors",
                      mode === opt.value
                        ? "border-primary/50 bg-primary/5"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <RadioGroupItem
                      id={`mode-${opt.value}`}
                      value={opt.value}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{opt.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {opt.description}
                      </div>
                      {needsEmail && mode !== opt.value && (
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-trading-yellow">
                          <AlertTriangle className="w-3 h-3" />
                          Add an email to your profile to use this option
                        </div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </RadioGroup>
        </div>

        {/* Email status row */}
        <div className="rounded-lg border bg-muted/30 p-3">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Email</span>
                {hasEmail ? (
                  <Badge
                    variant="outline"
                    className="text-xs border-trading-green/40 text-trading-green"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    Not set
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5 truncate">
                {email || "Add an email from your profile above"}
              </div>
            </div>
          </div>
        </div>

        {/* Authenticator row */}
        <div className="rounded-lg border bg-muted/30 p-3">
          <div className="flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Authenticator app</span>
                {totpEnabled ? (
                  <Badge
                    variant="outline"
                    className="text-xs border-trading-green/40 text-trading-green"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Enabled
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    Not set
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {totpEnabled
                  ? "TOTP codes from your authenticator app"
                  : "Connect Google Authenticator, Authy, or similar"}
              </div>
            </div>
            {totpEnabled ? (
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={handleDisableTotp}
              >
                Disable
              </Button>
            ) : (
              <Button size="sm" className="h-8" onClick={() => setSetupOpen(true)}>
                Set up
              </Button>
            )}
          </div>
        </div>
      </div>

      <Setup2FADialog
        open={setupOpen}
        onOpenChange={(o) => {
          setSetupOpen(o);
          if (!o) setPendingMode(null);
        }}
        onSuccess={handleSetupSuccess}
      />
    </>
  );
};
