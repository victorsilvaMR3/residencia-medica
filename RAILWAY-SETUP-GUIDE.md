# 🚀 Guia Visual - Setup Railway

## 📋 **Passo 1: Login no Railway**

1. **Abra o navegador** que foi aberto pelo CLI
2. **Faça login** com sua conta GitHub
3. **Autorize** o Railway CLI

## 🆕 **Passo 2: Criar Projeto**

### **Opção A: Via CLI (Recomendado)**
```bash
# No terminal, execute:
railway init
```

### **Opção B: Via Web**
1. Acesse [railway.app/dashboard](https://railway.app/dashboard)
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Conecte este repositório: `residencia`

## 🗄️ **Passo 3: Adicionar PostgreSQL**

### **Via CLI:**
```bash
railway add
# Selecione: Database → PostgreSQL
```

### **Via Web:**
1. No projeto criado, clique em **"Add Service"**
2. Selecione **"Database"**
3. Escolha **"PostgreSQL"**
4. Aguarde a criação (2-3 minutos)

## 🔗 **Passo 4: Copiar DATABASE_URL**

### **Via CLI:**
```bash
railway variables
# Procure por DATABASE_URL
```

### **Via Web:**
1. Clique no serviço **PostgreSQL**
2. Vá na aba **"Variables"**
3. Copie a **DATABASE_URL**

## ⚙️ **Passo 5: Configurar Local**

1. **Edite o arquivo `.env.local`:**
```bash
# Substitua a linha DATABASE_URL por:
DATABASE_URL=sua_url_do_railway_aqui
```

2. **Execute as migrações:**
```bash
npm run migrate:dev
```

3. **Teste o servidor:**
```bash
npm run server:dev
```

## 🧪 **Passo 6: Testar**

```bash
# Health check
curl http://localhost:3001/api/health

# Listar questões
curl http://localhost:3001/api/questions
```

## 📊 **Verificar no Railway**

- **Dashboard**: [railway.app/dashboard](https://railway.app/dashboard)
- **Logs**: Clique no projeto → "Deployments" → "View Logs"
- **Variáveis**: Clique no projeto → "Variables"

## 🆘 **Solução de Problemas**

### **Erro de conexão:**
- Verifique se a DATABASE_URL está correta
- Teste: `psql $DATABASE_URL -c "SELECT 1"`

### **Erro de CORS:**
- Verifique se FRONTEND_URL está configurado
- Teste: `curl -H "Origin: http://localhost:3000" http://localhost:3001/api/health`

### **Erro de migração:**
- Execute: `npm run migrate:dev`
- Verifique logs: `railway logs`

---

**🎯 Próximo passo:** Depois de configurar, vamos integrar o frontend! 