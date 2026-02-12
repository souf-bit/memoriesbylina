import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Product, Category } from '@/lib/products';

const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return (data || []).map((p) => ({
    id: p.id,
    name: { ar: p.name_ar, fr: p.name_fr, nl: p.name_nl },
    description: { ar: p.description_ar, fr: p.description_fr, nl: p.description_nl },
    category: p.category as Category,
    price: p.price,
    sizes: p.sizes || ['S', 'M', 'L', 'XL'],
    image: p.image_url || '/placeholder.svg',
    isFeatured: p.is_featured,
  }));
};

export const useProducts = () => {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  });

  const featured = products.filter((p) => p.isFeatured);

  return { products, featured, isLoading };
};

export const useProduct = (id: string | undefined) => {
  const { products, isLoading } = useProducts();
  const product = products.find((p) => p.id === id);
  return { product, isLoading };
};
