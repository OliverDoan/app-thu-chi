'use client'

import Link from 'next/link'
import type { RecurringPayment, Category } from '@/types'
import { CategoryIcon } from '@/components/common/category-icon'
import { formatCurrency } from '@/lib/utils/format'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface RecurringCardProps {
  payment: RecurringPayment
  category?: Category
}

export function RecurringCard({ payment, category }: RecurringCardProps) {
  const isIncome = payment.type === 'income'

  return (
    <Link
      href={`/recurring/${payment.id}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors"
    >
      <CategoryIcon
        icon={category?.icon ?? 'CircleDot'}
        color={category?.color ?? '#6b7280'}
        size="md"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium truncate">{payment.name}</span>
          {!payment.isActive && (
            <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
              Tạm dừng
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Ngày {payment.dayOfMonth} hàng tháng
        </p>
      </div>
      <span
        className={cn(
          'text-sm font-semibold',
          isIncome ? 'text-green-600' : 'text-red-500'
        )}
      >
        {isIncome ? '+' : '-'}{formatCurrency(payment.amount)}
      </span>
    </Link>
  )
}
