import { ShareModal } from '@/components/ShareModal';
import { ReferralSharePoster } from './ReferralSharePoster';

interface ReferralShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  referralCode: string;
  referralLink: string;
  username?: string;
}

/**
 * ReferralShareModal - Modal for sharing referral invitation
 * 
 * Uses the benefits-focused ReferralSharePoster design.
 * Emphasizes new user rewards rather than inviter's stats.
 */
export const ReferralShareModal = ({
  open,
  onOpenChange,
  referralCode,
  referralLink,
  username,
}: ReferralShareModalProps) => {
  const shareText = `Join me on OMENX and get 100 bonus points! Use my code: ${referralCode}`;

  return (
    <ShareModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Share Invitation"
      subtitle="Invite friends and earn rewards together"
      shareText={shareText}
      shareUrl={referralLink}
      fileName={`omenx-invite-${referralCode.toLowerCase()}`}
      isDataReady={true}
    >
      <ReferralSharePoster
        referralCode={referralCode}
        inviterName={username}
      />
    </ShareModal>
  );
};
