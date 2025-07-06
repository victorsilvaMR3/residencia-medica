import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'moderator'
  fallbackPath?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'admin',
  fallbackPath = '/'
}) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-success-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Verificar se o usuário tem a role necessária
  const hasRequiredRole = user.role === requiredRole || user.role === 'admin'

  if (!hasRequiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
          <p className="text-gray-600 mb-6">
            Você não tem permissão para acessar esta página. 
            Entre em contato com o administrador se acredita que isso é um erro.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
