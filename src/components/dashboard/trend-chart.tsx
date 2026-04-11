'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import type { MonthlyTrend } from '@/lib/services/trend-service'
import { formatCurrency } from '@/lib/utils/format'

interface TrendChartProps {
  trends: MonthlyTrend[]
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload) return null
  return (
    <div className="bg-popover border border-border rounded-lg p-2 shadow-md text-xs">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((entry, idx) => (
        <p key={idx} style={{ color: entry.color }}>
          {entry.name === 'income' ? 'Thu nhập' : 'Chi tiêu'}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  )
}

export function TrendChart({ trends }: TrendChartProps) {
  if (trends.length === 0) return null

  const maxValue = Math.max(
    ...trends.flatMap((t) => [t.income, t.expense])
  )

  return (
    <div className="px-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Xu hướng thu chi
      </h3>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={trends} barGap={2} barSize={14}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={45}
              tickFormatter={(v: number) => {
                if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(0)}M`
                if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`
                return v.toString()
              }}
              domain={[0, maxValue > 0 ? 'auto' : 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value: string) => (
                <span className="text-xs">
                  {value === 'income' ? 'Thu nhập' : 'Chi tiêu'}
                </span>
              )}
            />
            <Bar dataKey="income" fill="#22c55e" radius={[3, 3, 0, 0]} />
            <Bar dataKey="expense" fill="#ef4444" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
