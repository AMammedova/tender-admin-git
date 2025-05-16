import { useQuery } from '@tanstack/react-query';
import { attributeService } from '@/lib/services/attributeService';

export const useAttributeParentTree = (sectionId: number | undefined) => {
  return useQuery({
    queryKey: ['attributeParentTree', sectionId],
    queryFn: () => sectionId ? attributeService.getAttributesBySection(sectionId) : [],
    enabled: !!sectionId,
  });
}; 