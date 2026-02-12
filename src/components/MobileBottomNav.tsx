import { Home, LayoutGrid, TrendingUp, Bookmark, Search } from "lucide-react";

type Tab = "home" | "categories" | "trending" | "saved" | "search";

interface MobileBottomNavProps {
  active: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; icon: React.ElementType; label: string }[] = [
  { id: "home", icon: Home, label: "Home" },
  { id: "categories", icon: LayoutGrid, label: "Categories" },
  { id: "trending", icon: TrendingUp, label: "Trending" },
  { id: "saved", icon: Bookmark, label: "Saved" },
  { id: "search", icon: Search, label: "Search" },
];

export function MobileBottomNav({ active, onTabChange }: MobileBottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t md:hidden">
      <div className="flex items-center justify-around py-2">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
              active === id ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
