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

// Função para buscar voos CNF → CGH
async function debugFlightData() {
  try {
    console.log('🔍 Investigando dados reais dos voos CNF → CGH...');
    
    const token = await getToken();
    
    const searchParams = {
      "Origem": "CNF",
      "Destino": "CGH",
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
      
      console.log('\n📋 DADOS DO PRIMEIRO ITEM:');
      console.log('flights.length:', firstDataItem.flights?.length || 0);
      
      if (firstDataItem.flights && firstDataItem.flights.length > 0) {
        console.log('\n✈️ ESTRUTURA COMPLETA DO PRIMEIRO VOO:');
        const firstFlight = firstDataItem.flights[0];
        
        // Mostra o voo completo
        console.log('=== VOO COMPLETO ===');
        console.log(JSON.stringify(firstFlight, null, 2));
        
        console.log('\n=== ANÁLISE DOS CAMPOS ===');
        
        // Analisa campos de preço
        console.log('\n💰 PREÇOS:');
        console.log('priceWithTax:', firstFlight.priceWithTax);
        console.log('price:', firstFlight.price);
        console.log('totalPrice:', firstFlight.totalPrice);
        console.log('adultPrice:', firstFlight.adultPrice);
        
        // Analisa campos de identificação
        console.log('\n🆔 IDENTIFICAÇÃO:');
        console.log('id:', firstFlight.id);
        console.log('token:', firstFlight.token);
        console.log('flightNumber:', firstFlight.flightNumber);
        
        // Analisa campos de rota
        console.log('\n🗺️ ROTA:');
        console.log('origin:', firstFlight.origin);
        console.log('destination:', firstFlight.destination);
        console.log('departure:', firstFlight.departure);
        console.log('arrival:', firstFlight.arrival);
        
        // Analisa campos de tempo
        console.log('\n⏰ TEMPO:');
        console.log('departureDateTime:', firstFlight.departureDateTime);
        console.log('arrivalDateTime:', firstFlight.arrivalDateTime);
        console.log('departureTime:', firstFlight.departureTime);
        console.log('arrivalTime:', firstFlight.arrivalTime);
        console.log('duration:', firstFlight.duration);
        console.log('durationText:', firstFlight.durationText);
        
        // Analisa companhia
        console.log('\n🏢 COMPANHIA:');
        console.log('airline:', firstFlight.airline);
        console.log('validatingCarrier:', firstFlight.validatingCarrier);
        console.log('validatingBy:', firstFlight.validatingBy);
        
        // Analisa segmentos
        console.log('\n✈️ SEGMENTOS:');
        console.log('segments:', firstFlight.segments?.length || 0);
        if (firstFlight.segments && firstFlight.segments.length > 0) {
          console.log('Primeiro segmento:', JSON.stringify(firstFlight.segments[0], null, 2));
        }
        
        // Procura por outros campos possíveis
        console.log('\n🔍 OUTROS CAMPOS:');
        Object.keys(firstFlight).forEach(key => {
          if (!['priceWithTax', 'price', 'totalPrice', 'adultPrice', 'id', 'token', 'flightNumber', 'origin', 'destination', 'departure', 'arrival', 'departureDateTime', 'arrivalDateTime', 'departureTime', 'arrivalTime', 'duration', 'durationText', 'airline', 'validatingCarrier', 'validatingBy', 'segments'].includes(key)) {
            console.log(`${key}:`, typeof firstFlight[key], firstFlight[key]);
          }
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Erro na investigação:', error.message);
  }
}

debugFlightData();
