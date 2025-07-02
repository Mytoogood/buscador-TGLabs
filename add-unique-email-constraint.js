// Script para adicionar constraint de email único na tabela profiles
import pkg from 'pg';
const { Client } = pkg;

// Configuração da conexão PostgreSQL
const client = new Client({
  connectionString: 'postgresql://postgres:UUnUjGaPv4eSfJkWka5h8kxStu6EAGcu@db.rtxrgqlhdbsztsbnycln.supabase.co:5432/postgres'
});

async function addUniqueEmailConstraint() {
  try {
    console.log('🔌 Conectando ao banco de dados...');
    await client.connect();
    
    console.log('✅ Conectado com sucesso!');
    
    // Verificar se já existe um constraint único no email
    const checkConstraintQuery = `
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_name = 'profiles' 
      AND constraint_type = 'UNIQUE'
      AND constraint_name LIKE '%email%'
    `;
    
    const constraintResult = await client.query(checkConstraintQuery);
    
    if (constraintResult.rows.length > 0) {
      console.log('ℹ️  Constraint de email único já existe:', constraintResult.rows[0].constraint_name);
    } else {
      console.log('📝 Adicionando constraint de email único...');
      
      // Adicionar constraint de email único
      const addConstraintQuery = `
        ALTER TABLE profiles 
        ADD CONSTRAINT profiles_email_unique 
        UNIQUE (email)
      `;
      
      await client.query(addConstraintQuery);
      console.log('✅ Constraint de email único adicionado com sucesso!');
    }
    
    // Verificar o resultado
    console.log('\n🔍 Verificando constraints na tabela profiles:');
    const allConstraintsQuery = `
      SELECT 
        constraint_name, 
        constraint_type,
        column_name
      FROM information_schema.table_constraints tc
      LEFT JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.table_name = 'profiles'
      ORDER BY constraint_type, constraint_name
    `;
    
    const allConstraintsResult = await client.query(allConstraintsQuery);
    allConstraintsResult.rows.forEach(row => {
      console.log(`  - ${row.constraint_type}: ${row.constraint_name} (${row.column_name || 'N/A'})`);
    });
    
    console.log('\n✅ Agora emails duplicados não poderão ser inseridos na tabela profiles!');
    
  } catch (error) {
    if (error.code === '23505') {
      console.log('ℹ️  Constraint de email único já existe no banco de dados.');
    } else {
      console.error('❌ Erro:', error);
    }
  } finally {
    await client.end();
    console.log('\n🔌 Conexão encerrada.');
  }
}

addUniqueEmailConstraint();
