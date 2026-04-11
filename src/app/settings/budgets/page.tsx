'use client'

import { useState, useCallback } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { CategoryIcon } from '@/components/common/category-icon'
import { AmountInput } from '@/components/common/amount-input'
import { Button } from '@/components/ui/button'
import { useCategoriesByType } from '@/lib/hooks/use-categories'
import { useBudgets } from '@/lib/hooks/use-budgets'
import { budgetRepository } from '@/lib/repositories/budget-repository'
import { formatCurrency } from '@/lib/utils/format'
import { Check, X } from 'lucide-react'

export default function BudgetsPage() {
  const { categories } = useCategoriesByType('expense')
  const { budgets, refresh } = useBudgets('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editAmount, setEditAmount] = useState(0)

  const budgetMap = new Map(budgets.map((b) => [b.categoryId, b]))

  const handleEdit = (categoryId: string) => {
    const existing = budgetMap.get(categoryId)
    setEditAmount(existing?.amount ?? 0)
    setEditingId(categoryId)
  }

  const handleSave = useCallback(async () => {
    if (!editingId) return
    if (editAmount > 0) {
      await budgetRepository.upsert(editingId, editAmount, 'all')
    } else {
      await budgetRepository.deleteByCategoryAndMonth(editingId, 'all')
    }
    setEditingId(null)
    refresh()
  }, [editingId, editAmount, refresh])

  const handleCancel = () => {
    setEditingId(null)
  }

  return (
    <div className="max-w-lg mx-auto">
      <PageHeader title="Ngân sách hàng tháng" showBack />

      <div className="px-4 py-3">
        <p className="text-xs text-muted-foreground mb-4">
          Đặt giới hạn chi tiêu cho từng danh mục. Bạn sẽ được cảnh báo khi gần vượt ngân sách.
        </p>

        <div className="space-y-1">
          {categories.map((cat) => {
            const budget = budgetMap.get(cat.id)
            const isEditing = editingId === cat.id

            return (
              <div
                key={cat.id}
                className="flex items-center gap-3 py-2.5 px-2 rounded-lg"
              >
                <CategoryIcon icon={cat.icon} color={cat.color} size="sm" />
                <span className="text-sm flex-1 truncate">{cat.name}</span>

                {isEditing ? (
                  <div className="flex items-center gap-1.5">
                    <div className="w-32">
                      <AmountInput value={editAmount} onChange={setEditAmount} />
                    </div>
                    <button
                      onClick={handleSave}
                      className="p-1.5 rounded-md hover:bg-green-50 text-green-600"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="p-1.5 rounded-md hover:bg-red-50 text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(cat.id)}
                    className="text-xs"
                  >
                    {budget ? formatCurrency(budget.amount) : 'Đặt ngân sách'}
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
