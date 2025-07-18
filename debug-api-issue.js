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
    console.log('🔐 Obtendo token de acesso...');
    
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

    console.log('✅ Token obtido:', response.data.access_token.substring(0, 50) + '...');
    return response.data.access_token;
  } catch (error) {
    console.error('❌ Erro ao obter token:', error.response?.data || error.message);
    throw error;
  }
}

// Função para testar busca de voos
async function testFlightSearch(token) {
  try {
    console.log('\n🔍 Testando busca de voos...');
    
    const searchData = {
      "Origem": "GRU",
      "Destino": "GIG", 
      "Ida": "2025-07-15", // Data futura
      "Adultos": 1,
      "Criancas": 0,
      "Bebes": 0,
      "Companhia": 1 // LATAM
    };

    console.log('📡 Parâmetros da busca:', searchData);

    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/api/ConsultaAereo/Consultar`,
      data: searchData,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      timeout: 30000
    });

    console.log('✅ Resposta da API:', {
      Success: response.data.Success,
      HasResult: response.data.HasResult,
      TotalItens: response.data.TotalItens,
      MensagemErro: response.data.MensagemErro,
      DataLength: response.data.Data?.length || 0
    });

    if (response.data.Success && response.data.Data && response.data.Data.length > 0) {
      console.log('\n📋 ESTRUTURA DOS DADOS RECEBIDOS:');
      console.log('Tipo de Data:', typeof response.data.Data);
      console.log('É array?', Array.isArray(response.data.Data));
      console.log('Primeiro elemento:', JSON.stringify(response.data.Data[0], null, 2));
      
      // Verificar se há voos dentro do primeiro elemento
      if (response.data.Data[0] && response.data.Data[0].flights) {
        console.log('\n✈️ VOOS ENCONTRADOS:');
        response.data.Data[0].flights.forEach((flight, index) => {
          console.log(`\n--- Voo ${index + 1} ---`);
          console.log('Origem:', flight.origem || flight.Origem);
          console.log('Destino:', flight.destino || flight.Destino);
          console.log('Companhia:', flight.companhia || flight.Companhia);
          console.log('Preço:', flight.preco || flight.Preco);
          console.log('Horário:', flight.horario || flight.Horario);
          console.log('Duração:', flight.duracao || flight.Duracao);
        });
      } else {
        console.log('\n🔍 EXPLORANDO ESTRUTURA DO PRIMEIRO ELEMENTO:');
        const firstElement = response.data.Data[0];
        Object.keys(firstElement).forEach(key => {
          console.log(`${key}:`, typeof firstElement[key], Array.isArray(firstElement[key]) ? `[Array com ${firstElement[key].length} itens]` : firstElement[key]);
        });
      }
    }

    return response.data;
  } catch (error) {
    console.error('❌ Erro na busca de voos:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    return error.response?.data || error;
  }
}

// Função para testar busca Reserva Fácil
async function testReservaFacil(token) {
  try {
    console.log('\n🔍 Testando busca Reserva Fácil...');
    
    const searchData = {
      "Origem": "GRU",
      "Destino": "GIG",
      "Ida": "2025-07-15",
      "Adultos": 1,
      "Criancas": 0,
      "Bebes": 0,
      "Companhia": 1
    };

    console.log('📡 Parâmetros da busca:', searchData);

    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/moblix-api/api/ReservaFacil/Consultar`,
      data: searchData,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      timeout: 30000
    });

    console.log('✅ Resposta da API Reserva Fácil:', {
      Success: response.data.Success,
      HasResult: response.data.HasResult,
      TotalItens: response.data.TotalItens,
      DataLength: response.data.Data?.length || 0
    });

    return response.data;
  } catch (error) {
    console.error('❌ Erro na busca Reserva Fácil:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    return error.response?.data || error;
  }
}

// Função principal
async function main() {
  try {
    console.log('🚀 Iniciando debug da API Moblix...');
    
    // 1. Obter token
    const token = await getToken();
    
    // 2. Testar busca padrão
    const standardResult = await testFlightSearch(token);
    
    // 3. Testar busca Reserva Fácil
    const reservaFacilResult = await testReservaFacil(token);
    
    console.log('\n📊 RESUMO DOS TESTES:');
    console.log('- Busca padrão:', standardResult.Success ? '✅ Funcionou' : '❌ Falhou');
    console.log('- Reserva Fácil:', reservaFacilResult.Success ? '✅ Funcionou' : '❌ Falhou');
    
    // 4. Testar com diferentes parâmetros se falharam
    if (!standardResult.Success) {
      console.log('\n🔧 Testando com parâmetros alternativos...');
      
      // Teste com data mais próxima
      const token2 = await getToken();
      const alternativeData = {
        "Origem": "BSB",
        "Destino": "GRU",
        "Ida": "2025-07-20",
        "Adultos": 1,
        "Criancas": 0,
        "Bebes": 0,
        "Companhia": -1 // Todas as companhias
      };
      
      console.log('📡 Testando com parâmetros alternativos:', alternativeData);
      
      const alternativeResult = await axios({
        method: 'post',
        url: `${API_BASE_URL}/api/ConsultaAereo/Consultar`,
        data: alternativeData,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token2}`
        },
        timeout: 30000
      }).catch(error => error.response?.data || error);
      
      console.log('✅ Resultado alternativo:', {
        Success: alternativeResult.Success,
        HasResult: alternativeResult.HasResult,
        MensagemErro: alternativeResult.MensagemErro
      });
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

main();
