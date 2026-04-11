'use client'

import { MonthPicker } from '@/components/common/month-picker'
import { MonthlyOverview } from '@/components/dashboard/monthly-overview'
import { SpendingChart } from '@/components/dashboard/spending-chart'
import { TrendChart } from '@/components/dashboard/trend-chart'
import { CategoryBreakdown } from '@/components/dashboard/category-breakdown'
import { useAppStore } from '@/lib/stores/app-store'
import { useMonthlySummary } from '@/lib/hooks/use-summary'
import { useMonthlyTrends } from '@/lib/hooks/use-trends'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils/format'

export default function ReportsPage() {
  const { currentMonth, setCurrentMonth } = useAppStore()
  const { summary } = useMonthlySummary(currentMonth)
  const { trends } = useMonthlyTrends(currentMonth, 6)

  return (
    <div className="max-w-lg mx-auto">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold">Báo cáo</h1>
      </div>

      <MonthPicker month={currentMonth} onChange={setCurrentMonth} />

      <div className="space-y-5 pb-6">
        <MonthlyOverview summary={summary} />

        <Separator />

        <TrendChart trends={trends} />

        <Separator />

        <SpendingChart
          categories={summary.byCategory}
          totalExpense={summary.totalExpense}
        />

        {summary.byCategory.length > 0 && <Separator />}

        <CategoryBreakdown categories={summary.byCategory} />

        {summary.byCategory.length > 0 && <Separator />}

        {/* Chi tiết thu nhập */}
        {summary.totalIncome > 0 && (
          <div className="px-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Tổng kết tháng
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tổng thu nhập</span>
                <span className="text-green-600 font-medium">
                  +{formatCurrency(summary.totalIncome)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tổng chi tiêu</span>
                <span className="text-red-500 font-medium">
                  -{formatCurrency(summary.totalExpense)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Còn lại</span>
                <span className={summary.balance >= 0 ? 'text-blue-600' : 'text-red-500'}>
                  {formatCurrency(summary.balance)}
                </span>
              </div>
              {summary.totalIncome > 0 && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Tỷ lệ tiết kiệm</span>
                  <span>
                    {Math.max(0, ((summary.totalIncome - summary.totalExpense) / summary.totalIncome) * 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
