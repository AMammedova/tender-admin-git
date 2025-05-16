import { Partner } from '@/containers/partners/types/partner-type';
import { axiosInstance } from '@/lib/axios';


export interface PartnerResponse {
  items: Partner[];
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

export const partnerService = {
  async getPartners(page: number = 1, pageSize: number = 10): Promise<ApiResponse<PartnerResponse>> {
    const response = await axiosInstance.get('/Partners/panel/get-all-with-pagination', {
      params: { pageNumber: page, pageSize: pageSize }
    });
    return response.data;
  },

  async getPartnerById(id: number): Promise<ApiResponse<Partner>> {
    const response = await axiosInstance.get('/Partners/panel/get-by-id', {
      params: { id }
    });
    return response.data;
  },

  async createPartner(data: FormData | Omit<Partner, "id">): Promise<ApiResponse<Partner>> {
    const response = await axiosInstance.post('/Partners/panel/create', data, {
      headers: data instanceof FormData ? {
        'Content-Type': 'multipart/form-data',
      } : {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  async updatePartner({ id, partner }: { id: number; partner: FormData | Partial<Partner> }): Promise<ApiResponse<Partner>> {
    let dataToSend = partner;
    let headers = { 'Content-Type': 'application/json' };
    if (partner instanceof FormData) {
      dataToSend = partner;
      dataToSend.append('id', id.toString());
      headers = { 'Content-Type': 'multipart/form-data' };
    }
    const response = await axiosInstance.put('/Partners/panel/update', dataToSend, {
      headers,
      params: partner instanceof FormData ? undefined : { id },
    });
    return response.data;
  },

  async deletePartner(id: number): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`Partners/panel/delete`, {
      params: { id }
    });
    return response.data;
  }
};
