// Script para criar um usuário de teste com email já confirmado
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw';

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createConfirmedUser() {
  console.log('🔄 Criando usuário de teste com email confirmado...\n');
  
  const testEmail = 'admin@teste.com';
  const testPassword = '123456';
  const testName = 'Administrador Teste';
  const testPhone = '11999999999';
  
  try {
    console.log('1. Tentando criar usuário...');
    
    // Criar usuário com confirmação automática (se possível)
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: testName,
          phone: testPhone
        },
        emailRedirectTo: undefined, // Remove redirecionamento
      }
    });
    
    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        console.log('ℹ️ Usuário já existe, tentando login...');
        
        // Tentar fazer login primeiro
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword
        });
        
        if (signInError) {
          console.log('⚠️ Erro no login, pode ser problema de confirmação de email');
          console.log('Erro:', signInError.message);
          
          // Vamos criar um usuário diferente para teste
          console.log('\n2. Tentando criar usuário alternativo...');
          const altEmail = `teste${Date.now()}@exemplo.com`;
          
          const { data: altSignUp, error: altError } = await supabase.auth.signUp({
            email: altEmail,
            password: testPassword,
            options: {
              data: {
                name: testName,
                phone: testPhone
              }
            }
          });
          
          if (altError) {
            console.error('❌ Erro ao criar usuário alternativo:', altError.message);
            return;
          }
          
          console.log('✅ Usuário alternativo criado!');
          console.log('Email:', altEmail);
          console.log('ID:', altSignUp.user.id);
          
          // Criar perfil
          await createProfile(altSignUp.user.id, testName, altEmail, testPhone);
          
          console.log('\n🎉 Use as seguintes credenciais:');
          console.log('Email:', altEmail);
          console.log('Senha:', testPassword);
          
        } else {
          console.log('✅ Login realizado com sucesso!');
          await createProfile(signInData.user.id, testName, testEmail, testPhone);
          
          console.log('\n🎉 Use as seguintes credenciais:');
          console.log('Email:', testEmail);
          console.log('Senha:', testPassword);
        }
      } else {
        console.error('❌ Erro ao criar usuário:', signUpError.message);
        return;
      }
    } else {
      console.log('✅ Usuário criado com sucesso!');
      console.log('ID do usuário:', signUpData.user.id);
      
      // Criar perfil
      await createProfile(signUpData.user.id, testName, testEmail, testPhone);
      
      console.log('\n🎉 Use as seguintes credenciais:');
      console.log('Email:', testEmail);
      console.log('Senha:', testPassword);
    }
    
    console.log('\n📝 Nota: Se houver erro de "Email not confirmed", você pode:');
    console.log('1. Desabilitar a confirmação de email no painel do Supabase');
    console.log('2. Usar o email de confirmação enviado');
    console.log('3. Usar as credenciais alternativas criadas');
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error.message);
  }
}

async function createProfile(userId, name, email, phone) {
  try {
    console.log('🔄 Criando perfil do usuário...');
    
    // Verificar se o perfil já existe
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (existingProfile) {
      console.log('ℹ️ Perfil já existe');
      return;
    }
    
    // Criar novo perfil
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        name: name,
        email: email,
        phone: phone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (profileError) {
      console.error('❌ Erro ao criar perfil:', profileError.message);
    } else {
      console.log('✅ Perfil criado com sucesso!');
    }
  } catch (error) {
    console.warn('⚠️ Erro ao criar perfil:', error.message);
  }
}

// Executar criação do usuário
createConfirmedUser();
