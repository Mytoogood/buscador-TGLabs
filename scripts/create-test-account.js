// Script para criar uma conta de teste no Supabase
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw';

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Função para gerar um email aleatório
function generateRandomEmail() {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  const length = 10;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return `${result}@example.com`;
}

// Criar conta de teste
async function createTestAccount() {
  const testEmail = generateRandomEmail();
  const testPassword = 'senha123'; // Senha padrão para teste
  const testName = 'Usuário Teste';
  const testPhone = '11999999999';

  console.log('\n🔄 Criando conta de teste...');
  console.log(`📧 Email: ${testEmail}`);
  console.log(`🔑 Senha: ${testPassword}`);
  console.log(`👤 Nome: ${testName}`);
  console.log(`📱 Telefone: ${testPhone}`);

  try {
    // 1. Criar usuário na autenticação
    console.log('\n1. Criando usuário na autenticação...');
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: testName,
          phone: testPhone,
        },
        emailRedirectTo: 'http://localhost:3000/login',
      },
    });

    if (signUpError) {
      console.error('❌ Erro ao criar usuário:', signUpError.message);
      return;
    }

    console.log('✅ Usuário criado com sucesso!');
    console.log('ID do usuário:', authData.user.id);

    // 2. Criar perfil na tabela profiles
    console.log('\n2. Criando perfil do usuário...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        name: testName,
        email: testEmail,
        phone: testPhone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (profileError) {
      console.error('❌ Erro ao criar perfil:', profileError.message);
      // Continuar mesmo com erro, pois o usuário já foi criado
    } else {
      console.log('✅ Perfil criado com sucesso!');
    }

    // 3. Fazer login para confirmar que está tudo certo
    console.log('\n3. Testando login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (loginError) {
      console.error('❌ Erro ao fazer login:', loginError.message);
      return;
    }

    console.log('✅ Login realizado com sucesso!');
    
    console.log('\n🎉 Conta de teste criada com sucesso!');
    console.log('\n📋 Informações da conta:');
    console.log('-----------------------');
    console.log(`🔗 URL do painel: http://localhost:3000/login`);
    console.log(`📧 Email: ${testEmail}`);
    console.log(`🔑 Senha: ${testPassword}`);
    console.log('\n⚠️  Lembre-se de que este é um usuário de teste. Use-o apenas para fins de desenvolvimento.');

  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

// Executar a criação da conta
createTestAccount();
