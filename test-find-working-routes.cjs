const axios = require('axios');

async function findWorkingRoutes() {
  try {
    console.log('🔍 Procurando rotas que retornam voos reais...');
    
    // Primeiro, obter token
    const tokenResponse = await axios.post('http://localhost:3000/api/Token', {
      username: 'julio.martins@moblix.com.br',
      password: 'Moblix@2024'
    });
    
    const token = tokenResponse.data.access_token;
    console.log('✅ Token obtido:', token.substring(0, 50) + '...');

    // Rotas populares para testar
    const routes = [
      { origem: 'GRU', destino: 'GIG', descricao: 'Guarulhos → Galeão' },
      { origem: 'GRU', destino: 'BSB', descricao: 'Guarulhos → Brasília' },
      { origem: 'GRU', destino: 'SSA', descricao: 'Guarulhos → Salvador' },
      { origem: 'GRU', destino: 'REC', descricao: 'Guarulhos → Recife' },
      { origem: 'CGH', destino: 'GIG', descricao: 'Congonhas → Galeão' },
      { origem: 'CGH', destino: 'BSB', descricao: 'Congonhas → Brasília' },
      { origem: 'GIG', destino: 'GRU', descricao: 'Galeão → Guarulhos' },
      { origem: 'GIG', destino: 'BSB', descricao: 'Galeão → Brasília' },
      { origem: 'BSB', destino: 'GRU', descricao: 'Brasília → Guarulhos' },
      { origem: 'BSB', destino: 'GIG', descricao: 'Brasília → Galeão' }
    ];

    // Datas próximas para testar
    const dates = [
      { data: '2025-01-15', descricao: '15/01/2025 (próxima semana)' },
      { data: '2025-01-22', descricao: '22/01/2025 (2 semanas)' },
      { data: '2025-01-29', descricao: '29/01/2025 (3 semanas)' },
      { data: '2025-02-05', descricao: '05/02/2025 (1 mês)' }
    ];

    let foundFlights = false;

    for (const route of routes) {
      for (const date of dates) {
        console.log(`\n📤 Testando: ${route.descricao} - ${date.descricao}`);
        
        const searchData = {
          origem: route.origem,
          destino: route.destino,
          dataIda: date.data,
          dataVolta: null,
          adultos: 1,
          criancas: 0,
          bebes: 0,
          companhiaAerea: null, // Todas as companhias
          tipoBusca: 1
        };

        try {
          const response = await axios.post('http://localhost:3000/api/ConsultaAereo/Consultar', searchData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          console.log(`✅ Status: ${response.status}`);
          
          // Verificar se há voos
          let hasFlights = false;
          let flightCount = 0;
          
          if (response.data && response.data.Data && response.data.Data.length > 0) {
            hasFlights = true;
            flightCount = response.data.Data.length;
          } else if (response.data && response.data.Ida && response.data.Ida.length > 0) {
            hasFlights = true;
            flightCount = response.data.Ida.length;
          }
          
          if (hasFlights) {
            console.log(`🎉 VOO ENCONTRADO! Total: ${flightCount} voos`);
            console.log(`📍 Rota: ${route.origem} → ${route.destino}`);
            console.log(`📅 Data: ${date.data}`);
            console.log(`📊 Resposta:`, JSON.stringify(response.data, null, 2));
            foundFlights = true;
            
            // Testar também com companhias específicas
            await testSpecificAirlines(token, route, date);
            
            // Se encontrou voos, pode parar de testar
            return;
          } else {
            console.log(`❌ Nenhum voo encontrado`);
          }
          
          // Aguarda um pouco entre as requisições para não sobrecarregar a API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.log(`❌ Erro: ${error.response?.status} - ${error.response?.statusText}`);
        }
      }
    }

    if (!foundFlights) {
      console.log('\n❌ Nenhuma rota retornou voos. Testando com companhias específicas...');
      await testAllAirlinesIndividually(token);
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    if (error.response) {
      console.error('❌ Status:', error.response.status);
      console.error('❌ Data:', error.response.data);
    }
  }
}

async function testSpecificAirlines(token, route, date) {
  console.log(`\n🔍 Testando companhias específicas para ${route.descricao}...`);
  
  const airlines = [
    { id: -1, name: 'Todas as companhias' },
    { id: 1, name: 'Latam' },
    { id: 2, name: 'Gol' },
    { id: 3, name: 'Azul' },
    { id: 11, name: 'TAP Air Portugal' },
    { id: 13, name: 'Copa Airlines' },
    { id: 22, name: 'American Airlines' },
    { id: 26, name: 'Iberia' },
    { id: 34, name: 'Livelo' },
    { id: 1200, name: 'Azul Interline' },
    { id: 0, name: 'Nenhuma companhia específica' }
  ];

  for (const airline of airlines) {
    const searchData = {
      origem: route.origem,
      destino: route.destino,
      dataIda: date.data,
      dataVolta: null,
      adultos: 1,
      criancas: 0,
      bebes: 0,
      companhiaAerea: airline.id,
      tipoBusca: 1
    };

    try {
      const response = await axios.post('http://localhost:3000/api/ConsultaAereo/Consultar', searchData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      let hasFlights = false;
      let flightCount = 0;
      
      if (response.data && response.data.Data && response.data.Data.length > 0) {
        hasFlights = true;
        flightCount = response.data.Data.length;
      } else if (response.data && response.data.Ida && response.data.Ida.length > 0) {
        hasFlights = true;
        flightCount = response.data.Ida.length;
      }
      
      if (hasFlights) {
        console.log(`✅ ${airline.name}: ${flightCount} voos encontrados`);
      } else {
        console.log(`❌ ${airline.name}: Nenhum voo`);
      }
      
    } catch (error) {
      console.log(`❌ ${airline.name}: Erro ${error.response?.status}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

async function testAllAirlinesIndividually(token) {
  console.log('\n🔍 Testando todas as companhias individualmente...');
  
  const testCase = {
    origem: 'GRU',
    destino: 'GIG',
    dataIda: '2025-01-15'
  };

  const airlines = [
    { id: -1, name: 'Todas as companhias' },
    { id: 1, name: 'Latam' },
    { id: 2, name: 'Gol' },
    { id: 3, name: 'Azul' },
    { id: 11, name: 'TAP Air Portugal' },
    { id: 13, name: 'Copa Airlines' },
    { id: 22, name: 'American Airlines' },
    { id: 26, name: 'Iberia' },
    { id: 34, name: 'Livelo' },
    { id: 1200, name: 'Azul Interline' },
    { id: 0, name: 'Nenhuma companhia específica' }
  ];

  for (const airline of airlines) {
    const searchData = {
      origem: testCase.origem,
      destino: testCase.destino,
      dataIda: testCase.dataIda,
      dataVolta: null,
      adultos: 1,
      criancas: 0,
      bebes: 0,
      companhiaAerea: airline.id,
      tipoBusca: 1
    };

    try {
      const response = await axios.post('http://localhost:3000/api/ConsultaAereo/Consultar', searchData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      let hasFlights = false;
      let flightCount = 0;
      
      if (response.data && response.data.Data && response.data.Data.length > 0) {
        hasFlights = true;
        flightCount = response.data.Data.length;
      } else if (response.data && response.data.Ida && response.data.Ida.length > 0) {
        hasFlights = true;
        flightCount = response.data.Ida.length;
      }
      
      if (hasFlights) {
        console.log(`✅ ${airline.name}: ${flightCount} voos encontrados`);
        console.log(`📊 Resposta:`, JSON.stringify(response.data, null, 2));
      } else {
        console.log(`❌ ${airline.name}: Nenhum voo`);
      }
      
    } catch (error) {
      console.log(`❌ ${airline.name}: Erro ${error.response?.status} - ${error.response?.statusText}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

findWorkingRoutes(); 