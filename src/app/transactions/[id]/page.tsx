'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/layout/page-header'
import { TransactionForm } from '@/components/transactions/transaction-form'
import { useTransaction, useTransactionActions } from '@/lib/hooks/use-transactions'
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

export default function EditTransactionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { transaction, loading } = useTransaction(id)
  const { remove } = useTransactionActions()
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleDelete = async () => {
    await remove(id)
    setDeleteOpen(false)
    router.back()
  }

  if (loading) {
    return (
      <div className="max-w-lg mx-auto">
        <PageHeader title="Sửa giao dịch" showBack />
        <div className="flex items-center justify-center py-12">
          <span className="text-muted-foreground">Đang tải...</span>
        </div>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="max-w-lg mx-auto">
        <PageHeader title="Không tìm thấy" showBack />
        <div className="flex items-center justify-center py-12">
          <span className="text-muted-foreground">Giao dịch không tồn tại</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <PageHeader
        title="Sửa giao dịch"
        showBack
        action={
          <Button variant="ghost" size="icon" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        }
      />
      <TransactionForm transaction={transaction} />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa giao dịch</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa giao dịch này? Hành động này không thể hoàn tác.
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
