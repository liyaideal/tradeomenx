import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Copy, 
  Check, 
  Star,
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useWallets } from "@/hooks/useWallets";
import { useIsMobile } from "@/hooks/use-mobile";
import { BottomNav } from "@/components/BottomNav";
import { MobileHeader } from "@/components/MobileHeader";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { TopUpDialog } from "@/components/TopUpDialog";
import { toast } from "sonner";
import {
  MobileDrawer,
  MobileDrawerList,
  MobileDrawerListItem,
  MobileDrawerStatus,
} from "@/components/ui/mobile-drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function Wallet() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { balance } = useUserProfile();
  const { 
    wallets, 
    isLoading: walletsLoading, 
    addWallet, 
    removeWallet, 
    setPrimaryWallet 
  } = useWallets();
  
  // Dialog states
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false);
  const [walletToDisconnect, setWalletToDisconnect] = useState<{ id: string; address: string } | null>(null);
  const [copiedWalletId, setCopiedWalletId] = useState<string | null>(null);
  
  // Wallet connection states
  const [walletStep, setWalletStep] = useState<"select" | "connecting" | "success">("select");
  const [selectedWalletType, setSelectedWalletType] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleCopyWallet = (walletId: string, address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedWalletId(walletId);
    toast.success("Wallet address copied");
    setTimeout(() => setCopiedWalletId(null), 2000);
  };

  const handleConnectWallet = async (walletType: string, icon: string) => {
    setSelectedWalletType(walletType);
    setWalletStep("connecting");
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate random wallet address
    const randomHex = () => Math.floor(Math.random() * 16).toString(16);
    const randomAddress = '0x' + Array(40).fill(0).map(() => randomHex()).join('');
    const shortAddress = randomAddress.slice(0, 6) + '...' + randomAddress.slice(-4);
    
    const result = await addWallet({
      address: shortAddress,
      fullAddress: randomAddress,
      network: "Ethereum Mainnet",
      walletType,
      icon
    });
    
    if (result.success) {
      setWalletStep("success");
    } else {
      toast.error(result.error || "Failed to connect wallet");
      setWalletStep("select");
    }
  };

  const handleWalletDialogClose = (open: boolean) => {
    setWalletDialogOpen(open);
    if (!open) {
      setTimeout(() => {
        setWalletStep("select");
        setSelectedWalletType(null);
      }, 200);
    }
  };

  const handleDisconnectWallet = (wallet: { id: string; address: string }) => {
    setWalletToDisconnect(wallet);
    setDisconnectDialogOpen(true);
  };

  const handleConfirmDisconnect = async () => {
    if (walletToDisconnect) {
      const result = await removeWallet(walletToDisconnect.id);
      if (result.success) {
        toast.success("Wallet disconnected");
      } else {
        toast.error(result.error || "Failed to disconnect wallet");
      }
    }
    setDisconnectDialogOpen(false);
    setWalletToDisconnect(null);
  };

  const handleSetPrimaryWallet = async (walletId: string) => {
    const result = await setPrimaryWallet(walletId);
    if (result.success) {
      toast.success("Primary wallet updated");
    } else {
      toast.error(result.error || "Failed to update primary wallet");
    }
  };

  // Balance Card Component
  const BalanceCard = () => (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30 p-6">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-trading-green/10 rounded-full blur-2xl" />
      
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <WalletIcon className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm text-muted-foreground">Available Balance</span>
        </div>
        
        <div className="text-4xl font-bold font-mono mb-1">
          ${formatCurrency(balance)}
        </div>
        <div className="text-sm text-muted-foreground mb-6">USDC</div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            className="flex-1 bg-trading-green hover:bg-trading-green/90 text-background font-semibold rounded-xl h-12"
            onClick={() => setTopUpOpen(true)}
          >
            <ArrowDownLeft className="w-4 h-4 mr-2" />
            Deposit
          </Button>
          <Button 
            variant="outline"
            className="flex-1 border-border/50 hover:bg-muted/50 rounded-xl h-12"
            onClick={() => toast.info("Withdraw feature coming soon")}
          >
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Withdraw
          </Button>
        </div>
      </div>
    </div>
  );

  // Wallet List Component
  const WalletList = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Connected Wallets</h2>
        <span className="text-sm text-muted-foreground">
          {wallets.length} wallet{wallets.length !== 1 ? 's' : ''}
        </span>
      </div>

      {walletsLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Loading wallets...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {wallets.map((wallet) => (
            <div 
              key={wallet.id} 
              className="bg-card border border-border/50 rounded-xl p-4 hover:border-border transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center text-2xl">
                  {wallet.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{wallet.walletType}</span>
                    {wallet.isPrimary && (
                      <Badge variant="outline" className="border-primary/50 text-primary text-xs">
                        Primary
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono text-muted-foreground">{wallet.address}</code>
                    <button
                      onClick={() => handleCopyWallet(wallet.id, wallet.fullAddress)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copiedWalletId === wallet.id ? (
                        <Check className="w-3.5 h-3.5 text-trading-green" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{wallet.network}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">Connected {wallet.connectedAt}</span>
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="mt-3 pt-3 border-t border-border/30 flex justify-end gap-2">
                {!wallet.isPrimary && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetPrimaryWallet(wallet.id)}
                    className="text-primary hover:text-primary hover:bg-primary/10"
                  >
                    <Star className="w-3.5 h-3.5 mr-1" />
                    Set Primary
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDisconnectWallet({ id: wallet.id, address: wallet.address })}
                  className="text-muted-foreground hover:text-trading-red hover:bg-trading-red/10"
                >
                  Disconnect
                </Button>
              </div>
            </div>
          ))}

          {/* Connect New Wallet Button */}
          <button 
            onClick={() => setWalletDialogOpen(true)}
            className="w-full border-2 border-dashed border-border/50 hover:border-primary/50 rounded-xl p-4 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Connect New Wallet</span>
          </button>

          {wallets.length === 0 && !walletsLoading && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                Connect a wallet to deposit and withdraw funds
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Wallet Connection Dialog Content
  const WalletConnectionContent = () => {
    if (walletStep === "select") {
      if (isMobile) {
        return (
          <MobileDrawerList>
            <MobileDrawerListItem
              icon="🦊"
              label="MetaMask"
              description="Connect to your MetaMask wallet"
              onClick={() => handleConnectWallet("MetaMask", "🦊")}
            />
            <MobileDrawerListItem
              icon="🌈"
              label="Rainbow"
              description="Connect to your Rainbow wallet"
              onClick={() => handleConnectWallet("Rainbow", "🌈")}
            />
            <MobileDrawerListItem
              icon="💎"
              label="WalletConnect"
              description="Scan with WalletConnect"
              onClick={() => handleConnectWallet("WalletConnect", "💎")}
            />
          </MobileDrawerList>
        );
      }
      return (
        <div className="py-4 space-y-3">
          {[
            { type: "MetaMask", icon: "🦊", desc: "Connect to your MetaMask wallet" },
            { type: "Rainbow", icon: "🌈", desc: "Connect to your Rainbow wallet" },
            { type: "WalletConnect", icon: "💎", desc: "Scan with WalletConnect" },
          ].map((wallet) => (
            <button
              key={wallet.type}
              onClick={() => handleConnectWallet(wallet.type, wallet.icon)}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <span className="text-3xl">{wallet.icon}</span>
              <div className="text-left">
                <p className="font-medium">{wallet.type}</p>
                <p className="text-sm text-muted-foreground">{wallet.desc}</p>
              </div>
            </button>
          ))}
        </div>
      );
    }

    if (walletStep === "connecting") {
      if (isMobile) {
        return (
          <MobileDrawerStatus
            icon={
              <span className="text-3xl animate-pulse">
                {selectedWalletType === "MetaMask" ? "🦊" : selectedWalletType === "Rainbow" ? "🌈" : "💎"}
              </span>
            }
            title={`Connecting to ${selectedWalletType}...`}
            description="Please confirm in your wallet"
          />
        );
      }
      return (
        <div className="py-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <span className="text-3xl">
              {selectedWalletType === "MetaMask" ? "🦊" : selectedWalletType === "Rainbow" ? "🌈" : "💎"}
            </span>
          </div>
          <p className="text-muted-foreground">Connecting to {selectedWalletType}...</p>
          <p className="text-sm text-muted-foreground mt-2">Please confirm in your wallet</p>
        </div>
      );
    }

    if (walletStep === "success") {
      if (isMobile) {
        return (
          <>
            <MobileDrawerStatus
              icon={<Check className="w-8 h-8 text-trading-green" />}
              title="Wallet Connected!"
              description={`Your ${selectedWalletType} wallet has been linked`}
              variant="success"
            />
            <Button
              onClick={() => handleWalletDialogClose(false)}
              className="w-full btn-primary h-12"
            >
              Done
            </Button>
          </>
        );
      }
      return (
        <div className="py-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-trading-green/20 flex items-center justify-center">
            <Check className="w-8 h-8 text-trading-green" />
          </div>
          <p className="font-medium text-trading-green">Wallet Connected!</p>
          <p className="text-sm text-muted-foreground mt-2">Your {selectedWalletType} wallet has been linked</p>
          <Button
            onClick={() => handleWalletDialogClose(false)}
            className="mt-6 btn-primary"
          >
            Done
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      {/* Header */}
      {isMobile ? (
        <MobileHeader title="Wallet" showLogo={false} />
      ) : (
        <EventsDesktopHeader />
      )}

      <div className={`px-4 py-6 space-y-6 ${!isMobile ? "max-w-2xl mx-auto" : ""}`}>
        <BalanceCard />
        <WalletList />
      </div>

      {/* Bottom Navigation - Mobile only */}
      {isMobile && <BottomNav />}

      {/* Top Up Dialog */}
      <TopUpDialog 
        open={topUpOpen} 
        onOpenChange={setTopUpOpen} 
        currentBalance={balance}
        onTopUp={(amount, method) => {
          toast.success(`Deposited $${amount} via ${method}`);
        }}
      />

      {/* Wallet Connection - Mobile Drawer */}
      {isMobile && (
        <MobileDrawer
          open={walletDialogOpen}
          onOpenChange={handleWalletDialogClose}
          title={
            walletStep === "select" ? "Connect Wallet" :
            walletStep === "connecting" ? "Connecting..." :
            "Connected!"
          }
        >
          <WalletConnectionContent />
        </MobileDrawer>
      )}

      {/* Wallet Connection - Desktop Dialog */}
      {!isMobile && (
        <Dialog open={walletDialogOpen} onOpenChange={handleWalletDialogClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {walletStep === "select" && "Connect Wallet"}
                {walletStep === "connecting" && "Connecting..."}
                {walletStep === "success" && "Connected!"}
              </DialogTitle>
              {walletStep === "select" && (
                <DialogDescription>Choose a wallet to connect</DialogDescription>
              )}
            </DialogHeader>
            <WalletConnectionContent />
          </DialogContent>
        </Dialog>
      )}

      {/* Disconnect Confirmation - Mobile */}
      {isMobile && (
        <MobileDrawer
          open={disconnectDialogOpen}
          onOpenChange={setDisconnectDialogOpen}
          showHandle={true}
        >
          <MobileDrawerStatus
            icon={<AlertTriangle className="w-8 h-8 text-trading-red" />}
            title="Disconnect Wallet?"
            description="Are you sure you want to disconnect this wallet? You can reconnect it anytime."
            variant="error"
          />
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setDisconnectDialogOpen(false)}
              className="flex-1 h-12"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDisconnect}
              className="flex-1 h-12 bg-trading-red hover:bg-trading-red/90 text-white"
            >
              Disconnect
            </Button>
          </div>
        </MobileDrawer>
      )}

      {/* Disconnect Confirmation - Desktop */}
      {!isMobile && (
        <Dialog open={disconnectDialogOpen} onOpenChange={setDisconnectDialogOpen}>
          <DialogContent>
            <div className="py-4 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-trading-red/20 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-trading-red" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Disconnect Wallet?</h3>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to disconnect this wallet?<br />
                You can reconnect it anytime.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setDisconnectDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDisconnect}
                className="flex-1 bg-trading-red hover:bg-trading-red/90 text-white"
              >
                Disconnect
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}