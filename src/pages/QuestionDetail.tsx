import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuestions } from '../contexts/QuestionContext'
import { ChevronLeft } from 'lucide-react'

const QuestionDetail: React.FC = () => {
  const { id } = useParams()
  const { questions } = useQuestions()
  const navigate = useNavigate()
  const question = questions.find(q => q.id === id)

  if (!question) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Questão não encontrada</h2>
        <button onClick={() => navigate(-1)} className="text-success-600 hover:underline">Voltar</button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center py-10 px-2 min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md border border-gray-100 p-8">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-success-600 mr-2">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-teal-600 font-semibold text-lg">Questão {question.id}</span>
        </div>
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
    </div>
  )
}

export default QuestionDetail 