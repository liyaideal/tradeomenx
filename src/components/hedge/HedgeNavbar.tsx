import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/useUserProfile";

export const HedgeNavbar = () => {
  const { user } = useUserProfile();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <Logo size="md" />
        </Link>

        <nav className="flex items-center gap-2 md:gap-4">
          <Link
            to="/events"
            className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            Events
          </Link>
          {user ? (
            <Button asChild size="sm" variant="outline" className="h-8">
              <Link to="/portfolio/airdrops">My Airdrops</Link>
            </Button>
          ) : (
            <Button asChild size="sm" variant="outline" className="h-8">
              <Link to="/events">Sign In</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};
