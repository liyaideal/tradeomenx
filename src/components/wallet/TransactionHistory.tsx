import { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  History,
  TrendingUp,
  TrendingDown,
  Wallet as WalletIcon,
  ExternalLink,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Radio,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useRealtimeTransactions } from '@/hooks/useRealtimeTransactions';
// Network explorer URLs for txHash links
const EXPLORER_URLS: Record<string, string> = {
  'Ethereum': 'https://etherscan.io/tx/',
  'BNB Smart Chain (BEP20)': 'https://bscscan.com/tx/',
  'Polygon': 'https://polygonscan.com/tx/',
  'Arbitrum One': 'https://arbiscan.io/tx/',
  'Optimism': 'https://optimistic.etherscan.io/tx/',
  'Avalanche C-Chain': 'https://snowtrace.io/tx/',
  'Bitcoin': 'https://blockchair.com/bitcoin/transaction/',
  'Solana': 'https://solscan.io/tx/',
  'Tron (TRC20)': 'https://tronscan.org/#/transaction/',
};

export type TransactionType = 'deposit' | 'withdraw' | 'trade_profit' | 'trade_loss' | 'platform_credit';
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  timestamp: number;
  txHash?: string | null;
  network?: string | null;
  status?: TransactionStatus;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  className?: string;
}

const STATUS_CONFIG: Record<TransactionStatus, { icon: React.ElementType; color: string; label: string }> = {
  pending: { icon: Clock, color: 'text-trading-yellow', label: 'Pending' },
  processing: { icon: Loader2, color: 'text-primary', label: 'Processing' },
  completed: { icon: CheckCircle2, color: 'text-trading-green', label: 'Completed' },
  failed: { icon: XCircle, color: 'text-trading-red', label: 'Failed' },
};

const TYPE_LABELS: Record<TransactionType, string> = {
  deposit: 'Deposits',
  withdraw: 'Withdrawals',
  trade_profit: 'Trade Profits',
  trade_loss: 'Trade Losses',
  platform_credit: 'Platform Credits',
};

export const TransactionHistory = ({ transactions, className }: TransactionHistoryProps) => {
  const [typeFilters, setTypeFilters] = useState<TransactionType[]>([]);
  const [statusFilters, setStatusFilters] = useState<TransactionStatus[]>([]);
  const [isLive, setIsLive] = useState(true);

  // Subscribe to real-time transaction updates
  useRealtimeTransactions();

  const formatCurrency = (value: number) => {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getExplorerUrl = (network: string | null | undefined, txHash: string): string | null => {
    if (!network || !txHash) return null;
    const baseUrl = EXPLORER_URLS[network];
    if (!baseUrl) return null;
    return `${baseUrl}${txHash}`;
  };

  const truncateTxHash = (hash: string): string => {
    if (hash.length <= 16) return hash;
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  };

  const toggleTypeFilter = (type: TransactionType) => {
    setTypeFilters(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleStatusFilter = (status: TransactionStatus) => {
    setStatusFilters(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const clearFilters = () => {
    setTypeFilters([]);
    setStatusFilters([]);
  };

  // Apply filters
  const filteredTransactions = transactions.filter(tx => {
    const typeMatch = typeFilters.length === 0 || typeFilters.includes(tx.type);
    const statusMatch = statusFilters.length === 0 || statusFilters.includes(tx.status || 'completed');
    return typeMatch && statusMatch;
  });

  const hasActiveFilters = typeFilters.length > 0 || statusFilters.length > 0;

  const getTransactionIcon = (tx: Transaction) => {
    if (tx.type === 'deposit') {
      return <ArrowDownLeft className="w-5 h-5 text-trading-green" />;
    } else if (tx.type === 'withdraw') {
      return <ArrowUpRight className="w-5 h-5 text-trading-red" />;
    } else if (tx.type === 'platform_credit') {
      return <WalletIcon className="w-5 h-5 text-trading-green" />;
    } else if (tx.type === 'trade_profit') {
      return <TrendingUp className="w-5 h-5 text-trading-green" />;
    } else {
      return <TrendingDown className="w-5 h-5 text-trading-red" />;
    }
  };

  const getTransactionBgColor = (tx: Transaction) => {
    if (tx.type === 'deposit' || tx.type === 'platform_credit' || tx.type === 'trade_profit') {
      return 'bg-trading-green/20';
    }
    return 'bg-trading-red/20';
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header with Filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Transaction History</h2>
          {/* Live indicator */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-trading-green/10 border border-trading-green/20">
            <Radio className="w-3 h-3 text-trading-green animate-pulse" />
            <span className="text-xs text-trading-green font-medium">Live</span>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className={cn(
                "gap-2",
                hasActiveFilters && "border-primary text-primary"
              )}
            >
              <Filter className="w-4 h-4" />
              Filter
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                  {typeFilters.length + statusFilters.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Transaction Type</DropdownMenuLabel>
            {(Object.keys(TYPE_LABELS) as TransactionType[]).map((type) => (
              <DropdownMenuCheckboxItem
                key={type}
                checked={typeFilters.includes(type)}
                onCheckedChange={() => toggleTypeFilter(type)}
              >
                {TYPE_LABELS[type]}
              </DropdownMenuCheckboxItem>
            ))}
            
            <DropdownMenuSeparator />
            
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            {(Object.keys(STATUS_CONFIG) as TransactionStatus[]).map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={statusFilters.includes(status)}
                onCheckedChange={() => toggleStatusFilter(status)}
              >
                {STATUS_CONFIG[status].label}
              </DropdownMenuCheckboxItem>
            ))}
            
            {hasActiveFilters && (
              <>
                <DropdownMenuSeparator />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-center text-muted-foreground"
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Transaction List */}
      {filteredTransactions.length === 0 ? (
        <div className="bg-card border border-border/50 rounded-xl p-6 text-center">
          <History className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            {hasActiveFilters ? 'No transactions match your filters' : 'No recent activity'}
          </p>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2"
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-card border border-border/50 rounded-xl divide-y divide-border/30">
          {filteredTransactions.map((tx) => {
            const explorerUrl = getExplorerUrl(tx.network, tx.txHash || '');
            const statusConfig = STATUS_CONFIG[tx.status || 'completed'];
            const StatusIcon = statusConfig.icon;
            
            return (
              <div key={tx.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      getTransactionBgColor(tx)
                    )}>
                      {getTransactionIcon(tx)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate max-w-[180px] md:max-w-[300px]">
                        {tx.description}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{tx.date}</span>
                        
                        {/* Status Badge */}
                        {tx.status && tx.status !== 'completed' && (
                          <>
                            <span>•</span>
                            <span className={cn("flex items-center gap-1", statusConfig.color)}>
                              <StatusIcon className={cn(
                                "w-3 h-3",
                                tx.status === 'processing' && "animate-spin"
                              )} />
                              {statusConfig.label}
                            </span>
                          </>
                        )}
                        
                        {/* TxHash Link */}
                        {tx.txHash && explorerUrl && (
                          <>
                            <span>•</span>
                            <a 
                              href={explorerUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-primary hover:underline font-mono"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {truncateTxHash(tx.txHash)}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={cn(
                    "text-sm font-semibold font-mono",
                    tx.amount >= 0 ? "text-trading-green" : "text-trading-red"
                  )}>
                    {tx.amount >= 0 ? "+" : ""}${formatCurrency(Math.abs(tx.amount))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
