import { getSupabase } from '@/config/supabase'

// Função para configurar o banco de dados
export async function setupDatabase() {
  console.log('🔧 Configurando banco de dados...')
  
  const supabase = getSupabase()
  
  if (!supabase) {
    console.error('❌ Cliente Supabase não disponível')
    return { success: false, error: 'Cliente Supabase não disponível' }
  }

  try {
    // Testar se a tabela clients já existe tentando fazer uma consulta
    console.log('🔍 Verificando se a tabela clients existe...')
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .limit(1)

    if (error && error.code === '42P01') {
      // Tabela não existe, mostrar instruções para criação manual
      console.error('❌ Tabela "clients" não encontrada')
      
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

      return {
        success: false,
        error: 'Tabela não encontrada',
        instructions: {
          message: 'Execute este SQL no painel do Supabase para criar a tabela clients:',
          sql: sql,
          steps: [
            '1. Acesse https://supabase.com/dashboard',
            '2. Selecione seu projeto',
            '3. Vá em "SQL Editor" no menu lateral',
            '4. Cole e execute o SQL fornecido',
            '5. Recarregue a página'
          ]
        }
      }
    } else if (error) {
      console.error('❌ Erro ao verificar tabela:', error)
      return { success: false, error: error.message }
    } else {
      console.log('✅ Tabela clients encontrada e funcionando!')
      return { success: true, message: 'Banco de dados configurado corretamente' }
    }

  } catch (error) {
    console.error('❌ Erro durante verificação:', error)
    return { success: false, error: error.message }
  }
}

// Função para executar a configuração e mostrar resultado na UI
export async function setupDatabaseWithUI() {
  const result = await setupDatabase()
  
  if (result.success) {
    alert('✅ Banco de dados configurado com sucesso!\nA funcionalidade "Adicionar Cliente" está pronta para uso.')
    return true
  } else {
    if (result.instructions) {
      console.log('📋 INSTRUÇÕES PARA CONFIGURAÇÃO:')
      console.log(result.instructions.message)
      console.log('\nSQL para executar:')
      console.log(result.instructions.sql)
      console.log('\nPASSOS:')
      result.instructions.steps.forEach(step => console.log(step))
      
      // Mostrar instruções na UI
      const message = `${result.instructions.message}\n\nPASSOS:\n${result.instructions.steps.join('\n')}\n\nO SQL foi copiado para o console do navegador (F12 -> Console)`
      alert(message)
      
      // Copiar SQL para clipboard se possível
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(result.instructions.sql)
          console.log('📋 SQL copiado para a área de transferência!')
        } catch (err) {
          console.log('ℹ️ Não foi possível copiar automaticamente. Copie o SQL do console.')
        }
      }
    } else {
      alert(`❌ Erro: ${result.error}`)
    }
    return false
  }
}
