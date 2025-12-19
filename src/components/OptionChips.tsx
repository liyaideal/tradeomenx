import { useState } from "react";

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
          className={`option-chip flex-shrink-0 min-w-[140px] text-center transition-all duration-200 active:scale-95 ${
            selectedId === option.id
              ? "option-chip-active"
              : "option-chip-inactive"
          }`}
        >
          <div className="font-medium text-sm">{option.label}</div>
          <div className={`font-mono text-base mt-1 ${
            selectedId === option.id ? "text-trading-purple" : "text-muted-foreground"
          }`}>
            ${option.price}
          </div>
        </button>
      ))}
    </div>
  );
};
