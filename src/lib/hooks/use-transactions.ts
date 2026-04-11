'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import type { Transaction } from '@/types'
import { transactionRepository } from '@/lib/repositories/transaction-repository'
import { useDataStore } from '@/lib/stores/data-store'
import type { TransactionFormData } from '@/lib/validations'

export function useTransactionsByMonth(month: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const version = useDataStore((s) => s.transactionVersion)

  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await transactionRepository.getByMonth(month)
    setTransactions(data)
    setLoading(false)
  }, [month])

  useEffect(() => {
    refresh()
  }, [refresh, version])

  return { transactions, loading, refresh }
}

export function useTransaction(id: string | null) {
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    transactionRepository.getById(id).then((data) => {
      setTransaction(data ?? null)
      setLoading(false)
    })
  }, [id])

  return { transaction, loading }
}

export function useTransactionActions() {
  const invalidate = useDataStore((s) => s.invalidateTransactions)

  const create = useCallback(async (data: TransactionFormData) => {
    const result = await transactionRepository.create(data)
    invalidate()
    toast.success('Đã thêm giao dịch')
    return result
  }, [invalidate])

  const update = useCallback(async (id: string, data: Partial<TransactionFormData>) => {
    await transactionRepository.update(id, data)
    invalidate()
    toast.success('Đã cập nhật giao dịch')
  }, [invalidate])

  const remove = useCallback(async (id: string) => {
    await transactionRepository.delete(id)
    invalidate()
    toast.success('Đã xóa giao dịch')
  }, [invalidate])

  return { create, update, remove }
}
