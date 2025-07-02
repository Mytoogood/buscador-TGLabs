// Script para testar o fluxo de registro
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRegistrationFlow() {
  try {
    const testEmail = 'maximillion.kieren@msitip.com';
    
    console.log('🧪 Testando fluxo de registro...\n');
    
    // 1. Verificar estado inicial
    console.log('1️⃣ Verificando estado inicial...');
    
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      console.error('❌ Erro ao verificar profiles:', profilesError);
    } else {
      console.log(`📊 Total de profiles: ${profiles.length}`);
      profiles.forEach((profile, index) => {
        console.log(`   ${index + 1}. ${profile.name} (${profile.email})`);
      });
    }
    
    const { data: authCount } = await supabase.auth.getSession();
    console.log(`👤 Sessão atual: ${authCount?.session ? 'ativa' : 'inativa'}`);
    
    // 2. Tentar SignUp
    console.log('\n2️⃣ Tentando SignUp...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: 'teste123456',
      options: {
        data: {
          name: 'Teste User',
          phone: '11922332233'
        }
      }
    });
    
    if (signUpError) {
      console.log('❌ Erro no SignUp:', signUpError.message);
      
      if (signUpError.message.includes('already registered')) {
        console.log('⚠️ Email já registrado no sistema de autenticação');
        
        // Tentar login para confirmar
        console.log('\n3️⃣ Tentando login para confirmar...');
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: 'teste123456'
        });
        
        if (loginError) {
          console.log('❌ Login falhou:', loginError.message);
          console.log('💡 Email existe na auth mas senha é diferente ou há outro problema');
        } else {
          console.log('✅ Login bem-sucedido! Email realmente existe na auth');
          console.log(`   - ID: ${loginData.user.id}`);
          console.log(`   - Email: ${loginData.user.email}`);
          
          // Verificar se tem profile
          const { data: existingProfile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', loginData.user.id);
          
          if (profileError) {
            console.log('❌ Erro ao verificar profile:', profileError);
          } else {
            console.log(`📋 Profiles para este ID: ${existingProfile.length}`);
            if (existingProfile.length > 0) {
              console.log('   Profile existente:', existingProfile[0]);
            }
          }
          
          // Fazer logout
          await supabase.auth.signOut();
        }
      }
    } else {
      console.log('✅ SignUp bem-sucedido!');
      console.log(`   - ID: ${signUpData.user.id}`);
      console.log(`   - Email: ${signUpData.user.email}`);
      
      // Tentar criar profile
      console.log('\n3️⃣ Tentando criar profile...');
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: signUpData.user.id,
          name: 'Teste User',
          email: testEmail,
          phone: '11922332233',
          created_at: new Date().toISOString()
        }]);
      
      if (profileError) {
        console.log('❌ Erro ao criar profile:', profileError.message);
        
        if (profileError.code === '23505') {
          console.log('⚠️ Constraint violation - ID ou email já existe');
        }
      } else {
        console.log('✅ Profile criado com sucesso!');
      }
    }
    
    // 4. Estado final
    console.log('\n4️⃣ Estado final...');
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

testRegistrationFlow();
