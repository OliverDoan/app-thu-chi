export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount)
}

export function parseCurrencyInput(value: string): number {
  const cleaned = value.replace(/[^\d]/g, '')
  return parseInt(cleaned, 10) || 0
}

const DIGITS = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín']

function readGroup(hundreds: number, tens: number, ones: number, showZeroHundreds: boolean): string {
  const parts: string[] = []

  if (hundreds > 0) {
    parts.push(`${DIGITS[hundreds]} trăm`)
  } else if (showZeroHundreds) {
    parts.push('không trăm')
  }

  if (tens > 1) {
    parts.push(`${DIGITS[tens]} mươi`)
    if (ones === 1) parts.push('mốt')
    else if (ones === 4) parts.push('tư')
    else if (ones === 5) parts.push('lăm')
    else if (ones > 0) parts.push(DIGITS[ones])
  } else if (tens === 1) {
    parts.push('mười')
    if (ones === 5) parts.push('lăm')
    else if (ones > 0) parts.push(DIGITS[ones])
  } else if (ones > 0) {
    if (hundreds > 0 || showZeroHundreds) parts.push('lẻ')
    parts.push(DIGITS[ones])
  }

  return parts.join(' ')
}

const UNITS = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ']

export function numberToVietnameseWords(n: number): string {
  if (n === 0) return 'không đồng'
  if (n < 0) return `âm ${numberToVietnameseWords(-n)}`

  const groups: number[] = []
  let remaining = Math.floor(n)

  while (remaining > 0) {
    groups.push(remaining % 1000)
    remaining = Math.floor(remaining / 1000)
  }

  const parts: string[] = []

  for (let i = groups.length - 1; i >= 0; i--) {
    const group = groups[i]
    if (group === 0) continue

    const hundreds = Math.floor(group / 100)
    const tens = Math.floor((group % 100) / 10)
    const ones = group % 10

    const showZeroHundreds = i < groups.length - 1 && hundreds === 0 && group > 0
    const text = readGroup(hundreds, tens, ones, showZeroHundreds)

    if (text) {
      parts.push(UNITS[i] ? `${text} ${UNITS[i]}` : text)
    }
  }

  return `${parts.join(' ')} đồng`
}
