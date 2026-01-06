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
  ArrowLeft,
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

  // Demo login - simulates auth and proceeds to next step
  const handleDemoLogin = async (method: "wallet" | "google" | "telegram") => {
    setIsLoading(true);
    try {
      // Check if user is already logged in
      const { data: { session: existingSession } } = await supabase.auth.getSession();
      
      if (existingSession?.user) {
        // Already logged in, just show success
        toast.success(`Welcome back! Connected via ${method}`);
        onSuccess?.();
        return;
      }

      // Sign in anonymously - this creates a persistent session
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) {
        throw error;
      }

      if (data.user) {
        // Create profile for new anonymous user
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            user_id: data.user.id,
            username: `Trader_${Math.random().toString(36).substring(2, 8)}`,
            trial_balance: 10000,
          });

        if (profileError && !profileError.message.includes("duplicate")) {
          console.error("Profile creation error:", profileError);
        }

        toast.success(`Connected via ${method}! Let's set up your wallet.`);
        // Proceed to next step instead of completing immediately
        setStep("createWallet");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message || "Failed to sign in");
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
  const containerClass = isMobile ? "space-y-5" : "space-y-6";

  // Login Step
  if (step === "login") {
    return (
      <div className={containerClass}>
        {/* Headlines - Clear hierarchy: lg title, sm subtitle */}
        <div className="text-center space-y-1">
          <h2 className="text-lg font-semibold text-foreground">
            Predict the Future, Profit from Certainty
          </h2>
          <p className="text-sm text-muted-foreground">
            Trade crypto, politics, sports & more like futures
          </p>
        </div>

        {/* Trial Funds Banner - Compact */}
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Gift className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground text-sm">Get 10,000 USDT Trial Funds</p>
            <p className="text-xs text-muted-foreground">Demo Trading · No Deposit · Start Now</p>
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
              className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
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
        <div className="space-y-3">
          {authMethod === "google" && (
            <>
              <p className="text-sm text-muted-foreground">Quick sign-in with Google</p>
              <Button
                onClick={() => handleDemoLogin("google")}
                disabled={isLoading}
                className="w-full h-12 bg-card hover:bg-card-hover border border-border text-foreground text-sm"
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
            </>
          )}

          {authMethod === "wallet" && (
            <>
              <p className="text-sm text-muted-foreground">Connect your Web3 wallet</p>
              <Button
                onClick={() => handleDemoLogin("wallet")}
                disabled={isLoading}
                className="w-full h-12 bg-card hover:bg-card-hover border border-border text-foreground text-sm"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Wallet className="w-5 h-5 mr-2" />
                )}
                Connect Wallet
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Supports MetaMask, WalletConnect & more
              </p>
            </>
          )}

          {authMethod === "telegram" && (
            <>
              <p className="text-sm text-muted-foreground">Sign in with Telegram</p>
              <Button
                onClick={() => handleDemoLogin("telegram")}
                disabled={isLoading}
                className="w-full h-12 bg-card hover:bg-card-hover border border-border text-foreground text-sm"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#229ED9">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                )}
                Sign in with Telegram
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Fast & secure Telegram authentication
              </p>
            </>
          )}
        </div>

        {/* Divider with OR */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border/50" />
          <span className="text-xs text-muted-foreground">OR</span>
          <div className="flex-1 h-px bg-border/50" />
        </div>

        {/* Info text */}
        <div className="text-center space-y-2">
          <p className="text-sm text-foreground">
            New to OMENX? Authorization creates your account automatically
          </p>
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            <Gift className="w-3.5 h-3.5 text-primary" />
            10,000 USDT Trial Funds · No Deposit Required · Start Trading Now
          </p>
        </div>

        {/* Terms */}
        <p className="text-xs text-muted-foreground text-center">
          By continuing, you agree to our{" "}
          <span className="text-primary hover:underline cursor-pointer">Terms of Service</span>
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
        {/* Back Button */}
        <button
          onClick={() => setStep("login")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="text-center space-y-1">
          <h2 className="text-lg font-semibold text-foreground">Create Simulation Wallet</h2>
          <p className="text-sm text-muted-foreground">Get 10,000 USDT trial funds and start trading</p>
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
        {/* Back Button */}
        <button
          onClick={() => setStep("createWallet")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Success Banner */}
        <div className="bg-trading-green/10 border border-trading-green/30 rounded-xl p-3 flex items-center gap-2">
          <Check className="w-4 h-4 text-trading-green" />
          <span className="text-trading-green font-medium text-sm">
            Ready to trade with 10,000 USDT!
          </span>
        </div>

        <div className="text-center space-y-1">
          <p className="text-xs text-muted-foreground">Final Step</p>
          <h2 className="text-lg font-semibold text-foreground">Complete Your Profile</h2>
          <p className="text-sm text-muted-foreground">Optional — Unlock exclusive features</p>
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
