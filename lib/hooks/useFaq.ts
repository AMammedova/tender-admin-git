import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { faqService, FaqResponse, ApiResponse } from '@/lib/services/faqService';
import { Faq, FaqSetDto } from '@/containers/faq/types/faq-type';

export type FaqFilters = {
  pageNumber?: number;
  pageSize?: number;
};

export const useFaqs = (filters: FaqFilters = {}) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<ApiResponse<FaqResponse>>({
    queryKey: ['faqs', filters],
    queryFn: () => faqService.getFaqs(filters.pageNumber, filters.pageSize),
  });

  const createFaqMutation = useMutation({
    mutationFn: (faqSetDtos: FaqSetDto[]) => faqService.createFaq({ createFaqSetDtos: faqSetDtos }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });

  const updateFaqMutation = useMutation({
    mutationFn: ({ id, faqSetDtos }: { id: number; faqSetDtos: FaqSetDto[] }) => faqService.updateFaq({ id, faqSetDtos }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });

  const deleteFaqMutation = useMutation({
    mutationFn: (id: number) => faqService.deleteFaq(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });

  return {
    faqs: data?.responseValue.items || [],
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
    refetchFaqs: refetch,
    createFaq: createFaqMutation.mutate,
    updateFaq: updateFaqMutation.mutate,
    deleteFaq: deleteFaqMutation.mutate,
    isCreating: createFaqMutation.isPending,
    isUpdating: updateFaqMutation.isPending,
    isDeleting: deleteFaqMutation.isPending,
  };
}; 