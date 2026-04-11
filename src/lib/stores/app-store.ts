import { create } from 'zustand'
import { getCurrentMonth } from '@/lib/utils/date'

interface AppState {
  currentMonth: string
  isInitialized: boolean
  setCurrentMonth: (month: string) => void
  setInitialized: (value: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  currentMonth: getCurrentMonth(),
  isInitialized: false,
  setCurrentMonth: (month) => set({ currentMonth: month }),
  setInitialized: (value) => set({ isInitialized: value }),
}))
