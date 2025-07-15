import { Pool } from 'pg'
import { PrismaClient } from '../generated/prisma'

// Variável global para o pool
let pool: Pool | null = null

// Função para inicializar o pool
function getPool(): Pool {
  if (!pool) {
    console.log('🔗 Inicializando pool de conexão...')
    console.log('📊 DATABASE_URL:', process.env.DATABASE_URL ? 'Configurada' : 'Não configurada')
    
    pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/residencia',
      ssl: { rejectUnauthorized: false }
    })
    
    // Testar conexão
    pool.on('connect', () => {
      console.log('✅ Conectado ao banco de dados PostgreSQL')
    })
    
    pool.on('error', (err) => {
      console.error('❌ Erro na conexão com o banco:', err)
    })
  }
  return pool
}

// Instância única do Prisma Client
export const prisma = new PrismaClient()

// Tipos para o banco
export interface DatabaseQuestion {
  id: string
  tema: string
  microtemas: string[]
  instituicao: string
  ano: number
  regiao: string
  finalidade: string
  specialty: string
  topic: string
  subtopic?: string
  board?: string
  statement: string
  alternatives: Array<{ id: string; text: string; letter: 'A' | 'B' | 'C' | 'D' | 'E' }>
  correct_answer: string
  explanation?: string
  comment?: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  created_at: Date
  updated_at: Date
}

export interface DatabaseUser {
  id: string
  email: string
  name: string
  password: string // novo campo
  role: 'user' | 'admin' | 'moderator'
  subscription: 'free' | 'pro'
  created_at: Date
}

export interface DatabaseUserAnswer {
  id: string
  user_id: string
  question_id: string
  selected_answer: string
  is_correct: boolean
  time_spent: number
  answered_at: Date
  marked_for_review: boolean
}

// Funções de acesso ao banco
export class DatabaseService {
  // Questões
  static async getQuestions(filters?: any): Promise<DatabaseQuestion[]> {
    const where: any = {}
    if (filters?.tema) where.tema = filters.tema
    if (filters?.microtemas) where.microtemas = { hasSome: filters.microtemas }
    if (filters?.instituicao) where.instituicao = filters.instituicao
    if (filters?.ano) where.ano = filters.ano
    if (filters?.regiao) where.regiao = filters.regiao
    if (filters?.finalidade) where.finalidade = filters.finalidade
    if (filters?.specialty) where.specialty = filters.specialty
    if (filters?.year) where.ano = filters.year // compatibilidade retroativa
    if (filters?.difficulty) where.difficulty = filters.difficulty
    const questions = await prisma.question.findMany({
      where,
      orderBy: { created_at: 'desc' },
    })
    return questions as DatabaseQuestion[]
  }

  static async getQuestionById(id: string): Promise<DatabaseQuestion | null> {
    const question = await prisma.question.findUnique({ where: { id } })
    return question as DatabaseQuestion | null
  }

  static async createQuestion(question: Omit<DatabaseQuestion, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseQuestion> {
    const created = await prisma.question.create({
      data: {
        tema: question.tema,
        microtemas: question.microtemas,
        instituicao: question.instituicao,
        ano: question.ano,
        regiao: question.regiao,
        finalidade: question.finalidade,
        specialty: question.specialty,
        topic: question.topic,
        subtopic: question.subtopic,
        board: question.board,
        statement: question.statement,
        alternatives: question.alternatives,
        correct_answer: question.correct_answer,
        explanation: question.explanation,
        comment: question.comment,
        difficulty: question.difficulty,
        tags: question.tags,
      },
    })
    return created as DatabaseQuestion
  }

  static async updateQuestion(id: string, updates: Partial<DatabaseQuestion>): Promise<DatabaseQuestion | null> {
    const updated = await prisma.question.update({
      where: { id },
      data: {
        tema: updates.tema,
        microtemas: updates.microtemas,
        instituicao: updates.instituicao,
        ano: updates.ano,
        regiao: updates.regiao,
        finalidade: updates.finalidade,
        specialty: updates.specialty,
        topic: updates.topic,
        subtopic: updates.subtopic,
        board: updates.board,
        statement: updates.statement,
        alternatives: updates.alternatives,
        correct_answer: updates.correct_answer,
        explanation: updates.explanation,
        comment: updates.comment,
        difficulty: updates.difficulty,
        tags: updates.tags,
      },
    })
    return updated as DatabaseQuestion | null
  }

  static async deleteQuestion(id: string): Promise<boolean> {
    await prisma.question.delete({ where: { id } })
    return true
  }

  // Usuários
  static async getUserById(id: string): Promise<DatabaseUser | null> {
    const user = await prisma.user.findUnique({ where: { id } })
    return user as DatabaseUser | null
  }

  static async getUserByEmail(email: string): Promise<DatabaseUser | null> {
    const user = await prisma.user.findUnique({ where: { email } })
    return user as DatabaseUser | null
  }

  static async createUser(user: Omit<DatabaseUser, 'id' | 'created_at'>): Promise<DatabaseUser> {
    const created = await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: user.password,
        role: user.role,
        subscription: user.subscription,
      },
    })
    return created as DatabaseUser
  }

  static async getAllUsers(): Promise<DatabaseUser[]> {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
    })
    return users as DatabaseUser[]
  }

  static async updateUserRole(id: string, role: 'user' | 'admin' | 'moderator'): Promise<DatabaseUser | null> {
    const updated = await prisma.user.update({
      where: { id },
      data: { role },
    })
    return updated as DatabaseUser | null
  }

  static async deleteUser(id: string): Promise<boolean> {
    const deleted = await prisma.user.delete({ where: { id } })
    return !!deleted
  }

  // Respostas dos usuários
  static async saveUserAnswer(answer: Omit<DatabaseUserAnswer, 'id' | 'answered_at'>): Promise<DatabaseUserAnswer> {
    const created = await prisma.userAnswer.create({
      data: {
        user_id: answer.user_id,
        question_id: answer.question_id,
        selected_answer: answer.selected_answer,
        is_correct: answer.is_correct,
        time_spent: answer.time_spent,
        marked_for_review: answer.marked_for_review,
      },
    })
    return created as DatabaseUserAnswer
  }

  static async getUserAnswers(userId: string): Promise<DatabaseUserAnswer[]> {
    const answers = await prisma.userAnswer.findMany({
      where: { user_id: userId },
      orderBy: { answered_at: 'desc' },
    })
    return answers as DatabaseUserAnswer[]
  }

  // Estatísticas
  static async getUserStats(userId: string, specialty?: string): Promise<any> {
    let query = `
      SELECT 
        COUNT(*) as total_questions,
        COUNT(CASE WHEN is_correct THEN 1 END) as correct_answers,
        ROUND(
          (COUNT(CASE WHEN is_correct THEN 1 END)::DECIMAL / COUNT(*)) * 100, 2
        ) as accuracy
      FROM user_answers ua
      JOIN questions q ON ua.question_id = q.id
      WHERE ua.user_id = $1
    `
    const params = [userId]

    if (specialty) {
      query += ' AND q.specialty = $2'
      params.push(specialty)
    }

    const result = await getPool().query(query, params)
    return result.rows[0]
  }

  // Queries complexas
  static async getQuestionsBySpecialty(specialty: string, limit = 10): Promise<DatabaseQuestion[]> {
    const query = `
      SELECT * FROM questions 
      WHERE specialty = $1 
      ORDER BY RANDOM() 
      LIMIT $2
    `
    const result = await getPool().query(query, [specialty, limit])
    return result.rows
  }

  static async searchQuestions(searchTerm: string): Promise<DatabaseQuestion[]> {
    const query = `
      SELECT * FROM questions 
      WHERE 
        statement ILIKE $1 OR
        specialty ILIKE $1 OR
        topic ILIKE $1 OR
        tags::text ILIKE $1
      ORDER BY created_at DESC
    `
    const result = await getPool().query(query, [`%${searchTerm}%`])
    return result.rows
  }

  static async getMostAnsweredQuestions(limit = 10): Promise<any[]> {
    const query = `
      SELECT 
        q.*,
        COUNT(ua.id) as answer_count,
        ROUND(
          (COUNT(CASE WHEN ua.is_correct THEN 1 END)::DECIMAL / COUNT(ua.id)) * 100, 2
        ) as success_rate
      FROM questions q
      LEFT JOIN user_answers ua ON q.id = ua.question_id
      GROUP BY q.id
      ORDER BY answer_count DESC
      LIMIT $1
    `
    const result = await getPool().query(query, [limit])
    return result.rows
  }
}

// Scripts de migração
export const migrationScripts = {
  createTables: `
    -- Tabela de usuários
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
      subscription VARCHAR(50) DEFAULT 'free' CHECK (subscription IN ('free', 'pro')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Tabela de questões
    CREATE TABLE IF NOT EXISTS questions (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      specialty VARCHAR(100) NOT NULL,
      topic VARCHAR(100) NOT NULL,
      subtopic VARCHAR(100),
      board VARCHAR(100),
      year INTEGER,
      statement TEXT NOT NULL,
      alternatives JSONB NOT NULL,
      correct_answer VARCHAR(10) NOT NULL,
      explanation TEXT,
      comment TEXT,
      difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')),
      tags TEXT[],
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Tabela de respostas dos usuários
    CREATE TABLE IF NOT EXISTS user_answers (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
      selected_answer VARCHAR(10) NOT NULL,
      is_correct BOOLEAN NOT NULL,
      time_spent INTEGER,
      answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      marked_for_review BOOLEAN DEFAULT FALSE
    );

    -- Índices para performance
    CREATE INDEX IF NOT EXISTS idx_questions_specialty ON questions(specialty);
    CREATE INDEX IF NOT EXISTS idx_questions_year ON questions(year);
    CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
    CREATE INDEX IF NOT EXISTS idx_user_answers_user_id ON user_answers(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_answers_question_id ON user_answers(question_id);
    CREATE INDEX IF NOT EXISTS idx_user_answers_answered_at ON user_answers(answered_at);
  `,

  insertSampleData: `
    -- Inserir usuário admin
  INSERT INTO users (email, name, password, role, subscription) 
VALUES (
  'victorsilva43@gmail.com', 
  'Victor Silva (Admin)', 
  '$2a$10$QWERTYUIOPASDFGHJKLZXCVBNM1234567890abcd', -- hash fake
  'admin', 
  'pro'
)
ON CONFLICT (email) DO NOTHING;

    -- Inserir questões de exemplo
    INSERT INTO questions (specialty, topic, subtopic, board, year, statement, alternatives, correct_answer, explanation, difficulty, tags) VALUES
    ('Cardiologia', 'Insuficiência Cardíaca', 'Tratamento', 'USP', 2023, 'Paciente de 65 anos com insuficiência cardíaca classe funcional II da NYHA apresenta dispneia aos esforços. Qual é o tratamento de primeira linha mais adequado?', 
    '[{"id":"1a","text":"Digoxina","letter":"A"},{"id":"1b","text":"IECA + Betabloqueador","letter":"B"},{"id":"1c","text":"Diurético de alça isolado","letter":"C"},{"id":"1d","text":"Anticoagulante oral","letter":"D"},{"id":"1e","text":"Antiarrítmico classe I","letter":"E"}]',
    '1b', 'O tratamento de primeira linha para insuficiência cardíaca classe funcional II da NYHA inclui IECA (ou BRA) e betabloqueador, que reduzem a mortalidade e melhoram a sobrevida.', 'medium', ARRAY['cardiologia', 'insuficiência cardíaca', 'tratamento'])
    ON CONFLICT DO NOTHING;
  `
}

export default DatabaseService 