import type { Category } from '@/types'

export const DEFAULT_CATEGORIES: Category[] = [
  // Chi tiêu
  { id: 'expense-food', name: 'Ăn uống', icon: 'Utensils', color: '#ef4444', type: 'expense', isDefault: true, sortOrder: 1 },
  { id: 'expense-transport', name: 'Di chuyển', icon: 'Car', color: '#f97316', type: 'expense', isDefault: true, sortOrder: 2 },
  { id: 'expense-housing', name: 'Nhà ở', icon: 'Home', color: '#eab308', type: 'expense', isDefault: true, sortOrder: 3 },
  { id: 'expense-utilities', name: 'Điện nước', icon: 'Zap', color: '#84cc16', type: 'expense', isDefault: true, sortOrder: 4 },
  { id: 'expense-shopping', name: 'Mua sắm', icon: 'ShoppingBag', color: '#06b6d4', type: 'expense', isDefault: true, sortOrder: 5 },
  { id: 'expense-entertainment', name: 'Giải trí', icon: 'Gamepad2', color: '#8b5cf6', type: 'expense', isDefault: true, sortOrder: 6 },
  { id: 'expense-health', name: 'Sức khỏe', icon: 'Heart', color: '#ec4899', type: 'expense', isDefault: true, sortOrder: 7 },
  { id: 'expense-education', name: 'Giáo dục', icon: 'GraduationCap', color: '#14b8a6', type: 'expense', isDefault: true, sortOrder: 8 },
  { id: 'expense-other', name: 'Khác', icon: 'MoreHorizontal', color: '#6b7280', type: 'expense', isDefault: true, sortOrder: 9 },

  // Thu nhập
  { id: 'income-salary', name: 'Lương', icon: 'Banknote', color: '#22c55e', type: 'income', isDefault: true, sortOrder: 1 },
  { id: 'income-bonus', name: 'Thưởng', icon: 'Gift', color: '#3b82f6', type: 'income', isDefault: true, sortOrder: 2 },
  { id: 'income-investment', name: 'Đầu tư', icon: 'TrendingUp', color: '#a855f7', type: 'income', isDefault: true, sortOrder: 3 },
  { id: 'income-other', name: 'Khác', icon: 'MoreHorizontal', color: '#6b7280', type: 'income', isDefault: true, sortOrder: 4 },
]
