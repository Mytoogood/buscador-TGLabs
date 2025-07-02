// Script para verificar status do usuário na autenticação
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAuthUser() {
  try {
    const testEmail = 'baraa.sariel@msitip.com';
    const testPassword = '123456789';
    
    console.log('🔍 Verificando usuário:', testEmail);
    
    // 1. Tentar fazer login
    console.log('\n1️⃣ Testando login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    if (loginError) {
      console.log('❌ Erro no login:', loginError.message);
      
      if (loginError.message.includes('Invalid login credentials')) {
        console.log('💡 Usuário não existe ou senha incorreta');
        
        // Tentar registrar novamente
        console.log('\n2️⃣ Tentando registrar novamente...');
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: testEmail,
          password: testPassword,
          options: {
            data: {
              name: 'fefetiii',
              phone: '11988778877'
            }
          }
        });
        
        if (signUpError) {
          console.log('❌ Erro no registro:', signUpError.message);
        } else {
          console.log('✅ Registro bem-sucedido!');
          console.log(`   - ID: ${signUpData.user.id}`);
          console.log(`   - Email: ${signUpData.user.email}`);
          
          // Criar perfil
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .insert([{
              id: signUpData.user.id,
              name: 'fefetiii',
              email: testEmail,
              phone: '11988778877',
              created_at: new Date().toISOString()
            }]);
          
          if (profileError) {
            console.log('❌ Erro ao criar perfil:', profileError.message);
          } else {
            console.log('✅ Perfil criado com sucesso!');
          }
          
          // Fazer logout
          await supabase.auth.signOut();
        }
      }
    } else {
      console.log('✅ Login bem-sucedido!');
      console.log(`   - ID: ${loginData.user.id}`);
      console.log(`   - Email: ${loginData.user.email}`);
      
      // Verificar se tem perfil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', loginData.user.id);
      
      if (profileError || !profileData || profileData.length === 0) {
        console.log('⚠️ Usuário autenticado mas sem perfil na tabela profiles');
        console.log('🔧 Criando perfil...');
        
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert([{
            id: loginData.user.id,
            name: 'fefetiii',
            email: testEmail,
            phone: '11988778877',
            created_at: new Date().toISOString()
          }]);
        
        if (createProfileError) {
          console.log('❌ Erro ao criar perfil:', createProfileError.message);
        } else {
          console.log('✅ Perfil criado com sucesso!');
        }
      } else {
        console.log('✅ Perfil encontrado na tabela profiles');
      }
      
      // Fazer logout
      await supabase.auth.signOut();
    }
    
    console.log('\n🎉 Agora tente fazer login novamente no navegador!');
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

checkAuthUser();
