import apiClient from './client';
import {API} from '../constants';

export interface BudgetPeriod {
  period: 'monthly' | 'quarterly' | 'yearly';
}

export interface CreateBudgetRequest {
  amount: number | string;
  month: number;
  year: number;
  category_id?: string | null;
  user_category_id?: string | null;
  budget_name: string;
}

const budgetService = {
  getBudgets: async (
    period_month?: number,
    period_year?: number,
    activeOn?: string,
  ) => {
    const params = new URLSearchParams();

    if (period_month) {
      params.append('month', period_month.toString());
    }

    if (period_year) {
      params.append('year', period_year.toString());
    }

    const response = await apiClient.get(
      `${API.ENDPOINTS.BUDGETS.LIST}?${params.toString()}`,
    );
    return response.data;
  },

  createBudget: async (data: CreateBudgetRequest) => {
    const response = await apiClient.post(API.ENDPOINTS.BUDGETS.LIST, data);
    return response.data;
  },

  updateBudget: async (budgetId: string, data: CreateBudgetRequest) => {
    const response = await apiClient.put(
      API.ENDPOINTS.BUDGETS.DETAIL(budgetId),
      data,
    );
    return response.data;
  },

  deleteBudget: async (budgetId: string) => {
    const response = await apiClient.delete(
      API.ENDPOINTS.BUDGETS.DETAIL(budgetId),
    );
    return response.data;
  },
  getBudgetById: async (budgetId: string) => {
    const response = await apiClient.get(
      API.ENDPOINTS.BUDGETS.DETAIL(budgetId),
    );
    return response.data;
  },
};

export default budgetService;
