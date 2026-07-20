import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { ApiKey } from "@/hooks/useApiKeys";

export const RevokeDialog = ({
  target,
  onClose,
  onConfirm,
  pending,
}: {
  target: ApiKey | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
  pending: boolean;
}) => {
  return (
    <Dialog open={!!target} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Revoke API key</DialogTitle>
          <DialogDescription>
            {target && (
              <>
                Revoking <span className="font-medium text-foreground">{target.label}</span> immediately disables all
                requests using this key. This action cannot be undone.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button
            className="bg-trading-red text-white hover:bg-trading-red/90"
            disabled={pending}
            onClick={() => target && onConfirm(target.id)}
          >
            {pending ? "Revoking…" : "Revoke key"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
