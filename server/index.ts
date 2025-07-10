// Dummy comment para forçar novo deploy no Railway
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente PRIMEIRO
dotenv.config({ path: '.env.local' })

// Log das variáveis de ambiente para debug
console.log('🔧 Variáveis de ambiente carregadas:')
console.log('📊 DATABASE_URL:', process.env.DATABASE_URL ? 'Configurada' : 'Não configurada')
console.log('🔑 JWT_SECRET:', process.env.JWT_SECRET ? 'Configurado' : 'Não configurado')
console.log('🌐 FRONTEND_URL:', process.env.FRONTEND_URL)
console.log('🚀 PORT:', process.env.PORT)

// Importar DatabaseService somente após dotenv
import DatabaseService from '../src/services/database'

const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Tipos customizados
interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: '*',
  credentials: true
}))

app.use(helmet())
app.use(express.json())

// Middleware de autenticação
const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' })
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' })
    }
    req.user = user
    next()
  })
}

// Middleware de autorização
const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' })
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acesso negado' })
    }
    
    next()
  }
}

// Rotas de autenticação
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body

    if (!email || !name || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' })
    }

    // Verificar se usuário já existe
    const existingUser = await DatabaseService.getUserByEmail(email)
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' })
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Definir role antes do log
    const role = email === 'victorsilva43@gmail.com' ? 'admin' : 'user'

    // Log para depuração
    console.log('Cadastro:', { email, name, password, hashedPassword, role });

    // Criar usuário
    const user = await DatabaseService.createUser({
      email,
      name,
      password: hashedPassword,
      role,
      subscription: 'free'
    })

    // Gerar token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    })
  } catch (error) {
    console.error('Erro no registro:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' })
    }

    // Buscar usuário
    const user = await DatabaseService.getUserByEmail(email)
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    // Validar senha
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    // Gerar token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    })
  } catch (error) {
    console.error('Erro no login:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Rota para verificar token
app.get('/api/auth/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' })
    }

    const user = await DatabaseService.getUserById(req.user.id)
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Rotas de questões
app.get('/api/questions', async (req: Request, res: Response) => {
  try {
    const filters = {
      specialty: req.query.specialty as string,
      year: req.query.year ? parseInt(req.query.year as string) : undefined,
      difficulty: req.query.difficulty as string
    }

    const questions = await DatabaseService.getQuestions(filters)
    res.json(questions)
  } catch (error) {
    console.error('Erro ao buscar questões:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

app.get('/api/questions/:id', async (req: Request, res: Response) => {
  try {
    const question = await DatabaseService.getQuestionById(req.params.id)
    if (!question) {
      return res.status(404).json({ error: 'Questão não encontrada' })
    }
    res.json(question)
  } catch (error) {
    console.error('Erro ao buscar questão:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Rotas protegidas (apenas admin)
app.post('/api/questions', authenticateToken, requireRole(['admin']), async (req: Request, res: Response) => {
  try {
    const question = await DatabaseService.createQuestion(req.body)
    res.status(201).json(question)
  } catch (error) {
    console.error('Erro ao criar questão:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

app.put('/api/questions/:id', authenticateToken, requireRole(['admin']), async (req: Request, res: Response) => {
  try {
    const question = await DatabaseService.updateQuestion(req.params.id, req.body)
    if (!question) {
      return res.status(404).json({ error: 'Questão não encontrada' })
    }
    res.json(question)
  } catch (error) {
    console.error('Erro ao atualizar questão:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

app.delete('/api/questions/:id', authenticateToken, requireRole(['admin']), async (req: Request, res: Response) => {
  try {
    const deleted = await DatabaseService.deleteQuestion(req.params.id)
    if (!deleted) {
      return res.status(404).json({ error: 'Questão não encontrada' })
    }
    res.json({ message: 'Questão deletada com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar questão:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Rotas de respostas dos usuários
app.post('/api/answers', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' })
    }

    const answer = await DatabaseService.saveUserAnswer({
      ...req.body,
      user_id: req.user.id
    })
    res.status(201).json(answer)
  } catch (error) {
    console.error('Erro ao salvar resposta:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

app.get('/api/answers', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' })
    }

    const answers = await DatabaseService.getUserAnswers(req.user.id)
    res.json(answers)
  } catch (error) {
    console.error('Erro ao buscar respostas:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Rotas de estatísticas
app.get('/api/stats', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' })
    }

    const specialty = req.query.specialty as string
    const stats = await DatabaseService.getUserStats(req.user.id, specialty)
    res.json(stats)
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Rota de busca
app.get('/api/search', async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.q as string
    if (!searchTerm) {
      return res.status(400).json({ error: 'Termo de busca é obrigatório' })
    }

    const questions = await DatabaseService.searchQuestions(searchTerm)
    res.json(questions)
  } catch (error) {
    console.error('Erro na busca:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Rota de saúde
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🔗 API docs: http://localhost:${PORT}/api`)
})

console.log('Iniciando backend Express...');

export default app