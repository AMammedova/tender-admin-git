import { axiosInstance } from '@/lib/axios';

export interface Product {
  id: number;
  title: string;
  detail: string;
  categoryDto: {
    id: number;
    name: string;
  };
  attributeDtos: any[];
  image: (File | { imageUrl: string })[];
  productImageDto?: { id: number; imageUrl: string }[];
}

export interface ProductResponse {
  responseValue: Product[];
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

export const productService = {
  async getProducts({
    CategoryIds,
    SearchTerm,
    CreatedFrom,
    CreatedTo,
    PageNumber = 1,
    PageSize = 10,
  }: {
    CategoryIds?: number[];
    SearchTerm?: string;
    CreatedFrom?: string;
    CreatedTo?: string;
    PageNumber?: number;
    PageSize?: number;
  } = {}): Promise<ApiResponse<ProductResponse>> {
    try {
      // Create URLSearchParams object for building the query string
      const params = new URLSearchParams();
      
      // Add standard parameters
      params.append('PageNumber', PageNumber.toString());
      params.append('PageSize', PageSize.toString());
      
      // Add optional parameters if they exist
      if (SearchTerm) params.append('SearchTerm', SearchTerm);
      if (CreatedFrom) params.append('CreatedFrom', CreatedFrom);
      if (CreatedTo) params.append('CreatedTo', CreatedTo);
      
      // Handle multiple category IDs
      if (CategoryIds && CategoryIds.length > 0) {
        CategoryIds.forEach(categoryId => {
          params.append('CategoryIds', categoryId.toString());
        });
      }
      
      // Make API request with properly formatted query string
      const response = await axiosInstance.get(`/Products/panel/get-sorted-products?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getProductById(id: number): Promise<ApiResponse<Product>> {
    try {
      const response = await axiosInstance.get('/Products/panel/get-by-id', {
        params: { id }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async createProduct(data: FormData | Omit<Product, "id">): Promise<ApiResponse<Product>> {
    try {
      const response = await axiosInstance.post('/Products/panel/create', data, {
        headers: data instanceof FormData ? {
          'Content-Type': 'multipart/form-data',
        } : {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  async updateProduct(formData: FormData): Promise<ApiResponse<Product>> {
    try {
      const response = await axiosInstance.put('/Products/panel/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteProduct(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await axiosInstance.delete(`Products/panel/delete`, {
        params: { id }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteProductImage(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await axiosInstance.delete('/Products/panel/delete-image', {
        params: { id }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAttributesByProduct(categoryId?: number, productId?: number) {
    try {
      const response = await axiosInstance.get(
        `/Attributes/panel/get-all-by-product-category-id`,
        { params: { categoryId, productId } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async setProductAttributes(productId: number, attributes: any[]) {
    try {
      const response = await axiosInstance.post(
        `/Attributes/panel/set-product-attributes`,
        { productId, attributes }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async addAttributeValue({ value, attributeId, categoryId }: { value: string, attributeId: number, categoryId: number }) {
    try {
      const response = await axiosInstance.post('/AttributeValues/panel/create', {
        value,
        attributeId,
        categoryId
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async setProductAttributeValues(productId: number, attributeValueDtos: { attributeId: number, attributeValueId: number }[]) {
    try {
      const response = await axiosInstance.post('/ProductAttributes/panel/Create', {
        productId,
        attributeValueDtos
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateProductAttributeValues(productId: number, attributeValueDtos: { attributeId: number, attributeValueId: number }[]) {
    try {
      const response = await axiosInstance.put('/ProductAttributes/panel/update', {
        productId,
        attributeValueDtos
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};