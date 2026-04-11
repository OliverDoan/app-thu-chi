'use client'

import Link from 'next/link'
import type { Transaction, Category } from '@/types'
import { CategoryIcon } from '@/components/common/category-icon'
import { formatCurrency } from '@/lib/utils/format'
import { formatDateShort } from '@/lib/utils/date'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface TransactionCardProps {
  transaction: Transaction
  category?: Category
}

export function TransactionCard({ transaction, category }: TransactionCardProps) {
  const isIncome = transaction.type === 'income'

  return (
    <Link
      href={`/transactions/${transaction.id}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors"
    >
      <CategoryIcon
        icon={category?.icon ?? 'CircleDot'}
        color={category?.color ?? '#6b7280'}
        size="md"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium truncate">
            {category?.name ?? 'Không rõ'}
          </span>
          {transaction.recurringPaymentId && (
            <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
              Định kỳ
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {transaction.note || formatDateShort(transaction.date)}
        </p>
      </div>
      <div className="text-right">
        <p
          className={cn(
            'text-sm font-semibold',
            isIncome ? 'text-green-600' : 'text-red-500'
          )}
        >
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
        </p>
        <p className="text-[10px] text-muted-foreground">
          {formatDateShort(transaction.date)}
        </p>
      </div>
    </Link>
  )
}
