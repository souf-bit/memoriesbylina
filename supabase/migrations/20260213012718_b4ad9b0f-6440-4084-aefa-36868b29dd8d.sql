
-- 1. Add stock_qty column to products
ALTER TABLE public.products ADD COLUMN stock_qty integer NOT NULL DEFAULT 0;

-- 2. Create categories table
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_nl text NOT NULL,
  name_fr text NOT NULL,
  name_ar text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Enable RLS on categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 4. RLS policies: everyone can read
CREATE POLICY "Categories are viewable by everyone"
ON public.categories
FOR SELECT
USING (true);

-- 5. Admins can insert categories
CREATE POLICY "Admins can insert categories"
ON public.categories
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 6. Admins can update categories
CREATE POLICY "Admins can update categories"
ON public.categories
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 7. Admins can delete categories
CREATE POLICY "Admins can delete categories"
ON public.categories
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 8. Seed existing categories
INSERT INTO public.categories (name_nl, name_fr, name_ar, slug) VALUES
  ('Jurken', 'Robes', 'فساتين', 'robes'),
  ('Jelbabs', 'Jelbabs', 'جلابيب', 'jelbabs'),
  ('Complets', 'Complets', 'أطقم', 'complets');
