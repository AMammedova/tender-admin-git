import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { partnerService, PartnerResponse, ApiResponse } from '@/lib/services/partnerService';
import { Partner } from '@/containers/partners/types/partner-type';

type PartnerFilters = {
  pageNumber?: number;
  pageSize?: number;
};

export const usePartners = (filters: PartnerFilters = {}) => {
  const queryClient = useQueryClient();

  // Fetch partners with pagination
  const { data, isLoading, error, refetch } = useQuery<ApiResponse<PartnerResponse>>({
    queryKey: ['partners', filters],
    queryFn: () => partnerService.getPartners(filters.pageNumber, filters.pageSize),
    // keepPreviousData: true,
  });

  // Create partner
  const createPartnerMutation = useMutation({
    mutationFn: (data: FormData | Omit<Partner, 'id'>) => partnerService.createPartner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
    },
  });

  // Update partner
  const updatePartnerMutation = useMutation({
    mutationFn: ({ id, partner }: { id: number; partner: FormData | Partial<Partner> }) =>
      partnerService.updatePartner({ id, partner }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
    },
  });

  // Delete partner
  const deletePartnerMutation = useMutation({
    mutationFn: (id: number) => partnerService.deletePartner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
    },
  });

  return {
    partners: data?.responseValue.items || [],
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
    refetchPartners: refetch,
    createPartner: createPartnerMutation.mutate,
    updatePartner: updatePartnerMutation.mutate,
    deletePartner: deletePartnerMutation.mutate,
    isCreating: createPartnerMutation.isPending,
    isUpdating: updatePartnerMutation.isPending,
    isDeleting: deletePartnerMutation.isPending,
  };
};
