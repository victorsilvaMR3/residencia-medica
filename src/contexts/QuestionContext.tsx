import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Question, QuestionFilters, UserAnswer } from '../types'
import axios from 'axios'
import { useEffect } from 'react'

interface QuestionContextType {
  questions: Question[]
  currentQuestion: Question | null
  userAnswers: UserAnswer[]
  filters: QuestionFilters
  setFilters: (filters: QuestionFilters) => void
  answerQuestion: (questionId: string, selectedAnswer: string, timeSpent: number) => void
  markForReview: (questionId: string) => void
  getNextQuestion: () => Question | null
  getFilteredQuestions: () => Question[]
  addQuestion: (question: Question) => void
  addQuestions: (questions: Question[]) => void
}

const QuestionContext = createContext<QuestionContextType | undefined>(undefined)

export const useQuestions = () => {
  const context = useContext(QuestionContext)
  if (context === undefined) {
    throw new Error('useQuestions must be used within a QuestionProvider')
  }
  return context
}

interface QuestionProviderProps {
  children: ReactNode
}

// Remover mockQuestions e qualquer referência a eles

// Dados fictícios de respostas do usuário para testes no dashboard
const mockUserAnswers: UserAnswer[] = [
  { questionId: '1', selectedAnswer: '1b', isCorrect: true, timeSpent: 45, answeredAt: new Date(), markedForReview: false },
  { questionId: '2', selectedAnswer: '2a', isCorrect: false, timeSpent: 30, answeredAt: new Date(), markedForReview: false },
  { questionId: '3', selectedAnswer: '3b', isCorrect: true, timeSpent: 60, answeredAt: new Date(), markedForReview: false },
  { questionId: '4', selectedAnswer: '4c', isCorrect: true, timeSpent: 50, answeredAt: new Date(), markedForReview: false },
  { questionId: '5', selectedAnswer: '5d', isCorrect: true, timeSpent: 70, answeredAt: new Date(), markedForReview: false },
  { questionId: '6', selectedAnswer: '6a', isCorrect: false, timeSpent: 40, answeredAt: new Date(), markedForReview: true },
  { questionId: '7', selectedAnswer: '7b', isCorrect: true, timeSpent: 35, answeredAt: new Date(), markedForReview: false },
  { questionId: '8', selectedAnswer: '8b', isCorrect: true, timeSpent: 55, answeredAt: new Date(), markedForReview: false },
]

export const QuestionProvider: React.FC<QuestionProviderProps> = ({ children }) => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion] = useState<Question | null>(null)
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>(mockUserAnswers)
  const [filters, setFilters] = useState<QuestionFilters>({})

  // Função para buscar questões do backend
  const fetchQuestions = async (filters: QuestionFilters) => {
    try {
      const response = await axios.get('/api/questions', { params: filters })
      setQuestions(response.data)
    } catch (error) {
      setQuestions([])
    }
  }

  // Sempre que os filtros mudarem, busca as questões
  useEffect(() => {
    fetchQuestions(filters)
  }, [filters])

  const addQuestion = (question: Question) => {
    setQuestions(prev => [...prev, question])
  }

  const addQuestions = (newQuestions: Question[]) => {
    setQuestions(prev => [...prev, ...newQuestions])
  }

  const answerQuestion = (questionId: string, selectedAnswer: string, timeSpent: number) => {
    const question = questions.find(q => q.id === questionId)
    if (!question) return

    const isCorrect = selectedAnswer === question.correctAnswer
    
    const answer: UserAnswer = {
      questionId,
      selectedAnswer,
      isCorrect,
      timeSpent,
      answeredAt: new Date(),
      markedForReview: false
    }

    setUserAnswers(prev => [...prev, answer])
  }

  const markForReview = (questionId: string) => {
    setUserAnswers(prev => 
      prev.map(answer => 
        answer.questionId === questionId 
          ? { ...answer, markedForReview: !answer.markedForReview }
          : answer
      )
    )
  }

  const getNextQuestion = (): Question | null => {
    const answeredIds = userAnswers.map(a => a.questionId)
    const availableQuestions = questions.filter(q => !answeredIds.includes(q.id))
    return availableQuestions.length > 0 ? availableQuestions[0] : null
  }

  const getFilteredQuestions = (): Question[] => {
    // Se nenhum filtro estiver aplicado, retorna array vazio
    const hasAnyFilter = Object.values(filters).some(filter => 
      filter !== undefined && (Array.isArray(filter) ? filter.length > 0 : true)
    )
    
    if (!hasAnyFilter) {
      return []
    }
    
    return questions.filter(question => {
      // Filtros básicos
      if (filters.specialty && question.specialty !== filters.specialty) return false
      if (filters.topic && question.topic !== filters.topic) return false
      if (filters.subtopic && question.subtopic !== filters.subtopic) return false
      if (filters.board && question.board !== filters.board) return false
      if (filters.ano && question.ano !== filters.ano) return false
      if (filters.difficulty && question.difficulty !== filters.difficulty) return false
      
      // Filtros de resposta do usuário
      if (filters.answered !== undefined) {
        const isAnswered = userAnswers.some(a => a.questionId === question.id)
        if (filters.answered !== isAnswered) return false
      }
      if (filters.markedForReview !== undefined) {
        const isMarked = userAnswers.find(a => a.questionId === question.id)?.markedForReview
        if (filters.markedForReview !== isMarked) return false
      }
      
      // Filtros avançados - múltiplas seleções
      if (filters.specialties && filters.specialties.length > 0) {
        if (!filters.specialties.includes(question.specialty)) return false
      }
      
      if (filters.subtopics && filters.subtopics.length > 0) {
        if (!filters.subtopics.includes(question.subtopic)) return false
      }
      
      // Filtros por instituição (board)
      if (filters.institutions && filters.institutions.length > 0) {
        if (!filters.institutions.includes(question.board)) return false
      }
      
      // Filtros por ano (suporte a múltiplos anos)
      if (filters.years && Array.isArray(filters.years)) {
        if (!filters.years.includes(question.ano)) return false
      } else if (filters.ano && question.ano !== filters.ano) {
        return false
      }
      
      // Filtros por região (baseado no board - seria expandido com dados reais)
      if (filters.regions && filters.regions.length > 0) {
        // Mapeamento básico de regiões por banca (exemplo)
        const regionMapping: { [key: string]: string[] } = {
          'USP': ['SP'],
          'UNIFESP': ['SP'],
          'UNICAMP': ['SP'],
          'UNESP': ['SP'],
          'UFMG': ['MG'],
          'UFRJ': ['RJ'],
          'UFPR': ['PR'],
          'UFSC': ['SC'],
          'UFBA': ['BA'],
          'UFPE': ['PE'],
          'UFPB': ['PB'],
          'UFG': ['GO'],
          'UFAM': ['AM'],
          'UFES': ['ES'],
          'FIOCRUZ': ['RJ'],
          'Hospital das Clínicas (USP)': ['SP'],
          'Hospital Sírio-Libanês': ['SP'],
          'Hospital Albert Einstein': ['SP'],
          'Hospital Samaritano': ['SP'],
          'Hospital do Coração (HCor)': ['SP'],
          'Hospital Moinhos de Vento': ['RS'],
          'Hospital de Clínicas de Porto Alegre': ['RS'],
          'Hospital Universitário Pedro Ernesto (UERJ)': ['RJ'],
          'Hospital das Clínicas (UFMG)': ['MG'],
          'Hospital das Clínicas (UNICAMP)': ['SP'],
          'Hospital Universitário (UFSC)': ['SC'],
          'Hospital Universitário (UFPR)': ['PR'],
          'Hospital Universitário (UFBA)': ['BA'],
          'Hospital Universitário (UFRJ)': ['RJ'],
          'Hospital Universitário (UNIFESP)': ['SP'],
          'Hospital Universitário (UFPE)': ['PE'],
          'Hospital Universitário (UFG)': ['GO'],
          'Hospital Universitário (UFAM)': ['AM'],
          'Hospital Universitário (UFPB)': ['PB'],
          'Hospital Universitário (UFES)': ['ES']
        }
        
        const questionRegions = regionMapping[question.board] || ['NAC']
        const hasMatchingRegion = questionRegions.some(region => 
          filters.regions!.includes(region)
        )
        if (!hasMatchingRegion) return false
      }
      
      // Filtros por finalidade (baseado no board - seria expandido com dados reais)
      if (filters.purposes && filters.purposes.length > 0) {
        // Mapeamento básico de finalidades por banca (exemplo)
        const purposeMapping: { [key: string]: string[] } = {
          'USP': ['Residência (Acesso Direto)'],
          'UNIFESP': ['Residência (Acesso Direto)'],
          'UNICAMP': ['Residência (Acesso Direto)'],
          'UNESP': ['Residência (Acesso Direto)'],
          'UFMG': ['Residência (Acesso Direto)'],
          'UFRJ': ['Residência (Acesso Direto)'],
          'UFPR': ['Residência (Acesso Direto)'],
          'UFSC': ['Residência (Acesso Direto)'],
          'UFBA': ['Residência (Acesso Direto)'],
          'UFPE': ['Residência (Acesso Direto)'],
          'UFPB': ['Residência (Acesso Direto)'],
          'UFG': ['Residência (Acesso Direto)'],
          'UFAM': ['Residência (Acesso Direto)'],
          'UFES': ['Residência (Acesso Direto)'],
          'FIOCRUZ': ['Residência (Acesso Direto)'],
          'Hospital das Clínicas (USP)': ['Residência (Acesso Direto)'],
          'Hospital Sírio-Libanês': ['Residência (Acesso Direto)'],
          'Hospital Albert Einstein': ['Residência (Acesso Direto)'],
          'Hospital Samaritano': ['Residência (Acesso Direto)'],
          'Hospital do Coração (HCor)': ['Residência (Acesso Direto)'],
          'Hospital Moinhos de Vento': ['Residência (Acesso Direto)'],
          'Hospital de Clínicas de Porto Alegre': ['Residência (Acesso Direto)'],
          'Hospital Universitário Pedro Ernesto (UERJ)': ['Residência (Acesso Direto)'],
          'Hospital das Clínicas (UFMG)': ['Residência (Acesso Direto)'],
          'Hospital das Clínicas (UNICAMP)': ['Residência (Acesso Direto)'],
          'Hospital Universitário (UFSC)': ['Residência (Acesso Direto)'],
          'Hospital Universitário (UFPR)': ['Residência (Acesso Direto)'],
          'Hospital Universitário (UFBA)': ['Residência (Acesso Direto)'],
          'Hospital Universitário (UFRJ)': ['Residência (Acesso Direto)'],
          'Hospital Universitário (UNIFESP)': ['Residência (Acesso Direto)'],
          'Hospital Universitário (UFPE)': ['Residência (Acesso Direto)'],
          'Hospital Universitário (UFG)': ['Residência (Acesso Direto)'],
          'Hospital Universitário (UFAM)': ['Residência (Acesso Direto)'],
          'Hospital Universitário (UFPB)': ['Residência (Acesso Direto)'],
          'Hospital Universitário (UFES)': ['Residência (Acesso Direto)']
        }
        
        const questionPurposes = purposeMapping[question.board] || ['Residência (Acesso Direto)']
        const hasMatchingPurpose = questionPurposes.some(purpose => 
          filters.purposes!.includes(purpose)
        )
        if (!hasMatchingPurpose) return false
      }
      
      return true
    })
  }

  const value = {
    questions,
    currentQuestion,
    userAnswers,
    filters,
    setFilters,
    answerQuestion,
    markForReview,
    getNextQuestion,
    getFilteredQuestions,
    addQuestion,
    addQuestions
  }

  return (
    <QuestionContext.Provider value={value}>
      {children}
    </QuestionContext.Provider>
  )
} 