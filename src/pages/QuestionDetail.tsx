import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuestions } from '../contexts/QuestionContext'
import { ChevronLeft } from 'lucide-react'

const QuestionDetail: React.FC = () => {
  const { id } = useParams()
  const { questions } = useQuestions()
  const navigate = useNavigate()
  const [showSolution, setShowSolution] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
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
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{question.ano}</span>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{question.specialty}</span>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{question.topic}</span>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{question.subtopic}</span>
        </div>
        <div className="mb-6 mt-2">
          <span className="text-xs text-gray-400 block mb-1">{question.id.padStart(10, '0')}</span>
          <p className="text-gray-900 text-base leading-relaxed">{question.statement}</p>
        </div>
        <div className="space-y-4 mb-8">
          {question.alternatives.map((alt) => {
            let className = "flex items-center gap-3 cursor-pointer border-2 rounded-lg px-3 py-2 transition select-none ";
            if (answered) {
              if (alt.id === selectedAnswer && selectedAnswer === question.correctAnswer) {
                className += " bg-green-100 border-green-500 text-green-800";
              } else if (alt.id === selectedAnswer && selectedAnswer !== question.correctAnswer) {
                className += " bg-red-100 border-red-500 text-red-800";
              } else if (alt.id === question.correctAnswer) {
                className += " bg-green-50 border-green-400 text-green-700";
              } else {
                className += " bg-gray-50 border-gray-200 text-gray-700";
              }
            } else if (alt.id === selectedAnswer) {
              className += " border-teal-500 bg-teal-50 text-teal-800";
            } else {
              className += " border-gray-200 bg-gray-50 text-gray-700";
            }
            return (
              <div
                key={alt.id}
                className={className}
                onClick={() => {
                  if (!answered) {
                    setSelectedAnswer(alt.id)
                  }
                }}
              >
                <span className="w-10 h-10 border-2 border-gray-300 rounded flex items-center justify-center text-base font-semibold mr-2">
                  {alt.letter}
                </span>
                <span className="text-base">{alt.text}</span>
              </div>
            )
          })}
        </div>

        {/* Explicação e Comentário - Mostrar apenas quando showSolution for true */}
        {showSolution && (
          <div className="space-y-4 mb-8 border-t pt-6">
            {question.explanation && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Explicação</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{question.explanation}</p>
                </div>
              </div>
            )}
            
            {question.comment && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Comentário</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{question.comment}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 justify-between items-center border-t pt-6">
          <button
            className={`w-full md:w-auto px-8 py-3 rounded-lg font-semibold transition-colors text-base ${
              selectedAnswer && !answered 
                ? 'bg-teal-600 text-white hover:bg-teal-700 cursor-pointer' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={() => {
              console.log('Botão Responder clicado:', { selectedAnswer, answered, correctAnswer: question.correctAnswer })
              if (selectedAnswer && !answered) {
                setAnswered(true)
                setIsCorrect(selectedAnswer === question.correctAnswer)
                console.log('Resposta enviada:', { selectedAnswer, isCorrect: selectedAnswer === question.correctAnswer })
              }
            }}
          >
            Responder {selectedAnswer ? `(${selectedAnswer})` : ''}
          </button>
          <button 
            onClick={() => setShowSolution(!showSolution)}
            className="w-full md:w-auto px-8 py-3 rounded-lg border border-teal-600 text-teal-600 font-semibold bg-white hover:bg-teal-50 transition-colors text-base"
          >
            {showSolution ? 'Ocultar solução e comentários' : 'Ver solução e comentários'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuestionDetail 