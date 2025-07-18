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
    console.log('🔐 Obtendo token...');
    
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

    console.log('✅ Token obtido!');
    return response.data.access_token;
  } catch (error) {
    console.error('❌ Erro ao obter token:', error.message);
    throw error;
  }
}

// Simula o processamento que fizemos no Vue.js
function processApiResponse(response, searchParams) {
  console.log('\n🔧 PROCESSANDO RESPOSTA DA API...');
  
  let flights = [];
  
  if (response?.Data && Array.isArray(response.Data)) {
    console.log(`📋 response.Data encontrado com ${response.Data.length} itens`);
    
    response.Data.forEach((dataItem, index) => {
      console.log(`📋 Analisando item ${index}:`);
      
      // ESTRUTURA NOVA: flights[]
      if (dataItem.flights && Array.isArray(dataItem.flights)) {
        console.log(`✈️ ESTRUTURA NOVA: Encontrado ${dataItem.flights.length} voos em dataItem.flights`);
        
        dataItem.flights.forEach((flight, flightIndex) => {
          console.log(`  Voo ${flightIndex + 1}:`, {
            id: flight.id,
            priceWithTax: flight.priceWithTax,
            airline: flight.airline,
            flightNumber: flight.flightNumber,
            origin: flight.origin,
            destination: flight.destination
          });
          
          // Normaliza estrutura da API nova para o formato esperado
          const normalizedFlight = {
            ...flight,
            Token: flight.id || flight.token || Math.random().toString(36),
            ValorTotalComTaxa: flight.priceWithTax || flight.price || flight.totalPrice || 0,
            ValorTotal: flight.price || flight.priceWithoutTax || 0,
            ValorAdulto: flight.adultPrice || flight.price || 0,
            Origem: flight.origin || flight.departure || searchParams.origem,
            Destino: flight.destination || flight.arrival || searchParams.destino,
            Saida: flight.departureDateTime || flight.departureTime,
            Chegada: flight.arrivalDateTime || flight.arrivalTime,
            Duracao: flight.duration || 120,
            TempoTotalStr: flight.durationText || '2h 00m',
            Cia: { Nome: flight.airline || flight.validatingCarrier || 'Companhia Aérea' },
            Voos: flight.segments?.map(segment => ({
              Numero: segment.flightNumber || flight.flightNumber || 'N/A',
              Saida: segment.departureDateTime || flight.departureDateTime,
              Chegada: segment.arrivalDateTime || flight.arrivalDateTime,
              Origem: segment.origin || flight.origin,
              Destino: segment.destination || flight.destination,
              Duracao: segment.duration || flight.duration
            })) || [{
              Numero: flight.flightNumber || 'N/A',
              Saida: flight.departureDateTime || flight.departureTime,
              Chegada: flight.arrivalDateTime || flight.arrivalTime,
              Origem: flight.origin || searchParams.origem,
              Destino: flight.destination || searchParams.destino,
              Duracao: flight.duration || 120
            }]
          };
          
          flights.push(normalizedFlight);
        });
      } 
      // ESTRUTURA ANTIGA: Ida[]
      else if (dataItem.Ida && Array.isArray(dataItem.Ida)) {
        console.log(`✈️ ESTRUTURA ANTIGA: Encontrado ${dataItem.Ida.length} voos em dataItem.Ida`);
        flights.push(...dataItem.Ida);
      } 
      else {
        console.log('❌ Nenhum voo encontrado - propriedades:', Object.keys(dataItem));
      }
    });
  }
  
  console.log(`\n✅ TOTAL: ${flights.length} voos processados`);
  return flights;
}

// Função principal de teste
async function testNewStructure() {
  try {
    console.log('🚀 Testando processamento da nova estrutura...');
    
    const token = await getToken();
    
    // Testa com a rota que retorna estrutura nova (CNF → CGH)
    const searchParams = {
      "Origem": "CNF",
      "Destino": "CGH",
      "Ida": "2025-07-10",
      "Adultos": 1,
      "Criancas": 0,
      "Bebes": 0,
      "Companhia": -1
    };
    
    console.log('\n🔍 Buscando voos CNF → CGH...');
    
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
    console.log('HasResult:', response.data.HasResult);
    console.log('TotalItens:', response.data.TotalItens);
    
    // Processa a resposta usando nossa nova lógica
    const processedFlights = processApiResponse(response.data, searchParams);
    
    if (processedFlights.length > 0) {
      console.log('\n🎉 VOOS NORMALIZADOS:');
      processedFlights.slice(0, 3).forEach((flight, index) => {
        console.log(`${index + 1}. ${flight.Cia?.Nome || 'N/A'} ${flight.Voos?.[0]?.Numero || 'N/A'} - R$ ${flight.ValorTotalComTaxa || 0}`);
        console.log(`   ${flight.Origem} → ${flight.Destino} (${flight.TempoTotalStr || 'N/A'})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testNewStructure();
