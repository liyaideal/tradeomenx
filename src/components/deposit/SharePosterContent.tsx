import { forwardRef } from 'react';
import { SharePosterLayout } from '@/components/share/SharePosterLayout';
import { posterColors } from '@/lib/posterStyles';
import { TokenConfig } from '@/types/deposit';

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

/**
 * SharePosterContent - Deposit address share poster
 * 
 * Uses the standard SharePosterLayout with neutral theme for deposit addresses.
 * Shows token info, formatted address, and network warning.
 */
export const SharePosterContent = forwardRef<HTMLDivElement, SharePosterContentProps>(
  ({ address, token, referralCode = 'OMENX2025' }, ref) => {
    const { hasPrefix, chunks } = formatAddressDisplay(address);

    const warningContent = (
      <p style={{
        color: posterColors.warning,
        fontSize: '12px',
        textAlign: 'center',
        lineHeight: '1.5',
        margin: 0,
      }}>
        ⚠️ <span style={{ fontWeight: 600 }}>Important:</span> Only send {token.symbol} on the{' '}
        <span style={{ fontWeight: 600 }}>{token.network}</span> network
      </p>
    );

    return (
      <SharePosterLayout
        ref={ref}
        theme="neutral"
        qrValue={address}
        referralCode={referralCode}
        ctaText="Scan QR to deposit"
        qrLabel="Deposit Address"
        warning={warningContent}
        style={{ padding: '28px' }}
      >
        {/* Token Badge */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            background: posterColors.cardBg,
            borderRadius: '9999px',
            border: `1px solid ${posterColors.border}`,
          }}>
            <span style={{ fontSize: '24px' }}>{token.icon}</span>
            <span style={{ color: posterColors.textPrimary, fontWeight: 600, fontSize: '15px' }}>
              {token.symbol}
            </span>
            <span style={{ color: posterColors.textSecondary, fontSize: '13px' }}>on</span>
            <span style={{ color: posterColors.textPrimary, fontWeight: 500, fontSize: '14px' }}>
              {token.network}
            </span>
          </div>
        </div>

        {/* Deposit Address */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ 
            color: posterColors.textSecondary, 
            fontSize: '12px', 
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Deposit Address
          </p>
          <div style={{
            padding: '16px',
            background: posterColors.cardBg,
            borderRadius: '12px',
            border: `1px solid ${posterColors.border}`,
            fontFamily: 'monospace',
            fontSize: '13px',
            lineHeight: '1.7',
            wordBreak: 'break-all',
          }}>
            <span style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px 8px' }}>
              {hasPrefix && (
                <span>
                  <span style={{ color: '#a78bfa' }}>0</span>
                  <span style={{ color: posterColors.textPrimary }}>x</span>
                </span>
              )}
              {chunks.map((chunk, chunkIndex) => (
                <span key={chunkIndex}>
                  {chunk.map((item, charIndex) => (
                    <span 
                      key={charIndex}
                      style={{ color: item.isDigit ? '#a78bfa' : posterColors.textPrimary }}
                    >
                      {item.char}
                    </span>
                  ))}
                </span>
              ))}
            </span>
          </div>
        </div>
      </SharePosterLayout>
    );
  }
);

SharePosterContent.displayName = 'SharePosterContent';
