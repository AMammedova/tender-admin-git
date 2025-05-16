import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsService, NewsResponse, ApiResponse } from '@/lib/services/newsService';
import { News, NewsSets } from '@/containers/news/type/news-type';

export type NewsFilters = {
  pageNumber?: number;
  pageSize?: number;
};

export const useNews = (filters: NewsFilters = {}) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<ApiResponse<NewsResponse>>({
    queryKey: ['news', filters],
    queryFn: () => newsService.getNews(filters.pageNumber, filters.pageSize),
  });
  const createNewsMutation = useMutation({
    mutationFn: ({ newsSets, images, coverImage }: { newsSets: NewsSets[]; images: File[]; coverImage: File | null }) =>
      newsService.createNews({ newsSets, images, coverImage }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });

  const updateNewsMutation = useMutation({
    mutationFn: ({ id, newsSets, images, coverImage, deletedImgId }: { id: number; newsSets: NewsSets[]; images: File[]; coverImage: File | null; deletedImgId: number[] }) =>
      newsService.updateNews({ id, newsSets, images, coverImage, deletedImgId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });

  const deleteNewsMutation = useMutation({
    mutationFn: (id: number) => newsService.deleteNews(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });

  return {
    news: data?.responseValue.items
      ? data.responseValue.items.map((item) => ({
          ...item,
          newsSets: Array.isArray(item.newsSets)
            ? item.newsSets
            : item.newsSets
            ? [item.newsSets]
            : [],
          images: Array.isArray(item.images)
            ? item.images.map((img, i) =>
                typeof img === "string" ? { id: i, imageUrl: img } : img
              )
            : [],
        }))
      : [],
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
    refetchNews: refetch,
    createNews: createNewsMutation.mutate,
    updateNews: updateNewsMutation.mutate,
    deleteNews: deleteNewsMutation.mutate,
    isCreating: createNewsMutation.isPending,
    isUpdating: updateNewsMutation.isPending,
    isDeleting: deleteNewsMutation.isPending,
  };
}; 