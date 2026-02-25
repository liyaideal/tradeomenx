import { useState } from "react";
import { AuthGateOverlay } from "@/components/AuthGateOverlay";
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
  Info,
  Trash2,
  
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useWallets } from "@/hooks/useWallets";
import { useRealtimeRiskMetrics } from "@/hooks/useRealtimeRiskMetrics";
import { useIsMobile } from "@/hooks/use-mobile";
import { BottomNav } from "@/components/BottomNav";
import { MobileHeader } from "@/components/MobileHeader";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { TopUpDialog } from "@/components/TopUpDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  MobileDrawer,
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
import { AddAddressDialog } from "@/components/wallet/AddAddressDialog";
import { DepositDialog } from "@/components/deposit/DepositDialog";
import { WithdrawDialog } from "@/components/withdraw/WithdrawDialog";
import { 
  TransactionHistory, 
  PendingConfirmations,
  Transaction, 
  TransactionStatus 
} from "@/components/wallet";
import { DepositDialog } from "@/components/deposit/DepositDialog";
import { WithdrawDialog } from "@/components/withdraw/WithdrawDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";




export default function Wallet() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { balance, trialBalance, user } = useUserProfile();
  const { imTotal, unrealizedPnL, hasPositions } = useRealtimeRiskMetrics();
  const { 
    wallets, 
    isLoading: walletsLoading, 
    addWallet, 
    removeWallet, 
    setPrimaryWallet 
  } = useWallets();

  // Fetch closed trades for transaction history (only realized P&L)
  const { data: recentTrades = [] } = useQuery({
    queryKey: ["wallet-trades", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("trades")
        .select("id, event_name, option_label, pnl, created_at, closed_at, status")
        .eq("user_id", user.id)
        .eq("status", "Closed")
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

  const transactions: Transaction[] = [...tradeTransactions, ...fundTransactions]
    .sort((a, b) => b.timestamp - a.timestamp);
  
  // Dialog states
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  
  const [addAddressOpen, setAddAddressOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [walletToDelete, setWalletToDelete] = useState<{ id: string; label: string } | null>(null);
  const [copiedWalletId, setCopiedWalletId] = useState<string | null>(null);
  

  const formatCurrency = (value: number) => {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleCopyWallet = (walletId: string, address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedWalletId(walletId);
    toast.success("Address copied");
    setTimeout(() => setCopiedWalletId(null), 2000);
  };

  const handleDeleteWallet = (wallet: { id: string; label: string }) => {
    setWalletToDelete(wallet);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (walletToDelete) {
      const result = await removeWallet(walletToDelete.id);
      if (result.success) {
        toast.success("Address deleted");
      } else {
        toast.error(result.error || "Failed to delete address");
      }
    }
    setDeleteDialogOpen(false);
    setWalletToDelete(null);
  };

  const handleSetPrimaryWallet = async (walletId: string) => {
    const result = await setPrimaryWallet(walletId);
    if (result.success) {
      toast.success("Default address updated");
    } else {
      toast.error(result.error || "Failed to update default address");
    }
  };
  };

  // Info Tooltip Component
  const InfoTooltip = ({ text }: { text: string }) => {
    if (isMobile) {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Info className="w-3 h-3" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3 text-xs" side="top" align="center">
            <p>{text}</p>
          </PopoverContent>
        </Popover>
      );
    }
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Info className="w-3 h-3" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[200px]">
            <p>{text}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Available Balance Popover
  const AvailableBalanceTooltip = ({ marginInUse, unrealizedPnL }: { marginInUse: number; unrealizedPnL: number }) => {
    const content = (
      <div className="space-y-2">
        <p className="text-xs">Funds available for trading and withdrawal.</p>
        {marginInUse > 0 && (
          <div className="pt-2 border-t border-border/50 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Margin in Use:</span>
              <span className="font-mono text-trading-yellow">${formatCurrency(marginInUse)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Unrealized P&L:</span>
              <span className={`font-mono ${unrealizedPnL >= 0 ? 'text-trading-green' : 'text-trading-red'}`}>
                {unrealizedPnL >= 0 ? '+' : ''}${formatCurrency(unrealizedPnL)}
              </span>
            </div>
          </div>
        )}
        <button
          onClick={() => navigate('/portfolio')}
          className="w-full mt-2 text-xs text-primary hover:underline text-left"
        >
          View positions in Portfolio →
        </button>
      </div>
    );

    return (
      <Popover>
        <PopoverTrigger asChild>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Info className="w-3 h-3" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" side="top" align={isMobile ? "start" : "center"}>
          {content}
        </PopoverContent>
      </Popover>
    );
  };

  // Balance Card Component
  const BalanceCard = () => (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30 p-6">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-trading-green/10 rounded-full blur-2xl" />
      
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <WalletIcon className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm text-muted-foreground">Total Equity</span>
        </div>
        
        <div className="flex items-baseline gap-2 mb-4 flex-nowrap">
          <span className="text-4xl font-bold font-mono whitespace-nowrap">${formatCurrency(balance + trialBalance)}</span>
          <span className="text-sm text-muted-foreground whitespace-nowrap">USDC</span>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/20">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs text-muted-foreground">Available Balance</span>
              <AvailableBalanceTooltip marginInUse={imTotal} unrealizedPnL={unrealizedPnL} />
            </div>
            <span className="font-mono text-sm font-semibold">${formatCurrency(balance)}</span>
          </div>
          
          <div className={`p-3 rounded-lg ${trialBalance > 0 ? 'bg-trading-green/10 border border-trading-green/20' : 'bg-muted/20'}`}>
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs text-muted-foreground">Trial Bonus</span>
              <InfoTooltip text="Bonus funds used first when trading. Cannot be withdrawn." />
            </div>
            <span className={`font-mono text-sm font-semibold ${trialBalance > 0 ? 'text-trading-green' : 'text-muted-foreground'}`}>
              ${formatCurrency(trialBalance)}
            </span>
          </div>
        </div>
        
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

  // Address Card for individual saved address
  const AddressCard = ({ wallet }: { wallet: typeof wallets[0] }) => (
    <div className="bg-card border border-border/50 rounded-xl p-4 hover:border-border transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center p-2">
          <img src={wallet.icon} alt={wallet.network} className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{wallet.label}</span>
            {wallet.isPrimary && (
              <Badge variant="outline" className="border-primary/50 text-primary text-xs">
                Default
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
          <span className="text-xs text-muted-foreground">{wallet.network}</span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-border/30 flex justify-end gap-2">
        {!wallet.isPrimary && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSetPrimaryWallet(wallet.id)}
            className="text-primary hover:text-primary hover:bg-primary/10"
          >
            <Star className="w-3.5 h-3.5 mr-1" />
            Set Default
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDeleteWallet({ id: wallet.id, label: wallet.label })}
          className="text-muted-foreground hover:text-trading-red hover:bg-trading-red/10"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );

  // Saved Addresses List Component
  const SavedAddressesList = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Saved Addresses</h2>
        <span className="text-sm text-muted-foreground">
          {wallets.length} address{wallets.length !== 1 ? 'es' : ''}
        </span>
      </div>

      {walletsLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {wallets.map((wallet) => (
            <AddressCard key={wallet.id} wallet={wallet} />
          ))}

          <button 
            onClick={() => setAddAddressOpen(true)}
            className="w-full border-2 border-dashed border-border/50 hover:border-primary/50 rounded-xl p-4 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Address</span>
          </button>

          {wallets.length === 0 && !walletsLoading && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                Save addresses for quick deposits and withdrawals
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );


  // Desktop Layout
  if (!isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <EventsDesktopHeader />
        
        <AuthGateOverlay title="Sign in to view your wallet" description="Manage your funds and saved addresses by signing in.">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Wallet</h1>
            <p className="text-muted-foreground">Manage your funds and saved addresses</p>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Left Column */}
            <div className="col-span-4 space-y-6">
              {/* Balance Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30 p-6">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-trading-green/10 rounded-full blur-2xl" />
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <WalletIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Total Equity</span>
                      <div className="flex items-baseline gap-2 flex-nowrap">
                        <span className="text-3xl font-bold font-mono whitespace-nowrap">${formatCurrency(balance + trialBalance)}</span>
                        <span className="text-sm text-muted-foreground whitespace-nowrap">USDC</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-muted/20">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-xs text-muted-foreground">Available Balance</span>
                        <AvailableBalanceTooltip marginInUse={imTotal} unrealizedPnL={unrealizedPnL} />
                      </div>
                      <span className="font-mono text-sm font-semibold">${formatCurrency(balance)}</span>
                    </div>
                    
                    <div className={`p-3 rounded-lg ${trialBalance > 0 ? 'bg-trading-green/10 border border-trading-green/20' : 'bg-muted/20'}`}>
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-xs text-muted-foreground">Trial Bonus</span>
                        <InfoTooltip text="Bonus funds used first when trading. Cannot be withdrawn." />
                      </div>
                      <span className={`font-mono text-sm font-semibold ${trialBalance > 0 ? 'text-trading-green' : 'text-muted-foreground'}`}>
                        ${formatCurrency(trialBalance)}
                      </span>
                    </div>
                  </div>
                  
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

              {/* Saved Addresses */}
              <div className="trading-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Saved Addresses</h2>
                  <span className="text-sm text-muted-foreground">
                    {wallets.length} address{wallets.length !== 1 ? 'es' : ''}
                  </span>
                </div>

                {walletsLoading ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>Loading...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {wallets.map((wallet) => (
                      <div 
                        key={wallet.id} 
                        className="bg-muted/30 rounded-xl p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center p-2">
                            <img src={wallet.icon} alt={wallet.network} className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{wallet.label}</span>
                              {wallet.isPrimary && (
                                <Badge variant="outline" className="border-primary/50 text-primary text-xs">
                                  Default
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
                              Set Default
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteWallet({ id: wallet.id, label: wallet.label })}
                            className="text-muted-foreground hover:text-trading-red hover:bg-trading-red/10 h-8 text-xs"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}

                    <button 
                      onClick={() => setAddAddressOpen(true)}
                      className="w-full border-2 border-dashed border-border/50 hover:border-primary/50 rounded-xl p-3 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-all text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="font-medium">Add Address</span>
                    </button>

                    {wallets.length === 0 && !walletsLoading && (
                      <p className="text-center text-sm text-muted-foreground py-2">
                        Save addresses for quick deposits and withdrawals
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-8 space-y-6">
              <PendingConfirmations className="trading-card p-6" />
              
              <div className="trading-card p-6">
                <TransactionHistory transactions={transactions} />
              </div>
            </div>
          </div>
        </div>
        </AuthGateOverlay>

        <TopUpDialog 
          open={topUpOpen} 
          onOpenChange={setTopUpOpen} 
          currentBalance={balance}
          onTopUp={(amount, method) => {
            toast.success(`Deposited $${amount} via ${method}`);
          }}
        />

        <DepositDialog 
          open={depositDialogOpen} 
          onOpenChange={setDepositDialogOpen} 
        />

        <WithdrawDialog 
          open={withdrawDialogOpen} 
          onOpenChange={setWithdrawDialogOpen} 
        />

        {/* Add Address Dialog */}
        <AddAddressDialog open={addAddressOpen} onOpenChange={setAddAddressOpen} />

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-trading-red" />
                Delete Address?
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{walletToDelete?.label}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                className="flex-1 bg-trading-red hover:bg-trading-red/90 text-white"
              >
                Delete
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
      <MobileHeader title="Wallet" showLogo={false} />

      <AuthGateOverlay title="Sign in to view your wallet" description="Manage your funds and saved addresses by signing in." maxPreviewHeight="400px">
      <div className="px-4 py-6 space-y-6">
        <BalanceCard />
        <PendingConfirmations />
        <SavedAddressesList />
        <TransactionHistory transactions={transactions} />
      </div>
      </AuthGateOverlay>

      <BottomNav />

      <TopUpDialog 
        open={topUpOpen} 
        onOpenChange={setTopUpOpen} 
        currentBalance={balance}
        onTopUp={(amount, method) => {
          toast.success(`Deposited $${amount} via ${method}`);
        }}
      />

      {/* Add Address Dialog (shared component handles mobile/desktop) */}
      <AddAddressDialog open={addAddressOpen} onOpenChange={setAddAddressOpen} />

      {/* Delete Confirmation - Mobile */}
      <MobileDrawer
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        showHandle={true}
      >
        <MobileDrawerStatus
          icon={<AlertTriangle className="w-8 h-8 text-trading-red" />}
          title="Delete Address?"
          description={`Are you sure you want to delete "${walletToDelete?.label}"? This action cannot be undone.`}
          variant="error"
        />
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setDeleteDialogOpen(false)}
            className="flex-1 h-12"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            className="flex-1 h-12 bg-trading-red hover:bg-trading-red/90 text-white"
          >
            Delete
          </Button>
        </div>
      </MobileDrawer>

      <TopUpDialog open={topUpOpen} onOpenChange={setTopUpOpen} currentBalance={balance} />
    </div>
  );
}

