// Script para verificar usuários na autenticação
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugAuthUsers() {
  try {
    const testEmail = 'ecoelho0100@gmail.com';
    
    console.log('🔍 Verificando estado atual...\n');
    
    // 1. Verificar tabela profiles
    console.log('1️⃣ Verificando tabela profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      console.error('❌ Erro ao verificar profiles:', profilesError);
    } else {
      console.log(`📊 Total de profiles: ${profiles.length}`);
      if (profiles.length > 0) {
        profiles.forEach((profile, index) => {
          console.log(`   ${index + 1}. ${profile.name} (${profile.email})`);
        });
      } else {
        console.log('   ✅ Tabela profiles está vazia');
      }
    }
    
    // 2. Tentar registrar o email problemático
    console.log('\n2️⃣ Testando registro do email...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: 'teste123456',
      options: {
        data: {
          name: 'Fee Test',
          phone: '11922332233'
        }
      }
    });
    
    if (signUpError) {
      console.log('❌ Erro no signup:', signUpError.message);
      
      if (signUpError.message.includes('already registered')) {
        console.log('⚠️ Email já está registrado no sistema de autenticação');
        console.log('💡 Tentando fazer login para confirmar...');
        
        // Tentar login para ver se o usuário existe
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: 'teste123456'
        });
        
        if (loginError) {
          console.log('❌ Login falhou:', loginError.message);
          console.log('💡 Usuário existe na auth mas senha é diferente');
        } else {
          console.log('✅ Login bem-sucedido!');
          console.log(`   - ID: ${loginData.user.id}`);
          console.log(`   - Email: ${loginData.user.email}`);
          
          // Fazer logout
          await supabase.auth.signOut();
        }
      }
    } else {
      console.log('✅ Registro bem-sucedido!');
      console.log(`   - ID: ${signUpData.user.id}`);
      console.log(`   - Email: ${signUpData.user.email}`);
      
      // Tentar criar profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: signUpData.user.id,
          name: 'Fee Test',
          email: testEmail,
          phone: '11922332233',
          created_at: new Date().toISOString()
        }]);
      
      if (profileError) {
        console.log('❌ Erro ao criar profile:', profileError.message);
      } else {
        console.log('✅ Profile criado com sucesso!');
      }
    }
    
    // 3. Verificar estado final
    console.log('\n3️⃣ Estado final da tabela profiles...');
    const { data: finalProfiles, error: finalError } = await supabase
      .from('profiles')
      .select('*');
    
    if (!finalError) {
      console.log(`📊 Total de profiles após teste: ${finalProfiles.length}`);
      finalProfiles.forEach((profile, index) => {
        console.log(`   ${index + 1}. ${profile.name} (${profile.email}) - ID: ${profile.id}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

debugAuthUsers();
