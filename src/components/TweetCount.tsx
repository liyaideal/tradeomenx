interface TweetCountProps {
  count: number;
}

export function TweetCount({ count }: TweetCountProps) {
  return (
    <div className="bg-card border border-border rounded-lg px-4 py-3">
      <div className="flex items-center gap-2 text-xs text-orange-500 font-medium uppercase tracking-wider mb-1">
        <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
        Tweet Count
      </div>
      <div className="text-2xl font-bold text-foreground">{count.toLocaleString()}</div>
    </div>
  );
}
