import { Pool } from 'pg'

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

// Tipos para o banco
export interface DatabaseQuestion {
  id: string
  specialty: string
  topic: string
  subtopic: string
  board: string
  year: number
  statement: string
  alternatives: Array<{ id: string; text: string; letter: 'A' | 'B' | 'C' | 'D' | 'E' }>
  correct_answer: string
  explanation: string
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
    let query = 'SELECT * FROM questions WHERE 1=1'
    const params: any[] = []
    let paramIndex = 1

    if (filters?.specialty) {
      query += ` AND specialty = $${paramIndex++}`
      params.push(filters.specialty)
    }

    if (filters?.year) {
      query += ` AND year = $${paramIndex++}`
      params.push(filters.year)
    }

    if (filters?.difficulty) {
      query += ` AND difficulty = $${paramIndex++}`
      params.push(filters.difficulty)
    }

    query += ' ORDER BY created_at DESC'

    try {
      const result = await getPool().query(query, params)
      return result.rows
    } catch (err) {
      console.error('Erro no getQuestions:', err)
      throw err
    }
  }

  static async getQuestionById(id: string): Promise<DatabaseQuestion | null> {
    const result = await getPool().query('SELECT * FROM questions WHERE id = $1', [id])
    return result.rows[0] || null
  }

  static async createQuestion(question: Omit<DatabaseQuestion, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseQuestion> {
    const query = `
      INSERT INTO questions (
        specialty, topic, subtopic, board, year, statement, 
        alternatives, correct_answer, explanation, comment, 
        difficulty, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `
    const values = [
      question.specialty,
      question.topic,
      question.subtopic,
      question.board,
      question.year,
      question.statement,
      JSON.stringify(question.alternatives),
      question.correct_answer,
      question.explanation,
      question.comment,
      question.difficulty,
      question.tags
    ]

    const result = await getPool().query(query, values)
    return result.rows[0]
  }

  static async updateQuestion(id: string, updates: Partial<DatabaseQuestion>): Promise<DatabaseQuestion | null> {
    const fields = Object.keys(updates).filter(key => key !== 'id' && key !== 'created_at')
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ')
    
    const query = `
      UPDATE questions 
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `
    
    const values = [id, ...fields.map(field => updates[field as keyof DatabaseQuestion])]
    const result = await getPool().query(query, values)
    return result.rows[0] || null
  }

  static async deleteQuestion(id: string): Promise<boolean> {
    const result = await getPool().query('DELETE FROM questions WHERE id = $1', [id])
    return (result.rowCount || 0) > 0
  }

  // Usuários
  static async getUserById(id: string): Promise<DatabaseUser | null> {
    const result = await getPool().query('SELECT * FROM users WHERE id = $1', [id])
    return result.rows[0] || null
  }

  static async getUserByEmail(email: string): Promise<DatabaseUser | null> {
    const result = await getPool().query('SELECT * FROM users WHERE email = $1', [email])
    return result.rows[0] || null
  }

  static async createUser(user: Omit<DatabaseUser, 'id' | 'created_at'>): Promise<DatabaseUser> {
    console.log('createUser payload:', user);
    const query = `
      INSERT INTO users (email, name, password, role, subscription)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `
    const values = [user.email, user.name, user.password, user.role, user.subscription]
    const result = await getPool().query(query, values)
    return result.rows[0]
  }

  static async getAllUsers(): Promise<DatabaseUser[]> {
    const result = await getPool().query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    return result.rows;
  }

  // Respostas dos usuários
  static async saveUserAnswer(answer: Omit<DatabaseUserAnswer, 'id' | 'answered_at'>): Promise<DatabaseUserAnswer> {
    const query = `
      INSERT INTO user_answers (user_id, question_id, selected_answer, is_correct, time_spent, marked_for_review)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `
    const values = [
      answer.user_id,
      answer.question_id,
      answer.selected_answer,
      answer.is_correct,
      answer.time_spent,
      answer.marked_for_review
    ]
    
    const result = await getPool().query(query, values)
    return result.rows[0]
  }

  static async getUserAnswers(userId: string): Promise<DatabaseUserAnswer[]> {
    const result = await getPool().query(
      'SELECT * FROM user_answers WHERE user_id = $1 ORDER BY answered_at DESC',
      [userId]
    )
    return result.rows
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