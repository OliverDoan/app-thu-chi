import {
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  getDaysInMonth,
  parseISO,
} from 'date-fns'
import { vi } from 'date-fns/locale'

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'dd/MM/yyyy')
}

export function formatDateShort(dateStr: string): string {
  return format(parseISO(dateStr), 'dd/MM')
}

export function formatMonthYear(dateStr: string): string {
  return format(parseISO(dateStr + '-01'), 'MMMM yyyy', { locale: vi })
}

export function formatMonthYearShort(dateStr: string): string {
  return format(parseISO(dateStr + '-01'), 'MM/yyyy')
}

export function getCurrentMonth(): string {
  return format(new Date(), 'yyyy-MM')
}

export function getToday(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function getMonthRange(month: string): { start: string; end: string } {
  const date = parseISO(month + '-01')
  return {
    start: format(startOfMonth(date), 'yyyy-MM-dd'),
    end: format(endOfMonth(date), 'yyyy-MM-dd'),
  }
}

export function getPreviousMonth(month: string): string {
  const date = parseISO(month + '-01')
  return format(subMonths(date, 1), 'yyyy-MM')
}

export function getNextMonth(month: string): string {
  const date = parseISO(month + '-01')
  return format(addMonths(date, 1), 'yyyy-MM')
}

export function getLastDayOfMonth(month: string): number {
  const date = parseISO(month + '-01')
  return getDaysInMonth(date)
}

export function clampDayToMonth(day: number, month: string): number {
  const maxDay = getLastDayOfMonth(month)
  return Math.min(day, maxDay)
}

export function formatDayMonth(dateStr: string): string {
  const date = parseISO(dateStr)
  return format(date, 'dd MMM', { locale: vi })
}
