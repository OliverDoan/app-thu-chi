import { transactionRepository } from '@/lib/repositories/transaction-repository'
import { getPreviousMonth, formatMonthYearShort } from '@/lib/utils/date'

export interface MonthlyTrend {
  month: string
  label: string
  income: number
  expense: number
}

export async function getMonthlyTrends(currentMonth: string, count: number = 6): Promise<MonthlyTrend[]> {
  const months: string[] = []
  let m = currentMonth
  for (let i = 0; i < count; i++) {
    months.unshift(m)
    m = getPreviousMonth(m)
  }

  const trends: MonthlyTrend[] = []
  for (const month of months) {
    const transactions = await transactionRepository.getByMonth(month)
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    trends.push({
      month,
      label: formatMonthYearShort(month),
      income,
      expense,
    })
  }

  return trends
}
