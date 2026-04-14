'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { BottomNav } from './bottom-nav'
import { ErrorBoundary } from '@/components/common/error-boundary'
import { useAppStore } from '@/lib/stores/app-store'
import { initializeDatabase } from '@/lib/db'
import { generateRecurringTransactions } from '@/lib/services/recurring-service'
import { AuthGuard } from '@/lib/auth'

const PUBLIC_PATHS = ['/sign-in', '/sign-up']

export function AppShell({ children }: { children: React.ReactNode }) {
  const { currentMonth, isInitialized, setInitialized } = useAppStore()
  const pathname = usePathname()

  const isPublicPage = PUBLIC_PATHS.some((p) => pathname.startsWith(p))

  useEffect(() => {
    async function init() {
      await initializeDatabase()
      await generateRecurringTransactions(currentMonth)
      setInitialized(true)
    }
    init()
  }, [currentMonth, setInitialized])

  if (isPublicPage) {
    return <>{children}</>
  }

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-muted-foreground">Đang tải...</div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-16">
        <main className="flex-1">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
        <BottomNav />
      </div>
    </AuthGuard>
  )
}
