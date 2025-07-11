// Forçar novo deploy - debug erro de exibição de mensagem de email já cadastrado
import React, { useState, useCallback, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react'

const Register: React.FC = () => {
  useEffect(() => {
    return () => {
    };
  }, []);
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [errorType, setErrorType] = useState<'email' | 'general'>('general')
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // @ts-ignore
    if (typeof e.returnValue !== 'undefined') e.returnValue = false;
    try {
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

      // Não limpar o erro aqui!
      // setError('');
      // setErrorType('general');

      // const result = await register(email, currentPassword, name);
      // if (result.success) {
      //   // Limpar campos e erro só em caso de sucesso
      //   setName('');
      //   setEmail('');
      //   setPassword('');
      //   setConfirmPassword('');
      //   setError('');
      //   setErrorType('general');
      //   // navigate('/dashboard'); // Remover temporariamente para depuração
      //   console.log('Cadastro com sucesso, limpando campos e erro');
      // } else {
      //   console.log('Entrou no else do erro do backend', result);
      //   setError(result.error || 'Erro ao criar conta');
      //   setErrorType(result.errorType || 'general');
      //   console.log('Erro setado:', result.error, result.errorType);
      //   console.log('error depois do setError:', result.error || 'Erro ao criar conta');
      // }
      setError('Teste erro backend');
      setErrorType('email');
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
      setErrorType('general');
    }
  }, [email, name, register]);

  const getErrorMessage = () => {
    switch (errorType) {
      case 'email':
        return 'Este email já está cadastrado. Tente fazer login ou use outro email.'
      default:
        return error || 'Erro ao criar conta. Tente novamente.'
    }
  }

  const getErrorIcon = () => {
    switch (errorType) {
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
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} autoComplete="off" method="post" noValidate>
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
                  className="input-field pl-10"
                  placeholder="seu@email.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar senha
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  placeholder="Confirme sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <input
              id="agree-terms"
              name="agree-terms"
              type="checkbox"
              required
              className="h-4 w-4 text-success-600 focus:ring-success-500 border-gray-300 rounded"
            />
            <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
              Concordo com os{' '}
              <a href="#" className="text-success-600 hover:text-success-500">
                termos de uso
              </a>{' '}
              e{' '}
              <a href="#" className="text-success-600 hover:text-success-500">
                política de privacidade
              </a>
            </label>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-success-600 hover:bg-success-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register