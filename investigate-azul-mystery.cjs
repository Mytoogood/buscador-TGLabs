// Script para investigar por que a Azul (oficialmente suportada) não retorna voos
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

// Função principal de investigação
async function investigateAzulMystery() {
  console.log('🔍 INVESTIGAÇÃO: POR QUE A AZUL NÃO RETORNA VOOS?');
  console.log('=' * 60);
  console.log('📋 FATO CONHECIDO: Azul (ID: 3) está oficialmente listada na API');
  console.log('❓ MISTÉRIO: Por que não encontramos voos da Azul?\n');

  try {
    // Obter token
    console.log('🔑 Obtendo token de autenticação...');
    authToken = await getAuthToken();
    console.log('✅ Token obtido com sucesso!\n');

  } catch (error) {
    console.error('❌ Erro ao obter token:', error.message);
    return;
  }

  // HIPÓTESE 1: Testar diferentes períodos (talvez Azul não opere em julho)
  console.log('🔬 HIPÓTESE 1: Testar diferentes meses/períodos');
  console.log('-' * 50);

  const testPeriods = [
    '2025-08-15', // Agosto
    '2025-09-15', // Setembro  
    '2025-10-15', // Outubro
    '2025-11-15', // Novembro
    '2025-12-15', // Dezembro
  ];

  for (const date of testPeriods) {
    try {
      const month = new Date(date).toLocaleDateString('pt-BR', { month: 'long' });
      console.log(`🔍 Testando ${month} (${date}) - VCP→GIG`);
      
      const params = {
        Origem: 'VCP',
        Destino: 'GIG',
        Ida: date,
        Adultos: 1,
        Criancas: 0,
        Bebes: 0,
        companhia: 3  // Azul
      };
      
      const response = await makeAuthenticatedRequest(params);
      
      if (response.Success && response.Data && response.Data[0]?.flights) {
        const flights = response.Data[0].flights;
        console.log(`   ✅ ${month}: ${flights.length} voos da Azul encontrados!`);
        
        if (flights.length > 0) {
          console.log('   🎉 BREAKTHROUGH! Encontramos voos da Azul!');
          console.log('   🛫 Primeiro voo:', {
            validatingBy: flights[0].validatingBy?.name,
            flightNumber: flights[0].segments?.[0]?.legs?.[0]?.flightNumber,
            price: flights[0].fareGroup?.priceWithTax,
            departure: flights[0].segments?.[0]?.departureDate
          });
          break;
        }
      } else {
        console.log(`   ❌ ${month}: Sem voos da Azul`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`   ⚠️ ${date}: Erro - ${error.message}`);
    }
  }

  // HIPÓTESE 2: Testar rotas onde sabemos que Azul opera (rotas domésticas populares)
  console.log('\n\n🔬 HIPÓTESE 2: Testar rotas domésticas conhecidas da Azul');
  console.log('-' * 50);

  const popularDomesticRoutes = [
    { origem: 'VCP', destino: 'REC', description: 'Viracopos → Recife' },
    { origem: 'VCP', destino: 'FOR', description: 'Viracopos → Fortaleza' },
    { origem: 'VCP', destino: 'SSA', description: 'Viracopos → Salvador' },
    { origem: 'CNF', destino: 'GRU', description: 'Confins → Guarulhos' },
    { origem: 'CNF', destino: 'CGH', description: 'Confins → Congonhas' },
    { origem: 'VCP', destino: 'CWB', description: 'Viracopos → Curitiba' },
    { origem: 'VCP', destino: 'POA', description: 'Viracopos → Porto Alegre' }
  ];

  for (const route of popularDomesticRoutes) {
    try {
      console.log(`🔍 Testando ${route.origem}→${route.destino}: ${route.description}`);
      
      const params = {
        Origem: route.origem,
        Destino: route.destino,
        Ida: '2025-08-15', // Testando em agosto
        Adultos: 1,
        Criancas: 0,
        Bebes: 0,
        companhia: 3  // Azul
      };
      
      const response = await makeAuthenticatedRequest(params);
      
      if (response.Success && response.Data && response.Data[0]?.flights) {
        const flights = response.Data[0].flights;
        console.log(`   ✅ ${route.origem}→${route.destino}: ${flights.length} voos da Azul`);
        
        if (flights.length > 0) {
          console.log('   🎉 VOOS DA AZUL ENCONTRADOS!');
          console.log('   💰 Preços:', flights.map(f => f.fareGroup?.priceWithTax).filter(Boolean));
          console.log('   🛫 Números dos voos:', flights.map(f => f.segments?.[0]?.legs?.[0]?.flightNumber).filter(Boolean));
        }
      } else {
        console.log(`   ❌ ${route.origem}→${route.destino}: Sem voos da Azul`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } catch (error) {
      console.log(`   ⚠️ ${route.origem}→${route.destino}: Erro - ${error.message}`);
    }
  }

  // HIPÓTESE 3: Comparar com busca de todas as companhias para ver se Azul aparece
  console.log('\n\n🔬 HIPÓTESE 3: Buscar TODAS as companhias em rota conhecida');
  console.log('-' * 50);

  try {
    console.log('🔍 Buscando TODAS as companhias (VCP→REC)...');
    
    const allCompaniesParams = {
      Origem: 'VCP',
      Destino: 'REC',
      Ida: '2025-08-15',
      Adultos: 1,
      Criancas: 0,
      Bebes: 0,
      companhia: -1  // Todas as companhias
    };
    
    const allResponse = await makeAuthenticatedRequest(allCompaniesParams);
    
    if (allResponse.Success && allResponse.Data && allResponse.Data[0]?.flights) {
      const allFlights = allResponse.Data[0].flights;
      console.log(`✅ Total de voos encontrados: ${allFlights.length}`);
      
      // Analisa as companhias presentes
      const companiesFound = new Map();
      allFlights.forEach(flight => {
        const company = flight.validatingBy?.name || 'Desconhecida';
        companiesFound.set(company, (companiesFound.get(company) || 0) + 1);
      });
      
      console.log('\n🏢 Companhias encontradas na busca geral:');
      Array.from(companiesFound.entries()).forEach(([company, count]) => {
        const emoji = company.toLowerCase().includes('azul') ? '🎯' : '✈️';
        console.log(`   ${emoji} ${company}: ${count} voos`);
      });
      
      // Verifica especificamente por Azul
      const azulFlights = allFlights.filter(f => 
        f.validatingBy?.name?.toLowerCase().includes('azul')
      );
      
      if (azulFlights.length > 0) {
        console.log(`\n🎉 AZUL ENCONTRADA na busca geral! ${azulFlights.length} voos`);
        console.log('🔍 Detalhes do primeiro voo da Azul:');
        console.log(JSON.stringify(azulFlights[0], null, 2));
      } else {
        console.log('\n❌ Azul NÃO encontrada mesmo na busca geral');
      }
      
    } else {
      console.log('❌ Nenhum voo encontrado na busca geral');
    }
    
  } catch (error) {
    console.error('❌ Erro na busca geral:', error.message);
  }

  // HIPÓTESE 4: Verificar se há restrições de permissão para Azul
  console.log('\n\n🔬 HIPÓTESE 4: Verificar possíveis restrições de acesso');
  console.log('-' * 50);

  try {
    console.log('🔍 Testando busca específica da Azul com logs detalhados...');
    
    const azulTestParams = {
      Origem: 'VCP',
      Destino: 'GRU', // Rota muito popular
      Ida: '2025-08-15',
      Adultos: 1,
      Criancas: 0,
      Bebes: 0,
      companhia: 3  // Azul específicamente
    };
    
    console.log('📋 Parâmetros enviados:', JSON.stringify(azulTestParams, null, 2));
    
    const azulResponse = await makeAuthenticatedRequest(azulTestParams);
    
    console.log('📥 Resposta completa da API:');
    console.log(JSON.stringify(azulResponse, null, 2));
    
    // Analisa a resposta em detalhes
    if (azulResponse.Success === false) {
      console.log('❌ API retornou Success: false');
      if (azulResponse.MensagemErro) {
        console.log('🔍 Mensagem de erro:', azulResponse.MensagemErro);
      }
    } else if (azulResponse.Success === true) {
      console.log('✅ API retornou Success: true');
      if (azulResponse.Data && Array.isArray(azulResponse.Data)) {
        console.log(`📊 Data array tem ${azulResponse.Data.length} itens`);
        if (azulResponse.Data[0]?.flights) {
          console.log(`🛫 Flights array tem ${azulResponse.Data[0].flights.length} voos`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Erro no teste detalhado:', error.message);
  }

  // Conclusões
  console.log('\n\n🎯 CONCLUSÕES DA INVESTIGAÇÃO:');
  console.log('=' * 60);
  console.log('1. ✅ Azul está oficialmente listada na API (ID: 3)');
  console.log('2. ✅ Autenticação funcionando perfeitamente');
  console.log('3. ❓ Azul pode ter restrições de operação/disponibilidade');
  console.log('4. ❓ Azul pode operar apenas em períodos/rotas específicas');
  console.log('5. ❓ Pode haver configurações especiais necessárias');
  
  console.log('\n💡 PRÓXIMAS AÇÕES RECOMENDADAS:');
  console.log('• Contatar suporte técnico da Moblix sobre acesso à Azul');
  console.log('• Verificar se há configurações especiais necessárias');
  console.log('• Testar com parâmetros diferentes (classe, tipo de tarifa)');
  console.log('• Verificar se há limitações temporais ou de conta');
}

// Executar a investigação
console.log('=== INVESTIGAÇÃO DO MISTÉRIO DA AZUL ===\n');
investigateAzulMystery().then(() => {
  console.log('\n🏁 INVESTIGAÇÃO CONCLUÍDA!');
  console.log('📧 Recomenda-se entrar em contato com o suporte da Moblix');
  console.log('com as evidências coletadas para esclarecer o acesso à Azul.');
}).catch((error) => {
  console.error('\n❌ Erro durante a investigação:', error.message);
});
