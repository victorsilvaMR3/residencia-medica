import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Home,
  BookOpen,
  BarChart3,
  User as UserIcon,
  LogOut,
  Settings,
  Heart,
  Brain,
  Activity,
  Repeat,
  GraduationCap,
  ChevronDown,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Sidebar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [expanded, setExpanded] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Fechar menu quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setShowUserMenu(false)
      navigate('/')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const baseMenuItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/questions', icon: BookOpen, label: 'Questões' },
    { path: '/revisoes', icon: Repeat, label: 'Revisões' },
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/profile', icon: UserIcon, label: 'Perfil' },
  ]

  // Adicionar Admin apenas para administradores
  const menuItems = user?.role === 'admin' 
    ? [
        ...baseMenuItems, 
        { path: '/admin', icon: Settings, label: 'Admin' },
        { path: '/admin/users', icon: UserIcon, label: 'Usuários' }
      ]
    : baseMenuItems

  return (
    <aside
      className={`h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-200
        ${expanded ? 'w-64 shadow-md' : 'w-20 shadow-sm'}
      `}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="flex-1 flex flex-col min-h-0">
        {/* Logo */}
        <div className={`flex items-center h-20 px-4 border-b border-gray-100 transition-all duration-200 ${expanded ? 'justify-start' : 'justify-center'}`}>
          {/* Logo + título */}
          {expanded ? (
            <>
              <GraduationCap className="h-12 w-12 text-success-600 mr-2" />
              <span className="text-xl font-bold text-success-600 tracking-tight">ProvaExpress</span>
            </>
          ) : (
            <span className="flex items-center justify-center w-20 h-20">
              <GraduationCap className="h-12 w-12 text-success-600" />
            </span>
          )}
        </div>
        {/* Menu principal com scroll */}
        <nav className="mt-4 flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar px-0" style={{ minHeight: 0 }}>
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center ${expanded ? 'gap-3 justify-start' : 'justify-center'} px-4 py-3 rounded-xl mx-2 my-1 transition-colors text-sm font-medium
                  ${isActive ? 'bg-success-50 text-success-600' : 'text-gray-600 hover:bg-gray-50 hover:text-success-600'}`}
                title={item.label}
              >
                <Icon className="h-5 w-5" />
                <span className={`${expanded ? 'inline' : 'hidden'} transition-all duration-200`}>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
      {/* Avatar e menu do usuário fixo na base */}
      <div className={`flex flex-col items-center ${expanded ? 'md:items-stretch' : ''} gap-2 p-4 border-t border-gray-100`} style={{ flexShrink: 0 }}>
        {user && (
          <div className="relative w-full" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-50 transition-colors ${expanded ? 'justify-start' : 'justify-center'}`}
            >
              <div className="w-10 h-10 rounded-full bg-success-100 flex items-center justify-center text-success-600 font-bold text-lg flex-shrink-0">
                {user.name.charAt(0)}
              </div>
              {expanded && (
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-sm truncate">{user.name}</div>
                  <div className="text-xs text-gray-400 truncate">{user.email}</div>
                </div>
              )}
              {expanded && (
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              )}
            </button>
            {/* Dropdown menu */}
            {showUserMenu && expanded && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <UserIcon className="h-4 w-4" />
                    <span>Meu Perfil</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar 