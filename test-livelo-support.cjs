const axios = require('axios');

async function testLiveloSupport() {
  try {
    console.log('🔍 Testando suporte da Livelo (ID 34)...');
    
    // Primeiro, obter token
    console.log('1️⃣ Obtendo token de autenticação...');
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', 'TooGood');
    formData.append('password', '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7');

    const tokenResponse = await axios({
      method: 'post',
      url: 'https://api.moblix.com.br/api/Token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Origin': 'externo'
      },
      data: formData
    });

    const token = tokenResponse.data.access_token;
    console.log('✅ Token obtido com sucesso');

    // Testa algumas rotas com Livelo
    const routes = [
      { origem: 'GRU', destino: 'BSB', nome: 'São Paulo → Brasília' },
      { origem: 'GRU', destino: 'GIG', nome: 'São Paulo → Rio de Janeiro' },
      { origem: 'GRU', destino: 'FOR', nome: 'São Paulo → Fortaleza' }
    ];

    console.log('\n📅 Testando rotas com Livelo para a data 2025-07-11...\n');

    for (const route of routes) {
      console.log(`✈️ Testando rota: ${route.nome} (${route.origem}-${route.destino})`);
      
      try {
        const requestData = {
          Origem: route.origem,
          Destino: route.destino,
          Ida: '2025-07-11',
          Adultos: 1,
          Criancas: 0,
          Bebes: 0,
          Companhia: 34 // Livelo
        };

        const response = await axios({
          method: 'post',
          url: 'https://api.moblix.com.br/aereo/api/consulta',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          data: requestData
        });

        console.log(`  📡 Status: ${response.status}`);
        console.log(`  📊 Resposta:`, JSON.stringify(response.data, null, 2));

        // Verifica se há voos
        if (response.data?.Data && Array.isArray(response.data.Data) && response.data.Data.length > 0) {
          const firstDataItem = response.data.Data[0];
          
          if (firstDataItem.Ida && Array.isArray(firstDataItem.Ida) && firstDataItem.Ida.length > 0) {
            console.log(`  ✅ ${firstDataItem.Ida.length} voos da Livelo encontrados!`);
          } else if (firstDataItem.flights && Array.isArray(firstDataItem.flights) && firstDataItem.flights.length > 0) {
            console.log(`  ✅ ${firstDataItem.flights.length} voos encontrados em flights!`);
          } else {
            console.log(`  ❌ Nenhum voo da Livelo encontrado`);
          }
        } else {
          console.log(`  ❌ Nenhum voo da Livelo encontrado`);
        }

      } catch (error) {
        console.log(`  ❌ Erro na busca: ${error.response?.status} - ${error.message}`);
        if (error.response?.data) {
          console.log(`  📄 Detalhes:`, JSON.stringify(error.response.data, null, 2));
        }
      }
      
      console.log(''); // Linha em branco
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    if (error.response) {
      console.error('❌ Status:', error.response.status);
      console.error('❌ Data:', error.response.data);
    }
  }
}

testLiveloSupport();
