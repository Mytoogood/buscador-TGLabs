// Script para confirmar o email do usuário manualmente (apenas para desenvolvimento)
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Dados do usuário
const userEmail = 'felipecrs04@gmail.com';

// Função para confirmar o email do usuário
async function confirmUserEmail() {
  try {
    console.log('Buscando usuário...');
    
    // 1. Buscar o usuário pelo email
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', userEmail)
      .single();

    if (userError || !users) {
      console.error('Usuário não encontrado:', userError);
      return;
    }

    console.log('Usuário encontrado. ID:', users.id);
    
    // 2. Atualizar o status de confirmação do email
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ 
        email_confirmed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('email', userEmail)
      .select()
      .single();

    if (updateError) {
      console.error('Erro ao confirmar email:', updateError);
      return;
    }

    console.log('Email confirmado com sucesso para:', updatedUser.email);
    console.log('Tente fazer login novamente.');
    
  } catch (error) {
    console.error('Erro ao confirmar email:', error);
  }
}

// Executar a função
confirmUserEmail();
