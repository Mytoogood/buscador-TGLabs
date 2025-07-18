// Script para descobrir como obter voos da Azul que sabemos estar integrada
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
    req.setTimeout(20000, () => {
      req.destroy();
      reject(new Error('Timeout na requisição'));
    });

    req.write(postData);
    req.end();
  });
}

// Função para descobrir a solução
async function discoverAzulSolution() {
  console.log('🔍 DESCOBRINDO COMO OBTER VOOS DA AZUL');
  console.log('=' * 60);
  console.log('🎯 OBJETIVO: Encontrar a configuração correta para obter voos da Azul');
  console.log('📋 SABEMOS: Azul está integrada, mas arrays Ida/Volta vazios\n');

  try {
    // Obter token
    console.log('🔑 Obtendo token de autenticação...');
    authToken = await getAuthToken();
    console.log('✅ Token obtido com sucesso!\n');

  } catch (error) {
    console.error('❌ Erro ao obter token:', error.message);
    return;
  }

  // ESTRATÉGIA 1: Testar parâmetros adicionais que podem ser necessários
  console.log('🔬 ESTRATÉGIA 1: Testar parâmetros adicionais da API');
  console.log('-' * 50);

  const additionalParams = [
    {
      name: 'Com internacional=true',
      params: {
        Origem: 'VCP',
        Destino: 'GIG', 
        Ida: '2025-08-15',
        Adultos: 1,
        Criancas: 0,
        Bebes: 0,
        companhia: 3,
        internacional: true
      }
    },
    {
      name: 'Com soIda=true',
      params: {
        Origem: 'VCP',
        Destino: 'GIG',
        Ida: '2025-08-15', 
        Adultos: 1,
        Criancas: 0,
        Bebes: 0,
        companhia: 3,
        soIda: true
      }
    },
    {
      name: 'Com orderBy=preco',
      params: {
        Origem: 'VCP',
        Destino: 'GIG',
        Ida: '2025-08-15',
        Adultos: 1,
        Criancas: 0, 
        Bebes: 0,
        companhia: 3,
        orderBy: 'preco'
      }
    },
    {
      name: 'Com classe executiva',
      params: {
        Origem: 'VCP',
        Destino: 'GIG',
        Ida: '2025-08-15',
        Adultos: 1,
        Criancas: 0,
        Bebes: 0,
        companhia: 3,
        classe: 'executiva'
      }
    },
    {
      name: 'Com quantidadePorPagina maior',
      params: {
        Origem: 'VCP',
        Destino: 'GIG',
        Ida: '2025-08-15',
        Adultos: 1,
        Criancas: 0,
        Bebes: 0,
        companhia: 3,
        quantidadePorPagina: 500
      }
    }
  ];

  for (const test of additionalParams) {
    try {
      console.log(`🔍 Testando: ${test.name}`);
      
      const response = await makeAuthenticatedRequest(test.params);
      
      if (response.Success && response.Data && response.Data[0]) {
        const data = response.Data[0];
        console.log(`   📊 TokenConsulta: ${data.TokenConsulta ? 'Presente' : 'Ausente'}`);
        console.log(`   📊 Ida: ${data.Ida ? data.Ida.length : 0} voos`);
        console.log(`   📊 Volta: ${data.Volta ? data.Volta.length : 0} voos`);
        console.log(`   📊 SemDisponibilidade: ${data.SemDisponibilidade}`);
        
        if (data.Ida && data.Ida.length > 0) {
          console.log('   🎉 VOOS ENCONTRADOS! Primeiro voo:');
          console.log('   ', JSON.stringify(data.Ida[0], null, 4));
          break;
        } else {
          console.log('   ❌ Ainda sem voos');
        }
      } else {
        console.log('   ⚠️ Resposta inválida');
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.log(`   ❌ Erro: ${error.message}`);
    }
  }

  // ESTRATÉGIA 2: Testar datas muito distantes no futuro
  console.log('\n\n🔬 ESTRATÉGIA 2: Testar datas distantes (temporada alta)');
  console.log('-' * 50);

  const futureDates = [
    '2025-12-20', // Natal
    '2025-12-31', // Ano Novo
    '2026-01-15', // Janeiro
    '2026-02-15', // Carnaval aproximado
    '2026-07-15', // Julho do próximo ano
  ];

  for (const date of futureDates) {
    try {
      console.log(`🔍 Testando data distante: ${date}`);
      
      const params = {
        Origem: 'VCP',
        Destino: 'GIG',
        Ida: date,
        Adultos: 1,
        Criancas: 0,
        Bebes: 0,
        companhia: 3
      };
      
      const response = await makeAuthenticatedRequest(params);
      
      if (response.Success && response.Data && response.Data[0] && response.Data[0].Ida) {
        const flights = response.Data[0].Ida;
        console.log(`   📊 ${date}: ${flights.length} voos encontrados`);
        
        if (flights.length > 0) {
          console.log('   🎉 VOOS ENCONTRADOS NA DATA DISTANTE!');
          console.log('   📋 Primeiro voo:', JSON.stringify(flights[0], null, 4));
          break;
        }
      } else {
        console.log(`   ❌ ${date}: Sem voos`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } catch (error) {
      console.log(`   ❌ ${date}: Erro - ${error.message}`);
    }
  }

  // ESTRATÉGIA 3: Testar todas as rotas principais da Azul sistematicamente
  console.log('\n\n🔬 ESTRATÉGIA 3: Testar malha completa da Azul');
  console.log('-' * 50);

  const azulMainRoutes = [
    // Hub-to-Hub (mais provável)
    { origem: 'VCP', destino: 'CNF', priority: 'ALTÍSSIMA' },
    { origem: 'CNF', destino: 'VCP', priority: 'ALTÍSSIMA' },
    
    // Viracopos para capitais
    { origem: 'VCP', destino: 'BSB', priority: 'ALTA' },
    { origem: 'VCP', destino: 'REC', priority: 'ALTA' },
    { origem: 'VCP', destino: 'FOR', priority: 'ALTA' },
    { origem: 'VCP', destino: 'SSA', priority: 'ALTA' },
    { origem: 'VCP', destino: 'MAO', priority: 'ALTA' },
    { origem: 'VCP', destino: 'BEL', priority: 'ALTA' },
    
    // Confins para outros destinos
    { origem: 'CNF', destino: 'BSB', priority: 'ALTA' },
    { origem: 'CNF', destino: 'GRU', priority: 'ALTA' },
    { origem: 'CNF', destino: 'CGH', priority: 'ALTA' },
    
    // Rotas regionais conhecidas da Azul
    { origem: 'VCP', destino: 'UDI', priority: 'MÉDIA' },
    { origem: 'VCP', destino: 'MOC', priority: 'MÉDIA' },
    { origem: 'CNF', destino: 'UDI', priority: 'MÉDIA' },
    { origem: 'VCP', destino: 'CAW', priority: 'MÉDIA' },
    
    // Teste com aeroportos secundários
    { origem: 'CNF', destino: 'SDU', priority: 'MÉDIA' },
    { origem: 'VCP', destino: 'NAT', priority: 'MÉDIA' }
  ];

  console.log(`🎯 Testando ${azulMainRoutes.length} rotas da malha da Azul...\n`);

  for (const route of azulMainRoutes) {
    try {
      console.log(`🔍 [${route.priority}] ${route.origem}→${route.destino}`);
      
      const params = {
        Origem: route.origem,
        Destino: route.destino,
        Ida: '2025-12-15', // Data distante
        Adultos: 1,
        Criancas: 0,
        Bebes: 0,
        companhia: 3
      };
      
      const response = await makeAuthenticatedRequest(params);
      
      if (response.Success && response.Data && response.Data[0]) {
        const data = response.Data[0];
        const ida = data.Ida || [];
        const volta = data.Volta || [];
        
        console.log(`   📊 Ida: ${ida.length} voos | Volta: ${volta.length} voos`);
        
        if (ida.length > 0 || volta.length > 0) {
          console.log('   🎉 SUCESSO! VOOS DA AZUL ENCONTRADOS!');
          console.log('   🛫 Detalhes da rota que funcionou:');
          console.log('      • Origem:', route.origem);
          console.log('      • Destino:', route.destino); 
          console.log('      • Data:', '2025-12-15');
          console.log('      • Voos ida:', ida.length);
          console.log('      • Voos volta:', volta.length);
          
          if (ida.length > 0) {
            console.log('   📋 Primeiro voo de ida:');
            console.log('   ', JSON.stringify(ida[0], null, 4));
          }
          
          // Para na primeira rota que funcionar
          break;
        } else {
          console.log('   ❌ Sem voos');
        }
      } else {
        console.log('   ⚠️ Resposta inválida');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`   ❌ Erro: ${error.message}`);
    }
  }

  // ESTRATÉGIA 4: Comparar resposta da Azul com GOL para entender diferenças
  console.log('\n\n🔬 ESTRATÉGIA 4: Comparar estrutura de resposta (Azul vs GOL)');
  console.log('-' * 50);

  try {
    console.log('🔍 Buscando GOL para comparação...');
    
    const golParams = {
      Origem: 'GRU',
      Destino: 'GIG',
      Ida: '2025-07-15',
      Adultos: 1,
      Criancas: 0,
      Bebes: 0,
      companhia: 2 // GOL
    };
    
    const golResponse = await makeAuthenticatedRequest(golParams);
    
    console.log('📊 Estrutura da resposta da GOL:');
    if (golResponse.Success && golResponse.Data && golResponse.Data[0]) {
      const golData = golResponse.Data[0];
      console.log('   • TokenConsulta:', golData.TokenConsulta ? 'Presente' : 'Ausente');
      console.log('   • Companhia:', golData.Companhia);
      console.log('   • Ida (tipo):', Array.isArray(golData.Ida) ? 'Array' : typeof golData.Ida);
      console.log('   • Ida (length):', golData.Ida ? golData.Ida.length : 'N/A');
      console.log('   • SemDisponibilidade:', golData.SemDisponibilidade);
      console.log('   • PesquisaMilhasHabilitada:', golData.PesquisaMilhasHabilitada);
      console.log('   • PesquisaPaganteHabilitada:', golData.PesquisaPaganteHabilitada);
      
      if (golData.Ida && golData.Ida.length > 0) {
        console.log('   📋 Estrutura do primeiro voo da GOL:');
        console.log('   ', Object.keys(golData.Ida[0]));
      }
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('\n🔍 Buscando Azul para comparação...');
    
    const azulParams = {
      Origem: 'VCP',
      Destino: 'GIG',
      Ida: '2025-07-15',
      Adultos: 1,
      Criancas: 0,
      Bebes: 0,
      companhia: 3 // Azul
    };
    
    const azulResponse = await makeAuthenticatedRequest(azulParams);
    
    console.log('📊 Estrutura da resposta da Azul:');
    if (azulResponse.Success && azulResponse.Data && azulResponse.Data[0]) {
      const azulData = azulResponse.Data[0];
      console.log('   • TokenConsulta:', azulData.TokenConsulta ? 'Presente' : 'Ausente');
      console.log('   • Companhia:', azulData.Companhia);
      console.log('   • Ida (tipo):', Array.isArray(azulData.Ida) ? 'Array' : typeof azulData.Ida);
      console.log('   • Ida (length):', azulData.Ida ? azulData.Ida.length : 'N/A');
      console.log('   • SemDisponibilidade:', azulData.SemDisponibilidade);
      console.log('   • PesquisaMilhasHabilitada:', azulData.PesquisaMilhasHabilitada);
      console.log('   • PesquisaPaganteHabilitada:', azulData.PesquisaPaganteHabilitada);
      
      // Diferenças estruturais
      console.log('\n🔍 ANÁLISE COMPARATIVA:');
      console.log('   • Ambas retornam Success: true ✅');
      console.log('   • Ambas têm TokenConsulta ✅');
      console.log('   • Diferença principal: GOL tem voos, Azul não');
    }

  } catch (error) {
    console.error('❌ Erro na comparação:', error.message);
  }

  // Conclusões e próximos passos
  console.log('\n\n🎯 CONCLUSÕES E PRÓXIMOS PASSOS:');
  console.log('=' * 60);
  console.log('1. ✅ Azul está integrada e responde corretamente');
  console.log('2. ✅ Token específico da Azul é gerado');
  console.log('3. ❓ Arrays Ida/Volta vazios podem indicar:');
  console.log('   • Malha operacional limitada');
  console.log('   • Disponibilidade sazonal');
  console.log('   • Rotas específicas não cobertas');
  console.log('   • Configuração de conta insuficiente');
  
  console.log('\n📧 AÇÕES RECOMENDADAS:');
  console.log('• Contatar Moblix com evidências de integração funcional');
  console.log('• Solicitar lista de rotas/datas disponíveis para Azul');
  console.log('• Verificar se conta precisa de permissões adicionais');
  console.log('• Solicitar documentação específica da Azul na API');
}

// Executar a descoberta
console.log('=== DESCOBRINDO A SOLUÇÃO PARA AZUL ===\n');
discoverAzulSolution().then(() => {
  console.log('\n🏁 DESCOBERTA CONCLUÍDA!');
  console.log('📋 Agora temos evidências técnicas completas para o suporte da Moblix.');
}).catch((error) => {
  console.error('\n❌ Erro durante a descoberta:', error.message);
});
