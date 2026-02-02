import { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { TokenConfig } from '@/types/deposit';
import omenxLogo from '@/assets/omenx-logo.svg';

interface SharePosterContentProps {
  address: string;
  token: TokenConfig;
  referralCode?: string;
}

// Format address with character-type based coloring for display
const formatAddressDisplay = (address: string) => {
  const hasPrefix = address.startsWith('0x');
  const cleanAddress = hasPrefix ? address.slice(2) : address;
  
  const chunks: { char: string; isDigit: boolean }[][] = [];
  let currentChunk: { char: string; isDigit: boolean }[] = [];
  
  for (let i = 0; i < cleanAddress.length; i++) {
    const char = cleanAddress[i];
    const isDigit = /[0-9]/.test(char);
    currentChunk.push({ char, isDigit });
    
    if (currentChunk.length === 4 || i === cleanAddress.length - 1) {
      chunks.push(currentChunk);
      currentChunk = [];
    }
  }
  
  return { hasPrefix, chunks };
};

// Design tokens for poster (inline styles for image export consistency)
const posterStyles = {
  background: 'linear-gradient(to bottom, #1a1a2e, #16162a)',
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.6)',
  textMuted: 'rgba(255, 255, 255, 0.3)',
  accent: '#a78bfa',
  warning: '#fbbf24',
  warningBg: 'rgba(251, 191, 36, 0.1)',
  warningBorder: 'rgba(251, 191, 36, 0.3)',
  cardBg: 'rgba(255, 255, 255, 0.05)',
};

export const SharePosterContent = forwardRef<HTMLDivElement, SharePosterContentProps>(
  ({ address, token, referralCode = 'OMENX2025' }, ref) => {
    const { hasPrefix, chunks } = formatAddressDisplay(address);

    return (
      <div
        ref={ref}
        style={{
          width: '400px',
          background: posterStyles.background,
          padding: '32px',
          borderRadius: '16px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Header: Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <img 
            src={omenxLogo} 
            alt="OMENX" 
            style={{ height: '24px', width: 'auto' }}
          />
        </div>

        {/* Content: Token Info + Address */}
        <div style={{ marginBottom: '24px' }}>
          {/* Token Badge */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: posterStyles.cardBg,
              borderRadius: '9999px',
            }}>
              <span style={{ fontSize: '24px' }}>{token.icon}</span>
              <span style={{ color: posterStyles.textPrimary, fontWeight: 600 }}>{token.symbol}</span>
              <span style={{ color: posterStyles.textSecondary }}>on</span>
              <span style={{ color: posterStyles.textPrimary, fontWeight: 500 }}>{token.network}</span>
            </div>
          </div>

          {/* Deposit Address */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: posterStyles.textSecondary, fontSize: '14px', marginBottom: '8px' }}>
              Deposit Address
            </p>
            <div style={{
              padding: '16px',
              background: posterStyles.cardBg,
              borderRadius: '12px',
              fontFamily: 'monospace',
              fontSize: '14px',
              lineHeight: '1.6',
              wordBreak: 'break-all',
            }}>
              <span style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px 8px' }}>
                {hasPrefix && (
                  <span>
                    <span style={{ color: posterStyles.accent }}>0</span>
                    <span style={{ color: posterStyles.textPrimary }}>x</span>
                  </span>
                )}
                {chunks.map((chunk, chunkIndex) => (
                  <span key={chunkIndex}>
                    {chunk.map((item, charIndex) => (
                      <span 
                        key={charIndex}
                        style={{ color: item.isDigit ? posterStyles.accent : posterStyles.textPrimary }}
                      >
                        {item.char}
                      </span>
                    ))}
                  </span>
                ))}
              </span>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div style={{
          padding: '12px',
          background: posterStyles.warningBg,
          border: `1px solid ${posterStyles.warningBorder}`,
          borderRadius: '12px',
          marginBottom: '24px',
        }}>
          <p style={{
            color: posterStyles.warning,
            fontSize: '12px',
            textAlign: 'center',
            lineHeight: '1.5',
            margin: 0,
          }}>
            ⚠️ <span style={{ fontWeight: 600 }}>Important:</span> Only send {token.symbol} on the{' '}
            <span style={{ fontWeight: 600 }}>{token.network}</span> network
          </p>
        </div>

        {/* Footer: QR Code + Referral */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}>
          {/* QR Code */}
          <div style={{
            padding: '12px',
            background: '#ffffff',
            borderRadius: '12px',
            flexShrink: 0,
          }}>
            <QRCodeSVG 
              value={address} 
              size={80}
              level="H"
              includeMargin={false}
            />
          </div>

          {/* Referral Section */}
          <div style={{ flex: 1, textAlign: 'right' }}>
            <p style={{
              color: posterStyles.textMuted,
              fontSize: '11px',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Referral Code
            </p>
            <p style={{
              color: posterStyles.textPrimary,
              fontSize: '18px',
              fontWeight: 700,
              fontFamily: 'monospace',
              letterSpacing: '2px',
              margin: 0,
            }}>
              {referralCode}
            </p>
            <p style={{
              color: posterStyles.textMuted,
              fontSize: '11px',
              marginTop: '8px',
            }}>
              Scan to deposit
            </p>
          </div>
        </div>
      </div>
    );
  }
);

SharePosterContent.displayName = 'SharePosterContent';
