// Script para limpar a tabela profiles
import pkg from 'pg';
const { Client } = pkg;

// Configuração da conexão PostgreSQL
const client = new Client({
  connectionString: 'postgresql://postgres:UUnUjGaPv4eSfJkWka5h8kxStu6EAGcu@db.rtxrgqlhdbsztsbnycln.supabase.co:5432/postgres'
});

async function truncateProfiles() {
  try {
    console.log('🔌 Conectando ao banco de dados para limpeza...');
    await client.connect();
    
    console.log('✅ Conectado com sucesso! Iniciando limpeza...');
    
    // Limpar a tabela profiles
    await client.query('TRUNCATE TABLE profiles RESTART IDENTITY CASCADE');
    console.log('🧹 Tabela profiles limpa com sucesso!');

  } catch (error) {
    console.error('❌ Erro ao limpar a tabela:', error);
  } finally {
    await client.end();
    console.log('🔌 Conexão encerrada.');
  }
}

truncateProfiles();
