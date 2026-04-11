import { db } from '@/lib/db'
import { z } from 'zod'

const EXPORT_VERSION = 1

interface ExportData {
  version: number
  exportedAt: string
  data: {
    transactions: unknown[]
    categories: unknown[]
    recurringPayments: unknown[]
    budgets: unknown[]
  }
}

export async function exportAllData(): Promise<string> {
  const [transactions, categories, recurringPayments, budgets] = await Promise.all([
    db.transactions.toArray(),
    db.categories.toArray(),
    db.recurringPayments.toArray(),
    db.budgets.toArray(),
  ])

  const exportData: ExportData = {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    data: { transactions, categories, recurringPayments, budgets },
  }

  return JSON.stringify(exportData, null, 2)
}

export function downloadJson(content: string, filename: string) {
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const importSchema = z.object({
  version: z.number(),
  exportedAt: z.string(),
  data: z.object({
    transactions: z.array(z.any()),
    categories: z.array(z.any()),
    recurringPayments: z.array(z.any()),
    budgets: z.array(z.any()),
  }),
})

export type ImportMode = 'replace' | 'merge'

export async function importData(jsonStr: string, mode: ImportMode): Promise<{ success: boolean; message: string }> {
  let parsed: unknown
  try {
    parsed = JSON.parse(jsonStr)
  } catch {
    return { success: false, message: 'File JSON không hợp lệ' }
  }

  const result = importSchema.safeParse(parsed)
  if (!result.success) {
    return { success: false, message: 'Cấu trúc file không đúng định dạng' }
  }

  const { data } = result.data

  try {
    if (mode === 'replace') {
      await db.transaction('rw', [db.transactions, db.categories, db.recurringPayments, db.budgets], async () => {
        await db.transactions.clear()
        await db.categories.clear()
        await db.recurringPayments.clear()
        await db.budgets.clear()

        if (data.transactions.length > 0) await db.transactions.bulkAdd(data.transactions)
        if (data.categories.length > 0) await db.categories.bulkAdd(data.categories)
        if (data.recurringPayments.length > 0) await db.recurringPayments.bulkAdd(data.recurringPayments)
        if (data.budgets.length > 0) await db.budgets.bulkAdd(data.budgets)
      })
    } else {
      await db.transaction('rw', [db.transactions, db.categories, db.recurringPayments, db.budgets], async () => {
        if (data.transactions.length > 0) await db.transactions.bulkPut(data.transactions)
        if (data.categories.length > 0) await db.categories.bulkPut(data.categories)
        if (data.recurringPayments.length > 0) await db.recurringPayments.bulkPut(data.recurringPayments)
        if (data.budgets.length > 0) await db.budgets.bulkPut(data.budgets)
      })
    }

    const total = data.transactions.length + data.categories.length +
      data.recurringPayments.length + data.budgets.length

    return {
      success: true,
      message: `Đã ${mode === 'replace' ? 'khôi phục' : 'gộp'} ${total} bản ghi thành công`,
    }
  } catch (err) {
    return { success: false, message: `Lỗi khi import: ${err instanceof Error ? err.message : 'Không rõ'}` }
  }
}
