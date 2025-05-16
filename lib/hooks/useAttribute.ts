import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attributeService, Attribute, AttributeResponse, ApiResponse } from '@/lib/services/attributeService';
import { attributeSectionService, AttributeSection } from '@/lib/services/attributeSectionService';

export type AttributeFilters = {
  PageNumber?: number;
  PageSize?: number;
  SearchTerm?: string;
};

export const useAttributes = (filters: AttributeFilters = {}) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<ApiResponse<AttributeResponse>>({
    queryKey: ['attributes', filters],
    queryFn: () => attributeService.getAttributesWithPagination(
      filters.PageNumber || 1,
      filters.PageSize || 10,
      filters.SearchTerm
    ),
  });

  const createAttributeMutation = useMutation({
    mutationFn: (data: Omit<Attribute, 'id'>) => attributeService.createAttribute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attributes'] });
    },
  });

  const updateAttributeMutation = useMutation({
    mutationFn: (data: Attribute) => attributeService.updateAttribute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attributes'] });
    },
  });

  const deleteAttributeMutation = useMutation({
    mutationFn: (id: number) => attributeService.deleteAttribute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attributes'] });
    },
  });

  return {
    attributes: data?.responseValue?.items || [],
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
    refetchAttributes: refetch,
    createAttribute: createAttributeMutation.mutate,
    updateAttribute: updateAttributeMutation.mutate,
    deleteAttribute: deleteAttributeMutation.mutate,
    isCreating: createAttributeMutation.isPending,
    isUpdating: updateAttributeMutation.isPending,
    isDeleting: deleteAttributeMutation.isPending,
  };
};

export const useAttributeSections = () => {
  const { data, isLoading, error, refetch } = useQuery<ApiResponse<AttributeSection[]>>({
    queryKey: ['attributeSections'],
    queryFn: () => attributeSectionService.getAll(),
  });

  return {
    sections: data?.responseValue || [],
    isLoading,
    error,
    refetch,
  };
};
