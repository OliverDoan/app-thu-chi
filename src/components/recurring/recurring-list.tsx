'use client'

import type { RecurringPayment } from '@/types'
import { RecurringCard } from './recurring-card'
import { EmptyState } from '@/components/common/empty-state'
import { useCategoryMap } from '@/lib/hooks/use-categories'

interface RecurringListProps {
  payments: RecurringPayment[]
}

export function RecurringList({ payments }: RecurringListProps) {
  const { categoryMap } = useCategoryMap()

  if (payments.length === 0) {
    return (
      <EmptyState
        message="Chưa có khoản định kỳ"
        description="Thêm tiền nhà, subscription, hóa đơn cố định..."
      />
    )
  }

  return (
    <div>
      {payments.map((p) => (
        <RecurringCard key={p.id} payment={p} category={categoryMap.get(p.categoryId)} />
      ))}
    </div>
  )
}
