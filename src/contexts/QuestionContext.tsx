import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Question, QuestionFilters, UserAnswer } from '../types'

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

// Dados mockados para desenvolvimento
const mockQuestions: Question[] = [
  {
    id: '1',
    specialty: 'Cardiologia',
    topic: 'Insuficiência Cardíaca',
    subtopic: 'Tratamento',
    board: 'USP',
    year: 2023,
    statement: 'Paciente de 65 anos com insuficiência cardíaca classe funcional II da NYHA apresenta dispneia aos esforços. Qual é o tratamento de primeira linha mais adequado?',
    alternatives: [
      { id: '1a', text: 'Digoxina', letter: 'A' },
      { id: '1b', text: 'IECA + Betabloqueador', letter: 'B' },
      { id: '1c', text: 'Diurético de alça isolado', letter: 'C' },
      { id: '1d', text: 'Anticoagulante oral', letter: 'D' },
      { id: '1e', text: 'Antiarrítmico classe I', letter: 'E' }
    ],
    correctAnswer: '1b',
    explanation: 'O tratamento de primeira linha para insuficiência cardíaca classe funcional II da NYHA inclui IECA (ou BRA) e betabloqueador, que reduzem a mortalidade e melhoram a sobrevida.',
    difficulty: 'medium',
    tags: ['cardiologia', 'insuficiência cardíaca', 'tratamento'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    specialty: 'Neurologia',
    topic: 'Acidente Vascular Cerebral',
    subtopic: 'Diagnóstico',
    board: 'UNIFESP',
    year: 2023,
    statement: 'Paciente de 58 anos apresenta hemiparesia direita de início súbito há 2 horas. Qual exame de imagem deve ser realizado prioritariamente?',
    alternatives: [
      { id: '2a', text: 'Ressonância magnética', letter: 'A' },
      { id: '2b', text: 'Tomografia computadorizada sem contraste', letter: 'B' },
      { id: '2c', text: 'Angiografia cerebral', letter: 'C' },
      { id: '2d', text: 'Eletroencefalograma', letter: 'D' },
      { id: '2e', text: 'Radiografia de crânio', letter: 'E' }
    ],
    correctAnswer: '2b',
    explanation: 'A tomografia computadorizada sem contraste é o exame de escolha inicial para confirmar o diagnóstico de AVC isquêmico e excluir hemorragia intracraniana.',
    difficulty: 'easy',
    tags: ['neurologia', 'avc', 'diagnóstico'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    specialty: 'Pneumologia',
    topic: 'Asma',
    subtopic: 'Crise Asmática',
    board: 'UNICAMP',
    year: 2023,
    statement: 'Paciente asmático em crise moderada apresenta sibilos difusos e uso de musculatura acessória. Qual é a medicação de primeira escolha?',
    alternatives: [
      { id: '3a', text: 'Corticosteróide oral', letter: 'A' },
      { id: '3b', text: 'Beta-2 agonista inalatório', letter: 'B' },
      { id: '3c', text: 'Anticolinérgico inalatório', letter: 'C' },
      { id: '3d', text: 'Aminofilina endovenosa', letter: 'D' },
      { id: '3e', text: 'Antibiótico oral', letter: 'E' }
    ],
    correctAnswer: '3b',
    explanation: 'O beta-2 agonista inalatório de curta duração (salbutamol) é a medicação de primeira escolha para alívio imediato dos sintomas da crise asmática.',
    difficulty: 'easy',
    tags: ['pneumologia', 'asma', 'crise'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    specialty: 'Clínica Médica',
    topic: 'Endocrinologia',
    subtopic: 'Diabetes Mellitus',
    board: 'UFMG',
    year: 2023,
    statement: 'Paciente diabético tipo 2 com HbA1c de 8.5% e creatinina de 1.8 mg/dL. Qual é a medicação antidiabética mais segura para este paciente?',
    alternatives: [
      { id: '4a', text: 'Metformina', letter: 'A' },
      { id: '4b', text: 'Sulfonilureia', letter: 'B' },
      { id: '4c', text: 'Incretina mimética', letter: 'C' },
      { id: '4d', text: 'Insulina NPH', letter: 'D' },
      { id: '4e', text: 'Tiazolidinediona', letter: 'E' }
    ],
    correctAnswer: '4c',
    explanation: 'Incretinas miméticas são seguras em pacientes com insuficiência renal e não requerem ajuste de dose, sendo uma opção adequada para este paciente.',
    difficulty: 'medium',
    tags: ['endocrinologia', 'diabetes', 'insuficiência renal'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    specialty: 'Cirurgia',
    topic: 'Cirurgia Geral',
    subtopic: 'Abdome Agudo',
    board: 'UFRJ',
    year: 2023,
    statement: 'Paciente de 45 anos com dor abdominal difusa há 12 horas, febre e leucocitose. Qual é o diagnóstico mais provável?',
    alternatives: [
      { id: '5a', text: 'Apendicite aguda', letter: 'A' },
      { id: '5b', text: 'Colecistite aguda', letter: 'B' },
      { id: '5c', text: 'Diverticulite', letter: 'C' },
      { id: '5d', text: 'Peritonite difusa', letter: 'D' },
      { id: '5e', text: 'Obstrução intestinal', letter: 'E' }
    ],
    correctAnswer: '5d',
    explanation: 'A peritonite difusa é caracterizada por dor abdominal difusa, febre e leucocitose, indicando processo inflamatório generalizado da cavidade peritoneal.',
    difficulty: 'hard',
    tags: ['cirurgia', 'abdome agudo', 'peritonite'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    specialty: 'Ginecologia',
    topic: 'Ginecologia Geral',
    subtopic: 'Menopausa',
    board: 'UNESP',
    year: 2023,
    statement: 'Paciente de 52 anos com amenorreia há 8 meses, ondas de calor e sudorese noturna. Qual é a conduta mais adequada?',
    alternatives: [
      { id: '6a', text: 'Reposição hormonal imediata', letter: 'A' },
      { id: '6b', text: 'Aguardar 12 meses de amenorreia', letter: 'B' },
      { id: '6c', text: 'Solicitar FSH e LH', letter: 'C' },
      { id: '6d', text: 'Prescrever antidepressivo', letter: 'D' },
      { id: '6e', text: 'Encaminhar para psiquiatra', letter: 'E' }
    ],
    correctAnswer: '6c',
    explanation: 'A dosagem de FSH e LH é necessária para confirmar o diagnóstico de menopausa e orientar a conduta terapêutica adequada.',
    difficulty: 'medium',
    tags: ['ginecologia', 'menopausa', 'diagnóstico'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '7',
    specialty: 'Pediatria',
    topic: 'Neonatologia',
    subtopic: 'Icterícia Neonatal',
    board: 'UFPR',
    year: 2023,
    statement: 'Recém-nascido de 3 dias com icterícia generalizada e bilirrubina total de 18 mg/dL. Qual é a conduta mais adequada?',
    alternatives: [
      { id: '7a', text: 'Observação ambulatorial', letter: 'A' },
      { id: '7b', text: 'Fototerapia', letter: 'B' },
      { id: '7c', text: 'Exsanguineotransfusão', letter: 'C' },
      { id: '7d', text: 'Antibioticoterapia', letter: 'D' },
      { id: '7e', text: 'Alta hospitalar', letter: 'E' }
    ],
    correctAnswer: '7b',
    explanation: 'Para recém-nascido de 3 dias com bilirrubina total de 18 mg/dL, a fototerapia é indicada para prevenir encefalopatia bilirrubínica.',
    difficulty: 'easy',
    tags: ['pediatria', 'neonatologia', 'icterícia'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '8',
    specialty: 'Medicina Preventiva',
    topic: 'Saúde Pública',
    subtopic: 'Epidemiologia',
    board: 'FIOCRUZ',
    year: 2023,
    statement: 'Em um estudo de coorte, qual medida de associação é mais adequada para avaliar o risco de desenvolver uma doença?',
    alternatives: [
      { id: '8a', text: 'Odds Ratio', letter: 'A' },
      { id: '8b', text: 'Risco Relativo', letter: 'B' },
      { id: '8c', text: 'Prevalência', letter: 'C' },
      { id: '8d', text: 'Incidência', letter: 'D' },
      { id: '8e', text: 'Sensibilidade', letter: 'E' }
    ],
    correctAnswer: '8b',
    explanation: 'O Risco Relativo é a medida de associação mais adequada em estudos de coorte, pois permite comparar diretamente a incidência da doença entre expostos e não expostos.',
    difficulty: 'medium',
    tags: ['epidemiologia', 'estudos de coorte', 'medidas de associação'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export const QuestionProvider: React.FC<QuestionProviderProps> = ({ children }) => {
  const [questions] = useState<Question[]>(mockQuestions)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  const [filters, setFilters] = useState<QuestionFilters>({})

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
    return questions.filter(question => {
      if (filters.specialty && question.specialty !== filters.specialty) return false
      if (filters.topic && question.topic !== filters.topic) return false
      if (filters.subtopic && question.subtopic !== filters.subtopic) return false
      if (filters.board && question.board !== filters.board) return false
      if (filters.year && question.year !== filters.year) return false
      if (filters.difficulty && question.difficulty !== filters.difficulty) return false
      if (filters.answered !== undefined) {
        const isAnswered = userAnswers.some(a => a.questionId === question.id)
        if (filters.answered !== isAnswered) return false
      }
      if (filters.markedForReview !== undefined) {
        const isMarked = userAnswers.find(a => a.questionId === question.id)?.markedForReview
        if (filters.markedForReview !== isMarked) return false
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
    getFilteredQuestions
  }

  return (
    <QuestionContext.Provider value={value}>
      {children}
    </QuestionContext.Provider>
  )
} 