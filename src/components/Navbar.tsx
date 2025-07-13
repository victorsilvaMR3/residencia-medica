import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LogOut } from 'lucide-react'

const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm h-16 flex items-center px-4 md:px-8 justify-between z-10">
      <div className="flex items-center gap-8">
        {/* Logo e nome */}
        <div className="flex items-center gap-2">
          <span className="text-success-600 text-2xl font-bold">PE</span>
          <span className="hidden md:block text-lg font-semibold text-gray-900 tracking-tight">Prova Residência Express</span>
        </div>
        {/* Menu de navegação */}
        {user && (
          <div className="hidden md:flex items-center gap-6 ml-8">
            <Link to="/questions/list" className="text-gray-700 hover:text-success-600 font-medium">Questões</Link>
            <Link to="/revisoes" className="text-gray-700 hover:text-success-600 font-medium">Revisões</Link>
          </div>
        )}
      </div>
      {/* Usuário ou login/cadastro */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-success-50 hover:bg-success-100 transition-colors text-success-600 font-medium"
              title="Perfil"
            >
              <div className="w-8 h-8 rounded-full bg-success-100 flex items-center justify-center text-success-600 font-bold">
                {user.name.charAt(0)}
              </div>
              <span className="hidden md:block text-sm font-semibold">{user.name.split(' ')[0]}</span>
            </button>
            <button
              onClick={async () => {
                await logout();
                navigate('/');
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-full text-gray-400 hover:text-red-500 transition-colors"
              title="Sair"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-4 py-2 rounded-full text-success-600 font-medium hover:bg-success-50 transition-colors"
            >
              Entrar
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-full bg-success-600 text-white font-medium hover:bg-success-700 transition-colors"
            >
              Cadastrar
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar 