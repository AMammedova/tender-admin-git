import { useQuery } from '@tanstack/react-query';
import { attributeSectionService, AttributeSection, ApiResponse } from '@/lib/services/attributeSectionService';

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