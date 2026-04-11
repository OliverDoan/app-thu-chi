'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import type { RecurringPayment } from '@/types'
import { recurringRepository } from '@/lib/repositories/recurring-repository'
import { useDataStore } from '@/lib/stores/data-store'
import type { RecurringPaymentFormData } from '@/lib/validations'

export function useRecurringPayments() {
  const [payments, setPayments] = useState<RecurringPayment[]>([])
  const [loading, setLoading] = useState(true)
  const version = useDataStore((s) => s.recurringVersion)

  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await recurringRepository.getAll()
    setPayments(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh, version])

  return { payments, loading, refresh }
}

export function useRecurringPayment(id: string | null) {
  const [payment, setPayment] = useState<RecurringPayment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    recurringRepository.getById(id).then((data) => {
      setPayment(data ?? null)
      setLoading(false)
    })
  }, [id])

  return { payment, loading }
}

export function useRecurringActions() {
  const invalidateRecurring = useDataStore((s) => s.invalidateRecurring)
  const invalidateTransactions = useDataStore((s) => s.invalidateTransactions)

  const create = useCallback(async (data: RecurringPaymentFormData) => {
    const result = await recurringRepository.create(data)
    invalidateRecurring()
    toast.success('Đã thêm khoản định kỳ')
    return result
  }, [invalidateRecurring])

  const update = useCallback(async (id: string, data: Partial<RecurringPaymentFormData>) => {
    await recurringRepository.update(id, data)
    invalidateRecurring()
    toast.success('Đã cập nhật khoản định kỳ')
  }, [invalidateRecurring])

  const remove = useCallback(async (id: string) => {
    await recurringRepository.delete(id)
    invalidateRecurring()
    invalidateTransactions()
    toast.success('Đã xóa khoản định kỳ')
  }, [invalidateRecurring, invalidateTransactions])

  return { create, update, remove }
}
