# 🚀 Deploy no Netlify - Guia Completo

## 📋 **Pré-requisitos**

- ✅ Projeto buildado com sucesso (`npm run build`)
- ✅ Conta no Netlify (gratuita)
- ✅ Backend Railway configurado
- ✅ Repositório no GitHub

## 🎯 **Passo 1: Preparar o Projeto**

### **1.1 Verificar Build Local**
```bash
# Testar build localmente
npm run build

# Verificar se a pasta dist foi criada
ls -la dist/
```

### **1.2 Arquivos de Configuração**
- ✅ `netlify.toml` - Configuração do Netlify
- ✅ `vite.config.ts` - Configuração do Vite otimizada
- ✅ `tsconfig.json` - TypeScript configurado

## 🌐 **Passo 2: Deploy no Netlify**

### **Opção A: Deploy via GitHub (Recomendado)**

1. **Acesse [netlify.com](https://netlify.com)**
2. **Faça login com GitHub**
3. **Clique em "New site from Git"**
4. **Selecione GitHub**
5. **Escolha o repositório: `residencia`**
6. **Configure o deploy:**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Base directory:** (deixe vazio)

### **Opção B: Deploy via Drag & Drop**

1. **Execute o build local:**
   ```bash
   npm run build
   ```
2. **Acesse [netlify.com](https://netlify.com)**
3. **Arraste a pasta `dist` para a área de deploy**

## ⚙️ **Passo 3: Configurar Variáveis de Ambiente**

### **3.1 Acessar Configurações**
1. No painel do Netlify, vá em **Site settings**
2. Clique em **Environment variables**

### **3.2 Adicionar Variáveis**
```
VITE_API_URL=https://seu-backend-railway.railway.app
VITE_APP_NAME=Prova Residência
VITE_APP_VERSION=1.0.0
```

### **3.3 Configurar CORS no Backend**
No Railway, adicione a URL do Netlify ao CORS:
```
FRONTEND_URL=https://seu-site.netlify.app
```

## 🔧 **Passo 4: Configurar Domínio**

### **4.1 Domínio Automático**
- Netlify gera automaticamente: `https://random-name.netlify.app`
- Você pode alterar para: `https://residencia-medica.netlify.app`

### **4.2 Domínio Personalizado (Opcional)**
1. Vá em **Domain settings**
2. Clique em **Add custom domain**
3. Configure seu domínio

## 🧪 **Passo 5: Testar o Deploy**

### **5.1 Verificar Funcionalidades**
- ✅ Página inicial carrega
- ✅ Navegação funciona
- ✅ Login/Registro
- ✅ Lista de questões
- ✅ Filtros funcionam
- ✅ Sistema de revisões

### **5.2 Testar Integração Backend**
- ✅ API calls funcionam
- ✅ Autenticação
- ✅ Banco de dados

## 📊 **Passo 6: Monitoramento**

### **6.1 Logs do Deploy**
- Acesse **Deploys** no painel
- Clique em **View deploy log**

### **6.2 Analytics**
- **Site analytics** - Visitas e performance
- **Function logs** - Se usar serverless functions

## 🚀 **URLs Finais**

### **Frontend (Netlify):**
```
https://residencia-medica.netlify.app
```

### **Backend (Railway):**
```
https://residencia-backend-production.up.railway.app
```

### **Banco de Dados (Railway PostgreSQL):**
```
postgresql://postgres:...@railway.internal:5432/railway
```

## 🔄 **Deploy Automático**

### **Configurar GitHub Actions (Opcional)**
1. **Push para `main`** = Deploy automático
2. **Pull Request** = Preview deploy
3. **Branch protection** = Deploy apenas após review

## 🐛 **Solução de Problemas**

### **Erro de Build**
```bash
# Verificar logs
netlify logs

# Build local
npm run build
```

### **Erro de CORS**
- Verificar `FRONTEND_URL` no Railway
- Adicionar domínio do Netlify ao CORS

### **Erro de API**
- Verificar `VITE_API_URL` no Netlify
- Testar endpoint: `curl https://seu-backend.railway.app/api/health`

### **Erro de Banco**
- Verificar `DATABASE_URL` no Railway
- Testar conexão: `railway run npm run migrate:prod`

## 📈 **Otimizações**

### **Performance**
- ✅ Code splitting configurado
- ✅ Assets otimizados
- ✅ Gzip compression

### **SEO**
- ✅ Meta tags configuradas
- ✅ Sitemap (se necessário)
- ✅ Robots.txt

## 🎉 **Sucesso!**

**Seu projeto está online em:**
```
https://residencia-medica.netlify.app
```

### **Próximos Passos**
1. **Testar todas as funcionalidades**
2. **Configurar domínio personalizado**
3. **Implementar analytics**
4. **Configurar backup automático**
5. **Monitorar performance**

---

## 📞 **Suporte**

- **Netlify Docs:** [docs.netlify.com](https://docs.netlify.com)
- **Railway Docs:** [docs.railway.app](https://docs.railway.app)
- **Vite Docs:** [vitejs.dev](https://vitejs.dev)

**Status: 🚀 PRONTO PARA PRODUÇÃO!** 