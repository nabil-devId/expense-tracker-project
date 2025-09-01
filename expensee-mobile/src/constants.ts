// API Constants
export const API = {
  BASE_URL: 'https://d6086731ac2c.ngrok-free.app',
  // BASE_URL: 'https://4d5a932dc9fd.ngrok-free.app',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/v1/auth/login',
      REGISTER: '/api/v1/auth/register',
      REFRESH: '/api/v1/auth/refresh',
      LOGOUT: '/api/v1/auth/logout',
      FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
      RESET_PASSWORD: '/api/v1/auth/reset-password',
    },
    USER: {
      PROFILE: '/api/v1/users/profile',
      ME: '/api/v1/users/me',
    },
    RECEIPTS: {
      UPLOAD: '/api/v1/receipts/upload',
      UPLOAD_GEMINI: '/api/v1/receipts/gemini/upload',
      STATUS: (ocrId: string) => `/api/v1/receipts/${ocrId}/status`,
      OCR_RESULTS: (ocrId: string) => `/api/v1/receipts/${ocrId}`,
      FEEDBACK: (ocrId: string) => `/api/v1/receipts/${ocrId}/feedback`,
      ACCEPT: (ocrId: string) => `/api/v1/receipts/${ocrId}/accept`,
    },
    EXPENSES: {
      LIST: '/api/v1/expenses',
      DETAIL: (expenseId: string) => `/api/v1/expenses/${expenseId}`,
      CREATE: '/api/v1/expenses',
      UPDATE: (expenseId: string) => `/api/v1/expenses/${expenseId}`,
      DELETE: (expenseId: string) => `/api/v1/expenses/${expenseId}`,
      UPLOAD_RECEIPT: (expenseId: string) =>
        `/api/v1/expenses/${expenseId}/receipt`,
      SCAN_RECEIPT: '/api/v1/expenses/scan-receipt',
    },
    CATEGORIES: {
      LIST: '/api/v1/categories',
      DETAIL: (categoryId: string) => `/api/v1/categories/${categoryId}`,
    },
    BUDGETS: {
      LIST: '/api/v1/budgets',
      DETAIL: (budgetId: string) => `/api/v1/budgets/${budgetId}`,
      PROGRESS: '/api/v1/budgets/progress',
    },
    ANALYTICS: {
      TRENDS: '/api/v1/analytics/trends',
      CATEGORY_DISTRIBUTION: '/api/v1/analytics/category-distribution',
      MERCHANTS: '/api/v1/analytics/merchants',
    },
  },
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_INFO: 'user_info',
};

// Navigation Routes
export const ROUTES = {
  AUTH: {
    LOGIN: 'Login',
    REGISTER: 'Register',
    FORGOT_PASSWORD: 'ForgotPassword',
    RESET_PASSWORD: 'ResetPassword',
  },
  MAIN: {
    HOME: 'Home',
    EXPENSES: 'Expenses',
    BUDGETS: 'Budgets',
    ANALYTICS: 'Analytics',
    SCAN: 'Scan',
    PROFILE: 'Profile',
  },
  SCAN: {
    SCAN: 'ScanCamera',
    SCAN_RESULT: 'ScanResult',
  },
  EXPENSES: {
    LIST: 'ExpensesList',
    DETAIL: 'ExpenseDetail',
    CREATE: 'CreateExpense',
    EDIT: 'EditExpense',
    SCAN: 'ScanReceipt',
  },
  BUDGETS: {
    LIST: 'BudgetsList',
    CREATE: 'CreateBudget',
    EDIT: 'EditBudget',
  },
  PROFILE: {
    LIST: 'ProfileList',
    CATEGORIES: 'CategoryList',
    ADD_CATEGORY: 'AddCategory',
    USER_PROFILE_EDIT: 'UserProfileEdit',
    ANALYTICS: 'Analytics',
  },
};

// Form Validation
export const VALIDATION = {
  EMAIL_REGEX: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  PASSWORD_MIN_LENGTH: 8,
};

// Theme
export const THEME = {
  COLORS: {
    PRIMARY: '#0A3D62',
    PRIMARY_LIGHT: '#1560A0',
    PRIMARY_DARK: '#072D47',
    ACCENT_BLUE: '#3498db',
    ACCENT_ORANGE: '#e67e22',
    POSITIVE: '#2ecc71',
    NEGATIVE: '#e74c3c',
    NEUTRAL: '#3498db',
    LIGHT_BACKGROUND: '#f5f7fa',
    LIGHT_SURFACE: '#ffffff',
    LIGHT_TEXT_PRIMARY: '#2d3436',
    LIGHT_TEXT_SECONDARY: '#636e72',
    DARK_BACKGROUND: '#1e272e',
    DARK_SURFACE: '#2d3436',
    DARK_TEXT_PRIMARY: '#f5f7fa',
    DARK_TEXT_SECONDARY: '#b2bec3',
    GRAY_LIGHT: '#f5f7fa',
  },
};
