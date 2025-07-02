import { getSupabase } from './src/config/supabase.js'

async function createClientsTable() {
  const supabase = getSupabase()
  
  if (!supabase) {
    console.error('❌ Erro: Cliente Supabase não disponível')
    return
  }

  console.log('🔧 Configurando banco de dados...')

  try {
    // SQL para criar a tabela de clientes
    const createTableSQL = `
      -- Criar tabela de clientes
      CREATE TABLE IF NOT EXISTS public.clients (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          phone VARCHAR(20),
          cpf VARCHAR(14),
          birth_date DATE,
          address TEXT,
          city VARCHAR(100),
          state VARCHAR(2),
          cep VARCHAR(9),
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
      );
    `

    console.log('📝 Criando tabela clients...')
    const { error: tableError } = await supabase.rpc('exec_sql', { 
      sql: createTableSQL 
    })

    if (tableError) {
      console.log('⚠️  Tentando criar tabela usando método alternativo...')
      
      // Método alternativo: tentar inserir um registro fictício para forçar a criação da estrutura
      const { error: insertError } = await supabase
        .from('clients')
        .insert([{
          name: 'Test Client',
          email: 'test@example.com',
          phone: '(11) 99999-9999',
          cpf: '000.000.000-00',
          birth_date: '1990-01-01',
          address: 'Test Address',
          city: 'Test City', 
          state: 'SP',
          cep: '00000-000',
          notes: 'Test client for table creation'
        }])
        .select()

      if (insertError) {
        if (insertError.code === '42P01') {
          console.error('❌ Erro: Tabela "clients" não existe no banco de dados.')
          console.log('\n📋 Para criar a tabela manualmente:')
          console.log('1. Acesse o painel do Supabase: https://supabase.com/dashboard')
          console.log('2. Vá para o seu projeto')
          console.log('3. Clique em "SQL Editor" no menu lateral')
          console.log('4. Execute o seguinte SQL:')
          console.log('\n' + createTableSQL)
          return
        } else {
          console.log('✅ Tabela clients já existe!')
          
          // Remover o registro de teste se foi inserido
          await supabase
            .from('clients')
            .delete()
            .eq('email', 'test@example.com')
        }
      } else {
        console.log('✅ Tabela clients criada/verificada com sucesso!')
        
        // Remover o registro de teste
        await supabase
          .from('clients')
          .delete()
          .eq('email', 'test@example.com')
      }
    } else {
      console.log('✅ Tabela clients criada com sucesso!')
    }

    // Verificar se a tabela existe fazendo uma consulta simples
    console.log('🔍 Verificando estrutura da tabela...')
    const { data, error: selectError } = await supabase
      .from('clients')
      .select('*')
      .limit(1)

    if (selectError) {
      if (selectError.code === '42P01') {
        console.error('❌ Erro: Tabela "clients" ainda não existe.')
        console.log('\n📋 INSTRUÇÕES PARA CRIAR A TABELA MANUALMENTE:')
        console.log('1. Acesse: https://supabase.com/dashboard')
        console.log('2. Selecione seu projeto')
        console.log('3. Vá em "SQL Editor"')
        console.log('4. Cole e execute este SQL:')
        console.log('\n' + '='.repeat(50))
        console.log(createTableSQL)
        console.log('='.repeat(50))
        console.log('\n5. Depois execute novamente: npm run setup-db')
        return
      } else {
        console.error('❌ Erro ao verificar tabela:', selectError)
        return
      }
    }

    console.log('✅ Verificação concluída - tabela clients está funcionando!')
    console.log('\n🎉 Banco de dados configurado com sucesso!')
    console.log('📱 Agora você pode usar a funcionalidade "Adicionar Cliente"')

  } catch (error) {
    console.error('❌ Erro durante a configuração:', error)
    console.log('\n📋 CONFIGURAÇÃO MANUAL NECESSÁRIA:')
    console.log('1. Acesse o painel do Supabase')
    console.log('2. Vá para SQL Editor')
    console.log('3. Execute o SQL do arquivo: database/create_clients_table.sql')
  }
}

// Executar a configuração
createClientsTable()
  .then(() => {
    console.log('\n✨ Configuração finalizada!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Erro fatal:', error)
    process.exit(1)
  })
