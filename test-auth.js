// Teste do sistema de autenticação
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw';

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuth() {
  console.log('🔄 Testando sistema de autenticação...\n');
  
  // Credenciais de teste
  const testEmail = 'teste@teste.com';
  const testPassword = 'senha123';
  
  try {
    // 1. Verificar se o usuário existe
    console.log('1. Verificando se o usuário existe...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    if (signInError) {
      if (signInError.message.includes('Invalid login credentials')) {
        console.log('❌ Usuário não encontrado ou senha incorreta');
        console.log('🔄 Tentando criar usuário...');
        
        // 2. Criar usuário se não existir
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: testEmail,
          password: testPassword,
          options: {
            data: {
              name: 'Usuário Teste',
              phone: '11999999999'
            }
          }
        });
        
        if (signUpError) {
          console.error('❌ Erro ao criar usuário:', signUpError.message);
          return;
        }
        
        console.log('✅ Usuário criado com sucesso!');
        console.log('ID do usuário:', signUpData.user.id);
        
        // 3. Criar perfil na tabela profiles
        console.log('🔄 Criando perfil...');
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: signUpData.user.id,
            name: 'Usuário Teste',
            email: testEmail,
            phone: '11999999999',
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
        
      } else {
        throw signInError;
      }
    } else {
      console.log('✅ Login realizado com sucesso!');
      console.log('ID do usuário:', signInData.user.id);
      console.log('Email:', signInData.user.email);
      
      // 4. Verificar se o perfil existe
      console.log('\n2. Verificando perfil do usuário...');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', signInData.user.id)
        .single();
      
      if (profileError) {
        console.log('⚠️ Perfil não encontrado, criando...');
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: signInData.user.id,
            name: 'Usuário Teste',
            email: testEmail,
            phone: '11999999999',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
          
        if (createError) {
          console.error('❌ Erro ao criar perfil:', createError.message);
        } else {
          console.log('✅ Perfil criado com sucesso!');
        }
      } else {
        console.log('✅ Perfil encontrado!');
        console.log('Nome:', profile.name);
        console.log('Email:', profile.email);
        console.log('Telefone:', profile.phone);
      }
    }
    
    console.log('\n🎉 Sistema de autenticação configurado com sucesso!');
    console.log('📋 Credenciais para teste:');
    console.log('Email:', testEmail);
    console.log('Senha:', testPassword);
    console.log('\n🌐 Acesse: http://localhost:3001/login');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

// Executar teste
testAuth();
