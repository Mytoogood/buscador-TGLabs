import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase Admin com a chave de serviço
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co'
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY || 'sua-chave-de-servico-aqui'

// Criação do cliente admin Supabase
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    headers: {
      'X-Client-Info': 'julio-martins-site/admin'
    }
  }
})

export default supabaseAdmin
