import { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { TokenConfig } from '@/types/deposit';

interface SharePosterContentProps {
  address: string;
  token: TokenConfig;
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

export const SharePosterContent = forwardRef<HTMLDivElement, SharePosterContentProps>(
  ({ address, token }, ref) => {
    const { hasPrefix, chunks } = formatAddressDisplay(address);

    return (
      <div
        ref={ref}
        className="w-[400px] bg-gradient-to-b from-[#1a1a2e] to-[#16162a] p-8 rounded-2xl"
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        {/* Header with Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-bold text-lg">Ω</span>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">OmenX</span>
        </div>

        {/* Token Info */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full">
            <span className="text-2xl">{token.icon}</span>
            <span className="text-white font-semibold">{token.symbol}</span>
            <span className="text-white/60">on</span>
            <span className="text-white font-medium">{token.network}</span>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-white rounded-xl">
            <QRCodeSVG 
              value={address} 
              size={180}
              level="H"
              includeMargin={false}
            />
          </div>
        </div>

        {/* Address */}
        <div className="text-center mb-6">
          <p className="text-white/50 text-sm mb-2">Deposit Address</p>
          <div 
            className="p-4 bg-white/5 rounded-xl font-mono text-sm leading-relaxed"
            style={{ wordBreak: 'break-all' }}
          >
            <span className="flex flex-wrap justify-center gap-x-2 gap-y-1">
              {hasPrefix && (
                <span>
                  <span style={{ color: '#a78bfa' }}>0</span>
                  <span style={{ color: '#ffffff' }}>x</span>
                </span>
              )}
              {chunks.map((chunk, chunkIndex) => (
                <span key={chunkIndex}>
                  {chunk.map((item, charIndex) => (
                    <span 
                      key={charIndex}
                      style={{ color: item.isDigit ? '#a78bfa' : '#ffffff' }}
                    >
                      {item.char}
                    </span>
                  ))}
                </span>
              ))}
            </span>
          </div>
        </div>

        {/* Warning */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl mb-4">
          <p className="text-amber-400 text-xs text-center leading-relaxed">
            <span className="font-semibold">⚠️ Important:</span> Only send {token.symbol} on the{' '}
            <span className="font-semibold">{token.network}</span> network
          </p>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-white/30 text-xs">
            Scan QR code or copy address to deposit
          </p>
        </div>
      </div>
    );
  }
);

SharePosterContent.displayName = 'SharePosterContent';
