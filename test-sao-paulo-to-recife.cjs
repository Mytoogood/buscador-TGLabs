const axios = require('axios');

async function testSaoPauloToRecife() {
  try {
    console.log('🔍 Testando rotas de São Paulo para Recife...');
    
    // Primeiro, obter token de produção
    const tokenResponse = await axios.post('https://api.moblix.com.br/api/Token', {
      username: 'julio.martins@moblix.com.br',
      password: 'Moblix@2024'
    });
    
    const token = tokenResponse.data.access_token;
    console.log('✅ Token obtido:', token.substring(0, 50) + '...');

    // Aeroportos de São Paulo
    const saoPauloAirports = ['GRU', 'CGH', 'VCP'];
    const destino = 'REC';
    
    // Datas próximas (7, 14, 21, 30 dias)
    const today = new Date();
    const dates = [
      new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),  // 7 dias
      new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 dias
      new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000), // 21 dias
      new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)  // 30 dias
    ];

    // Companhias para testar
    const companies = [
      { id: null, name: 'Todas as companhias' },
      { id: 1, name: 'Latam' },
      { id: 2, name: 'Gol' },
      { id: 3, name: 'Azul' }
    ];

    let foundFlights = false;

    for (const airport of saoPauloAirports) {
      console.log(`\n🏢 Testando aeroporto: ${airport}`);
      
      for (const date of dates) {
        const dateStr = date.toISOString().split('T')[0];
        console.log(`📅 Data: ${dateStr}`);
        
        for (const company of companies) {
          console.log(`✈️ Companhia: ${company.name}`);
          
          const searchData = {
            origem: airport,
            destino: destino,
            dataIda: dateStr,
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
              console.log(`✅ VOO ENCONTRADO! ${flightCount} voos para ${airport} → ${destino} em ${dateStr} (${company.name})`);
              console.log(`📊 Exemplo de voo:`, JSON.stringify(response.data, null, 2));
              foundFlights = true;
              
              // Retorna os parâmetros que funcionaram
              return {
                success: true,
                origem: airport,
                destino: destino,
                dataIda: dateStr,
                companhia: company.name,
                companhiaId: company.id,
                voosEncontrados: flightCount
              };
            } else {
              console.log(`❌ Nenhum voo encontrado`);
            }
            
            // Pequena pausa para não sobrecarregar a API
            await new Promise(resolve => setTimeout(resolve, 500));
            
          } catch (error) {
            console.log(`❌ Erro: ${error.response?.status} - ${error.response?.statusText}`);
          }
        }
      }
    }

    if (!foundFlights) {
      console.log('\n❌ Nenhum voo encontrado para nenhuma combinação testada.');
      console.log('💡 Sugestões:');
      console.log('- Tente datas mais próximas (3-5 dias)');
      console.log('- Verifique se a API tem voos cadastrados para essa rota');
      console.log('- Teste com outras companhias específicas');
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    if (error.response) {
      console.error('❌ Status:', error.response.status);
      console.error('❌ Data:', error.response.data);
    }
  }
}

// Executar o teste
testSaoPauloToRecife().then(result => {
  if (result && result.success) {
    console.log('\n🎉 PARÂMETROS QUE FUNCIONARAM:');
    console.log(`Origem: ${result.origem}`);
    console.log(`Destino: ${result.destino}`);
    console.log(`Data: ${result.dataIda}`);
    console.log(`Companhia: ${result.companhia}`);
    console.log(`Voos encontrados: ${result.voosEncontrados}`);
  }
}); 