import axios from 'axios';

// Teste direto da API Moblix para busca de voos
async function testMoblixFlightSearch() {
  console.log('🧪 Testando API Moblix - Busca de Voos');
  console.log('=====================================');

  const testCases = [
    {
      name: 'GRU → GIG (São Paulo → Rio)',
      params: {
        Origem: 'GRU',
        Destino: 'GIG',
        Ida: '2025-07-20',
        Adultos: 1,
        Criancas: 0,
        Bebes: 0,
        Companhia: 1
      }
    },
    {
      name: 'BSB → GRU (Brasília → São Paulo)',
      params: {
        Origem: 'BSB',
        Destino: 'GRU',
        Ida: '2025-07-25',
        Adultos: 1,
        Criancas: 0,
        Bebes: 0,
        Companhia: 1
      }
    },
    {
      name: 'GRU → SDU (São Paulo → Rio Santos Dumont)',
      params: {
        Origem: 'GRU',
        Destino: 'SDU',
        Ida: '2025-07-22',
        Adultos: 1,
        Criancas: 0,
        Bebes: 0,
        Companhia: 2 // GOL
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n🔍 Testando: ${testCase.name}`);
    console.log('Parâmetros:', JSON.stringify(testCase.params, null, 2));

    try {
      // Teste via proxy local (como o frontend faz)
      const response = await axios({
        method: 'POST',
        url: 'http://localhost:5173/api/ConsultaAereo/Consultar',
        data: testCase.params,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 30000
      });

      console.log('✅ Status:', response.status);
      console.log('📊 Tipo da resposta:', typeof response.data);
      console.log('📋 É array?', Array.isArray(response.data));
      
      if (response.data) {
        console.log('🗂️ Propriedades da resposta:', Object.keys(response.data));
        
        // Verifica diferentes formatos de resposta
        if (response.data.Data && Array.isArray(response.data.Data)) {
          console.log(`📈 Total de itens em Data: ${response.data.Data.length}`);
          if (response.data.Data.length > 0) {
            console.log('🛫 Primeiro item:', JSON.stringify(response.data.Data[0], null, 2));
          }
        } else if (Array.isArray(response.data)) {
          console.log(`📈 Array direto com ${response.data.length} itens`);
          if (response.data.length > 0) {
            console.log('🛫 Primeiro item:', JSON.stringify(response.data[0], null, 2));
          }
        } else {
          console.log('📄 Resposta completa:', JSON.stringify(response.data, null, 2));
        }
      } else {
        console.log('❌ Resposta vazia');
      }

    } catch (error) {
      console.error('❌ Erro:', error.message);
      if (error.response) {
        console.error('📊 Status do erro:', error.response.status);
        console.error('📄 Dados do erro:', error.response.data);
      }
    }

    console.log('─'.repeat(50));
  }
}

// Teste da API de aeroportos
async function testAirportAPI() {
  console.log('\n🛫 Testando API de Aeroportos');
  console.log('============================');

  const searchTerms = ['GRU', 'GIG', 'rio de janeiro', 'são paulo'];

  for (const term of searchTerms) {
    console.log(`\n🔍 Buscando aeroportos: "${term}"`);
    try {
      const response = await axios({
        method: 'GET',
        url: `http://localhost:5173/aereo/api/aeroporto?filtro=${encodeURIComponent(term)}`,
        headers: {
          'Accept': 'application/json'
        },
        timeout: 10000
      });

      console.log('✅ Status:', response.status);
      console.log('📊 Tipo:', typeof response.data);
      console.log('📋 É array?', Array.isArray(response.data));
      console.log(`📈 Total: ${Array.isArray(response.data) ? response.data.length : 'N/A'}`);

      if (Array.isArray(response.data) && response.data.length > 0) {
        console.log('🛫 Primeiros 3 aeroportos:');
        response.data.slice(0, 3).forEach((airport, index) => {
          console.log(`  ${index + 1}. ${airport.Iata} - ${airport.Nome}`);
        });
      }

    } catch (error) {
      console.error('❌ Erro:', error.message);
    }
  }
}

// Executa os testes
async function runAllTests() {
  try {
    await testAirportAPI();
    await testMoblixFlightSearch();
  } catch (error) {
    console.error('💥 Erro geral:', error);
  }
}

runAllTests();
