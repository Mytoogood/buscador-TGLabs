// Script para remover usuário da autenticação
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseServiceKey = 'your-service-role-key';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function removeAuthUser(email) {
  try {
    console.log(`Removendo usuário da autenticação: ${email}`);
    
    const { data, error } = await supabase.auth.api.deleteUserByEmail(email);
    
    if (error) {
      console.error('Erro ao remover usuário:', error.message);
    } else {
      console.log('Usuário removido com sucesso:', data);
    }
  } catch (err) {
    console.error('Erro inesperado:', err);
  }
}

removeAuthUser('ecoelho0100@gmail.com');
