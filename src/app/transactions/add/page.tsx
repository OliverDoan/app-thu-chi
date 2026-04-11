'use client'

import { PageHeader } from '@/components/layout/page-header'
import { TransactionForm } from '@/components/transactions/transaction-form'

export default function AddTransactionPage() {
  return (
    <div className="max-w-lg mx-auto">
      <PageHeader title="Thêm giao dịch" showBack />
      <TransactionForm />
    </div>
  )
}
