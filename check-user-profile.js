// Script para verificar dados específicos de um usuário
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUserProfile() {
  try {
    const userEmail = 'felipecrs04@gmail.com';
    
    console.log(`Verificando dados do usuário: ${userEmail}`);
    
    // Buscar todos os profiles para debug
    const { data: allProfiles, error: allError } = await supabase
      .from('profiles')
      .select('*');
    
    if (allError) {
      console.error('Erro ao buscar todos os profiles:', allError);
      return;
    }
    
    console.log(`\nTotal de profiles na tabela: ${allProfiles.length}`);
    
    if (allProfiles.length > 0) {
      console.log('\nTodos os profiles:');
      allProfiles.forEach((profile, index) => {
        console.log(`${index + 1}. ID: ${profile.id}, Email: ${profile.email}, Nome: ${profile.name}`);
      });
    }
    
    // Buscar especificamente o usuário pelo email
    const { data: userProfile, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', userEmail)
      .single();
    
    if (userError) {
      if (userError.code === 'PGRST116') {
        console.log(`\n❌ Nenhum profile encontrado para o email: ${userEmail}`);
      } else {
        console.error('Erro ao buscar profile do usuário:', userError);
      }
      return;
    }
    
    console.log(`\n✅ Profile encontrado para ${userEmail}:`);
    console.log('Dados do perfil:');
    console.log(JSON.stringify(userProfile, null, 2));
    
    // Tentar fazer login para obter o ID do usuário autenticado
    console.log('\n🔐 Testando autenticação...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: '123456' // senha padrão que costumamos usar
    });
    
    if (authError) {
      console.log('❌ Erro na autenticação:', authError.message);
      console.log('Pode ser que a senha esteja diferente ou o usuário não exista na autenticação.');
    } else {
      console.log('✅ Autenticação bem-sucedida!');
      console.log('ID do usuário autenticado:', authData.user.id);
      console.log('Email do usuário autenticado:', authData.user.email);
      
      // Verificar se o ID do profile bate com o ID da autenticação
      if (userProfile.id === authData.user.id) {
        console.log('✅ IDs batem! O profile está correto.');
      } else {
        console.log('⚠️ PROBLEMA: IDs não batem!');
        console.log(`Profile ID: ${userProfile.id}`);
        console.log(`Auth ID: ${authData.user.id}`);
      }
    }
    
  } catch (error) {
    console.error('Erro inesperado:', error);
  }
}

checkUserProfile();
