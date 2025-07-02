// Script para remover email específico: baraa.sariel@msitip.com
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function removeBaraaEmail() {
  try {
    const emailToRemove = 'baraa.sariel@msitip.com';
    
    console.log('🗑️ Removendo email:', emailToRemove);
    
    // Remover da tabela profiles
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('email', emailToRemove);
    
    if (deleteError) {
      console.error('❌ Erro ao remover perfil:', deleteError);
      return;
    }
    
    console.log('✅ Email removido com sucesso!');
    console.log('🎉 Agora você pode cadastrar novamente com este email!');
    
    // Verificar se foi removido
    const { data: verification, error: verifyError } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', emailToRemove);
    
    if (!verifyError && verification.length === 0) {
      console.log('✅ Confirmado: Email não existe mais na base de dados');
    }
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

removeBaraaEmail();
