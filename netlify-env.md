# 🌐 Configuração de Variáveis de Ambiente - Netlify

## 📋 **Variáveis Necessárias**

Configure estas variáveis no painel do Netlify:

### **Variáveis de Ambiente**
```
VITE_API_URL=https://seu-backend-railway.railway.app
VITE_APP_NAME=Prova Residência
VITE_APP_VERSION=1.0.0
```

## 🔧 **Como Configurar**

1. **Acesse o painel do Netlify**
2. **Vá em Site settings → Environment variables**
3. **Adicione cada variável:**
   - `VITE_API_URL` = URL do seu backend Railway
   - `VITE_APP_NAME` = Prova Residência
   - `VITE_APP_VERSION` = 1.0.0

## 🚀 **URLs de Exemplo**

### **Backend Railway (substitua pela sua URL real):**
```
https://residencia-backend-production.up.railway.app
```

### **Frontend Netlify (será gerada automaticamente):**
```
https://residencia-frontend.netlify.app
```

## ⚠️ **Importante**

- Todas as variáveis devem começar com `VITE_` para serem acessíveis no frontend
- A URL do backend deve ser HTTPS
- Configure o CORS no backend para aceitar o domínio do Netlify 