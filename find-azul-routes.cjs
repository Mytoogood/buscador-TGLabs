// Script para encontrar rotas onde a Azul realmente opera
const https = require('https');

// Configuração da API
const API_CONFIG = {
  hostname: 'api.moblix.com.br',
  port: 443,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Função para fazer requisição à API
function makeRequest(data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      ...API_CONFIG,
      path: '/aereo/api/consulta',
      method: 'POST',
      headers: {
        ...API_CONFIG.headers,
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
          reject(new Error(`Erro ao parsear JSON: ${error.message}`));
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

// Rotas para testar (baseadas no hub da Azul)
const routesToTest = [
  // Partindo de Viracopos (hub principal da Azul)
  { origem: 'VCP', destino: 'GIG', route: 'VCP-GIG', description: 'Viracopos → Rio Galeão', priority: 'ALTA' },
  { origem: 'VCP', destino: 'SDU', route: 'VCP-SDU', description: 'Viracopos → Rio Santos Dumont', priority: 'ALTA' },
  { origem: 'VCP', destino: 'BSB', route: 'VCP-BSB', description: 'Viracopos → Brasília', priority: 'ALTA' },
  { origem: 'VCP', destino: 'SSA', route: 'VCP-SSA', description: 'Viracopos → Salvador', priority: 'ALTA' },
  { origem: 'VCP', destino: 'FOR', route: 'VCP-FOR', description: 'Viracopos → Fortaleza', priority: 'ALTA' },
  { origem: 'VCP', destino: 'REC', route: 'VCP-REC', description: 'Viracopos → Recife', priority: 'ALTA' },
  { origem: 'VCP', destino: 'CNF', route: 'VCP-CNF', description: 'Viracopos → Belo Horizonte', priority: 'ALTA' },
  { origem: 'VCP', destino: 'POA', route: 'VCP-POA', description: 'Viracopos → Porto Alegre', priority: 'ALTA' },
  
  // Partindo de Confins (hub secundário da Azul)
  { origem: 'CNF', destino: 'GIG', route: 'CNF-GIG', description: 'Confins → Rio Galeão', priority: 'MÉDIA' },
  { origem: 'CNF', destino: 'SDU', route: 'CNF-SDU', description: 'Confins → Rio Santos Dumont', priority: 'MÉDIA' },
  { origem: 'CNF', destino: 'BSB', route: 'CNF-BSB', description: 'Confins → Brasília', priority: 'MÉDIA' },
  { origem: 'CNF', destino: 'VCP', route: 'CNF-VCP', description: 'Confins → Viracopos', priority: 'MÉDIA' },
  
  // Rotas executivas tradicionais
  { origem: 'CGH', destino: 'SDU', route: 'CGH-SDU', description: 'Congonhas → Santos Dumont', priority: 'MÉDIA' },
  { origem: 'CGH', destino: 'BSB', route: 'CGH-BSB', description: 'Congonhas → Brasília', priority: 'BAIXA' },
  
  // Rotas domésticas populares
  { origem: 'GRU', destino: 'BSB', route: 'GRU-BSB', description: 'Guarulhos → Brasília', priority: 'BAIXA' },
  { origem: 'GRU', destino: 'SSA', route: 'GRU-SSA', description: 'Guarulhos → Salvador', priority: 'BAIXA' },
  { origem: 'BSB', destino: 'GIG', route: 'BSB-GIG', description: 'Brasília → Rio Galeão', priority: 'BAIXA' },
  
  // Rotas regionais
  { origem: 'VCP', destino: 'CWB', route: 'VCP-CWB', description: 'Viracopos → Curitiba', priority: 'MÉDIA' },
  { origem: 'VCP', destino: 'FLN', route: 'VCP-FLN', description: 'Viracopos → Florianópolis', priority: 'MÉDIA' },
  { origem: 'VCP', destino: 'CGH', route: 'VCP-CGH', description: 'Viracopos → Congonhas', priority: 'BAIXA' }
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
    const response = await makeRequest(searchParams);
    
    let flightCount = 0;
    let hasFlights = false;
    let success = false;
    
    if (response && response.Success !== false) {
      success = true;
      if (response.Data && Array.isArray(response.Data) && response.Data.length > 0) {
        const firstItem = response.Data[0];
        if (firstItem.flights && Array.isArray(firstItem.flights)) {
          flightCount = firstItem.flights.length;
          hasFlights = flightCount > 0;
        }
      }
    }
    
    return {
      route: route.route,
      description: route.description,
      priority: route.priority,
      origem: route.origem,
      destino: route.destino,
      testDate,
      success,
      hasFlights,
      flightCount,
      error: !success ? (response.error || 'Erro desconhecido') : null
    };
    
  } catch (error) {
    return {
      route: route.route,
      description: route.description,
      priority: route.priority,
      origem: route.origem,
      destino: route.destino,
      testDate,
      success: false,
      hasFlights: false,
      flightCount: 0,
      error: error.message
    };
  }
}

// Função principal
async function findAzulRoutes() {
  console.log('🔍 BUSCANDO ROTAS ONDE A AZUL REALMENTE OPERA');
  console.log('=' * 50);
  console.log('📊 Total de rotas para testar:', routesToTest.length);
  console.log('🎯 Foco: Hub Viracopos (VCP) e rotas estratégicas');
  console.log('📅 Data de teste: 2025-07-15 (segunda-feira)\n');
  
  const testDate = '2025-07-15'; // Segunda-feira
  const results = [];
  
  // Ordena rotas por prioridade
  const sortedRoutes = routesToTest.sort((a, b) => {
    const priorityOrder = { 'ALTA': 1, 'MÉDIA': 2, 'BAIXA': 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  
  console.log('🚀 Iniciando testes (pausa de 2s entre requisições)...\n');
  
  // Testa uma rota por vez
  for (let i = 0; i < sortedRoutes.length; i++) {
    const route = sortedRoutes[i];
    const result = await testRoute(route, testDate);
    results.push(result);
    
    // Mostra resultado imediato
    const status = result.hasFlights ? '✅' : result.success ? '❌' : '⚠️';
    const info = result.hasFlights ? `${result.flightCount} voos` : 
                 result.success ? 'Sem voos' : 
                 `Erro: ${result.error}`;
    
    console.log(`${status} ${result.route}: ${info}`);
    
    // Pausa entre requisições para não sobrecarregar a API
    if (i < sortedRoutes.length - 1) {
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
    });
    
    console.log(`\n🎉 SUCESSO! Encontradas ${successfulRoutes.length} rotas operadas pela Azul!`);
  } else {
    console.log('   ❌ Nenhuma rota com voos da Azul encontrada');
  }
  
  console.log('\n❌ ROTAS SEM VOOS DA AZUL:');
  if (noFlightRoutes.length > 0) {
    // Agrupa por prioridade
    const byPriority = {};
    noFlightRoutes.forEach(r => {
      if (!byPriority[r.priority]) byPriority[r.priority] = [];
      byPriority[r.priority].push(r.route);
    });
    
    Object.keys(byPriority).forEach(priority => {
      console.log(`   ${priority}: ${byPriority[priority].join(', ')}`);
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
  
  // Estatísticas
  console.log('\n📈 ESTATÍSTICAS FINAIS:');
  console.log(`   🎯 Total testado: ${results.length} rotas`);
  console.log(`   ✅ Com voos: ${successfulRoutes.length} (${(successfulRoutes.length/results.length*100).toFixed(1)}%)`);
  console.log(`   ❌ Sem voos: ${noFlightRoutes.length} (${(noFlightRoutes.length/results.length*100).toFixed(1)}%)`);
  console.log(`   ⚠️ Com erro: ${errorRoutes.length} (${(errorRoutes.length/results.length*100).toFixed(1)}%)`);
  
  // Recomendações
  console.log('\n💡 RECOMENDAÇÕES:');
  if (successfulRoutes.length > 0) {
    console.log('   🎯 Use as rotas encontradas para ofertar voos da Azul');
    console.log('   🔄 Implemente essas rotas no sistema de sugestões');
    console.log('   📊 Monitore essas rotas para mudanças de disponibilidade');
  } else {
    console.log('   🔍 A Azul pode não estar disponível na API Moblix');
    console.log('   📞 Verifique com o fornecedor da API sobre suporte à Azul');
    console.log('   🛫 Considere integração direta com a Azul ou outras APIs');
  }
  
  // Insights sobre o hub Viracopos
  const vcpRoutes = results.filter(r => r.origem === 'VCP');
  const vcpWithFlights = vcpRoutes.filter(r => r.hasFlights);
  
  console.log('\n🏢 ANÁLISE DO HUB VIRACOPOS (VCP):');
  console.log(`   📊 Rotas testadas partindo de VCP: ${vcpRoutes.length}`);
  console.log(`   ✅ Rotas com voos: ${vcpWithFlights.length}`);
  console.log(`   📈 Taxa de sucesso VCP: ${vcpRoutes.length > 0 ? (vcpWithFlights.length/vcpRoutes.length*100).toFixed(1) : 0}%`);
  
  if (vcpWithFlights.length > 0) {
    console.log('   🛫 Destinos confirmados a partir de VCP:');
    vcpWithFlights.forEach(r => {
      console.log(`      • ${r.destino} (${r.flightCount} voos)`);
    });
  }
  
  return {
    total: results.length,
    successful: successfulRoutes,
    unsuccessful: noFlightRoutes,
    errors: errorRoutes
  };
}

// Executar o teste
console.log('=== BUSCA SISTEMÁTICA POR ROTAS DA AZUL ===\n');
findAzulRoutes().then((summary) => {
  console.log('\n🏁 BUSCA CONCLUÍDA!');
  console.log(`📊 Resumo: ${summary.successful.length}/${summary.total} rotas com voos da Azul`);
  
  if (summary.successful.length > 0) {
    console.log('\n🎉 MISSÃO CUMPRIDA! Rotas da Azul encontradas:');
    summary.successful.forEach(route => {
      console.log(`   ✈️ ${route.route}: ${route.flightCount} voos`);
    });
  } else {
    console.log('\n🔍 Nenhuma rota da Azul encontrada. Possíveis causas:');
    console.log('   • Azul não está integrada à API Moblix para essa data');
    console.log('   • Problemas de autenticação com a API');
    console.log('   • Azul opera em horários/datas específicas não testadas');
    console.log('   • Necessário testar rotas internacionais ou regionais');
  }
}).catch((error) => {
  console.error('\n❌ Erro durante a busca:', error.message);
});
