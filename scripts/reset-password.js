// Script para redefinir a senha de um usuário no Supabase
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxODk1MTYxNiwiZXhwIjoyMDM0NTI3NjE2fQ.4j6z4N4YwJQZJqJQJQJQJQJQJQJQJQJQJQJQJQJQJQ';

// Criar cliente Supabase com permissões de serviço
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Função para redefinir a senha de um usuário
async function resetUserPassword(email, newPassword) {
  console.log(`\n🔑 Iniciando redefinição de senha para: ${email}`);
  
  try {
    // 1. Verificar se o usuário existe
    console.log('\n1. Verificando usuário...');
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers({
      filter: { email: email }
    });
    
    if (userError) {
      console.error('❌ Erro ao buscar usuário:', userError.message);
      return;
    }
    
    if (!userData.users || userData.users.length === 0) {
      console.log('❌ Nenhum usuário encontrado com este email.');
      return;
    }
    
    const user = userData.users[0];
    console.log(`✅ Usuário encontrado. ID: ${user.id}`);
    
    // 2. Atualizar a senha do usuário
    console.log('\n2. Atualizando senha...');
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );
    
    if (updateError) {
      console.error('❌ Erro ao atualizar senha:', updateError.message);
      return;
    }
    
    console.log('✅ Senha atualizada com sucesso!');
    console.log('\n🎉 Próximos passos:');
    console.log(`1. Tente fazer login com a nova senha: ${newPassword}`);
    console.log('2. Após o login, recomendamos alterar a senha nas configurações da sua conta.');
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

// Executar redefinição de senha
const userEmail = 'felipecrs04@gmail.com';
const newPassword = 'NovaSenha123!'; // Defina uma senha forte aqui

resetUserPassword(userEmail, newPassword);
