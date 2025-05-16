import { axiosInstance } from '@/lib/axios';
export interface Attribute {
  id: number;
  name: string;
  valueType: number;
  categoryId: number;
  parentAttributeId: number;
  isChangeable: boolean;
  attributeSectionId: number;
  categoryName?: string;
  parentAttributeName?: string;
  sectionName?: string;
}

export interface AttributeResponse {
  items: Attribute[];
  PageNumber: number;
  totalPages: number;
  PageSize: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ApiResponse<T> {
  responseValue: T;
  statusCode: number;
  message: string;
}

export const attributeService = {
  async getAttributesWithPagination(PageNumber = 1, PageSize = 10, SearchTerm?: string): Promise<ApiResponse<AttributeResponse>> {
    try {
      const response = await axiosInstance.get('/Attributes/panel/get-all-with-pagination', {
        params: { PageNumber, PageSize }
      });
      console.log(response.data, "response.data");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async createAttribute(data: Omit<Attribute, 'id'>): Promise<ApiResponse<Attribute>> {
    try {
      const response = await axiosInstance.post('/Attributes/panel/create', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateAttribute(data: Attribute): Promise<ApiResponse<Attribute>> {
    try {
      const response = await axiosInstance.put('/Attributes/panel/update', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteAttribute(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await axiosInstance.delete('/Attributes/panel/delete', {
        params: { id }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAttributesBySection(sectionId: number) {
    const response = await axiosInstance.get('/AttributeSecttions/panel/get-all');
    console.log(response.data, "response.datasection");
    const section = response.data.responseValue.find((s: any) => s.id === sectionId);
    console.log(section, "section");
    return section ? section.attributeDtos : [];
  }
};
