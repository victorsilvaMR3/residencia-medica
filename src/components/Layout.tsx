import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {user && (
        <div className="fixed inset-y-0 left-0 z-30">
          <Sidebar />
        </div>
      )}
      <main className={`flex-1 p-6 transition-all duration-300 overflow-y-auto min-h-screen ${user ? 'pl-20' : ''}`}>
        {children}
      </main>
    </div>
  )
}

export default Layout 