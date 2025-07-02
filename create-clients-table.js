import { createClient } from '@supabase/supabase-js'

// Configurações do Supabase (as mesmas do seu projeto)
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw'

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createClientsTable() {
  console.log('🔧 Configurando tabela de clientes no Supabase...')

  try {
    // Primeira tentativa: Verificar se a tabela já existe
    console.log('🔍 Verificando se a tabela clients já existe...')
    
    const { data: existingData, error: checkError } = await supabase
      .from('clients')
      .select('*')
      .limit(1)

    if (!checkError) {
      console.log('✅ Tabela clients já existe e está funcionando!')
      console.log('📱 A funcionalidade "Adicionar Cliente" está pronta para uso.')
      return true
    }

    if (checkError.code !== '42P01') {
      console.error('❌ Erro inesperado ao verificar tabela:', checkError)
      return false
    }

    console.log('📋 Tabela clients não existe. Criando...')

    // Como não podemos executar DDL diretamente via cliente JavaScript,
    // vamos criar um registro de teste que forçará o Supabase a criar a estrutura
    // se ela for criada via painel administrativo

    console.log('⚠️  AÇÃO NECESSÁRIA: A tabela precisa ser criada manualmente no painel do Supabase.')
    console.log('')
    console.log('📋 INSTRUÇÕES PARA CONFIGURAÇÃO:')
    console.log('1. Acesse: https://supabase.com/dashboard')
    console.log('2. Selecione seu projeto: rtxrgqlhdbsztsbnycln')
    console.log('3. Vá em "SQL Editor" no menu lateral')
    console.log('4. Cole e execute o SQL abaixo:')
    console.log('')
    console.log('='.repeat(80))
    
    const sqlScript = `
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

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_name ON public.clients(name);
CREATE INDEX IF NOT EXISTS idx_clients_state ON public.clients(state);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON public.clients(created_at);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_clients_updated_at ON public.clients;
CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

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
`

    console.log(sqlScript)
    console.log('='.repeat(80))
    console.log('')
    console.log('5. Clique em "RUN" para executar o SQL')
    console.log('6. Aguarde a confirmação de que foi executado com sucesso')
    console.log('7. Execute novamente este script: node create-clients-table.js')
    console.log('')
    
    // Tentar salvar o SQL em um arquivo para facilitar
    try {
      const fs = await import('fs')
      fs.writeFileSync('create-clients-table.sql', sqlScript)
      console.log('📁 SQL salvo no arquivo: create-clients-table.sql')
      console.log('   Você pode abrir este arquivo e copiar o conteúdo para o Supabase.')
    } catch (err) {
      console.log('ℹ️  Copie o SQL acima manualmente.')
    }

    return false

  } catch (error) {
    console.error('💥 Erro durante a configuração:', error.message)
    return false
  }
}

// Executar a configuração
console.log('🚀 Iniciando configuração do banco de dados...')
createClientsTable()
  .then((success) => {
    if (success) {
      console.log('\n🎉 Configuração concluída com sucesso!')
      console.log('✨ A funcionalidade "Adicionar Cliente" está pronta para uso!')
      console.log('🔗 Acesse: http://localhost:3000/dashboard/clients/new')
    } else {
      console.log('\n⚠️  Configuração manual necessária.')
      console.log('   Siga as instruções acima para completar a configuração.')
    }
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Erro fatal:', error)
    process.exit(1)
  })
