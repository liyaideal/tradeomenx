import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, User, Copy, Check, AlertTriangle, Plus, Camera, Pencil } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { BottomNav } from "@/components/BottomNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useProfile, AVATAR_SEEDS, AVATAR_BACKGROUNDS, generateAvatarUrl } from "@/hooks/useProfile";
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
import { ScrollArea } from "@/components/ui/scroll-area";

const Settings = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { profile, user, updateUsername, updateAvatar, updateEmail, refetchProfile } = useProfile();
  const [copiedWallet, setCopiedWallet] = useState(false);
  
  // Dialog states
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [usernameDialogOpen, setUsernameDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  
  // Form states
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Mock wallet data (in real app, this would come from a wallet connection)
  const [connectedWallets, setConnectedWallets] = useState([
    {
      address: "0x1234...5678",
      fullAddress: "0x1234567890abcdef1234567890abcdef12345678",
      network: "Ethereum Mainnet",
      isPrimary: true,
      connectedAt: "2025-11-12",
      icon: "🦊"
    }
  ]);

  const handleCopyWallet = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedWallet(true);
    toast.success("Wallet address copied");
    setTimeout(() => setCopiedWallet(false), 2000);
  };

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

  const handleAddEmail = async () => {
    if (!newEmail.trim()) {
      toast.error("Email cannot be empty");
      return;
    }
    setIsUpdating(true);
    
    const result = await updateEmail(newEmail.trim());
    if (result.success) {
      toast.success("Email updated successfully");
      setEmailDialogOpen(false);
      setNewEmail("");
    } else {
      toast.error(result.error || "Failed to update email");
    }
    setIsUpdating(false);
  };

  const handleConnectWallet = () => {
    // Mock wallet connection - in real app this would use Web3 wallet
    toast.info("Wallet connection coming soon");
    setWalletDialogOpen(false);
  };

  const handleDisconnectWallet = (address: string) => {
    setConnectedWallets(wallets => wallets.filter(w => w.fullAddress !== address));
    toast.success("Wallet disconnected");
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).replace(/\//g, "-");
  };

  // Profile data from database or auth
  const username = profile?.username || user?.user_metadata?.username || user?.user_metadata?.full_name;
  const email = profile?.email || user?.email;
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const userId = user?.id?.slice(0, 6) || "123456";
  const joinDate = formatDate(profile?.created_at || user?.created_at);

  // Generate avatar grid
  const avatarOptions = AVATAR_SEEDS.flatMap((seed, seedIndex) => 
    AVATAR_BACKGROUNDS.map((bg, bgIndex) => ({
      seed,
      bgIndex,
      url: generateAvatarUrl(seed, bgIndex),
      key: `${seed}-${bgIndex}`
    }))
  ).slice(0, 30); // Limit to 30 avatars for performance

  // Avatar Picker Component
  const AvatarPicker = ({ isSheet = false }: { isSheet?: boolean }) => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Choose an avatar from our collection
      </p>
      <ScrollArea className={isSheet ? "h-[300px]" : "h-[320px]"}>
        <div className="grid grid-cols-5 gap-3 pr-4">
          {avatarOptions.map((avatar) => (
            <button
              key={avatar.key}
              onClick={() => setSelectedAvatar(avatar.url)}
              className={`relative rounded-xl p-1 transition-all ${
                selectedAvatar === avatar.url
                  ? "ring-2 ring-primary bg-primary/20 scale-105"
                  : "hover:bg-muted/50 hover:scale-105"
              }`}
            >
              <Avatar className="w-full aspect-square">
                <AvatarImage src={avatar.url} alt={avatar.seed} />
                <AvatarFallback className="bg-muted">
                  <User className="w-6 h-6 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              {selectedAvatar === avatar.url && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  // Profile Card
  const ProfileCard = () => (
    <div className="trading-card p-4 md:p-6">
      <div className="flex items-start gap-4">
        {/* Avatar with edit button */}
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
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg font-semibold">
              {username ? username : "Username Not Set"}
            </span>
            <Button
              size="sm"
              onClick={() => {
                setNewUsername(username || "");
                setUsernameDialogOpen(true);
              }}
              className="btn-primary h-7 px-3 text-xs"
            >
              {username ? "Edit" : "Set Now"}
            </Button>
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
            Status: {username || "Not Set"}
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
            Status: {email || "Not Set"}
          </p>
        </div>
        <Button
          onClick={() => {
            setNewEmail(email || "");
            setEmailDialogOpen(true);
          }}
          variant={email ? "outline" : "outline"}
          className={email 
            ? "h-9 px-4" 
            : "h-9 px-4 border-trading-yellow text-trading-yellow hover:bg-trading-yellow/10"
          }
        >
          {email ? "Edit" : "Add Email"}
        </Button>
      </div>
      
      {/* Recommendation box - only show if no email */}
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
            <div className="flex items-center justify-between flex-wrap gap-3">
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
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
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
                onClick={() => handleDisconnectWallet(wallet.fullAddress)}
                className="border-border hover:bg-trading-red/10 hover:text-trading-red hover:border-trading-red/50"
              >
                Disconnect
              </Button>
            </div>
          </div>
        ))}

        {connectedWallets.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <p>No wallets connected yet</p>
          </div>
        )}

        {/* Connect Other Wallet */}
        <button 
          onClick={() => setWalletDialogOpen(true)}
          className="w-full border-2 border-dashed border-border/50 hover:border-primary/50 rounded-xl p-4 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-all"
        >
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
            <div className="w-10" />
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
        
        {/* Avatar Picker Sheet */}
        <Sheet open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
          <SheetContent side="bottom" className="rounded-t-3xl px-5 pt-4 pb-8 h-[85vh]">
            <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4" />
            <SheetHeader className="text-left mb-4">
              <SheetTitle>Choose Avatar</SheetTitle>
            </SheetHeader>
            <AvatarPicker isSheet />
            <div className="mt-4 pt-4 border-t border-border">
              <Button
                onClick={handleSelectAvatar}
                disabled={!selectedAvatar || isUpdating}
                className="w-full btn-primary h-12"
              >
                {isUpdating ? "Saving..." : "Save Avatar"}
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Username Sheet */}
        <Sheet open={usernameDialogOpen} onOpenChange={setUsernameDialogOpen}>
          <SheetContent side="bottom" className="rounded-t-3xl px-5 pt-4 pb-8">
            <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4" />
            <SheetHeader className="text-left mb-4">
              <SheetTitle>Set Username</SheetTitle>
            </SheetHeader>
            <div className="space-y-4">
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
                disabled={isUpdating}
                className="w-full btn-primary h-12"
              >
                {isUpdating ? "Saving..." : "Save Username"}
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Email Sheet */}
        <Sheet open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
          <SheetContent side="bottom" className="rounded-t-3xl px-5 pt-4 pb-8">
            <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4" />
            <SheetHeader className="text-left mb-4">
              <SheetTitle>{email ? "Edit Email Address" : "Add Email Address"}</SheetTitle>
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
                disabled={isUpdating}
                className="w-full btn-primary h-12"
              >
                {isUpdating ? "Saving..." : (email ? "Update Email" : "Add Email")}
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Wallet Connection Sheet */}
        <Sheet open={walletDialogOpen} onOpenChange={setWalletDialogOpen}>
          <SheetContent side="bottom" className="rounded-t-3xl px-5 pt-4 pb-8">
            <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4" />
            <SheetHeader className="text-left mb-4">
              <SheetTitle>Connect Wallet</SheetTitle>
            </SheetHeader>
            <div className="space-y-3">
              <button
                onClick={handleConnectWallet}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <span className="text-3xl">🦊</span>
                <div className="text-left">
                  <p className="font-medium">MetaMask</p>
                  <p className="text-sm text-muted-foreground">Connect to your MetaMask wallet</p>
                </div>
              </button>
              <button
                onClick={handleConnectWallet}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <span className="text-3xl">🌈</span>
                <div className="text-left">
                  <p className="font-medium">Rainbow</p>
                  <p className="text-sm text-muted-foreground">Connect to your Rainbow wallet</p>
                </div>
              </button>
              <button
                onClick={handleConnectWallet}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <span className="text-3xl">💎</span>
                <div className="text-left">
                  <p className="font-medium">WalletConnect</p>
                  <p className="text-sm text-muted-foreground">Scan with WalletConnect</p>
                </div>
              </button>
            </div>
          </SheetContent>
        </Sheet>
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
          <WalletsCard />
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
          <AvatarPicker />
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
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{email ? "Edit Email Address" : "Add Email Address"}</DialogTitle>
            <DialogDescription>
              {email ? "Update your email for notifications" : "Add an email for security notifications and account recovery"}
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
            <Button onClick={handleAddEmail} disabled={isUpdating} className="btn-primary">
              {isUpdating ? "Saving..." : (email ? "Update" : "Add Email")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Wallet Connection Dialog */}
      <Dialog open={walletDialogOpen} onOpenChange={setWalletDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
            <DialogDescription>
              Choose a wallet to connect
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <button
              onClick={handleConnectWallet}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <span className="text-3xl">🦊</span>
              <div className="text-left">
                <p className="font-medium">MetaMask</p>
                <p className="text-sm text-muted-foreground">Connect to your MetaMask wallet</p>
              </div>
            </button>
            <button
              onClick={handleConnectWallet}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <span className="text-3xl">🌈</span>
              <div className="text-left">
                <p className="font-medium">Rainbow</p>
                <p className="text-sm text-muted-foreground">Connect to your Rainbow wallet</p>
              </div>
            </button>
            <button
              onClick={handleConnectWallet}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <span className="text-3xl">💎</span>
              <div className="text-left">
                <p className="font-medium">WalletConnect</p>
                <p className="text-sm text-muted-foreground">Scan with WalletConnect</p>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
