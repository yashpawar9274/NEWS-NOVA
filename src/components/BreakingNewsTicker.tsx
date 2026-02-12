import { AlertTriangle } from "lucide-react";
import { Article } from "@/data/sampleArticles";

interface BreakingNewsTickerProps {
  articles: Article[];
}

export function BreakingNewsTicker({ articles }: BreakingNewsTickerProps) {
  const breaking = articles.filter((a) => a.isBreaking);
  if (breaking.length === 0) return null;

  return (
    <div className="bg-accent text-accent-foreground overflow-hidden">
      <div className="container flex items-center gap-3 py-2">
        <div className="flex items-center gap-1.5 shrink-0 font-headline font-bold text-sm uppercase tracking-wide">
          <AlertTriangle className="h-4 w-4" />
          Breaking
        </div>
        <div className="overflow-hidden flex-1">
          <div className="animate-ticker whitespace-nowrap flex gap-12">
            {breaking.map((a) => (
              <span key={a.id} className="text-sm font-medium">
                {a.title}
              </span>
            ))}
            {breaking.map((a) => (
              <span key={a.id + "-dup"} className="text-sm font-medium">
                {a.title}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
