import { Badge } from "@/components/ui/badge";
import { Clock, Eye } from "lucide-react";
import { Article } from "@/data/sampleArticles";

interface HeroArticleProps {
  article: Article;
  onClick: (id: string) => void;
}

export function HeroArticle({ article, onClick }: HeroArticleProps) {
  return (
    <div
      className="relative cursor-pointer group rounded-xl overflow-hidden aspect-[16/9] md:aspect-[21/9]"
      onClick={() => onClick(article.id)}
    >
      <img
        src={article.imageUrl}
        alt={article.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
        <div className="flex items-center gap-2 mb-3">
          {article.isBreaking && (
            <Badge className="bg-breaking text-breaking-foreground font-headline text-xs uppercase">
              Breaking
            </Badge>
          )}
          <Badge variant="secondary" className="bg-primary/80 text-primary-foreground">
            {article.category}
          </Badge>
        </div>
        <h2 className="font-headline text-xl md:text-3xl font-bold text-white leading-tight mb-2">
          {article.title}
        </h2>
        <p className="text-white/80 text-sm md:text-base line-clamp-2 mb-3 max-w-2xl">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-4 text-white/60 text-xs">
          <span>{article.author}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {article.readTime} min</span>
          <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {article.views.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
