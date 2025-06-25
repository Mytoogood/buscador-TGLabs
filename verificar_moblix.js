// Script para verificar a disponibilidade da Moblix API
const axios = require('axios')

const possibleUrls = [
  'https://moblix.com',
  'https://www.moblix.com',
  'https://api.moblix.com',
  'https://moblix.io',
  'https://moblix.dev',
  'https://getmoblix.com',
  'https://moblix.app'
]

async function checkMoblixAvailability() {
  console.log('🔍 Verificando disponibilidade da Moblix API...\n')
  
  for (const url of possibleUrls) {
    try {
      console.log(`Testando: ${url}`)
      
      const response = await axios.get(url, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })
      
      if (response.status === 200) {
        console.log(`✅ ${url} - DISPONÍVEL (Status: ${response.status})`)
        
        // Verifica se é uma página da Moblix
        const html = response.data.toLowerCase()
        if (html.includes('moblix') || html.includes('mobile backend') || html.includes('api')) {
          console.log(`   📋 Parece ser uma página oficial da Moblix`)
        }
      }
      
    } catch (error) {
      if (error.code === 'ENOTFOUND') {
        console.log(`❌ ${url} - NÃO ENCONTRADO (DNS não resolve)`)
      } else if (error.code === 'ECONNREFUSED') {
        console.log(`❌ ${url} - CONEXÃO RECUSADA`)
      } else if (error.response) {
        console.log(`⚠️  ${url} - Status: ${error.response.status}`)
      } else {
        console.log(`❌ ${url} - ERRO: ${error.message}`)
      }
    }
    
    console.log('') // Linha em branco para separar
  }
  
  console.log('\n📚 Alternativas recomendadas se Moblix não estiver disponível:')
  console.log('1. Firebase - https://firebase.google.com')
  console.log('2. Supabase - https://supabase.com')
  console.log('3. AWS Amplify - https://aws.amazon.com/amplify')
  console.log('4. Appwrite - https://appwrite.io')
}

// Executa a verificação
checkMoblixAvailability().catch(console.error)

