// Script para testar o login diretamente com o Supabase
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw';

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false
  }
});

// Testar login
async function testLogin(email, password) {
  console.log(`\n🔐 Testando login para: ${email}`);
  
  try {
    // 1. Tentar fazer login
    console.log('\n1. Tentando fazer login...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('❌ Erro no login:', error.message);
      
      // Verificar se o erro é de credenciais inválidas
      if (error.message.includes('Invalid login credentials')) {
        console.log('\n🔍 O email ou senha estão incorretos.');
        
        // Verificar se o email está cadastrado
        console.log('\n🔍 Verificando se o email está cadastrado...');
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email)
          .maybeSingle();
          
        if (userError) {
          console.error('❌ Erro ao verificar email:', userError.message);
        } else if (userData) {
          console.log(`✅ Email encontrado na tabela profiles. ID do usuário: ${userData.id}`);
          console.log('🔑 Dica: A senha pode estar incorreta. Use a opção "Esqueci minha senha" para redefini-la.');
        } else {
          console.log('❌ Email não encontrado na tabela profiles.');
          console.log('🔍 Dica: Você pode estar usando um email diferente ou precisa se cadastrar primeiro.');
        }
      }
      
      return;
    }
    
    // Se chegou aqui, o login foi bem-sucedido
    console.log('\n✅ Login bem-sucedido!');
    console.log('🔑 Dados da sessão:', {
      user: {
        id: data.user.id,
        email: data.user.email,
        email_confirmed: data.user.email_confirmed_at ? 'Sim' : 'Não'
      },
      session: {
        expires_at: new Date(data.session.expires_at * 1000).toLocaleString(),
        expires_in: data.session.expires_in + ' segundos',
        refresh_token: data.session.refresh_token ? '***' + data.session.refresh_token.slice(-6) : 'não disponível',
        access_token: data.session.access_token ? '***' + data.session.access_token.slice(-6) : 'não disponível'
      }
    });
    
    // Verificar perfil do usuário
    console.log('\n👤 Verificando perfil do usuário...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
      
    if (profileError) {
      console.error('❌ Erro ao buscar perfil:', profileError.message);
    } else {
      console.log('📝 Perfil do usuário:', profile);
    }
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

// Executar teste
const testEmail = 'felipecrs04@gmail.com';
const testPassword = '123456'; // Substitua pela senha correta

testLogin(testEmail, testPassword);
