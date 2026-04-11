import { create } from 'zustand'

interface DataState {
  transactionVersion: number
  recurringVersion: number
  categoryVersion: number
  invalidateTransactions: () => void
  invalidateRecurring: () => void
  invalidateCategories: () => void
}

export const useDataStore = create<DataState>((set) => ({
  transactionVersion: 0,
  recurringVersion: 0,
  categoryVersion: 0,
  invalidateTransactions: () =>
    set((state) => ({ transactionVersion: state.transactionVersion + 1 })),
  invalidateRecurring: () =>
    set((state) => ({ recurringVersion: state.recurringVersion + 1 })),
  invalidateCategories: () =>
    set((state) => ({ categoryVersion: state.categoryVersion + 1 })),
}))
