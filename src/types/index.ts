export interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  categoryId: string
  note: string
  date: string // ISO date: "2026-04-11"
  recurringPaymentId?: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  type: 'income' | 'expense'
  isDefault: boolean
  sortOrder: number
}

export interface RecurringPayment {
  id: string
  name: string
  type: 'income' | 'expense'
  amount: number
  categoryId: string
  dayOfMonth: number
  isActive: boolean
  startDate: string
  endDate?: string
  lastGeneratedMonth?: string // "2026-04"
}

export interface MonthlySummary {
  totalIncome: number
  totalExpense: number
  balance: number
  byCategory: CategorySummary[]
}

export interface CategorySummary {
  categoryId: string
  categoryName: string
  categoryIcon: string
  categoryColor: string
  total: number
  count: number
  percentage: number
}

export interface Budget {
  id: string
  categoryId: string
  amount: number // giới hạn chi tiêu
  month: string // "2026-04" hoặc "all" cho mọi tháng
}

export interface BudgetStatus {
  categoryId: string
  categoryName: string
  categoryIcon: string
  categoryColor: string
  budgetAmount: number
  spentAmount: number
  percentage: number
  isOverBudget: boolean
}

export type TransactionType = 'income' | 'expense'
