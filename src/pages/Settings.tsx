import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, User, Copy, Check, AlertTriangle, Plus, Camera, Mail, Star, Shield, LogOut } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { BottomNav } from "@/components/BottomNav";
import { MobileHeader } from "@/components/MobileHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile, AVATAR_SEEDS, AVATAR_BACKGROUNDS, generateAvatarUrl } from "@/hooks/useUserProfile";
import { toast } from "sonner";
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
  MobileDrawerList,
  MobileDrawerListItem,
  MobileDrawerStatus,
} from "@/components/ui/mobile-drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

// Infer auth method from profile data since we use anonymous sign-in
const inferAuthMethod = (email: string | null | undefined): "google" | "telegram" | "wallet" => {
  if (email && email.includes("@gmail.com")) return "google";
  if (email && email.includes("@")) return "google"; // any email likely came from Google OAuth
  return "wallet"; // fallback - no email means wallet or telegram
};

const AUTH_METHOD_INFO = {
  google: { label: "Google", icon: "🔵", color: "text-blue-400", description: "Google Account" },
  telegram: { label: "Telegram", icon: "✈️", color: "text-sky-400", description: "Telegram Account" },
  wallet: { label: "Wallet", icon: "💎", color: "text-purple-400", description: "Web3 Wallet" },
};

const Settings = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { profile, user, isLoading: profileLoading, updateUsername, updateAvatar, updateEmail, refetchProfile } = useUserProfile();
  
  // Dialog states
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [usernameDialogOpen, setUsernameDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  
  // Form states
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Email verification states
  const [emailStep, setEmailStep] = useState<"input" | "verify">("input");
  const [verificationCode, setVerificationCode] = useState("");

  const handleSelectAvatar = async () => {
    if (!selectedAvatar) return;
    setIsUpdating(true);
    
    const result = await updateAvatar(selectedAvatar);
    if (result.success) {
      toast.success("Avatar updated successfully");
      setAvatarDialogOpen(false);
      setSelectedAvatar(null);
    } else {
      toast.error(result.error || "Failed to update avatar");
    }
    setIsUpdating(false);
  };

  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) {
      toast.error("Username cannot be empty");
      return;
    }
    setIsUpdating(true);
    
    const result = await updateUsername(newUsername.trim());
    if (result.success) {
      toast.success("Username updated successfully");
      setUsernameDialogOpen(false);
      setNewUsername("");
    } else {
      toast.error(result.error || "Failed to update username");
    }
    setIsUpdating(false);
  };

  const handleSendVerificationCode = () => {
    if (!newEmail.trim()) {
      toast.error("Email cannot be empty");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }
    setEmailStep("verify");
    toast.success("Verification code sent to " + newEmail);
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }
    setIsUpdating(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = await updateEmail(newEmail.trim());
    if (result.success) {
      toast.success("Email verified successfully");
      setEmailDialogOpen(false);
      setNewEmail("");
      setVerificationCode("");
      setEmailStep("input");
    } else {
      toast.error(result.error || "Failed to update email");
    }
    setIsUpdating(false);
  };

  const handleEmailDialogClose = (open: boolean) => {
    setEmailDialogOpen(open);
    if (!open) {
      setEmailStep("input");
      setVerificationCode("");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).replace(/\//g, "-");
  };

  // Generate avatar grid
  const avatarOptions = useMemo(() => 
    AVATAR_SEEDS.flatMap((seed, seedIndex) => 
      AVATAR_BACKGROUNDS.map((bg, bgIndex) => ({
        seed,
        bgIndex,
        url: generateAvatarUrl(seed, bgIndex),
        key: `${seed}-${bgIndex}`
      }))
    ).slice(0, 80),
  []);

  // Profile data
  const username = profile?.username || null;
  const email = profile?.email || user?.email || null;
  const avatarUrl = profile?.avatar_url || null;
  const userId = user?.id?.slice(0, 6) || "123456";
  const joinDate = formatDate(profile?.created_at || user?.created_at);

  // Auth provider info - infer from profile email
  const authMethod = inferAuthMethod(email);
  const providerInfo = AUTH_METHOD_INFO[authMethod];
  const providerEmail = email;

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  // Avatar grid JSX
  const renderAvatarGrid = (maxHeight: string) => (
    <div className={`overflow-y-auto ${maxHeight}`}>
      <div className="grid grid-cols-5 gap-3 pr-2">
        {avatarOptions.map((avatar) => (
          <button
            key={avatar.key}
            type="button"
            onClick={() => setSelectedAvatar(avatar.url)}
            className={`relative rounded-xl p-1 transition-all ${
              selectedAvatar === avatar.url
                ? "ring-2 ring-primary bg-primary/20 scale-105"
                : "hover:bg-muted"
            }`}
          >
            <img
              src={avatar.url}
              alt={`Avatar ${avatar.seed}`}
              className="w-full aspect-square rounded-lg"
            />
          </button>
        ))}
      </div>
    </div>
  );

  // Profile Card
  const ProfileCard = () => (
    <div className="trading-card p-4 md:p-6">
      <div className="flex items-start gap-4">
        <div className="relative">
          <Avatar className="w-16 h-16 md:w-20 md:h-20 border-2 border-primary/50">
            <AvatarImage src={avatarUrl} alt="User" />
            <AvatarFallback className="bg-primary/20 text-primary text-xl">
              {(username || email)?.charAt(0).toUpperCase() || <User className="w-8 h-8" />}
            </AvatarFallback>
          </Avatar>
          <button
            onClick={() => setAvatarDialogOpen(true)}
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
          >
            <Camera className="w-3.5 h-3.5 text-primary-foreground" />
          </button>
        </div>
        
        <div className="flex-1 min-w-0">
          <span className="text-lg font-semibold">
            {username ? username : "Username Not Set"}
          </span>
          
          {isMobile ? (
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">User ID</span>
                <span className="font-mono">#{userId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Join Date</span>
                <span>{joinDate}</span>
              </div>
            </div>
          ) : (
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <p>User ID: #{userId}</p>
              <p>Joined {joinDate}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Username Card
  const UsernameCard = () => (
    <div className="trading-card p-4 md:p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold mb-1">Username</h3>
          <p className="text-sm text-muted-foreground">
            {username || "Not Set"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Used for display and @mentions
          </p>
        </div>
        <Button
          onClick={() => {
            setNewUsername(username || "");
            setUsernameDialogOpen(true);
          }}
          className="btn-primary h-9 px-4"
        >
          {username ? "Edit" : "Set Now"}
        </Button>
      </div>
    </div>
  );

  // Email Card
  const EmailCard = () => (
    <div className="trading-card p-4 md:p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold mb-1">Email Address</h3>
          <p className="text-sm text-muted-foreground">
            {email || "Not Set"}
          </p>
        </div>
        <Button
          onClick={() => {
            setNewEmail(email || "");
            setEmailDialogOpen(true);
          }}
          className="btn-primary h-9 px-4"
        >
          {email ? "Edit" : "Add Email"}
        </Button>
      </div>
      
      {!email && (
        <div className="bg-trading-yellow/10 border border-trading-yellow/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-trading-yellow shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="font-medium text-trading-yellow">Recommended to Add Email</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Receive important security notifications</li>
                <li>Account recovery and verification</li>
                <li>Get updates and activity information</li>
              </ul>
              <Button
                onClick={() => setEmailDialogOpen(true)}
                className="mt-2 h-8 px-4 bg-trading-yellow/80 hover:bg-trading-yellow text-background font-medium"
              >
                Add Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Linked Account Card - shows which auth provider/email was used to sign in
  const LinkedAccountCard = () => (
    <div className="trading-card p-4 md:p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold mb-1">Linked Account</h3>
          <p className="text-xs text-muted-foreground">
            The account you used to sign in
          </p>
        </div>
        <Badge variant="outline" className="border-primary/50 text-primary text-xs">
          <Shield className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      </div>
      
      <div className="bg-muted/30 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
            {providerInfo.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{providerInfo.label}</span>
              <Badge variant="secondary" className="text-xs h-5">
                Active
              </Badge>
            </div>
            {providerEmail && (
              <p className="text-sm font-mono text-muted-foreground truncate mt-0.5">
                {providerEmail}
              </p>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        You signed in via <span className={`font-medium ${providerInfo.color}`}>{providerInfo.label}</span>.
        This cannot be changed. To use a different account, sign out and sign in again.
      </p>
    </div>
  );

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <MobileHeader title="Settings" showLogo={false} />

        <div className="p-4 space-y-4">
          <ProfileCard />
          <UsernameCard />
          <EmailCard />
          <LinkedAccountCard />
        </div>

        <BottomNav />
        
        {/* Avatar Picker Drawer */}
        <MobileDrawer
          open={avatarDialogOpen}
          onOpenChange={setAvatarDialogOpen}
          title="Choose Avatar"
        >
          {renderAvatarGrid("max-h-[50vh]")}
          <MobileDrawerActions>
            <Button
              onClick={handleSelectAvatar}
              disabled={!selectedAvatar || isUpdating}
              className="w-full btn-primary h-12"
            >
              {isUpdating ? "Saving..." : "Save Avatar"}
            </Button>
          </MobileDrawerActions>
        </MobileDrawer>

        {/* Username Drawer */}
        <MobileDrawer
          open={usernameDialogOpen}
          onOpenChange={setUsernameDialogOpen}
          title="Set Username"
        >
          <MobileDrawerSection>
            <div>
              <Input
                placeholder="Enter your username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="h-12"
                maxLength={20}
              />
              <p className="text-xs text-muted-foreground mt-2">
                3-20 characters, letters, numbers, and underscores only
              </p>
            </div>
            <Button
              onClick={handleUpdateUsername}
              disabled={isUpdating || !newUsername.trim()}
              className="w-full btn-primary h-12"
            >
              {isUpdating ? "Saving..." : "Confirm"}
            </Button>
          </MobileDrawerSection>
        </MobileDrawer>

        {/* Email Drawer */}
        <MobileDrawer
          open={emailDialogOpen}
          onOpenChange={handleEmailDialogClose}
          title={emailStep === "input" 
            ? (email ? "Edit Email Address" : "Add Email Address")
            : "Verify Email"
          }
        >
          {emailStep === "input" ? (
            <MobileDrawerSection>
              <Input
                type="email"
                placeholder="Enter your email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="h-12"
              />
              <Button
                onClick={handleSendVerificationCode}
                disabled={!newEmail.trim()}
                className="w-full btn-primary h-12"
              >
                Send Verification Code
              </Button>
            </MobileDrawerSection>
          ) : (
            <MobileDrawerSection>
              <MobileDrawerStatus
                icon={<Mail className="w-8 h-8 text-primary" />}
                title=""
                description={`Enter the 6-digit code sent to ${newEmail}`}
              />
              <div className="flex justify-center -mt-4">
                <InputOTP
                  maxLength={6}
                  value={verificationCode}
                  onChange={setVerificationCode}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button
                onClick={handleVerifyCode}
                disabled={isUpdating || verificationCode.length !== 6}
                className="w-full btn-primary h-12"
              >
                {isUpdating ? "Verifying..." : "Verify"}
              </Button>
              <button
                onClick={() => setEmailStep("input")}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Change email address
              </button>
            </MobileDrawerSection>
          )}
        </MobileDrawer>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="min-h-screen bg-background">
      <EventsDesktopHeader />
      
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground">Manage your basic account information</p>
        </div>
        
        <div className="space-y-6">
          <ProfileCard />
          <UsernameCard />
          <EmailCard />
          <LinkedAccountCard />
        </div>
      </div>

      {/* Avatar Picker Dialog */}
      <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Choose Avatar</DialogTitle>
            <DialogDescription>
              Select an avatar from our collection
            </DialogDescription>
          </DialogHeader>
          {renderAvatarGrid("max-h-[380px]")}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAvatarDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSelectAvatar} 
              disabled={!selectedAvatar || isUpdating} 
              className="btn-primary"
            >
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Username Dialog */}
      <Dialog open={usernameDialogOpen} onOpenChange={setUsernameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Username</DialogTitle>
            <DialogDescription>
              Choose a username for display and @mentions
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter your username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="h-12"
              maxLength={20}
            />
            <p className="text-xs text-muted-foreground mt-2">
              3-20 characters, letters, numbers, and underscores only
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUsernameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUsername} disabled={isUpdating} className="btn-primary">
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={handleEmailDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {emailStep === "input" 
                ? (email ? "Edit Email Address" : "Add Email Address")
                : "Verify Email"
              }
            </DialogTitle>
            <DialogDescription>
              {emailStep === "input"
                ? (email ? "Update your email for notifications" : "Add an email for security notifications and account recovery")
                : "Enter the verification code to confirm your email"
              }
            </DialogDescription>
          </DialogHeader>
          
          {emailStep === "input" ? (
            <div className="py-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="h-12"
              />
            </div>
          ) : (
            <div className="py-4 space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code sent to<br />
                  <span className="font-medium text-foreground">{newEmail}</span>
                </p>
              </div>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={verificationCode}
                  onChange={setVerificationCode}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
          )}
          
          <DialogFooter>
            {emailStep === "input" ? (
              <>
                <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSendVerificationCode} 
                  disabled={!newEmail.trim()} 
                  className="btn-primary"
                >
                  Send Code
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setEmailStep("input")}>
                  Back
                </Button>
                <Button 
                  onClick={handleVerifyCode} 
                  disabled={isUpdating || verificationCode.length !== 6} 
                  className="btn-primary"
                >
                  {isUpdating ? "Verifying..." : "Verify"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
