import axios from 'axios';

// Teste direto da API Moblix (sem proxy)
async function testMoblixDirect() {
  console.log('🧪 Testando API Moblix DIRETAMENTE');
  console.log('=================================');

  // Primeiro, vamos obter um token de autenticação
  console.log('\n🔐 1. Obtendo token de autenticação...');
  
  try {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', 'TooGood');
    formData.append('password', '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7');

    const authResponse = await axios({
      method: 'POST',
      url: 'https://api.moblix.com.br/api/Token',
      data: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Origin': 'externo'
      },
      timeout: 15000
    });

    console.log('✅ Token obtido com sucesso!');
    console.log('📊 Dados do token:', {
      access_token: authResponse.data.access_token ? 'Presente' : 'Ausente',
      token_type: authResponse.data.token_type,
      expires_in: authResponse.data.expires_in
    });

    const token = authResponse.data.access_token;
    
    // Agora vamos testar a busca de aeroportos
    console.log('\n🛫 2. Testando busca de aeroportos...');
    
    try {
      const airportResponse = await axios({
        method: 'GET',
        url: 'https://api.moblix.com.br/aereo/api/aeroporto?filtro=GRU',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Origin': 'externo'
        },
        timeout: 15000
      });

      console.log('✅ Aeroportos encontrados:', airportResponse.data.length);
      if (airportResponse.data.length > 0) {
        console.log('🛫 Primeiro aeroporto:', airportResponse.data[0]);
      }

    } catch (airportError) {
      console.error('❌ Erro ao buscar aeroportos:', airportError.response?.status, airportError.response?.data || airportError.message);
    }

    // Agora vamos testar a busca de voos
    console.log('\n✈️ 3. Testando busca de voos...');
    
    const flightParams = {
      Origem: 'GRU',
      Destino: 'GIG',
      Ida: '2025-07-20',
      Adultos: 1,
      Criancas: 0,
      Bebes: 0,
      Companhia: 1
    };

    console.log('📋 Parâmetros:', JSON.stringify(flightParams, null, 2));

    try {
      const flightResponse = await axios({
        method: 'POST',
        url: 'https://api.moblix.com.br/api/ConsultaAereo/Consultar',
        data: flightParams,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': 'externo'
        },
        timeout: 30000
      });

      console.log('✅ Status da resposta:', flightResponse.status);
      console.log('📊 Tipo da resposta:', typeof flightResponse.data);
      console.log('📋 É array?', Array.isArray(flightResponse.data));
      
      if (flightResponse.data) {
        console.log('🗂️ Propriedades da resposta:', Object.keys(flightResponse.data));
        
        if (flightResponse.data.Data && Array.isArray(flightResponse.data.Data)) {
          console.log(`📈 Total de voos em Data: ${flightResponse.data.Data.length}`);
          if (flightResponse.data.Data.length > 0) {
            console.log('🛫 Estrutura do primeiro voo:');
            const firstFlight = flightResponse.data.Data[0];
            console.log('Propriedades:', Object.keys(firstFlight));
            console.log('Dados:', JSON.stringify(firstFlight, null, 2));
          }
        } else if (Array.isArray(flightResponse.data)) {
          console.log(`📈 Array direto com ${flightResponse.data.length} voos`);
          if (flightResponse.data.length > 0) {
            console.log('🛫 Primeiro voo:', JSON.stringify(flightResponse.data[0], null, 2));
          }
        } else {
          console.log('📄 Resposta completa:', JSON.stringify(flightResponse.data, null, 2));
        }
      }

    } catch (flightError) {
      console.error('❌ Erro ao buscar voos:', flightError.response?.status, flightError.response?.data || flightError.message);
    }

  } catch (authError) {
    console.error('❌ Erro na autenticação:', authError.response?.status, authError.response?.data || authError.message);
  }
}

// Executa o teste
testMoblixDirect();
