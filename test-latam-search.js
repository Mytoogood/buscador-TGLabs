import axios from 'axios';

// Função para testar a busca de voos da LATAM através do proxy local
const testLatamFlights = async () => {
  const baseURL = 'http://localhost:5173'; // URL do servidor de desenvolvimento
  
  try {
    console.log('=== TESTE 1: BUSCA ESPECÍFICA LATAM (Companhia: 1) ===');
    
    // Parâmetros para buscar apenas LATAM
    const paramsLatam = {
      origem: 'BSB',
      destino: 'GRU',
      ida: '2025-03-10',
      adultos: 1,
      criancas: 0,
      bebes: 0,
      companhia: 1 // LATAM
    };

    const responseLatam = await axios.post(`${baseURL}/aereo/api/consulta`, paramsLatam);
    
    console.log('Status:', responseLatam.status);
    console.log('Tipo de dados:', typeof responseLatam.data);
    console.log('Keys da resposta:', Object.keys(responseLatam.data || {}));
    
    // Extrai voos da resposta
    let latamFlights = [];
    if (responseLatam.data?.Data && Array.isArray(responseLatam.data.Data)) {
      const firstData = responseLatam.data.Data[0];
      if (firstData?.flights && Array.isArray(firstData.flights)) {
        latamFlights = firstData.flights;
      } else {
        latamFlights = responseLatam.data.Data;
      }
    } else if (responseLatam.data?.Ida && Array.isArray(responseLatam.data.Ida)) {
      latamFlights = responseLatam.data.Ida;
    }

    console.log('🛫 Total de voos LATAM encontrados:', latamFlights.length);
    
    if (latamFlights.length > 0) {
      console.log('\\n📋 Primeiros 5 voos LATAM:');
      latamFlights.slice(0, 5).forEach((flight, idx) => {
        console.log(`${idx + 1}. Companhia: ${flight.Companhia}, Preço: R$ ${flight.ValorTotalComTaxa || flight.ValorTotal || flight.ValorAdulto || 0}, Número: ${flight.Voos?.[0]?.Numero || 'N/A'}`);
      });
      
      // Analisa o primeiro voo em detalhe
      console.log('\\n🔍 ANÁLISE DETALHADA DO PRIMEIRO VOO:');
      const firstFlight = latamFlights[0];
      console.log('Estrutura completa:', JSON.stringify(firstFlight, null, 2));
    }

    console.log('\\n=== TESTE 2: BUSCA TODAS AS COMPANHIAS (Companhia: -1) ===');
    
    // Parâmetros para buscar todas as companhias
    const paramsAll = {
      origem: 'BSB',
      destino: 'GRU',
      ida: '2025-03-10',
      adultos: 1,
      criancas: 0,
      bebes: 0,
      companhia: -1 // Todas as companhias
    };

    const responseAll = await axios.post(`${baseURL}/aereo/api/consulta`, paramsAll);
    
    // Extrai voos da resposta
    let allFlights = [];
    if (responseAll.data?.Data && Array.isArray(responseAll.data.Data)) {
      const firstData = responseAll.data.Data[0];
      if (firstData?.flights && Array.isArray(firstData.flights)) {
        allFlights = firstData.flights;
      } else {
        allFlights = responseAll.data.Data;
      }
    } else if (responseAll.data?.Ida && Array.isArray(responseAll.data.Ida)) {
      allFlights = responseAll.data.Ida;
    }

    console.log('🌍 Total de voos (todas as companhias):', allFlights.length);
    
    // Filtra apenas os voos da LATAM
    const latamFromAll = allFlights.filter(flight => {
      const companhia = flight.Companhia || flight.CompanhiaId || flight.IdCia;
      return companhia === 1 || companhia === '1';
    });

    console.log('🎯 Voos da LATAM encontrados na busca geral:', latamFromAll.length);
    
    if (latamFromAll.length > 0) {
      console.log('\\n📋 Primeiros 5 voos LATAM da busca geral:');
      latamFromAll.slice(0, 5).forEach((flight, idx) => {
        console.log(`${idx + 1}. Companhia: ${flight.Companhia}, Preço: R$ ${flight.ValorTotalComTaxa || flight.ValorTotal || flight.ValorAdulto || 0}, Número: ${flight.Voos?.[0]?.Numero || 'N/A'}`);
      });
    }

    console.log('\\n=== COMPARAÇÃO ===');
    console.log(`Busca específica LATAM: ${latamFlights.length} voos`);
    console.log(`LATAM na busca geral: ${latamFromAll.length} voos`);
    console.log(`Diferença: ${latamFromAll.length - latamFlights.length} voos`);
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    console.error('❌ Erro completo:', error);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    if (error.code) {
      console.error('Código do erro:', error.code);
    }
  }
};

// Executa o teste
testLatamFlights();
