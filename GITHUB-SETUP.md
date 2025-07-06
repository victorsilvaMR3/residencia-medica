# 🚀 Setup GitHub + Deploy Netlify - Guia Completo

## 📋 **Passo 1: Criar Repositório no GitHub**

### **1.1 Acesse o GitHub**
1. Vá para [github.com](https://github.com)
2. Faça login na sua conta
3. Clique no botão **"New"** (verde) no canto superior direito

### **1.2 Configure o Repositório**
- **Repository name:** `residencia-medica`
- **Description:** `Plataforma educacional para preparação de Residência Médica`
- **Visibility:** Public (ou Private, sua escolha)
- **✅ Add a README file** (NÃO marque, pois já temos)
- **✅ Add .gitignore** (NÃO marque, pois já temos)
- **✅ Choose a license** (Opcional)

### **1.3 Clique em "Create repository"**

## 🔗 **Passo 2: Conectar Repositório Local**

### **2.1 Adicionar Remote**
```bash
# No terminal, execute:
git remote add origin https://github.com/SEU_USUARIO/residencia-medica.git
```

### **2.2 Fazer Push**
```bash
# Enviar código para o GitHub
git branch -M main
git push -u origin main
```

## 🌐 **Passo 3: Deploy no Netlify**

### **3.1 Acesse o Netlify**
1. Vá para [netlify.com](https://netlify.com)
2. Faça login com GitHub
3. Clique em **"New site from Git"**

### **3.2 Configure o Deploy**
1. **Choose Git provider:** GitHub
2. **Select repository:** `residencia-medica`
3. **Configure build settings:**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Base directory:** (deixe vazio)

### **3.3 Clique em "Deploy site"**

## ⚙️ **Passo 4: Configurar Variáveis de Ambiente**

### **4.1 No Netlify**
1. Vá em **Site settings**
2. Clique em **Environment variables**
3. Adicione:
   ```
   VITE_API_URL=https://seu-backend-railway.railway.app
   VITE_APP_NAME=Prova Residência
   VITE_APP_VERSION=1.0.0
   ```

### **4.2 No Railway (Backend)**
1. Vá em **Variables**
2. Adicione:
   ```
   FRONTEND_URL=https://seu-site.netlify.app
   NODE_ENV=production
   ```

## 🧪 **Passo 5: Testar o Deploy**

### **5.1 Verificar URLs**
- **Frontend:** `https://seu-site.netlify.app`
- **Backend:** `https://seu-backend.railway.app`

### **5.2 Testar Funcionalidades**
- ✅ Página inicial
- ✅ Login/Registro
- ✅ Lista de questões
- ✅ Filtros
- ✅ Sistema de revisões

## 🔄 **Passo 6: Deploy Automático**

### **6.1 Configurar GitHub Actions (Opcional)**
1. **Push para `main`** = Deploy automático
2. **Pull Request** = Preview deploy

### **6.2 Comandos para Atualizações**
```bash
# Fazer alterações
git add .
git commit -m "Descrição das alterações"
git push origin main

# O Netlify fará deploy automático
```

## 🐛 **Solução de Problemas**

### **Erro de Build**
- Verificar logs no Netlify
- Testar build local: `npm run build`

### **Erro de CORS**
- Verificar `FRONTEND_URL` no Railway
- Verificar `VITE_API_URL` no Netlify

### **Erro de API**
- Testar endpoint: `curl https://seu-backend.railway.app/api/health`
- Verificar logs no Railway

## 📊 **URLs Finais**

### **Frontend (Netlify):**
```
https://residencia-medica.netlify.app
```

### **Backend (Railway):**
```
https://residencia-backend-production.up.railway.app
```

## 🎉 **Sucesso!**

**Seu projeto está online e funcionando!**

### **Próximos Passos**
1. **Configurar domínio personalizado**
2. **Implementar analytics**
3. **Configurar backup automático**
4. **Monitorar performance**

---

## 📞 **Suporte**

- **GitHub Docs:** [docs.github.com](https://docs.github.com)
- **Netlify Docs:** [docs.netlify.com](https://docs.netlify.com)
- **Railway Docs:** [docs.railway.app](https://docs.railway.app)

**Status: 🚀 PRONTO PARA PRODUÇÃO!** 