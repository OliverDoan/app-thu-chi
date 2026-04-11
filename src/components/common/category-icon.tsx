'use client'

import {
  Utensils, Car, Home, Zap, ShoppingBag, Gamepad2, Heart,
  GraduationCap, MoreHorizontal, Banknote, Gift, TrendingUp,
  CircleDot,
} from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import type { ComponentType } from 'react'

const iconMap: Record<string, ComponentType<LucideProps>> = {
  Utensils, Car, Home, Zap, ShoppingBag, Gamepad2, Heart,
  GraduationCap, MoreHorizontal, Banknote, Gift, TrendingUp,
  CircleDot,
}

interface CategoryIconProps {
  icon: string
  color: string
  size?: 'sm' | 'md'
}

export function CategoryIcon({ icon, color, size = 'md' }: CategoryIconProps) {
  const Icon = iconMap[icon] ?? CircleDot
  const sizeClass = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'

  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center`}
      style={{ backgroundColor: color + '20' }}
    >
      <Icon className={iconSize} style={{ color }} />
    </div>
  )
}
