import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Gift, 
  Wallet, 
  TrendingUp, 
  BarChart3, 
  ShieldCheck,
  Save,
  ArrowRight,
  Check,
  Loader2
} from "lucide-react";
import type { AuthStep } from "@/hooks/useAuth";

interface AuthContentProps {
  step: AuthStep;
  setStep: (step: AuthStep) => void;
  onSuccess?: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  variant?: "desktop" | "mobile";
}

export const AuthContent = ({ 
  step, 
  setStep, 
  onSuccess, 
  isLoading, 
  setIsLoading,
  variant = "desktop" 
}: AuthContentProps) => {
  const [authMethod, setAuthMethod] = useState<"wallet" | "google" | "telegram">("google");
  const [username, setUsername] = useState("");

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/events`,
        }
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error("Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWallet = () => {
    setStep("completeProfile");
  };

  const handleCompleteProfile = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && username) {
        const { error } = await supabase
          .from("profiles")
          .update({ username })
          .eq("user_id", user.id);

        if (error) {
          console.error("Profile update error:", error);
        }
      }
      
      toast.success("Profile saved! Start trading now.");
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    onSuccess?.();
  };

  const isMobile = variant === "mobile";
  const containerClass = isMobile ? "space-y-4" : "space-y-6";
  const headingClass = isMobile ? "text-xl font-bold" : "text-2xl font-bold";
  const subheadingClass = "text-muted-foreground text-sm";

  // Login Step
  if (step === "login") {
    return (
      <div className={containerClass}>
        {/* Headlines */}
        <div className="text-center">
          <h2 className={headingClass}>Predict the Future, Profit from Certainty</h2>
          <p className={`${subheadingClass} mt-1`}>Trade crypto, politics, sports & more like futures</p>
        </div>

        {/* Trial Funds Banner */}
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Gift className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Get 10,000 USDT Trial Funds</p>
              <p className="text-xs text-muted-foreground">Demo Trading · No Deposit · Start Now</p>
            </div>
          </div>
        </div>

        {/* Auth Method Tabs */}
        <div className="flex bg-muted/50 rounded-xl p-1">
          {[
            { id: "wallet" as const, label: "Wallet" },
            { id: "google" as const, label: "Google" },
            { id: "telegram" as const, label: "Telegram" },
          ].map((method) => (
            <button
              key={method.id}
              onClick={() => setAuthMethod(method.id)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                authMethod === method.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {method.label}
            </button>
          ))}
        </div>

        {/* Auth Content */}
        {authMethod === "google" && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">Quick sign-in with Google</p>
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full h-11 bg-card hover:bg-card-hover border border-border text-foreground"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              Sign in with Google
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Instant access · No wallet needed · Start trading in seconds
            </p>
          </div>
        )}

        {authMethod === "wallet" && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">Connect your Web3 wallet</p>
            <Button
              disabled
              className="w-full h-11 bg-card hover:bg-card-hover border border-border text-muted-foreground"
            >
              <Wallet className="w-5 h-5 mr-2" />
              Connect Wallet (Coming Soon)
            </Button>
          </div>
        )}

        {authMethod === "telegram" && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">Sign in with Telegram</p>
            <Button
              disabled
              className="w-full h-11 bg-card hover:bg-card-hover border border-border text-muted-foreground"
            >
              Telegram (Coming Soon)
            </Button>
          </div>
        )}

        {/* Info text */}
        <div className="pt-4 border-t border-border/50 text-center space-y-2">
          <p className="text-sm text-foreground">
            New to OMENX? Authorization creates your account automatically
          </p>
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Gift className="w-3.5 h-3.5 text-primary" />
            10,000 USDT Trial Funds · No Deposit Required · Start Trading Now
          </p>
        </div>

        {/* Terms */}
        <p className="text-xs text-muted-foreground text-center">
          By continuing, you agree to our{" "}
          <span className="text-primary hover:underline cursor-pointer">Terms</span>
          {" "}and{" "}
          <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
        </p>
      </div>
    );
  }

  // Create Wallet Step
  if (step === "createWallet") {
    return (
      <div className={containerClass}>
        <div className="text-center">
          <h2 className={headingClass}>Create Simulation Wallet</h2>
          <p className={`${subheadingClass} mt-1`}>Get 10,000 USDT trial funds and start trading</p>
        </div>

        {/* Welcome Bonus Card */}
        <div className="bg-trading-green/10 border border-trading-green/30 rounded-xl p-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-trading-green/20 flex items-center justify-center flex-shrink-0">
              <Gift className="w-4 h-4 text-trading-green" />
            </div>
            <div>
              <p className="font-semibold text-trading-green text-sm">Welcome Bonus: 10,000 USDT</p>
              <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                <li className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-trading-green" />
                  Virtual funds for practice trading
                </li>
                <li className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-trading-green" />
                  No deposit required
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Wallet, title: "Zero Risk", color: "text-[hsl(190,70%,60%)]", bg: "bg-[hsl(190,70%,60%)]/10" },
            { icon: TrendingUp, title: "Full Trading", color: "text-primary", bg: "bg-primary/10" },
            { icon: BarChart3, title: "Live Data", color: "text-trading-yellow", bg: "bg-trading-yellow/10" },
          ].map((feature, i) => (
            <div key={i} className="bg-card border border-border/50 rounded-lg p-2 text-center">
              <div className={`w-8 h-8 rounded-lg ${feature.bg} mx-auto mb-1 flex items-center justify-center`}>
                <feature.icon className={`w-4 h-4 ${feature.color}`} />
              </div>
              <p className="font-medium text-xs text-foreground">{feature.title}</p>
            </div>
          ))}
        </div>

        {/* Security */}
        <div className="bg-muted/30 border border-border/50 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-foreground">Security Verified</span>
          </div>
          <div className="h-9 bg-muted/50 rounded-lg flex items-center justify-center">
            <Check className="w-4 h-4 text-trading-green mr-1.5" />
            <span className="text-xs text-trading-green">Verified</span>
          </div>
        </div>

        {/* Create Button */}
        <Button
          onClick={handleCreateWallet}
          className="w-full h-11 btn-trading-green"
        >
          Create Wallet & Claim 10,000 USDT
        </Button>
      </div>
    );
  }

  // Complete Profile Step
  if (step === "completeProfile") {
    return (
      <div className={containerClass}>
        {/* Success Banner */}
        <div className="bg-trading-green/10 border border-trading-green/30 rounded-xl p-3 flex items-center gap-2">
          <Check className="w-4 h-4 text-trading-green" />
          <span className="text-trading-green font-medium text-sm">
            Ready to trade with 10,000 USDT!
          </span>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">Final Step</p>
          <h2 className={headingClass}>Complete Your Profile</h2>
          <p className={`${subheadingClass} mt-1`}>Optional — Unlock exclusive features</p>
        </div>

        {/* Username Input */}
        <div>
          <Label htmlFor="username" className="text-sm text-muted-foreground">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 h-10 bg-muted/50 border-border/50"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleSkip}
            variant="outline"
            className="flex-1 h-10"
          >
            Skip for Now
          </Button>
          <Button
            onClick={handleCompleteProfile}
            disabled={isLoading}
            className="flex-1 h-10 btn-primary"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <>
                <Save className="w-4 h-4 mr-1.5" />
                Save Profile
              </>
            )}
          </Button>
        </div>

        {/* Start Trading Link */}
        <button
          onClick={handleSkip}
          className="w-full flex items-center justify-center gap-1.5 text-sm text-primary hover:underline"
        >
          Start Trading Now
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return null;
};
