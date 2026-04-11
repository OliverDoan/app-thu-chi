'use client'

import { MonthPicker } from '@/components/common/month-picker'
import { MonthlyOverview } from '@/components/dashboard/monthly-overview'
import { CategoryBreakdown } from '@/components/dashboard/category-breakdown'
import { SpendingChart } from '@/components/dashboard/spending-chart'
import { BudgetOverview } from '@/components/dashboard/budget-overview'
import { TransactionList } from '@/components/transactions/transaction-list'
import { useAppStore } from '@/lib/stores/app-store'
import { useMonthlySummary } from '@/lib/hooks/use-summary'
import { useTransactionsByMonth } from '@/lib/hooks/use-transactions'
import { useBudgetStatuses } from '@/lib/hooks/use-budgets'
import { Separator } from '@/components/ui/separator'

export default function DashboardPage() {
  const { currentMonth, setCurrentMonth } = useAppStore()
  const { summary } = useMonthlySummary(currentMonth)
  const { transactions } = useTransactionsByMonth(currentMonth)
  const { statuses: budgetStatuses } = useBudgetStatuses(currentMonth)

  const recentTransactions = transactions.slice(0, 5)

  return (
    <div className="max-w-lg mx-auto">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold">Tổng quan</h1>
      </div>

      <MonthPicker month={currentMonth} onChange={setCurrentMonth} />

      <div className="space-y-4 pb-6">
        <MonthlyOverview summary={summary} />

        <Separator />

        <SpendingChart
          categories={summary.byCategory}
          totalExpense={summary.totalExpense}
        />

        {summary.byCategory.length > 0 && <Separator />}

        <CategoryBreakdown categories={summary.byCategory} />

        {summary.byCategory.length > 0 && <Separator />}

        <BudgetOverview statuses={budgetStatuses} />

        {budgetStatuses.length > 0 && <Separator />}

        <div className="px-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">
            Giao dịch gần đây
          </h3>
        </div>
        <TransactionList transactions={recentTransactions} />
      </div>
    </div>
  )
}
