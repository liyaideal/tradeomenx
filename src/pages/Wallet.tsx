import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Copy, 
  Check, 
  Star,
  AlertTriangle,
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
import { supabase } from "@/integrations/supabase/client";
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
import { 
  TransactionHistory, 
  PendingConfirmations,
  Transaction, 
  TransactionStatus 
} from "@/components/wallet";
import { DepositDialog } from "@/components/deposit/DepositDialog";
import { WithdrawDialog } from "@/components/withdraw/WithdrawDialog";

export default function Wallet() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { balance, user } = useUserProfile();
  const { 
    wallets, 
    isLoading: walletsLoading, 
    addWallet, 
    removeWallet, 
    setPrimaryWallet 
  } = useWallets();

  // Fetch recent trades for transaction history
  const { data: recentTrades = [] } = useQuery({
    queryKey: ["wallet-trades", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("trades")
        .select("id, event_name, option_label, pnl, created_at, closed_at, status")
        .eq("user_id", user.id)
        .eq("status", "Filled")
        .not("pnl", "is", null)
        .order("closed_at", { ascending: false });

      if (error) {
        console.error("Error fetching trades:", error);
        return [];
      }

      return data || [];
    },
    enabled: !!user,
  });

  // Fetch deposit/withdraw/platform credit transactions
  const { data: walletTransactions = [] } = useQuery({
    queryKey: ["wallet-fund-transactions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("transactions")
        .select("id, type, amount, description, created_at, tx_hash, network, status")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error);
        return [];
      }

      return data || [];
    },
    enabled: !!user,
  });

  // Transform and merge all transactions
  const tradeTransactions: Transaction[] = recentTrades.map((trade) => ({
    id: trade.id,
    type: (trade.pnl ?? 0) >= 0 ? "trade_profit" : "trade_loss" as const,
    amount: trade.pnl ?? 0,
    description: `${trade.event_name} - ${trade.option_label}`,
    date: trade.closed_at ? new Date(trade.closed_at).toLocaleDateString() : new Date(trade.created_at).toLocaleDateString(),
    timestamp: trade.closed_at ? new Date(trade.closed_at).getTime() : new Date(trade.created_at).getTime(),
    status: 'completed' as TransactionStatus,
  }));

  const fundTransactions: Transaction[] = walletTransactions.map((tx) => ({
    id: tx.id,
    type: tx.type as "deposit" | "withdraw" | "platform_credit",
    amount: tx.amount,
    description: tx.description || (tx.type === "platform_credit" ? "Platform Credit" : tx.type === "deposit" ? "Deposit" : "Withdraw"),
    date: new Date(tx.created_at).toLocaleDateString(),
    timestamp: new Date(tx.created_at).getTime(),
    txHash: tx.tx_hash,
    network: tx.network,
    status: (tx.status || 'completed') as TransactionStatus,
  }));

  // Merge and sort by timestamp (newest first)
  const transactions: Transaction[] = [...tradeTransactions, ...fundTransactions]
    .sort((a, b) => b.timestamp - a.timestamp);
  
  // Dialog states
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  
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
            onClick={() => navigate('/deposit')}
          >
            <ArrowDownLeft className="w-4 h-4 mr-2" />
            Deposit
          </Button>
          <Button 
            variant="outline"
            className="flex-1 border-border/50 hover:bg-muted/50 rounded-xl h-12"
            onClick={() => navigate('/withdraw')}
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

  // TransactionHistory is now imported from @/components/wallet

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

  // Desktop Layout
  if (!isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <EventsDesktopHeader />
        
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Wallet</h1>
            <p className="text-muted-foreground">Manage your funds and connected wallets</p>
          </div>

          {/* Desktop Grid Layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Balance & Actions */}
            <div className="col-span-4 space-y-6">
              {/* Balance Card - Enhanced for Desktop */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30 p-6">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-trading-green/10 rounded-full blur-2xl" />
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <WalletIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Available Balance</span>
                      <div className="text-3xl font-bold font-mono">
                        ${formatCurrency(balance)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-6">USDC</div>
                  
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 bg-trading-green hover:bg-trading-green/90 text-background font-semibold rounded-xl h-11"
                      onClick={() => setDepositDialogOpen(true)}
                    >
                      <ArrowDownLeft className="w-4 h-4 mr-2" />
                      Deposit
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 border-border/50 hover:bg-muted/50 rounded-xl h-11"
                      onClick={() => setWithdrawDialogOpen(true)}
                    >
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                      Withdraw
                    </Button>
                  </div>
                </div>
              </div>

              {/* Connected Wallets */}
              <div className="trading-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Connected Wallets</h2>
                  <span className="text-sm text-muted-foreground">
                    {wallets.length} wallet{wallets.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {walletsLoading ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>Loading wallets...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {wallets.map((wallet) => (
                      <div 
                        key={wallet.id} 
                        className="bg-muted/30 rounded-xl p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl">
                            {wallet.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{wallet.walletType}</span>
                              {wallet.isPrimary && (
                                <Badge variant="outline" className="border-primary/50 text-primary text-xs">
                                  Primary
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <code className="text-xs font-mono text-muted-foreground">{wallet.address}</code>
                              <button
                                onClick={() => handleCopyWallet(wallet.id, wallet.fullAddress)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {copiedWalletId === wallet.id ? (
                                  <Check className="w-3 h-3 text-trading-green" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                            <span className="text-xs text-muted-foreground">{wallet.network}</span>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-border/30 flex justify-end gap-2">
                          {!wallet.isPrimary && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSetPrimaryWallet(wallet.id)}
                              className="text-primary hover:text-primary hover:bg-primary/10 h-8 text-xs"
                            >
                              <Star className="w-3 h-3 mr-1" />
                              Set Primary
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDisconnectWallet({ id: wallet.id, address: wallet.address })}
                            className="text-muted-foreground hover:text-trading-red hover:bg-trading-red/10 h-8 text-xs"
                          >
                            Disconnect
                          </Button>
                        </div>
                      </div>
                    ))}

                    <button 
                      onClick={() => setWalletDialogOpen(true)}
                      className="w-full border-2 border-dashed border-border/50 hover:border-primary/50 rounded-xl p-3 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-all text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="font-medium">Connect New Wallet</span>
                    </button>

                    {wallets.length === 0 && !walletsLoading && (
                      <p className="text-center text-sm text-muted-foreground py-2">
                        Connect a wallet to deposit and withdraw funds
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Pending Confirmations & Transaction History */}
            <div className="col-span-8 space-y-6">
              {/* Pending Confirmations */}
              <div className="trading-card p-6">
                <PendingConfirmations />
              </div>
              
              {/* Transaction History */}
              <div className="trading-card p-6">
                <TransactionHistory transactions={transactions} />
              </div>
            </div>
          </div>
        </div>

        {/* Top Up Dialog (legacy/fallback) */}
        <TopUpDialog 
          open={topUpOpen} 
          onOpenChange={setTopUpOpen} 
          currentBalance={balance}
          onTopUp={(amount, method) => {
            toast.success(`Deposited $${amount} via ${method}`);
          }}
        />

        {/* Desktop Deposit Dialog */}
        <DepositDialog 
          open={depositDialogOpen} 
          onOpenChange={setDepositDialogOpen} 
        />

        {/* Desktop Withdraw Dialog */}
        <WithdrawDialog 
          open={withdrawDialogOpen} 
          onOpenChange={setWithdrawDialogOpen} 
        />

        {/* Wallet Connection Dialog */}
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

        {/* Disconnect Confirmation Dialog */}
        <Dialog open={disconnectDialogOpen} onOpenChange={setDisconnectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-trading-red" />
                Disconnect Wallet?
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to disconnect {walletToDisconnect?.address}? You can reconnect it anytime.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 pt-4">
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
      </div>
    );
  }

  // Mobile Layout
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <MobileHeader title="Wallet" showLogo={false} />

      <div className="px-4 py-6 space-y-6">
        <BalanceCard />
        <PendingConfirmations />
        <WalletList />
        <TransactionHistory transactions={transactions} />
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

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

      {/* Disconnect Confirmation - Mobile */}
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


      {/* Top Up Dialog (legacy card payment) */}

      {/* Top Up Dialog (legacy card payment) */}
      <TopUpDialog open={topUpOpen} onOpenChange={setTopUpOpen} currentBalance={balance} />
    </div>
  );
}