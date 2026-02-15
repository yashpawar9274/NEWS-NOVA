import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { BreakingNewsTicker } from "@/components/BreakingNewsTicker";
import { HeroArticle } from "@/components/HeroArticle";
import { CategoryTabs } from "@/components/CategoryTabs";
import { ArticleCard } from "@/components/ArticleCard";
import { TrendingSidebar } from "@/components/TrendingSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ArticleView } from "@/components/ArticleView";
import { useTheme } from "@/hooks/useTheme";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useArticles, useIncrementViews, type DbArticle } from "@/hooks/useArticles";
import type { Category } from "@/data/sampleArticles";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { isDark, toggle: toggleTheme } = useTheme();
  const { isBookmarked, toggle: toggleBookmark, bookmarks } = useBookmarks();
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeArticle, setActiveArticle] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"home" | "categories" | "trending" | "saved" | "search">("home");

  const { data: articles = [], isLoading } = useArticles();
  const incrementViews = useIncrementViews();

  // Map DB articles to component-compatible shape
  const mappedArticles = useMemo(() => articles.map((a): DbArticle & { publishDate: string; readTime: number; imageUrl: string } => ({
    ...a,
    publishDate: a.publish_date,
    readTime: a.read_time,
    imageUrl: a.image_url || "https://images.unsplash.com/photo-1504711434969-e33886168d3c?w=800",
  })), [articles]);

  const handleArticleClick = (id: string) => {
    setActiveArticle(id);
    incrementViews.mutate(id);
  };

  const featuredArticle = mappedArticles.find((a) => a.is_featured && a.is_breaking) || mappedArticles.find((a) => a.is_featured);

  const filtered = useMemo(() => {
    let arts = mappedArticles;

    if (mobileTab === "saved") {
      arts = arts.filter((a) => bookmarks.includes(a.id));
    }
    if (mobileTab === "trending") {
      arts = [...arts].sort((a, b) => b.views - a.views);
    }
    if (selectedCategory !== "All") {
      arts = arts.filter((a) => a.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      arts = arts.filter(
        (a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.author.toLowerCase().includes(q)
      );
    }
    return arts;
  }, [mappedArticles, selectedCategory, searchQuery, mobileTab, bookmarks]);

  const openArticle = mappedArticles.find((a) => a.id === activeArticle);

  if (openArticle) {
    return (
      <>
        <Navbar isDark={isDark} onToggleTheme={toggleTheme} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <ArticleView
          article={openArticle as any}
          onBack={() => setActiveArticle(null)}
          isBookmarked={isBookmarked(openArticle.id)}
          onToggleBookmark={toggleBookmark}
          onArticleClick={handleArticleClick}
          allArticles={mappedArticles as any[]}
        />
        <MobileBottomNav active={mobileTab} onTabChange={(t) => { setMobileTab(t); setActiveArticle(null); }} />
      </>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navbar isDark={isDark} onToggleTheme={toggleTheme} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <BreakingNewsTicker articles={mappedArticles as any[]} />

      <main className="container py-6">
        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && (
          <>
            {featuredArticle && mobileTab === "home" && !searchQuery && selectedCategory === "All" && (
              <div className="mb-8">
                <HeroArticle article={featuredArticle as any} onClick={handleArticleClick} />
              </div>
            )}

            <div className="mb-6">
              <CategoryTabs selected={selectedCategory} onSelect={setSelectedCategory} />
            </div>

            <div className="flex gap-8">
              <div className="flex-1 min-w-0">
                {mobileTab === "saved" && filtered.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <p className="font-headline text-lg">No saved articles yet</p>
                    <p className="text-sm mt-1">Bookmark articles to read them later</p>
                  </div>
                )}
                {filtered.length === 0 && mobileTab !== "saved" && !isLoading && (
                  <div className="text-center py-16 text-muted-foreground">
                    <p className="font-headline text-lg">No articles found</p>
                    <p className="text-sm mt-1">Add articles from the <a href="/admin" className="text-primary underline">Admin Panel</a></p>
                  </div>
                )}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered
                    .filter((a) => a.id !== featuredArticle?.id || selectedCategory !== "All" || searchQuery || mobileTab !== "home")
                    .map((article) => (
                      <ArticleCard
                        key={article.id}
                        article={article as any}
                        onClick={handleArticleClick}
                        isBookmarked={isBookmarked(article.id)}
                        onToggleBookmark={toggleBookmark}
                      />
                    ))}
                </div>
              </div>

              <div className="hidden lg:block w-80 shrink-0">
                <div className="sticky top-24">
                  <TrendingSidebar articles={mappedArticles as any[]} onArticleClick={handleArticleClick} />
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <MobileBottomNav active={mobileTab} onTabChange={(t) => { setMobileTab(t); setActiveArticle(null); }} />
    </div>
  );
};

export default Index;
