// Tipos de usuário
export interface User {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
  createdAt: Date;
  subscription: 'free' | 'pro';
  studyTime?: number; // tempo disponível em horas por semana
}

// Tipos de questão
export interface Question {
  id: string;
  specialty: string; // especialidade médica
  topic: string; // tema principal
  subtopic: string; // subtema
  board: string; // banca examinadora
  year: number;
  statement: string; // enunciado
  imageURL?: string; // URL da imagem se houver
  alternatives: Alternative[];
  correctAnswer: string; // ID da alternativa correta
  explanation: string; // comentário didático
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[]; // tags para busca
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
  specialty?: string;
  topic?: string;
  subtopic?: string;
  board?: string;
  year?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  answered?: boolean;
  markedForReview?: boolean;
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