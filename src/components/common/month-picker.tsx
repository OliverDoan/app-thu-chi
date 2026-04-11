'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatMonthYear, getPreviousMonth, getNextMonth, getCurrentMonth } from '@/lib/utils/date'

interface MonthPickerProps {
  month: string
  onChange: (month: string) => void
}

export function MonthPicker({ month, onChange }: MonthPickerProps) {
  const isCurrentMonth = month === getCurrentMonth()

  return (
    <div className="flex items-center justify-between px-4 py-2">
      <button
        onClick={() => onChange(getPreviousMonth(month))}
        className="p-2 rounded-md hover:bg-accent transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <span className="text-sm font-medium capitalize">
        {formatMonthYear(month)}
      </span>
      <button
        onClick={() => onChange(getNextMonth(month))}
        disabled={isCurrentMonth}
        className="p-2 rounded-md hover:bg-accent transition-colors disabled:opacity-30"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
