import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  BookOpen, 
  Target, 
  BarChart3, 
  Trophy, 
  Star, 
  Users, 
  Zap,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

const Home: React.FC = () => {
  const { user } = useAuth()

  const features = [
    {
      icon: BookOpen,
      title: 'Banco de Questões Comentadas',
      description: 'Mais de 300 questões de provas reais com comentários didáticos detalhados'
    },
    {
      icon: Target,
      title: 'Revisão Inteligente',
      description: 'Sistema de repetição espaçada baseado no seu desempenho'
    },
    {
      icon: BarChart3,
      title: 'Dashboard de Desempenho',
      description: 'Acompanhe sua evolução com gráficos e estatísticas detalhadas'
    },
    {
      icon: Trophy,
      title: 'Sistema de Ranking',
      description: 'Compare seu desempenho com outros estudantes'
    }
  ]

  const stats = [
    { label: 'Questões Disponíveis', value: '300+' },
    { label: 'Especialidades', value: '15' },
    { label: 'Usuários Ativos', value: '2.5k+' },
    { label: 'Taxa de Aprovação', value: '85%' }
  ]

  const testimonials = [
    {
      name: 'Dr. Ana Silva',
      specialty: 'Cardiologia - USP',
      text: 'O Prova Express foi fundamental na minha preparação. Os comentários são excelentes!',
      rating: 5
    },
    {
      name: 'Dr. Carlos Santos',
      specialty: 'Neurologia - UNIFESP',
      text: 'A revisão inteligente me ajudou a focar nos pontos que eu tinha mais dificuldade.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-success-600 to-success-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Prova Residência Express
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-success-100">
              Prepare-se para a Residência Médica com questões comentadas e revisão inteligente
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  to="/questions"
                  className="bg-white text-success-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
                >
                  Começar a Estudar
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-success-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Começar Grátis
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-success-600 transition-colors"
                  >
                    Já tenho conta
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que escolher o Prova Express?
            </h2>
            <p className="text-xl text-gray-600">
              Ferramentas modernas para uma preparação eficiente
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center">
                  <div className="bg-success-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-success-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-success-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              O que nossos usuários dizem
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-warning-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.specialty}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-success-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Comece sua preparação hoje
          </h2>
          <p className="text-xl mb-8 text-success-100">
            Junte-se a milhares de estudantes que já estão se preparando
          </p>
          {!user && (
            <Link
              to="/register"
              className="bg-white text-success-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              Criar Conta Grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home 