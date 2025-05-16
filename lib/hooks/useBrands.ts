import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { brandService, BrandResponse, ApiResponse } from '@/lib/services/brandService';
import { Brand } from '@/containers/brand/types/brand-type';

type BrandFilters = {
  pageNumber?: number;
  pageSize?: number;
};

export const useBrands = (filters: BrandFilters = {}) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<ApiResponse<BrandResponse>>({
    queryKey: ['brands', filters],
    queryFn: () => brandService.getBrands(filters.pageNumber, filters.pageSize),
  });

  const createBrandMutation = useMutation({
    mutationFn: (data: Omit<Brand, 'id'>) => brandService.createBrand(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });

  const updateBrandMutation = useMutation({
    mutationFn: ({ id, brand }: { id: number; brand: Partial<Brand> }) => brandService.updateBrand({ id, brand }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });

  const deleteBrandMutation = useMutation({
    mutationFn: (id: number) => brandService.deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });

  return {
    brands: data?.responseValue.items || [],
    pagination: data?.responseValue
      ? {
          pageNumber: data.responseValue.pageNumber,
          totalPages: data.responseValue.totalPages,
          pageSize: data.responseValue.pageSize,
          totalCount: data.responseValue.totalCount,
          hasPreviousPage: data.responseValue.hasPreviousPage,
          hasNextPage: data.responseValue.hasNextPage,
        }
      : null,
    isLoading,
    error,
    refetchBrands: refetch,
    createBrand: createBrandMutation.mutateAsync,
    updateBrand: updateBrandMutation.mutateAsync,
    deleteBrand: deleteBrandMutation.mutateAsync,
    isCreating: createBrandMutation.isPending,
    isUpdating: updateBrandMutation.isPending,
    isDeleting: deleteBrandMutation.isPending,
  };
}; 