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
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff
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
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // Simulated email/password login
  const handleEmailLogin = async () => {
    if (!loginEmail.trim()) {
      toast.error("Please enter your email");
      return;
    }
    if (!loginPassword.trim()) {
      toast.error("Please enter your password");
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Check if user is already logged in
      const { data: { session: existingSession } } = await supabase.auth.getSession();
      
      if (existingSession?.user) {
        toast.success("Welcome back!");
        onSuccess?.();
        return;
      }

      // Sign in anonymously behind the scenes
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) {
        throw error;
      }

      if (data.user) {
        // Create profile with the entered email
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            user_id: data.user.id,
            username: loginEmail.split("@")[0],
            email: loginEmail.trim(),
            trial_balance: 10000,
          });

        if (profileError && !profileError.message.includes("duplicate")) {
          console.error("Profile creation error:", profileError);
        }

        toast.success("Login successful!");
        setStep("createWallet");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Simulated email/password signup
  const handleEmailSignup = async () => {
    if (!loginEmail.trim()) {
      toast.error("Please enter your email");
      return;
    }
    if (!loginPassword.trim()) {
      toast.error("Please enter your password");
      return;
    }
    if (loginPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sign in anonymously behind the scenes
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) {
        throw error;
      }

      if (data.user) {
        // Create profile with the entered email
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            user_id: data.user.id,
            username: loginEmail.split("@")[0],
            email: loginEmail.trim(),
            trial_balance: 10000,
          });

        if (profileError && !profileError.message.includes("duplicate")) {
          console.error("Profile creation error:", profileError);
        }

        toast.success("Account created successfully!");
        setStep("createWallet");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message || "Signup failed");
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
      
      if (user) {
        const updates: { username?: string; email?: string } = {};
        if (username.trim()) updates.username = username.trim();
        if (email.trim()) updates.email = email.trim();

        if (Object.keys(updates).length > 0) {
          const { error } = await supabase
            .from("profiles")
            .update(updates)
            .eq("user_id", user.id);

          if (error) {
            console.error("Profile update error:", error);
          }
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
        {/* Headlines */}
        <div className="text-center space-y-1">
          <h2 className="text-lg font-semibold text-foreground">
            Predict the Future, Profit from Certainty
          </h2>
          <p className="text-sm text-muted-foreground">
            Trade crypto, politics, sports & more like futures
          </p>
        </div>

        {/* Trial Funds Banner */}
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Gift className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground text-sm">Get 10,000 USDT Trial Funds</p>
            <p className="text-xs text-muted-foreground">Demo Trading · No Deposit · Start Now</p>
          </div>
        </div>

        {/* Login/Signup Tabs */}
        <div className="flex bg-muted/50 rounded-xl p-1">
          <button
            onClick={() => setAuthMode("login")}
            className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
              authMode === "login"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthMode("signup")}
            className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
              authMode === "signup"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Email/Password Form */}
        <div className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <Label htmlFor="login-email" className="text-sm font-medium text-foreground">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="login-email"
                type="email"
                placeholder="your.email@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="h-11 pl-10 bg-muted/50 border-border/50"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <Label htmlFor="login-password" className="text-sm font-medium text-foreground">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder={authMode === "signup" ? "Create a password (min 6 chars)" : "Enter your password"}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="h-11 pl-10 pr-10 bg-muted/50 border-border/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={authMode === "login" ? handleEmailLogin : handleEmailSignup}
            disabled={isLoading}
            className="w-full h-11 btn-primary"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Mail className="w-4 h-4 mr-2" />
            )}
            {authMode === "login" ? "Sign In" : "Create Account"}
          </Button>

          {authMode === "login" && (
            <button className="w-full text-sm text-primary hover:underline">
              Forgot password?
            </button>
          )}
        </div>

        {/* Info text */}
        <div className="text-center space-y-2">
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
            Ready to trade with 10,000 USDT trial funds
          </span>
        </div>

        <div className="text-center space-y-1">
          <p className="text-xs text-muted-foreground">Final Step</p>
          <h2 className="text-lg font-semibold text-foreground">Complete Your Profile</h2>
          <p className="text-sm text-muted-foreground">Optional — Unlock exclusive features</p>
        </div>

        {/* Username Input */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Label htmlFor="username" className="text-sm font-medium text-foreground">Username</Label>
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Optional</span>
          </div>
          <Input
            id="username"
            type="text"
            placeholder="Enter your display name"
            value={username}
            maxLength={20}
            onChange={(e) => setUsername(e.target.value)}
            className="h-11 bg-muted/50 border-border/50"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>This will be your public display name</span>
            <span>{username.length}/20 characters</span>
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</Label>
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Optional</span>
          </div>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 bg-muted/50 border-border/50"
          />
          <p className="text-xs text-muted-foreground">
            For important notifications and account recovery
          </p>
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
