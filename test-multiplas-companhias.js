// Teste para verificar se a identificação de múltiplas companhias está funcionando

// Mock de dados com diferentes companhias
const mockFlights = [
  // LATAM
  {
    id: 'latam-1',
    companhia: 'LATAM',
    numeroVoo: 'LA-3000',
    priceWithTax: 500,
    segments: [{ departure: 'GRU', arrival: 'GIG', duration: 120 }]
  },
  {
    id: 'latam-2',
    validatingBy: { name: 'LATAM' },
    numeroVoo: 'LA-3001',
    priceWithTax: 550,
    segments: [{ departure: 'GRU', arrival: 'GIG', duration: 125 }]
  },
  
  // GOL
  {
    id: 'gol-1',
    companhia: 'GOL',
    numeroVoo: 'G3-1000',
    priceWithTax: 450,
    segments: [{ departure: 'GRU', arrival: 'GIG', duration: 115 }]
  },
  {
    id: 'gol-2',
    segments: [{ 
      IdCiaResponsavel: 2, 
      departure: 'GRU', 
      arrival: 'GIG', 
      duration: 118,
      legs: [{ flightNumber: 'G3-1001', operatedBy: { name: 'GOL' } }]
    }],
    priceWithTax: 480
  },
  
  // Azul
  {
    id: 'azul-1',
    companhia: 'Azul',
    numeroVoo: 'AD-4000',
    priceWithTax: 520,
    segments: [{ departure: 'GRU', arrival: 'GIG', duration: 125 }]
  },
  {
    id: 'azul-2',
    segments: [{ 
      IdCiaResponsavel: 3, 
      departure: 'GRU', 
      arrival: 'GIG', 
      duration: 130,
      legs: [{ flightNumber: 'AD-4001', operatedBy: { name: 'Azul' } }]
    }],
    priceWithTax: 540
  },
  
  // Livelo
  {
    id: 'livelo-1',
    segments: [{ 
      IdCiaResponsavel: 34, 
      departure: 'GRU', 
      arrival: 'GIG', 
      duration: 140,
      legs: [{ flightNumber: 'LV-5000', operatedBy: { name: 'Livelo' } }]
    }],
    priceWithTax: 600
  },
  {
    id: 'livelo-2',
    numeroVoo: 'LV-5001',
    validatingBy: { name: 'Livelo' },
    priceWithTax: 620,
    segments: [{ departure: 'GRU', arrival: 'GIG', duration: 145 }]
  },
  
  // TAP Air Portugal
  {
    id: 'tap-1',
    segments: [{ 
      IdCiaResponsavel: 11, 
      departure: 'GRU', 
      arrival: 'GIG', 
      duration: 150,
      legs: [{ flightNumber: 'TP-9000', operatedBy: { name: 'TAP Air Portugal' } }]
    }],
    priceWithTax: 800
  }
];

// Função de identificação de companhias (copiada do código)
function identifyAirline(flight) {
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
  
  return airline;
}

// Testa a identificação
console.log('=== TESTE DE IDENTIFICAÇÃO DE COMPANHIAS ===\n');

const airlineGroups = new Map();

mockFlights.forEach((flight, index) => {
  const airline = identifyAirline(flight);
  
  console.log(`Voo ${index + 1}: ${flight.id}`);
  console.log(`  Companhia identificada: ${airline}`);
  console.log(`  Campos disponíveis:`, {
    companhia: flight.companhia,
    Companhia: flight.Companhia,
    validatingBy: flight.validatingBy?.name,
    IdCiaResponsavel: flight.segments?.[0]?.IdCiaResponsavel,
    operatedBy: flight.segments?.[0]?.legs?.[0]?.operatedBy?.name,
    numeroVoo: flight.numeroVoo || flight.segments?.[0]?.legs?.[0]?.flightNumber
  });
  console.log('');
  
  if (!airlineGroups.has(airline)) {
    airlineGroups.set(airline, []);
  }
  airlineGroups.get(airline).push(flight);
});

console.log('=== RESUMO POR COMPANHIA ===');
for (const [airline, flights] of airlineGroups) {
  console.log(`${airline}: ${flights.length} voos`);
  flights.forEach(flight => {
    console.log(`  - ${flight.id} (R$ ${flight.priceWithTax})`);
  });
}

console.log('\n=== VERIFICAÇÃO ===');
const expectedCompanies = ['LATAM', 'GOL', 'Azul', 'Livelo', 'TAP Air Portugal'];
const foundCompanies = Array.from(airlineGroups.keys()).filter(c => c !== 'Outras');

console.log(`Companhias esperadas: ${expectedCompanies.join(', ')}`);
console.log(`Companhias encontradas: ${foundCompanies.join(', ')}`);

const allFound = expectedCompanies.every(company => foundCompanies.includes(company));
console.log(`✅ Todas as companhias identificadas corretamente: ${allFound ? 'SIM' : 'NÃO'}`);

if (!allFound) {
  const missing = expectedCompanies.filter(company => !foundCompanies.includes(company));
  console.log(`❌ Companhias não encontradas: ${missing.join(', ')}`);
}
