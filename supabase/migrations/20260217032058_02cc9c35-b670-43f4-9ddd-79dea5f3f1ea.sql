
-- Add is_approved column for AI moderation workflow
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS is_approved boolean NOT NULL DEFAULT false;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS submitted_by text DEFAULT 'admin';

-- Update RLS: allow anyone to read approved+published articles
DROP POLICY IF EXISTS "Anyone can read published articles" ON public.articles;
CREATE POLICY "Anyone can read approved published articles"
ON public.articles FOR SELECT
USING (is_published = true AND is_approved = true);

-- Keep insert policy for public submission
-- Keep update/delete for admin (enforced via edge function password check)
