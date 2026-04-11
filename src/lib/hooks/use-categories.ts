'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Category, TransactionType } from '@/types'
import { categoryRepository } from '@/lib/repositories/category-repository'
import { useDataStore } from '@/lib/stores/data-store'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const version = useDataStore((s) => s.categoryVersion)

  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await categoryRepository.getAll()
    setCategories(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh, version])

  return { categories, loading, refresh }
}

export function useCategoriesByType(type: TransactionType) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const version = useDataStore((s) => s.categoryVersion)

  useEffect(() => {
    categoryRepository.getByType(type).then((data) => {
      setCategories(data)
      setLoading(false)
    })
  }, [type, version])

  return { categories, loading }
}

export function useCategoryMap() {
  const { categories, loading } = useCategories()
  const categoryMap = new Map(categories.map((c) => [c.id, c]))
  return { categoryMap, loading }
}
