'use client'

import { PageHeader } from '@/components/layout/page-header'
import { RecurringForm } from '@/components/recurring/recurring-form'

export default function AddRecurringPage() {
  return (
    <div className="max-w-lg mx-auto">
      <PageHeader title="Thêm khoản định kỳ" showBack />
      <RecurringForm />
    </div>
  )
}
