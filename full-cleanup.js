// Script para limpeza completa do sistema
import pkg from 'pg';
const { Client } = pkg;

// Configuração da conexão PostgreSQL
const client = new Client({
  connectionString: 'postgresql://postgres:UUnUjGaPv4eSfJkWka5h8kxStu6EAGcu@db.rtxrgqlhdbsztsbnycln.supabase.co:5432/postgres'
});

async function fullCleanup() {
  try {
    console.log('🔌 Conectando ao banco de dados...');
    await client.connect();
    
    console.log('✅ Conectado com sucesso!');
    
    // 1. Limpar tabela profiles
    console.log('\n1️⃣ Limpando tabela profiles...');
    await client.query('TRUNCATE TABLE profiles RESTART IDENTITY CASCADE');
    console.log('✅ Tabela profiles limpa!');
    
    // 2. Limpar usuários da autenticação (tabela auth.users)
    console.log('\n2️⃣ Limpando usuários da autenticação...');
    await client.query('DELETE FROM auth.users');
    console.log('✅ Usuários da autenticação removidos!');
    
    // 3. Limpar outras tabelas relacionadas à autenticação
    console.log('\n3️⃣ Limpando tabelas auxiliares...');
    await client.query('DELETE FROM auth.identities');
    await client.query('DELETE FROM auth.sessions');
    await client.query('DELETE FROM auth.refresh_tokens');
    console.log('✅ Tabelas auxiliares limpas!');
    
    // 4. Verificar resultado
    console.log('\n4️⃣ Verificando resultado...');
    
    const profileCount = await client.query('SELECT COUNT(*) FROM profiles');
    const userCount = await client.query('SELECT COUNT(*) FROM auth.users');
    
    console.log(`📊 Profiles restantes: ${profileCount.rows[0].count}`);
    console.log(`👥 Usuários auth restantes: ${userCount.rows[0].count}`);
    
    if (profileCount.rows[0].count == 0 && userCount.rows[0].count == 0) {
      console.log('\n🎉 Limpeza completa realizada com sucesso!');
      console.log('💡 Agora você pode registrar qualquer email sem problemas.');
    } else {
      console.log('\n⚠️ Alguns registros ainda existem. Pode ser necessário investigar.');
    }
    
  } catch (error) {
    console.error('❌ Erro durante a limpeza:', error);
  } finally {
    await client.end();
    console.log('\n🔌 Conexão encerrada.');
  }
}

console.log('🧹 Iniciando limpeza completa do sistema...');
console.log('⚠️ ATENÇÃO: Isso removerá TODOS os usuários e profiles!');
fullCleanup();
