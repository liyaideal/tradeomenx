import { forwardRef } from 'react';
import { SharePosterLayout } from '@/components/share/SharePosterLayout';
import { posterColors, posterThemes } from '@/lib/posterStyles';

interface ReferralSharePosterProps {
  referralCode: string;
  /** Inviter's username - shown as "Invited by" */
  inviterName?: string;
}

/**
 * ReferralSharePoster - Benefits-focused invitation card
 * 
 * Design philosophy: Focus on NEW USER benefits, not inviter achievements.
 * - Highlights sign-up rewards and first-trade bonuses
 * - Large, scannable QR code
 * - Clear call-to-action for registration
 * 
 * Theme: "special" (gold) to convey rewards/value
 */
export const ReferralSharePoster = forwardRef<HTMLDivElement, ReferralSharePosterProps>(
  ({ referralCode, inviterName }, ref) => {
    const theme = posterThemes.special; // Gold theme for rewards
    const referralLink = `https://omenx.lovable.app?ref=${referralCode}`;

    return (
      <SharePosterLayout
        ref={ref}
        theme="special"
        qrValue={referralLink}
        referralCode={referralCode}
        ctaText="Scan to claim rewards"
        qrLabel="omenx.lovable.app"
      >
        {/* Gift Badge */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '16px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: theme.bgColor,
            border: `1px solid ${theme.borderColor}`,
            borderRadius: '24px',
          }}>
            <span style={{ fontSize: '18px' }}>🎁</span>
            <span style={{
              color: theme.primary,
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.5px',
            }}>
              EXCLUSIVE INVITE
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <div style={{
          textAlign: 'center',
          marginBottom: '20px',
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 800,
            color: posterColors.textPrimary,
            lineHeight: 1.3,
            marginBottom: '8px',
          }}>
            Join OMENX
          </div>
          <div style={{
            fontSize: '14px',
            color: posterColors.textSecondary,
          }}>
            The Prediction Market Platform
          </div>
        </div>

        {/* Benefits Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginBottom: '20px',
        }}>
          {/* Benefit 1: First Trade Bonus */}
          <div style={{
            padding: '14px 12px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            border: `1px solid ${posterColors.border}`,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', marginBottom: '6px' }}>📈</div>
            <div style={{
              fontSize: '18px',
              fontWeight: 700,
              color: theme.primary,
              fontFamily: 'ui-monospace, monospace',
              marginBottom: '4px',
            }}>
              +100
            </div>
            <div style={{
              fontSize: '10px',
              color: posterColors.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              First Trade
            </div>
          </div>

          {/* Benefit 2: Each Referral Bonus */}
          <div style={{
            padding: '14px 12px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            border: `1px solid ${posterColors.border}`,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', marginBottom: '6px' }}>👥</div>
            <div style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#22c55e',
              fontFamily: 'ui-monospace, monospace',
              marginBottom: '4px',
            }}>
              +200
            </div>
            <div style={{
              fontSize: '10px',
              color: posterColors.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Each Referral
            </div>
          </div>
        </div>

        {/* How it works - Compact */}
        <div style={{
          padding: '12px 14px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '10px',
          border: `1px solid ${posterColors.border}`,
          marginBottom: '4px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: theme.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 700,
                color: theme.primary,
              }}>1</span>
              <span style={{ fontSize: '11px', color: posterColors.textSecondary }}>
                Scan QR
              </span>
            </div>
            <span style={{ color: posterColors.textMuted, fontSize: '12px' }}>→</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: theme.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 700,
                color: theme.primary,
              }}>2</span>
              <span style={{ fontSize: '11px', color: posterColors.textSecondary }}>
                Sign Up
              </span>
            </div>
            <span style={{ color: posterColors.textMuted, fontSize: '12px' }}>→</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: theme.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 700,
                color: theme.primary,
              }}>3</span>
              <span style={{ fontSize: '11px', color: posterColors.textSecondary }}>
                Claim!
              </span>
            </div>
          </div>
        </div>

        {/* Invited by (optional) */}
        {inviterName && (
          <div style={{
            textAlign: 'center',
            marginTop: '12px',
          }}>
            <span style={{
              fontSize: '11px',
              color: posterColors.textMuted,
            }}>
              Invited by{' '}
              <span style={{ color: posterColors.textSecondary, fontWeight: 500 }}>
                {inviterName}
              </span>
            </span>
          </div>
        )}
      </SharePosterLayout>
    );
  }
);

ReferralSharePoster.displayName = 'ReferralSharePoster';
