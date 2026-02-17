import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { useTheme } from "@/hooks/useTheme";
import { AdminArticleList } from "@/components/admin/AdminArticleList";
import { AdminArticleForm } from "@/components/admin/AdminArticleForm";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";
import { AdminPasswordGate } from "@/components/admin/AdminPasswordGate";
import { AdminAIGenerator } from "@/components/admin/AdminAIGenerator";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Plus, ArrowLeft, Sparkles, LogOut } from "lucide-react";

type AdminView = "list" | "create" | "edit" | "analytics" | "ai-generate";

const Admin = () => {
  const { isDark, toggle: toggleTheme } = useTheme();
  const [authenticated, setAuthenticated] = useState(false);
  const [view, setView] = useState<AdminView>("list");
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("admin_verified") === "true") {
      setAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_verified");
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <AdminPasswordGate onAuthenticated={() => setAuthenticated(true)} />;
  }

  const handleEdit = (id: string) => { setEditId(id); setView("edit"); };
  const handleDone = () => { setEditId(null); setView("list"); };

  return (
    <div className="min-h-screen">
      <Navbar isDark={isDark} onToggleTheme={toggleTheme} searchQuery="" onSearchChange={() => {}} />
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {view !== "list" && view !== "analytics" && (
              <Button variant="ghost" size="icon" onClick={handleDone}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h1 className="font-headline text-2xl font-bold">
              {view === "analytics" ? "Analytics" : view === "create" ? "New Article" : view === "edit" ? "Edit Article" : view === "ai-generate" ? "AI News Generator" : "Admin Panel"}
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={view === "analytics" ? "default" : "outline"}
              size="sm"
              onClick={() => setView(view === "analytics" ? "list" : "analytics")}
            >
              <LayoutDashboard className="h-4 w-4 mr-1" />
              {view === "analytics" ? "Articles" : "Analytics"}
            </Button>
            {view === "list" && (
              <>
                <Button size="sm" variant="outline" onClick={() => setView("ai-generate")}>
                  <Sparkles className="h-4 w-4 mr-1" /> AI Generate
                </Button>
                <Button size="sm" onClick={() => setView("create")}>
                  <Plus className="h-4 w-4 mr-1" /> New Article
                </Button>
              </>
            )}
            <Button size="sm" variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {view === "list" && <AdminArticleList onEdit={handleEdit} />}
        {view === "create" && <AdminArticleForm onDone={handleDone} />}
        {view === "edit" && editId && <AdminArticleForm articleId={editId} onDone={handleDone} />}
        {view === "analytics" && <AdminAnalytics />}
        {view === "ai-generate" && <AdminAIGenerator onDone={handleDone} />}
      </div>
    </div>
  );
};

export default Admin;
