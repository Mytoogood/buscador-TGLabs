// Script para criar a tabela clients via API REST do Supabase
import fetch from 'node-fetch'

const SUPABASE_URL = 'https://rtxrgqlhdbsztsbnycln.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw'

async function createTableViaAPI() {
  console.log('🔧 Tentando criar tabela via API REST...')
  
  // SQL para criar a tabela
  const sql = `
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
    
    ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Users can view all clients" ON public.clients
        FOR SELECT USING (auth.role() = 'authenticated');
    
    CREATE POLICY "Users can insert clients" ON public.clients
        FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    
    CREATE POLICY "Users can update clients" ON public.clients
        FOR UPDATE USING (auth.role() = 'authenticated');
    
    CREATE POLICY "Users can delete clients" ON public.clients
        FOR DELETE USING (auth.role() = 'authenticated');
  `

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({ sql: sql })
    })

    const result = await response.text()
    console.log('📋 Resposta da API:', result)

    if (response.ok) {
      console.log('✅ Tabela criada com sucesso!')
      return true
    } else {
      console.log('❌ Erro ao criar tabela via API')
      return false
    }
  } catch (error) {
    console.error('💥 Erro na requisição:', error.message)
    return false
  }
}

// Executar
createTableViaAPI()
  .then(success => {
    if (success) {
      console.log('🎉 Configuração concluída!')
    } else {
      console.log('⚠️ Use a configuração manual via painel do Supabase')
    }
  })
  .catch(console.error)
