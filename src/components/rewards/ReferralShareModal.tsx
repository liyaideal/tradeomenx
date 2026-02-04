import { useState } from 'react';
import { Eye, Palette } from 'lucide-react';
import { ShareModal } from '@/components/ShareModal';
import { ReferralSharePoster, ReferralPosterStats } from './ReferralSharePoster';
import { cn } from '@/lib/utils';

interface ReferralShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  referralCode: string;
  referralLink: string;
  username?: string;
  avatarUrl?: string;
  stats?: ReferralPosterStats;
}

type CardStyle = 'default' | 'neon' | 'brutal' | 'gold';

const cardStyles: { value: CardStyle; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'neon', label: 'Neon' },
  { value: 'brutal', label: 'Brutal' },
  { value: 'gold', label: 'Gold' },
];

/**
 * ReferralShareModal - Modal for sharing referral code with customizable poster
 * 
 * Features:
 * - Card style selection (future: different themes)
 * - Toggle stats visibility (PnL, ROI, Volume)
 * - Uses universal ShareModal with multi-channel sharing
 */
export const ReferralShareModal = ({
  open,
  onOpenChange,
  referralCode,
  referralLink,
  username = 'Trader',
  avatarUrl,
  stats,
}: ReferralShareModalProps) => {
  const [selectedStyle, setSelectedStyle] = useState<CardStyle>('default');
  const [showStats, setShowStats] = useState({
    pnl: true,
    roi: true,
    volume: true,
  });

  const shareText = `Join me on OmenX - the prediction market platform! Use my referral code: ${referralCode}`;
  const hasStats = stats && (stats.pnl !== undefined || stats.roi !== undefined || stats.volume !== undefined);

  const toggleStat = (stat: 'pnl' | 'roi' | 'volume') => {
    setShowStats(prev => ({ ...prev, [stat]: !prev[stat] }));
  };

  // Generate a key that changes when poster content changes
  const posterKey = `${selectedStyle}-${JSON.stringify(showStats)}`;

  return (
    <ShareModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Share Your Code"
      subtitle="Customize and share your referral"
      shareText={shareText}
      shareUrl={referralLink}
      fileName={`omenx-referral-${referralCode.toLowerCase()}`}
      isDataReady={true}
      key={posterKey}
    >
      {/* Customization Controls */}
      <div className="mb-4 space-y-3">
        {/* Card Style Selector */}
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Card Style</span>
        </div>
        <div className="flex gap-2">
          {cardStyles.map((style) => (
            <button
              key={style.value}
              onClick={() => setSelectedStyle(style.value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                selectedStyle === style.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {style.label}
            </button>
          ))}
        </div>

        {/* Stats Toggle (only show if user has stats) */}
        {hasStats && (
          <>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Show Stats</span>
            </div>
            <div className="flex gap-2">
              {stats?.pnl !== undefined && (
                <button
                  onClick={() => toggleStat('pnl')}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
                    showStats.pnl
                      ? "bg-trading-green/20 text-trading-green border-trading-green/40"
                      : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
                  )}
                >
                  <Eye className="w-3 h-3" />
                  PnL
                </button>
              )}
              {stats?.roi !== undefined && (
                <button
                  onClick={() => toggleStat('roi')}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
                    showStats.roi
                      ? "bg-trading-green/20 text-trading-green border-trading-green/40"
                      : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
                  )}
                >
                  <Eye className="w-3 h-3" />
                  ROI
                </button>
              )}
              {stats?.volume !== undefined && (
                <button
                  onClick={() => toggleStat('volume')}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
                    showStats.volume
                      ? "bg-trading-green/20 text-trading-green border-trading-green/40"
                      : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
                  )}
                >
                  <Eye className="w-3 h-3" />
                  Volume
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Poster Preview */}
      <ReferralSharePoster
        referralCode={referralCode}
        username={username}
        avatarUrl={avatarUrl}
        stats={stats}
        showStats={showStats}
      />
    </ShareModal>
  );
};
