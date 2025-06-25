import React, { useEffect, useState } from 'react'
import { useQuestions } from '../contexts/QuestionContext'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { Question, QuestionFilters } from '../types'

const QuestionsList: React.FC = () => {
  const { questions } = useQuestions()
  const [loading, setLoading] = useState(true)
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const filtersStr = localStorage.getItem('questionFilters')
    let filters: QuestionFilters = {}
    if (filtersStr) {
      filters = JSON.parse(filtersStr)
    }
    // Filtra localmente
    const result = questions.filter(question => {
      if (filters.specialty && question.specialty !== filters.specialty) return false
      if (filters.topic && question.topic !== filters.topic) return false
      if (filters.subtopic && question.subtopic !== filters.subtopic) return false
      if (filters.board && question.board !== filters.board) return false
      if (filters.year && question.year !== filters.year) return false
      if (filters.difficulty && question.difficulty !== filters.difficulty) return false
      return true
    })
    setFilteredQuestions(result)
    setLoading(false)
  }, [questions])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando questões...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center py-10 px-2 min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="w-full max-w-2xl mb-8">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-success-600 flex items-center mb-6">
          <ChevronLeft className="h-5 w-5 mr-1" /> Voltar
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{filteredQuestions.length} questões encontradas</h2>
      </div>
      <div className="w-full max-w-2xl space-y-10">
        {filteredQuestions.length === 0 && (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma questão encontrada</h3>
            <p className="text-gray-500">Tente ajustar os filtros para encontrar questões.</p>
          </div>
        )}
        {filteredQuestions.map((question) => (
          <div key={question.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{question.board}</span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{question.year}</span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{question.specialty}</span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{question.topic}</span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{question.subtopic}</span>
            </div>
            <div className="mb-6 mt-2">
              <span className="text-xs text-gray-400 block mb-1">{question.id.padStart(10, '0')}</span>
              <p className="text-gray-900 text-base leading-relaxed">{question.statement}</p>
            </div>
            <div className="space-y-4 mb-8">
              {question.alternatives.map((alt) => (
                <div key={alt.id} className="flex items-center gap-3">
                  <span className="w-10 h-10 border-2 border-gray-300 rounded flex items-center justify-center text-base font-semibold text-gray-700 bg-gray-50">
                    {alt.letter}
                  </span>
                  <span className="text-gray-800 text-base">{alt.text}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center border-t pt-6">
              <button className="w-full md:w-auto px-8 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors text-base">Responder</button>
              <button className="w-full md:w-auto px-8 py-3 rounded-lg border border-teal-600 text-teal-600 font-semibold bg-white hover:bg-teal-50 transition-colors text-base">Ver solução e comentários</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuestionsList 