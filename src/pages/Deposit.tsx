import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, X, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { BottomNav } from '@/components/BottomNav';
import { DepositAssetSelect } from '@/components/deposit/DepositAssetSelect';
import { DepositDetails } from '@/components/deposit/DepositDetails';
import { SupportedToken, getTokenConfig } from '@/types/deposit';

export default function Deposit() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  
  // Get token from URL params if present (for step 2)
  const tokenFromUrl = searchParams.get('token') as SupportedToken | null;
  const selectedToken = tokenFromUrl && getTokenConfig(tokenFromUrl) ? tokenFromUrl : null;

  const handleSelectToken = (token: SupportedToken) => {
    navigate(`/deposit?token=${token}`);
  };

  const handleBack = () => {
    if (selectedToken) {
      navigate('/deposit');
    } else {
      navigate('/wallet');
    }
  };

  const handleClose = () => {
    navigate('/wallet');
  };

  const tokenConfig = selectedToken ? getTokenConfig(selectedToken) : null;
  const title = tokenConfig ? `Deposit ${tokenConfig.symbol}` : 'Deposit';

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
          <DepositDetails token={tokenConfig} />
        ) : (
          <DepositAssetSelect onSelectToken={handleSelectToken} />
        )}
      </main>

      {/* Bottom Nav - Mobile Only */}
      {isMobile && <BottomNav />}
    </div>
  );
}
