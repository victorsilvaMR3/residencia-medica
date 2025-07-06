import { useAuth } from '../contexts/AuthContext'

export const usePermissions = () => {
  const { user } = useAuth()

  const isAdmin = user?.role === 'admin'
  const isModerator = user?.role === 'moderator' || user?.role === 'admin'
  const isUser = user?.role === 'user' || user?.role === 'moderator' || user?.role === 'admin'

  const hasRole = (requiredRole: 'user' | 'moderator' | 'admin') => {
    if (!user) return false
    
    switch (requiredRole) {
      case 'admin':
        return user.role === 'admin'
      case 'moderator':
        return user.role === 'moderator' || user.role === 'admin'
      case 'user':
        return true // Todos os usuários logados têm role 'user'
      default:
        return false
    }
  }

  const canAccessAdmin = () => hasRole('admin')
  const canModerate = () => hasRole('moderator')
  const canImportQuestions = () => hasRole('admin')
  const canEditQuestions = () => hasRole('moderator')

  return {
    isAdmin,
    isModerator,
    isUser,
    hasRole,
    canAccessAdmin,
    canModerate,
    canImportQuestions,
    canEditQuestions
  }
} 