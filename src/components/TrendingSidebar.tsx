import { TrendingUp, Eye } from "lucide-react";
import { Article } from "@/data/sampleArticles";

interface TrendingSidebarProps {
  articles: Article[];
  onArticleClick: (id: string) => void;
}

export function TrendingSidebar({ articles, onArticleClick }: TrendingSidebarProps) {
  const trending = [...articles].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div className="bg-card rounded-xl border p-5">
      <h3 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-accent" />
        Trending Now
      </h3>
      <div className="space-y-4">
        {trending.map((article, i) => (
          <div
            key={article.id}
            className="flex gap-3 cursor-pointer group"
            onClick={() => onArticleClick(article.id)}
          >
            <span className="font-headline text-2xl font-bold text-muted-foreground/40 shrink-0 w-8">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <h4 className="font-medium text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {article.title}
              </h4>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{article.views.toLocaleString()}</span>
                <span>·</span>
                <span>{article.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
