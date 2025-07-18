// Teste para verificar a funcionalidade de 10 voos por companhia
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
      departure: 'GRU',
      arrival: 'GIG',
      duration: 120 + (i * 10),
      departureDate: '2025-07-11T08:00:00',
      arrivalDate: '2025-07-11T10:00:00'
    }],
    horarioSaida: '08:00',
    horarioChegada: '10:00',
    origem: 'GRU',
    destino: 'GIG'
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
      departure: 'GRU',
      arrival: 'GIG',
      duration: 115 + (i * 8),
      departureDate: '2025-07-11T09:00:00',
      arrivalDate: '2025-07-11T11:00:00'
    }],
    horarioSaida: '09:00',
    horarioChegada: '11:00',
    origem: 'GRU',
    destino: 'GIG'
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
      departure: 'GRU',
      arrival: 'GIG',
      duration: 125 + (i * 12),
      departureDate: '2025-07-11T10:00:00',
      arrivalDate: '2025-07-11T12:00:00'
    }],
    horarioSaida: '10:00',
    horarioChegada: '12:00',
    origem: 'GRU',
    destino: 'GIG'
  })),
  // 11 voos da TAP Air Portugal
  ...Array.from({ length: 11 }, (_, i) => ({
    id: `tap-${i}`,
    companhia: 'TAP Air Portugal',
    Companhia: 'TAP Air Portugal',
    numeroVoo: `TP-${1100 + i}`,
    priceWithTax: 700 + (i * 60),
    price: 700 + (i * 60),
    totalPrice: 700 + (i * 60),
    segments: [{
      departure: 'GRU',
      arrival: 'GIG',
      duration: 140 + (i * 15),
      departureDate: '2025-07-11T11:00:00',
      arrivalDate: '2025-07-11T13:00:00'
    }],
    horarioSaida: '11:00',
    horarioChegada: '13:00',
    origem: 'GRU',
    destino: 'GIG'
  })),
  // 13 voos da Livelo
  ...Array.from({ length: 13 }, (_, i) => ({
    id: `livelo-${i}`,
    companhia: 'Livelo',
    Companhia: 'Livelo',
    numeroVoo: `LV-${2000 + i}`,
    priceWithTax: 550 + (i * 45),
    price: 550 + (i * 45),
    totalPrice: 550 + (i * 45),
    segments: [{
      departure: 'GRU',
      arrival: 'GIG',
      duration: 130 + (i * 10),
      departureDate: '2025-07-11T12:00:00',
      arrivalDate: '2025-07-11T14:00:00'
    }],
    horarioSaida: '12:00',
    horarioChegada: '14:00',
    origem: 'GRU',
    destino: 'GIG'
  })),
  // 14 voos da Copa Airlines
  ...Array.from({ length: 14 }, (_, i) => ({
    id: `copa-${i}`,
    companhia: 'Copa Airlines',
    Companhia: 'Copa Airlines',
    numeroVoo: `CM-${800 + i}`,
    priceWithTax: 600 + (i * 50),
    price: 600 + (i * 50),
    totalPrice: 600 + (i * 50),
    segments: [{
      departure: 'GRU',
      arrival: 'GIG',
      duration: 135 + (i * 12),
      departureDate: '2025-07-11T13:00:00',
      arrivalDate: '2025-07-11T15:00:00'
    }],
    horarioSaida: '13:00',
    horarioChegada: '15:00',
    origem: 'GRU',
    destino: 'GIG'
  })),
  // 10 voos da American Airlines
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `american-${i}`,
    companhia: 'American Airlines',
    Companhia: 'American Airlines',
    numeroVoo: `AA-${1500 + i}`,
    priceWithTax: 800 + (i * 70),
    price: 800 + (i * 70),
    totalPrice: 800 + (i * 70),
    segments: [{
      departure: 'GRU',
      arrival: 'GIG',
      duration: 145 + (i * 15),
      departureDate: '2025-07-11T14:00:00',
      arrivalDate: '2025-07-11T16:00:00'
    }],
    horarioSaida: '14:00',
    horarioChegada: '16:00',
    origem: 'GRU',
    destino: 'GIG'
  })),
  // 12 voos da Iberia
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `iberia-${i}`,
    companhia: 'Iberia',
    Companhia: 'Iberia',
    numeroVoo: `IB-${6000 + i}`,
    priceWithTax: 750 + (i * 65),
    price: 750 + (i * 65),
    totalPrice: 750 + (i * 65),
    segments: [{
      departure: 'GRU',
      arrival: 'GIG',
      duration: 150 + (i * 10),
      departureDate: '2025-07-11T15:00:00',
      arrivalDate: '2025-07-11T17:00:00'
    }],
    horarioSaida: '15:00',
    horarioChegada: '17:00',
    origem: 'GRU',
    destino: 'GIG'
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
  
  const maxFlights = 10;
  // Mostrar exatamente 10 voos de cada companhia
  
  console.log(`🎯 Filtrando os melhores voos por ${orderBy === 'preco' ? 'MENOR PREÇO' : 'MENOR TEMPO'}...`);
  console.log(`📊 Mostrando PREÇOS INDIVIDUAIS para cada voo`);
  
  // Separa voos por companhia aérea
  const airlineGroups = new Map();
  
  flights.forEach(flight => {
    // Melhor identificação da companhia aérea
    let airline = flight.companhia || flight.Companhia || flight.CompanhiaNome;
    
    // Se não encontrou nos campos diretos, tenta detectar por outras propriedades
    if (!airline || airline === 'Outras') {
      // Verifica validatingBy
      if (flight.validatingBy?.name) {
        airline = flight.validatingBy.name;
      }
      // Verifica segments
      else if (flight.segments?.[0]?.legs?.[0]?.operatedBy?.name) {
        airline = flight.segments[0].legs[0].operatedBy.name;
      }
      // Verifica por IdCiaResponsavel
      else if (flight.segments?.[0]?.IdCiaResponsavel) {
        const companyMap = {
          1: 'LATAM',
          2: 'GOL',
          3: 'Azul',
          11: 'TAP Air Portugal',
          13: 'Copa Airlines',
          22: 'American Airlines',
          26: 'Iberia',
          34: 'Livelo',
          1200: 'Azul Interline'
        };
        airline = companyMap[flight.segments[0].IdCiaResponsavel] || 'Outras';
      }
      // Verifica por número do voo
      else if (flight.numeroVoo || flight.segments?.[0]?.legs?.[0]?.flightNumber) {
        const flightNumber = flight.numeroVoo || flight.segments[0].legs[0].flightNumber;
        if (flightNumber.includes('LA') || flightNumber.includes('LATAM')) {
          airline = 'LATAM';
        } else if (flightNumber.includes('G3') || flightNumber.includes('GOL')) {
          airline = 'GOL';
        } else if (flightNumber.includes('AD') || flightNumber.includes('AZUL')) {
          airline = 'Azul';
        } else if (flightNumber.includes('TP') || flightNumber.includes('TAP')) {
          airline = 'TAP Air Portugal';
        } else if (flightNumber.includes('CM') || flightNumber.includes('COPA')) {
          airline = 'Copa Airlines';
        } else if (flightNumber.includes('AA') || flightNumber.includes('AMERICAN')) {
          airline = 'American Airlines';
        } else if (flightNumber.includes('IB') || flightNumber.includes('IBERIA')) {
          airline = 'Iberia';
        } else if (flightNumber.includes('LV') || flightNumber.includes('LIVELO')) {
          airline = 'Livelo';
        } else {
          airline = 'Outras';
        }
      }
      else {
        airline = 'Outras';
      }
    }
    
    // Normaliza nomes das companhias
    if (airline) {
      airline = airline.trim();
      if (airline.toUpperCase().includes('LATAM')) airline = 'LATAM';
      else if (airline.toUpperCase().includes('GOL')) airline = 'GOL';
      else if (airline.toUpperCase().includes('AZUL')) airline = 'Azul';
      else if (airline.toUpperCase().includes('TAP')) airline = 'TAP Air Portugal';
      else if (airline.toUpperCase().includes('COPA')) airline = 'Copa Airlines';
      else if (airline.toUpperCase().includes('AMERICAN')) airline = 'American Airlines';
      else if (airline.toUpperCase().includes('IBERIA')) airline = 'Iberia';
      else if (airline.toUpperCase().includes('LIVELO')) airline = 'Livelo';
    }
    
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
    const selectedCount = bestFlights.filter(flight => {
      const flightAirline = flight.companhia || flight.Companhia || flight.CompanhiaNome;
      return flightAirline === airline;
    }).length;
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
console.log(`   - TAP Air Portugal: 11 voos`);
console.log(`   - Livelo: 13 voos`);
console.log(`   - Copa Airlines: 14 voos`);
console.log(`   - American Airlines: 10 voos`);
console.log(`   - Iberia: 12 voos`);
console.log(`📤 Saída esperada: 80 voos (10 de cada companhia)`);
console.log(`📥 Saída real: ${resultByPrice.length} voos`);
console.log(`✅ Funcionando corretamente: ${resultByPrice.length === 80 ? 'SIM' : 'NÃO'}`);
