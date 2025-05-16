import { axiosInstance } from '@/lib/axios';

export interface Category {
  id: number;
  name: string;
  // parentCategoryId:number;
  parentCategoryName:string;
  parentId:number;
}

export interface CategoryResponse {
  items: Category[];
  pageNumber: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  parentId: number;

}

export interface ApiResponse<T> {
  responseValue: T;
  statusCode: number;
  message: string;
}

export const categoryService = {

  async getCategory(page: number = 1, pageSize: number = 10,searchTerm: string = ''): Promise<ApiResponse<CategoryResponse>> {
    const response = await axiosInstance.get('/Category/panel/get-all-with-pagination', {
      params: {   PageNumber: page, PageSize: pageSize,SearchTerm:searchTerm }
    });
    return response.data;
  },
  async getCategoryAll(): Promise<ApiResponse<Category[]>> {
    const response = await axiosInstance.get('/Category/panel/get-all');
    return response.data;
  },
  async CategoryById(id: number): Promise<ApiResponse<Category>> {
    const response = await axiosInstance.get(`/Category/panel/get`,{
      params:{
        id
      }
    });
    return response.data;
  },
  async createCategory(category: Category): Promise<ApiResponse<Category>> {
    const response = await axiosInstance.post('/Category/panel/create', category);
    return response.data;
  },
  async updateCategory(id: number, category: Category): Promise<ApiResponse<Category>> {
    const response = await axiosInstance.put(`/Category/panel/update`, category);
    return response.data;
  },
  async deleteCategory(id: number): Promise<ApiResponse<Category>> {
    const response = await axiosInstance.delete(`/Category/panel/delete`,{
      params:{
        id
      }
    })
    return response.data;

  },
  async getCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const response = await axiosInstance.get('/Category/panel/get-all');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async getCategorySearch(searchTerm: string): Promise<ApiResponse<{ id: number; name: string }[]>> {
    const response = await axiosInstance.get('/Category/panel/get-searched', {
      params: { searchTerm }
    });
    return response.data;
  },
}
