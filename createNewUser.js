// Script para criar um novo usuário com confirmação de email
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Dados do novo usuário
const userData = {
  email: 'felipecrs04@gmail.com',
  password: 'teste123',
  name: 'Felipe',
  phone: '11999999999'
};

// Função para criar um novo usuário
async function createNewUser() {
  try {
    console.log('Criando novo usuário...');
    
    // 1. Criar o usuário
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
          phone: userData.phone,
        },
        emailRedirectTo: 'http://localhost:3002/login',
      },
    });

    if (error) {
      console.error('Erro ao criar usuário:', error);
      return { success: false, error };
    }

    console.log('Usuário criado com sucesso!');
    console.log('ID do usuário:', data.user.id);
    console.log('Email de confirmação enviado para:', data.user.email);
    
    // 2. Como não podemos confirmar o email automaticamente em produção,
    // vamos tentar fazer login para ver se o usuário foi criado
    console.log('\nTentando fazer login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password: userData.password,
    });

    if (loginError) {
      console.error('Erro ao fazer login:', loginError);
      console.log('\nPor favor, verifique seu email para confirmar o cadastro.');
      console.log('Se não encontrar o email, verifique a pasta de spam.');
      return { success: false, error: loginError };
    }

    console.log('\nLogin bem-sucedido!');
    console.log('Dados do usuário:', JSON.stringify(loginData.user, null, 2));
    
    return { success: true, data };
  } catch (error) {
    console.error('Erro inesperado:', error);
    return { success: false, error };
  }
}

// Executar a função
createNewUser().then(result => {
  if (!result.success) {
    console.log('\nSe você já tem uma conta, tente redefinir sua senha.');
    console.log('Se o problema persistir, entre em contato com o suporte.');
  }
});
