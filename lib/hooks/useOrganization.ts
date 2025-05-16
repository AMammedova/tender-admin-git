import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationService, Organization, OrganizationResponse, ApiResponse } from '@/lib/services/organizationService';

type OrganizationFilters = {
  pageNumber?: number;
  pageSize?: number;
};

export const useOrganizations = (filters: OrganizationFilters = {}) => {
  const queryClient = useQueryClient();

  // Fetch organizations with pagination
  const { data, isLoading, error, refetch } = useQuery<ApiResponse<OrganizationResponse>>({
    queryKey: ['organizations', filters],
    queryFn: () => organizationService.getOrganizations(filters.pageNumber, filters.pageSize),
  });

  // Create organization
  const createOrganizationMutation = useMutation({
    mutationFn: (data: FormData | Omit<Organization, 'id'>) => organizationService.createOrganization(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });

  // Update organization
  const updateOrganizationMutation = useMutation({
    mutationFn: ({ id, organization }: { id: number; organization: FormData | Partial<Organization> }) =>
      organizationService.updateOrganization({ id, organization }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });

  // Delete organization
  const deleteOrganizationMutation = useMutation({
    mutationFn: (id: number) => organizationService.deleteOrganization(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });

  return {
    organizations: data?.responseValue.items || [],
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
    refetchOrganizations: refetch,
    createOrganization: createOrganizationMutation.mutate,
    updateOrganization: updateOrganizationMutation.mutate,
    deleteOrganization: deleteOrganizationMutation.mutate,
    isCreating: createOrganizationMutation.isPending,
    isUpdating: updateOrganizationMutation.isPending,
    isDeleting: deleteOrganizationMutation.isPending,
  };
};
