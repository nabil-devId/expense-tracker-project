import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface ExpenseItem {
  name: string;
  quantity: number;
  unit_price: string;
  total_price: string;
}

export interface Category {
  category_id: string;
  user_category_id: string;
  name: string;
  icon: string;
  color: string;
  is_custom: boolean;
}

export interface Expense {
  expense_id: string;
  merchant_name: string;
  total_amount: string;
  transaction_date: string;
  payment_method: string | null;
  category: Category;
  user_category: Category;
  notes: string | null;
  has_receipt_image: boolean;
  created_at: string;
}

export interface ExpenseDetail extends Expense {
  location_name?: string | null;
  ocr_id: string | null;
  receipt_image_url: string | null;
  items: ExpenseItem[];
  updated_at: string;
  is_manual_entry: boolean;
}

export interface ExpenseSummary {
  total_expenses: string;
  avg_expense: string;
  max_expense: string;
  min_expense: string;
  expense_by_category: Record<string, string>;
}

export interface PaginationInfo {
  total_count: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ExpenseState {
  expenses: Expense[];
  currentExpense: ExpenseDetail | null;
  pagination: PaginationInfo;
  summary: ExpenseSummary | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    fromDate: string | null;
    toDate: string | null;
    category: string | null;
    merchant: string | null;
    minAmount: number | null;
    maxAmount: number | null;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
}

const initialState: ExpenseState = {
  expenses: [],
  currentExpense: null,
  pagination: {
    total_count: 0,
    page: 1,
    limit: 20,
    total_pages: 0,
  },
  summary: null,
  isLoading: false,
  error: null,
  filters: {
    fromDate: null,
    toDate: null,
    category: null,
    merchant: null,
    minAmount: null,
    maxAmount: null,
    sortBy: 'transaction_date',
    sortOrder: 'desc',
  },
};

export const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    fetchExpensesStart: state => {
      state.isLoading = true;
      state.error = null;
    },
    fetchExpensesSuccess: (
      state,
      action: PayloadAction<{
        expenses: Expense[];
        pagination: PaginationInfo;
        summary: ExpenseSummary;
      }>,
    ) => {
      state.isLoading = false;
      state.expenses = action.payload.expenses;
      state.pagination = action.payload.pagination;
      state.summary = action.payload.summary;
    },
    fetchExpensesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchExpenseDetailStart: state => {
      state.isLoading = true;
      state.error = null;
    },
    fetchExpenseDetailSuccess: (
      state,
      action: PayloadAction<ExpenseDetail>,
    ) => {
      state.isLoading = false;
      console.log('currentExpense', action.payload);

      state.currentExpense = action.payload;
    },
    fetchExpenseDetailFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createExpenseStart: state => {
      state.isLoading = true;
      state.error = null;
    },
    createExpenseSuccess: (state, action: PayloadAction<Expense>) => {
      state.isLoading = false;
      state.expenses = [action.payload, ...state.expenses];
      state.error = null;
    },
    createExpenseFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateExpenseStart: state => {
      state.isLoading = true;
      state.error = null;
    },
    updateExpenseFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    deleteExpenseStart: state => {
      state.isLoading = true;
      state.error = null;
    },
    deleteExpenseSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.expenses = state.expenses.filter(
        expense => expense.expense_id !== action.payload,
      );
      state.currentExpense = null;
      state.error = null;
    },
    deleteExpenseFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    scanReceiptStart: state => {
      state.isLoading = true;
      state.error = null;
    },
    scanReceiptSuccess: state => {
      state.isLoading = false;
      state.error = null;
    },
    scanReceiptFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    resetExpenseError: state => {
      state.error = null;
    },
    clearCurrentExpense: state => {
      state.currentExpense = null;
    },
    updateFilters: (
      state,
      action: PayloadAction<Partial<ExpenseState['filters']>>,
    ) => {
      state.filters = {...state.filters, ...action.payload};
      state.pagination.page = 1; // Reset to first page when filters change
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
  },
});

export const {
  fetchExpensesStart,
  fetchExpensesSuccess,
  fetchExpensesFailure,
  fetchExpenseDetailStart,
  fetchExpenseDetailSuccess,
  fetchExpenseDetailFailure,
  createExpenseStart,
  createExpenseSuccess,
  createExpenseFailure,
  updateExpenseStart,
  updateExpenseFailure,
  deleteExpenseStart,
  deleteExpenseSuccess,
  deleteExpenseFailure,
  scanReceiptStart,
  scanReceiptSuccess,
  scanReceiptFailure,
  resetExpenseError,
  clearCurrentExpense,
  updateFilters,
  setPage,
} = expenseSlice.actions;

export default expenseSlice.reducer;
