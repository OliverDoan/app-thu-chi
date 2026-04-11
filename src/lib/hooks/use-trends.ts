'use client'

import { useState, useEffect } from 'react'
import { getMonthlyTrends, type MonthlyTrend } from '@/lib/services/trend-service'
import { useDataStore } from '@/lib/stores/data-store'

export function useMonthlyTrends(currentMonth: string, count: number = 6) {
  const [trends, setTrends] = useState<MonthlyTrend[]>([])
  const [loading, setLoading] = useState(true)
  const txVersion = useDataStore((s) => s.transactionVersion)

  useEffect(() => {
    setLoading(true)
    getMonthlyTrends(currentMonth, count).then((data) => {
      setTrends(data)
      setLoading(false)
    })
  }, [currentMonth, count, txVersion])

  return { trends, loading }
}
