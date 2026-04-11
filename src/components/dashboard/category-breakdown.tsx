'use client'

import type { CategorySummary } from '@/types'
import { CategoryIcon } from '@/components/common/category-icon'
import { formatCurrency } from '@/lib/utils/format'

interface CategoryBreakdownProps {
  categories: CategorySummary[]
}

export function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  if (categories.length === 0) return null

  return (
    <div className="px-4 space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">Chi tiêu theo danh mục</h3>
      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.categoryId} className="flex items-center gap-3">
            <CategoryIcon icon={cat.categoryIcon} color={cat.categoryColor} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-sm truncate">{cat.categoryName}</span>
                <span className="text-sm font-medium ml-2">
                  {formatCurrency(cat.total)}
                </span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${cat.percentage}%`,
                    backgroundColor: cat.categoryColor,
                  }}
                />
              </div>
            </div>
            <span className="text-xs text-muted-foreground w-10 text-right">
              {cat.percentage.toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
