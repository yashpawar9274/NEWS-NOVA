import { useAllArticles, useDeleteArticle } from "@/hooks/useArticles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Eye, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AdminArticleListProps {
  onEdit: (id: string) => void;
}

export function AdminArticleList({ onEdit }: AdminArticleListProps) {
  const { data: articles, isLoading } = useAllArticles();
  const deleteMutation = useDeleteArticle();

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: "Article deleted" });
    } catch {
      toast({ title: "Error deleting article", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!articles?.length) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="font-headline text-lg">No articles yet</p>
        <p className="text-sm mt-1">Create your first article to get started</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="hidden md:table-cell">Lang</TableHead>
            <TableHead className="hidden sm:table-cell">Status</TableHead>
            <TableHead className="hidden sm:table-cell">Views</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((a) => (
            <TableRow key={a.id}>
              <TableCell className="font-medium max-w-[200px] truncate">
                {a.is_breaking && <Badge className="bg-breaking text-breaking-foreground text-[10px] mr-1">B</Badge>}
                {a.title}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant="secondary" className="text-xs">{a.category}</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell text-xs">{a.language === "hi" ? "हिंदी" : "EN"}</TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge variant={a.is_published ? "default" : "outline"} className="text-xs">
                  {a.is_published ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Eye className="h-3 w-3" /> {a.views}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(a.id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(a.id, a.title)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
