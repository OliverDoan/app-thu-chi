'use client'

import Link from 'next/link'
import { ChevronRight, Tags, PiggyBank } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { ExportImport } from '@/components/settings/export-import'
import { ThemeToggle } from '@/components/settings/theme-toggle'

const settingsItems = [
  { href: '/settings/categories', label: 'Quản lý danh mục', icon: Tags, description: 'Thêm, sửa, xóa danh mục' },
  { href: '/settings/budgets', label: 'Ngân sách', icon: PiggyBank, description: 'Đặt giới hạn chi tiêu theo danh mục' },
]

export default function SettingsPage() {
  return (
    <div className="max-w-lg mx-auto">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold">Cài đặt</h1>
      </div>

      <div className="mt-2">
        {settingsItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors"
            >
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          )
        })}
      </div>

      <Separator className="my-4" />

      <div className="px-4">
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Giao diện</h2>
        <ThemeToggle />
      </div>

      <Separator className="my-4" />

      <div className="px-4">
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Dữ liệu</h2>
        <ExportImport />
      </div>

      <div className="px-4 pt-6 pb-4">
        <p className="text-xs text-muted-foreground text-center">
          Thu Chi v1.0 - Dữ liệu được lưu trên thiết bị
        </p>
      </div>
    </div>
  )
}
