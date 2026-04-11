'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { RecurringList } from '@/components/recurring/recurring-list'
import { useRecurringPayments } from '@/lib/hooks/use-recurring'

export default function RecurringPage() {
  const { payments } = useRecurringPayments()

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold">Khoản định kỳ</h1>
        <Link href="/recurring/add" className={buttonVariants({ size: 'sm' })}>
          <Plus className="h-4 w-4 mr-1" />
          Thêm
        </Link>
      </div>
      <RecurringList payments={payments} />
    </div>
  )
}
