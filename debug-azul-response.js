const axios = require('axios');

// Configuração da API Moblix
const API_BASE_URL = 'http://localhost:3001';

// Credenciais para autenticação
const AUTH_CREDENTIALS = {
  username: 'TooGood',
  password: '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7'
};

async function debugAzulResponse() {
  try {
    console.log('🔍 Iniciando debug da resposta da Azul...');
    
    // 1. Primeiro, obter token
    console.log('\n1️⃣ Obtendo token de autenticação...');
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', AUTH_CREDENTIALS.username);
    formData.append('password', AUTH_CREDENTIALS.password);

    const tokenResponse = await axios({
      method: 'post',
      url: `${API_BASE_URL}/api/Token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: formData
    });

    const token = tokenResponse.data.access_token;
    console.log('✅ Token obtido com sucesso');

    // 2. Buscar voos da Azul
    console.log('\n2️⃣ Buscando voos da Azul...');
    
    const hoje = new Date();
    const dataProxima = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 7);
    const dataProximaStr = dataProxima.toISOString().split('T')[0];

    const searchParams = {
      Origem: 'GRU',
      Destino: 'GIG',
      Ida: dataProximaStr,
      Adultos: 1,
      Criancas: 0,
      Bebes: 0,
      Companhia: 3, // Azul
      SoIda: true
    };

    console.log('📡 Parâmetros da busca:', searchParams);

    const flightResponse = await axios({
      method: 'post',
      url: `${API_BASE_URL}/api/ConsultaAereo/Consultar`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: searchParams
    });

    console.log('\n3️⃣ Resposta da API:');
    console.log('Status:', flightResponse.status);
    console.log('Headers:', flightResponse.headers);
    
    const responseData = flightResponse.data;
    console.log('\n📊 Estrutura da resposta:');
    console.log('Tipo da resposta:', typeof responseData);
    console.log('É array?', Array.isArray(responseData));
    console.log('Chaves da resposta:', Object.keys(responseData));
    
    if (Array.isArray(responseData)) {
      console.log('\n📋 Array de voos encontrados:', responseData.length);
      
      if (responseData.length > 0) {
        console.log('\n🔍 Primeiro voo (estrutura completa):');
        console.log(JSON.stringify(responseData[0], null, 2));
        
        console.log('\n🔍 Primeiro voo (propriedades):');
        console.log('Chaves do primeiro voo:', Object.keys(responseData[0]));
        
        // Verificar se tem fareGroup
        if (responseData[0].fareGroup) {
          console.log('\n💰 FareGroup encontrado:');
          console.log(JSON.stringify(responseData[0].fareGroup, null, 2));
        }
        
        // Verificar se tem segments
        if (responseData[0].segments) {
          console.log('\n✈️ Segments encontrados:', responseData[0].segments.length);
          console.log('Primeiro segment:', JSON.stringify(responseData[0].segments[0], null, 2));
        }
        
        // Verificar se tem Data
        if (responseData[0].Data) {
          console.log('\n📦 Data encontrado:');
          console.log(JSON.stringify(responseData[0].Data, null, 2));
        }
      }
    } else if (responseData.Data && Array.isArray(responseData.Data)) {
      console.log('\n📋 Array de voos em Data:', responseData.Data.length);
      
      if (responseData.Data.length > 0) {
        console.log('\n🔍 Primeiro voo em Data:');
        console.log(JSON.stringify(responseData.Data[0], null, 2));
      }
    } else {
      console.log('\n❓ Estrutura inesperada:');
      console.log(JSON.stringify(responseData, null, 2));
    }

    // 3. Testar extração de preços
    console.log('\n4️⃣ Testando extração de preços...');
    
    if (Array.isArray(responseData) && responseData.length > 0) {
      const flight = responseData[0];
      
      console.log('\n💰 Testando diferentes caminhos de preço:');
      console.log('flight.fareGroup?.priceWithTax:', flight.fareGroup?.priceWithTax);
      console.log('flight.fareGroup?.priceInCompany:', flight.fareGroup?.priceInCompany);
      console.log('flight.segments?.[0]?.ValorSegmento:', flight.segments?.[0]?.ValorSegmento);
      console.log('flight.ValorSegmento:', flight.ValorSegmento);
      console.log('flight.price:', flight.price);
      console.log('flight.totalPrice:', flight.totalPrice);
      console.log('flight.ValorTotal:', flight.ValorTotal);
      console.log('flight.ValorTotalComTaxa:', flight.ValorTotalComTaxa);
      console.log('flight.ValorAdulto:', flight.ValorAdulto);
      console.log('flight.Preco:', flight.Preco);
      console.log('flight.Valor:', flight.Valor);
    }

  } catch (error) {
    console.error('❌ Erro durante o debug:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Executar o debug
debugAzulResponse(); 