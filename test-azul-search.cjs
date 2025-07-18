// Script para testar se há voos da Azul disponíveis para a rota SAO-RIO

// Simula a resposta da API baseada nos logs
const mockApiResponse = {
  Data: [{
    flights: [
      {
        validatingBy: { name: "Gol", iata: "G3" },
        segments: [{
          IdCiaResponsavel: 2,
          legs: [{
            operatedBy: { name: "Gol", iata: "G3" },
            flightNumber: 1070
          }]
        }]
      }
    ]
  }]
};

// Lógica de filtragem do frontend
function filterFlightsByCompany(apiResponse, companyId) {
  console.log(`🔍 FILTRO POR COMPANHIA: Buscando voos da companhia ${companyId}`);
  
  // Extrai todos os voos
  let allFlights = [];
  if (apiResponse?.Data && Array.isArray(apiResponse.Data) && apiResponse.Data.length > 0) {
    const firstDataItem = apiResponse.Data[0];
    if (firstDataItem?.flights && Array.isArray(firstDataItem.flights)) {
      allFlights = firstDataItem.flights;
    } else {
      allFlights = apiResponse.Data;
    }
  }
  
  console.log(`🔍 Total de voos antes do filtro: ${allFlights.length}`);
  
  // Filtra apenas os voos da companhia selecionada
  const filteredFlights = allFlights.filter((flight, index) => {
    // Tenta diferentes formas de identificar a companhia
    let flightCompany = flight.Companhia || flight.CompanhiaId || flight.IdCia;
    
    // Se não tem os campos diretos, tenta usar outros campos
    if (!flightCompany) {
      // Tenta usar Cia.Id ou Cia.Nome
      if (flight.Cia?.Id) {
        flightCompany = flight.Cia.Id;
      } else if (flight.Cia?.Nome) {
        // Mapeia nome para ID
        const nameToId = {
          'Latam': 1,
          'LATAM': 1,
          'Gol': 2,
          'GOL': 2,
          'Azul': 3,
          'AZUL': 3
        };
        flightCompany = nameToId[flight.Cia.Nome] || flight.Cia.Nome;
      }
    }
    
    // Se ainda não tem, tenta detectar pela estrutura atual da API
    if (!flightCompany) {
      // Verifica validatingBy (companhia principal)
      if (flight.validatingBy?.name) {
        const nameToId = {
          'LATAM': 1,
          'Latam': 1,
          'GOL': 2,
          'Gol': 2,
          'Azul': 3,
          'AZUL': 3
        };
        flightCompany = nameToId[flight.validatingBy.name];
      }
    }
    
    // Se ainda não tem, tenta detectar por segments
    if (!flightCompany) {
      if (flight.segments && Array.isArray(flight.segments) && flight.segments.length > 0) {
        const firstSegment = flight.segments[0];
        
        // Verifica IdCiaResponsavel no segmento
        if (firstSegment.IdCiaResponsavel) {
          flightCompany = firstSegment.IdCiaResponsavel;
        }
        
        // Se não tem IdCiaResponsavel, tenta detectar por operatedBy
        if (!flightCompany && firstSegment.legs?.[0]?.operatedBy?.name) {
          const nameToId = {
            'LATAM': 1,
            'Latam': 1,
            'GOL': 2,
            'Gol': 2,
            'Azul': 3,
            'AZUL': 3
          };
          flightCompany = nameToId[firstSegment.legs[0].operatedBy.name];
        }
        
        // Se ainda não tem, tenta detectar pelo número do voo
        if (!flightCompany) {
          const flightNumber = firstSegment.legs?.[0]?.flightNumber;
          if (flightNumber && typeof flightNumber === 'number') {
            // Para LATAM, números de voo geralmente estão na faixa 3000-4000
            if (flightNumber >= 3000 && flightNumber <= 4000) {
              flightCompany = 1; // LATAM
            }
            // Para GOL, números de voo geralmente estão na faixa 1000-2000
            else if (flightNumber >= 1000 && flightNumber <= 2000) {
              flightCompany = 2; // GOL
            }
          }
        }
      }
    }
    
    const isMatch = flightCompany === companyId || flightCompany === companyId.toString();
    
    // Debug detalhado
    console.log(`🔍 Voo ${index + 1} - Detalhes de filtragem:`, {
      'flight.validatingBy': flight.validatingBy,
      'flight.segments[0]?.IdCiaResponsavel': flight.segments?.[0]?.IdCiaResponsavel,
      'flight.segments[0]?.legs[0]?.operatedBy': flight.segments?.[0]?.legs?.[0]?.operatedBy,
      'flight.segments[0]?.legs[0]?.flightNumber': flight.segments?.[0]?.legs?.[0]?.flightNumber,
      'flightCompany (final)': flightCompany,
      'companyId': companyId,
      'isMatch': isMatch
    });
    
    if (isMatch) {
      console.log(`✅ Voo da companhia ${companyId} encontrado:`, {
        flightCompany,
        companyId,
        validatingBy: flight.validatingBy?.name,
        operatedBy: flight.segments?.[0]?.legs?.[0]?.operatedBy?.name,
        flightNumber: flight.segments?.[0]?.legs?.[0]?.flightNumber
      });
    }
    
    return isMatch;
  });
  
  console.log(`🎯 Encontrados ${filteredFlights.length} voos da companhia ${companyId} no total de ${allFlights.length} voos`);
  
  return {
    Data: [{ flights: filteredFlights }],
    filteredFromAll: true,
    totalFlights: allFlights.length,
    filteredFlights: filteredFlights.length
  };
}

// Testa o filtro para Azul (company 3)
console.log('=== TESTE: Filtrando por Azul (ID 3) ===');
const azulResult = filterFlightsByCompany(mockApiResponse, 3);
console.log('Resultado Azul:', JSON.stringify(azulResult, null, 2));

// Testa o filtro para GOL (company 2)
console.log('\n=== TESTE: Filtrando por GOL (ID 2) ===');
const golResult = filterFlightsByCompany(mockApiResponse, 2);
console.log('Resultado GOL:', JSON.stringify(golResult, null, 2));

// Resumo
console.log('\n=== DIAGNÓSTICO DO PROBLEMA ===');
console.log('❌ A API retornou apenas voos da GOL (company 2)');
console.log('❌ Quando filtrado por Azul (company 3), encontrou 0 voos');
console.log('✅ Quando filtrado por GOL (company 2), encontrou 1 voo');
console.log('📊 Conclusão: Não há voos da Azul disponíveis para a rota SAO-RIO na data selecionada');
console.log('🔍 Motivo: O filtro está funcionando corretamente, mas não há dados da Azul na resposta da API');
