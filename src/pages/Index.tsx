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
import { sampleArticles, type Category } from "@/data/sampleArticles";

const Index = () => {
  const { isDark, toggle: toggleTheme } = useTheme();
  const { isBookmarked, toggle: toggleBookmark, bookmarks } = useBookmarks();
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeArticle, setActiveArticle] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"home" | "categories" | "trending" | "saved" | "search">("home");

  const featuredArticle = sampleArticles.find((a) => a.isFeatured && a.isBreaking) || sampleArticles.find((a) => a.isFeatured);

  const filtered = useMemo(() => {
    let arts = sampleArticles;

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
  }, [selectedCategory, searchQuery, mobileTab, bookmarks]);

  const openArticle = sampleArticles.find((a) => a.id === activeArticle);

  if (openArticle) {
    return (
      <>
        <Navbar isDark={isDark} onToggleTheme={toggleTheme} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <ArticleView
          article={openArticle}
          onBack={() => setActiveArticle(null)}
          isBookmarked={isBookmarked(openArticle.id)}
          onToggleBookmark={toggleBookmark}
          onArticleClick={setActiveArticle}
        />
        <MobileBottomNav active={mobileTab} onTabChange={(t) => { setMobileTab(t); setActiveArticle(null); }} />
      </>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navbar isDark={isDark} onToggleTheme={toggleTheme} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <BreakingNewsTicker articles={sampleArticles} />

      <main className="container py-6">
        {/* Hero */}
        {featuredArticle && mobileTab === "home" && !searchQuery && selectedCategory === "All" && (
          <div className="mb-8">
            <HeroArticle article={featuredArticle} onClick={setActiveArticle} />
          </div>
        )}

        {/* Category Tabs */}
        <div className="mb-6">
          <CategoryTabs selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>

        {/* Main Grid + Sidebar */}
        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            {mobileTab === "saved" && filtered.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <p className="font-headline text-lg">No saved articles yet</p>
                <p className="text-sm mt-1">Bookmark articles to read them later</p>
              </div>
            )}
            {filtered.length === 0 && mobileTab !== "saved" && (
              <div className="text-center py-16 text-muted-foreground">
                <p className="font-headline text-lg">No articles found</p>
              </div>
            )}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered
                .filter((a) => a.id !== featuredArticle?.id || selectedCategory !== "All" || searchQuery || mobileTab !== "home")
                .map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onClick={setActiveArticle}
                    isBookmarked={isBookmarked(article.id)}
                    onToggleBookmark={toggleBookmark}
                  />
                ))}
            </div>
          </div>

          {/* Trending Sidebar (desktop) */}
          <div className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-24">
              <TrendingSidebar articles={sampleArticles} onArticleClick={setActiveArticle} />
            </div>
          </div>
        </div>
      </main>

      <MobileBottomNav active={mobileTab} onTabChange={(t) => { setMobileTab(t); setActiveArticle(null); }} />
    </div>
  );
};

export default Index;
