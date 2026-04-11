import { db } from '@/lib/db'
import type { Category, TransactionType } from '@/types'
import { generateId } from '@/lib/utils/id'
import type { CategoryFormData } from '@/lib/validations'

export const categoryRepository = {
  async getAll(): Promise<Category[]> {
    return db.categories.orderBy('sortOrder').toArray()
  },

  async getById(id: string): Promise<Category | undefined> {
    return db.categories.get(id)
  },

  async getByType(type: TransactionType): Promise<Category[]> {
    return db.categories.where('type').equals(type).sortBy('sortOrder')
  },

  async create(data: CategoryFormData): Promise<Category> {
    const maxOrder = await db.categories
      .where('type')
      .equals(data.type)
      .toArray()
      .then((cats) => Math.max(0, ...cats.map((c) => c.sortOrder)))

    const category: Category = {
      id: generateId(),
      ...data,
      isDefault: false,
      sortOrder: maxOrder + 1,
    }
    await db.categories.add(category)
    return category
  },

  async update(id: string, data: Partial<CategoryFormData>): Promise<void> {
    await db.categories.update(id, data)
  },

  async delete(id: string): Promise<void> {
    await db.categories.delete(id)
  },
}
