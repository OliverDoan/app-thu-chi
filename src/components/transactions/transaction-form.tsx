'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AmountInput } from '@/components/common/amount-input'
import { CategoryPicker } from '@/components/common/category-picker'
import { useCategoriesByType } from '@/lib/hooks/use-categories'
import { useTransactionActions } from '@/lib/hooks/use-transactions'
import { transactionSchema, type TransactionFormData } from '@/lib/validations'
import { getToday } from '@/lib/utils/date'
import type { Transaction, TransactionType } from '@/types'
import { cn } from '@/lib/utils'

interface TransactionFormProps {
  transaction?: Transaction | null
}

export function TransactionForm({ transaction }: TransactionFormProps) {
  const router = useRouter()
  const { create, update } = useTransactionActions()
  const isEditing = !!transaction

  const [type, setType] = useState<TransactionType>(transaction?.type ?? 'expense')
  const [amount, setAmount] = useState(transaction?.amount ?? 0)
  const [categoryId, setCategoryId] = useState(transaction?.categoryId ?? '')
  const [note, setNote] = useState(transaction?.note ?? '')
  const [date, setDate] = useState(transaction?.date ?? getToday())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const { categories } = useCategoriesByType(type)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setErrors({})

      const data: TransactionFormData = { type, amount, categoryId, note, date }
      const result = transactionSchema.safeParse(data)

      if (!result.success) {
        const fieldErrors: Record<string, string> = {}
        for (const issue of result.error.issues) {
          const field = issue.path[0]?.toString()
          if (field) fieldErrors[field] = issue.message
        }
        setErrors(fieldErrors)
        return
      }

      setSubmitting(true)
      if (isEditing && transaction) {
        await update(transaction.id, result.data)
      } else {
        await create(result.data)
      }
      router.back()
    },
    [type, amount, categoryId, note, date, isEditing, transaction, create, update, router]
  )

  return (
    <form onSubmit={handleSubmit} className="px-4 py-4 space-y-5 max-w-lg mx-auto">
      {/* Loại giao dịch */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => { setType('expense'); setCategoryId('') }}
          className={cn(
            'flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors',
            type === 'expense'
              ? 'bg-red-500 text-white'
              : 'bg-secondary text-secondary-foreground'
          )}
        >
          Chi tiêu
        </button>
        <button
          type="button"
          onClick={() => { setType('income'); setCategoryId('') }}
          className={cn(
            'flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors',
            type === 'income'
              ? 'bg-green-500 text-white'
              : 'bg-secondary text-secondary-foreground'
          )}
        >
          Thu nhập
        </button>
      </div>

      {/* Số tiền */}
      <div className="space-y-1.5">
        <Label>Số tiền</Label>
        <AmountInput value={amount} onChange={setAmount} />
        {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
      </div>

      {/* Danh mục */}
      <div className="space-y-1.5">
        <Label>Danh mục</Label>
        <CategoryPicker categories={categories} value={categoryId} onChange={setCategoryId} />
        {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId}</p>}
      </div>

      {/* Ngày */}
      <div className="space-y-1.5">
        <Label>Ngày</Label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
      </div>

      {/* Ghi chú */}
      <div className="space-y-1.5">
        <Label>Ghi chú</Label>
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Nhập ghi chú..."
          rows={2}
        />
        {errors.note && <p className="text-xs text-destructive">{errors.note}</p>}
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? 'Đang lưu...' : isEditing ? 'Cập nhật' : 'Thêm giao dịch'}
      </Button>
    </form>
  )
}
