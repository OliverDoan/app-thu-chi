'use client'

import { useState, useMemo } from 'react'
import { MonthPicker } from '@/components/common/month-picker'
import { TransactionList } from '@/components/transactions/transaction-list'
import { TransactionFiltersBar, type TransactionFilters } from '@/components/transactions/transaction-filters'
import { useAppStore } from '@/lib/stores/app-store'
import { useTransactionsByMonth } from '@/lib/hooks/use-transactions'
import { useMonthlySummary } from '@/lib/hooks/use-summary'
import { formatCurrency } from '@/lib/utils/format'
import { cn } from '@/lib/utils'

export default function TransactionsPage() {
  const { currentMonth, setCurrentMonth } = useAppStore()
  const { transactions } = useTransactionsByMonth(currentMonth)
  const { summary } = useMonthlySummary(currentMonth)

  const [filters, setFilters] = useState<TransactionFilters>({
    search: '',
    type: 'all',
    categoryId: 'all',
  })

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (filters.type !== 'all' && t.type !== filters.type) return false
      if (filters.categoryId !== 'all' && t.categoryId !== filters.categoryId) return false
      if (filters.search) {
        const q = filters.search.toLowerCase()
        if (!t.note.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [transactions, filters])

  return (
    <div className="max-w-lg mx-auto">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold">Giao dịch</h1>
      </div>

      <MonthPicker month={currentMonth} onChange={setCurrentMonth} />

      <TransactionFiltersBar filters={filters} onChange={setFilters} />

      <div className="flex items-center justify-between px-4 py-2 text-sm">
        <span className="text-muted-foreground">
          {filtered.length} giao dịch
          {filtered.length !== transactions.length && ` / ${transactions.length}`}
        </span>
        <span
          className={cn(
            'font-medium',
            summary.balance >= 0 ? 'text-green-600' : 'text-red-500'
          )}
        >
          {summary.balance >= 0 ? '+' : ''}{formatCurrency(summary.balance)}
        </span>
      </div>

      <TransactionList transactions={filtered} />
    </div>
  )
}
