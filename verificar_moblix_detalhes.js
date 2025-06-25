const axios = require('axios')

async function checkMoblixDetails() {
  console.log('🔍 Verificando detalhes do site Moblix...\n')
  
  try {
    const response = await axios.get('https://moblix.com', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    const html = response.data
    console.log('✅ Site moblix.com acessível!')
    console.log(`📄 Tamanho da resposta: ${html.length} caracteres`)
    
    // Procura por palavras-chave relacionadas a API
    const keywords = [
      'api', 'developer', 'signup', 'sign up', 'login', 'register',
      'dashboard', 'backend', 'mobile', 'service', 'documentation',
      'docs', 'getting started', 'console'
    ]
    
    console.log('\n🔍 Palavras-chave encontradas:')
    keywords.forEach(keyword => {
      const regex = new RegExp(keyword, 'gi')
      const matches = html.match(regex)
      if (matches) {
        console.log(`   ✅ "${keyword}": ${matches.length} ocorrências`)
      }
    })
    
    // Procura por links importantes
    const linkPatterns = [
      /href="[^"]*api[^"]*"/gi,
      /href="[^"]*developer[^"]*"/gi,
      /href="[^"]*signup[^"]*"/gi,
      /href="[^"]*login[^"]*"/gi,
      /href="[^"]*dashboard[^"]*"/gi,
      /href="[^"]*console[^"]*"/gi,
      /href="[^"]*docs[^"]*"/gi
    ]
    
    console.log('\n🔗 Links importantes encontrados:')
    linkPatterns.forEach(pattern => {
      const matches = html.match(pattern)
      if (matches) {
        matches.slice(0, 3).forEach(match => {
          console.log(`   🔗 ${match}`)
        })
      }
    })
    
    // Verifica se parece ser uma empresa de tecnologia
    const techKeywords = ['software', 'technology', 'platform', 'solution', 'service']
    const isTech = techKeywords.some(keyword => 
      html.toLowerCase().includes(keyword)
    )
    
    console.log(`\n🏢 Parece ser uma empresa de tecnologia: ${isTech ? 'SIM' : 'NÃO'}`)
    
    // Busca por informações de contato
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    const emails = html.match(emailPattern)
    
    if (emails) {
      console.log('\n📧 Emails encontrados:')
      const uniqueEmails = Array.from(new Set(emails))
      uniqueEmails.slice(0, 5).forEach(email => {
        console.log(`   📧 ${email}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Erro ao acessar moblix.com:', error.message)
  }
}

checkMoblixDetails().catch(console.error)

