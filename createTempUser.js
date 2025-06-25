// Script para criar um novo usuário temporário
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Dados do novo usuário temporário
const tempEmail = `temp_${Date.now()}@example.com`;
const tempPassword = 'temp123456';

// Função para criar um novo usuário temporário
async function createTempUser() {
  try {
    console.log('Criando usuário temporário...');
    
    // 1. Criar o usuário
    const { data, error } = await supabase.auth.signUp({
      email: tempEmail,
      password: tempPassword,
      options: {
        data: {
          name: 'Usuário Temporário',
          phone: '11999999999',
        },
        emailRedirectTo: 'http://localhost:3002/login',
      },
    });

    if (error) {
      console.error('Erro ao criar usuário temporário:', error);
      return { success: false, error };
    }

    console.log('\n✅ Usuário temporário criado com sucesso!');
    console.log('------------------------------------------');
    console.log('Email:', tempEmail);
    console.log('Senha:', tempPassword);
    console.log('------------------------------------------');
    console.log('\n⚠️ Use essas credenciais para fazer login.');
    console.log('⚠️ Este é um usuário temporário - use apenas para testes.');
    
    return { success: true, data };
    
  } catch (error) {
    console.error('Erro inesperado:', error);
    return { success: false, error };
  }
}

// Executar a função
createTempUser().then(({ success }) => {
  if (!success) {
    console.log('\n❌ Não foi possível criar o usuário temporário.');
    console.log('Por favor, tente novamente ou entre em contato com o suporte.');
  }
});
