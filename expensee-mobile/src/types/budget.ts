/**
 * Represents a budget created by the user.
 */
export interface Budget {
  /**
   * Unique identifier for the budget (e.g., UUID).
   */
  id: string;

  /**
   * User-defined name for the budget (e.g., "Groceries Monthly").
   */
  name: string;

  /**
   * The total allocated amount for this budget.
   */
  amount: number;

  /**
   * The ID of the single category this budget applies to.
   * For MVP, budgets are tied to one category.
   */
  categoryId: string;

  /**
   * The time period for the budget.
   * 'monthly': Resets on the 1st of each month.
   * 'weekly': Resets every Monday (or a defined start day of the week).
   */
  period: 'monthly' | 'weekly';

  /**
   * The date when this budget period officially starts.
   * For 'monthly', this would be the 1st of the month.
   * For 'weekly', this would be the start day of that week (e.g., Monday).
   */
  startDate: string; // ISO 8601 date string (e.g., "2024-07-01")

  /**
   * The date when this budget period officially ends.
   * For 'monthly', this would be the last day of the month.
   * For 'weekly', this would be the end day of that week (e.g., Sunday).
   * This is typically derived from startDate and period.
   */
  endDate: string; // ISO 8601 date string (e.g., "2024-07-31")

  /**
   * Timestamp of when the budget was created.
   */
  createdAt: string; // ISO 8601 datetime string (e.g., "2024-07-15T10:00:00Z")

  /**
   * Timestamp of when the budget was last updated.
   */
  updatedAt: string; // ISO 8601 datetime string (e.g., "2024-07-15T10:00:00Z")

  /**
   * Flag indicating if the budget is currently paused.
   * If true, expenses are not tracked against this budget temporarily.
   * Defaults to false.
   */
  isPaused?: boolean;
}

/**
 * Represents the data required to create a new budget.
 * Omits fields that are auto-generated or derived (id, createdAt, updatedAt, endDate, isPaused).
 */
export type NewBudgetPayload = Omit<
  Budget,
  'id' | 'createdAt' | 'updatedAt' | 'endDate' | 'isPaused'
>;

/**
 * Represents the data allowed when updating an existing budget.
 * All fields are optional, and 'id' is used for identification.
 */
export type UpdateBudgetPayload = Partial<Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>> & {
  id: string;
};
