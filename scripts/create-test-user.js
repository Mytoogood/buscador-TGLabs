// Script para criar um usuário de teste no Supabase
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxODk1MTYxNiwiZXhwIjoyMDM0NTI3NjE2fQ.4j6z4N4YwJQZJqJQJQJQJQJQJQJQJQJQJQJQJQJQJQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestUser() {
  const email = 'demo@juliomartins.com';
  const password = '123456';
  const name = 'Usuário Demo';
  const phone = '(11) 99999-9999';

  try {
    // 1. Criar usuário na autenticação
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone
        }
      }
    });

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        console.log('Usuário já existe. Fazendo login...');
        
        // Tentar fazer login
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) throw signInError;
        
        console.log('Login realizado com sucesso!');
        console.log('ID do usuário:', signInData.user.id);
        return signInData.user;
      }
      throw signUpError;
    }

    console.log('Usuário criado com sucesso!');
    console.log('ID do usuário:', authData.user.id);
    
    // 2. Criar perfil na tabela profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          name,
          email,
          phone,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select();

    if (profileError) throw profileError;

    console.log('Perfil criado com sucesso!');
    console.log('Dados do perfil:', profileData);
    
    return authData.user;
  } catch (error) {
    console.error('Erro ao criar usuário de teste:', error);
    throw error;
  }
}

// Executar a função
createTestUser()
  .then(user => {
    console.log('\n🎉 Usuário de teste configurado com sucesso!');
    console.log('Email:', user.email);
    console.log('Senha: 123456');
    console.log('\nAgora você pode fazer login na aplicação com essas credenciais.');
  })
  .catch(error => {
    console.error('\n❌ Erro ao configurar usuário de teste:', error.message);
  });
