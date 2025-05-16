import { axiosInstance } from '@/lib/axios';

export interface Region {
  id: number;
  name: string;
}

export interface RegionResponse {
  items: Region[];
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

export const regionService = {
  async getRegions(page: number = 1, pageSize: number = 10): Promise<ApiResponse<RegionResponse>> {
    const response = await axiosInstance.get('/Regions/get-all-with-pagination', {
      params: { pageNumber: page, pageSize: pageSize }
    });
    return response.data;
  },

  async getRegionById(id: number): Promise<ApiResponse<Region>> {
    const response = await axiosInstance.get('/Regions/get-by-id', {
      params: { id }
    });
    return response.data;
  },

  async createRegion(data: Omit<Region, "id">): Promise<ApiResponse<Region>> {
    const response = await axiosInstance.post('/Regions/create', data);
    return response.data;
  },

  async updateRegion({ id, region }: { id: number; region: Partial<Region> }): Promise<ApiResponse<Region>> {
    const response = await axiosInstance.put('/Regions/update', {
      id,
      ...region
    });
    return response.data;
  },

  async deleteRegion(id: number): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`Regions/delete`, {
      params: { id }
    });
    return response.data;
  }
};
