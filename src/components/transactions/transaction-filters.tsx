'use client'

import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCategories } from '@/lib/hooks/use-categories'
import type { TransactionType } from '@/types'
import { cn } from '@/lib/utils'

export interface TransactionFilters {
  search: string
  type: TransactionType | 'all'
  categoryId: string | 'all'
}

interface TransactionFiltersBarProps {
  filters: TransactionFilters
  onChange: (filters: TransactionFilters) => void
}

export function TransactionFiltersBar({ filters, onChange }: TransactionFiltersBarProps) {
  const [showFilters, setShowFilters] = useState(false)
  const { categories } = useCategories()

  const hasActiveFilters = filters.type !== 'all' || filters.categoryId !== 'all'
  const filteredCategories = filters.type === 'all'
    ? categories
    : categories.filter((c) => c.type === filters.type)

  const clearFilters = () => {
    onChange({ search: '', type: 'all', categoryId: 'all' })
    setShowFilters(false)
  }

  return (
    <div className="px-4 space-y-2">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Tìm theo ghi chú..."
          className="pl-9 pr-9"
        />
        {(filters.search || hasActiveFilters) && (
          <button
            onClick={clearFilters}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-accent"
          >
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Filter toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={showFilters ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="text-xs"
        >
          <Filter className="h-3.5 w-3.5 mr-1" />
          Lọc
          {hasActiveFilters && (
            <span className="ml-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
              !
            </span>
          )}
        </Button>

        {/* Quick type filter chips */}
        {(['all', 'expense', 'income'] as const).map((t) => (
          <button
            key={t}
            onClick={() => onChange({ ...filters, type: t, categoryId: 'all' })}
            className={cn(
              'px-2.5 py-1 rounded-full text-xs transition-colors',
              filters.type === t
                ? t === 'expense' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                  : t === 'income' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                    : 'bg-primary/10 text-primary'
                : 'bg-secondary text-secondary-foreground'
            )}
          >
            {t === 'all' ? 'Tất cả' : t === 'expense' ? 'Chi' : 'Thu'}
          </button>
        ))}
      </div>

      {/* Category filter */}
      {showFilters && (
        <div className="flex flex-wrap gap-1.5 pb-1">
          <button
            onClick={() => onChange({ ...filters, categoryId: 'all' })}
            className={cn(
              'px-2 py-1 rounded-md text-xs transition-colors',
              filters.categoryId === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            )}
          >
            Tất cả
          </button>
          {filteredCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onChange({ ...filters, categoryId: cat.id })}
              className={cn(
                'px-2 py-1 rounded-md text-xs transition-colors',
                filters.categoryId === cat.id
                  ? 'text-white'
                  : 'bg-secondary text-secondary-foreground'
              )}
              style={filters.categoryId === cat.id ? { backgroundColor: cat.color } : undefined}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
