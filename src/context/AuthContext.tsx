/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import type { AuthUser } from '../services/auth'
import api from '../utils/api'
import {
  login as loginSvc,
  logout as logoutSvc,
  signup as signupSvc,
} from '../services/auth'
import { useEffect } from 'react'

type AuthContextValue = {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<void>
  signup: (input: {
    name: string
    cpf: string
    birth: string
    email: string
    password: string
  }) => Promise<void>
  logout: () => Promise<void>
  setUser: (u: AuthUser | null) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const { data } = await api.get<{ user: AuthUser }>('/auth/me')
        if (mounted && data?.user) setUser(data.user)
      } catch {
        // 401: permanece deslogado
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  async function login(email: string, password: string) {
    const { user } = await loginSvc({ email, password })
    setUser(user)
  }

  async function signup(input: {
    name: string
    cpf: string
    birth: string
    email: string
    password: string
  }) {
    const { user } = await signupSvc(input)
    setUser(user)
  }

  async function logout() {
    await logoutSvc()
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, login, signup, logout, setUser }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
