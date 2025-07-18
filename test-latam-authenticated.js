import axios from 'axios';

// Configuração da API
const API_BASE_URL = 'https://api.moblix.com.br';
const AUTH_CREDENTIALS = {
  username: 'TooGood',
  password: '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7'
};

// Função para obter token de autenticação
async function getAuthToken() {
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

    console.log('✅ Token obtido com sucesso');
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
      url: `${API_BASE_URL}/aereo/api/consulta`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      data: params
    });

    return response.data;
  } catch (error) {
    console.error('❌ Erro ao buscar voos:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    throw error;
  }
}

// Função principal de teste
async function testLatamFlights() {
  try {
    console.log('🔐 Autenticando na API...');
    const token = await getAuthToken();
    
    console.log('\\n=== TESTE 1: BUSCA ESPECÍFICA AZUL (Companhia: 3) ===');
    
    // Parâmetros para buscar apenas AZUL
    const paramsAzul = {
      Origem: 'BSB',
      Destino: 'GRU',
      Ida: '2025-08-15',
      Adultos: 1,
      Criancas: 0,
      Bebes: 0,
      Companhia: 3 // AZUL
    };

    const responseAzul = await searchFlights(token, paramsAzul);
    
    console.log('📊 Tipo de resposta:', typeof responseAzul);
    console.log('📊 Keys da resposta:', Object.keys(responseAzul || {}));
    console.log('📊 Resposta completa:', JSON.stringify(responseAzul, null, 2));
    
    // Extrai voos da resposta
    let azulFlights = [];
    if (responseAzul?.Ida && Array.isArray(responseAzul.Ida)) {
      azulFlights = responseAzul.Ida;
    } else if (responseAzul?.Data && Array.isArray(responseAzul.Data)) {
      azulFlights = responseAzul.Data;
    }

    console.log('🛫 Total de voos AZUL encontrados:', azulFlights.length);
    
    if (azulFlights.length > 0) {
      console.log('\\n📋 Primeiros 10 voos AZUL:');
      azulFlights.slice(0, 10).forEach((flight, idx) => {
        const preco = flight.ValorTotalComTaxa || flight.ValorTotal || flight.ValorAdulto || 0;
        const numero = flight.Voos?.[0]?.Numero || 'N/A';
        console.log(`${idx + 1}. Preço: R$ ${preco.toFixed(2)}, Número: ${numero}, Companhia: ${flight.Companhia}`);
      });
      
      // Analisa o primeiro voo em detalhe
      console.log('\\n🔍 ANÁLISE DETALHADA DO PRIMEIRO VOO:');
      const firstFlight = azulFlights[0];
      console.log('- Companhia:', firstFlight.Companhia);
      console.log('- ValorTotalComTaxa:', firstFlight.ValorTotalComTaxa);
      console.log('- ValorTotal:', firstFlight.ValorTotal);
      console.log('- ValorAdulto:', firstFlight.ValorAdulto);
      console.log('- Voos:', firstFlight.Voos);
      console.log('- Tarifas:', firstFlight.Tarifas);
      
      // Verifica se há preços zerados
      const zerosCount = azulFlights.filter(f => {
        const preco = f.ValorTotalComTaxa || f.ValorTotal || f.ValorAdulto || 0;
        return preco === 0;
      }).length;
      
      console.log(`\\n⚠️  Voos com preço zero: ${zerosCount} de ${azulFlights.length}`);
    }

    console.log('\\n=== TESTE 2: BUSCA TODAS AS COMPANHIAS (Companhia: -1) ===');
    
    // Parâmetros para buscar todas as companhias
    const paramsAll = {
      Origem: 'BSB',
      Destino: 'GRU',
      Ida: '2025-08-15',
      Adultos: 1,
      Criancas: 0,
      Bebes: 0,
      Companhia: -1 // Todas as companhias
    };

    const responseAll = await searchFlights(token, paramsAll);
    
    // Extrai voos da resposta
    let allFlights = [];
    if (responseAll?.Ida && Array.isArray(responseAll.Ida)) {
      allFlights = responseAll.Ida;
    } else if (responseAll?.Data && Array.isArray(responseAll.Data)) {
      allFlights = responseAll.Data;
    }

    console.log('🌍 Total de voos (todas as companhias):', allFlights.length);
    
    // Filtra apenas os voos da AZUL
    const azulFromAll = allFlights.filter(flight => {
      const companhia = flight.Companhia || flight.CompanhiaId || flight.IdCia;
      return companhia === 3 || companhia === '3';
    });

    console.log('🎯 Voos da AZUL encontrados na busca geral:', azulFromAll.length);
    
    if (azulFromAll.length > 0) {
      console.log('\\n📋 Primeiros 10 voos AZUL da busca geral:');
      azulFromAll.slice(0, 10).forEach((flight, idx) => {
        const preco = flight.ValorTotalComTaxa || flight.ValorTotal || flight.ValorAdulto || 0;
        const numero = flight.Voos?.[0]?.Numero || 'N/A';
        console.log(`${idx + 1}. Preço: R$ ${preco.toFixed(2)}, Número: ${numero}, Companhia: ${flight.Companhia}`);
      });
      
      // Verifica se há preços zerados na busca geral
      const zerosCountAll = azulFromAll.filter(f => {
        const preco = f.ValorTotalComTaxa || f.ValorTotal || f.ValorAdulto || 0;
        return preco === 0;
      }).length;
      
      console.log(`\\n⚠️  Voos AZUL com preço zero na busca geral: ${zerosCountAll} de ${azulFromAll.length}`);
    }

    console.log('\\n=== COMPARAÇÃO FINAL ===');
    console.log(`📊 Busca específica AZUL: ${azulFlights.length} voos`);
    console.log(`📊 AZUL na busca geral: ${azulFromAll.length} voos`);
    console.log(`📊 Diferença: ${azulFromAll.length - azulFlights.length} voos`);
    
    if (azulFromAll.length > azulFlights.length) {
      console.log('\\n🔍 CONCLUSÃO: A busca geral retorna mais voos da AZUL do que a busca específica!');
      console.log('💡 RECOMENDAÇÃO: Usar busca geral e filtrar no frontend para obter mais resultados.');
    } else {
      console.log('\\n✅ CONCLUSÃO: A busca específica funciona corretamente.');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

// Executa o teste
testLatamFlights();
