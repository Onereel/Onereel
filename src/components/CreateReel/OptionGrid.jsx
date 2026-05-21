export function OptionGrid({ options, selectedValue, onSelect, columns = 3 }) {
  const gridClass =
    columns === 2
      ? "grid-cols-2"
      : columns === 3
        ? "grid-cols-2 md:grid-cols-3"
        : "grid-cols-3";

  return (
    <div className={`grid ${gridClass} gap-3`}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(option.value)}
          className={`p-4 rounded-xl border-2 transition-all ${
            selectedValue === option.value
              ? "border-[#1DA1F2] bg-[#E8F5FE]"
              : "border-[#E5E7EB] hover:border-[#1DA1F2]"
          }`}
        >
          {option.emoji && <div className="text-2xl mb-1">{option.emoji}</div>}
          <div className="text-sm font-semibold text-[#111418]">
            {option.label}
          </div>
        </button>
      ))}
    </div>
  );
}
