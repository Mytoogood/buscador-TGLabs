// Script para tentar fazer login diretamente
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Dados do usuário
const credentials = {
  email: 'felipecrs04@gmail.com',
  password: 'teste123'
};

// Função para fazer login
export async function loginUser() {
  try {
    console.log('Tentando fazer login...');
    
    // Tentar fazer login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      console.error('Erro ao fazer login:', error);
      console.log('Mensagem de erro:', error.message);
      console.log('Status:', error.status);
      return { success: false, error };
    }

    console.log('Login bem-sucedido!');
    console.log('Dados do usuário:', JSON.stringify(data.user, null, 2));
    console.log('Sessão:', JSON.stringify(data.session, null, 2));
    
    return { success: true, data };
  } catch (error) {
    console.error('Erro inesperado:', error);
    return { success: false, error };
  }
}

// Executar a função
loginUser().then(result => {
  if (!result.success) {
    console.log('Falha no login. Verifique suas credenciais e tente novamente.');
  }
});
