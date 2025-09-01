import apiClient from './client';
import {API} from '../constants';

export interface TrendsParams {
  period?: 'weekly' | 'monthly' | 'yearly';
  start_date?: string;
  end_date?: string;
  category_id?: string;
}

export interface DistributionParams {
  start_date?: string;
  end_date?: string;
}

export interface MerchantParams {
  start_date?: string;
  end_date?: string;
  limit?: number;
}

const analyticsService = {
  getExpenseTrends: async (params: TrendsParams = {}) => {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await apiClient.get(
      `${API.ENDPOINTS.ANALYTICS.TRENDS}?${queryParams.toString()}`,
    );
    return response.data;
  },

  getCategoryDistribution: async (params: DistributionParams = {}) => {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await apiClient.get(
      `${
        API.ENDPOINTS.ANALYTICS.CATEGORY_DISTRIBUTION
      }?${queryParams.toString()}`,
    );
    return response.data;
  },

  getMerchantAnalysis: async (params: MerchantParams = {}) => {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await apiClient.get(
      `${API.ENDPOINTS.ANALYTICS.MERCHANTS}?${queryParams.toString()}`,
    );
    return response.data;
  },
};

export default analyticsService;
