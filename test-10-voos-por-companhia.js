import axios from 'axios';

// Mock de dados para testar o filtro de 10 voos por companhia
const mockFlights = [
  // 15 voos da LATAM
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `latam-${i}`,
    companhia: 'LATAM',
    Companhia: 'LATAM',
    numeroVoo: `LA-${3000 + i}`,
    priceWithTax: 500 + (i * 50),
    price: 500 + (i * 50),
    totalPrice: 500 + (i * 50),
    segments: [{
      departure: 'SAO',
      arrival: 'RIO',
      duration: 120 + (i * 10),
      departureDate: '2025-07-11T08:00:00',
      arrivalDate: '2025-07-11T10:00:00'
    }],
    horarioSaida: '08:00',
    horarioChegada: '10:00',
    origem: 'SAO',
    destino: 'RIO'
  })),
  // 12 voos da GOL
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `gol-${i}`,
    companhia: 'GOL',
    Companhia: 'GOL',
    numeroVoo: `G3-${1000 + i}`,
    priceWithTax: 450 + (i * 40),
    price: 450 + (i * 40),
    totalPrice: 450 + (i * 40),
    segments: [{
      departure: 'SAO',
      arrival: 'RIO',
      duration: 115 + (i * 8),
      departureDate: '2025-07-11T09:00:00',
      arrivalDate: '2025-07-11T11:00:00'
    }],
    horarioSaida: '09:00',
    horarioChegada: '11:00',
    origem: 'SAO',
    destino: 'RIO'
  })),
  // 8 voos da Azul
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `azul-${i}`,
    companhia: 'Azul',
    Companhia: 'Azul',
    numeroVoo: `AD-${4000 + i}`,
    priceWithTax: 520 + (i * 30),
    price: 520 + (i * 30),
    totalPrice: 520 + (i * 30),
    segments: [{
      departure: 'SAO',
      arrival: 'RIO',
      duration: 125 + (i * 12),
      departureDate: '2025-07-11T10:00:00',
      arrivalDate: '2025-07-11T12:00:00'
    }],
    horarioSaida: '10:00',
    horarioChegada: '12:00',
    origem: 'SAO',
    destino: 'RIO'
  }))
];

// Função para parsear duração em minutos
function parseDurationToMinutes(duration) {
  if (typeof duration === 'number') return duration;
  if (typeof duration === 'string') {
    const match = duration.match(/(\d+)h?\s*(\d+)?m?/);
    if (match) {
      const hours = parseInt(match[1]) || 0;
      const minutes = parseInt(match[2]) || 0;
      return hours * 60 + minutes;
    }
  }
  return 120; // fallback
}

// Função para obter duração total
function getTotalDuration(segments) {
  if (!segments || segments.length === 0) return '2h 00m';
  
  let totalMinutes = 0;
  segments.forEach(segment => {
    totalMinutes += segment.duration || 120;
  });
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
}

// Função para filtrar e mostrar voos únicos com preços individuais
function filterBestFlights(flights, orderBy) {
  if (!flights || flights.length === 0) return [];
  
  const maxFlights = 10; // Limite máximo de voos por companhia aérea para mostrar
  
  console.log(`🎯 Filtrando os melhores voos por ${orderBy === 'preco' ? 'MENOR PREÇO' : 'MENOR TEMPO'}...`);
  console.log(`📊 Mostrando PREÇOS INDIVIDUAIS para cada voo`);
  
  // Separa voos por companhia aérea
  const airlineGroups = new Map();
  
  flights.forEach(flight => {
    const airline = flight.companhia || flight.Companhia || 'Outras';
    
    if (!airlineGroups.has(airline)) {
      airlineGroups.set(airline, []);
    }
    airlineGroups.get(airline).push(flight);
  });
  
  console.log(`✈️ Companhias encontradas: ${Array.from(airlineGroups.keys()).join(', ')}`);
  
  // Pega os melhores voos de cada companhia
  const bestFlights = [];
  const maxPerAirline = maxFlights; // Mostrar 10 voos de cada companhia
  
  for (const [airline, airlineFlights] of airlineGroups) {
    console.log(`📋 ${airline}: ${airlineFlights.length} voos disponíveis`);
    
    // Ordena voos da companhia pelo critério selecionado
    let sortedAirlineFlights = [...airlineFlights];
    
    if (orderBy === 'preco') {
      sortedAirlineFlights.sort((a, b) => {
        const priceA = a.priceWithTax || a.price || a.totalPrice || 0;
        const priceB = b.priceWithTax || b.price || b.totalPrice || 0;
        return priceA - priceB;
      });
    } else if (orderBy === 'tempo') {
      sortedAirlineFlights.sort((a, b) => {
        const durationA = parseDurationToMinutes(getTotalDuration(a.segments));
        const durationB = parseDurationToMinutes(getTotalDuration(b.segments));
        return durationA - durationB;
      });
    }
    
    // Pega os melhores voos desta companhia (10 de cada)
    const topFlights = sortedAirlineFlights.slice(0, maxPerAirline);
    bestFlights.push(...topFlights);
    
    // Log dos preços individuais para debug
    topFlights.forEach((flight, index) => {
      const price = flight.priceWithTax || flight.price || flight.totalPrice || 0;
      const duration = getTotalDuration(flight.segments);
      console.log(`  ${index + 1}. ${airline} ${flight.numeroVoo} - R$ ${price.toFixed(2)} - ${duration}`);
    });
    
    console.log(`✅ ${airline}: Selecionados ${topFlights.length} voos de ${airlineFlights.length} disponíveis`);
  }
  
  // Ordena o resultado final pelo critério selecionado
  if (orderBy === 'preco') {
    bestFlights.sort((a, b) => {
      const priceA = a.priceWithTax || a.price || a.totalPrice || 0;
      const priceB = b.priceWithTax || b.price || b.totalPrice || 0;
      return priceA - priceB;
    });
  } else if (orderBy === 'tempo') {
    bestFlights.sort((a, b) => {
      const durationA = parseDurationToMinutes(getTotalDuration(a.segments));
      const durationB = parseDurationToMinutes(getTotalDuration(b.segments));
      return durationA - durationB;
    });
  }
  
  console.log(`✅ Selecionados ${bestFlights.length} melhores voos com preços individuais (10 de cada companhia)`);
  console.log(`📊 Resumo por companhia:`);
  for (const [airline, airlineFlights] of airlineGroups) {
    const selectedCount = bestFlights.filter(flight => (flight.companhia || flight.Companhia || 'Outras') === airline).length;
    console.log(`  ${airline}: ${selectedCount} voos selecionados`);
  }
  
  return bestFlights;
}

// Teste com ordenação por preço
console.log('=== TESTE 1: Ordenação por PREÇO ===');
const resultByPrice = filterBestFlights(mockFlights, 'preco');
console.log(`\nRESULTADO FINAL: ${resultByPrice.length} voos selecionados`);

// Verificação dos resultados
const companyCount = {};
resultByPrice.forEach(flight => {
  const company = flight.companhia || flight.Companhia;
  companyCount[company] = (companyCount[company] || 0) + 1;
});

console.log('\n📊 VERIFICAÇÃO DOS RESULTADOS:');
Object.entries(companyCount).forEach(([company, count]) => {
  console.log(`${company}: ${count} voos (${count === 10 ? '✅' : '❌'} - Esperado: 10)`);
});

console.log('\n=== TESTE 2: Ordenação por TEMPO ===');
const resultByTime = filterBestFlights(mockFlights, 'tempo');
console.log(`\nRESULTADO FINAL: ${resultByTime.length} voos selecionados`);

// Verificação dos resultados por tempo
const companyCountTime = {};
resultByTime.forEach(flight => {
  const company = flight.companhia || flight.Companhia;
  companyCountTime[company] = (companyCountTime[company] || 0) + 1;
});

console.log('\n📊 VERIFICAÇÃO DOS RESULTADOS POR TEMPO:');
Object.entries(companyCountTime).forEach(([company, count]) => {
  console.log(`${company}: ${count} voos (${count === 10 ? '✅' : '❌'} - Esperado: 10)`);
});

// Teste final
console.log('\n=== RESUMO FINAL ===');
console.log(`🧪 Dados de entrada: ${mockFlights.length} voos`);
console.log(`   - LATAM: 15 voos`);
console.log(`   - GOL: 12 voos`);
console.log(`   - Azul: 8 voos`);
console.log(`📤 Saída esperada: 28 voos (10 LATAM + 10 GOL + 8 Azul)`);
console.log(`📥 Saída real: ${resultByPrice.length} voos`);
console.log(`✅ Funcionando corretamente: ${resultByPrice.length === 28 ? 'SIM' : 'NÃO'}`);
