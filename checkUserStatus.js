// Script para verificar o status do usuário no Supabase Auth
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Dados do usuário
const userEmail = 'felipecrs04@gmail.com';

// Função para verificar o status do usuário
async function checkUserStatus() {
  try {
    console.log('Verificando status do usuário...');
    
    // 1. Listar todos os usuários (requer permissões de administrador)
    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.error('Erro ao listar usuários:', error);
      return;
    }
    
    // 2. Encontrar o usuário pelo email
    const user = users.find(u => u.email === userEmail);
    
    if (!user) {
      console.log('Usuário não encontrado');
      return;
    }
    
    console.log('Status do usuário:');
    console.log('ID:', user.id);
    console.log('Email:', user.email);
    console.log('Email confirmado:', user.email_confirmed_at ? 'Sim' : 'Não');
    console.log('Último login:', user.last_sign_in_at);
    console.log('Criado em:', user.created_at);
    console.log('Dados completos:', JSON.stringify(user, null, 2));
    
  } catch (error) {
    console.error('Erro ao verificar status do usuário:', error);
  }
}

// Executar a função
checkUserStatus();
