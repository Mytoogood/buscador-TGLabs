// Script para listar usuários do Supabase (apenas para desenvolvimento)
import { createClient } from '@supabase/supabase-js';

// Substitua pelas suas credenciais do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg5NTE2MTYsImV4cCI6MjAzNDUyNzYxNn0.4j6z4N4YwJQZJqJQJQJQJQJQJQJQJQJQJQJQJQJQJQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function listUsers() {
  try {
    // Listar usuários autenticados (requer permissões de administrador)
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    
    if (error) throw error;
    
    console.log('Usuários cadastrados:');
    console.table(users.map(user => ({
      id: user.id,
      email: user.email,
      email_confirmed: user.email_confirmed_at ? 'Sim' : 'Não',
      created_at: new Date(user.created_at).toLocaleString('pt-BR'),
      last_sign_in: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('pt-BR') : 'Nunca'
    })));
    
    // Listar perfis
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*');
      
    if (profileError) throw profileError;
    
    console.log('\nPerfis na tabela profiles:');
    console.table(profiles);
    
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
  }
}

listUsers();
