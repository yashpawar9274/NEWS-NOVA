import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Send, CheckCircle2 } from "lucide-react";

const CATEGORIES = ["Politics", "Business", "Technology", "Sports", "Entertainment", "Local", "International"];

const SubmitArticle = () => {
  const { isDark, toggle: toggleTheme } = useTheme();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Technology");
  const [language, setLanguage] = useState("en");
  const [author, setAuthor] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [moderationResult, setModerationResult] = useState<{ approved: boolean; reason: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !excerpt || !content) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      // Insert as unapproved
      const { data: article, error } = await supabase
        .from("articles")
        .insert({
          title,
          excerpt,
          content,
          category,
          language,
          author: author || "Anonymous",
          read_time: Math.max(1, Math.ceil(content.split(" ").length / 200)),
          is_published: false,
          is_approved: false,
          submitted_by: "public",
        })
        .select()
        .single();

      if (error) throw error;

      // Trigger AI moderation
      const { data: modResult, error: modError } = await supabase.functions.invoke("ai-moderate", {
        body: { articleId: article.id },
      });

      if (modError) {
        toast({ title: "Article submitted, AI moderation pending", description: "Your article will be reviewed shortly." });
      } else {
        setModerationResult(modResult);
        if (modResult?.approved) {
          toast({ title: "✅ Article approved and published!", description: modResult.reason });
        } else {
          toast({ title: "❌ Article not approved", description: modResult?.reason || "Content didn't meet guidelines", variant: "destructive" });
        }
      }

      setSubmitted(true);
    } catch (err) {
      toast({ title: "Error submitting article", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setTitle(""); setExcerpt(""); setContent(""); setAuthor("");
    setCategory("Technology"); setLanguage("en");
    setSubmitted(false); setModerationResult(null);
  };

  if (submitted) {
    return (
      <div className="min-h-screen">
        <Navbar isDark={isDark} onToggleTheme={toggleTheme} searchQuery="" onSearchChange={() => {}} />
        <div className="container max-w-lg py-16 text-center space-y-4">
          <CheckCircle2 className={`h-16 w-16 mx-auto ${moderationResult?.approved ? "text-green-500" : "text-yellow-500"}`} />
          <h2 className="font-headline text-2xl font-bold">
            {moderationResult?.approved ? "Article Published! 🎉" : "Article Submitted"}
          </h2>
          <p className="text-muted-foreground">
            {moderationResult?.approved
              ? "Your article has been approved by AI and is now live."
              : moderationResult?.reason || "Your article is being reviewed."}
          </p>
          <div className="flex gap-3 justify-center pt-4">
            <Button onClick={handleReset}>Submit Another</Button>
            <Button variant="outline" asChild>
              <a href="/">Go Home</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar isDark={isDark} onToggleTheme={toggleTheme} searchQuery="" onSearchChange={() => {}} />
      <div className="container max-w-2xl py-8">
        <div className="mb-6">
          <h1 className="font-headline text-2xl font-bold">📝 Submit Your News</h1>
          <p className="text-muted-foreground text-sm mt-1">Anyone can submit news. AI will review and auto-approve quality content.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Headline *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="News headline..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Your Name (optional)</Label>
            <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Anonymous" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Summary *</Label>
            <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short summary..." rows={2} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Full Article *</Label>
            <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your full article here..." rows={10} />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            {submitting ? "Submitting & AI Reviewing..." : "Submit Article"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SubmitArticle;
