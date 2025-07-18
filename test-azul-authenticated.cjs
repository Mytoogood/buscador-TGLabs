// Script para testar rotas da Azul com autenticação correta
const https = require('https');
const querystring = require('querystring');

// Credenciais da API
const CREDENTIALS = {
  username: 'TooGood',
  password: '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7'
};

let authToken = null;

// Função para obter token de autenticação
function getAuthToken() {
  return new Promise((resolve, reject) => {
    const postData = querystring.stringify({
      grant_type: 'password',
      username: CREDENTIALS.username,
      password: CREDENTIALS.password
    });

    const options = {
      hostname: 'api.moblix.com.br',
      port: 443,
      path: '/api/Token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'externo',
        'Accept': 'application/json',
        'Content-Length': postData.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (response.access_token) {
            resolve(response.access_token);
          } else {
            reject(new Error('Token não encontrado na resposta: ' + body));
          }
        } catch (error) {
          reject(new Error('Erro ao parsear resposta do token: ' + error.message));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Timeout na requisição de token'));
    });

    req.write(postData);
    req.end();
  });
}

// Função para fazer requisição autenticada
function makeAuthenticatedRequest(data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);

    const options = {
      hostname: 'api.moblix.com.br',
      port: 443,
      path: '/aereo/api/consulta',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'Origin': 'externo',
        'Content-Length': postData.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          if (body.trim() === '') {
            resolve({ Success: false, error: 'Empty response' });
            return;
          }
          const jsonResponse = JSON.parse(body);
          resolve(jsonResponse);
        } catch (error) {
          reject(new Error(`Erro ao parsear JSON: ${error.message}, Response: ${body}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Timeout na requisição'));
    });

    req.write(postData);
    req.end();
  });
}

// Rotas prioritárias para testar
const priorityRoutes = [
  // Hub Viracopos (mais provável de ter voos da Azul)
  { origem: 'VCP', destino: 'GIG', route: 'VCP-GIG', description: 'Viracopos → Rio Galeão' },
  { origem: 'VCP', destino: 'SDU', route: 'VCP-SDU', description: 'Viracopos → Rio Santos Dumont' },
  { origem: 'VCP', destino: 'BSB', route: 'VCP-BSB', description: 'Viracopos → Brasília' },
  { origem: 'VCP', destino: 'SSA', route: 'VCP-SSA', description: 'Viracopos → Salvador' },
  { origem: 'VCP', destino: 'CNF', route: 'VCP-CNF', description: 'Viracopos → Belo Horizonte' },
  
  // Rotas executivas populares
  { origem: 'CGH', destino: 'SDU', route: 'CGH-SDU', description: 'Congonhas → Santos Dumont' },
  { origem: 'CGH', destino: 'BSB', route: 'CGH-BSB', description: 'Congonhas → Brasília' },
  
  // Confins (hub secundário)
  { origem: 'CNF', destino: 'GIG', route: 'CNF-GIG', description: 'Confins → Rio Galeão' },
  { origem: 'CNF', destino: 'VCP', route: 'CNF-VCP', description: 'Confins → Viracopos' },
  
  // Teste original que não funcionou
  { origem: 'GRU', destino: 'GIG', route: 'GRU-GIG', description: 'Guarulhos → Rio Galeão' }
];

// Função para testar uma rota específica
async function testRoute(route, testDate) {
  const searchParams = {
    Origem: route.origem,
    Destino: route.destino,
    Ida: testDate,
    Adultos: 1,
    Criancas: 0,
    Bebes: 0,
    companhia: 3  // Azul
  };

  try {
    console.log(`🔍 Testando ${route.route} (${route.description})...`);
    const response = await makeAuthenticatedRequest(searchParams);

    let flightCount = 0;
    let hasFlights = false;
    let success = false;
    let details = null;

    if (response && response.Success !== false) {
      success = true;
      if (response.Data && Array.isArray(response.Data) && response.Data.length > 0) {
        const firstItem = response.Data[0];
        if (firstItem.flights && Array.isArray(firstItem.flights)) {
          flightCount = firstItem.flights.length;
          hasFlights = flightCount > 0;
          
          // Captura detalhes do primeiro voo se existir
          if (hasFlights) {
            details = {
              priceRange: firstItem.flights.map(f => f.fareGroup?.priceWithTax || 0),
              airlines: firstItem.flights.map(f => f.validatingBy?.name).filter(Boolean),
              flightNumbers: firstItem.flights.map(f => f.segments?.[0]?.legs?.[0]?.flightNumber).filter(Boolean)
            };
          }
        }
      }
    }

    return {
      route: route.route,
      description: route.description,
      origem: route.origem,
      destino: route.destino,
      testDate,
      success,
      hasFlights,
      flightCount,
      details,
      error: !success ? (response.error || response.MensagemErro || 'Erro desconhecido') : null
    };

  } catch (error) {
    return {
      route: route.route,
      description: route.description,
      origem: route.origem,
      destino: route.destino,
      testDate,
      success: false,
      hasFlights: false,
      flightCount: 0,
      details: null,
      error: error.message
    };
  }
}

// Função principal
async function findAzulRoutesAuthenticated() {
  console.log('🔐 BUSCANDO ROTAS DA AZUL COM AUTENTICAÇÃO');
  console.log('=' * 50);
  console.log('👤 Usuário:', CREDENTIALS.username);
  console.log('📊 Rotas para testar:', priorityRoutes.length);
  console.log('📅 Data de teste: 2025-07-15 (segunda-feira)\n');

  try {
    // Primeiro, obter token de autenticação
    console.log('🔑 Obtendo token de autenticação...');
    authToken = await getAuthToken();
    console.log('✅ Token obtido com sucesso!');
    console.log('🔐 Token:', authToken.substring(0, 20) + '...\n');

  } catch (error) {
    console.error('❌ Erro ao obter token:', error.message);
    return;
  }

  const testDate = '2025-07-15'; // Segunda-feira
  const results = [];

  console.log('🚀 Iniciando testes autenticados (pausa de 2s entre requisições)...\n');

  // Testa cada rota
  for (let i = 0; i < priorityRoutes.length; i++) {
    const route = priorityRoutes[i];
    const result = await testRoute(route, testDate);
    results.push(result);

    // Mostra resultado imediato
    const status = result.hasFlights ? '✅' : result.success ? '❌' : '⚠️';
    const info = result.hasFlights ? `${result.flightCount} voos` :
                 result.success ? 'Sem voos' :
                 `Erro: ${result.error}`;

    console.log(`${status} ${result.route}: ${info}`);

    // Se encontrou voos, mostra detalhes
    if (result.hasFlights && result.details) {
      const minPrice = Math.min(...result.details.priceRange.filter(p => p > 0));
      const maxPrice = Math.max(...result.details.priceRange.filter(p => p > 0));
      console.log(`   💰 Preços: R$ ${minPrice.toFixed(2)} - R$ ${maxPrice.toFixed(2)}`);
      console.log(`   ✈️ Voos: ${result.details.flightNumbers.join(', ')}`);
    }

    // Pausa entre requisições
    if (i < priorityRoutes.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Análise dos resultados
  console.log('\n📊 ANÁLISE DOS RESULTADOS:\n');

  const successfulRoutes = results.filter(r => r.hasFlights);
  const noFlightRoutes = results.filter(r => r.success && !r.hasFlights);
  const errorRoutes = results.filter(r => !r.success);

  console.log('✅ ROTAS COM VOOS DA AZUL ENCONTRADOS:');
  if (successfulRoutes.length > 0) {
    successfulRoutes.forEach(result => {
      console.log(`   🛫 ${result.route} (${result.description}): ${result.flightCount} voos`);
      if (result.details) {
        const prices = result.details.priceRange.filter(p => p > 0);
        if (prices.length > 0) {
          const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
          console.log(`      💰 Preço médio: R$ ${avgPrice.toFixed(2)}`);
        }
      }
    });

    console.log(`\n🎉 SUCESSO! Encontradas ${successfulRoutes.length} rotas operadas pela Azul!`);
  } else {
    console.log('   ❌ Nenhuma rota com voos da Azul encontrada');
  }

  console.log('\n❌ ROTAS SEM VOOS DA AZUL:');
  if (noFlightRoutes.length > 0) {
    noFlightRoutes.forEach(result => {
      console.log(`   📍 ${result.route} (${result.description})`);
    });
  }

  console.log('\n⚠️ ERROS DE COMUNICAÇÃO:');
  if (errorRoutes.length > 0) {
    errorRoutes.forEach(result => {
      console.log(`   ${result.route}: ${result.error}`);
    });
  } else {
    console.log('   ✅ Todas as requisições foram processadas');
  }

  // Estatísticas finais
  console.log('\n📈 ESTATÍSTICAS FINAIS:');
  console.log(`   🎯 Total testado: ${results.length} rotas`);
  console.log(`   ✅ Com voos: ${successfulRoutes.length} (${(successfulRoutes.length/results.length*100).toFixed(1)}%)`);
  console.log(`   ❌ Sem voos: ${noFlightRoutes.length} (${(noFlightRoutes.length/results.length*100).toFixed(1)}%)`);
  console.log(`   ⚠️ Com erro: ${errorRoutes.length} (${(errorRoutes.length/results.length*100).toFixed(1)}%)`);

  // Análise do hub Viracopos
  const vcpRoutes = results.filter(r => r.origem === 'VCP');
  const vcpWithFlights = vcpRoutes.filter(r => r.hasFlights);

  console.log('\n🏢 ANÁLISE DO HUB VIRACOPOS (VCP):');
  console.log(`   📊 Rotas testadas: ${vcpRoutes.length}`);
  console.log(`   ✅ Com voos: ${vcpWithFlights.length}`);
  if (vcpRoutes.length > 0) {
    console.log(`   📈 Taxa de sucesso: ${(vcpWithFlights.length/vcpRoutes.length*100).toFixed(1)}%`);
  }

  // Conclusões
  console.log('\n🎯 CONCLUSÕES:');
  if (successfulRoutes.length > 0) {
    console.log('   ✅ A Azul TEM voos disponíveis através da API Moblix!');
    console.log('   🔄 Implemente essas rotas no sistema de sugestões');
    console.log('   📊 Monitore essas rotas para otimizar ofertas');
  } else {
    console.log('   ❌ A Azul pode não operar nas rotas/datas testadas');
    console.log('   📅 Tente outras datas ou rotas regionais');
    console.log('   🔍 Verifique malha de voos atual da Azul');
  }

  return {
    total: results.length,
    successful: successfulRoutes,
    unsuccessful: noFlightRoutes,
    errors: errorRoutes
  };
}

// Executar o teste
console.log('=== BUSCA AUTENTICADA POR ROTAS DA AZUL ===\n');
findAzulRoutesAuthenticated().then((summary) => {
  console.log('\n🏁 BUSCA AUTENTICADA CONCLUÍDA!');
  console.log(`📊 Resumo: ${summary.successful.length}/${summary.total} rotas com voos da Azul`);

  if (summary.successful.length > 0) {
    console.log('\n🎉 MISSÃO CUMPRIDA! Rotas da Azul encontradas:');
    summary.successful.forEach(route => {
      console.log(`   ✈️ ${route.route}: ${route.flightCount} voos`);
    });
    
    console.log('\n📋 PRÓXIMOS PASSOS:');
    console.log('1. 🔄 Atualize o sistema para sugerir essas rotas');
    console.log('2. 📊 Implemente monitoramento de preços');
    console.log('3. 🎯 Otimize filtros para mostrar voos da Azul');
  } else {
    console.log('\n🔍 Investigação adicional necessária:');
    console.log('• Teste outras datas (fins de semana, feriados)');
    console.log('• Verifique rotas regionais menores');
    console.log('• Consulte malha atual da Azul');
  }
}).catch((error) => {
  console.error('\n❌ Erro durante a busca:', error.message);
});
