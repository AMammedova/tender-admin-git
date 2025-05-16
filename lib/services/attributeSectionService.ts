import { axiosInstance } from '@/lib/axios';

export interface AttributeSection {
  id: number;
  name: string;
}

export interface ApiResponse<T> {
  responseValue: T;
  statusCode: number;
  message: string;
}

export const attributeSectionService = {
  async getAll(): Promise<ApiResponse<AttributeSection[]>> {
    const response = await axiosInstance.get('/AttributeSecttions/panel/get-all');
    return response.data;
  },
}; 