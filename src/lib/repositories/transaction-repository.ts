import { db } from '@/lib/db'
import type { Transaction } from '@/types'
import { generateId } from '@/lib/utils/id'
import type { TransactionFormData } from '@/lib/validations'

export const transactionRepository = {
  async getAll(): Promise<Transaction[]> {
    return db.transactions.orderBy('date').reverse().toArray()
  },

  async getById(id: string): Promise<Transaction | undefined> {
    return db.transactions.get(id)
  },

  async getByMonth(month: string): Promise<Transaction[]> {
    const start = `${month}-01`
    const end = `${month}-31`
    return db.transactions
      .where('date')
      .between(start, end, true, true)
      .reverse()
      .sortBy('date')
  },

  async getByRecurringAndMonth(
    recurringPaymentId: string,
    month: string
  ): Promise<Transaction | undefined> {
    const start = `${month}-01`
    const end = `${month}-31`
    const results = await db.transactions
      .where('recurringPaymentId')
      .equals(recurringPaymentId)
      .filter((t) => t.date >= start && t.date <= end)
      .toArray()
    return results[0]
  },

  async create(data: TransactionFormData, recurringPaymentId?: string): Promise<Transaction> {
    const now = new Date().toISOString()
    const transaction: Transaction = {
      id: generateId(),
      ...data,
      recurringPaymentId,
      createdAt: now,
      updatedAt: now,
    }
    await db.transactions.add(transaction)
    return transaction
  },

  async update(id: string, data: Partial<TransactionFormData>): Promise<void> {
    await db.transactions.update(id, {
      ...data,
      updatedAt: new Date().toISOString(),
    })
  },

  async delete(id: string): Promise<void> {
    await db.transactions.delete(id)
  },
}
