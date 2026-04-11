'use client'

import type { Category } from '@/types'
import { CategoryIcon } from './category-icon'
import { cn } from '@/lib/utils'

interface CategoryPickerProps {
  categories: Category[]
  value: string
  onChange: (categoryId: string) => void
}

export function CategoryPicker({ categories, value, onChange }: CategoryPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange(cat.id)}
          className={cn(
            'flex flex-col items-center gap-1 p-2 rounded-lg transition-colors',
            value === cat.id
              ? 'bg-primary/10 ring-2 ring-primary'
              : 'hover:bg-accent'
          )}
        >
          <CategoryIcon icon={cat.icon} color={cat.color} size="sm" />
          <span className="text-[11px] text-center leading-tight line-clamp-1">
            {cat.name}
          </span>
        </button>
      ))}
    </div>
  )
}
