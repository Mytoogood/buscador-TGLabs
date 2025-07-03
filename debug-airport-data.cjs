const axios = require('axios');

// Configuração da API Moblix
const API_BASE_URL = 'https://api.moblix.com.br';

async function testFlightSearch() {
  try {
    // Primeiro, obter token
    console.log('🔑 Obtendo token de autenticação...');
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', 'julio.martins@moblix.com.br');
    formData.append('password', 'Julio@2024');
    
    const tokenResponse = await axios.post(`${API_BASE_URL}/api/Token`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    });

    const token = tokenResponse.data.access_token;
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
          console.log('Aeroporto origem (segment.departure):', firstSegment.departure);
          console.log('Aeroporto destino (segment.arrival):', firstSegment.arrival);
          console.log('Aeroporto origem (firstLeg.departure):', firstLeg?.departure);
          console.log('Aeroporto destino (firstLeg.arrival):', firstLeg?.arrival);
          console.log('Horário de saída:', firstSegment.departureDate);
          console.log('Horário de chegada:', firstSegment.arrivalDate);
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