import { forwardRef } from 'react';
import { SharePosterLayout } from '@/components/share/SharePosterLayout';
import { posterColors, posterThemes } from '@/lib/posterStyles';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface ReferralPosterStats {
  pnl?: number;
  roi?: number;
  volume?: number;
  rank?: number;
}

interface ReferralSharePosterProps {
  referralCode: string;
  username?: string;
  avatarUrl?: string;
  stats?: ReferralPosterStats;
  showStats?: {
    pnl?: boolean;
    roi?: boolean;
    volume?: boolean;
  };
}

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toLocaleString()}`;
};

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

/**
 * ReferralSharePoster - Shareable referral card with optional trading stats
 * 
 * Uses SharePosterLayout with customizable stat display.
 * Shows user avatar, username, optional rank badge, and selected stats.
 */
export const ReferralSharePoster = forwardRef<HTMLDivElement, ReferralSharePosterProps>(
  ({ 
    referralCode, 
    username = 'Trader', 
    avatarUrl,
    stats,
    showStats = { pnl: true, roi: true, volume: true },
  }, ref) => {
    const theme = posterThemes.neutral;
    const referralLink = `https://omenx.lovable.app?ref=${referralCode}`;
    const hasRank = stats?.rank && stats.rank <= 100;
    const hasAnyStats = stats && (showStats.pnl || showStats.roi || showStats.volume);

    return (
      <SharePosterLayout
        ref={ref}
        theme="neutral"
        qrValue={referralLink}
        referralCode={referralCode}
        ctaText="Predict. Trade. Profit."
        qrLabel="omenx.lovable.app"
      >
        {/* Rank Badge (top right of content) */}
        {hasRank && (
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 12px',
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            borderRadius: '20px',
          }}>
            <span style={{ fontSize: '12px' }}>✨</span>
            <span style={{ 
              color: '#22c55e', 
              fontSize: '12px', 
              fontWeight: 600,
            }}>
              Top Ranking
            </span>
          </div>
        )}

        {/* User Profile Section */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px',
          marginBottom: hasAnyStats ? '20px' : '8px',
          marginTop: hasRank ? '40px' : '0',
        }}>
          {/* Avatar */}
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: theme.bgColor,
            border: `2px solid ${theme.borderColor}`,
            overflow: 'hidden',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={username}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ 
                fontSize: '28px', 
                fontWeight: 700, 
                color: theme.primary,
              }}>
                {username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Username + Rank */}
          <div>
            <div style={{
              fontSize: '20px',
              fontWeight: 700,
              color: posterColors.textPrimary,
              marginBottom: hasRank ? '8px' : '0',
            }}>
              {username}
            </div>
            {hasRank && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{
                  padding: '4px 10px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: posterColors.textPrimary,
                }}>
                  #{stats!.rank}
                </span>
                <span style={{
                  fontSize: '12px',
                  color: posterColors.textSecondary,
                }}>
                  Global Ranking
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        {hasAnyStats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${[showStats.pnl, showStats.roi, showStats.volume].filter(Boolean).length}, 1fr)`,
            gap: '12px',
          }}>
            {showStats.pnl && stats?.pnl !== undefined && (
              <div style={{
                padding: '14px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: `1px solid ${posterColors.border}`,
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '11px',
                  color: posterColors.textMuted,
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  PnL
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  fontFamily: 'ui-monospace, monospace',
                  color: stats.pnl >= 0 ? '#22c55e' : '#ef4444',
                }}>
                  {stats.pnl >= 0 ? '+' : ''}{formatCurrency(stats.pnl)}
                </div>
              </div>
            )}
            {showStats.roi && stats?.roi !== undefined && (
              <div style={{
                padding: '14px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: `1px solid ${posterColors.border}`,
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '11px',
                  color: posterColors.textMuted,
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  ROI
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  fontFamily: 'ui-monospace, monospace',
                  color: stats.roi >= 0 ? '#22c55e' : '#ef4444',
                }}>
                  {stats.roi >= 0 ? '+' : ''}{formatPercent(stats.roi)}
                </div>
              </div>
            )}
            {showStats.volume && stats?.volume !== undefined && (
              <div style={{
                padding: '14px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: `1px solid ${posterColors.border}`,
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '11px',
                  color: posterColors.textMuted,
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Volume
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  fontFamily: 'ui-monospace, monospace',
                  color: posterColors.textPrimary,
                }}>
                  {formatCurrency(stats.volume)}
                </div>
              </div>
            )}
          </div>
        )}
      </SharePosterLayout>
    );
  }
);

ReferralSharePoster.displayName = 'ReferralSharePoster';
