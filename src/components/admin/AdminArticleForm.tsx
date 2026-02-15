import { useState, useEffect } from "react";
import { useArticle, useCreateArticle, useUpdateArticle, uploadArticleImage } from "@/hooks/useArticles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Loader2, Upload, Image as ImageIcon } from "lucide-react";

const CATEGORIES = ["Politics", "Business", "Technology", "Sports", "Entertainment", "Local", "International"];

interface AdminArticleFormProps {
  articleId?: string;
  onDone: () => void;
}

export function AdminArticleForm({ articleId, onDone }: AdminArticleFormProps) {
  const { data: existing, isLoading: loadingExisting } = useArticle(articleId ?? null);
  const createMutation = useCreateArticle();
  const updateMutation = useUpdateArticle();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Technology");
  const [language, setLanguage] = useState("en");
  const [author, setAuthor] = useState("");
  const [readTime, setReadTime] = useState(3);
  const [imageUrl, setImageUrl] = useState("");
  const [isBreaking, setIsBreaking] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setExcerpt(existing.excerpt);
      setContent(existing.content);
      setCategory(existing.category);
      setLanguage(existing.language);
      setAuthor(existing.author);
      setReadTime(existing.read_time);
      setImageUrl(existing.image_url || "");
      setIsBreaking(existing.is_breaking);
      setIsFeatured(existing.is_featured);
      setIsPublished(existing.is_published);
    }
  }, [existing]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadArticleImage(file);
      setImageUrl(url);
      toast({ title: "Image uploaded" });
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !excerpt || !content || !author) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const payload = {
      title, excerpt, content, category, language, author,
      read_time: readTime,
      image_url: imageUrl || null,
      is_breaking: isBreaking,
      is_featured: isFeatured,
      is_published: isPublished,
    };

    try {
      if (articleId) {
        await updateMutation.mutateAsync({ id: articleId, ...payload });
        toast({ title: "Article updated" });
      } else {
        await createMutation.mutateAsync(payload);
        toast({ title: "Article created" });
      }
      onDone();
    } catch {
      toast({ title: "Error saving article", variant: "destructive" });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (articleId && loadingExisting) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Article headline..." />
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
              <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="author">Author *</Label>
          <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="readTime">Read Time (min)</Label>
          <Input id="readTime" type="number" min={1} max={30} value={readTime} onChange={(e) => setReadTime(Number(e.target.value))} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt *</Label>
        <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short summary..." rows={2} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content *</Label>
        <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Full article content..." rows={10} />
      </div>

      {/* Image upload */}
      <div className="space-y-2">
        <Label>Header Image</Label>
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("img-upload")?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Upload className="h-4 w-4 mr-1" />}
            {uploading ? "Uploading..." : "Upload Image"}
          </Button>
          <Input id="img-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          {imageUrl && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ImageIcon className="h-4 w-4" />
              <span className="truncate max-w-[200px]">Image set</span>
            </div>
          )}
        </div>
        {imageUrl && (
          <img src={imageUrl} alt="Preview" className="mt-2 rounded-lg max-h-48 object-cover" />
        )}
        {!imageUrl && (
          <Input placeholder="Or paste image URL..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="mt-2" />
        )}
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <Switch id="breaking" checked={isBreaking} onCheckedChange={setIsBreaking} />
          <Label htmlFor="breaking">Breaking News</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
          <Label htmlFor="featured">Featured</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="published" checked={isPublished} onCheckedChange={setIsPublished} />
          <Label htmlFor="published">Published</Label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
          {articleId ? "Update Article" : "Publish Article"}
        </Button>
        <Button type="button" variant="outline" onClick={onDone}>Cancel</Button>
      </div>
    </form>
  );
}
