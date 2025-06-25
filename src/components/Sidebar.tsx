import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
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
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Sidebar: React.FC = () => {
  const location = useLocation()
  const { user, logout } = useAuth()
  const [expanded, setExpanded] = useState(false)

  const menuItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/questions', icon: BookOpen, label: 'Questões' },
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/profile', icon: UserIcon, label: 'Perfil' },
  ]

  const specialties = [
    { name: 'Cardiologia', icon: Heart, color: 'text-red-400' },
    { name: 'Neurologia', icon: Brain, color: 'text-success-400' },
    { name: 'Pneumologia', icon: Activity, color: 'text-green-400' },
  ]

  return (
    <aside
      className={`h-screen bg-white border-r border-gray-100 flex flex-col justify-between shadow-sm transition-all duration-200
        ${expanded ? 'w-64' : 'w-20'}
      `}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div>
        {/* Logo */}
        <div className={`flex items-center h-20 px-4 border-b border-gray-100 transition-all duration-200 ${expanded ? 'justify-start' : 'justify-center'}`}>
          {/* Logo + título */}
          {expanded ? (
            <>
              <img src="/logo.png" alt="Logo" className="h-12 w-12 object-contain mr-2" />
              <span className="text-xl font-bold text-success-600 tracking-tight">ProvaExpress</span>
            </>
          ) : (
            <span className="flex items-center justify-center w-20 h-20">
              <img src="/logo.png" alt="Logo" className="h-12 w-12 object-contain" />
            </span>
          )}
        </div>
        {/* Menu principal */}
        <nav className="mt-4 flex flex-col gap-1">
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
        {/* Especialidades */}
        <div className="mt-6">
          <h3 className={`${expanded ? 'block' : 'hidden'} px-6 text-xs text-gray-400 font-semibold uppercase mb-2 tracking-wider transition-all duration-200`}>Especialidades</h3>
          <nav className="flex flex-col gap-1">
            {specialties.map((specialty) => {
              const Icon = specialty.icon
              return (
                <Link
                  key={specialty.name}
                  to={`/questions?specialty=${specialty.name}`}
                  className={`flex items-center ${expanded ? 'gap-3 justify-start' : 'justify-center'} px-4 py-2 rounded-xl mx-2 my-1 text-gray-500 hover:bg-gray-50 hover:text-success-600 transition-colors text-sm`}
                  title={specialty.name}
                >
                  <Icon className={`h-5 w-5 ${specialty.color}`} />
                  <span className={`${expanded ? 'inline' : 'hidden'} transition-all duration-200`}>{specialty.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
      {/* Avatar e logout */}
      <div className={`flex flex-col items-center ${expanded ? 'md:items-stretch' : ''} gap-2 p-4 border-t border-gray-100`}>
        {user && (
          <div className={`flex items-center gap-3 mb-2 ${expanded ? '' : 'justify-center w-full'}`}>
            <div className="w-10 h-10 rounded-full bg-success-100 flex items-center justify-center text-success-600 font-bold text-lg">
              {user.name.charAt(0)}
            </div>
            <div className={`${expanded ? 'block' : 'hidden'}`}>
              <div className="font-semibold text-gray-900 text-sm">{user.name}</div>
              <div className="text-xs text-gray-400">{user.email}</div>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-red-500 transition-colors text-sm w-full ${expanded ? 'justify-start' : 'justify-center'}`}
        >
          <LogOut className="h-4 w-4" />
          <span className={`${expanded ? 'inline' : 'hidden'}`}>Sair</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar 