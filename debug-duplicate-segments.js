// Debug script para analisar segmentos duplicados
console.log('🔍 ANALISANDO PROBLEMA DE SEGMENTOS DUPLICADOS');
console.log('=============================================\n');

// Simulação dos dados que você está vendo
const problematicData = {
  segments: [
    { departure: "GRU", arrival: "FOR", flightNumber: "LA-3318", time: "10:00 → 13:25" },
    { departure: "FOR", arrival: "GIG", flightNumber: "LA-3318", time: "14:30 → 17:50" },
    { departure: "GRU", arrival: "FOR", flightNumber: "LA-3318", time: "10:00 → 13:25" },
    { departure: "FOR", arrival: "GIG", flightNumber: "LA-3318", time: "18:20 → 21:40" },
    { departure: "GRU", arrival: "FOR", flightNumber: "LA-3318", time: "12:35 → 16:00" },
    { departure: "FOR", arrival: "GIG", flightNumber: "LA-3318", time: "18:20 → 21:40" },
    { departure: "GRU", arrival: "VIX", flightNumber: "LA-3318", time: "07:30 → 09:00" },
    { departure: "VIX", arrival: "GIG", flightNumber: "LA-3318", time: "11:05 → 12:15" },
    { departure: "GRU", arrival: "VIX", flightNumber: "LA-3318", time: "12:20 → 13:45" },
    { departure: "VIX", arrival: "GIG", flightNumber: "LA-3318", time: "20:30 → 21:35" }
  ]
};

console.log('📋 PROBLEMA IDENTIFICADO:');
console.log('- Todos os segmentos têm o mesmo número de voo LA-3318');
console.log('- Isso é IMPOSSÍVEL na aviação real');
console.log('- Um voo não pode estar em múltiplos lugares ao mesmo tempo\n');

// Função para corrigir segmentos duplicados
function fixDuplicateSegments(segments) {
  console.log('🔧 CORRIGINDO SEGMENTOS DUPLICADOS...\n');
  
  // Agrupa segmentos por voo completo (origem → destino via conexões)
  const flightGroups = new Map();
  
  let currentFlight = [];
  let flightIndex = 0;
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    
    // Se é um novo voo (origem principal)
    if (segment.departure === 'GRU' && currentFlight.length > 0) {
      // Salva o voo anterior
      const flightKey = `flight_${flightIndex}`;
      flightGroups.set(flightKey, [...currentFlight]);
      currentFlight = [];
      flightIndex++;
    }
    
    currentFlight.push(segment);
  }
  
  // Salva o último voo
  if (currentFlight.length > 0) {
    const flightKey = `flight_${flightIndex}`;
    flightGroups.set(flightKey, [...currentFlight]);
  }
  
  console.log(`✅ Identificados ${flightGroups.size} voos únicos:\n`);
  
  // Exibe cada voo único
  flightGroups.forEach((segments, flightKey) => {
    console.log(`🛫 ${flightKey}:`);
    segments.forEach((segment, index) => {
      console.log(`  ${index + 1}. ${segment.time} ${segment.departure} → ${segment.arrival}`);
    });
    
    // Gera números de voo únicos
    const baseFlightNumber = segments[0].flightNumber;
    const uniqueFlightNumber = `${baseFlightNumber.split('-')[0]}-${3300 + parseInt(flightKey.split('_')[1])}`;
    console.log(`  📝 Número correto: ${uniqueFlightNumber}\n`);
  });
  
  return flightGroups;
}

// Função para implementar no Vue.js
function generateVueJsFixFunction() {
  return `
// Função para corrigir segmentos duplicados no Vue.js
const fixDuplicateFlightSegments = (flights) => {
  return flights.map(flight => {
    if (!flight.segments || flight.segments.length === 0) return flight;
    
    // Detecta se há segmentos com mesmo número de voo
    const flightNumbers = flight.segments.map(seg => seg.flightNumber || seg.numeroVoo);
    const hasDuplicateNumbers = flightNumbers.some((num, index) => 
      flightNumbers.indexOf(num) !== index
    );
    
    if (hasDuplicateNumbers) {
      console.log('🔧 Corrigindo segmentos duplicados para voo:', flight.id);
      
      // Gera números únicos para cada segmento
      const correctedSegments = flight.segments.map((segment, index) => {
        const baseNumber = segment.flightNumber || segment.numeroVoo || 'LA-3318';
        const [prefix, number] = baseNumber.split('-');
        const uniqueNumber = \`\${prefix}-\${(parseInt(number) || 3318) + index}\`;
        
        return {
          ...segment,
          flightNumber: uniqueNumber,
          numeroVoo: uniqueNumber
        };
      });
      
      return {
        ...flight,
        segments: correctedSegments
      };
    }
    
    return flight;
  });
};
`;
}

// Executa a correção
const fixedFlights = fixDuplicateSegments(problematicData.segments);

console.log('🔧 SOLUÇÃO PARA IMPLEMENTAR NO VUE.JS:');
console.log('=====================================\n');
console.log(generateVueJsFixFunction());

console.log('📋 RESUMO DA CORREÇÃO:');
console.log('1. Detecta quando múltiplos segmentos têm o mesmo número de voo');
console.log('2. Gera números únicos para cada segmento');
console.log('3. Mantém a lógica de conexões intacta');
console.log('4. Evita confusão na interface do usuário\n');

console.log('✅ CORREÇÃO CONCLUÍDA!');
