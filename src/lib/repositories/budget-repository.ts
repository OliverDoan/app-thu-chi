import { db } from '@/lib/db'
import type { Budget } from '@/types'
import { generateId } from '@/lib/utils/id'

export const budgetRepository = {
  async getByMonth(month: string): Promise<Budget[]> {
    const specific = await db.budgets.where('month').equals(month).toArray()
    const global = await db.budgets.where('month').equals('all').toArray()

    // Specific month budgets override global ones
    const map = new Map<string, Budget>()
    for (const b of global) map.set(b.categoryId, b)
    for (const b of specific) map.set(b.categoryId, b)
    return Array.from(map.values())
  },

  async getAll(): Promise<Budget[]> {
    return db.budgets.toArray()
  },

  async upsert(categoryId: string, amount: number, month: string = 'all'): Promise<Budget> {
    const existing = await db.budgets
      .where('[categoryId+month]')
      .equals([categoryId, month])
      .first()

    if (existing) {
      await db.budgets.update(existing.id, { amount })
      return { ...existing, amount }
    }

    const budget: Budget = { id: generateId(), categoryId, amount, month }
    await db.budgets.add(budget)
    return budget
  },

  async delete(id: string): Promise<void> {
    await db.budgets.delete(id)
  },

  async deleteByCategoryAndMonth(categoryId: string, month: string): Promise<void> {
    const existing = await db.budgets
      .where('[categoryId+month]')
      .equals([categoryId, month])
      .first()
    if (existing) await db.budgets.delete(existing.id)
  },
}
