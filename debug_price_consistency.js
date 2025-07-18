// Script para debug de consistência de preços entre buscas sucessivas
// Para executar no console do navegador ou como arquivo Node.js

console.log('🔍 DEBUG DE CONSISTÊNCIA DE PREÇOS - INICIANDO');

// Variáveis para armazenar dados de buscas consecutivas
let searchHistory = [];
let currentSearchIndex = 0;

// Intercepta todas as requisições para a API Moblix
const originalFetch = window.fetch;
window.fetch = async function(...args) {
  const response = await originalFetch.apply(this, args);
  
  // Verifica se é uma chamada para a API Moblix
  if (args[0].includes('moblix') || args[0].includes('consultarVoos')) {
    console.log('🌐 INTERCEPTANDO REQUISIÇÃO PARA API MOBLIX');
    console.log('URL:', args[0]);
    console.log('Método:', args[1]?.method || 'GET');
    console.log('Timestamp:', new Date().toISOString());
    
    // Clona a resposta para poder ler o conteúdo
    const clonedResponse = response.clone();
    
    try {
      const data = await clonedResponse.json();
      console.log('📊 DADOS DA RESPOSTA DA API:');
      console.log('Status:', response.status);
      console.log('Headers:', [...response.headers.entries()]);
      console.log('Data:', data);
      
      // Extrai e analisa os preços dos voos
      analyzePricesFromResponse(data);
      
    } catch (error) {
      console.error('❌ Erro ao processar resposta:', error);
    }
  }
  
  return response;
};

// Função para analisar os preços na resposta da API
function analyzePricesFromResponse(data) {
  console.log('💰 ANALISANDO PREÇOS NA RESPOSTA DA API');
  
  let flights = [];
  
  // Extrai voos da resposta usando a mesma lógica do componente
  if (data?.Data && Array.isArray(data.Data) && data.Data.length > 0) {
    const firstDataItem = data.Data[0];
    if (firstDataItem?.flights && Array.isArray(firstDataItem.flights)) {
      flights = firstDataItem.flights;
    } else {
      flights = data.Data;
    }
  } else if (data?.Ida && Array.isArray(data.Ida)) {
    flights = data.Ida;
  } else if (Array.isArray(data)) {
    flights = data;
  }
  
  console.log(`✈️ ${flights.length} voos encontrados na resposta`);
  
  if (flights.length > 0) {
    const searchData = {
      timestamp: new Date().toISOString(),
      searchIndex: currentSearchIndex++,
      totalFlights: flights.length,
      flights: flights.map((flight, index) => {
        const priceData = extractAllPrices(flight);
        return {
          index,
          flightId: flight.Id || flight.FlightId || `flight_${index}`,
          airline: flight.Companhia || flight.Airline || 'Unknown',
          prices: priceData,
          rawFlight: flight
        };
      })
    };
    
    searchHistory.push(searchData);
    
    // Analisa diferenças entre buscas
    if (searchHistory.length > 1) {
      compareSearchResults();
    }
    
    console.log('📈 DADOS DA BUSCA ATUAL:', searchData);
  }
}

// Função para extrair todos os preços possíveis de um voo
function extractAllPrices(flight) {
  const prices = {};
  
  // Lista de todas as possíveis propriedades de preço
  const priceFields = [
    'ValorTotalComTaxa',
    'ValorTotal',
    'ValorAdulto',
    'ValorCrianca',
    'ValorBebe',
    'PrecoTotal',
    'PrecoAdulto',
    'PrecoComTaxa',
    'Preco',
    'Price',
    'TotalPrice',
    'BasePrice',
    'TaxPrice',
    'FinalPrice',
    'Amount',
    'Value',
    'Cost',
    'Fare',
    'Rate'
  ];
  
  priceFields.forEach(field => {
    if (flight[field] !== undefined && flight[field] !== null) {
      prices[field] = flight[field];
    }
  });
  
  // Verifica preços em objetos aninhados
  if (flight.Tarifas && Array.isArray(flight.Tarifas) && flight.Tarifas.length > 0) {
    prices.TarifasArray = flight.Tarifas.map(tarifa => ({
      ValorTotalComTaxa: tarifa.ValorTotalComTaxa,
      ValorTotal: tarifa.ValorTotal,
      ValorAdulto: tarifa.ValorAdulto
    }));
  }
  
  if (flight.fareGroup) {
    prices.fareGroup = flight.fareGroup;
  }
  
  if (flight.segments && Array.isArray(flight.segments)) {
    prices.segments = flight.segments.map(segment => ({
      price: segment.price,
      fareClass: segment.fareClass,
      bookingClass: segment.bookingClass
    }));
  }
  
  return prices;
}

// Função para comparar resultados de buscas
function compareSearchResults() {
  console.log('🔄 COMPARANDO RESULTADOS DE BUSCAS');
  
  const current = searchHistory[searchHistory.length - 1];
  const previous = searchHistory[searchHistory.length - 2];
  
  console.log(`📊 Comparando busca ${previous.searchIndex} vs ${current.searchIndex}`);
  console.log(`⏰ Intervalo: ${new Date(current.timestamp) - new Date(previous.timestamp)}ms`);
  
  // Compara número de voos
  if (current.totalFlights !== previous.totalFlights) {
    console.log(`⚠️ DIFERENÇA NO NÚMERO DE VOOS: ${previous.totalFlights} → ${current.totalFlights}`);
  }
  
  // Compara preços dos voos similares
  const priceComparisons = [];
  
  current.flights.forEach(currentFlight => {
    // Tenta encontrar voo similar na busca anterior
    const similarFlight = previous.flights.find(prevFlight => 
      prevFlight.airline === currentFlight.airline &&
      prevFlight.flightId === currentFlight.flightId
    );
    
    if (similarFlight) {
      const comparison = comparePrices(similarFlight.prices, currentFlight.prices);
      if (comparison.hasDifferences) {
        priceComparisons.push({
          airline: currentFlight.airline,
          flightId: currentFlight.flightId,
          differences: comparison.differences
        });
      }
    }
  });
  
  if (priceComparisons.length > 0) {
    console.log('💥 DIFERENÇAS DE PREÇOS DETECTADAS:');
    priceComparisons.forEach(comp => {
      console.log(`✈️ ${comp.airline} (${comp.flightId}):`);
      comp.differences.forEach(diff => {
        console.log(`  📊 ${diff.field}: ${diff.previous} → ${diff.current} (${diff.change})`);
      });
    });
  } else {
    console.log('✅ NENHUMA DIFERENÇA DE PREÇOS DETECTADA');
  }
}

// Função para comparar preços entre dois objetos
function comparePrices(previousPrices, currentPrices) {
  const differences = [];
  
  // Verifica todos os campos de preço
  const allFields = new Set([
    ...Object.keys(previousPrices),
    ...Object.keys(currentPrices)
  ]);
  
  allFields.forEach(field => {
    const prevValue = previousPrices[field];
    const currValue = currentPrices[field];
    
    if (prevValue !== currValue) {
      const change = currValue && prevValue ? 
        `${((currValue - prevValue) / prevValue * 100).toFixed(2)}%` : 'N/A';
      
      differences.push({
        field,
        previous: prevValue,
        current: currValue,
        change
      });
    }
  });
  
  return {
    hasDifferences: differences.length > 0,
    differences
  };
}

// Intercepta logs do console para capturar dados do componente Vue
const originalConsoleLog = console.log;
console.log = function(...args) {
  // Captura logs específicos do componente de voos
  if (args[0] && typeof args[0] === 'string') {
    if (args[0].includes('Primeiro voo normalizado:')) {
      console.log('🎯 CAPTURANDO VOO NORMALIZADO DO COMPONENTE');
      console.log('Dados:', args[1]);
      analyzeNormalizedFlight(args[1]);
    } else if (args[0].includes('Primeiros 5 preços:')) {
      console.log('🎯 CAPTURANDO PREÇOS FINAIS DO COMPONENTE');
      console.log('Preços:', args[1]);
    }
  }
  
  originalConsoleLog.apply(console, args);
};

// Função para analisar voo normalizado
function analyzeNormalizedFlight(flight) {
  console.log('🔍 ANALISANDO VOO NORMALIZADO:');
  console.log('Preço final (priceWithTax):', flight.priceWithTax);
  console.log('Preço base (price):', flight.price);
  console.log('Preço total (totalPrice):', flight.totalPrice);
  console.log('Companhia:', flight.companhia);
  console.log('Dados originais disponíveis:', Object.keys(flight));
}

// Função para gerar relatório de inconsistências
function generateInconsistencyReport() {
  console.log('📋 RELATÓRIO DE INCONSISTÊNCIAS');
  console.log('================================');
  
  if (searchHistory.length < 2) {
    console.log('❌ Não há dados suficientes para gerar relatório (mínimo 2 buscas)');
    return;
  }
  
  console.log(`📊 Total de buscas analisadas: ${searchHistory.length}`);
  console.log(`⏰ Período: ${searchHistory[0].timestamp} até ${searchHistory[searchHistory.length - 1].timestamp}`);
  
  let totalInconsistencies = 0;
  
  for (let i = 1; i < searchHistory.length; i++) {
    const current = searchHistory[i];
    const previous = searchHistory[i - 1];
    
    // Analisa inconsistências entre buscas consecutivas
    const inconsistencies = findInconsistencies(previous, current);
    totalInconsistencies += inconsistencies.length;
    
    if (inconsistencies.length > 0) {
      console.log(`🔍 Busca ${i}: ${inconsistencies.length} inconsistências encontradas`);
    }
  }
  
  console.log(`🎯 Total de inconsistências: ${totalInconsistencies}`);
  
  return {
    totalSearches: searchHistory.length,
    totalInconsistencies,
    searchHistory
  };
}

function findInconsistencies(search1, search2) {
  const inconsistencies = [];
  
  // Verifica se o mesmo voo tem preços diferentes
  search1.flights.forEach(flight1 => {
    const matchingFlight = search2.flights.find(flight2 => 
      flight2.airline === flight1.airline && 
      flight2.flightId === flight1.flightId
    );
    
    if (matchingFlight) {
      const priceComparison = comparePrices(flight1.prices, matchingFlight.prices);
      if (priceComparison.hasDifferences) {
        inconsistencies.push({
          flight: flight1.flightId,
          airline: flight1.airline,
          differences: priceComparison.differences
        });
      }
    }
  });
  
  return inconsistencies;
}

// Expõe funções globalmente para uso no console
window.priceDebugger = {
  generateReport: generateInconsistencyReport,
  getSearchHistory: () => searchHistory,
  clearHistory: () => {
    searchHistory = [];
    currentSearchIndex = 0;
    console.log('🧹 Histórico de buscas limpo');
  }
};

console.log('✅ DEBUG DE CONSISTÊNCIA DE PREÇOS - ATIVO');
console.log('📝 Para gerar relatório, execute: window.priceDebugger.generateReport()');
console.log('📊 Para ver histórico, execute: window.priceDebugger.getSearchHistory()');
console.log('🧹 Para limpar histórico, execute: window.priceDebugger.clearHistory()');
