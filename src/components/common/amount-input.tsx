'use client'

import { useMemo, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { formatNumber, parseCurrencyInput, numberToVietnameseWords } from '@/lib/utils/format'

interface AmountInputProps {
  value: number
  onChange: (value: number) => void
  placeholder?: string
}

export function AmountInput({ value, onChange, placeholder = '0' }: AmountInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = parseCurrencyInput(e.target.value)
      onChange(parsed)
    },
    [onChange]
  )

  const wordsText = useMemo(() => {
    if (value <= 0) return ''
    return numberToVietnameseWords(value)
  }, [value])

  return (
    <div>
      <div className="relative">
        <Input
          type="text"
          inputMode="numeric"
          value={value > 0 ? formatNumber(value) : ''}
          onChange={handleChange}
          placeholder={placeholder}
          className="text-right text-lg font-semibold pr-12"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          VND
        </span>
      </div>
      {wordsText && (
        <p className="mt-1 text-xs text-muted-foreground italic capitalize">
          {wordsText}
        </p>
      )}
    </div>
  )
}
