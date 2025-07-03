const axios = require('axios');

async function testMultipleRoutes() {
  try {
    console.log('🔍 Testando múltiplas rotas e datas...');
    
    // Primeiro, obter token de produção
    const tokenResponse = await axios.post('https://api.moblix.com.br/api/Token', {
      username: 'julio.martins@moblix.com.br',
      password: 'Moblix@2024'
    });
    
    const token = tokenResponse.data.access_token;
    console.log('✅ Token obtido:', token.substring(0, 50) + '...');

    // Testar diferentes rotas e datas
    const testCases = [
      {
        origem: 'GRU',
        destino: 'BSB',
        dataIda: '2025-07-07',
        descricao: 'GRU → BSB (07/07/2025)'
      },
      {
        origem: 'GRU',
        destino: 'GIG',
        dataIda: '2025-07-07',
        descricao: 'GRU → GIG (07/07/2025)'
      },
      {
        origem: 'SAO',
        destino: 'REC',
        dataIda: '2025-07-07',
        descricao: 'SAO → REC (07/07/2025)'
      },
      {
        origem: 'SAO',
        destino: 'REC',
        dataIda: '2025-07-10',
        descricao: 'SAO → REC (10/07/2025)'
      },
      {
        origem: 'SAO',
        destino: 'REC',
        dataIda: '2025-07-15',
        descricao: 'SAO → REC (15/07/2025)'
      },
      {
        origem: 'SAO',
        destino: 'REC',
        dataIda: '2025-07-20',
        descricao: 'SAO → REC (20/07/2025)'
      }
    ];

    for (const testCase of testCases) {
      console.log(`\n📤 Testando: ${testCase.descricao}`);
      
      const searchData = {
        origem: testCase.origem,
        destino: testCase.destino,
        dataIda: testCase.dataIda,
        dataVolta: null,
        adultos: 1,
        criancas: 0,
        bebes: 0,
        companhiaAerea: null, // Todas as companhias
        tipoBusca: 1
      };

      try {
        const response = await axios.post('https://api.moblix.com.br/api/ConsultaAereo/Consultar', searchData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log(`✅ Status: ${response.status}`);
        
        // Verificar se há voos
        if (response.data && response.data.Data && response.data.Data.length > 0) {
          console.log(`✅ Voo encontrado! Total: ${response.data.Data.length}`);
        } else if (response.data && response.data.Ida && response.data.Ida.length > 0) {
          console.log(`✅ Voo encontrado (formato Ida)! Total: ${response.data.Ida.length}`);
        } else {
          console.log(`❌ Nenhum voo encontrado`);
          console.log(`📊 Resposta da API:`, JSON.stringify(response.data, null, 2));
        }
      } catch (error) {
        console.log(`❌ Erro: ${error.response?.status} - ${error.response?.statusText}`);
        if (error.response?.data) {
          console.log(`📊 Detalhes:`, JSON.stringify(error.response.data, null, 2));
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

testMultipleRoutes(); 