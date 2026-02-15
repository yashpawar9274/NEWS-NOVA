
-- Articles table
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Politics', 'Business', 'Technology', 'Sports', 'Entertainment', 'Local', 'International')),
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'hi')),
  author TEXT NOT NULL,
  publish_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_time INTEGER NOT NULL DEFAULT 3,
  image_url TEXT,
  is_breaking BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  views INTEGER NOT NULL DEFAULT 0,
  likes INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS (public read, admin route for write)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Public read policy (anyone can read published articles)
CREATE POLICY "Anyone can read published articles"
ON public.articles FOR SELECT
USING (is_published = true);

-- Public insert/update/delete for admin (no auth, simple route-based)
CREATE POLICY "Anyone can insert articles"
ON public.articles FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update articles"
ON public.articles FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete articles"
ON public.articles FOR DELETE
USING (true);

-- Comments table
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  commenter_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comments"
ON public.comments FOR SELECT USING (true);

CREATE POLICY "Anyone can add comments"
ON public.comments FOR INSERT WITH CHECK (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_articles_updated_at
BEFORE UPDATE ON public.articles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for article images
INSERT INTO storage.buckets (id, name, public) VALUES ('article-images', 'article-images', true);

CREATE POLICY "Anyone can view article images"
ON storage.objects FOR SELECT
USING (bucket_id = 'article-images');

CREATE POLICY "Anyone can upload article images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'article-images');

CREATE POLICY "Anyone can update article images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'article-images');

CREATE POLICY "Anyone can delete article images"
ON storage.objects FOR DELETE
USING (bucket_id = 'article-images');

-- Increment views function
CREATE OR REPLACE FUNCTION public.increment_views(article_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.articles SET views = views + 1 WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
