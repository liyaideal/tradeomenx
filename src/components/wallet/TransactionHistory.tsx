import { useState, useMemo } from 'react';
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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { useRealtimeTransactions } from '@/hooks/useRealtimeTransactions';
import { useIsMobile } from '@/hooks/use-mobile';


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
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'rejected';

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
  pending: { icon: Clock, color: 'text-trading-yellow', label: 'Pending Review' },
  processing: { icon: Loader2, color: 'text-primary', label: 'Processing' },
  completed: { icon: CheckCircle2, color: 'text-trading-green', label: 'Completed' },
  failed: { icon: XCircle, color: 'text-trading-red', label: 'Failed' },
  rejected: { icon: XCircle, color: 'text-trading-red', label: 'Rejected' },
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
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  

  // Subscribe to real-time transaction updates
  useRealtimeTransactions();

  const formatCurrency = (value: number) => {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Format description based on status and terminology
  const formatDescription = (tx: Transaction): string => {
    let description = tx.description;
    
    // Remove "incoming" suffix for completed deposits
    if (tx.type === 'deposit' && tx.status === 'completed') {
      description = description.replace(/ incoming$/i, '');
    }
    
    // Update legacy "trial balance" to "trial bonus" for platform credits
    if (tx.type === 'platform_credit') {
      description = description.replace(/trial balance/gi, 'trial bonus');
    }
    
    return description;
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

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Reset page when filters change
  const effectiveCurrentPage = currentPage > totalPages ? 1 : currentPage;
  if (effectiveCurrentPage !== currentPage && totalPages > 0) {
    setCurrentPage(1);
  }

  const getPaginationRange = (): (number | "ellipsis")[] => {
    const range: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      range.push(1);
      if (currentPage > 3) range.push("ellipsis");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) range.push(i);
      if (currentPage < totalPages - 2) range.push("ellipsis");
      range.push(totalPages);
    }
    return range;
  };

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

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  // Check if a transaction has extra details worth showing
  const hasDetails = (tx: Transaction) => {
    return tx.txHash || (tx.status && tx.status !== 'completed') || tx.network;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header with Filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Transaction History</h2>
          {filteredTransactions.length > 0 && (
            <span className="text-xs text-muted-foreground">({filteredTransactions.length})</span>
          )}
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
          {paginatedTransactions.map((tx) => {
            const explorerUrl = getExplorerUrl(tx.network, tx.txHash || '');
            const statusConfig = STATUS_CONFIG[tx.status || 'completed'];
            const StatusIcon = statusConfig.icon;
            const isExpanded = expandedId === tx.id;
            const showExpandable = hasDetails(tx);
            
            return (
              <div 
                key={tx.id} 
                className={cn(
                  "p-4 transition-colors",
                  showExpandable && "cursor-pointer hover:bg-muted/30"
                )}
                onClick={() => showExpandable && toggleExpand(tx.id)}
              >
                {/* Main Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                      getTransactionBgColor(tx)
                    )}>
                      {getTransactionIcon(tx)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">
                          {formatDescription(tx)}
                        </span>
                        {/* Show status icon inline if pending/processing */}
                        {tx.status && tx.status !== 'completed' && (
                          <StatusIcon className={cn(
                            "w-3.5 h-3.5 shrink-0",
                            statusConfig.color,
                            tx.status === 'processing' && "animate-spin"
                          )} />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{tx.date}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={cn(
                      "text-sm font-semibold font-mono",
                      tx.amount >= 0 ? "text-trading-green" : "text-trading-red"
                    )}>
                      {tx.amount >= 0 ? "+" : ""}${formatCurrency(Math.abs(tx.amount))}
                    </span>
                    {showExpandable && (
                      <ChevronDown className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform",
                        isExpanded && "rotate-180"
                      )} />
                    )}
                  </div>
                </div>

                {/* Expandable details */}
                {isExpanded && hasDetails(tx) && (
                  <div className="mt-3 pt-3 border-t border-border/30 ml-[52px] space-y-2">
                    {tx.status && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <span className={cn("flex items-center gap-1.5", statusConfig.color)}>
                          <StatusIcon className={cn(
                            "w-3.5 h-3.5",
                            tx.status === 'processing' && "animate-spin"
                          )} />
                          {statusConfig.label}
                        </span>
                      </div>
                    )}
                    
                    {tx.network && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Network</span>
                        <span className="text-foreground">{tx.network}</span>
                      </div>
                    )}
                    
                    {tx.txHash && explorerUrl && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Transaction</span>
                        <a 
                          href={explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline font-mono text-xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {truncateTxHash(tx.txHash)}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        isMobile ? (
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Button>
            <span className="text-xs text-muted-foreground">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Pagination className="pt-2">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {getPaginationRange().map((item, idx) =>
                item === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item}>
                    <PaginationLink
                      isActive={currentPage === item}
                      onClick={() => setCurrentPage(item as number)}
                      className="cursor-pointer"
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )
      )}
    </div>
  );
};
