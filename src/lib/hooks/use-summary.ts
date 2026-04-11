'use client'

import { useState, useEffect } from 'react'
import type { MonthlySummary } from '@/types'
import { transactionRepository } from '@/lib/repositories/transaction-repository'
import { categoryRepository } from '@/lib/repositories/category-repository'
import { calculateMonthlySummary } from '@/lib/services/summary-service'
import { useDataStore } from '@/lib/stores/data-store'

export function useMonthlySummary(month: string) {
  const [summary, setSummary] = useState<MonthlySummary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    byCategory: [],
  })
  const [loading, setLoading] = useState(true)
  const txVersion = useDataStore((s) => s.transactionVersion)
  const catVersion = useDataStore((s) => s.categoryVersion)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [transactions, categories] = await Promise.all([
        transactionRepository.getByMonth(month),
        categoryRepository.getAll(),
      ])
      setSummary(calculateMonthlySummary(transactions, categories))
      setLoading(false)
    }
    load()
  }, [month, txVersion, catVersion])

  return { summary, loading }
}
