#!/bin/bash

echo "🚀 Configurando Railway para Residência Médica"
echo "=============================================="

# Verificar se está logado
echo "📋 Verificando login no Railway..."
if ! railway status > /dev/null 2>&1; then
    echo "❌ Não está logado no Railway. Execute: railway login"
    exit 1
fi

echo "✅ Logado no Railway!"

# Criar projeto se não existir
echo "📦 Criando projeto no Railway..."
if ! railway project > /dev/null 2>&1; then
    echo "🆕 Criando novo projeto..."
    railway init
else
    echo "✅ Projeto já existe"
fi

# Adicionar PostgreSQL
echo "🗄️ Adicionando PostgreSQL..."
railway add

echo "🎉 Configuração concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Copie a DATABASE_URL do Railway"
echo "2. Atualize o arquivo .env.local"
echo "3. Execute: npm run migrate:dev"
echo "4. Execute: npm run server:dev"
echo ""
echo "🔗 Para ver as variáveis: railway variables" 