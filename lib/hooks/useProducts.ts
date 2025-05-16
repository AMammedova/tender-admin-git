
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService, Product, ProductResponse, ApiResponse } from '@/lib/services/productService';

type ProductFilters = {
  CategoryIds?: number[];
  SearchTerm?: string;
  CreatedFrom?: string;
  CreatedTo?: string;
  PageNumber?: number;
  PageSize?: number;
};

export const useProducts = (filters: ProductFilters = {}) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<ApiResponse<ProductResponse>>({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters),
  });

  const createProductMutation = useMutation({
    mutationFn: (data: FormData | Omit<Product, 'id'>) => {
      if (data instanceof FormData) {
        return productService.createProduct(data);
      } else {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (key === 'image' && Array.isArray(value)) {
            value.forEach((file, index) => {
              if (file instanceof File) {
                formData.append(`image[${index}]`, file);
              }
            });
          } else if (key === 'attributeDtos' && Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        });
        return productService.createProduct(formData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: (formData: FormData) => productService.updateProduct(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const deleteProductImageMutation = useMutation({
    mutationFn: (id: number) => productService.deleteProductImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return {
    products: data?.responseValue.responseValue || [],
    pagination: data?.responseValue ? {
      pageNumber: data.responseValue.PageNumber,
      totalPages: data.responseValue.totalPages,
      pageSize: data.responseValue.PageSize,
      totalCount: data.responseValue.totalCount,
      hasPreviousPage: data.responseValue.hasPreviousPage,
      hasNextPage: data.responseValue.hasNextPage,
    } : null,
    isLoading,
    error,
    refetchProducts: refetch,
    createProduct: createProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate,
    isCreating: createProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
    deleteProductImage: deleteProductImageMutation.mutate,
  };
};