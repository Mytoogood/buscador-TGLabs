const axios = require('axios');

async function testLiveloAndAzulInterline() {
  try {
    console.log('🔍 Testando Livelo e Azul Interline individualmente...');
    
    // Primeiro, obter token de produção
    const tokenResponse = await axios.post('https://api.moblix.com.br/api/Token', {
      username: 'julio.martins@moblix.com.br',
      password: 'Moblix@2024'
    });
    
    const token = tokenResponse.data.access_token;
    console.log('✅ Token obtido:', token.substring(0, 50) + '...');

    const companies = [
      { id: 34, name: 'Livelo' },
      { id: 1200, name: 'Azul Interline' }
    ];

    for (const company of companies) {
      console.log(`\n📤 Testando ${company.name} (ID: ${company.id})...`);
      
      const searchData = {
        origem: 'GRU',
        destino: 'BSB',
        dataIda: '2025-05-10',
        dataVolta: null,
        adultos: 1,
        criancas: 0,
        bebes: 0,
        companhiaAerea: company.id,
        tipoBusca: 1
      };

      try {
        const response = await axios.post('https://api.moblix.com.br/api/ConsultaAereo/Consultar', searchData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log(`✅ ${company.name} - Status:`, response.status);
        console.log(`✅ ${company.name} - Dados:`, JSON.stringify(response.data, null, 2));
        
        // Verificar se há voos
        if (response.data && response.data.Data && response.data.Data.length > 0) {
          console.log(`✅ ${company.name} - Voo encontrado!`);
        } else if (response.data && response.data.Ida && response.data.Ida.length > 0) {
          console.log(`✅ ${company.name} - Voo encontrado (formato Ida)!`);
        } else {
          console.log(`❌ ${company.name} - Nenhum voo encontrado`);
        }
      } catch (error) {
        console.log(`❌ ${company.name} - Erro:`, error.response?.status, error.response?.statusText);
        if (error.response?.data) {
          console.log(`❌ ${company.name} - Detalhes:`, JSON.stringify(error.response.data, null, 2));
        }
      }
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    if (error.response) {
      console.error('❌ Status:', error.response.status);
      console.error('❌ Data:', error.response.data);
    }
  }
}

testLiveloAndAzulInterline(); 