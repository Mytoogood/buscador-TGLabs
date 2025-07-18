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

// Simula o novo mapeamento que foi implementado
function normalizeNewStructureFlight(flight, searchParams) {
  const normalizedFlight = {
    ...flight,
    // ID e Token
    Token: flight.segments?.[0]?.rateToken || Math.random().toString(36),
    TokenConsulta: flight.segments?.[0]?.TokenConsultaMBX,
    
    // Preços (estrutura fareGroup)
    ValorTotalComTaxa: flight.fareGroup?.priceWithTax || 0,
    ValorTotal: flight.fareGroup?.priceWithoutTax || 0,
    ValorAdulto: flight.fareGroup?.adultPrice || flight.fareGroup?.priceWithTax || 0,
    PercentualEconomia: flight.fareGroup?.percentualEconomia || 0,
    
    // Rota (primeiro segmento)
    Origem: flight.segments?.[0]?.departure || searchParams.origem,
    Destino: flight.segments?.[0]?.arrival || searchParams.destino,
    
    // Horários (primeiro segmento)
    Saida: flight.segments?.[0]?.departureDate,
    Chegada: flight.segments?.[0]?.arrivalDate,
    
    // Duração
    Duracao: flight.segments?.[0]?.duration || flight.FlyTime?.Total || 0,
    TempoTotalStr: flight.segments?.[0]?.duration ? 
      `${Math.floor(flight.segments[0].duration / 60)}h ${(flight.segments[0].duration % 60).toString().padStart(2, '0')}m` : 
      '2h 00m',
    
    // Companhia
    Cia: { 
      Nome: flight.validatingBy?.name || flight.segments?.[0]?.legs?.[0]?.operatedBy?.name || 'Companhia Aérea' 
    },
    IdCia: flight.segments?.[0]?.IdCiaResponsavel || 1,
    
    // Milhas
    PontosAdulto: flight.segments?.[0]?.PontosAdulto || -1,
    
    // Voos (baseado nos legs do primeiro segmento)
    Voos: flight.segments?.[0]?.legs?.map(leg => ({
      Numero: `${leg.operatedBy?.iata || 'LA'}-${leg.flightNumber}`,
      Saida: leg.departureDate,
      Chegada: leg.arrivalDate,
      Origem: leg.departure,
      Destino: leg.arrival,
      Duracao: leg.duration,
      Tempo: leg.duration ? 
        `${Math.floor(leg.duration / 60)}h ${(leg.duration % 60).toString().padStart(2, '0')}m` : 
        '1h 45m',
      ClasseStr: leg.seatClass?.description || 'Economica'
    })) || [{
      Numero: `${flight.validatingBy?.iata || 'LA'}-${flight.segments?.[0]?.legs?.[0]?.flightNumber || '0000'}`,
      Saida: flight.segments?.[0]?.departureDate,
      Chegada: flight.segments?.[0]?.arrivalDate,
      Origem: flight.segments?.[0]?.departure || searchParams.origem,
      Destino: flight.segments?.[0]?.arrival || searchParams.destino,
      Duracao: flight.segments?.[0]?.duration || 105,
      Tempo: flight.segments?.[0]?.duration ? 
        `${Math.floor(flight.segments[0].duration / 60)}h ${(flight.segments[0].duration % 60).toString().padStart(2, '0')}m` : 
        '1h 45m',
      ClasseStr: flight.segments?.[0]?.legs?.[0]?.seatClass?.description || 'Economica'
    }],
    
    // Bagagens
    BagagensInclusas: flight.segments?.[0]?.fareProfile?.services?.filter(s => s.isIncluded)?.map(s => ({
      Bagagem: s.type === 'HAND_LUGGAGE' ? 0 : 1,
      TextoBagagem: s.description,
      Quantidade: s.Number || 1
    })) || [],
    
    // Taxas
    Taxas: {
      Embarque: (flight.fareGroup?.priceWithTax || 0) - (flight.fareGroup?.priceWithoutTax || 0),
      Servico: 0
    }
  };

  return normalizedFlight;
}

// Função para testar o novo mapeamento
async function testNewMapping() {
  try {
    console.log('🔍 Testando novo mapeamento...');
    
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
      
      if (firstDataItem.flights && firstDataItem.flights.length > 0) {
        console.log(`\n✈️ PROCESSANDO ${firstDataItem.flights.length} VOOS:`);
        
        // Testa o mapeamento nos primeiros 3 voos
        const processedFlights = firstDataItem.flights.slice(0, 3).map((flight, index) => {
          console.log(`\n--- VOO ${index + 1} (ANTES DO MAPEAMENTO) ---`);
          console.log('Dados originais importantes:');
          console.log('  fareGroup.priceWithTax:', flight.fareGroup?.priceWithTax);
          console.log('  validatingBy.name:', flight.validatingBy?.name);
          console.log('  segments[0].departure:', flight.segments?.[0]?.departure);
          console.log('  segments[0].arrival:', flight.segments?.[0]?.arrival);
          console.log('  segments[0].departureDate:', flight.segments?.[0]?.departureDate);
          console.log('  segments[0].legs[0].flightNumber:', flight.segments?.[0]?.legs?.[0]?.flightNumber);
          
          const normalized = normalizeNewStructureFlight(flight, searchParams);
          
          console.log(`\n--- VOO ${index + 1} (APÓS MAPEAMENTO) ---`);
          console.log('✅ DADOS MAPEADOS:');
          console.log('  Token:', normalized.Token);
          console.log('  ValorTotalComTaxa:', normalized.ValorTotalComTaxa);
          console.log('  Companhia:', normalized.Cia?.Nome);
          console.log('  Origem:', normalized.Origem);
          console.log('  Destino:', normalized.Destino);
          console.log('  Saida:', normalized.Saida);
          console.log('  Chegada:', normalized.Chegada);
          console.log('  Numero Voo:', normalized.Voos?.[0]?.Numero);
          console.log('  Duração:', normalized.TempoTotalStr);
          
          return normalized;
        });
        
        console.log(`\n🎉 RESUMO DOS VOOS MAPEADOS:`);
        processedFlights.forEach((flight, index) => {
          console.log(`${index + 1}. ${flight.Cia?.Nome} ${flight.Voos?.[0]?.Numero} - R$ ${flight.ValorTotalComTaxa?.toFixed(2)}`);
          console.log(`   ${flight.Origem} → ${flight.Destino} (${flight.TempoTotalStr})`);
          console.log(`   ${flight.Saida?.substring(11, 16) || '--:--'} → ${flight.Chegada?.substring(11, 16) || '--:--'}`);
        });
        
      } else {
        console.log('❌ Nenhum voo encontrado no momento');
      }
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testNewMapping();
