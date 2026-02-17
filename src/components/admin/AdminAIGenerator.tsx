import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const CATEGORIES = ["Politics", "Business", "Technology", "Sports", "Entertainment", "Local", "International"];

interface AdminAIGeneratorProps {
  onDone: () => void;
}

export function AdminAIGenerator({ onDone }: AdminAIGeneratorProps) {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("Technology");
  const [language, setLanguage] = useState("en");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<any>(null);
  const qc = useQueryClient();

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerated(null);
    try {
      const { data, error } = await supabase.functions.invoke("ai-generate-news", {
        body: { topic: topic || undefined, category, language },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setGenerated(data.article);
      qc.invalidateQueries({ queryKey: ["articles"] });
      qc.invalidateQueries({ queryKey: ["all-articles"] });
      toast({ title: "✅ AI article generated and published!" });
    } catch (err: any) {
      toast({ title: err?.message || "Failed to generate", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <p className="text-muted-foreground text-sm">AI will generate a full news article based on your topic and publish it automatically.</p>

      <div className="space-y-2">
        <Label>Topic (optional)</Label>
        <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. India's new education policy 2026..." />
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

      <Button onClick={handleGenerate} disabled={generating} className="w-full">
        {generating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
        {generating ? "AI is writing..." : "Generate News Article"}
      </Button>

      {generated && (
        <div className="p-4 rounded-lg border bg-muted/50 space-y-2">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">Published!</span>
          </div>
          <h3 className="font-headline font-bold text-lg">{generated.title}</h3>
          <p className="text-sm text-muted-foreground">{generated.excerpt}</p>
          <div className="flex gap-3 pt-2">
            <Button size="sm" onClick={() => { setGenerated(null); setTopic(""); }}>Generate Another</Button>
            <Button size="sm" variant="outline" onClick={onDone}>Back to List</Button>
          </div>
        </div>
      )}
    </div>
  );
}
