const axios = require('axios');

// Configuração do proxy
const API_BASE_URL = 'http://localhost:3001/moblix-api';

async function testFlightSearch() {
  try {
    // Primeiro, obter token
    console.log('🔑 Obtendo token de autenticação...');
    const tokenResponse = await axios.post(`${API_BASE_URL}/api/Token`, {
      username: 'julio.martins@moblix.com.br',
      password: 'Julio@2024'
    });

    const token = tokenResponse.data.token;
    console.log('✅ Token obtido:', token.substring(0, 20) + '...');

    // Buscar voos
    console.log('\n✈️ Buscando voos...');
    const flightResponse = await axios.post(`${API_BASE_URL}/api/ConsultaAereo/Consultar`, {
      origin: 'GRU',
      destination: 'GIG',
      departureDate: '2024-12-20',
      returnDate: null,
      adults: 1,
      children: 0,
      infants: 0,
      cabinClass: 'Economy'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Resposta da API recebida');
    console.log('Status:', flightResponse.status);
    
    if (flightResponse.data && flightResponse.data.Data && flightResponse.data.Data.length > 0) {
      const firstFlight = flightResponse.data.Data[0];
      console.log('\n📋 Primeiro voo encontrado:');
      console.log('Estrutura completa:', JSON.stringify(firstFlight, null, 2));
      
      // Testar extração de segmentos
      console.log('\n🔍 Testando extração de segmentos...');
      if (firstFlight.segments && Array.isArray(firstFlight.segments) && firstFlight.segments.length > 0) {
        const firstSegment = firstFlight.segments[0];
        console.log('Primeiro segmento:', JSON.stringify(firstSegment, null, 2));
        
        // Testar extração de legs
        if (firstSegment.legs && Array.isArray(firstSegment.legs) && firstSegment.legs.length > 0) {
          const firstLeg = firstSegment.legs[0];
          console.log('Primeiro leg:', JSON.stringify(firstLeg, null, 2));
          
          console.log('\n📊 Dados extraídos:');
          console.log('Horário de saída:', firstSegment.departureDate);
          console.log('Horário de chegada:', firstSegment.arrivalDate);
          console.log('Aeroporto origem:', firstSegment.departure);
          console.log('Aeroporto destino:', firstSegment.arrival);
          console.log('Número do voo:', firstLeg?.flightNumber);
          console.log('Companhia:', firstLeg?.operatedBy?.name || firstLeg?.managedBy?.name);
        } else {
          console.log('❌ Nenhum leg encontrado no segmento');
        }
      } else {
        console.log('❌ Nenhum segmento encontrado no voo');
      }
    } else {
      console.log('❌ Nenhum voo encontrado na resposta');
    }

  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
  }
}

testFlightSearch(); 