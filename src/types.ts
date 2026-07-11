// src/types.ts
export interface Expense {
  id: number;
  title: string;
  amount: number;
  date: string;
  category: string;
}

export interface CategorySummary {
  category: string;
  total: number;
  count: number;
}

export interface MonthSummary {
  month: string;
  total: number;
}

export interface Summary {
  by_category: CategorySummary[];
  by_month: MonthSummary[];
  total_spent: number;
}