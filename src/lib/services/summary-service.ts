import type { Transaction, Category, MonthlySummary, CategorySummary } from '@/types'

export function calculateMonthlySummary(
  transactions: Transaction[],
  categories: Category[]
): MonthlySummary {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const categoryMap = new Map(categories.map((c) => [c.id, c]))

  const expenseByCategory = new Map<string, { total: number; count: number }>()
  for (const t of transactions.filter((t) => t.type === 'expense')) {
    const existing = expenseByCategory.get(t.categoryId) ?? { total: 0, count: 0 }
    expenseByCategory.set(t.categoryId, {
      total: existing.total + t.amount,
      count: existing.count + 1,
    })
  }

  const byCategory: CategorySummary[] = Array.from(expenseByCategory.entries())
    .map(([categoryId, { total, count }]) => {
      const cat = categoryMap.get(categoryId)
      return {
        categoryId,
        categoryName: cat?.name ?? 'Không rõ',
        categoryIcon: cat?.icon ?? 'CircleDot',
        categoryColor: cat?.color ?? '#6b7280',
        total,
        count,
        percentage: totalExpense > 0 ? (total / totalExpense) * 100 : 0,
      }
    })
    .sort((a, b) => b.total - a.total)

  return { totalIncome, totalExpense, balance: totalIncome - totalExpense, byCategory }
}
