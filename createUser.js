// Script para criar um novo usuário
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Dados do usuário
const userData = {
  email: 'felipecrs04@gmail.com',
  password: 'teste123',
  name: 'Felipe',
  phone: '11999999999' // Número de telefone fictício para teste
};

// Função para criar o usuário
async function createUser() {
  try {
    console.log('Criando usuário...');
    
    // 1. Criar usuário no Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
          phone: userData.phone,
        },
        emailRedirectTo: 'http://localhost:3002/login', // URL para redirecionamento após confirmação
      },
    });

    if (authError) {
      console.error('Erro ao criar usuário no Auth:', authError);
      return;
    }


    console.log('Usuário criado com sucesso!');
    console.log('ID do usuário:', authData.user.id);
    console.log('Email de confirmação enviado para:', userData.email);
    
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
  }
}

// Executar a função
createUser();
