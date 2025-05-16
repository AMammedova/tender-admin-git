import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attributeSectionService, AttributeSectionResponse, ApiResponse } from '@/lib/services/attributesSectionService';
import { AttributeSection } from '@/lib/services/attributesSectionService';

type AttributeSectionFilters = {
  pageNumber?: number;
  pageSize?: number;
};

export const useAttributesSection = (filters: AttributeSectionFilters = {}) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<ApiResponse<AttributeSectionResponse>>({
    queryKey: ['attributeSections', filters],
    queryFn: () => attributeSectionService.getAttributeSections(filters.pageNumber, filters.pageSize),
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<AttributeSection, 'id'>) => attributeSectionService.createAttributeSection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attributeSections'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, attributeSection }: { id: number; attributeSection: Partial<AttributeSection> }) => attributeSectionService.updateAttributeSection({ id, attributeSection }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attributeSections'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => attributeSectionService.deleteAttributeSection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attributeSections'] });
    },
  });

  return {
    attributeSections: data?.responseValue.items || [],
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
    refetchAttributeSections: refetch,
    createAttributeSection: createMutation.mutateAsync,
    updateAttributeSection: updateMutation.mutateAsync,
    deleteAttributeSection: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}; 