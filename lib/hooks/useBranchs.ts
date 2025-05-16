import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { branchService, BranchResponse, ApiResponse } from '@/lib/services/branchService';
import { Branch } from '@/containers/branch/types/branch-type';

type BranchFilters = {
  pageNumber?: number;
  pageSize?: number;
};

export const useBranchs = (filters: BranchFilters = {}) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<ApiResponse<BranchResponse>>({
    queryKey: ['branchs', filters],
    queryFn: () => branchService.getBranches(filters.pageNumber, filters.pageSize),
  });

  const createBranchMutation = useMutation({
    mutationFn: (data: Omit<Branch, 'id'>) => branchService.createBranch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branchs'] });
    },
  });

  const updateBranchMutation = useMutation({
    mutationFn: ({ id, branch }: { id: number; branch: Partial<Branch> }) => branchService.updateBranch({ id, branch }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branchs'] });
    },
  });

  const deleteBranchMutation = useMutation({
    mutationFn: (id: number) => branchService.deleteBranch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branchs'] });
    },
  });

  return {
    branchs: data?.responseValue.items || [],
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
    refetchBranches: refetch,
    createBranch: createBranchMutation.mutate,
    updateBranch: updateBranchMutation.mutate,
    deleteBranch: deleteBranchMutation.mutate,
    isCreating: createBranchMutation.isPending,
    isUpdating: updateBranchMutation.isPending,
    isDeleting: deleteBranchMutation.isPending,
  };
}; 