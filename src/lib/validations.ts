import { z } from 'zod'

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive('Số tiền phải lớn hơn 0'),
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  note: z.string().max(500, 'Ghi chú tối đa 500 ký tự').default(''),
  date: z.string().min(1, 'Vui lòng chọn ngày'),
})

export type TransactionFormData = z.infer<typeof transactionSchema>

export const categorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục không được trống').max(50, 'Tên tối đa 50 ký tự'),
  icon: z.string().min(1, 'Vui lòng chọn icon'),
  color: z.string().min(1, 'Vui lòng chọn màu'),
  type: z.enum(['income', 'expense']),
})

export type CategoryFormData = z.infer<typeof categorySchema>

export const recurringPaymentSchema = z.object({
  name: z.string().min(1, 'Tên không được trống').max(100, 'Tên tối đa 100 ký tự'),
  type: z.enum(['income', 'expense']),
  amount: z.number().positive('Số tiền phải lớn hơn 0'),
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  dayOfMonth: z.number().int().min(1, 'Ngày phải từ 1').max(31, 'Ngày tối đa 31'),
  isActive: z.boolean().default(true),
  startDate: z.string().min(1, 'Vui lòng chọn ngày bắt đầu'),
  endDate: z.string().optional(),
})

export type RecurringPaymentFormData = z.infer<typeof recurringPaymentSchema>
