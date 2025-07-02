// Script para corrigir inconsistência no perfil
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixProfileInconsistency() {
  try {
    const userId = '766b3458-0893-43df-9c69-a6f0fa5b2eb1';
    const email = 'baraa.sariel@msitip.com';
    
    console.log('🔧 Corrigindo inconsistência no perfil...');
    console.log(`   - ID: ${userId}`);
    console.log(`   - Email: ${email}`);
    
    // 1. Verificar se já existe perfil com este ID
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId);
    
    if (checkError) {
      console.error('❌ Erro ao verificar perfil existente:', checkError);
      return;
    }
    
    if (existingProfile && existingProfile.length > 0) {
      console.log('✅ Perfil já existe na tabela profiles');
      console.log(`   - Nome: ${existingProfile[0].name}`);
      console.log(`   - Email: ${existingProfile[0].email}`);
      console.log('🎉 O usuário pode fazer login normalmente!');
    } else {
      console.log('❌ Perfil não existe, criando...');
      
      // 2. Criar o perfil
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([{
          id: userId,
          name: 'fefetiii',
          email: email,
          phone: '11988778877',
          created_at: new Date().toISOString()
        }]);
      
      if (createError) {
        console.error('❌ Erro ao criar perfil:', createError);
      } else {
        console.log('✅ Perfil criado com sucesso!');
      }
    }
    
    console.log('\n🎯 Agora tente fazer login com:');
    console.log(`   📧 Email: ${email}`);
    console.log(`   🔐 Senha: 123456789`);
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

fixProfileInconsistency();
