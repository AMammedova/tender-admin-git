import { axiosInstance } from '@/lib/axios';

export interface Organization {
  id: number;
  name: string;
  description: string;
  logoFile: string;
  logoUrl: string;
}

export interface OrganizationResponse {
  items: Organization[];
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

export const organizationService = {
  async getOrganizations(page: number = 1, pageSize: number = 10): Promise<ApiResponse<OrganizationResponse>> {
    const response = await axiosInstance.get('/Organizations/panel/get-all-with-pagination', {
      params: { pageNumber: page, pageSize: pageSize }
    });
    return response.data;
  },
  async getOrganizationAll(): Promise<ApiResponse<Organization[]>> {
    const response = await axiosInstance.get('/Organizations/panel/get-all');
    return response.data;
  },

  async getOrganizationById(id: number): Promise<ApiResponse<Organization>> {
    const response = await axiosInstance.get('/Organizations/panel/get-by-id', {
      params: { id }
    });
    return response.data;
  },

  async createOrganization(data: FormData | Omit<Organization, "id">): Promise<ApiResponse<Organization>> {
    const response = await axiosInstance.post('/Organizations/panel/create', data, {
      headers: data instanceof FormData ? {
        'Content-Type': 'multipart/form-data',
      } : {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  async updateOrganization({ id, organization }: { id: number; organization: FormData | Partial<Organization> }): Promise<ApiResponse<Organization>> {
    let dataToSend = organization;
    let headers = { 'Content-Type': 'application/json' };
    if (organization instanceof FormData) {
      dataToSend = organization;
      dataToSend.append('id', id.toString());
      headers = { 'Content-Type': 'multipart/form-data' };
    }
    const response = await axiosInstance.put('/Organizations/panel/update', dataToSend, {
      headers,
      params: organization instanceof FormData ? undefined : { id },
    });
    return response.data;
  },

  async deleteOrganization(id: number): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`Organizations/panel/delete`, {
      params: { id }
    });
    return response.data;
  }
};
