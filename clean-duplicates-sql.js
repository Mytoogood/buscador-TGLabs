// Script para limpar registros duplicados usando SQL direto
import pkg from 'pg';
const { Client } = pkg;

// Configuração da conexão PostgreSQL
const client = new Client({
  connectionString: 'postgresql://postgres:UUnUjGaPv4eSfJkWka5h8kxStu6EAGcu@db.rtxrgqlhdbsztsbnycln.supabase.co:5432/postgres'
});

async function cleanDuplicateProfiles() {
  try {
    console.log('🔌 Conectando ao banco de dados...');
    await client.connect();
    
    console.log('✅ Conectado com sucesso!');
    
    // Primeiro, vamos ver quantos registros temos
    const countResult = await client.query('SELECT COUNT(*) FROM profiles');
    console.log(`📊 Total de profiles antes da limpeza: ${countResult.rows[0].count}`);
    
    // Verificar emails duplicados
    const duplicatesQuery = `
      SELECT email, COUNT(*) as count
      FROM profiles 
      GROUP BY email 
      HAVING COUNT(*) > 1
      ORDER BY count DESC
    `;
    
    const duplicatesResult = await client.query(duplicatesQuery);
    console.log(`📧 Emails com duplicatas: ${duplicatesResult.rows.length}`);
    
    if (duplicatesResult.rows.length > 0) {
      console.log('\nEmails duplicados:');
      duplicatesResult.rows.forEach(row => {
        console.log(`  - ${row.email}: ${row.count} registros`);
      });
    }
    
    // Para cada email duplicado, manter apenas o mais antigo
    for (const duplicateRow of duplicatesResult.rows) {
      const email = duplicateRow.email;
      console.log(`\n🧹 Limpando duplicatas para: ${email}`);
      
      // Buscar todos os registros deste email ordenados por data de criação
      const profilesQuery = `
        SELECT id, name, created_at 
        FROM profiles 
        WHERE email = $1 
        ORDER BY created_at ASC
      `;
      
      const profilesResult = await client.query(profilesQuery, [email]);
      const profiles = profilesResult.rows;
      
      if (profiles.length > 1) {
        // Manter o primeiro (mais antigo)
        const toKeep = profiles[0];
        const toDelete = profiles.slice(1);
        
        console.log(`   ✅ Mantendo: ID ${toKeep.id} (${toKeep.name}) - criado em ${toKeep.created_at}`);
        
        // Deletar os outros
        for (const profile of toDelete) {
          console.log(`   🗑️  Removendo: ID ${profile.id} (${profile.name}) - criado em ${profile.created_at}`);
          
          const deleteQuery = 'DELETE FROM profiles WHERE id = $1';
          await client.query(deleteQuery, [profile.id]);
          
          console.log(`   ✅ Removido com sucesso`);
        }
      }
    }
    
    // Verificar resultado final
    const finalCountResult = await client.query('SELECT COUNT(*) FROM profiles');
    console.log(`\n📊 Total de profiles após limpeza: ${finalCountResult.rows[0].count}`);
    
    // Verificar se ainda há duplicatas
    const finalDuplicatesResult = await client.query(duplicatesQuery);
    
    if (finalDuplicatesResult.rows.length === 0) {
      console.log('✅ Limpeza concluída com sucesso! Não há mais duplicatas.');
    } else {
      console.log(`⚠️  Ainda existem ${finalDuplicatesResult.rows.length} emails com duplicatas.`);
    }
    
    // Listar todos os profiles únicos
    console.log('\n📋 Profiles únicos restantes:');
    const uniqueProfilesQuery = `
      SELECT id, name, email, created_at 
      FROM profiles 
      ORDER BY email, created_at
    `;
    
    const uniqueProfilesResult = await client.query(uniqueProfilesQuery);
    uniqueProfilesResult.rows.forEach((profile, index) => {
      console.log(`${index + 1}. ${profile.name} (${profile.email}) - ID: ${profile.id}`);
    });
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.end();
    console.log('\n🔌 Conexão encerrada.');
  }
}

cleanDuplicateProfiles();
