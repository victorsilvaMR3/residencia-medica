import React, { useState } from 'react'
import { Question } from '../types'
import { Share2, PlusCircle, Tag, ChevronRight } from 'lucide-react'

interface Props {
  question: Question
  selectedAnswer?: string
  onAnswer: (answerId: string) => void
  onNext?: () => void // opcional, para navegação
  number?: number // número da questão na lista
}

const QuestionCardRespondable: React.FC<Props> = ({ question, selectedAnswer: externalSelected, onAnswer, onNext, number }) => {
  const [localSelected, setLocalSelected] = useState<string | null>(externalSelected || null)
  const [answered, setAnswered] = useState(!!externalSelected)
  const [showSolution, setShowSolution] = useState(false)

  const handleSelect = (id: string) => {
    if (!answered) setLocalSelected(id)
  }

  const handleSubmit = () => {
    if (localSelected && !answered) {
      setAnswered(true)
      onAnswer(localSelected)
    }
  }

  return (
    <div className="relative flex flex-col w-full py-8 bg-white rounded-xl shadow-lg max-w-[950px] min-w-[600px] w-full mx-auto my-8">
      {/* Header */}
      <div className="flex flex-col px-10">
        <div className="flex items-center justify-between">
          <span className="mr-2 text-base font-semibold text-gray-400">Questão {number !== undefined ? number : ''}</span>
          <div className="flex items-center gap-4">
            {/* Badges */}
            <div className="flex gap-2">
              <span className="uppercase truncate text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">{question.board}</span>
              <span className="uppercase truncate text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">{question.year}</span>
              <span className="uppercase truncate text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">{question.specialty}</span>
            </div>
            {/* Ações */}
            <button className="ml-4 text-gray-400 hover:text-teal-600" title="Adicionar à lista">
              <PlusCircle size={22} />
            </button>
            <button className="ml-2 text-gray-400 hover:text-teal-600" title="Compartilhar">
              <Share2 size={22} />
            </button>
            <button className="ml-2 text-gray-400 hover:text-teal-600" title="Exibir tópicos">
              <Tag size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Separador */}
      <div className="w-full my-6 opacity-40 border-t"></div>

      {/* Statement */}
      <div className="px-10 mb-6">
        <span className="text-xs text-gray-300 font-bold">{question.id.padStart(10, '0')}</span>
        <p
          className="mt-2 font-normal"
          style={{
            fontFamily: 'Circular, Arial, sans-serif',
            fontWeight: 400,
            fontSize: '15px',
            lineHeight: '26.25px',
            color: '#444444',
          }}
        >
          {question.statement}
        </p>
      </div>

      {/* Alternativas */}
      <div className="px-10">
        {question.alternatives.map((alt) => {
          let className = "flex items-center mt-4 cursor-pointer group ";
          let circleClass = "w-10 h-10 flex items-center justify-center rounded-full border-2 text-base font-bold mr-4 transition ";
          let textClass = "text-sm transition ";
          if (answered) {
            if (alt.id === localSelected && localSelected === question.correctAnswer) {
              circleClass += " border-green-500 text-green-800 bg-green-100";
              textClass += " text-green-800";
            } else if (alt.id === localSelected && localSelected !== question.correctAnswer) {
              circleClass += " border-red-500 text-red-800 bg-red-100";
              textClass += " text-red-800";
            } else if (alt.id === question.correctAnswer) {
              circleClass += " border-green-400 text-green-700 bg-green-50";
              textClass += " text-green-700";
            } else {
              circleClass += " border-gray-200 text-gray-400 bg-gray-50";
              textClass += " text-gray-400";
            }
          } else if (alt.id === localSelected) {
            circleClass += " border-teal-500 text-teal-800 bg-teal-50";
            textClass += " text-teal-800";
          } else {
            circleClass += " border-gray-300 text-gray-500 bg-white";
            textClass += " text-gray-800";
          }
          return (
            <div
              key={alt.id}
              className={className}
              onClick={() => handleSelect(alt.id)}
            >
              <div className={circleClass}>{alt.letter}</div>
              <div
                className={textClass}
                style={{
                  fontFamily: 'Circular, Arial, sans-serif',
                  fontWeight: 400,
                  fontSize: '15px',
                  lineHeight: '26.25px',
                  color: '#444444',
                }}
              >
                {alt.text}
              </div>
            </div>
          )
        })}
      </div>

      {/* Separador */}
      <div className="w-full my-6 opacity-40 border-t"></div>

      {/* Rodapé de ações */}
      <div className="flex justify-between px-10">
        <button
          className={`w-56 py-3 rounded-lg font-semibold transition-colors text-base ${
            localSelected && !answered 
              ? 'bg-teal-600 text-white hover:bg-teal-700 cursor-pointer' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          onClick={handleSubmit}
        >
          Responder
        </button>
        <button
          className="w-56 py-3 rounded-lg border border-teal-600 text-teal-600 font-semibold bg-white hover:bg-teal-50 transition text-base"
          onClick={() => setShowSolution((v) => !v)}
        >
          {showSolution ? 'Ocultar solução e comentários' : 'Ver solução e comentários'}
        </button>
        {onNext && (
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg p-2"
            onClick={onNext}
            title="Próxima questão"
          >
            <ChevronRight size={28} className="text-gray-400" />
          </button>
        )}
      </div>

      {/* Explicação e Comentário */}
      {showSolution && (
        <div className="space-y-4 mb-8 border-t pt-6 px-10 mt-8">
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
    </div>
  )
}

export default QuestionCardRespondable 