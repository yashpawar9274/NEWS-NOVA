import { ArrowLeft, Clock, Eye, Heart, Bookmark, BookmarkCheck, Share2, Minus, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Article, sampleArticles } from "@/data/sampleArticles";
import { ArticleCard } from "./ArticleCard";
import { useState } from "react";

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onArticleClick: (id: string) => void;
}

export function ArticleView({ article, onBack, isBookmarked, onToggleBookmark, onArticleClick }: ArticleViewProps) {
  const [fontSize, setFontSize] = useState(16);
  const [liked, setLiked] = useState(false);

  const related = sampleArticles
    .filter((a) => a.category === article.category && a.id !== article.id)
    .slice(0, 3);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: article.title, text: article.excerpt });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      <div className="container max-w-3xl py-4">
        <Button variant="ghost" onClick={onBack} className="mb-4 -ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        <div className="rounded-xl overflow-hidden aspect-video mb-6">
          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
        </div>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {article.isBreaking && (
            <Badge className="bg-breaking text-breaking-foreground font-headline text-xs uppercase">Breaking</Badge>
          )}
          <Badge variant="secondary">{article.category}</Badge>
          <Badge variant="outline">{article.language === "hi" ? "हिंदी" : "English"}</Badge>
        </div>

        <h1 className="font-headline text-2xl md:text-4xl font-bold leading-tight mb-4">
          {article.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 flex-wrap">
          <span className="font-medium text-foreground">{article.author}</span>
          <span>{new Date(article.publishDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {article.readTime} min read</span>
          <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {article.views.toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-2 mb-6 border-y py-3">
          <Button variant={liked ? "default" : "outline"} size="sm" onClick={() => setLiked(!liked)}>
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} /> {article.likes + (liked ? 1 : 0)}
          </Button>
          <Button variant="outline" size="sm" onClick={() => onToggleBookmark(article.id)}>
            {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            {isBookmarked ? "Saved" : "Save"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <div className="ml-auto flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setFontSize((s) => Math.max(12, s - 2))}>
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-xs text-muted-foreground w-6 text-center">{fontSize}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setFontSize((s) => Math.min(24, s + 2))}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <article
          className="prose prose-neutral dark:prose-invert max-w-none mb-12"
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
        >
          {article.content.split("\n").map((p, i) =>
            p.trim() ? <p key={i}>{p}</p> : null
          )}
        </article>

        {related.length > 0 && (
          <section>
            <h3 className="font-headline text-xl font-bold mb-4">Related Articles</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <ArticleCard
                  key={a.id}
                  article={a}
                  onClick={onArticleClick}
                  isBookmarked={false}
                  onToggleBookmark={() => {}}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
