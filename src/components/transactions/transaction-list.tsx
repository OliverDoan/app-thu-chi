'use client'

import type { Transaction } from '@/types'
import { TransactionCard } from './transaction-card'
import { EmptyState } from '@/components/common/empty-state'
import { useCategoryMap } from '@/lib/hooks/use-categories'
import { format, parseISO, isToday, isYesterday } from 'date-fns'
import { vi } from 'date-fns/locale'

interface TransactionListProps {
  transactions: Transaction[]
}

function formatDateHeader(dateStr: string): string {
  const date = parseISO(dateStr)
  if (isToday(date)) return 'Hôm nay'
  if (isYesterday(date)) return 'Hôm qua'
  return format(date, 'EEEE, dd/MM', { locale: vi })
}

export function TransactionList({ transactions }: TransactionListProps) {
  const { categoryMap } = useCategoryMap()

  if (transactions.length === 0) {
    return (
      <EmptyState
        message="Chưa có giao dịch nào"
        description="Nhấn nút + để thêm giao dịch đầu tiên"
      />
    )
  }

  // Nhóm giao dịch theo ngày
  const grouped = new Map<string, Transaction[]>()
  for (const t of transactions) {
    const existing = grouped.get(t.date) ?? []
    grouped.set(t.date, [...existing, t])
  }

  return (
    <div className="space-y-1">
      {Array.from(grouped.entries()).map(([date, txns]) => (
        <div key={date}>
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm px-4 py-1.5">
            <p className="text-xs font-medium text-muted-foreground capitalize">
              {formatDateHeader(date)}
            </p>
          </div>
          {txns.map((t) => (
            <TransactionCard
              key={t.id}
              transaction={t}
              category={categoryMap.get(t.categoryId)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
