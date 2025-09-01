import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface CategoryInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
  is_custom: boolean;
}

export interface OverallBudget {
  amount: string;
  current_spending: string;
  remaining: string;
  percentage_used: string;
}

export interface Budget {
  budget_id: string;
  amount: string;
  month: number;
  year: number;
  category: CategoryInfo | null;
  created_at: string;
}

export interface BudgetWithSpending {
  budget_id: string;
  amount: string;
  month: number;
  year: number;
  budget_name: string;
  category: CategoryInfo | null;
  created_at: string;
  current_spending: string;
  remaining: string;
  percentage_used: string;
}

export interface CategoryBudgetProgress {
  category: CategoryInfo;
  budget_amount: string;
  current_spending: string;
  remaining: string;
  percentage_used: string;
  status: 'under_budget' | 'approaching_limit' | 'over_budget';
}

export interface BudgetState {
  budgets: Budget[];
  overallBudget: OverallBudget | null;
  isLoading: boolean;
  error: string | null;
  activePeriod: 'monthly' | 'quarterly' | 'yearly';
  activeDate: string | null; // ISO date string
}

const initialState: BudgetState = {
  budgets: [],
  overallBudget: null,
  isLoading: false,
  error: null,
  activePeriod: 'monthly',
  activeDate: null,
};

export const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    fetchBudgetsStart: state => {
      state.isLoading = true;
      state.error = null;
    },
    fetchBudgetsSuccess: (
      state,
      action: PayloadAction<{
        budgets: Budget[];
        overall_budget: OverallBudget | null;
      }>,
    ) => {
      state.isLoading = false;
      state.budgets = action.payload.budgets;
      state.overallBudget = action.payload.overall_budget;
    },
    fetchBudgetsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createBudgetSuccess: (state, action: PayloadAction<Budget>) => {
      state.budgets.push(action.payload);
    },
    updateBudgetSuccess: (state, action: PayloadAction<Budget>) => {
      const index = state.budgets.findIndex(
        budget => budget.budget_id === action.payload.budget_id,
      );
      if (index !== -1) {
        state.budgets[index] = action.payload;
      }
    },
    deleteBudgetSuccess: (state, action: PayloadAction<string>) => {
      state.budgets = state.budgets.filter(
        budget => budget.budget_id !== action.payload,
      );
    },
    setPeriodFilter: (
      state,
      action: PayloadAction<'monthly' | 'quarterly' | 'yearly'>,
    ) => {
      state.activePeriod = action.payload;
    },
    setDateFilter: (state, action: PayloadAction<string | null>) => {
      state.activeDate = action.payload;
    },
  },
});

export const {
  fetchBudgetsStart,
  fetchBudgetsSuccess,
  fetchBudgetsFailure,
  createBudgetSuccess,
  updateBudgetSuccess,
  deleteBudgetSuccess,
  setPeriodFilter,
  setDateFilter,
} = budgetSlice.actions;

export default budgetSlice.reducer;
