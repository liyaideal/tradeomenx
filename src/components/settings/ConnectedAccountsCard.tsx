import { useState } from "react";
import { Plus, Loader2, X, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useConnectedAccounts } from "@/hooks/useConnectedAccounts";
import { useUserProfile } from "@/hooks/useUserProfile";
import { buildSignMessage, EIP712_DOMAIN, EIP712_TYPES } from "@/lib/eip712";
import { toast } from "sonner";
import { BrowserProvider } from "ethers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  MobileDrawer,
  MobileDrawerSection,
  MobileDrawerActions,
} from "@/components/ui/mobile-drawer";
import { useIsMobile } from "@/hooks/use-mobile";

const PLATFORMS = [
  {
    id: "polymarket",
    name: "Polymarket",
    logo: "/platform-logos/polymarket.png",
    description: "Connect your Polymarket wallet to receive counter-position airdrops",
    status: "available" as const,
  },
  {
    id: "kalshi",
    name: "Kalshi",
    logo: "/platform-logos/kalshi.png",
    description: "Kalshi integration coming soon",
    status: "coming_soon" as const,
  },
];

export const ConnectedAccountsCard = () => {
  const isMobile = useIsMobile();
  const { user } = useUserProfile();
  const {
    activeAccounts,
    isLoading,
    verifyAndConnect,
    isVerifying,
    disconnect,
    isDisconnecting,
    isDemoMode,
  } = useConnectedAccounts();

  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [connectionStep, setConnectionStep] = useState<"input" | "signing" | "verifying">("input");

  const resetDialog = () => {
    setWalletAddress("");
    setSelectedPlatform(null);
    setConnectionStep("input");
  };

  const handleOpenConnect = (platformId: string) => {
    setSelectedPlatform(platformId);
    setConnectDialogOpen(true);
  };

  const handleCloseDialog = (open: boolean) => {
    if (!open) resetDialog();
    setConnectDialogOpen(open);
  };

  const isValidAddress = (addr: string) => /^0x[a-fA-F0-9]{40}$/.test(addr);

  const handleConnectWallet = async () => {
    if (!isValidAddress(walletAddress)) {
      toast.error("Please enter a valid Ethereum address (0x...)");
      return;
    }
    if (!user || !selectedPlatform) return;

    try {
      // Step 1: Signing
      setConnectionStep("signing");

      if (isDemoMode) {
        // Demo: simulate wallet signature delay
        await new Promise((r) => setTimeout(r, 1500));

        // Step 2: Verifying
        setConnectionStep("verifying");

        const demoMessage = {
          platform: selectedPlatform,
          account: walletAddress.toLowerCase(),
          timestamp: Math.floor(Date.now() / 1000).toString(),
          nonce: crypto.randomUUID().slice(0, 8),
        };

        await verifyAndConnect({
          walletAddress: walletAddress.toLowerCase(),
          signature: "0xdemo_signature_" + Date.now(),
          message: demoMessage,
          platform: selectedPlatform,
        });

        toast.success("Wallet connected and verified successfully!");
        handleCloseDialog(false);
      } else {
        // Production: real Web3 flow
        const ethereum = (window as any).ethereum;
        if (!ethereum) {
          toast.error("No Web3 wallet detected. Please install MetaMask or use WalletConnect.");
          setConnectionStep("input");
          return;
        }

        await ethereum.request({ method: "eth_requestAccounts" });

        const provider = new BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const signerAddress = await signer.getAddress();

        if (signerAddress.toLowerCase() !== walletAddress.toLowerCase()) {
          toast.error(
            `Connected wallet (${signerAddress.slice(0, 6)}...${signerAddress.slice(-4)}) does not match the entered address. Please switch to the correct wallet.`
          );
          setConnectionStep("input");
          return;
        }

        const message = buildSignMessage(selectedPlatform, user.id);
        const signature = await signer.signTypedData(
          EIP712_DOMAIN,
          EIP712_TYPES,
          {
            ...message,
            timestamp: BigInt(message.timestamp),
          }
        );

        setConnectionStep("verifying");

        await verifyAndConnect({
          walletAddress: walletAddress.toLowerCase(),
          signature,
          message,
          platform: selectedPlatform,
        });

        toast.success("Wallet connected and verified successfully!");
        handleCloseDialog(false);
      }
    } catch (error: any) {
      console.error("Wallet connection error:", error);
      if (error.code === 4001) {
        toast.error("Signature request was rejected");
      } else {
        toast.error(error.message || "Failed to connect wallet");
      }
      setConnectionStep("input");
    }
  };

  const handleDisconnect = async (accountId: string) => {
    try {
      await disconnect(accountId);
      toast.success("Account disconnected");
    } catch {
      toast.error("Failed to disconnect account");
    }
  };

  // Find active account for each platform
  const getAccountForPlatform = (platformId: string) =>
    activeAccounts.find((a) => a.platform === platformId);

  const connectFormContent = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          {PLATFORMS.find((p) => p.id === selectedPlatform)?.name} Wallet Address
        </label>
        <Input
          placeholder="0x..."
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          className="font-mono h-12"
          disabled={connectionStep === "signing"}
        />
        <p className="text-xs text-muted-foreground">
          Enter the wallet address you use on {PLATFORMS.find((p) => p.id === selectedPlatform)?.name}.
          You'll be asked to sign a message to verify ownership.
        </p>
      </div>

      {connectionStep === "signing" && (
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <div>
            <p className="text-sm font-medium">Waiting for wallet signature...</p>
            <p className="text-xs text-muted-foreground">
              Please confirm the signature request in your wallet
            </p>
          </div>
        </div>
      )}

      {connectionStep === "verifying" && (
        <div className="bg-trading-green/10 border border-trading-green/20 rounded-xl p-4 flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-trading-green" />
          <div>
            <p className="text-sm font-medium">Verifying on-chain...</p>
            <p className="text-xs text-muted-foreground">
              Confirming wallet ownership and linking account
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // Mobile: use MobileDrawer; Desktop: use Dialog
  const renderConnectModal = () => {
    if (isMobile) {
      return (
        <MobileDrawer
          open={connectDialogOpen}
          onOpenChange={handleCloseDialog}
          title={`Connect ${PLATFORMS.find((p) => p.id === selectedPlatform)?.name || ""}`}
        >
          {connectFormContent}
          <MobileDrawerActions>
            <Button
              onClick={handleConnectWallet}
              disabled={!isValidAddress(walletAddress) || isVerifying || connectionStep === "signing"}
              className="w-full btn-primary h-12"
            >
              {connectionStep === "signing" ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...</>
              ) : (
                <><Wallet className="w-4 h-4 mr-2" /> Sign & Connect</>
              )}
            </Button>
          </MobileDrawerActions>
        </MobileDrawer>
      );
    }

    return (
      <Dialog open={connectDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Connect {PLATFORMS.find((p) => p.id === selectedPlatform)?.name}
            </DialogTitle>
            <DialogDescription>
              Link your external wallet to receive counter-position airdrops
            </DialogDescription>
          </DialogHeader>
          {connectFormContent}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => handleCloseDialog(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleConnectWallet}
              disabled={!isValidAddress(walletAddress) || isVerifying || connectionStep === "signing"}
              className="flex-1 btn-primary"
            >
              {connectionStep === "signing" ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...</>
              ) : (
                <><Wallet className="w-4 h-4 mr-2" /> Sign & Connect</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      <div className="trading-card p-4 md:p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold mb-1">Connected Accounts</h3>
            <p className="text-xs text-muted-foreground">
              Link external prediction market wallets to receive H2E airdrops
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {PLATFORMS.map((platform) => {
            const account = getAccountForPlatform(platform.id);
            const isComingSoon = platform.status === "coming_soon";

            return (
              <div
                key={platform.id}
                className="bg-muted/30 rounded-xl p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center overflow-hidden">
                  <img src={platform.logo} alt={platform.name} className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{platform.name}</span>
                    {isComingSoon && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        Coming Soon
                      </Badge>
                    )}
                    {account && (
                      <Badge className="bg-trading-green/20 text-trading-green border-trading-green/30 text-[10px] px-1.5 py-0">
                        Connected
                      </Badge>
                    )}
                  </div>
                  {account ? (
                    <p className="text-sm font-mono text-muted-foreground truncate mt-0.5">
                      {account.displayAddress}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {platform.description}
                    </p>
                  )}
                </div>
                <div className="shrink-0">
                  {account ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDisconnect(account.id)}
                      disabled={isDisconnecting}
                      className="text-destructive hover:text-destructive h-8"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  ) : !isComingSoon ? (
                    <Button
                      size="sm"
                      onClick={() => handleOpenConnect(platform.id)}
                      className="btn-primary h-8 px-3"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Connect
                    </Button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {renderConnectModal()}
    </>
  );
};
