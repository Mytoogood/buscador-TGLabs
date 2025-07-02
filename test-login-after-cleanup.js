// Script para testar login após limpeza de duplicatas
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLoginAfterCleanup() {
  try {
    const userEmail = 'felipecrs04@gmail.com';
    const password = '123456'; // senha padrão
    
    console.log(`🔐 Testando login para: ${userEmail}`);
    
    // 1. Verificar se o profile existe
    console.log('\n1️⃣ Verificando se o profile existe...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', userEmail)
      .single();
    
    if (profileError) {
      if (profileError.code === 'PGRST116') {
        console.log('❌ Nenhum profile encontrado para este email');
        return;
      } else {
        console.error('❌ Erro ao buscar profile:', profileError);
        return;
      }
    }
    
    console.log('✅ Profile encontrado:');
    console.log(`   - ID: ${profile.id}`);
    console.log(`   - Nome: ${profile.name}`);
    console.log(`   - Email: ${profile.email}`);
    console.log(`   - Telefone: ${profile.phone}`);
    console.log(`   - Criado em: ${profile.created_at}`);
    
    // 2. Tentar fazer login
    console.log('\n2️⃣ Tentando fazer login...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: password
    });
    
    if (authError) {
      console.log('❌ Erro no login:', authError.message);
      
      if (authError.message.includes('Invalid login credentials')) {
        console.log('💡 Dica: A senha pode estar incorreta. Tente uma senha diferente ou redefina a senha.');
      }
      return;
    }
    
    console.log('✅ Login realizado com sucesso!');
    console.log(`   - User ID: ${authData.user.id}`);
    console.log(`   - Email: ${authData.user.email}`);
    
    // 3. Verificar se o ID do profile bate com o ID da autenticação
    console.log('\n3️⃣ Verificando consistência dos dados...');
    if (profile.id === authData.user.id) {
      console.log('✅ IDs batem perfeitamente! O sistema está funcionando corretamente.');
    } else {
      console.log('⚠️ AVISO: IDs não batem!');
      console.log(`   - Profile ID: ${profile.id}`);
      console.log(`   - Auth ID: ${authData.user.id}`);
      console.log('   - Isso pode indicar um problema de sincronização.');
    }
    
    // 4. Fazer logout
    console.log('\n4️⃣ Fazendo logout...');
    const { error: logoutError } = await supabase.auth.signOut();
    
    if (logoutError) {
      console.log('⚠️ Erro no logout:', logoutError.message);
    } else {
      console.log('✅ Logout realizado com sucesso!');
    }
    
    console.log('\n🎉 Teste concluído! O sistema está pronto para uso.');
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

async function testRegistrationPrevention() {
  try {
    console.log('\n\n🛡️ Testando prevenção de email duplicado...');
    
    const existingEmail = 'felipecrs04@gmail.com';
    
    // Tentar registrar com email que já existe
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: existingEmail,
      password: 'novaSenha123',
      options: {
        data: {
          name: 'Teste Duplicado',
          phone: '(11) 88888-8888'
        }
      }
    });
    
    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        console.log('✅ Sistema impediu registro com email duplicado (nível auth)');
      } else {
        console.log('ℹ️ Erro de registro:', signUpError.message);
      }
    } else if (signUpData?.user) {
      console.log('⚠️ Auth permitiu o registro, verificando se o profile será bloqueado...');
      
      // Tentar criar profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: signUpData.user.id,
          name: 'Teste Duplicado',
          email: existingEmail,
          phone: '(11) 88888-8888'
        }]);
      
      if (profileError) {
        if (profileError.code === '23505') { // Unique constraint violation
          console.log('✅ Constraint de banco impediu profile duplicado!');
        } else {
          console.log('❌ Erro inesperado ao criar profile:', profileError);
        }
      } else {
        console.log('❌ PROBLEMA: Profile duplicado foi criado!');
      }
    }
    
  } catch (error) {
    console.error('❌ Erro no teste de prevenção:', error);
  }
}

// Executar os testes
console.log('🧪 Iniciando testes do sistema após limpeza...');
await testLoginAfterCleanup();
await testRegistrationPrevention();
