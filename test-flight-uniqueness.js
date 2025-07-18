import axios from 'axios';

// Configuração da API Moblix
const API_BASE_URL = 'https://api.moblix.com.br';
const CREDENTIALS = {
  username: 'TooGood',
  password: '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7'
};

// Função para obter token
async function getToken() {
  try {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', CREDENTIALS.username);
    formData.append('password', CREDENTIALS.password);

    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/api/Token`,
      data: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Origin': 'externo'
      },
      timeout: 10000
    });

    return response.data.access_token;
  } catch (error) {
    console.error('❌ Erro ao obter token:', error.message);
    throw error;
  }
}

// Função para buscar voos
async function searchFlights(token, params) {
  try {
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/api/ConsultaAereo/Consultar`,
      data: params,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      timeout: 30000
    });

    return response.data;
  } catch (error) {
    console.error('❌ Erro na busca de voos:', error.message);
    throw error;
  }
}

// Função para deduplificar voos
function deduplicateFlights(flights) {
  if (!flights || flights.length === 0) return [];
  
  const flightGroups = new Map();
  let duplicatesCount = 0;
  
  flights.forEach((flight) => {
    // Cria uma chave baseada no voo físico (sem preço)
    const companhia = flight.Companhia || flight.CompanhiaId || flight.IdCia || 'Unknown';
    const origem = flight.Origem || 'Unknown';
    const destino = flight.Destino || 'Unknown';
    const numeroVoo = flight.Voos?.[0]?.Numero || flight.FlightCode || '';
    const horarioSaida = flight.Voos?.[0]?.Saida || flight.HorarioSaida || '';
    
    // Chave do voo físico (sem preço, porque o mesmo voo pode ter várias tarifas)
    const flightKey = `${companhia}-${origem}-${destino}-${numeroVoo}-${horarioSaida.substring(0, 16)}`;
    
    const preco = flight.ValorTotalComTaxa || flight.ValorTotal || flight.ValorAdulto || 0;
    
    if (!flightGroups.has(flightKey)) {
      // Primeiro voo com esta chave
      flightGroups.set(flightKey, flight);
    } else {
      // Voo já existe, mantém apenas o com menor preço
      const existingFlight = flightGroups.get(flightKey);
      const existingPrice = existingFlight.ValorTotalComTaxa || existingFlight.ValorTotal || existingFlight.ValorAdulto || 0;
      
      if (preco < existingPrice && preco > 0) {
        // Substitui pelo voo com menor preço
        flightGroups.set(flightKey, flight);
        console.log(`🔄 Melhor preço encontrado: ${companhia} ${numeroVoo} - R$ ${preco.toFixed(2)} (era R$ ${existingPrice.toFixed(2)})`);
      } else {
        duplicatesCount++;
        console.log(`🔄 Duplicata removida: ${companhia} ${numeroVoo} - R$ ${preco.toFixed(2)}`);
      }
    }
  });
  
  const deduped = Array.from(flightGroups.values());
  console.log(`🔄 Deduplicação concluída: ${flights.length} voos → ${deduped.length} voos únicos (melhores preços)`);
  
  if (duplicatesCount > 0) {
    console.log(`📋 ${duplicatesCount} duplicatas foram encontradas e tratadas`);
  }
  
  return deduped;
}

// Função para analisar voos únicos
function analyzeFlights(flights) {
  console.log('📊 ANÁLISE DOS VOOS ÚNICOS:');
  
  const companies = new Set();
  const flightNumbers = new Set();
  const routes = new Set();
  
  flights.forEach(flight => {
    // Analisa companhias
    const companhia = flight.Cia?.Nome || flight.Companhia || 'Unknown';
    companies.add(companhia);
    
    // Analisa números de voo
    const numeroVoo = flight.Voos?.[0]?.Numero || 'Unknown';
    flightNumbers.add(numeroVoo);
    
    // Analisa rotas
    const rota = `${flight.Origem || 'Unknown'}-${flight.Destino || 'Unknown'}`;
    routes.add(rota);
  });
  
  console.log(`🏢 Companhias: ${Array.from(companies).join(', ')}`);
  console.log(`✈️ Números de voo únicos: ${flightNumbers.size}`);
  console.log(`🗺️ Rotas: ${Array.from(routes).join(', ')}`);
  
  // Mostra primeiros 5 voos únicos
  console.log('\n📋 PRIMEIROS 5 VOOS ÚNICOS:');
  flights.slice(0, 5).forEach((flight, index) => {
    console.log(`${index + 1}. ${flight.Cia?.Nome || 'Unknown'} ${flight.Voos?.[0]?.Numero || 'N/A'}`);
    console.log(`   ${flight.Origem || 'N/A'} → ${flight.Destino || 'N/A'}`);
    console.log(`   ${flight.Voos?.[0]?.Saida || 'N/A'} → ${flight.Voos?.[0]?.Chegada || 'N/A'}`);
    console.log(`   R$ ${flight.ValorTotalComTaxa || flight.ValorTotal || flight.ValorAdulto || 0}`);
    console.log('');
  });
}

// Função principal
async function main() {
  try {
    console.log('🚀 TESTE DE UNICIDADE DOS DADOS DA API MOBLIX');
    console.log('==============================================\n');
    
    // 1. Obter token
    console.log('1️⃣ Obtendo token...');
    const token = await getToken();
    console.log('✅ Token obtido com sucesso\n');
    
    // 2. Buscar voos com parâmetros que você mencionou
    console.log('2️⃣ Buscando voos SAO → RIO...');
    const searchParams = {
      "Origem": "SAO",
      "Destino": "RIO", 
      "Ida": "2025-07-11",
      "Adultos": 1,
      "Criancas": 0,
      "Bebes": 0,
      "Companhia": -1 // Todas as companhias
    };
    
    const response = await searchFlights(token, searchParams);
    
    console.log('✅ Busca realizada com sucesso');
    console.log('📊 Dados recebidos:', {
      Success: response.Success,
      HasResult: response.HasResult,
      TotalItens: response.TotalItens,
      DataLength: response.Data?.length || 0
    });
    
    // 3. Extrair todos os voos
    let allFlights = [];
    if (response.Data && Array.isArray(response.Data)) {
      response.Data.forEach(dataItem => {
        if (dataItem.flights && Array.isArray(dataItem.flights)) {
          allFlights.push(...dataItem.flights);
        } else if (dataItem.Ida && Array.isArray(dataItem.Ida)) {
          allFlights.push(...dataItem.Ida);
        }
      });
    }
    
    console.log(`📋 Total de voos extraídos: ${allFlights.length}`);
    
    if (allFlights.length === 0) {
      console.log('❌ Nenhum voo encontrado na resposta da API');
      return;
    }
    
    // 4. Analisar antes da deduplicação
    console.log('\n3️⃣ Analisando voos ANTES da deduplicação...');
    analyzeFlights(allFlights);
    
    // 5. Deduplificar
    console.log('\n4️⃣ Deduplicando voos...');
    const uniqueFlights = deduplicateFlights(allFlights);
    
    // 6. Analisar após deduplicação
    console.log('\n5️⃣ Analisando voos APÓS deduplicação...');
    analyzeFlights(uniqueFlights);
    
    // 7. Verificar se ainda há duplicatas
    console.log('\n6️⃣ Verificação final de duplicatas...');
    const flightCodes = new Set();
    const duplicateCheck = [];
    
    uniqueFlights.forEach(flight => {
      const code = `${flight.Cia?.Nome || 'Unknown'}-${flight.Voos?.[0]?.Numero || 'N/A'}`;
      if (flightCodes.has(code)) {
        duplicateCheck.push(code);
      } else {
        flightCodes.add(code);
      }
    });
    
    if (duplicateCheck.length > 0) {
      console.log('⚠️ Ainda existem duplicatas:', duplicateCheck);
    } else {
      console.log('✅ Nenhuma duplicata encontrada - dados únicos!');
    }
    
    console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

// Executar teste
main();
