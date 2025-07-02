import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://rtxrgqlhdbsztsbnycln.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function checkTableStatus() {
  console.log('🔍 Verificando status da tabela clients...')
  
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .limit(5)

    if (error) {
      if (error.code === '42P01') {
        console.log('❌ Tabela clients ainda não existe')
        console.log('📋 Execute o SQL no painel do Supabase:')
        console.log('🔗 https://supabase.com/dashboard/project/rtxrgqlhdbsztsbnycln/sql/new')
        return false
      } else {
        console.log('⚠️ Erro inesperado:', error.message)
        return false
      }
    }

    console.log('✅ SUCESSO! Tabela clients existe e está funcionando!')
    console.log(`📊 Registros encontrados: ${data?.length || 0}`)
    
    if (data && data.length > 0) {
      console.log('\n👥 Clientes na tabela:')
      data.forEach((client, index) => {
        console.log(`${index + 1}. ${client.name} (${client.email})`)
      })
    }

    console.log('\n🎉 CONFIGURAÇÃO COMPLETA!')
    console.log('✨ A funcionalidade "Adicionar Cliente" está pronta para uso!')
    console.log('🔗 Teste agora: http://localhost:3000/dashboard/clients/new')
    
    return true

  } catch (error) {
    console.error('💥 Erro ao verificar tabela:', error.message)
    return false
  }
}

// Função para monitorar continuamente
async function monitorTable() {
  let attempts = 0
  const maxAttempts = 30 // 5 minutos (30 * 10 segundos)
  
  console.log('👀 Monitorando criação da tabela clients...')
  console.log('⏰ Verificando a cada 10 segundos...\n')
  
  const interval = setInterval(async () => {
    attempts++
    console.log(`📊 Tentativa ${attempts}/${maxAttempts}`)
    
    const success = await checkTableStatus()
    
    if (success) {
      clearInterval(interval)
      console.log('\n🎯 Monitoramento concluído com sucesso!')
      process.exit(0)
    }
    
    if (attempts >= maxAttempts) {
      clearInterval(interval)
      console.log('\n⏰ Timeout atingido. Verifique manualmente.')
      console.log('🔄 Execute novamente: node check-table-status.js')
      process.exit(1)
    }
    
    console.log('⏳ Aguardando 10 segundos...\n')
  }, 10000) // 10 segundos
}

// Verificar uma vez primeiro
const command = process.argv[2]

if (command === 'monitor') {
  monitorTable()
} else {
  checkTableStatus()
    .then(success => {
      if (success) {
        console.log('\n💡 Para monitorar continuamente: node check-table-status.js monitor')
      } else {
        console.log('\n💡 Para monitorar criação: node check-table-status.js monitor')
      }
    })
    .catch(console.error)
}
