interface Option {
  id: string;
  label: string;
  price: string;
}

interface OptionChipsProps {
  options: Option[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const OptionChips = ({ options, selectedId, onSelect }: OptionChipsProps) => {
  return (
    <div className="flex gap-3 px-4 py-3 overflow-x-auto scrollbar-hide">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.id)}
          className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-center transition-all duration-200 active:scale-95 ${
            selectedId === option.id
              ? "bg-trading-purple/15 border border-trading-purple"
              : "bg-muted/50 border border-transparent"
          }`}
        >
          <div className={`font-medium text-sm ${selectedId === option.id ? "text-foreground" : "text-muted-foreground"}`}>
            {option.label}
          </div>
          <div className={`font-mono text-sm mt-0.5 ${
            selectedId === option.id ? "text-trading-purple" : "text-muted-foreground"
          }`}>
            ${option.price}
          </div>
        </button>
      ))}
    </div>
  );
};