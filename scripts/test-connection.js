// Script para testar a conexão com o Supabase
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw';

async function testConnection() {
  try {
    console.log('Testando conexão com o Supabase...');
    
    // Criar cliente
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Testar conexão com a API de autenticação
    console.log('\nTestando autenticação...');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Erro na autenticação:', sessionError);
    } else {
      console.log('✅ Conexão com autenticação bem-sucedida');
      console.log('Sessão atual:', sessionData.session ? 'Ativa' : 'Nenhuma sessão ativa');
    }
    
    // Testar conexão com o banco de dados
    console.log('\nTestando conexão com o banco de dados...');
    const { data: tableData, error: tableError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('Erro ao acessar a tabela profiles:', tableError);
      
      // Verificar se a tabela não existe
      if (tableError.code === '42P01') {
        console.log('\n⚠️  A tabela profiles não existe. Você precisa criá-la.');
        console.log('Execute o seguinte SQL no editor SQL do Supabase:');
        console.log(`
        create table if not exists public.profiles (
          id uuid references auth.users on delete cascade not null primary key,
          name text,
          email text,
          phone text,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null,
          updated_at timestamp with time zone default timezone('utc'::text, now()) not null
        );
        
        -- Habilita RLS
        alter table public.profiles enable row level security;
        
        -- Políticas de segurança
        create policy "Os usuários podem ver seus próprios perfis"
          on public.profiles for select
          using (auth.uid() = id);
          
        create policy "Os usuários podem inserir seus próprios perfis"
          on public.profiles for insert
          with check (auth.uid() = id);
          
        create policy "Os usuários podem atualizar seus próprios perfis"
          on public.profiles for update
          using (auth.uid() = id);
        `);
      }
    } else {
      console.log('✅ Conexão com o banco de dados bem-sucedida');
      console.log(`Perfis encontrados: ${tableData.length}`);
      if (tableData.length > 0) {
        console.log('Exemplo de perfil:', tableData[0]);
      }
    }
    
    // Verificar se há usuários cadastrados
    console.log('\nVerificando usuários...');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('Erro ao listar usuários:', usersError);
    } else {
      console.log(`Total de usuários: ${users.users.length}`);
      if (users.users.length > 0) {
        console.log('\nUsuários encontrados:');
        users.users.forEach((user, index) => {
          console.log(`\nUsuário ${index + 1}:`);
          console.log(`- ID: ${user.id}`);
          console.log(`- Email: ${user.email}`);
          console.log(`- Último login: ${user.last_sign_in_at || 'Nunca'}`);
          console.log(`- Email confirmado: ${user.email_confirmed_at ? 'Sim' : 'Não'}`);
        });
      } else {
        console.log('Nenhum usuário cadastrado.');
      }
    }
    
  } catch (error) {
    console.error('Erro ao testar conexão:', error);
  }
}

testConnection();
