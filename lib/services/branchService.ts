import { Branch } from '@/containers/branch/types/branch-type';
import { axiosInstance } from '@/lib/axios';


export interface BranchResponse {
  items: Branch[];
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

export const branchService = {
  async getBranches(page: number = 1, pageSize: number = 10): Promise<ApiResponse<BranchResponse>> {
    const response = await axiosInstance.get('/Branches/panel/get-all-with-pagination', {
      params: { page, pageSize }
    });
    return response.data;
  },

  async getBranchById(id: number): Promise<ApiResponse<Branch>> {
    const response = await axiosInstance.get('/Branches/panel/get-by-id', {
      params: { id }
    });
    return response.data;
  },

  async createBranch(data: Omit<Branch, "id">): Promise<ApiResponse<Branch>> {
    const response = await axiosInstance.post('/Branches/panel/create', data);
    return response.data;
  },

  async updateBranch({ id, branch }: { id: number; branch: Partial<Branch> }): Promise<ApiResponse<Branch>> {
    const response = await axiosInstance.put('/Branches/panel/update', {
      id,
      ...branch
    });
    return response.data;
  },

  async deleteBranch(id: number): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`/Branches/panel/delete`, {
      params: { id }
    });
    return response.data;
  }
};
