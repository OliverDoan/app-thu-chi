'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { categorySchema, type CategoryFormData } from '@/lib/validations'
import { categoryRepository } from '@/lib/repositories/category-repository'
import { useDataStore } from '@/lib/stores/data-store'
import type { Category, TransactionType } from '@/types'
import { cn } from '@/lib/utils'

const ICON_OPTIONS = [
  'Utensils', 'Car', 'Home', 'Zap', 'ShoppingBag', 'Gamepad2',
  'Heart', 'GraduationCap', 'Banknote', 'Gift', 'TrendingUp', 'MoreHorizontal',
]

const COLOR_OPTIONS = [
  '#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#14b8a6',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#a855f7', '#ec4899', '#6b7280',
]

import {
  Utensils, Car, Home, Zap, ShoppingBag, Gamepad2, Heart,
  GraduationCap, Banknote, Gift, TrendingUp, MoreHorizontal,
} from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import type { ComponentType } from 'react'

const iconComponents: Record<string, ComponentType<LucideProps>> = {
  Utensils, Car, Home, Zap, ShoppingBag, Gamepad2, Heart,
  GraduationCap, Banknote, Gift, TrendingUp, MoreHorizontal,
}

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
  type: TransactionType
  onSaved: () => void
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  type,
  onSaved,
}: CategoryFormDialogProps) {
  const isEditing = !!category
  const invalidateCategories = useDataStore((s) => s.invalidateCategories)

  const [name, setName] = useState('')
  const [icon, setIcon] = useState('MoreHorizontal')
  const [color, setColor] = useState('#6b7280')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setName(category?.name ?? '')
      setIcon(category?.icon ?? 'MoreHorizontal')
      setColor(category?.color ?? '#6b7280')
      setErrors({})
    }
  }, [open, category])

  const handleSubmit = useCallback(async () => {
    setErrors({})
    const data: CategoryFormData = { name, icon, color, type }
    const result = categorySchema.safeParse(data)

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
    if (isEditing && category) {
      await categoryRepository.update(category.id, result.data)
    } else {
      await categoryRepository.create(result.data)
    }
    setSubmitting(false)
    onOpenChange(false)
    invalidateCategories()
    onSaved()
    toast.success(isEditing ? 'Đã cập nhật danh mục' : 'Đã thêm danh mục')
  }, [name, icon, color, type, isEditing, category, onOpenChange, invalidateCategories, onSaved])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Sửa danh mục' : 'Thêm danh mục'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Tên danh mục</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên..."
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Icon</Label>
            <div className="grid grid-cols-6 gap-2">
              {ICON_OPTIONS.map((iconName) => {
                const IconComp = iconComponents[iconName]
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setIcon(iconName)}
                    className={cn(
                      'flex items-center justify-center h-10 w-full rounded-md transition-colors',
                      icon === iconName
                        ? 'bg-primary/10 ring-2 ring-primary'
                        : 'hover:bg-accent'
                    )}
                  >
                    {IconComp && <IconComp className="h-5 w-5" />}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Màu sắc</Label>
            <div className="grid grid-cols-6 gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    'h-8 w-full rounded-full transition-all',
                    color === c ? 'ring-2 ring-offset-2 ring-primary' : ''
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Đang lưu...' : isEditing ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
