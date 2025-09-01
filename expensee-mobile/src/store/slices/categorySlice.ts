import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Category {
  category_id: string;
  user_category_id: string;
  name: string;
  icon: string;
  color: string;
}

export interface CategoryState {
  defaultCategories: Category[];
  userCategories: Category[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  defaultCategories: [],
  userCategories: [],
  isLoading: false,
  error: null,
};

export const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    fetchCategoriesStart: state => {
      state.isLoading = true;
      state.error = null;
    },
    fetchCategoriesSuccess: (
      state,
      action: PayloadAction<{
        defaultCategories: Category[];
        userCategories: Category[];
      }>,
    ) => {
      state.isLoading = false;
      state.defaultCategories = action.payload.defaultCategories;
      state.userCategories = action.payload.userCategories;
    },
    fetchCategoriesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createUserCategorySuccess: (state, action: PayloadAction<Category>) => {
      state.userCategories.push(action.payload);
    },
    updateUserCategorySuccess: (state, action: PayloadAction<Category>) => {
      const index = state.userCategories.findIndex(
        cat => cat.user_category_id === action.payload.user_category_id,
      );
      if (index !== -1) {
        state.userCategories[index] = action.payload;
      }
    },
    deleteUserCategorySuccess: (state, action: PayloadAction<string>) => {
      state.userCategories = state.userCategories.filter(
        cat => cat.user_category_id !== action.payload,
      );
    },
  },
});

export const {
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  createUserCategorySuccess,
  updateUserCategorySuccess,
  deleteUserCategorySuccess,
} = categorySlice.actions;

export default categorySlice.reducer;
