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

    console.log('✅ Token obtido com sucesso!');
    return response.data.access_token;
  } catch (error) {
    console.error('❌ Erro ao obter token:', error.response?.data || error.message);
    throw error;
  }
}

// Função para simular a normalização de voo
function normalizeFlight(flight) {
  console.log('🔧 Normalizando voo:', flight.Token || 'sem token');
  
  // Extrai informações básicas
  const priceWithTax = flight.ValorTotalComTaxa || flight.ValorTotal || flight.ValorAdulto || 0;
  const flightNumber = flight.Voos?.[0]?.Numero || flight.FlightCode || 'N/A';
  const departureTime = flight.Voos?.[0]?.Saida || flight.Saida || 'N/A';
  const arrivalTime = flight.Voos?.[0]?.Chegada || flight.Chegada || 'N/A';
  const airline = flight.Cia?.Nome || 'LATAM';
  
  return {
    id: flight.Token || Math.random().toString(36),
    priceWithTax: priceWithTax,
    price: priceWithTax,
    totalPrice: priceWithTax,
    companhia: airline,
    numeroVoo: flightNumber,
    horarioSaida: departureTime,
    horarioChegada: arrivalTime,
    origem: flight.Origem || 'GRU',
    destino: flight.Destino || 'GIG',
    duracao: flight.Duracao || flight.Voos?.[0]?.Duracao || 60,
    duracaoText: flight.TempoTotalStr || flight.Voos?.[0]?.Tempo || '1h 00m',
    classe: flight.Voos?.[0]?.ClasseStr || 'Econômica',
    escalas: 0,
    segments: flight.Voos?.map(voo => ({
      flightNumber: voo.Numero,
      origin: voo.Origem,
      destination: voo.Destino,
      departureTime: voo.Saida,
      arrivalTime: voo.Chegada,
      duration: voo.Duracao
    })) || [],
    _originalData: flight
  };
}

// Função principal de teste
async function testFrontendFix() {
  try {
    console.log('🚀 Testando correção do frontend...');
    
    // 1. Obter token
    const token = await getToken();
    
    // 2. Buscar voos
    const searchParams = {
      "Origem": "GRU",
      "Destino": "GIG",
      "Ida": "2025-07-20",
      "Adultos": 1,
      "Criancas": 0,
      "Bebes": 0,
      "Companhia": 1
    };

    console.log('\n🔍 Buscando voos com parâmetros:', searchParams);

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
    console.log('Data Length:', response.data.Data?.length || 0);

    if (response.data.Success && response.data.Data && response.data.Data.length > 0) {
      const firstDataItem = response.data.Data[0];
      
      if (firstDataItem.Ida && Array.isArray(firstDataItem.Ida)) {
        console.log(`\n✈️ PROCESSANDO ${firstDataItem.Ida.length} VOOS:`)
        
        // Normaliza os primeiros 3 voos para teste
        const normalizedFlights = firstDataItem.Ida.slice(0, 3).map((flight, index) => {
          console.log(`\n--- VOO ${index + 1} ---`);
          console.log('Token:', flight.Token);
          console.log('Valor Total:', flight.ValorTotalComTaxa);
          console.log('Número do Voo:', flight.Voos?.[0]?.Numero);
          console.log('Horário Saída:', flight.Voos?.[0]?.Saida);
          console.log('Horário Chegada:', flight.Voos?.[0]?.Chegada);
          console.log('Companhia:', flight.Cia?.Nome);
          
          const normalized = normalizeFlight(flight);
          console.log('NORMALIZADO:', {
            id: normalized.id,
            priceWithTax: normalized.priceWithTax,
            companhia: normalized.companhia,
            numeroVoo: normalized.numeroVoo,
            horarioSaida: normalized.horarioSaida,
            horarioChegada: normalized.horarioChegada
          });
          
          return normalized;
        });
        
        console.log(`\n🎉 SUCESSO! ${normalizedFlights.length} voos normalizados:`);
        normalizedFlights.forEach((flight, index) => {
          console.log(`${index + 1}. ${flight.companhia} ${flight.numeroVoo} - R$ ${flight.priceWithTax.toFixed(2)}`);
        });
        
        return normalizedFlights;
      } else {
        console.log('❌ Estrutura de dados inesperada - não encontrou firstDataItem.Ida');
      }
    } else {
      console.log('❌ Resposta não contém dados válidos');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testFrontendFix();
