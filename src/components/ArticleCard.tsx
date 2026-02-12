import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Eye, Bookmark, BookmarkCheck } from "lucide-react";
import { Article } from "@/data/sampleArticles";
import { Button } from "@/components/ui/button";

interface ArticleCardProps {
  article: Article;
  onClick: (id: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}

export function ArticleCard({ article, onClick, isBookmarked, onToggleBookmark }: ArticleCardProps) {
  return (
    <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50">
      <div className="relative aspect-video overflow-hidden" onClick={() => onClick(article.id)}>
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {article.isBreaking && (
          <Badge className="absolute top-2 left-2 bg-breaking text-breaking-foreground font-headline text-xs uppercase">
            Breaking
          </Badge>
        )}
        <Badge className="absolute top-2 right-2 bg-primary/80 text-primary-foreground text-xs">
          {article.category}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3
          className="font-headline font-semibold text-base leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors"
          onClick={() => onClick(article.id)}
        >
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>{article.author}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {article.readTime}m</span>
            <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {article.views.toLocaleString()}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={(e) => { e.stopPropagation(); onToggleBookmark(article.id); }}
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-4 w-4 text-primary" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
