import { createClient } from '@supabase/supabase-js'

// Configurações do Supabase
const SUPABASE_URL = 'https://rtxrgqlhdbsztsbnycln.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw'

// Primeiro vamos tentar criar usando uma abordagem de inserção que forçará a exibição do erro completo
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function attemptTableCreation() {
  console.log('🔧 Tentando configurar tabela clients...')
  
  try {
    // Primeiro, vamos verificar se a tabela profiles existe (que sabemos que existe)
    console.log('🔍 Testando conexão com tabela profiles...')
    const { data: profileTest, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
    
    if (profileError) {
      console.log('❌ Erro ao acessar profiles:', profileError.message)
    } else {
      console.log('✅ Conexão com Supabase funcionando!')
    }

    // Agora vamos tentar acessar a tabela clients
    console.log('🔍 Verificando tabela clients...')
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .limit(1)

    if (!error) {
      console.log('✅ Tabela clients já existe!')
      console.log(`📊 Registros encontrados: ${data?.length || 0}`)
      return true
    }

    // Se chegou aqui, a tabela não existe
    console.log('📋 Detalhes do erro:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint
    })

    if (error.code === '42P01') {
      console.log('\n❌ Confirmado: Tabela clients não existe')
      console.log('\n🔧 CONFIGURAÇÃO NECESSÁRIA:')
      console.log('A tabela precisa ser criada manualmente no painel do Supabase.')
      console.log('\n📋 PASSOS PARA CONFIGURAR:')
      console.log('1. 🌐 Acesse: https://supabase.com/dashboard')
      console.log('2. 🎯 Selecione seu projeto: rtxrgqlhdbsztsbnycln')
      console.log('3. 📝 Vá em "SQL Editor" no menu lateral')
      console.log('4. 📋 Cole e execute este SQL:')
      console.log('\n' + '='.repeat(80))
      
      const sql = `
-- Criar tabela de clientes
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    cpf VARCHAR(14),
    birth_date DATE,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(2),
    cep VARCHAR(9),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Configurar Row Level Security (RLS)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários autenticados vejam todos os clientes
CREATE POLICY "Users can view all clients" ON public.clients
    FOR SELECT USING (auth.role() = 'authenticated');

-- Política para permitir que usuários autenticados insiram clientes
CREATE POLICY "Users can insert clients" ON public.clients
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para permitir que usuários autenticados atualizem clientes
CREATE POLICY "Users can update clients" ON public.clients
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Política para permitir que usuários autenticados deletem clientes
CREATE POLICY "Users can delete clients" ON public.clients
    FOR DELETE USING (auth.role() = 'authenticated');

-- Inserir um cliente de teste
INSERT INTO public.clients (name, email, phone, cpf, city, state, notes)
VALUES (
    'Cliente Teste',
    'teste@exemplo.com',
    '(11) 99999-9999',
    '000.000.000-00',
    'São Paulo',
    'SP',
    'Cliente de teste criado durante a configuração'
)
ON CONFLICT (email) DO NOTHING;
`
      
      console.log(sql)
      console.log('='.repeat(80))
      console.log('\n5. ✅ Clique em "RUN" para executar')
      console.log('6. 🔄 Execute este script novamente: node create-table-admin.js')
      console.log('\n🎯 Após a configuração, teste em: http://localhost:3000/dashboard/clients/new')
      
      return false
    } else {
      console.log('❌ Erro inesperado:', error.message)
      return false
    }

  } catch (error) {
    console.error('💥 Erro fatal:', error.message)
    return false
  }
}

// Executar
console.log('🚀 Iniciando configuração do banco de dados...\n')
attemptTableCreation()
  .then(success => {
    if (success) {
      console.log('\n🎉 Configuração concluída com sucesso!')
      console.log('✨ A funcionalidade "Adicionar Cliente" está pronta!')
      console.log('🔗 Teste agora: http://localhost:3000/dashboard/clients/new')
    } else {
      console.log('\n⚠️  Configuração manual necessária.')
      console.log('   Siga as instruções acima para completar a configuração.')
    }
  })
  .catch(error => {
    console.error('\n💥 Erro fatal:', error)
  })
