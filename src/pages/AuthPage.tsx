import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import { 
  Gift, 
  Wallet, 
  TrendingUp, 
  BarChart3, 
  ShieldCheck,
  Info,
  Save,
  ArrowRight,
  Check,
  Loader2
} from "lucide-react";

// Validation schemas
const emailSchema = z.string().trim().email({ message: "Please enter a valid email address" });
const passwordSchema = z.string().min(6, { message: "Password must be at least 6 characters" });

type AuthStep = "login" | "createWallet" | "completeProfile";

const AuthPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<AuthStep>("login");
  const [authMethod, setAuthMethod] = useState<"wallet" | "google" | "telegram">("google");
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // Check if user is already logged in
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate("/events");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/events");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }
    
    try {
      passwordSchema.parse(password);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0].message;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailSignUp = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/events`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username: username || null,
          }
        }
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("This email is already registered. Please sign in instead.");
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (data.user) {
        toast.success("Account created! Welcome to the platform.");
        setStep("createWallet");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password. Please try again.");
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (data.user) {
        toast.success("Welcome back!");
        navigate("/events");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

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
      navigate("/events");
    } catch (error) {
      toast.error("Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigate("/events");
  };

  // Login Step
  if (step === "login") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Card with gradient border */}
          <div className="web3-card p-6 sm:p-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Logo size="xl" />
            </div>

            {/* Headlines */}
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-2">
              Predict the Future, Profit from Certainty
            </h1>
            <p className="text-muted-foreground text-center mb-6">
              Trade crypto, politics, sports & more like futures
            </p>

            {/* Trial Funds Banner */}
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Gift className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Get 10,000 USDT Trial Funds</p>
                  <p className="text-sm text-muted-foreground">Demo Trading · No Deposit · Start Now</p>
                </div>
              </div>
            </div>

            {/* Auth Method Tabs */}
            <div className="flex bg-muted/50 rounded-xl p-1 mb-6">
              {[
                { id: "wallet" as const, label: "Wallet" },
                { id: "google" as const, label: "Google" },
                { id: "telegram" as const, label: "Telegram" },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setAuthMethod(method.id)}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
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
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Quick sign-in with Google</p>
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full h-12 bg-card hover:bg-card-hover border border-border text-foreground"
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
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Connect your Web3 wallet</p>
                <Button
                  disabled
                  className="w-full h-12 bg-card hover:bg-card-hover border border-border text-muted-foreground"
                >
                  <Wallet className="w-5 h-5 mr-2" />
                  Connect Wallet (Coming Soon)
                </Button>
              </div>
            )}

            {authMethod === "telegram" && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Sign in with Telegram</p>
                <Button
                  disabled
                  className="w-full h-12 bg-card hover:bg-card-hover border border-border text-muted-foreground"
                >
                  Telegram (Coming Soon)
                </Button>
              </div>
            )}

            {/* Info text */}
            <div className="mt-6 pt-6 border-t border-border/50 text-center">
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Gift className="w-4 h-4 text-primary" />
                10,000 USDT Trial Funds · No Deposit Required · Start Trading Now
              </p>
            </div>

            {/* Terms */}
            <p className="text-xs text-muted-foreground text-center mt-4">
              By continuing, you agree to our{" "}
              <span className="text-primary hover:underline cursor-pointer">Terms of Service</span>
              {" "}and{" "}
              <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Create Wallet Step
  if (step === "createWallet") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="web3-card p-6 sm:p-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Logo size="xl" />
            </div>

            {/* Headlines */}
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-2">
              Create Simulation Wallet
            </h1>
            <p className="text-muted-foreground text-center mb-6">
              Get 10,000 USDT trial funds and start trading
            </p>

            {/* Welcome Bonus Card */}
            <div className="bg-trading-green/10 border border-trading-green/30 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-trading-green/20 flex items-center justify-center flex-shrink-0">
                  <Gift className="w-5 h-5 text-trading-green" />
                </div>
                <div>
                  <p className="font-semibold text-trading-green">Welcome Bonus: 10,000 USDT Trial Funds</p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-trading-green" />
                      Virtual funds for practice trading only
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-trading-green" />
                      Learn strategies risk-free with real market data
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-trading-green" />
                      No deposit required · Cannot be withdrawn
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { 
                  icon: Wallet, 
                  title: "Independent Account", 
                  desc: "Fully isolated from your wallet, zero risk",
                  color: "text-[hsl(190,70%,60%)]",
                  bg: "bg-[hsl(190,70%,60%)]/10"
                },
                { 
                  icon: TrendingUp, 
                  title: "Full Trading Experience", 
                  desc: "Market, limit orders & leverage trading",
                  color: "text-primary",
                  bg: "bg-primary/10"
                },
                { 
                  icon: BarChart3, 
                  title: "Real-Time Market Data", 
                  desc: "Practice with live market prices",
                  color: "text-trading-yellow",
                  bg: "bg-trading-yellow/10"
                },
              ].map((feature, i) => (
                <div key={i} className="bg-card border border-border/50 rounded-xl p-3 text-center">
                  <div className={`w-10 h-10 rounded-lg ${feature.bg} mx-auto mb-2 flex items-center justify-center`}>
                    <feature.icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <p className="font-medium text-sm text-foreground">{feature.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Security Verification */}
            <div className="bg-muted/30 border border-border/50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Security Verification</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Complete verification to prevent abuse</p>
              <div className="h-12 bg-muted/50 rounded-lg flex items-center justify-center">
                <Check className="w-5 h-5 text-trading-green mr-2" />
                <span className="text-sm text-trading-green">Verified</span>
              </div>
            </div>

            {/* Create Button */}
            <Button
              onClick={handleCreateWallet}
              className="w-full h-12 btn-trading-green text-base"
            >
              Create Wallet & Claim 10,000 USDT
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-3">
              Instantly create your simulation wallet and receive trial funds
            </p>

            {/* Terms */}
            <p className="text-xs text-muted-foreground text-center mt-4">
              By creating a simulation wallet, you agree to our{" "}
              <span className="text-primary hover:underline cursor-pointer">Terms of Service</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Complete Profile Step
  if (step === "completeProfile") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Success Banner */}
          <div className="bg-trading-green/10 border border-trading-green/30 rounded-xl p-4 mb-4 flex items-center gap-3">
            <Check className="w-5 h-5 text-trading-green" />
            <span className="text-trading-green font-medium">
              Registration Complete! Ready to trade with 10,000 USDT trial funds
            </span>
          </div>

          <div className="web3-card p-6 sm:p-8">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <Logo size="xl" />
            </div>

            {/* Headlines */}
            <p className="text-sm text-muted-foreground text-center mb-1">Final Step</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-2">
              Complete Your Profile
            </h1>
            <p className="text-muted-foreground text-center mb-6">
              Optional — Unlock exclusive features and personalized insights
            </p>

            {/* Why Complete Card */}
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Info className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Why complete your profile?</p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Critical alerts and security notifications
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Priority access to new features and exclusive events
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Account recovery and enhanced security
                    </li>
                  </ul>
                  <p className="text-sm text-primary mt-3 font-medium">
                    Your information is strictly confidential and will never be shared
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Label htmlFor="username" className="text-sm text-foreground">Username</Label>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Optional</span>
                </div>
                <Input
                  id="username"
                  placeholder="Enter your display name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.slice(0, 20))}
                  className="h-11 bg-muted/50 border-border/50"
                  maxLength={20}
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-muted-foreground">This will be your public display name</p>
                  <p className="text-xs text-muted-foreground">{username.length}/20 characters</p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Label htmlFor="profile-email" className="text-sm text-foreground">Email Address</Label>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Optional</span>
                </div>
                <Input
                  id="profile-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  disabled
                  className="h-11 bg-muted/30 border-border/50 text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground mt-1">For important notifications and account recovery</p>
              </div>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleCompleteProfile}
              disabled={isLoading}
              className="w-full h-12 bg-muted/50 hover:bg-muted border border-border/50 text-foreground"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              Save and Continue
            </Button>

            {/* Skip */}
            <button
              onClick={handleSkip}
              className="w-full mt-4 text-primary hover:underline text-sm font-medium"
            >
              Skip and Start Trading
            </button>
            <p className="text-xs text-muted-foreground text-center mt-1">
              You can complete this anytime in Account Settings
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthPage;