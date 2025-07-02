#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configurações do Supabase
const SUPABASE_URL = 'https://rtxrgqlhdbsztsbnycln.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw'

// Criar cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Comandos disponíveis
const commands = {
  'create-clients-table': createClientsTable,
  'check-table': checkTable,
  'list-tables': listTables,
  'insert-test-client': insertTestClient,
  'list-clients': listClients,
  'help': showHelp
}

async function createClientsTable() {
  console.log('🔧 Criando tabela clients...')
  
  try {
    // Primeiro, verificar se já existe
    const checkResult = await checkTable()
    if (checkResult) {
      console.log('✅ Tabela clients já existe!')
      return true
    }

    // Como não podemos executar DDL via cliente JS, vamos criar via inserção forçada
    console.log('📝 Tentando criar estrutura da tabela...')
    
    // Tentar inserir um registro que forçará a criação da tabela se ela não existir
    // Isso só funciona se a tabela já tiver sido criada no painel
    const { data, error } = await supabase
      .from('clients')
      .insert([{
        name: 'Cliente Teste MCP',
        email: 'mcp-test@exemplo.com',
        phone: '(11) 99999-9999',
        cpf: '000.000.000-00',
        city: 'São Paulo',
        state: 'SP',
        notes: 'Cliente criado via MCP para testar a tabela'
      }])
      .select()

    if (error) {
      if (error.code === '42P01') {
        console.log('❌ Tabela não existe. Execute o SQL manualmente:')
        console.log('\n' + '='.repeat(60))
        
        const sqlContent = readFileSync(join(__dirname, 'create-clients-table.sql'), 'utf8')
        console.log(sqlContent)
        console.log('='.repeat(60))
        
        console.log('\n📋 PASSOS:')
        console.log('1. Acesse https://supabase.com/dashboard')
        console.log('2. Selecione seu projeto')
        console.log('3. Vá em SQL Editor')
        console.log('4. Cole e execute o SQL acima')
        
        return false
      } else {
        throw error
      }
    }

    console.log('✅ Tabela clients criada e testada com sucesso!')
    console.log('📄 Cliente de teste inserido:', data)
    return true

  } catch (error) {
    console.error('❌ Erro:', error.message)
    return false
  }
}

async function checkTable() {
  console.log('🔍 Verificando tabela clients...')
  
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .limit(1)

    if (error) {
      if (error.code === '42P01') {
        console.log('❌ Tabela clients não existe')
        return false
      }
      throw error
    }

    console.log('✅ Tabela clients existe e está funcionando!')
    console.log(`📊 Estrutura verificada, registros encontrados: ${data?.length || 0}`)
    return true

  } catch (error) {
    console.error('❌ Erro ao verificar tabela:', error.message)
    return false
  }
}

async function listTables() {
  console.log('📋 Listando tabelas disponíveis...')
  
  try {
    // Como não temos acesso direto ao schema, vamos tentar algumas tabelas conhecidas
    const tables = ['clients', 'profiles', 'users']
    const results = []

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1)

        if (!error) {
          results.push(`✅ ${table}`)
        }
      } catch (err) {
        results.push(`❌ ${table} (não existe ou sem acesso)`)
      }
    }

    console.log('\n📊 Tabelas encontradas:')
    results.forEach(result => console.log(`  ${result}`))

  } catch (error) {
    console.error('❌ Erro ao listar tabelas:', error.message)
  }
}

async function insertTestClient() {
  console.log('➕ Inserindo cliente de teste...')
  
  try {
    const { data, error } = await supabase
      .from('clients')
      .insert([{
        name: 'João Silva',
        email: `teste-${Date.now()}@exemplo.com`,
        phone: '(11) 98765-4321',
        cpf: '123.456.789-00',
        birth_date: '1990-01-15',
        address: 'Rua Teste, 123',
        city: 'São Paulo',
        state: 'SP',
        cep: '01234-567',
        notes: 'Cliente de teste inserido via MCP'
      }])
      .select()

    if (error) {
      throw error
    }

    console.log('✅ Cliente de teste inserido com sucesso!')
    console.log('📄 Dados:', data[0])

  } catch (error) {
    console.error('❌ Erro ao inserir cliente:', error.message)
  }
}

async function listClients() {
  console.log('👥 Listando clientes...')
  
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      throw error
    }

    if (!data || data.length === 0) {
      console.log('📋 Nenhum cliente encontrado')
      return
    }

    console.log(`\n👥 ${data.length} cliente(s) encontrado(s):\n`)
    
    data.forEach((client, index) => {
      console.log(`${index + 1}. ${client.name}`)
      console.log(`   📧 ${client.email}`)
      console.log(`   📞 ${client.phone || 'N/A'}`)
      console.log(`   📍 ${client.city || 'N/A'}, ${client.state || 'N/A'}`)
      console.log(`   📅 Criado em: ${new Date(client.created_at).toLocaleDateString('pt-BR')}`)
      console.log('')
    })

  } catch (error) {
    console.error('❌ Erro ao listar clientes:', error.message)
  }
}

function showHelp() {
  console.log(`
🔧 Supabase MCP CLI - Comandos Disponíveis:

📋 COMANDOS:
  create-clients-table  - Criar/verificar tabela de clientes
  check-table          - Verificar se a tabela clients existe
  list-tables          - Listar tabelas disponíveis
  insert-test-client   - Inserir um cliente de teste
  list-clients         - Listar todos os clientes
  help                 - Mostrar esta ajuda

💡 EXEMPLOS:
  node supabase-cli.js create-clients-table
  node supabase-cli.js check-table
  node supabase-cli.js list-clients

🔗 PROJETO: rtxrgqlhdbsztsbnycln.supabase.co
`)
}

// Executar comando
async function main() {
  const command = process.argv[2]
  
  if (!command || !commands[command]) {
    console.log('❌ Comando inválido ou não especificado\n')
    showHelp()
    process.exit(1)
  }

  console.log(`🚀 Executando: ${command}\n`)
  
  try {
    await commands[command]()
  } catch (error) {
    console.error('💥 Erro fatal:', error.message)
    process.exit(1)
  }
}

// Executar
main().catch(console.error)
