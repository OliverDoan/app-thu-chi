'use client'

import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils/format'
import type { MonthlySummary } from '@/types'
import { cn } from '@/lib/utils'

interface MonthlyOverviewProps {
  summary: MonthlySummary
}

export function MonthlyOverview({ summary }: MonthlyOverviewProps) {
  const { totalIncome, totalExpense, balance } = summary

  return (
    <div className="grid grid-cols-3 gap-2 px-4">
      <Card>
        <CardContent className="p-3 text-center">
          <TrendingUp className="h-4 w-4 text-green-500 mx-auto mb-1" />
          <p className="text-[10px] text-muted-foreground">Thu nhập</p>
          <p className="text-xs font-semibold text-green-600 truncate">
            {formatCurrency(totalIncome)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3 text-center">
          <TrendingDown className="h-4 w-4 text-red-500 mx-auto mb-1" />
          <p className="text-[10px] text-muted-foreground">Chi tiêu</p>
          <p className="text-xs font-semibold text-red-500 truncate">
            {formatCurrency(totalExpense)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3 text-center">
          <Wallet className="h-4 w-4 text-blue-500 mx-auto mb-1" />
          <p className="text-[10px] text-muted-foreground">Số dư</p>
          <p
            className={cn(
              'text-xs font-semibold truncate',
              balance >= 0 ? 'text-blue-600' : 'text-red-500'
            )}
          >
            {formatCurrency(balance)}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
