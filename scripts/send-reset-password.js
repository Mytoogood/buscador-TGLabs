// Script para enviar email de redefinição de senha
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw';

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Função para enviar email de redefinição de senha
async function sendPasswordResetEmail(email) {
  console.log(`\n✉️  Enviando email de redefinição para: ${email}`);
  
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/update-password'
    });
    
    if (error) {
      console.error('❌ Erro ao enviar email:', error.message);
      return;
    }
    
    console.log('✅ Email de redefinição enviado com sucesso!');
    console.log('\n📧 Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.');
    console.log('Dica: Verifique também a pasta de spam caso não encontre o email.');
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

// Executar envio de email
const userEmail = 'felipecrs04@gmail.com';
sendPasswordResetEmail(userEmail);
