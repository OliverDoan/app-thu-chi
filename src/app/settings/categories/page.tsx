'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { useCategories } from '@/lib/hooks/use-categories'
import { CategoryIcon } from '@/components/common/category-icon'
import { CategoryFormDialog } from '@/components/settings/category-form-dialog'
import { categoryRepository } from '@/lib/repositories/category-repository'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import type { Category, TransactionType } from '@/types'

export default function CategoriesPage() {
  const { categories, refresh } = useCategories()
  const [tab, setTab] = useState<TransactionType>('expense')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  const filtered = categories.filter((c) => c.type === tab)

  const handleAdd = () => {
    setEditingCategory(null)
    setDialogOpen(true)
  }

  const handleEdit = (cat: Category) => {
    setEditingCategory(cat)
    setDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    await categoryRepository.delete(deleteTarget.id)
    setDeleteTarget(null)
    refresh()
    toast.success('Đã xóa danh mục')
  }

  return (
    <div className="max-w-lg mx-auto">
      <PageHeader
        title="Quản lý danh mục"
        showBack
        action={
          <Button size="sm" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-1" />
            Thêm
          </Button>
        }
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as TransactionType)} className="px-4 pt-4">
        <TabsList className="w-full">
          <TabsTrigger value="expense" className="flex-1">Chi tiêu</TabsTrigger>
          <TabsTrigger value="income" className="flex-1">Thu nhập</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          <div className="space-y-1">
            {filtered.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-3 px-2 py-2.5 rounded-lg group"
              >
                <CategoryIcon icon={cat.icon} color={cat.color} size="sm" />
                <span className="text-sm flex-1">{cat.name}</span>
                {cat.isDefault ? (
                  <span className="text-[10px] text-muted-foreground">Mặc định</span>
                ) : (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="p-1.5 rounded-md hover:bg-accent transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(cat)}
                      className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editingCategory}
        type={tab}
        onSaved={refresh}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa danh mục</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa danh mục &ldquo;{deleteTarget?.name}&rdquo;? Các giao dịch thuộc danh mục này sẽ không bị xóa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDeleteConfirm}>
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
