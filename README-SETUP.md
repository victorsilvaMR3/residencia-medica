# 🚀 Setup Completo - Residência Médica

Guia passo a passo para configurar o projeto com PostgreSQL puro.

## 📋 **Pré-requisitos**

- Node.js 18+ 
- Git
- Conta no Railway (gratuita)

## 🗄️ **Passo 1: Configurar PostgreSQL no Railway**

### **1.1 Criar conta no Railway**
1. Acesse [railway.app](https://railway.app)
2. Faça login com GitHub
3. Clique em "New Project"

### **1.2 Adicionar PostgreSQL**
1. Clique em "Add Service"
2. Selecione "Database" → "PostgreSQL"
3. Aguarde a criação (2 minutos)

### **1.3 Copiar DATABASE_URL**
1. Vá em "Variables"
2. Copie a `DATABASE_URL`
3. Guarde para usar depois

## 🔧 **Passo 2: Configurar Projeto Local**

### **2.1 Instalar dependências**
```bash
npm install
```

### **2.2 Configurar variáveis de ambiente**
```bash
# Copiar arquivo de exemplo
cp env.example .env.local

# Editar .env.local com suas configurações
DATABASE_URL=sua_url_do_railway_aqui
JWT_SECRET=sua_chave_secreta_aqui
FRONTEND_URL=http://localhost:3000
PORT=3001
NODE_ENV=development
```

### **2.3 Executar migrações**
```bash
# Criar tabelas e dados iniciais
npm run migrate:dev
```

## 🚀 **Passo 3: Testar Backend**

### **3.1 Iniciar servidor**
```bash
# Terminal 1 - Backend
npm run server:dev
```

### **3.2 Testar API**
```bash
# Health check
curl http://localhost:3001/api/health

# Listar questões
curl http://localhost:3001/api/questions

# Registrar usuário
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"123456"}'
```

## 🌐 **Passo 4: Testar Frontend**

### **4.1 Iniciar frontend**
```bash
# Terminal 2 - Frontend
npm run dev
```

### **4.2 Acessar aplicação**
- Abra [http://localhost:3000](http://localhost:3000)
- Faça login com `victorsilva43@gmail.com` (admin)
- Teste as funcionalidades

## 🚀 **Passo 5: Deploy no Railway**

### **5.1 Conectar repositório**
1. No Railway, clique em "Deploy from GitHub repo"
2. Selecione este repositório
3. Aguarde o deploy

### **5.2 Configurar variáveis de produção**
1. Vá em "Variables"
2. Adicione:
   ```
   JWT_SECRET=sua_chave_secreta_producao
   FRONTEND_URL=https://seu-dominio.vercel.app
   NODE_ENV=production
   ```

### **5.3 Executar migrações em produção**
```bash
# Via Railway CLI
railway run npm run migrate:prod
```

## 📊 **Verificar Funcionamento**

### **Backend (Porta 3001)**
- ✅ Health check: `/api/health`
- ✅ Autenticação: `/api/auth/login`
- ✅ Questões: `/api/questions`
- ✅ Admin: `/api/questions` (POST)

### **Frontend (Porta 3000)**
- ✅ Login/Registro
- ✅ Lista de questões
- ✅ Filtros avançados
- ✅ Painel admin
- ✅ Estatísticas

## 🔧 **Comandos Úteis**

```bash
# Desenvolvimento
npm run dev              # Frontend
npm run server:dev       # Backend
npm run migrate:dev      # Migrações

# Produção
npm run build           # Build frontend
npm run server:prod     # Backend produção
npm run migrate:prod    # Migrações produção

# Railway
railway login           # Login Railway
railway up              # Deploy
railway logs            # Ver logs
railway run npm run migrate:prod  # Executar comando
```

## 🐛 **Solução de Problemas**

### **Erro de conexão com banco**
```bash
# Verificar DATABASE_URL
echo $DATABASE_URL

# Testar conexão
psql $DATABASE_URL -c "SELECT 1"
```

### **Erro de CORS**
- Verificar `FRONTEND_URL` no .env
- Verificar se frontend está rodando na porta 3000

### **Erro de autenticação**
- Verificar `JWT_SECRET` no .env
- Limpar localStorage do navegador

### **Erro de migração**
```bash
# Recriar tabelas
railway run npm run migrate:prod
```

## 📈 **Próximos Passos**

1. **Adicionar mais questões** via painel admin
2. **Configurar domínio personalizado**
3. **Implementar backup automático**
4. **Adicionar monitoramento**
5. **Otimizar performance**

## 🆘 **Suporte**

- **Railway**: [docs.railway.app](https://docs.railway.app)
- **PostgreSQL**: [postgresql.org/docs](https://www.postgresql.org/docs/)
- **Express**: [expressjs.com](https://expressjs.com/)

---

**🎉 Parabéns! Seu projeto está rodando com PostgreSQL puro!** 