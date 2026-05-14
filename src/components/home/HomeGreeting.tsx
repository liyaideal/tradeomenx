import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";

interface HomeGreetingProps {
  onSignIn: () => void;
}

/**
 * Sportsbook-style greeting block: "Hello," + uppercase display name + a "+" action.
 *
 * - Guest: subtitle invites picking a market; "+" opens AuthSheet.
 * - Authed: uses profile.username (uppercase, underscores stripped); "+" jumps to /deposit.
 */
export const HomeGreeting = ({ onSignIn }: HomeGreetingProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { username } = useUserProfile();

  const isAuthed = !!user;
  const displayName = isAuthed
    ? (username || user?.email?.split("@")[0] || "trader").replace(/_/g, " ")
    : "there";

  const handlePlus = () => {
    if (isAuthed) navigate("/deposit");
    else onSignIn();
  };

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-[15px] leading-tight text-muted-foreground">Hello,</p>
        <h1 className="mt-0.5 truncate text-[26px] font-extrabold uppercase leading-[1.05] tracking-[-0.01em] text-foreground">
          {displayName}
        </h1>
      </div>
      <button
        onClick={handlePlus}
        aria-label={isAuthed ? "Deposit" : "Sign in"}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform active:scale-95 hover:opacity-90"
      >
        <Plus className="h-5 w-5" strokeWidth={2.75} />
      </button>
    </div>
  );
};
