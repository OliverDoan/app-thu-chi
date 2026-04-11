import Dexie, { type EntityTable } from 'dexie'
import type { Transaction, Category, RecurringPayment, Budget } from '@/types'
import { DEFAULT_CATEGORIES } from './seed'

class AppDatabase extends Dexie {
  transactions!: EntityTable<Transaction, 'id'>
  categories!: EntityTable<Category, 'id'>
  recurringPayments!: EntityTable<RecurringPayment, 'id'>
  budgets!: EntityTable<Budget, 'id'>

  constructor() {
    super('app-thu-chi')

    this.version(1).stores({
      transactions: 'id, type, categoryId, date, recurringPaymentId, createdAt',
      categories: 'id, type, isDefault, sortOrder',
      recurringPayments: 'id, type, isActive, categoryId',
    })

    this.version(2).stores({
      transactions: 'id, type, categoryId, date, recurringPaymentId, createdAt',
      categories: 'id, type, isDefault, sortOrder',
      recurringPayments: 'id, type, isActive, categoryId',
      budgets: 'id, categoryId, month, [categoryId+month]',
    })
  }
}

export const db = new AppDatabase()

export async function seedDefaultCategories() {
  const count = await db.categories.count()
  if (count === 0) {
    await db.categories.bulkAdd(DEFAULT_CATEGORIES)
  }
}

export async function initializeDatabase() {
  await seedDefaultCategories()
}
