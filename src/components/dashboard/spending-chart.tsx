'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import type { CategorySummary } from '@/types'
import { formatCurrency } from '@/lib/utils/format'

interface SpendingChartProps {
  categories: CategorySummary[]
  totalExpense: number
}

export function SpendingChart({ categories, totalExpense }: SpendingChartProps) {
  if (categories.length === 0) return null

  const data = categories.map((cat) => ({
    name: cat.categoryName,
    value: cat.total,
    color: cat.categoryColor,
  }))

  return (
    <div className="px-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Biểu đồ chi tiêu
      </h3>
      <div className="flex items-center gap-4">
        <div className="w-36 h-36 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={65}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 min-w-0 space-y-1.5">
          {categories.slice(0, 5).map((cat) => (
            <div key={cat.categoryId} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: cat.categoryColor }}
              />
              <span className="text-xs truncate flex-1">{cat.categoryName}</span>
              <span className="text-xs text-muted-foreground">
                {cat.percentage.toFixed(0)}%
              </span>
            </div>
          ))}
          {categories.length > 5 && (
            <p className="text-[10px] text-muted-foreground">
              +{categories.length - 5} danh mục khác
            </p>
          )}
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground mt-2">
        Tổng chi: {formatCurrency(totalExpense)}
      </p>
    </div>
  )
}
