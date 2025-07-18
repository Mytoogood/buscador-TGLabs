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

// Função para investigar voos CNF → SSA
async function debugCNFSSA() {
  try {
    console.log('🔍 Investigando voos CNF → SSA...');
    
    const token = await getToken();
    
    const searchParams = {
      "Origem": "CNF",
      "Destino": "SSA",
      "Ida": "2025-07-10",
      "Adultos": 1,
      "Criancas": 0,
      "Bebes": 0,
      "Companhia": -1
    };
    
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/api/ConsultaAereo/Consultar`,
      data: searchParams,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      timeout: 30000
    });
    
    console.log('\n📊 RESPOSTA DA API:');
    console.log('Success:', response.data.Success);
    console.log('TotalItens:', response.data.TotalItens);
    
    if (response.data.Data && response.data.Data.length > 0) {
      const firstDataItem = response.data.Data[0];
      
      if (firstDataItem.flights && firstDataItem.flights.length > 0) {
        console.log(`\n✈️ ANALISANDO ESTRUTURA DOS VOOS (${firstDataItem.flights.length} encontrados):`);
        
        // Analisa os primeiros voos para entender as conexões
        firstDataItem.flights.slice(0, 3).forEach((flight, index) => {
          console.log(`\n=== VOO ${index + 1} ===`);
          
          // Analisa segmentos
          console.log('📍 SEGMENTOS:');
          if (flight.segments && flight.segments.length > 0) {
            flight.segments.forEach((segment, segIndex) => {
              console.log(`  Segmento ${segIndex + 1}:`);
              console.log(`    ${segment.departure} → ${segment.arrival}`);
              console.log(`    ${segment.departureDate} → ${segment.arrivalDate}`);
              console.log(`    Paradas: ${segment.numberOfStops}`);
              console.log(`    Duração: ${segment.duration} min`);
              
              // Analisa legs (segmentos individuais)
              if (segment.legs && segment.legs.length > 0) {
                console.log(`    LEGS (${segment.legs.length}):`);
                segment.legs.forEach((leg, legIndex) => {
                  console.log(`      Leg ${legIndex + 1}: ${leg.departure} → ${leg.arrival}`);
                  console.log(`        Voo: ${leg.operatedBy?.iata}-${leg.flightNumber}`);
                  console.log(`        ${leg.departureDate} → ${leg.arrivalDate}`);
                  console.log(`        Duração: ${leg.duration} min`);
                });
              }
            });
          }
          
          // Informações de rota completa
          console.log('🗺️ ROTA COMPLETA:');
          console.log(`  Origem final: ${flight.segments?.[0]?.departure}`);
          console.log(`  Destino final: ${flight.segments?.[flight.segments?.length - 1]?.arrival}`);
          console.log(`  Total de segmentos: ${flight.segments?.length || 0}`);
          
          // Duração total
          console.log('⏰ TEMPO:');
          console.log(`  Duração total: ${flight.FlyTime?.Total || 0} min`);
          console.log(`  Mais rápido ida: ${flight.FlyTime?.FasterGoing || 0} min`);
          
          // Preço
          console.log('💰 PREÇO:');
          console.log(`  Com taxa: R$ ${flight.fareGroup?.priceWithTax?.toFixed(2) || 0}`);
          
          console.log('─'.repeat(50));
        });
        
      } else if (firstDataItem.Ida && firstDataItem.Ida.length > 0) {
        console.log('\n✈️ ESTRUTURA ANTIGA DETECTADA');
        console.log(`Voos encontrados: ${firstDataItem.Ida.length}`);
      } else {
        console.log('\n❌ Nenhum voo encontrado');
      }
    }
    
  } catch (error) {
    console.error('❌ Erro na investigação:', error.message);
  }
}

debugCNFSSA();
