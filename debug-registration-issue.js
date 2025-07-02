// Script para debugar problema de registro
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugRegistrationIssue() {
  try {
    const testEmail = 'felipe.coelho@toogoodlabs.com';
    
    console.log('🔍 Debugando problema de registro...\n');
    
    // 1. Verificar se o email já existe na tabela profiles
    console.log('1️⃣ Verificando se email existe na tabela profiles...');
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', testEmail);
    
    if (profileCheckError) {
      console.error('❌ Erro ao verificar profiles:', profileCheckError);
    } else {
      console.log(`📋 Profiles encontrados: ${existingProfile.length}`);
      if (existingProfile.length > 0) {
        existingProfile.forEach((profile, index) => {
          console.log(`   ${index + 1}. ID: ${profile.id} | Nome: ${profile.name}`);
        });
      }
    }
    
    // 2. Verificar se o email já existe na autenticação
    console.log('\n2️⃣ Testando criação de usuário na autenticação...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: 'teste123456',
      options: {
        data: {
          name: 'Too Good',
          phone: '11988226617'
        }
      }
    });
    
    if (authError) {
      console.log('❌ Erro na autenticação:', authError.message);
      if (authError.message.includes('already registered')) {
        console.log('ℹ️ Email já está registrado na autenticação');
      }
    } else if (authData?.user) {
      console.log('✅ Usuário criado na autenticação');
      console.log(`   - ID: ${authData.user.id}`);
      console.log(`   - Email: ${authData.user.email}`);
      
      // 3. Tentar criar profile
      console.log('\n3️⃣ Tentando criar profile...');
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          name: 'Too Good',
          email: testEmail,
          phone: '11988226617',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (profileError) {
        console.error('❌ Erro ao criar profile:', profileError);
        
        if (profileError.code === '23505') {
          console.log('🔍 Analisando constraint violation...');
          
          // Verificar se o ID já existe
          const { data: existingIdProfile, error: idCheckError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id);
          
          if (!idCheckError && existingIdProfile.length > 0) {
            console.log(`⚠️ ID ${authData.user.id} já existe na tabela profiles!`);
            console.log('   Profile existente:', existingIdProfile[0]);
          }
        }
      } else {
        console.log('✅ Profile criado com sucesso:', profileData);
      }
    }
    
    // 4. Listar todos os profiles para debug
    console.log('\n4️⃣ Estado atual da tabela profiles:');
    const { data: allProfiles, error: listError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (listError) {
      console.error('❌ Erro ao listar profiles:', listError);
    } else {
      console.log(`📊 Total de profiles: ${allProfiles.length}`);
      allProfiles.forEach((profile, index) => {
        console.log(`${index + 1}. ${profile.name} (${profile.email}) - ID: ${profile.id}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

debugRegistrationIssue();
