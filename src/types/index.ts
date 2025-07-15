// Tipos de usuário
export interface User {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
  createdAt: Date;
  subscription: 'free' | 'pro';
  studyTime?: number; // tempo disponível em horas por semana
  role: 'user' | 'admin' | 'moderator'; // controle de acesso
}

// Tipos de questão
export interface Question {
  id: string;
  tema: string;
  microtemas: string[];
  instituicao: string;
  ano: number;
  regiao: string;
  finalidade: string;
  specialty: string;
  topic: string;
  subtopic?: string;
  board?: string;
  statement: string;
  alternatives: Alternative[];
  correctAnswer: string;
  explanation?: string;
  comment?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Alternative {
  id: string;
  text: string;
  letter: 'A' | 'B' | 'C' | 'D' | 'E';
}

// Tipos de resposta do usuário
export interface UserAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number; // tempo em segundos
  answeredAt: Date;
  markedForReview: boolean;
}

// Tipos de desempenho
export interface Performance {
  userId: string;
  specialty: string;
  topic: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number; // porcentagem de acertos
  lastUpdated: Date;
}

// Tipos de revisão espaçada
export interface SpacedRepetition {
  userId: string;
  questionId: string;
  nextReview: Date;
  interval: number; // dias até próxima revisão
  easeFactor: number; // fator de facilidade
  repetitions: number; // número de repetições
}

// Tipos de plano de estudos
export interface StudyPlan {
  userId: string;
  weeklyGoal: number; // meta de questões por semana
  focusAreas: string[]; // áreas para focar
  recommendedTopics: string[]; // tópicos recomendados
  createdAt: Date;
  updatedAt: Date;
}

// Tipos de ranking
export interface Ranking {
  userId: string;
  userName: string;
  userPhoto?: string;
  score: number;
  questionsAnswered: number;
  accuracy: number;
  rank: number;
  period: 'monthly' | 'allTime';
}

// Tipos de filtros
export interface QuestionFilters {
  tema?: string;
  microtemas?: string[];
  instituicao?: string;
  ano?: number;
  regiao?: string;
  finalidade?: string;
  specialty?: string;
  topic?: string;
  subtopic?: string;
  board?: string;
  years?: number[];
  difficulty?: 'easy' | 'medium' | 'hard';
  answered?: boolean;
  markedForReview?: boolean;
  institutions?: string[];
  regions?: string[];
  purposes?: string[];
  specialties?: string[];
  subtopics?: string[];
}

// Tipos de estatísticas
export interface Statistics {
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  accuracy: number;
  averageTime: number;
  studyStreak: number; // dias consecutivos estudando
  weeklyProgress: WeeklyProgress[];
}

export interface WeeklyProgress {
  week: string; // formato: "2024-W01"
  questionsAnswered: number;
  accuracy: number;
  studyTime: number; // em minutos
}

// Tipos de notificações
export interface Notification {
  id: string;
  userId: string;
  type: 'review_reminder' | 'streak_achievement' | 'goal_completed';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

// Tipo para Revisão (Repetição Espaçada)
export interface Revisao {
  tema: string;
  microtema: string;
  data_estudo: string; // ISO date
  n_questoes: number;
  acertos: number;
  erros: number;
  percentual: number; // 0.0 - 1.0
  desempenho: 'Ruim' | 'Bom' | 'Ótimo';
  n_revisoes: number;
  proxima_revisao: string; // ISO date
} 