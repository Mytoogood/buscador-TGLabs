const axios = require('axios');

async function testTapFlights() {
  try {
    console.log('🔍 Testando voos da TAP...');
    
    // Primeiro, obter token
    const tokenResponse = await axios.post('http://localhost:3000/api/Token', {
      username: 'julio.martins@moblix.com.br',
      password: 'Moblix@2024'
    });
    
    const token = tokenResponse.data.access_token;
    console.log('✅ Token obtido:', token.substring(0, 50) + '...');
    
    // Buscar voos da TAP - usando formato x-www-form-urlencoded
    const searchData = new URLSearchParams();
    searchData.append('Origem', 'SAO');
    searchData.append('Destino', 'RIO');
    searchData.append('Ida', '2025-07-03');
    searchData.append('Adultos', 1);
    searchData.append('Criancas', 0);
    searchData.append('Bebes', 0);
    searchData.append('Companhia', 11); // TAP
    
    console.log('📤 Enviando busca para TAP (form-urlencoded):', searchData.toString());
    
    const flightResponse = await axios.post('http://localhost:3000/api/ConsultaAereo/Consultar', searchData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    });
    
    console.log('📥 Resposta da API TAP:');
    console.log('Status:', flightResponse.status);
    
    const responseData = flightResponse.data;
    console.log('\n📊 Estrutura da resposta:');
    console.log('Keys:', Object.keys(responseData));
    
    if (responseData.Data) {
      console.log('\n📋 Data keys:', Object.keys(responseData.Data));
      
      if (responseData.Data.length > 0) {
        console.log('\n🔍 Primeiro item Data:');
        console.log('Keys:', Object.keys(responseData.Data[0]));
        
        if (responseData.Data[0].Ida) {
          console.log('\n✈️ Ida encontrada:');
          console.log('Ida keys:', Object.keys(responseData.Data[0].Ida));
          console.log('Ida length:', responseData.Data[0].Ida.length);
          
          if (responseData.Data[0].Ida.length > 0) {
            console.log('\n🎯 Primeiro voo Ida:');
            console.log(JSON.stringify(responseData.Data[0].Ida[0], null, 2));
          }
        }
        
        if (responseData.Data[0].Volta) {
          console.log('\n🔄 Volta encontrada:');
          console.log('Volta keys:', Object.keys(responseData.Data[0].Volta));
          console.log('Volta length:', responseData.Data[0].Volta.length);
        }
        
        if (responseData.Data[0].flights) {
          console.log('\n✈️ Flights encontrado:');
          console.log('Flights keys:', Object.keys(responseData.Data[0].flights));
          console.log('Flights length:', responseData.Data[0].flights.length);
          
          if (responseData.Data[0].flights.length > 0) {
            console.log('\n🎯 Primeiro voo flights:');
            console.log(JSON.stringify(responseData.Data[0].flights[0], null, 2));
          }
        }
      }
    }
    
    // Verificar se há mensagens de erro
    if (responseData.Mensagem) {
      console.log('\n⚠️ Mensagem da API:', responseData.Mensagem);
    }
    
    if (responseData.Erro) {
      console.log('\n❌ Erro da API:', responseData.Erro);
    }
    
    // Verificar se a resposta está vazia
    if (!responseData.Data || responseData.Data.length === 0) {
      console.log('\n📭 Resposta vazia - nenhum voo encontrado para TAP');
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar TAP:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testTapFlights(); 