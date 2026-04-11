import Link from 'next/link'
import { FileQuestion } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <FileQuestion className="h-16 w-16 text-muted-foreground/30 mb-4" />
      <h2 className="text-lg font-semibold mb-1">Không tìm thấy trang</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Trang bạn tìm kiếm không tồn tại
      </p>
      <Link href="/" className={buttonVariants()}>
        Về trang chủ
      </Link>
    </div>
  )
}
