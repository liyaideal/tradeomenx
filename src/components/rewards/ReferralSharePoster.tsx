import { forwardRef } from 'react';
import { SharePosterLayout } from '@/components/share/SharePosterLayout';
import { posterColors, posterThemes } from '@/lib/posterStyles';

interface ReferralSharePosterProps {
  referralCode: string;
  /** Inviter's username */
  inviterName?: string;
  /** Inviter's avatar URL */
  avatarUrl?: string;
}

/**
 * ReferralSharePoster - KOL-friendly invitation card
 * 
 * Design: User avatar + name prominently displayed for KOL recognition,
 * followed by benefits for new users.
 * 
 * Layout: Badge → Avatar+Name → Benefits Grid → Steps → Footer
 */
export const ReferralSharePoster = forwardRef<HTMLDivElement, ReferralSharePosterProps>(
  ({ referralCode, inviterName, avatarUrl }, ref) => {
    const theme = posterThemes.special; // Gold theme for rewards
    const referralLink = `https://omenx.lovable.app?ref=${referralCode}`;
    const displayName = inviterName || 'OMENX User';
    const initials = displayName.charAt(0).toUpperCase();

    return (
      <SharePosterLayout
        ref={ref}
        theme="special"
        qrValue={referralLink}
        referralCode={referralCode}
        ctaText="Scan to join & earn"
        qrLabel="omenx.lovable.app"
      >
        {/* Invite Badge */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '16px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            background: theme.bgColor,
            border: `1px solid ${theme.borderColor}`,
            borderRadius: '20px',
          }}>
            <span style={{ fontSize: '14px' }}>🎁</span>
            <span style={{
              color: theme.primary,
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}>
              Exclusive Invite
            </span>
          </div>
        </div>

        {/* User Profile - Prominent Center Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '20px',
          padding: '16px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '16px',
          border: `1px solid ${posterColors.border}`,
        }}>
          {/* Avatar */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: theme.bgColor,
            border: `3px solid ${theme.borderColor}`,
            overflow: 'hidden',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 20px ${theme.glowColor}`,
          }}>
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={displayName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ 
                fontSize: '24px', 
                fontWeight: 700, 
                color: theme.primary,
              }}>
                {initials}
              </span>
            )}
          </div>

          {/* Username */}
          <div style={{
            fontSize: '18px',
            fontWeight: 700,
            color: posterColors.textPrimary,
            marginBottom: '4px',
          }}>
            {displayName}
          </div>
          
          {/* Invite text */}
          <div style={{
            fontSize: '12px',
            color: posterColors.textSecondary,
          }}>
            invites you to join OMENX
          </div>
        </div>

        {/* Benefits Grid - Compact */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          marginBottom: '16px',
        }}>
          {/* Benefit 1: First Trade Bonus */}
          <div style={{
            padding: '12px 10px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '10px',
            border: `1px solid ${posterColors.border}`,
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '20px',
              fontWeight: 700,
              color: theme.primary,
              fontFamily: 'ui-monospace, monospace',
              marginBottom: '2px',
            }}>
              +100
            </div>
            <div style={{
              fontSize: '9px',
              color: posterColors.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              First Trade
            </div>
          </div>

          {/* Benefit 2: Each Referral Bonus */}
          <div style={{
            padding: '12px 10px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '10px',
            border: `1px solid ${posterColors.border}`,
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#22c55e',
              fontFamily: 'ui-monospace, monospace',
              marginBottom: '2px',
            }}>
              +200
            </div>
            <div style={{
              fontSize: '9px',
              color: posterColors.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Each Referral
            </div>
          </div>
        </div>

        {/* How it works - Compact horizontal */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '6px',
          padding: '10px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '8px',
          border: `1px solid ${posterColors.border}`,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <span style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: theme.bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8px',
              fontWeight: 700,
              color: theme.primary,
            }}>1</span>
            <span style={{ fontSize: '10px', color: posterColors.textSecondary }}>
              Scan
            </span>
          </div>
          <span style={{ color: posterColors.textMuted, fontSize: '10px' }}>→</span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <span style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: theme.bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8px',
              fontWeight: 700,
              color: theme.primary,
            }}>2</span>
            <span style={{ fontSize: '10px', color: posterColors.textSecondary }}>
              Sign Up
            </span>
          </div>
          <span style={{ color: posterColors.textMuted, fontSize: '10px' }}>→</span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <span style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: theme.bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8px',
              fontWeight: 700,
              color: theme.primary,
            }}>3</span>
            <span style={{ fontSize: '10px', color: posterColors.textSecondary }}>
              Earn!
            </span>
          </div>
        </div>
      </SharePosterLayout>
    );
  }
);

ReferralSharePoster.displayName = 'ReferralSharePoster';
