import { Pool } from 'pg'
import { migrationScripts } from '../src/services/database'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' })

// Configuração do banco
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/residencia',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

async function runMigrations() {
  try {
    console.log('🚀 Iniciando migrações do banco de dados...')
    console.log('🔗 Conectando em:', process.env.DATABASE_URL?.split('@')[1] || 'localhost')
    
    // Executar script de criação das tabelas
    console.log('📋 Criando tabelas...')
    await pool.query(migrationScripts.createTables)
    console.log('✅ Tabelas criadas com sucesso!')
    
    // Executar script de dados iniciais
    console.log('📝 Inserindo dados iniciais...')
    await pool.query(migrationScripts.insertSampleData)
    console.log('✅ Dados iniciais inseridos com sucesso!')
    
    console.log('🎉 Migrações concluídas com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro durante as migrações:', error)
    throw error
  } finally {
    await pool.end()
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

export default runMigrations 