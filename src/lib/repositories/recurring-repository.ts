import { db } from '@/lib/db'
import type { RecurringPayment } from '@/types'
import { generateId } from '@/lib/utils/id'
import type { RecurringPaymentFormData } from '@/lib/validations'

export const recurringRepository = {
  async getAll(): Promise<RecurringPayment[]> {
    return db.recurringPayments.toArray()
  },

  async getById(id: string): Promise<RecurringPayment | undefined> {
    return db.recurringPayments.get(id)
  },

  async getActive(): Promise<RecurringPayment[]> {
    return db.recurringPayments.where('isActive').equals(1).toArray()
  },

  async create(data: RecurringPaymentFormData): Promise<RecurringPayment> {
    const recurring: RecurringPayment = {
      id: generateId(),
      ...data,
    }
    await db.recurringPayments.add(recurring)
    return recurring
  },

  async update(id: string, data: Partial<RecurringPaymentFormData>): Promise<void> {
    await db.recurringPayments.update(id, data)
  },

  async updateLastGenerated(id: string, month: string): Promise<void> {
    await db.recurringPayments.update(id, { lastGeneratedMonth: month })
  },

  async delete(id: string): Promise<void> {
    await db.recurringPayments.delete(id)
  },
}
