// Script para testar diferentes rotas da Azul
import axios from 'axios';

const API_BASE_URL = 'https://api.moblix.com.br';

const AUTH_CREDENTIALS = {
  username: 'TooGood',
  password: '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7'
};

// Rotas populares onde a Azul costuma operar
const azulRoutes = [
  { origem: 'GRU', destino: 'BSB', nome: 'São Paulo → Brasília' },
  { origem: 'BSB', destino: 'GRU', nome: 'Brasília → São Paulo' },
  { origem: 'CGH', destino: 'SDU', nome: 'Congonhas → Santos Dumont' },
  { origem: 'SDU', destino: 'CGH', nome: 'Santos Dumont → Congonhas' },
  { origem: 'GRU', destino: 'FOR', nome: 'São Paulo → Fortaleza' },
  { origem: 'GRU', destino: 'REC', nome: 'São Paulo → Recife' },
  { origem: 'GRU', destino: 'SSA', nome: 'São Paulo → Salvador' },
  { origem: 'BSB', destino: 'FOR', nome: 'Brasília → Fortaleza' },
  { origem: 'GRU', destino: 'GIG', nome: 'São Paulo Guarulhos → Rio Galeão' },
  { origem: 'GIG', destino: 'GRU', nome: 'Rio Galeão → São Paulo Guarulhos' }
];

// Datas para teste (próximos 10 dias)
function getTestDates() {
  const dates = [];
  const today = new Date();
  
  for (let i = 1; i <= 10; i++) {
    const testDate = new Date(today);
    testDate.setDate(today.getDate() + i);
    dates.push(testDate.toISOString().split('T')[0]);
  }
  
  return dates;
}

async function getToken() {
  try {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', AUTH_CREDENTIALS.username);
    formData.append('password', AUTH_CREDENTIALS.password);

    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/api/Token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Origin': 'externo'
      },
      data: formData
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Erro ao obter token:', error.message);
    throw error;
  }
}

async function testAzulRoute(token, route, date) {
  try {
    const searchParams = {
      Origem: route.origem,
      Destino: route.destino,
      Ida: date,
      Adultos: 1,
      Criancas: 0,
      Bebes: 0,
      Companhia: 3, // Azul
      internacional: true
    };

    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/aereo/api/consulta`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: searchParams
    });

    const hasFlights = response.data?.Data?.[0]?.Ida?.length > 0;
    
    return {
      route: route.nome,
      date,
      hasFlights,
      flightCount: response.data?.Data?.[0]?.Ida?.length || 0,
      success: true,
      tokenConsulta: response.data?.Data?.[0]?.TokenConsulta,
      error: null
    };
  } catch (error) {
    return {
      route: route.nome,
      date,
      hasFlights: false,
      flightCount: 0,
      success: false,
      error: error.message
    };
  }
}

async function testAllAzulFlights() {
  console.log('🔍 TESTANDO TODAS AS ROTAS DA AZUL');
  console.log('=====================================\n');

  try {
    // Obter token
    console.log('1️⃣ Obtendo token de autenticação...');
    const token = await getToken();
    console.log('✅ Token obtido com sucesso\n');

    // Obter datas de teste
    const testDates = getTestDates();
    console.log(`📅 Testando ${testDates.length} datas: ${testDates[0]} até ${testDates[testDates.length - 1]}\n`);

    const results = [];
    let totalTests = 0;
    let successfulTests = 0;
    let routesWithFlights = new Set();

    // Testar cada rota com cada data
    for (const route of azulRoutes) {
      console.log(`✈️ Testando rota: ${route.nome} (${route.origem}-${route.destino})`);
      
      let routeHasFlights = false;
      
      for (const date of testDates.slice(0, 3)) { // Testa apenas 3 datas por rota para não sobrecarregar
        totalTests++;
        
        const result = await testAzulRoute(token, route, date);
        results.push(result);
        
        if (result.success) {
          successfulTests++;
        }
        
        if (result.hasFlights) {
          routeHasFlights = true;
          routesWithFlights.add(route.nome);
          console.log(`  ✅ ${date}: ${result.flightCount} voos encontrados`);
        } else {
          console.log(`  ❌ ${date}: Sem voos${result.error ? ` (${result.error})` : ''}`);
        }
        
        // Delay entre requisições
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      if (!routeHasFlights) {
        console.log(`  🔍 Nenhum voo da Azul encontrado nesta rota\n`);
      } else {
        console.log(`  🎯 Azul opera nesta rota!\n`);
      }
    }

    // Resumo final
    console.log('\n📊 RESUMO FINAL:');
    console.log('================');
    console.log(`🔢 Total de testes: ${totalTests}`);
    console.log(`✅ Testes bem-sucedidos: ${successfulTests}`);
    console.log(`❌ Testes com erro: ${totalTests - successfulTests}`);
    console.log(`✈️ Rotas com voos da Azul: ${routesWithFlights.size}`);
    
    if (routesWithFlights.size > 0) {
      console.log('\n🎯 ROTAS ONDE A AZUL OPERA:');
      Array.from(routesWithFlights).forEach(route => {
        console.log(`  ✈️ ${route}`);
      });
    } else {
      console.log('\n❌ NENHUMA ROTA COM VOOS DA AZUL ENCONTRADA');
      console.log('Possíveis causas:');
      console.log('- API não tem acesso aos voos da Azul');
      console.log('- Configuração incorreta de parâmetros');
      console.log('- Azul não está disponível na API Moblix');
      console.log('- Problema de credenciais ou permissões');
    }

    // Voos encontrados por data
    const flightsByDate = {};
    results.forEach(result => {
      if (result.hasFlights) {
        if (!flightsByDate[result.date]) {
          flightsByDate[result.date] = [];
        }
        flightsByDate[result.date].push(result.route);
      }
    });

    if (Object.keys(flightsByDate).length > 0) {
      console.log('\n📅 VOOS POR DATA:');
      Object.entries(flightsByDate).forEach(([date, routes]) => {
        console.log(`  ${date}: ${routes.length} rotas com voos`);
        routes.forEach(route => {
          console.log(`    - ${route}`);
        });
      });
    }

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  }
}

// Executar teste
testAllAzulFlights();
