import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService, Category, CategoryResponse, ApiResponse } from '@/lib/services/categoryService';

// Tüm kategorileri (pagination ile) getirir
export const useCategoriesPaginated = (page: number = 1, pageSize: number = 10,searchTerm: string = '') => {
  return useQuery<ApiResponse<CategoryResponse>>({
    queryKey: ['categories', page, pageSize,searchTerm],
    queryFn: () => categoryService.getCategory(page, pageSize,searchTerm),
    placeholderData: (prev) => prev,
  });
};

// Tüm kategorileri (düz liste) getirir
export const useCategoriesAll = () => {
  return useQuery<ApiResponse<Category[]>>({
    queryKey: ['categoriesAll'],
    queryFn: () => categoryService.getCategoryAll(),
  });
};

// ID ile kategori getirir
export const useCategoryById = (id: number) => {
  return useQuery<ApiResponse<Category>>({
    queryKey: ['category', id],
    queryFn: () => categoryService.CategoryById(id),
    enabled: !!id,
  });
};

// Kategori oluşturma
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (category: Category) => categoryService.createCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categoriesAll'] });
    },
  });
};

// Kategori güncelleme
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, category }: { id: number; category: Category }) =>
      categoryService.updateCategory(id, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categoriesAll'] });
    },
  });
};

// Kategori silme
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categoriesAll'] });
    },
  });
};

// Category search by searchTerm
export const useCategorySearch = (searchTerm: string) => {
  return useQuery<ApiResponse<{ id: number; name: string }[]>>({
    queryKey: ['categorySearch', searchTerm],
    queryFn: () => categoryService.getCategorySearch(searchTerm),
    enabled: !!searchTerm,
  });
};
