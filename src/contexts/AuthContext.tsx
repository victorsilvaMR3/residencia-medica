/// <reference types="vite/client" />
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '../types'

// Remover redefinição de interface ImportMeta (já existe globalmente)

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; errorType?: 'email' | 'password' | 'general' }>
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string; errorType?: 'email' | 'general' }>
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
  console.log('AuthProvider renderizou');
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
        
        // Determinar o tipo de erro baseado no status HTTP
        let errorType: 'email' | 'password' | 'general' = 'general'
        if (response.status === 401) {
          // 401 pode ser email inexistente ou senha incorreta
          // Por segurança, não diferenciamos explicitamente
          errorType = 'password'
        } else if (response.status === 400) {
          errorType = 'email'
        }
        
        throw new Error(JSON.stringify({
          message: errorData.error || 'Erro no login',
          type: errorType
        }))
      }
      
      const data = await response.json()
      setUser(data.user)
      localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      localStorage.setItem('token', data.token)
      
      return { success: true }
    } catch (error: any) {
      try {
        const parsedError = JSON.parse(error.message)
        return { 
          success: false, 
          error: parsedError.message, 
          errorType: parsedError.type 
        }
      } catch {
        return { 
          success: false, 
          error: error.message || 'Erro no login',
          errorType: 'general'
        }
      }
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
        
        // Log detalhado para debug
        console.log('Register error details:', { 
          status: response.status, 
          error: errorData.error,
          errorType: errorData.error === 'Email já cadastrado' ? 'email' : 'general'
        })
        
        // Determinar o tipo de erro baseado no status HTTP e mensagem
        let errorType: 'email' | 'general' = 'general'
        if (response.status === 400 && errorData.error === 'Email já cadastrado') {
          errorType = 'email'
          console.log('Setting errorType to email')
        }
        
        throw new Error(JSON.stringify({
          message: errorData.error || 'Erro no cadastro',
          type: errorType
        }))
      }
      
      const data = await response.json()
      setUser(data.user)
      localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      localStorage.setItem('token', data.token)
      
      return { success: true }
    } catch (error: any) {
      try {
        const parsedError = JSON.parse(error.message)
        return { 
          success: false, 
          error: parsedError.message, 
          errorType: parsedError.type 
        }
      } catch {
        return { 
          success: false, 
          error: error.message || 'Erro no cadastro',
          errorType: 'general'
        }
      }
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