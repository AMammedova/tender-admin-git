import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { regionService, Region, RegionResponse, ApiResponse } from '@/lib/services/regionService';

export type RegionFilters = {
  pageNumber?: number;
  pageSize?: number;
};

export const useRegions = (filters: RegionFilters = {}) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<ApiResponse<RegionResponse>>({
    queryKey: ['regions', filters],
    queryFn: () => regionService.getRegions(filters.pageNumber, filters.pageSize),
  });

  const createRegionMutation = useMutation({
    mutationFn: (data: Omit<Region, 'id'>) => regionService.createRegion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['regions'] });
    },
  });

  const updateRegionMutation = useMutation({
    mutationFn: ({ id, region }: { id: number; region: Partial<Region> }) => regionService.updateRegion({ id, region }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['regions'] });
    },
  });

  const deleteRegionMutation = useMutation({
    mutationFn: (id: number) => regionService.deleteRegion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['regions'] });
    },
  });

  return {
    regions: data?.responseValue.items || [],
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
    refetchRegions: refetch,
    createRegion: createRegionMutation.mutate,
    updateRegion: updateRegionMutation.mutate,
    deleteRegion: deleteRegionMutation.mutate,
    isCreating: createRegionMutation.isPending,
    isUpdating: updateRegionMutation.isPending,
    isDeleting: deleteRegionMutation.isPending,
  };
};
