'use client'

import { useState, useRef, useCallback } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Download, Upload, AlertTriangle } from 'lucide-react'
import { exportAllData, downloadJson, importData, type ImportMode } from '@/lib/services/export-service'
import { useDataStore } from '@/lib/stores/data-store'
import { cn } from '@/lib/utils'

export function ExportImport() {
  const [exporting, setExporting] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [importMode, setImportMode] = useState<ImportMode>('merge')
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const invalidateTx = useDataStore((s) => s.invalidateTransactions)
  const invalidateCat = useDataStore((s) => s.invalidateCategories)
  const invalidateRec = useDataStore((s) => s.invalidateRecurring)

  const handleExport = useCallback(async () => {
    setExporting(true)
    setMessage(null)
    const json = await exportAllData()
    const date = new Date().toISOString().slice(0, 10)
    downloadJson(json, `thu-chi-backup-${date}.json`)
    setMessage({ type: 'success', text: 'Đã tải file backup' })
    toast.success('Đã tải file backup')
    setExporting(false)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImportFile(file)
      setImportDialogOpen(true)
    }
    e.target.value = ''
  }

  const handleImport = useCallback(async () => {
    if (!importFile) return
    setImporting(true)
    setMessage(null)

    const text = await importFile.text()
    const result = await importData(text, importMode)

    setMessage({ type: result.success ? 'success' : 'error', text: result.message })
    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
    setImporting(false)
    setImportDialogOpen(false)
    setImportFile(null)

    if (result.success) {
      invalidateTx()
      invalidateCat()
      invalidateRec()
    }
  }, [importFile, importMode, invalidateTx, invalidateCat, invalidateRec])

  return (
    <>
      <div className="space-y-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Download className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Sao lưu dữ liệu</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tải toàn bộ dữ liệu dưới dạng file JSON
                </p>
              </div>
              <Button size="sm" onClick={handleExport} disabled={exporting}>
                {exporting ? 'Đang tải...' : 'Xuất'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Upload className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Khôi phục dữ liệu</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Nhập dữ liệu từ file backup JSON
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                Nhập
              </Button>
            </div>
          </CardContent>
        </Card>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileSelect}
        />

        {message && (
          <p className={cn(
            'text-xs px-1',
            message.type === 'success' ? 'text-green-600' : 'text-destructive'
          )}>
            {message.text}
          </p>
        )}
      </div>

      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>Nhập dữ liệu</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-xs">
                File: <span className="font-medium">{importFile?.name}</span>
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Chế độ nhập</p>
              <label className="flex items-start gap-2 cursor-pointer p-2 rounded-lg hover:bg-accent">
                <input
                  type="radio"
                  name="mode"
                  checked={importMode === 'merge'}
                  onChange={() => setImportMode('merge')}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-medium">Gộp dữ liệu</p>
                  <p className="text-xs text-muted-foreground">
                    Giữ dữ liệu hiện tại, thêm/cập nhật từ file backup
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-2 cursor-pointer p-2 rounded-lg hover:bg-accent">
                <input
                  type="radio"
                  name="mode"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-medium text-destructive">Thay thế toàn bộ</p>
                  <p className="text-xs text-muted-foreground">
                    Xóa toàn bộ dữ liệu hiện tại, thay bằng file backup
                  </p>
                </div>
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleImport} disabled={importing}>
              {importing ? 'Đang nhập...' : 'Xác nhận'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
