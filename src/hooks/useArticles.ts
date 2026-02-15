import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type DbArticle = Tables<"articles">;
export type ArticleInsert = TablesInsert<"articles">;
export type ArticleUpdate = TablesUpdate<"articles">;

export function useArticles() {
  return useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("is_published", true)
        .order("publish_date", { ascending: false });
      if (error) throw error;
      return data as DbArticle[];
    },
  });
}

export function useAllArticles() {
  return useQuery({
    queryKey: ["all-articles"],
    queryFn: async () => {
      // Need to read all articles including unpublished for admin
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as DbArticle[];
    },
  });
}

export function useArticle(id: string | null) {
  return useQuery({
    queryKey: ["article", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as DbArticle;
    },
    enabled: !!id,
  });
}

export function useCreateArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (article: ArticleInsert) => {
      const { data, error } = await supabase
        .from("articles")
        .insert(article)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["articles"] });
      qc.invalidateQueries({ queryKey: ["all-articles"] });
    },
  });
}

export function useUpdateArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: ArticleUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("articles")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["articles"] });
      qc.invalidateQueries({ queryKey: ["all-articles"] });
    },
  });
}

export function useDeleteArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("articles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["articles"] });
      qc.invalidateQueries({ queryKey: ["all-articles"] });
    },
  });
}

export function useIncrementViews() {
  return useMutation({
    mutationFn: async (articleId: string) => {
      const { error } = await supabase.rpc("increment_views", { article_id: articleId });
      if (error) throw error;
    },
  });
}

export async function uploadArticleImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage
    .from("article-images")
    .upload(fileName, file);
  if (error) throw error;
  const { data } = supabase.storage.from("article-images").getPublicUrl(fileName);
  return data.publicUrl;
}
