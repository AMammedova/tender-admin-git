import { axiosInstance } from '@/lib/axios';

export interface AttributeSection {
  id: number;
  name: string;
}

export interface AttributeSectionResponse {
  items: AttributeSection[];
  pageNumber: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ApiResponse<T> {
  responseValue: T;
  statusCode: number;
  message: string;
}

export const attributeSectionService = {
  async getAttributeSections(page: number = 1, pageSize: number = 10): Promise<ApiResponse<AttributeSectionResponse>> {
    const response = await axiosInstance.get('/AttributeSecttions/panel/get-all-with-pagination', {
      params: { pageNumber: page, pageSize: pageSize }
    });
    return response.data;
  },

  async getAttributeSectionById(id: number): Promise<ApiResponse<AttributeSection>> {
    const response = await axiosInstance.get('/AttributeSecttions/panel/get-by-id', {
      params: { id }
    });
    return response.data;
  },

  async createAttributeSection(data: Omit<AttributeSection, "id">): Promise<ApiResponse<AttributeSection>> {
    const response = await axiosInstance.post('/AttributeSecttions/panel/create', data);
    return response.data;
  },

  async updateAttributeSection({ id, attributeSection }: { id: number; attributeSection: Partial<AttributeSection> }): Promise<ApiResponse<AttributeSection>> {
    const response = await axiosInstance.put('/AttributeSecttions/panel/update', {
      id,
      ...attributeSection
    });
    return response.data;
  },

  async deleteAttributeSection(id: number): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`/AttributeSecttions/panel/delete`, {
      params: { id }
    });
    return response.data;
  }
};
