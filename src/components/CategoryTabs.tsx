import { categories, type Category } from "@/data/sampleArticles";

interface CategoryTabsProps {
  selected: Category | "All";
  onSelect: (cat: Category | "All") => void;
}

export function CategoryTabs({ selected, onSelect }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
      <button
        onClick={() => onSelect("All")}
        className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selected === "All"
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected === cat
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
