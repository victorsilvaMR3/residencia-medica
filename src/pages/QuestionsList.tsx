import React, { useEffect, useState } from 'react'
import { useQuestions } from '../contexts/QuestionContext'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { Question } from '../types'
import { v4 as uuidv4 } from 'uuid'
import QuestionCardRespondable from '../components/QuestionCardRespondable'

const QuestionsList: React.FC = () => {
  const { questions, getFilteredQuestions } = useQuestions()
  const [loading, setLoading] = useState(true)
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [listId] = useState(() => uuidv4())
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({})
  const navigate = useNavigate()

  useEffect(() => {
    const result = getFilteredQuestions()
    setFilteredQuestions(result)
    setLoading(false)
  }, [getFilteredQuestions])

  const handleAnswer = (questionId: string, answerId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerId }))
  }

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
      <div className="w-full max-w-none space-y-10">
        {filteredQuestions.length === 0 && (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma questão encontrada</h3>
            <p className="text-gray-500">Tente ajustar os filtros para encontrar questões.</p>
          </div>
        )}
        {filteredQuestions.map((question, idx) => (
          <QuestionCardRespondable
            key={question.id}
            question={question}
            selectedAnswer={answers[question.id]}
            onAnswer={answerId => handleAnswer(question.id, answerId)}
            number={idx + 1}
          />
        ))}
      </div>
    </div>
  )
}

export default QuestionsList 