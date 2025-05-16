import { News, NewsSets } from '@/containers/news/type/news-type';
import { axiosInstance } from '@/lib/axios';


export interface NewsResponse {
  items: News[];
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

export const newsService = {
  async getNews(page: number = 1, pageSize: number = 10): Promise<ApiResponse<NewsResponse>> {
    const response = await axiosInstance.get('/News/panel/get-all-with-pagination', {
      params: { page, pageSize }
    });
    return response.data;
  },

  async getNewsById(id: number): Promise<ApiResponse<News>> {
    const response = await axiosInstance.get('/News/panel/get-by-id', {
      params: { id }
    });
    return response.data;
  },

  async createNews({
    newsSets,
    images,
    coverImage
  }: {
    newsSets: NewsSets[];
    images: File[];
    coverImage: File | null;
  }): Promise<ApiResponse<News>> {
    const formData = new FormData();
    // formData.append('newsSets', JSON.stringify(newsSets));
    newsSets.forEach((item, index) => {
        formData.append(`newsSets[${index}].title`, item.title);
        formData.append(`newsSets[${index}].description`, item.description);
        formData.append(`newsSets[${index}].language`, item.language);
      });
    images.forEach((file) => {
      formData.append('images', file);
    });
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    const response = await axiosInstance.post('/news/panel/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async updateNews({
    id,
    newsSets,
    images,
    coverImage,
    deletedImgId,
  }: {
    id: number;
    newsSets: NewsSets[];
    images: File[];
    coverImage: File | null;
    deletedImgId: number[];
  }): Promise<ApiResponse<News>> {
    const formData = new FormData();
    formData.append("Id", String(id));
    // formData.append("NewsSets", JSON.stringify(newsSets));
    newsSets.forEach((item, index) => {
        formData.append(`newsSets[${index}].title`, item.title);
        formData.append(`newsSets[${index}].description`, item.description);
        formData.append(`newsSets[${index}].language`, item.language);
      });
    images.forEach((file) => {
      formData.append("Images", file);
    });
    if (coverImage) {
      formData.append("CoverImage", coverImage);
    }
    deletedImgId.forEach((imgId) => {
      formData.append("DeletedImgId", String(imgId));
    });

    const response = await axiosInstance.put("/News/panel/update", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async deleteNews(id: number): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`News/panel/delete`, {
      params: { id }
    });
    return response.data;
  }
};
