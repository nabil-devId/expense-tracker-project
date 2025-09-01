import apiClient from './client';
import {API} from '../constants';

interface ExpenseFilters {
  from_date?: string;
  to_date?: string;
  category?: string;
  merchant?: string;
  min_amount?: number;
  max_amount?: number;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

interface ExpenseItem {
  name: string;
  quantity: number;
  unit_price: number | string;
  total_price: number | string;
}

interface CreateExpenseData {
  merchant_name: string;
  total_amount: number | string;
  transaction_date: string;
  category_id?: string;
  user_category_id?: string;
  payment_method?: string;
  location_name?: string;
  notes?: string;
  receipt_image?: string; // base64 encoded image
  items?: ExpenseItem[];
}

interface UpdateExpenseData extends Partial<CreateExpenseData> {
  expense_id: string;
}

const expenseService = {
  getExpenses: async (filters: ExpenseFilters = {}) => {
    const params = new URLSearchParams();

    // Add filters to params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(
      `${API.ENDPOINTS.EXPENSES.LIST}?${params.toString()}`,
    );
    return response.data;
  },

  getExpenseById: async (expenseId: string) => {
    const response = await apiClient.get(
      API.ENDPOINTS.EXPENSES.DETAIL(expenseId),
    );
    return response.data;
  },

  createExpense: async (expenseData: CreateExpenseData) => {
    const response = await apiClient.post(
      API.ENDPOINTS.EXPENSES.CREATE,
      expenseData,
    );
    return response.data;
  },

  updateExpense: async (
    expenseId: string,
    expenseData: Partial<UpdateExpenseData>,
  ) => {
    const response = await apiClient.put(
      API.ENDPOINTS.EXPENSES.UPDATE(expenseId),
      expenseData,
    );
    return response.data;
  },

  deleteExpense: async (expenseId: string) => {
    const response = await apiClient.delete(
      API.ENDPOINTS.EXPENSES.DELETE(expenseId),
    );
    return response.data;
  },

  uploadReceipt: async (expenseId: string, receiptImage: string) => {
    const formData = new FormData();
    formData.append('receipt_image', receiptImage);

    const response = await apiClient.post(
      API.ENDPOINTS.EXPENSES.UPLOAD_RECEIPT(expenseId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  },

  scanReceipt: async (receiptImage: string) => {
    const formData = new FormData();
    formData.append('receipt_image', receiptImage);

    const response = await apiClient.post(
      API.ENDPOINTS.EXPENSES.SCAN_RECEIPT,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  },
};

export default expenseService;
