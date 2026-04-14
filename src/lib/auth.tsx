'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  email: string
  fullName: string
}

interface AuthContextType {
  user: User | null
  isLoaded: boolean
  signIn: (email: string, password: string) => { success: boolean; error?: string }
  signUp: (email: string, password: string, fullName: string) => { success: boolean; error?: string }
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const STORAGE_KEY_USERS = 'thu-chi-users'
const STORAGE_KEY_SESSION = 'thu-chi-session'

interface StoredUser {
  email: string
  password: string
  fullName: string
}

function getStoredUsers(): StoredUser[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveStoredUsers(users: StoredUser[]) {
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users))
}

function getSession(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSION)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveSession(user: User | null) {
  if (user) {
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEY_SESSION)
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const session = getSession()
    setUser(session)
    setIsLoaded(true)
  }, [])

  const signIn = useCallback((email: string, password: string) => {
    const users = getStoredUsers()
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!found) {
      return { success: false, error: 'Email hoặc mật khẩu không đúng' }
    }
    const sessionUser: User = { email: found.email, fullName: found.fullName }
    setUser(sessionUser)
    saveSession(sessionUser)
    return { success: true }
  }, [])

  const signUp = useCallback((email: string, password: string, fullName: string) => {
    const users = getStoredUsers()
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase())
    if (exists) {
      return { success: false, error: 'Email này đã được đăng ký' }
    }
    const newUsers = [...users, { email, password, fullName }]
    saveStoredUsers(newUsers)
    const sessionUser: User = { email, fullName }
    setUser(sessionUser)
    saveSession(sessionUser)
    return { success: true }
  }, [])

  const signOut = useCallback(() => {
    setUser(null)
    saveSession(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoaded, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !user) {
      router.replace('/sign-in')
    }
  }, [isLoaded, user, router])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-muted-foreground">Đang tải...</div>
      </div>
    )
  }

  if (!user) return null

  return <>{children}</>
}
