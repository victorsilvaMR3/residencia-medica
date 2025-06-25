import React from 'react'
import { useQuestions } from '../contexts/QuestionContext'
import { BarChart3, Target, TrendingUp, CheckCircle, XCircle } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

const COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#a78bfa', '#f472b6', '#38bdf8', '#f87171', '#4ade80']

const Dashboard: React.FC = () => {
  const { userAnswers, questions } = useQuestions()

  const totalQuestions = questions.length
  const answeredQuestions = userAnswers.length
  const correctAnswers = userAnswers.filter(a => a.isCorrect).length
  const accuracy = answeredQuestions > 0 ? Math.round((correctAnswers / answeredQuestions) * 100) : 0

  // Dados para gráfico de barras: acertos por especialidade
  const specialties = Array.from(new Set(questions.map(q => q.specialty)))
  const barData = specialties.map((specialty) => {
    const total = questions.filter(q => q.specialty === specialty).length
    const correct = userAnswers.filter(a => {
      const q = questions.find(q => q.id === a.questionId)
      return q?.specialty === specialty && a.isCorrect
    }).length
    return {
      name: specialty,
      Acertos: correct,
      Total: total,
    }
  })

  // Dados para gráfico de pizza: distribuição de respostas
  const pieData = [
    { name: 'Acertos', value: correctAnswers },
    { name: 'Erros', value: answeredQuestions - correctAnswers },
    { name: 'Não respondidas', value: totalQuestions - answeredQuestions },
  ]

  const stats = [
    {
      label: 'Questões Respondidas',
      value: answeredQuestions,
      total: totalQuestions,
      icon: Target,
      color: 'text-success-500',
      bg: 'bg-success-50',
    },
    {
      label: 'Taxa de Acerto',
      value: `${accuracy}%`,
      icon: TrendingUp,
      color: 'text-success-500',
      bg: 'bg-success-50',
    },
    {
      label: 'Acertos',
      value: correctAnswers,
      icon: CheckCircle,
      color: 'text-success-500',
      bg: 'bg-success-50',
    },
    {
      label: 'Erros',
      value: answeredQuestions - correctAnswers,
      icon: XCircle,
      color: 'text-red-500',
      bg: 'bg-red-50',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className={`rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 ${stat.bg}`}>
              <div className={`rounded-xl p-3 ${stat.bg} ${stat.color} bg-opacity-30`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
                {stat.total !== undefined && (
                  <div className="text-xs text-gray-400">de {stat.total}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de barras */}
        <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Desempenho por Especialidade</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Total" fill="#e5e7eb" radius={[6, 6, 0, 0]} barSize={28} />
              <Bar dataKey="Acertos" fill="#60a5fa" radius={[6, 6, 0, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de pizza */}
        <div className="rounded-2xl shadow-sm border border-gray-100 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Distribuição de Respostas</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={48}
                label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 