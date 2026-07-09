import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/db/dexie';
import { Category } from '@/types';
import { generateId } from '@/lib/utils';

export function useCategories() {
  const queryClient = useQueryClient();

  // Get all categories
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => db.categories.orderBy('order').toArray(),
  });

  // Get category by ID
  const useCategory = (id: string) => {
    return useQuery({
      queryKey: ['categories', id],
      queryFn: () => db.categories.get(id),
    });
  };

  // Create category
  const createCategory = useMutation({
    mutationFn: async (categoryData: Omit<Category, 'id' | 'createdAt'>) => {
      const newCategory: Category = {
        ...categoryData,
        id: generateId(),
        createdAt: new Date(),
      };
      await db.categories.add(newCategory);
      return newCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  // Update category
  const updateCategory = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Category> }) => {
      await db.categories.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  // Delete category
  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      await db.categories.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return {
    categoriesQuery,
    useCategory,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
