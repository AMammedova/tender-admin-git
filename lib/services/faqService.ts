import { Faq, FaqSetDto } from '@/containers/faq/types/faq-type';
import { axiosInstance } from '@/lib/axios';


export interface FaqResponse {
  items: Faq[];
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

export const faqService = {
  async getFaqs(page: number = 1, pageSize: number = 10): Promise<ApiResponse<FaqResponse>> {
    const response = await axiosInstance.get('/Faqs/panel/get-all-with-pagination', {
      params: { page, pageSize }
    });
    return response.data;
  },

  async getFaqById(id: number): Promise<ApiResponse<Faq>> {
    const response = await axiosInstance.get('/Faqs/panel/get', {
      params: { id }
    });
    return response.data;
  },

  async createFaq(data: { createFaqSetDtos: FaqSetDto[] }): Promise<ApiResponse<Faq>> {
    const response = await axiosInstance.post('/Faqs/panel/create', data);
    return response.data;
  },

  async updateFaq({ id, faqSetDtos }: { id: number; faqSetDtos: FaqSetDto[] }): Promise<ApiResponse<Faq>> {
    const response = await axiosInstance.put('/Faqs/panel/update', { id, faqSetDtos });
    return response.data;
  },

  async deleteFaq(id: number): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`Faqs/panel/delete`, {
      params: { id }
    });
    return response.data;
  }
};
