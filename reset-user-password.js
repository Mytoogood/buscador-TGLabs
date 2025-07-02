// Script para redefinir senha do usuário
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function resetUserPassword() {
  try {
    const userEmail = 'felipecrs04@gmail.com';
    
    console.log(`🔑 Enviando link de redefinição de senha para: ${userEmail}`);
    
    // Enviar email de reset de senha
    const { data, error } = await supabase.auth.resetPasswordForEmail(userEmail, {
      redirectTo: 'http://localhost:3000/update-password'
    });
    
    if (error) {
      console.error('❌ Erro ao enviar email de reset:', error.message);
      return;
    }
    
    console.log('✅ Email de redefinição de senha enviado com sucesso!');
    console.log('📧 Verifique sua caixa de entrada e spam.');
    console.log('💡 Clique no link no email para redefinir sua senha.');
    console.log('\n🔍 Alternativa: Use a página de reset no navegador:');
    console.log('   http://localhost:3000/forgot-password');
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

async function createTestUser() {
  try {
    console.log('\n🧪 Alternativa: Criando usuário de teste com senha conhecida...');
    
    const testEmail = 'teste-felipe@gmail.com';
    const testPassword = '123456';
    const testName = 'Felipe Teste';
    const testPhone = '(11) 99999-9999';
    
    // Tentar criar usuário
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: testName,
          phone: testPhone
        }
      }
    });
    
    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('ℹ️ Usuário de teste já existe, tentando login...');
        
        // Tentar fazer login
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword
        });
        
        if (loginError) {
          console.log('❌ Erro no login do usuário de teste:', loginError.message);
        } else {
          console.log('✅ Login do usuário de teste realizado com sucesso!');
          console.log(`📧 Use: ${testEmail}`);
          console.log(`🔑 Senha: ${testPassword}`);
        }
        return;
      } else {
        console.error('❌ Erro ao criar usuário de teste:', authError.message);
        return;
      }
    }
    
    if (authData?.user) {
      console.log('✅ Usuário de teste criado na autenticação!');
      
      // Criar profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          name: testName,
          email: testEmail,
          phone: testPhone,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (profileError) {
        console.error('❌ Erro ao criar profile de teste:', profileError.message);
      } else {
        console.log('✅ Profile de teste criado com sucesso!');
        console.log('\n🎯 Credenciais de teste:');
        console.log(`📧 Email: ${testEmail}`);
        console.log(`🔑 Senha: ${testPassword}`);
        console.log('\n💡 Use essas credenciais para testar o login em http://localhost:3000/login');
      }
    }
    
  } catch (error) {
    console.error('❌ Erro inesperado ao criar usuário de teste:', error);
  }
}

// Executar
console.log('🔄 Opções para resolver o problema de login...\n');
await resetUserPassword();
await createTestUser();
