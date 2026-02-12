import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { products as staticProducts, type Product, type Category } from '@/lib/products';

const fetchDbProducts = async (): Promise<Product[]> => {
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
    name: { ar: p.name_ar, fr: p.name_fr, nl: (p as any).name_nl || p.name_fr },
    description: { ar: p.description_ar, fr: p.description_fr, nl: (p as any).description_nl || p.description_fr },
    category: p.category as Category,
    price: p.price,
    sizes: p.sizes || ['S', 'M', 'L', 'XL'],
    image: p.image_url || '/placeholder.svg',
    isFeatured: p.is_featured,
    fromDb: true,
  }));
};

export const useProducts = () => {
  const { data: dbProducts = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchDbProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Merge: DB products first, then static (avoid duplicates by id)
  const dbIds = new Set(dbProducts.map((p) => p.id));
  const allProducts = [
    ...dbProducts,
    ...staticProducts.filter((p) => !dbIds.has(p.id)),
  ];

  const featured = allProducts.filter(
    (p) => (p as any).isFeatured || (!( p as any).fromDb && staticProducts.indexOf(p as any) < 4)
  );

  return { products: allProducts, featured, isLoading };
};

export const useProduct = (id: string | undefined) => {
  const { products, isLoading } = useProducts();
  const product = products.find((p) => p.id === id);
  return { product, isLoading };
};