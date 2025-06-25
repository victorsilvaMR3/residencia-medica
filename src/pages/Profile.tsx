import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { User, Mail, Calendar, Crown, Settings } from 'lucide-react'

const Profile: React.FC = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')

  const handleSave = () => {
    // Aqui você implementaria a lógica para salvar as alterações
    setIsEditing(false)
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Faça login para ver seu perfil</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
        <p className="text-gray-600">
          Gerencie suas informações pessoais e configurações
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações do Perfil */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Informações Pessoais</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                {isEditing ? 'Cancelar' : 'Editar'}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome completo
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-gray-900">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{user.name}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="flex items-center space-x-2 text-gray-900">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{user.email}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Membro desde
                </label>
                <div className="flex items-center space-x-2 text-gray-900">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{user.createdAt.toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plano
                </label>
                <div className="flex items-center space-x-2">
                  <Crown className={`h-4 w-4 ${
                    user.subscription === 'pro' ? 'text-warning-500' : 'text-gray-400'
                  }`} />
                  <span className={`font-medium ${
                    user.subscription === 'pro' ? 'text-warning-600' : 'text-gray-600'
                  }`}>
                    {user.subscription === 'pro' ? 'Plano Pro' : 'Plano Gratuito'}
                  </span>
                </div>
              </div>

              {isEditing && (
                <div className="pt-4">
                  <button
                    onClick={handleSave}
                    className="btn-primary"
                  >
                    Salvar Alterações
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Plano Atual */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Plano Atual</h3>
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                user.subscription === 'pro' ? 'bg-warning-100' : 'bg-gray-100'
              }`}>
                <Crown className={`h-8 w-8 ${
                  user.subscription === 'pro' ? 'text-warning-600' : 'text-gray-600'
                }`} />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {user.subscription === 'pro' ? 'Plano Pro' : 'Plano Gratuito'}
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                {user.subscription === 'pro' 
                  ? 'Acesso completo a todas as funcionalidades'
                  : 'Acesso limitado a questões básicas'
                }
              </p>
              {user.subscription === 'free' && (
                <button className="btn-primary w-full">
                  Upgrade para Pro
                </button>
              )}
            </div>
          </div>

          {/* Configurações Rápidas */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações</h3>
            <div className="space-y-3">
              <button className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">Preferências</span>
              </button>
              <button className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">Notificações</span>
              </button>
              <button className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">Privacidade</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile 