'use client'

import type { BudgetStatus } from '@/types'
import { CategoryIcon } from '@/components/common/category-icon'
import { formatCurrency } from '@/lib/utils/format'
import { cn } from '@/lib/utils'
import { AlertTriangle } from 'lucide-react'

interface BudgetOverviewProps {
  statuses: BudgetStatus[]
}

export function BudgetOverview({ statuses }: BudgetOverviewProps) {
  if (statuses.length === 0) return null

  return (
    <div className="px-4 space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">Ngân sách</h3>
      <div className="space-y-3">
        {statuses.map((s) => (
          <div key={s.categoryId} className="space-y-1">
            <div className="flex items-center gap-2">
              <CategoryIcon icon={s.categoryIcon} color={s.categoryColor} size="sm" />
              <span className="text-sm flex-1 truncate">{s.categoryName}</span>
              {s.isOverBudget && (
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              )}
              <span className="text-xs text-muted-foreground">
                {formatCurrency(s.spentAmount)} / {formatCurrency(s.budgetAmount)}
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  s.percentage > 100
                    ? 'bg-red-500'
                    : s.percentage > 80
                      ? 'bg-amber-500'
                      : 'bg-green-500'
                )}
                style={{ width: `${Math.min(s.percentage, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
