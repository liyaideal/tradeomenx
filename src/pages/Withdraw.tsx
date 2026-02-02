import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, X, HelpCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { BottomNav } from '@/components/BottomNav';
import { AssetSelect } from '@/components/shared/AssetSelect';
import { WithdrawForm } from '@/components/withdraw/WithdrawForm';
import { SupportedToken, getTokenConfig } from '@/types/deposit';

export default function Withdraw() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  
  // On desktop, redirect to wallet page (withdraw uses dialog there)
  useEffect(() => {
    if (isMobile === false) {
      navigate('/wallet', { replace: true });
    }
  }, [isMobile, navigate]);
  
  // Get token from URL params if present (for step 2)
  const tokenFromUrl = searchParams.get('token') as SupportedToken | null;
  const selectedToken = tokenFromUrl && getTokenConfig(tokenFromUrl) ? tokenFromUrl : null;

  const handleSelectToken = (token: SupportedToken) => {
    navigate(`/withdraw?token=${token}`);
  };

  const handleBack = () => {
    if (selectedToken) {
      navigate('/withdraw');
    } else {
      navigate('/wallet');
    }
  };

  const handleClose = () => {
    navigate('/wallet');
  };

  const tokenConfig = selectedToken ? getTokenConfig(selectedToken) : null;
  const title = tokenConfig ? `Withdraw ${tokenConfig.symbol}` : 'Withdraw';

  // Don't render on desktop (will redirect)
  if (isMobile === false) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <h1 className="text-lg font-semibold">{title}</h1>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              onClick={handleClose}
              className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto pb-24">
        {selectedToken && tokenConfig ? (
          <WithdrawForm token={tokenConfig} onBack={handleBack} />
        ) : (
          <AssetSelect onSelectToken={handleSelectToken} balanceLabel="Available" />
        )}
      </main>

      {/* Bottom Nav - Mobile Only */}
      {isMobile && <BottomNav />}
    </div>
  );
}
