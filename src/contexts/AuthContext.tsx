import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '../types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  createAdminUser: () => void // Para teste
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const stored = localStorage.getItem(USER_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Converter datas de string para Date
        parsed.createdAt = new Date(parsed.createdAt)
        setUser(parsed)
      } catch {
        setUser(null)
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, _password: string) => {
    setLoading(true)
    try {
      // Simulação de login
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Verificar se é o email do administrador
      const isAdmin = email === 'victorsilva43@gmail.com'
      
      const mockUser: User = {
        id: isAdmin ? 'admin-1' : '1',
        email,
        name: isAdmin ? 'Victor Silva (Admin)' : 'Usuário Teste',
        createdAt: new Date(),
        subscription: isAdmin ? 'pro' : 'free',
        role: isAdmin ? 'admin' : 'user'
      }
      setUser(mockUser)
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser))
    } catch (error) {
      throw new Error('Erro no login')
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, _password: string, name: string) => {
    setLoading(true)
    try {
      // Simulação de registro
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Verificar se é o email do administrador
      const isAdmin = email === 'victorsilva43@gmail.com'
      
      const mockUser: User = {
        id: isAdmin ? 'admin-1' : '1',
        email,
        name: isAdmin ? 'Victor Silva (Admin)' : name,
        createdAt: new Date(),
        subscription: isAdmin ? 'pro' : 'free',
        role: isAdmin ? 'admin' : 'user'
      }
      setUser(mockUser)
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser))
    } catch (error) {
      throw new Error('Erro no registro')
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
    } catch (error) {
      throw new Error('Erro no logout')
    } finally {
      setLoading(false)
    }
  }

  const createAdminUser = () => {
    const adminUser: User = {
      id: 'admin-1',
      email: 'admin@provaexpress.com',
      name: 'Administrador',
      createdAt: new Date(),
      subscription: 'pro',
      role: 'admin'
    }
    setUser(adminUser)
    localStorage.setItem(USER_KEY, JSON.stringify(adminUser))
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    createAdminUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 