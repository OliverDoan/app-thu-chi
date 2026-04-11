'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/layout/page-header'
import { RecurringForm } from '@/components/recurring/recurring-form'
import { useRecurringPayment, useRecurringActions } from '@/lib/hooks/use-recurring'
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
import { Trash2 } from 'lucide-react'

export default function EditRecurringPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { payment, loading } = useRecurringPayment(id)
  const { remove } = useRecurringActions()
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleDelete = async () => {
    await remove(id)
    setDeleteOpen(false)
    router.back()
  }

  if (loading) {
    return (
      <div className="max-w-lg mx-auto">
        <PageHeader title="Sửa khoản định kỳ" showBack />
        <div className="flex items-center justify-center py-12">
          <span className="text-muted-foreground">Đang tải...</span>
        </div>
      </div>
    )
  }

  if (!payment) {
    return (
      <div className="max-w-lg mx-auto">
        <PageHeader title="Không tìm thấy" showBack />
        <div className="flex items-center justify-center py-12">
          <span className="text-muted-foreground">Khoản định kỳ không tồn tại</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <PageHeader
        title="Sửa khoản định kỳ"
        showBack
        action={
          <Button variant="ghost" size="icon" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        }
      />
      <RecurringForm payment={payment} />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa khoản định kỳ</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa khoản định kỳ này? Các giao dịch đã tạo trước đó sẽ không bị ảnh hưởng.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
