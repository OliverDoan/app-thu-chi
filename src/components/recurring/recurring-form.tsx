'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AmountInput } from '@/components/common/amount-input'
import { CategoryPicker } from '@/components/common/category-picker'
import { useCategoriesByType } from '@/lib/hooks/use-categories'
import { useRecurringActions } from '@/lib/hooks/use-recurring'
import { recurringPaymentSchema, type RecurringPaymentFormData } from '@/lib/validations'
import { getToday } from '@/lib/utils/date'
import type { RecurringPayment, TransactionType } from '@/types'
import { cn } from '@/lib/utils'

interface RecurringFormProps {
  payment?: RecurringPayment | null
}

export function RecurringForm({ payment }: RecurringFormProps) {
  const router = useRouter()
  const { create, update } = useRecurringActions()
  const isEditing = !!payment

  const [type, setType] = useState<TransactionType>(payment?.type ?? 'expense')
  const [name, setName] = useState(payment?.name ?? '')
  const [amount, setAmount] = useState(payment?.amount ?? 0)
  const [categoryId, setCategoryId] = useState(payment?.categoryId ?? '')
  const [dayOfMonth, setDayOfMonth] = useState(payment?.dayOfMonth ?? 1)
  const [isActive, setIsActive] = useState(payment?.isActive ?? true)
  const [startDate, setStartDate] = useState(payment?.startDate ?? getToday())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const { categories } = useCategoriesByType(type)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setErrors({})

      const data: RecurringPaymentFormData = {
        name, type, amount, categoryId, dayOfMonth, isActive, startDate,
      }
      const result = recurringPaymentSchema.safeParse(data)

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
      if (isEditing && payment) {
        await update(payment.id, result.data)
      } else {
        await create(result.data)
      }
      router.back()
    },
    [name, type, amount, categoryId, dayOfMonth, isActive, startDate, isEditing, payment, create, update, router]
  )

  return (
    <form onSubmit={handleSubmit} className="px-4 py-4 space-y-5 max-w-lg mx-auto">
      {/* Loại */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => { setType('expense'); setCategoryId('') }}
          className={cn(
            'flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors',
            type === 'expense' ? 'bg-red-500 text-white' : 'bg-secondary text-secondary-foreground'
          )}
        >
          Chi tiêu
        </button>
        <button
          type="button"
          onClick={() => { setType('income'); setCategoryId('') }}
          className={cn(
            'flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors',
            type === 'income' ? 'bg-green-500 text-white' : 'bg-secondary text-secondary-foreground'
          )}
        >
          Thu nhập
        </button>
      </div>

      {/* Tên */}
      <div className="space-y-1.5">
        <Label>Tên khoản</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Tiền nhà, Netflix..." />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
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

      {/* Ngày trong tháng */}
      <div className="space-y-1.5">
        <Label>Ngày hàng tháng</Label>
        <Input
          type="number"
          min={1}
          max={31}
          value={dayOfMonth}
          onChange={(e) => setDayOfMonth(parseInt(e.target.value) || 1)}
        />
        {errors.dayOfMonth && <p className="text-xs text-destructive">{errors.dayOfMonth}</p>}
      </div>

      {/* Ngày bắt đầu */}
      <div className="space-y-1.5">
        <Label>Ngày bắt đầu</Label>
        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </div>

      {/* Trạng thái */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 rounded"
        />
        <span className="text-sm">Đang hoạt động</span>
      </label>

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? 'Đang lưu...' : isEditing ? 'Cập nhật' : 'Thêm khoản định kỳ'}
      </Button>
    </form>
  )
}
