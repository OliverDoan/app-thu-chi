'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Budget, BudgetStatus } from '@/types'
import { budgetRepository } from '@/lib/repositories/budget-repository'
import { transactionRepository } from '@/lib/repositories/transaction-repository'
import { categoryRepository } from '@/lib/repositories/category-repository'
import { useDataStore } from '@/lib/stores/data-store'

export function useBudgetStatuses(month: string) {
  const [statuses, setStatuses] = useState<BudgetStatus[]>([])
  const [loading, setLoading] = useState(true)
  const txVersion = useDataStore((s) => s.transactionVersion)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [budgets, transactions, categories] = await Promise.all([
        budgetRepository.getByMonth(month),
        transactionRepository.getByMonth(month),
        categoryRepository.getAll(),
      ])

      const catMap = new Map(categories.map((c) => [c.id, c]))

      const result: BudgetStatus[] = budgets.map((b) => {
        const cat = catMap.get(b.categoryId)
        const spent = transactions
          .filter((t) => t.type === 'expense' && t.categoryId === b.categoryId)
          .reduce((sum, t) => sum + t.amount, 0)

        return {
          categoryId: b.categoryId,
          categoryName: cat?.name ?? 'Không rõ',
          categoryIcon: cat?.icon ?? 'CircleDot',
          categoryColor: cat?.color ?? '#6b7280',
          budgetAmount: b.amount,
          spentAmount: spent,
          percentage: b.amount > 0 ? (spent / b.amount) * 100 : 0,
          isOverBudget: spent > b.amount,
        }
      })

      setStatuses(result.sort((a, b) => b.percentage - a.percentage))
      setLoading(false)
    }
    load()
  }, [month, txVersion])

  return { statuses, loading }
}

export function useBudgets(month: string) {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await budgetRepository.getByMonth(month)
    setBudgets(data)
    setLoading(false)
  }, [month])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { budgets, loading, refresh }
}
