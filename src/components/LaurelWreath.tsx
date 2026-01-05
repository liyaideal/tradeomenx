interface LaurelWreathProps {
  className?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
}

export const LaurelWreath = ({ className = "", color = "currentColor", size = "md" }: LaurelWreathProps) => {
  const sizeMap = {
    sm: { width: 60, height: 40 },
    md: { width: 80, height: 50 },
    lg: { width: 120, height: 70 },
  };

  const { width, height } = sizeMap[size];

  return (
    <svg
      viewBox="0 0 100 60"
      width={width}
      height={height}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left branch */}
      <g fill={color} opacity="0.9">
        {/* Left leaves */}
        <ellipse cx="15" cy="50" rx="4" ry="8" transform="rotate(-30 15 50)" />
        <ellipse cx="18" cy="42" rx="4" ry="8" transform="rotate(-20 18 42)" />
        <ellipse cx="22" cy="34" rx="4" ry="8" transform="rotate(-10 22 34)" />
        <ellipse cx="27" cy="27" rx="4" ry="8" transform="rotate(0 27 27)" />
        <ellipse cx="33" cy="21" rx="4" ry="8" transform="rotate(10 33 21)" />
        <ellipse cx="40" cy="16" rx="4" ry="8" transform="rotate(20 40 16)" />
        <ellipse cx="47" cy="13" rx="3" ry="6" transform="rotate(30 47 13)" />
      </g>

      {/* Right branch (mirrored) */}
      <g fill={color} opacity="0.9">
        <ellipse cx="85" cy="50" rx="4" ry="8" transform="rotate(30 85 50)" />
        <ellipse cx="82" cy="42" rx="4" ry="8" transform="rotate(20 82 42)" />
        <ellipse cx="78" cy="34" rx="4" ry="8" transform="rotate(10 78 34)" />
        <ellipse cx="73" cy="27" rx="4" ry="8" transform="rotate(0 73 27)" />
        <ellipse cx="67" cy="21" rx="4" ry="8" transform="rotate(-10 67 21)" />
        <ellipse cx="60" cy="16" rx="4" ry="8" transform="rotate(-20 60 16)" />
        <ellipse cx="53" cy="13" rx="3" ry="6" transform="rotate(-30 53 13)" />
      </g>
    </svg>
  );
};

export const LaurelBadge = ({ rank, className = "" }: { rank: number; className?: string }) => {
  const getColors = () => {
    switch (rank) {
      case 1:
        return { leaf: "#FFD700", badge: "from-yellow-400 via-yellow-500 to-amber-600", text: "#1a1a2e" };
      case 2:
        return { leaf: "#C0C0C0", badge: "from-slate-300 via-slate-400 to-slate-500", text: "#1a1a2e" };
      case 3:
        return { leaf: "#CD7F32", badge: "from-amber-600 via-amber-700 to-orange-800", text: "#fff" };
      default:
        return { leaf: "#8B8B8B", badge: "from-slate-500 to-slate-600", text: "#fff" };
    }
  };

  const { leaf, badge, text } = getColors();
  const suffix = rank === 1 ? "st" : rank === 2 ? "nd" : rank === 3 ? "rd" : "th";

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <LaurelWreath color={leaf} size="md" />
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-baseline gap-0.5 font-bold`}
        style={{ color: text }}
      >
        <span className="text-lg">{rank}</span>
        <span className="text-xs">{suffix}</span>
      </div>
    </div>
  );
};

export const SmallLaurelBadge = ({ rank }: { rank: number }) => {
  const getColors = () => {
    switch (rank) {
      case 1:
        return "text-yellow-400";
      case 2:
        return "text-slate-400";
      case 3:
        return "text-amber-600";
      case 4:
      case 5:
        return "text-primary/60";
      default:
        return "text-muted-foreground/40";
    }
  };

  const suffix = rank === 1 ? "st" : rank === 2 ? "nd" : rank === 3 ? "rd" : "th";

  return (
    <div className="relative flex items-center justify-center w-12 h-10">
      {rank <= 5 && (
        <LaurelWreath color="currentColor" size="sm" className={getColors()} />
      )}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-baseline gap-0.5 font-bold ${
        rank <= 3 ? getColors() : "text-muted-foreground"
      }`}>
        <span className="text-sm">{rank}</span>
        <span className="text-[10px]">{suffix}</span>
      </div>
    </div>
  );
};
