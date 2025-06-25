// Script para criar um usuário diretamente no banco de dados (apenas para desenvolvimento)
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw';

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Função para criar um usuário de teste
async function createTestUser() {
  const testEmail = 'teste@teste.com';
  const testPassword = 'senha123';
  const testName = 'Usuário Teste';
  const testPhone = '11999999999';

  console.log('\n🔄 Tentando criar usuário de teste...');
  console.log(`📧 Email: ${testEmail}`);
  console.log(`🔑 Senha: ${testPassword}`);

  try {
    // 1. Tentar se inscrever (criar conta)
    console.log('\n1. Criando conta...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: testName,
          phone: testPhone
        }
      }
    });

    if (signUpError) {
      console.log('ℹ️  Usuário pode já existir. Tentando fazer login...');
      
      // 2. Se o usuário já existe, tente fazer login
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      });

      if (signInError) throw signInError;
      
      console.log('✅ Login realizado com sucesso!');
      console.log('ID do usuário:', signInData.user.id);
      return;
    }

    console.log('✅ Conta criada com sucesso!');
    console.log('ID do usuário:', signUpData.user.id);
    console.log('\n📧 Um email de confirmação foi enviado. Por favor, verifique sua caixa de entrada.');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.log('\n🔍 Dicas para solução de problemas:');
    console.log('1. Verifique se o email já está em uso');
    console.log('2. Verifique se a senha atende aos requisitos mínimos');
    console.log('3. Verifique sua conexão com a internet');
    console.log('4. Tente novamente mais tarde');
  }
}

// Executar a criação do usuário
createTestUser();
