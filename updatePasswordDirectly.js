// Script para atualizar a senha diretamente
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseKey = 'SEU_SERVICE_ROLE_KEY_AQUI'; // Substitua pela sua service_role_key

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Dados do usuário
const userEmail = 'felipecrs04@gmail.com';
const newPassword = 'teste123';

// Função para atualizar a senha
async function updatePassword() {
  try {
    console.log('Atualizando senha...');
    
    // 1. Buscar o usuário pelo email
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', userEmail);

    if (userError || !users || users.length === 0) {
      console.error('Usuário não encontrado:', userError);
      return;
    }

    const user = users[0];
    console.log('Usuário encontrado:', user.id);
    
    // 2. Atualizar a senha diretamente (requer permissões de administrador)
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      password: newPassword
    });

    if (error) {
      console.error('Erro ao atualizar senha:', error);
      return;
    }

    console.log('Senha atualizada com sucesso!');
    console.log('Tente fazer login com a nova senha.');
    
  } catch (error) {
    console.error('Erro inesperado:', error);
  }
}

// Executar a função
updatePassword();
