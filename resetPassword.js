// Script para redefinir a senha do usuário
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Dados do usuário
const userEmail = 'felipecrs04@gmail.com';
const newPassword = 'teste123';

// Função para redefinir a senha
async function resetUserPassword() {
  try {
    console.log('Solicitando redefinição de senha...');
    
    // 1. Enviar email de redefinição de senha
    const { data, error } = await supabase.auth.resetPasswordForEmail(userEmail, {
      redirectTo: 'http://localhost:3002/update-password',
    });

    if (error) {
      console.error('Erro ao solicitar redefinição de senha:', error);
      return { success: false, error };
    }

    console.log('Email de redefinição de senha enviado para:', userEmail);
    console.log('Por favor, verifique seu email e siga as instruções para redefinir sua senha.');
    
    return { success: true, data };
  } catch (error) {
    console.error('Erro inesperado:', error);
    return { success: false, error };
  }
}

// Executar a função
resetUserPassword().then(result => {
  if (!result.success) {
    console.log('\nSe você não receber o email, verifique a pasta de spam ou tente novamente mais tarde.');
  }
});
