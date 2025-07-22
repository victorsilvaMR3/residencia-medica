/// <reference types="vite/client" />
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '../types'
import { isTokenExpired } from '../utils/jwt'
import { useQuestions } from './QuestionContext'

// Remover redefinição de interface ImportMeta (já existe globalmente)

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; errorType?: 'email' | 'password' | 'general' }>
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string; errorType?: 'email' | 'general' }>
  logout: () => Promise<void>
  registerError: string | null
  setRegisterError: (error: string | null) => void
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
  const [registerError, setRegisterError] = useState<string | null>(null)
  const { setUserAnswers } = useQuestions();

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    console.log('🔍 [AuthContext] Iniciando carregamento do usuário...')
    console.log('🔍 [AuthContext] API_URL:', API_URL)
    
    const stored = localStorage.getItem(USER_KEY)
    const token = localStorage.getItem('token')
    console.log('🔍 [AuthContext] Dados do localStorage:', stored ? 'encontrados' : 'não encontrados')
    console.log('🔍 [AuthContext] Token encontrado:', token ? 'sim' : 'não')
    
    if (stored && token) {
      // Verificar validade do token
      if (isTokenExpired(token)) {
        console.warn('⚠️ [AuthContext] Token expirado ou inválido. Fazendo logout automático.')
        setUser(null)
        localStorage.removeItem(USER_KEY)
        localStorage.removeItem('token')
      } else {
        try {
          const parsed = JSON.parse(stored)
          console.log('🔍 [AuthContext] Usuário parseado:', parsed)
          parsed.createdAt = new Date(parsed.createdAt)
          setUser(parsed)
          console.log('🔍 [AuthContext] Usuário definido no estado:', parsed)
        } catch (error) {
          console.error('❌ [AuthContext] Erro ao parsear usuário do localStorage:', error)
          setUser(null)
        }
      }
    } else {
      console.log('🔍 [AuthContext] Nenhum usuário encontrado no localStorage ou token ausente')
    }
    
    setLoading(false)
    console.log('🔍 [AuthContext] Loading definido como false')
  }, [])

  // Log quando o estado do usuário muda
  useEffect(() => {
    console.log('🔍 [AuthContext] Estado do usuário mudou:', user)
    console.log('🔍 [AuthContext] Loading:', loading)
  }, [user, loading])

  const login = async (email: string, password: string) => {
    console.log('🔍 [AuthContext] Iniciando login para:', email)
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      
      console.log('🔍 [AuthContext] Resposta do login:', response.status, response.statusText)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ [AuthContext] Erro no login:', errorData)
        
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
      console.log('🔍 [AuthContext] Dados do login recebidos:', data)
      setUser({ ...data.user, createdAt: new Date(data.user.createdAt) })
      localStorage.setItem(USER_KEY, JSON.stringify({ ...data.user, createdAt: new Date(data.user.createdAt) }))
      localStorage.setItem('token', data.token)
      // Buscar respostas do usuário após login
      try {
        const answersRes = await fetch(`${API_URL}/api/answers`, {
          headers: { 'Authorization': `Bearer ${data.token}` }
        })
        if (answersRes.ok) {
          const answers = await answersRes.json()
          setUserAnswers(answers)
        }
      } catch (err) {
        console.error('Erro ao buscar respostas do usuário:', err)
      }
      console.log('🔍 [AuthContext] Login realizado com sucesso')
      
      return { success: true }
    } catch (error: any) {
      console.error('❌ [AuthContext] Erro no login:', error)
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
      console.log('🔍 [AuthContext] Loading definido como false após login')
    }
  }

  const register = async (email: string, password: string, name: string) => {
    console.log('🔍 [AuthContext] Iniciando registro para:', email)
    setLoading(true)
    setRegisterError(null)
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })
      
      console.log('🔍 [AuthContext] Resposta do registro:', response.status, response.statusText)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ [AuthContext] Erro no registro:', errorData)
        
        // Determinar o tipo de erro baseado no status HTTP e mensagem
        let errorType: 'email' | 'general' = 'general'
        if (response.status === 400 && errorData.error === 'Email já cadastrado') {
          errorType = 'email'
        }
        setRegisterError(errorData.error || 'Erro no cadastro')
        throw new Error(JSON.stringify({
          message: errorData.error || 'Erro no cadastro',
          type: errorType
        }))
      }
      const data = await response.json()
      console.log('🔍 [AuthContext] Dados do registro recebidos:', data)
      setUser({ ...data.user, createdAt: new Date(data.user.createdAt) })
      localStorage.setItem(USER_KEY, JSON.stringify({ ...data.user, createdAt: new Date(data.user.createdAt) }))
      localStorage.setItem('token', data.token)
      setRegisterError(null)
      console.log('🔍 [AuthContext] Registro realizado com sucesso')
      return { success: true }
    } catch (error: any) {
      console.error('❌ [AuthContext] Erro no registro:', error)
      try {
        const parsedError = JSON.parse(error.message)
        setRegisterError(parsedError.message)
        return { 
          success: false, 
          error: parsedError.message, 
          errorType: parsedError.type 
        }
      } catch {
        setRegisterError(error.message || 'Erro no cadastro')
        return { 
          success: false, 
          error: error.message || 'Erro no cadastro',
          errorType: 'general'
        }
      }
    } finally {
      setLoading(false)
      console.log('🔍 [AuthContext] Loading definido como false após registro')
    }
  }

  const logout = async () => {
    console.log('🔍 [AuthContext] Iniciando logout')
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setUser(null)
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem('token')
      console.log('🔍 [AuthContext] Logout realizado com sucesso')
    } catch (error) {
      console.error('❌ [AuthContext] Erro no logout:', error)
      throw new Error('Erro no logout')
    } finally {
      setLoading(false)
      console.log('🔍 [AuthContext] Loading definido como false após logout')
    }
  }

  // Remover createAdminUser e simulações

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    registerError,
    setRegisterError
  }

  console.log('🔍 [AuthContext] Renderizando AuthProvider com valor:', { user: user?.email, loading })

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 