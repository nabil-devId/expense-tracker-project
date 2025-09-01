import apiClient from './client';
import {API} from '../constants';

export interface CreateCategoryRequest {
  name: string;
  icon: string;
  color: string;
}

const categoryService = {
  getCategories: async () => {
    const response = await apiClient.get(API.ENDPOINTS.CATEGORIES.LIST);
    return response.data;
  },

  createCategory: async (data: CreateCategoryRequest) => {
    const response = await apiClient.post(API.ENDPOINTS.CATEGORIES.LIST, data);
    return response.data;
  },

  updateCategory: async (categoryId: string, data: CreateCategoryRequest) => {
    const response = await apiClient.put(
      API.ENDPOINTS.CATEGORIES.DETAIL(categoryId),
      data,
    );
    return response.data;
  },

  deleteCategory: async (categoryId: string) => {
    const response = await apiClient.delete(
      API.ENDPOINTS.CATEGORIES.DETAIL(categoryId),
    );
    return response.data;
  },
};

export default categoryService;
