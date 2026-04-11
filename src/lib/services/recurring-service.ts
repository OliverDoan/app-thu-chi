import { recurringRepository } from '@/lib/repositories/recurring-repository'
import { transactionRepository } from '@/lib/repositories/transaction-repository'
import { clampDayToMonth } from '@/lib/utils/date'

export async function generateRecurringTransactions(month: string): Promise<number> {
  const activeRecurrings = await recurringRepository.getActive()
  let generated = 0

  for (const recurring of activeRecurrings) {
    if (recurring.startDate > `${month}-31`) continue
    if (recurring.endDate && recurring.endDate < `${month}-01`) continue
    if (recurring.lastGeneratedMonth && recurring.lastGeneratedMonth >= month) continue

    const existing = await transactionRepository.getByRecurringAndMonth(recurring.id, month)
    if (existing) {
      await recurringRepository.updateLastGenerated(recurring.id, month)
      continue
    }

    const day = clampDayToMonth(recurring.dayOfMonth, month)
    const dayStr = day.toString().padStart(2, '0')

    await transactionRepository.create(
      {
        type: recurring.type,
        amount: recurring.amount,
        categoryId: recurring.categoryId,
        note: recurring.name,
        date: `${month}-${dayStr}`,
      },
      recurring.id
    )

    await recurringRepository.updateLastGenerated(recurring.id, month)
    generated++
  }

  return generated
}
