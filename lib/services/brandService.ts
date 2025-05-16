import { Brand } from '@/containers/brand/types/brand-type';
import { axiosInstance } from '@/lib/axios';


export interface BrandResponse {
  items: Brand[];
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

export const brandService = {
  async getBrands(page: number = 1, pageSize: number = 10): Promise<ApiResponse<BrandResponse>> {
    const response = await axiosInstance.get('/Brands/panel/get-all-with-pagination', {
      params: { pageNumber: page, pageSize: pageSize }
    });
    return response.data;
  },

  async getBrandById(id: number): Promise<ApiResponse<Brand>> {
    const response = await axiosInstance.get('/Brands/panel/get', {
      params: { id }
    });
    return response.data;
  },

  async createBrand(data: Omit<Brand, "id">): Promise<ApiResponse<Brand>> {
    const response = await axiosInstance.post('/Brands/panel/create', data);
    return response.data;
  },

  async updateBrand({ id, brand }: { id: number; brand: Partial<Brand> }): Promise<ApiResponse<Brand>> {
    const response = await axiosInstance.put('/Brands/panel/update', {
      id,
      ...brand
    });
    return response.data;
  },

  async deleteBrand(id: number): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`/Brands/panel/delete`, {
      params: { id }
    });
    return response.data;
  }
};
