# 🗄️ PostgreSQL Puro - Guia de Implementação

Este guia mostra como usar PostgreSQL puro (sem Supabase) no projeto de Residência Médica.

## 🚀 **Opções de Hosting PostgreSQL**

### **1. Railway (Recomendado para começar)**
- **Setup**: 2 minutos
- **Custo**: $5/mês (1GB RAM)
- **Vantagens**: Deploy automático, SSL, backup automático

### **2. Neon (PostgreSQL Serverless)**
- **Setup**: 1 minuto
- **Custo**: Gratuito até 3GB
- **Vantagens**: Serverless, auto-scaling

### **3. Supabase (PostgreSQL + Extras)**
- **Setup**: 1 minuto
- **Custo**: Gratuito até 500MB
- **Vantagens**: Auth automático, API REST

### **4. AWS RDS**
- **Setup**: 10 minutos
- **Custo**: $15-30/mês
- **Vantagens**: Controle total, alta disponibilidade

## 📋 **Setup com Railway**

### **Passo 1: Criar conta no Railway**
1. Acesse [railway.app](https://railway.app)
2. Faça login com GitHub
3. Clique em "New Project"

### **Passo 2: Adicionar PostgreSQL**
1. Clique em "Add Service"
2. Selecione "Database" → "PostgreSQL"
3. Aguarde a criação (2 minutos)

### **Passo 3: Configurar variáveis de ambiente**
1. Vá em "Variables"
2. Copie a `DATABASE_URL`
3. Adicione ao seu projeto:

```bash
# .env.local
DATABASE_URL=postgresql://postgres:password@containers-us-west-1.railway.app:5432/railway
```

### **Passo 4: Executar migrações**
```bash
# Instalar dependências
npm install

# Executar migrações
npm run migrate:dev
```

## 🗂️ **Estrutura do Banco**

### **Tabelas Principais:**

```sql
-- Usuários
users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  role VARCHAR(50), -- 'user', 'admin', 'moderator'
  subscription VARCHAR(50), -- 'free', 'pro'
  created_at TIMESTAMP
)

-- Questões
questions (
  id UUID PRIMARY KEY,
  specialty VARCHAR(100),
  topic VARCHAR(100),
  subtopic VARCHAR(100),
  board VARCHAR(100),
  year INTEGER,
  statement TEXT,
  alternatives JSONB, -- Array de alternativas
  correct_answer VARCHAR(10),
  explanation TEXT,
  comment TEXT,
  difficulty VARCHAR(20), -- 'easy', 'medium', 'hard'
  tags TEXT[], -- Array de tags
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Respostas dos usuários
user_answers (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  question_id UUID REFERENCES questions(id),
  selected_answer VARCHAR(10),
  is_correct BOOLEAN,
  time_spent INTEGER,
  answered_at TIMESTAMP,
  marked_for_review BOOLEAN
)
```

## 🔧 **Uso no Código**

### **Exemplo de Consulta:**
```typescript
import DatabaseService from './services/database'

// Buscar questões
const questions = await DatabaseService.getQuestions({
  specialty: 'Cardiologia',
  year: 2023
})

// Criar questão
const newQuestion = await DatabaseService.createQuestion({
  specialty: 'Cardiologia',
  topic: 'Insuficiência Cardíaca',
  statement: 'Paciente com...',
  alternatives: [
    { id: '1a', text: 'Digoxina', letter: 'A' },
    { id: '1b', text: 'IECA', letter: 'B' }
  ],
  correct_answer: '1b',
  explanation: 'Explicação...',
  difficulty: 'medium',
  tags: ['cardiologia', 'ic']
})
```

### **Queries Complexas:**
```typescript
// Estatísticas do usuário
const stats = await DatabaseService.getUserStats(userId, 'Cardiologia')

// Busca por texto
const results = await DatabaseService.searchQuestions('insuficiência cardíaca')

// Questões mais respondidas
const popular = await DatabaseService.getMostAnsweredQuestions(10)
```

## 🚀 **Deploy**

### **Railway (Recomendado):**
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### **Vercel + Railway:**
1. **Frontend**: Deploy no Vercel
2. **Backend**: Deploy no Railway
3. **Banco**: PostgreSQL no Railway

## 📊 **Vantagens do PostgreSQL Puro**

### ✅ **Controle Total:**
- Queries SQL complexas
- Índices customizados
- Triggers e procedures
- Extensões específicas

### ✅ **Performance:**
- Otimizações avançadas
- Índices específicos
- Query planning

### ✅ **Escalabilidade:**
- Sem limites de uso
- Replicação master-slave
- Sharding horizontal

### ✅ **Sem Vendor Lock-in:**
- Você "possui" o banco
- Migração fácil
- Backup completo

## 🔒 **Segurança**

### **Configurações Recomendadas:**
```sql
-- Row Level Security
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own answers"
ON user_answers FOR SELECT
USING (auth.uid() = user_id);

-- Índices para performance
CREATE INDEX idx_questions_specialty ON questions(specialty);
CREATE INDEX idx_questions_year ON questions(year);
CREATE INDEX idx_user_answers_user_id ON user_answers(user_id);
```

## 📈 **Monitoramento**

### **Queries Úteis:**
```sql
-- Questões mais difíceis
SELECT 
  q.statement,
  COUNT(ua.id) as total_answers,
  ROUND((COUNT(CASE WHEN ua.is_correct THEN 1 END)::DECIMAL / COUNT(ua.id)) * 100, 2) as success_rate
FROM questions q
LEFT JOIN user_answers ua ON q.id = ua.question_id
GROUP BY q.id, q.statement
ORDER BY success_rate ASC
LIMIT 10;

-- Performance por especialidade
SELECT 
  q.specialty,
  COUNT(ua.id) as total_answers,
  ROUND((COUNT(CASE WHEN ua.is_correct THEN 1 END)::DECIMAL / COUNT(ua.id)) * 100, 2) as accuracy
FROM questions q
LEFT JOIN user_answers ua ON q.id = ua.question_id
GROUP BY q.specialty
ORDER BY accuracy DESC;
```

## 🛠️ **Comandos Úteis**

```bash
# Executar migrações
npm run migrate

# Backup do banco
pg_dump $DATABASE_URL > backup.sql

# Restaurar backup
psql $DATABASE_URL < backup.sql

# Conectar ao banco
psql $DATABASE_URL

# Ver logs do Railway
railway logs
```

## 💰 **Custos Estimados**

### **Railway:**
- **Starter**: $5/mês (1GB RAM, 1GB storage)
- **Standard**: $20/mês (2GB RAM, 10GB storage)

### **Neon:**
- **Free**: 3GB storage, 10GB transfer
- **Pro**: $10/mês (100GB storage)

### **AWS RDS:**
- **t3.micro**: $15/mês
- **t3.small**: $30/mês

## 🎯 **Próximos Passos**

1. **Escolher hosting** (Railway recomendado)
2. **Configurar banco** e executar migrações
3. **Integrar com frontend** (substituir localStorage)
4. **Implementar autenticação** (JWT + bcrypt)
5. **Deploy em produção**
6. **Monitoramento** e otimizações

---

**Tempo estimado para implementação: 1-2 dias** 