import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { XIcon } from "@/components/icons/XIcon";
import { TelegramIcon } from "@/components/icons/TelegramIcon";

export const HedgeFooter = () => {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-10 md:flex-row md:justify-between md:px-6">
        <div className="flex items-center gap-3">
          <Logo size="md" />
          <span className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} OmenX
          </span>
        </div>

        <div className="flex items-center gap-5">
          <a
            href="https://x.com/omenxfi"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <XIcon className="h-4 w-4" />
          </a>
          <a
            href="https://t.me/omenxfi"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <TelegramIcon className="h-4 w-4" />
          </a>
          <Link
            to="/terms-of-service"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Terms
          </Link>
          <Link
            to="/privacy-policy"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
};
