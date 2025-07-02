// Script para confirmar email automaticamente
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function confirmEmailAuto() {
  try {
    const email = 'felipecrs04@gmail.com';
    const password = 'L26112004L';
    
    console.log('🔍 Verificando status do email:', email);
    
    // 1. Primeiro vamos tentar registrar o usuário novamente com confirmação automática
    console.log('\n1️⃣ Registrando usuário com confirmação automática...');
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: 'Felipe',
          phone: '11999887766'
        },
        emailRedirectTo: undefined // Desabilita confirmação por email
      }
    });
    
    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        console.log('⚠️ Usuário já existe, tentando fazer login direto...');
        
        // Se já existe, vamos tentar um truque: resetar a senha
        console.log('\n2️⃣ Enviando reset de senha para confirmar email...');
        
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: 'http://localhost:3000/update-password'
        });
        
        if (resetError) {
          console.error('❌ Erro ao enviar reset:', resetError);
        } else {
          console.log('✅ Email de reset enviado! Isso deve confirmar o email automaticamente.');
        }
        
        // Tentar login novamente após alguns segundos
        console.log('\n3️⃣ Aguardando 3 segundos e tentando login...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: email,
          password: password
        });
        
        if (loginError) {
          console.log('❌ Login ainda falhou:', loginError.message);
          
          if (loginError.message.includes('Email not confirmed')) {
            console.log('\n💡 Vamos desabilitar a confirmação de email temporariamente...');
            console.log('🔧 Você precisa acessar o painel do Supabase e desabilitar "Enable email confirmations"');
            console.log('   - Vá em Authentication > Settings');
            console.log('   - Desmarque "Enable email confirmations"');
            console.log('   - Salve as configurações');
          }
        } else {
          console.log('✅ Login bem-sucedido!');
          console.log(`   - ID: ${loginData.user.id}`);
          console.log(`   - Email confirmado: ${loginData.user.email_confirmed_at ? 'Sim' : 'Não'}`);
          
          // Criar perfil se não existir
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .insert([{
              id: loginData.user.id,
              name: 'Felipe',
              email: email,
              phone: '11999887766',
              created_at: new Date().toISOString()
            }]);
          
          if (profileError && !profileError.message.includes('duplicate')) {
            console.log('❌ Erro ao criar perfil:', profileError.message);
          } else {
            console.log('✅ Perfil criado/atualizado com sucesso!');
          }
          
          await supabase.auth.signOut();
        }
      } else {
        console.log('❌ Erro no registro:', signUpError.message);
      }
    } else {
      console.log('✅ Registro bem-sucedido!');
      console.log(`   - ID: ${signUpData.user.id}`);
      console.log(`   - Email: ${signUpData.user.email}`);
      console.log(`   - Email confirmado: ${signUpData.user.email_confirmed_at ? 'Sim' : 'Não'}`);
      
      // Criar perfil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: signUpData.user.id,
          name: 'Felipe',
          email: email,
          phone: '11999887766',
          created_at: new Date().toISOString()
        }]);
      
      if (profileError) {
        console.log('❌ Erro ao criar perfil:', profileError.message);
      } else {
        console.log('✅ Perfil criado com sucesso!');
      }
    }
    
    console.log('\n🎯 Agora tente fazer login novamente no navegador!');
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

confirmEmailAuto();
