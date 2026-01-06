import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, User, LogOut, Copy, Check, AlertTriangle, Plus, Wallet } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { BottomNav } from "@/components/BottomNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useBalance } from "@/hooks/useBalance";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const Settings = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user, balance } = useBalance();
  const [copiedUserId, setCopiedUserId] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState(false);
  
  // Dialog states
  const [usernameDialogOpen, setUsernameDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Mock wallet data (in real app, this would come from a wallet connection)
  const connectedWallets = [
    {
      address: "0x1234...5678",
      fullAddress: "0x1234567890abcdef1234567890abcdef12345678",
      network: "Ethereum Mainnet",
      isPrimary: true,
      connectedAt: "2025-11-12",
      icon: "🦊"
    }
  ];

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/");
    }
  };

  const handleCopyUserId = () => {
    const userId = user?.id?.slice(0, 6) || "123456";
    navigator.clipboard.writeText(userId);
    setCopiedUserId(true);
    toast.success("User ID copied");
    setTimeout(() => setCopiedUserId(false), 2000);
  };

  const handleCopyWallet = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedWallet(true);
    toast.success("Wallet address copied");
    setTimeout(() => setCopiedWallet(false), 2000);
  };

  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) {
      toast.error("Username cannot be empty");
      return;
    }
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ username: newUsername.trim() })
        .eq("user_id", user?.id);
      
      if (error) throw error;
      toast.success("Username updated successfully");
      setUsernameDialogOpen(false);
      setNewUsername("");
    } catch (error) {
      toast.error("Failed to update username");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddEmail = async () => {
    if (!newEmail.trim()) {
      toast.error("Email cannot be empty");
      return;
    }
    // In real app, this would trigger email verification flow
    toast.info("Email verification flow would be triggered here");
    setEmailDialogOpen(false);
    setNewEmail("");
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).replace(/\//g, "-");
  };

  const username = user?.user_metadata?.username || user?.user_metadata?.full_name;
  const email = user?.email;
  const userId = user?.id?.slice(0, 6) || "123456";
  const joinDate = formatDate(user?.created_at);

  // Profile Card
  const ProfileCard = () => (
    <div className="trading-card p-4 md:p-6">
      <div className="flex items-start gap-4">
        <Avatar className="w-16 h-16 md:w-20 md:h-20 border-2 border-primary/50">
          <AvatarImage src={user?.user_metadata?.avatar_url} alt="User" />
          <AvatarFallback className="bg-primary/20 text-primary text-xl">
            {email?.charAt(0).toUpperCase() || <User className="w-8 h-8" />}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg font-semibold">
              {username ? `Username: ${username}` : "Username: Not Set"}
            </span>
            {!username && (
              <Button
                size="sm"
                onClick={() => setUsernameDialogOpen(true)}
                className="btn-primary h-7 px-3 text-xs"
              >
                Set Now
              </Button>
            )}
          </div>
          
          {/* Mobile layout */}
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
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Account Type</span>
                <Badge variant="outline" className="border-primary/50 text-primary">
                  Wallet
                </Badge>
              </div>
            </div>
          ) : (
            /* Desktop layout */
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <p>User ID: #{userId}</p>
              <p>Joined {joinDate}</p>
              <Badge variant="outline" className="border-primary/50 text-primary mt-2">
                Wallet
              </Badge>
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
            Status: {username ? username : "Not Set"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Used for display and @mentions
          </p>
        </div>
        <Button
          onClick={() => setUsernameDialogOpen(true)}
          className="btn-primary h-9 px-4"
        >
          Set Now
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
            Status: {email || "Not Set"}
          </p>
        </div>
        {!email && (
          <Button
            onClick={() => setEmailDialogOpen(true)}
            variant="outline"
            className="h-9 px-4 border-trading-yellow text-trading-yellow hover:bg-trading-yellow/10"
          >
            Add Email
          </Button>
        )}
      </div>
      
      {/* Recommendation box */}
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

  // Connected Wallets Card
  const WalletsCard = () => (
    <div className="trading-card p-4 md:p-6">
      <h3 className="font-semibold mb-4">Connected Wallets</h3>
      
      <div className="space-y-4">
        {connectedWallets.map((wallet, index) => (
          <div key={index} className="bg-muted/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{wallet.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium">{wallet.address}</span>
                    <button
                      onClick={() => handleCopyWallet(wallet.fullAddress)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copiedWallet ? (
                        <Check className="w-4 h-4 text-trading-green" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">{wallet.network}</span>
                    {wallet.isPrimary && (
                      <Badge variant="outline" className="border-primary/50 text-primary text-xs h-5">
                        Primary Wallet
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Connected: {wallet.connectedAt}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-border hover:bg-trading-red/10 hover:text-trading-red hover:border-trading-red/50"
              >
                Disconnect
              </Button>
            </div>
          </div>
        ))}

        {/* Connect Other Wallet */}
        <button className="w-full border-2 border-dashed border-border/50 hover:border-primary/50 rounded-xl p-4 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-all">
          <Plus className="w-4 h-4" />
          <span>Connect Other Wallet</span>
        </button>
        
        <p className="text-center text-xs text-muted-foreground">
          You can connect multiple wallets for different purposes
        </p>
      </div>
    </div>
  );

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/30">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">Settings</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <ProfileCard />
          <UsernameCard />
          <EmailCard />
          <WalletsCard />
        </div>

        <BottomNav />
        
        {/* Username Dialog */}
        <Sheet open={usernameDialogOpen} onOpenChange={setUsernameDialogOpen}>
          <SheetContent side="bottom" className="rounded-t-3xl px-5 pt-4 pb-8">
            <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4" />
            <SheetHeader className="text-left mb-4">
              <SheetTitle>Set Username</SheetTitle>
            </SheetHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter your username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="h-12"
              />
              <Button
                onClick={handleUpdateUsername}
                disabled={isUpdating}
                className="w-full btn-primary h-12"
              >
                {isUpdating ? "Updating..." : "Save Username"}
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Email Dialog */}
        <Sheet open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
          <SheetContent side="bottom" className="rounded-t-3xl px-5 pt-4 pb-8">
            <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4" />
            <SheetHeader className="text-left mb-4">
              <SheetTitle>Add Email Address</SheetTitle>
            </SheetHeader>
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="h-12"
              />
              <Button
                onClick={handleAddEmail}
                className="w-full btn-primary h-12"
              >
                Add Email
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // Desktop Layout - Full width centered, matching platform style
  return (
    <div className="min-h-screen bg-background">
      <EventsDesktopHeader />
      
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground">Manage your basic account information</p>
        </div>
        
        {/* Content - Single column, full width */}
        <div className="space-y-6">
          <ProfileCard />
          <UsernameCard />
          <EmailCard />
          <WalletsCard />
        </div>
      </div>

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
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUsernameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUsername} disabled={isUpdating} className="btn-primary">
              {isUpdating ? "Updating..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Email Address</DialogTitle>
            <DialogDescription>
              Add an email for security notifications and account recovery
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="h-12"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEmail} className="btn-primary">
              Add Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
