import { useState, useRef } from 'react';
import { Download, Share2, Loader2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TokenConfig } from '@/types/deposit';
import { toast } from 'sonner';
import { SharePosterContent } from './SharePosterContent';

interface SharePosterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address: string;
  token: TokenConfig;
}

export const SharePosterDialog = ({
  open,
  onOpenChange,
  address,
  token,
}: SharePosterDialogProps) => {
  const posterRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = async (): Promise<string | null> => {
    if (!posterRef.current) return null;
    
    try {
      setIsGenerating(true);
      // Generate with higher quality
      const dataUrl = await toPng(posterRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      });
      return dataUrl;
    } catch (error) {
      console.error('Failed to generate image:', error);
      toast.error('Failed to generate image');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    const dataUrl = await generateImage();
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.download = `${token.symbol}-deposit-address.png`;
    link.href = dataUrl;
    link.click();
    toast.success('Image saved');
  };

  const handleShare = async () => {
    const dataUrl = await generateImage();
    if (!dataUrl) return;

    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], `${token.symbol}-deposit-address.png`, { type: 'image/png' });

    if (navigator.share && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: `${token.symbol} Deposit Address`,
          text: `Deposit ${token.symbol} to this address on ${token.network}`,
          files: [file],
        });
      } catch (err) {
        // User cancelled or share failed, fallback to download
        if ((err as Error).name !== 'AbortError') {
          handleDownload();
        }
      }
    } else {
      // Fallback to download
      handleDownload();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0" hideCloseButton>
        <DialogHeader className="px-6 py-4 border-b border-border/50">
          <DialogTitle className="text-center">Share Deposit Address</DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          {/* Poster Preview */}
          <div className="flex justify-center overflow-hidden rounded-xl">
            <div className="transform scale-[0.85] origin-top">
              <SharePosterContent
                ref={posterRef}
                address={address}
                token={token}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleDownload}
              variant="secondary"
              className="flex-1 h-10 rounded-lg"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Save Image
            </Button>
            <Button
              onClick={handleShare}
              className="flex-1 h-10 rounded-lg bg-primary hover:bg-primary-hover"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Share2 className="w-4 h-4 mr-2" />
              )}
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
