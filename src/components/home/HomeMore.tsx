import { GraduationCap, Users } from "lucide-react";
import { toast } from "sonner";

export const HomeMore = () => {
  return (
    <section aria-label="More">
      <h3 className="font-semibold text-foreground mb-3">More</h3>
      <div className="grid grid-cols-2 gap-3">
        <button
          className="trading-card p-4 flex flex-col items-center gap-2 hover:bg-card-hover transition-colors"
          onClick={() => toast("Learning Center coming soon!")}
        >
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">Learning Center</span>
        </button>
        <button
          className="trading-card p-4 flex flex-col items-center gap-2 hover:bg-card-hover transition-colors"
          onClick={() => toast("Referral program coming soon!")}
        >
          <div className="w-10 h-10 rounded-full bg-trading-green/20 flex items-center justify-center">
            <Users className="h-5 w-5 text-trading-green" />
          </div>
          <span className="text-sm font-medium text-foreground">Invite friends</span>
        </button>
      </div>
    </section>
  );
};
