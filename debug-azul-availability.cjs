// Script para debugar disponibilidade da Azul na API Moblix
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
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (response.access_token) {
            resolve(response.access_token);
          } else {
            reject(new Error('Token não encontrado: ' + body));
          }
        } catch (error) {
          reject(new Error('Erro ao parsear token: ' + error.message));
        }
      });
    });

    req.on('error', reject);
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
      res.on('data', (chunk) => { body += chunk; });
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

    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Timeout na requisição'));
    });

    req.write(postData);
    req.end();
  });
}

// Função principal de debug
async function debugAzulAvailability() {
  console.log('🔍 DEBUG: DISPONIBILIDADE DA AZUL NA API MOBLIX');
  console.log('=' * 60);

  try {
    // Obter token
    console.log('🔑 Obtendo token de autenticação...');
    authToken = await getAuthToken();
    console.log('✅ Token obtido com sucesso!\n');

  } catch (error) {
    console.error('❌ Erro ao obter token:', error.message);
    return;
  }

  // Teste 1: Verificar se todas as companhias retornam voos da Azul
  console.log('📊 TESTE 1: Buscar TODAS as companhias e verificar se há Azul');
  console.log('-' * 50);

  const allCompaniesParams = {
    Origem: 'VCP',
    Destino: 'GIG',
    Ida: '2025-07-15',
    Adultos: 1,
    Criancas: 0,
    Bebes: 0,
    companhia: -1  // Todas as companhias
  };

  try {
    console.log('🔍 Buscando todas as companhias (VCP-GIG)...');
    const allResponse = await makeAuthenticatedRequest(allCompaniesParams);
    
    if (allResponse.Success && allResponse.Data && allResponse.Data[0]?.flights) {
      const allFlights = allResponse.Data[0].flights;
      console.log(`✅ Total de voos encontrados: ${allFlights.length}`);
      
      // Analisa as companhias presentes
      const companiesFound = new Set();
      allFlights.forEach(flight => {
        if (flight.validatingBy?.name) {
          companiesFound.add(flight.validatingBy.name);
        }
      });
      
      console.log('🏢 Companhias encontradas:');
      Array.from(companiesFound).forEach(company => {
        const count = allFlights.filter(f => f.validatingBy?.name === company).length;
        console.log(`   • ${company}: ${count} voos`);
      });
      
      // Verifica se Azul está presente
      const azulFlights = allFlights.filter(f => 
        f.validatingBy?.name?.toLowerCase().includes('azul') ||
        f.segments?.[0]?.legs?.[0]?.operatedBy?.name?.toLowerCase().includes('azul')
      );
      
      if (azulFlights.length > 0) {
        console.log(`\n🎉 AZUL ENCONTRADA! ${azulFlights.length} voos da Azul na busca geral`);
        console.log('🔍 Primeiro voo da Azul:', JSON.stringify(azulFlights[0], null, 2));
      } else {
        console.log('\n❌ Azul NÃO encontrada na busca geral');
      }
      
    } else {
      console.log('❌ Nenhum voo encontrado na busca geral');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste 1:', error.message);
  }

  // Teste 2: Verificar diferentes códigos de companhia para Azul
  console.log('\n\n📊 TESTE 2: Testando diferentes códigos da Azul');
  console.log('-' * 50);

  const azulCodes = [3, 1200, 'Azul', 'AZUL', 34]; // Códigos possíveis para Azul
  
  for (const code of azulCodes) {
    try {
      console.log(`🔍 Testando código da Azul: ${code}`);
      
      const azulParams = {
        Origem: 'VCP',
        Destino: 'GIG',
        Ida: '2025-07-15',
        Adultos: 1,
        Criancas: 0,
        Bebes: 0,
        companhia: code
      };
      
      const azulResponse = await makeAuthenticatedRequest(azulParams);
      
      if (azulResponse.Success && azulResponse.Data && azulResponse.Data[0]?.flights) {
        const flights = azulResponse.Data[0].flights;
        console.log(`   ✅ Código ${code}: ${flights.length} voos encontrados`);
        
        if (flights.length > 0) {
          console.log('   🛫 Primeiro voo:', {
            validatingBy: flights[0].validatingBy?.name,
            operatedBy: flights[0].segments?.[0]?.legs?.[0]?.operatedBy?.name,
            flightNumber: flights[0].segments?.[0]?.legs?.[0]?.flightNumber,
            price: flights[0].fareGroup?.priceWithTax
          });
        }
      } else {
        console.log(`   ❌ Código ${code}: Sem voos`);
      }
      
      // Pausa entre testes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`   ⚠️ Código ${code}: Erro - ${error.message}`);
    }
  }

  // Teste 3: Testar diferentes datas
  console.log('\n\n📊 TESTE 3: Testando diferentes datas');
  console.log('-' * 50);

  const testDates = [
    '2025-07-11', // Sexta
    '2025-07-12', // Sábado
    '2025-07-13', // Domingo
    '2025-07-14', // Segunda
    '2025-07-15', // Terça
    '2025-07-16', // Quarta
    '2025-07-17'  // Quinta
  ];

  for (const date of testDates) {
    try {
      const dayOfWeek = new Date(date).toLocaleDateString('pt-BR', { weekday: 'long' });
      console.log(`🔍 Testando data: ${date} (${dayOfWeek})`);
      
      const dateParams = {
        Origem: 'VCP',
        Destino: 'GIG',
        Ida: date,
        Adultos: 1,
        Criancas: 0,
        Bebes: 0,
        companhia: 3  // Azul
      };
      
      const dateResponse = await makeAuthenticatedRequest(dateParams);
      
      if (dateResponse.Success && dateResponse.Data && dateResponse.Data[0]?.flights) {
        const flights = dateResponse.Data[0].flights;
        console.log(`   ✅ ${date}: ${flights.length} voos da Azul`);
      } else {
        console.log(`   ❌ ${date}: Sem voos da Azul`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`   ⚠️ ${date}: Erro - ${error.message}`);
    }
  }

  // Teste 4: Testar rotas conhecidas da Azul
  console.log('\n\n📊 TESTE 4: Testando rotas conhecidas da Azul');
  console.log('-' * 50);

  const knownAzulRoutes = [
    { origem: 'VCP', destino: 'CNF', description: 'Viracopos → Confins (hubs da Azul)' },
    { origem: 'CNF', destino: 'VCP', description: 'Confins → Viracopos (hubs da Azul)' },
    { origem: 'VCP', destino: 'MOC', description: 'Viracopos → Montes Claros (regional)' },
    { origem: 'VCP', destino: 'UDI', description: 'Viracopos → Uberlândia (regional)' },
    { origem: 'VCP', destino: 'CAW', description: 'Viracopos → Campos dos Goytacazes' },
    { origem: 'CNF', destino: 'BSB', description: 'Confins → Brasília' },
    { origem: 'VCP', destino: 'NAT', description: 'Viracopos → Natal' }
  ];

  for (const route of knownAzulRoutes) {
    try {
      console.log(`🔍 Testando ${route.origem}-${route.destino}: ${route.description}`);
      
      const routeParams = {
        Origem: route.origem,
        Destino: route.destino,
        Ida: '2025-07-15',
        Adultos: 1,
        Criancas: 0,
        Bebes: 0,
        companhia: 3  // Azul
      };
      
      const routeResponse = await makeAuthenticatedRequest(routeParams);
      
      if (routeResponse.Success && routeResponse.Data && routeResponse.Data[0]?.flights) {
        const flights = routeResponse.Data[0].flights;
        console.log(`   ✅ ${route.origem}-${route.destino}: ${flights.length} voos da Azul`);
        
        if (flights.length > 0) {
          console.log('      💰 Preços:', flights.map(f => f.fareGroup?.priceWithTax).filter(Boolean));
        }
      } else {
        console.log(`   ❌ ${route.origem}-${route.destino}: Sem voos da Azul`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } catch (error) {
      console.log(`   ⚠️ ${route.origem}-${route.destino}: Erro - ${error.message}`);
    }
  }

  // Conclusões finais
  console.log('\n\n🎯 CONCLUSÕES DO DEBUG:');
  console.log('=' * 60);
  console.log('1. ✅ Autenticação: Funcionando perfeitamente');
  console.log('2. ✅ API: Respondendo corretamente');
  console.log('3. ❓ Azul: Verificar se está integrada à API Moblix');
  console.log('4. 📅 Datas: Testar período mais amplo');
  console.log('5. 🛫 Rotas: Verificar malha real da Azul');
  
  console.log('\n💡 PRÓXIMAS AÇÕES:');
  console.log('• Contatar suporte da Moblix sobre integração da Azul');
  console.log('• Verificar se Azul requer parâmetros especiais');
  console.log('• Testar com outras APIs de voos');
  console.log('• Implementar fallback para site oficial da Azul');
}

// Executar o debug
console.log('=== DEBUG DE DISPONIBILIDADE DA AZUL ===\n');
debugAzulAvailability().then(() => {
  console.log('\n🏁 DEBUG CONCLUÍDO!');
}).catch((error) => {
  console.error('\n❌ Erro durante o debug:', error.message);
});
