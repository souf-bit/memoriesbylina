import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DbCategory {
  id: string;
  name_nl: string;
  name_fr: string;
  name_ar: string;
  slug: string;
  created_at: string;
}

const fetchCategories = async (): Promise<DbCategory[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return (data || []) as unknown as DbCategory[];
};

export const useCategories = () => {
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['categories'] });

  const addCategory = useMutation({
    mutationFn: async (cat: { name_nl: string; name_fr: string; name_ar: string; slug: string }) => {
      const { error } = await supabase.from('categories').insert(cat as any);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, ...cat }: { id: string; name_nl: string; name_fr: string; name_ar: string; slug: string }) => {
      const { error } = await supabase.from('categories').update(cat as any).eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { categories, isLoading, addCategory, updateCategory, deleteCategory };
};
