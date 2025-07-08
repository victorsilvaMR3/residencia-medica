/// <reference types="vite/client" />
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '../types'

// Remover redefinição de interface ImportMeta (já existe globalmente)

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

const USER_KEY = 'provaexpress_user'
const API_URL = import.meta.env.VITE_API_URL;

// Remover linha de declaração de import.meta (não necessária)

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const stored = localStorage.getItem(USER_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        parsed.createdAt = new Date(parsed.createdAt)
        setUser(parsed)
      } catch {
        setUser(null)
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro no login')
      }
      const data = await response.json()
      setUser(data.user)
      localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      localStorage.setItem('token', data.token)
    } catch (error: any) {
      throw new Error(error.message || 'Erro no login')
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro no cadastro')
      }
      const data = await response.json()
      setUser(data.user)
      localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      localStorage.setItem('token', data.token)
    } catch (error: any) {
      throw new Error(error.message || 'Erro no cadastro')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setUser(null)
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem('token')
    } catch (error) {
      throw new Error('Erro no logout')
    } finally {
      setLoading(false)
    }
  }

  // Remover createAdminUser e simulações

  const value = {
    user,
    loading,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 