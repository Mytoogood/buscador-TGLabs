
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
