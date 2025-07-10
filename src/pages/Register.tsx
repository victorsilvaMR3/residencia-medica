// Forçar novo deploy - debug erro de exibição de mensagem de email já cadastrado
import React, { useState, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react'

const Register: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [errorType, setErrorType] = useState<'email' | 'general'>('general')
  const [forceRender, setForceRender] = useState(0);
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const errorRef = useRef({ error: '', errorType: 'general' as 'email' | 'general' })

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const passwordInput = form.elements.namedItem('password') as HTMLInputElement;
    const confirmPasswordInput = form.elements.namedItem('confirmPassword') as HTMLInputElement;
    const currentPassword = passwordInput?.value || '';
    const currentConfirmPassword = confirmPasswordInput?.value || '';

    if (currentPassword !== currentConfirmPassword) {
      setError('As senhas não coincidem');
      setErrorType('general');
      return;
    }

    if (currentPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setErrorType('general');
      return;
    }

    setError('');
    setErrorType('general');

    try {
      const result = await register(email, currentPassword, name);

      if (result.success) {
        // navigate('/dashboard'); // Remover temporariamente para depuração
      } else {
        console.log('Entrou no else do erro do backend', result);
        setError(result.error || 'Erro ao criar conta');
        setErrorType(result.errorType || 'general');
        errorRef.current = { error: result.error || '', errorType: result.errorType || 'general' };
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
      setErrorType('general');
    }
  }, [email, name, register]);

  const getErrorMessage = () => {
    
    // Usar o valor mais atualizado
    const currentErrorType = errorRef.current.errorType || errorType
    const currentError = errorRef.current.error || error
    
    switch (currentErrorType) {
      case 'email':
        return 'Este email já está cadastrado. Tente fazer login ou use outro email.'
      default:
        return currentError || 'Erro ao criar conta. Tente novamente.'
    }
  }

  const getErrorIcon = () => {
    // Usar o valor mais atualizado
    const currentErrorType = errorRef.current.errorType || errorType
    
    switch (currentErrorType) {
      case 'email':
        return <Mail className="h-5 w-5" />
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Criar nova conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link
              to="/login"
              className="font-medium text-success-600 hover:text-success-500"
            >
              entre na sua conta existente
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getErrorIcon()}
              </div>
              <div>
                <p className="text-sm font-medium">{getErrorMessage()}</p>
                {errorType === 'email' && (
                  <p className="text-xs mt-1">
                    <Link to="/login" className="text-error-600 hover:text-error-500 underline">
                      Fazer login
                    </Link>
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome completo
              </label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Seu nome completo"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`