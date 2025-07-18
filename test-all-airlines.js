import https from 'https';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Configurações da API
const API_CONFIG = {
  baseUrl: 'https://api.moblix.com.br',
  username: 'TooGood',
  password: '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7'
};

// Lista de companhias aéreas para testar
const AIRLINES = [
  { id: -1, name: 'Todas', description: 'Busca em todas as companhias disponíveis' },
  { id: 1, name: 'Latam', description: 'LATAM Airlines' },
  { id: 2, name: 'Gol', description: 'GOL Linhas Aéreas' },
  { id: 3, name: 'Azul', description: 'Azul Linhas Aéreas' },
  { id: 11, name: 'Tap', description: 'TAP Air Portugal' },
  { id: 13, name: 'Copa', description: 'Copa Airlines' },
  { id: 22, name: 'AmericanAirlines', description: 'American Airlines' },
  { id: 26, name: 'Iberia', description: 'Iberia' },
  { id: 34, name: 'Livelo', description: 'Livelo' },
  { id: 1200, name: 'Interline', description: 'Azul Interline' },
  { id: 0, name: 'Nenhuma', description: 'Nenhuma companhia específica' }
];

// Função para fazer requisição HTTP
function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({ statusCode: res.statusCode, data: response });
        } catch (error) {
          resolve({ statusCode: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => reject(error));
    if (postData) req.write(postData);
    req.end();
  });
}

// Função para autenticar e obter token
async function authenticate() {
  const authOptions = {
    hostname: 'api.moblix.com.br',
    port: 443,
    path: '/api/Token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'Origin': 'externo'
    }
  };

  const authData = `grant_type=password&username=${API_CONFIG.username}&password=${API_CONFIG.password}`;

  try {
    const response = await makeRequest(authOptions, authData);
    if (response.statusCode === 200 && response.data.access_token) {
      return response.data.access_token;
    }
    throw new Error('Falha na autenticação');
  } catch (error) {
    throw new Error(`Erro na autenticação: ${error.message}`);
  }
}

// Função para buscar voos de uma companhia específica
async function searchFlights(token, airlineId, airlineName) {
  const searchOptions = {
    hostname: 'api.moblix.com.br',
    port: 443,
    path: '/api/ConsultaAereo/Consultar',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Origin': 'externo'
    }
  };

  const searchData = JSON.stringify({
    Origem: 'CGH',
    Destino: 'GIG',
    Ida: '2025-07-13',
    Adultos: 1,
    Criancas: 0,
    Bebes: 0,
    Companhia: airlineId
  });

  try {
    const response = await makeRequest(searchOptions, searchData);
    return {
      airline: airlineName,
      airlineId: airlineId,
      statusCode: response.statusCode,
      success: response.statusCode === 200 && response.data && response.data.Success,
      data: response.data
    };
  } catch (error) {
    return {
      airline: airlineName,
      airlineId: airlineId,
      statusCode: 0,
      success: false,
      error: error.message
    };
  }
}

// Função para analisar resultados de voos
function analyzeFlightResults(results) {
  console.log('\n=== ANÁLISE COMPLETA DOS RESULTADOS ===\n');
  
  const successfulSearches = [];
  const failedSearches = [];
  
  results.forEach(result => {
    if (result.success && result.data && result.data.Data && result.data.Data.length > 0 && result.data.Data[0].Ida && result.data.Data[0].Ida.length > 0) {
      successfulSearches.push(result);
    } else {
      failedSearches.push(result);
    }
  });
  
  console.log(`✅ COMPANHIAS COM VOOS ENCONTRADOS: ${successfulSearches.length}`);
  console.log(`❌ COMPANHIAS SEM VOOS: ${failedSearches.length}`);
  
  // Análise detalhada das companhias com voos
  if (successfulSearches.length > 0) {
    console.log('\n🛫 COMPANHIAS COM VOOS DISPONÍVEIS:\n');
    
    successfulSearches.forEach(result => {
      const flights = result.data.Data[0].Ida;
      const uniqueFlights = new Set();
      const routes = new Set();
      let totalSegments = 0;
      
      flights.forEach(flight => {
        if (flight.Voos) {
          flight.Voos.forEach(segment => {
            uniqueFlights.add(segment.Numero);
            routes.add(`${segment.Origem} → ${segment.Destino}`);
            totalSegments++;
          });
        }
      });
      
      console.log(`📊 ${result.airline.toUpperCase()} (ID: ${result.airlineId})`);
      console.log(`   • Opções de viagem: ${flights.length}`);
      console.log(`   • Voos únicos: ${uniqueFlights.size}`);
      console.log(`   • Total de segmentos: ${totalSegments}`);
      console.log(`   • Rotas: ${Array.from(routes).join(', ')}`);
      
      // Mostrar preços se disponíveis
      if (flights.length > 0 && flights[0].ValorTotal) {
        const prices = flights.map(f => f.ValorTotal).sort((a, b) => a - b);
        console.log(`   • Preços: R$ ${prices[0]} - R$ ${prices[prices.length - 1]}`);
      }
      console.log('');
    });
  }
  
  // Companhias sem voos
  if (failedSearches.length > 0) {
    console.log('\n❌ COMPANHIAS SEM VOOS DISPONÍVEIS:\n');
    failedSearches.forEach(result => {
      let reason = 'Sem voos disponíveis';
      if (!result.success) {
        reason = result.error || `Erro HTTP ${result.statusCode}`;
      } else if (result.data && result.data.Ida && result.data.Ida.length === 0) {
        reason = 'Nenhum voo encontrado para esta rota/data';
      }
      console.log(`   • ${result.airline} (ID: ${result.airlineId}): ${reason}`);
    });
  }
}

// Função principal
async function testAllAirlines() {
  console.log('🚀 INICIANDO TESTE DE TODAS AS COMPANHIAS AÉREAS\n');
  console.log('📍 Rota: CGH (São Paulo) → GIG (Rio de Janeiro)');
  console.log('📅 Data: 13/07/2025');
  console.log('👥 Passageiros: 1 adulto\n');
  
  try {
    // Autenticar
    console.log('🔐 Autenticando...');
    const token = await authenticate();
    console.log('✅ Autenticação realizada com sucesso\n');
    
    // Testar cada companhia
    console.log('🔍 Testando companhias aéreas...\n');
    const results = [];
    
    for (const airline of AIRLINES) {
      console.log(`   Testando ${airline.name} (ID: ${airline.id})...`);
      
      try {
        const result = await searchFlights(token, airline.id, airline.name);
        results.push(result);
        
        if (result.success && result.data && result.data.Ida && result.data.Ida.length > 0) {
          console.log(`   ✅ ${airline.name}: ${result.data.Ida.length} opções encontradas`);
        } else {
          console.log(`   ❌ ${airline.name}: Nenhum voo encontrado`);
        }
      } catch (error) {
        console.log(`   ❌ ${airline.name}: Erro - ${error.message}`);
        results.push({
          airline: airline.name,
          airlineId: airline.id,
          success: false,
          error: error.message
        });
      }
      
      // Delay entre requisições para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Analisar resultados
    analyzeFlightResults(results);
    
    // Salvar resultados detalhados
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `airline-test-results-${timestamp}.json`;
    fs.writeFileSync(filename, JSON.stringify(results, null, 2));
    console.log(`\n💾 Resultados salvos em: ${filename}`);
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

// Executar teste
testAllAirlines();
