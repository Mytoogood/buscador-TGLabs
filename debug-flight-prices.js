// Debug script para investigar discrepâncias nos preços dos voos
// Este script vai capturar dados brutos da API e mostrar o processamento de preços

console.log('🔍 Iniciando debug de preços de voos...\n');

// Função extractPrice copiada do código original
function extractPrice(flight) {
  console.log('📊 Dados brutos do voo:', JSON.stringify(flight, null, 2));
  
  // Lista de campos de preço em ordem de prioridade
  const priceFields = [
    'ValorTotalComTaxa',
    'ValorTotal', 
    'ValorAdulto',
    'ValorFinalComTaxa',
    'ValorFinal',
    'PrecoVenda',
    'PrecoBase',
    'Preco',
    'Valor'
  ];
  
  let foundPrice = null;
  let foundField = null;
  
  for (const field of priceFields) {
    if (flight[field] != null && flight[field] !== 0) {
      foundPrice = flight[field];
      foundField = field;
      console.log(`✅ Preço encontrado no campo '${field}': ${foundPrice}`);
      break;
    } else {
      console.log(`❌ Campo '${field}' não encontrado ou zero:`, flight[field]);
    }
  }
  
  if (foundPrice === null) {
    console.log('⚠️  Nenhum preço encontrado, retornando 0');
    return 0;
  }
  
  // Verificar se é string e converter
  if (typeof foundPrice === 'string') {
    console.log(`🔄 Convertendo string '${foundPrice}' para número`);
    const numericPrice = parseFloat(foundPrice.replace(/[^\d.,]/g, '').replace(',', '.'));
    console.log(`➡️  Resultado da conversão: ${numericPrice}`);
    return numericPrice;
  }
  
  console.log(`➡️  Preço final extraído: ${foundPrice}`);
  return foundPrice;
}

// Função formatCurrency copiada do código original
function formatCurrency(value) {
  if (value == null || isNaN(value)) return 'R$ 0,00';
  
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
  
  console.log(`💰 Formatação de ${value} → ${formatted}`);
  return formatted;
}

// Função para simular a normalização completa
function normalizeFlight(rawFlight) {
  console.log('\n🏷️  Iniciando normalização do voo...');
  
  const price = extractPrice(rawFlight);
  const priceWithTax = price; // Assumindo que o preço já inclui taxas
  const totalPrice = price;
  
  console.log(`📋 Preços normalizados:`);
  console.log(`   - price: ${price}`);
  console.log(`   - priceWithTax: ${priceWithTax}`);
  console.log(`   - totalPrice: ${totalPrice}`);
  
  const normalizedFlight = {
    id: rawFlight.id || 'unknown',
    airline: rawFlight.CompanhiaAerea || 'Unknown',
    origin: rawFlight.Origem || 'Unknown',
    destination: rawFlight.Destino || 'Unknown',
    departureTime: rawFlight.HorarioSaida || 'Unknown',
    arrivalTime: rawFlight.HorarioChegada || 'Unknown',
    price: price,
    priceWithTax: priceWithTax,
    totalPrice: totalPrice,
    duration: rawFlight.Duracao || 'Unknown',
    stops: rawFlight.Paradas || 0,
    rawData: rawFlight
  };
  
  console.log('\n✅ Voo normalizado:', {
    id: normalizedFlight.id,
    airline: normalizedFlight.airline,
    price: normalizedFlight.price,
    priceWithTax: normalizedFlight.priceWithTax,
    totalPrice: normalizedFlight.totalPrice
  });
  
  return normalizedFlight;
}

// Dados de exemplo baseados no que foi observado
const exampleFlights = [
  {
    id: 'gol-001',
    CompanhiaAerea: 'GOL',
    Origem: 'GRU',
    Destino: 'RIO',
    HorarioSaida: '08:00',
    HorarioChegada: '09:30',
    Duracao: '1h30m',
    Paradas: 0,
    ValorTotalComTaxa: 224.70,
    ValorTotal: 224.70,
    ValorAdulto: 224.70
  },
  {
    id: 'gol-002',
    CompanhiaAerea: 'GOL',
    Origem: 'GRU',
    Destino: 'RIO',
    HorarioSaida: '10:00',
    HorarioChegada: '11:30',
    Duracao: '1h30m',
    Paradas: 0,
    ValorTotalComTaxa: 170.39,
    ValorTotal: 170.39,
    ValorAdulto: 170.39
  },
  {
    id: 'gol-003',
    CompanhiaAerea: 'GOL',
    Origem: 'GRU',
    Destino: 'RIO',
    HorarioSaida: '12:00',
    HorarioChegada: '13:30',
    Duracao: '1h30m',
    Paradas: 0,
    // Testando um preço muito alto para ver se há divisão
    ValorTotalComTaxa: 3673.72,
    ValorTotal: 3673.72,
    ValorAdulto: 3673.72
  }
];

// Processar cada voo de exemplo
console.log('\n🧪 Processando voos de exemplo...\n');

exampleFlights.forEach((flight, index) => {
  console.log(`\n📍 === VOO ${index + 1} (${flight.id}) ===`);
  console.log(`🏢 Companhia: ${flight.CompanhiaAerea}`);
  console.log(`🛫 Rota: ${flight.Origem} → ${flight.Destino}`);
  
  const normalizedFlight = normalizeFlight(flight);
  const formattedPrice = formatCurrency(normalizedFlight.price);
  
  console.log(`\n💵 RESULTADO FINAL:`);
  console.log(`   Preço extraído: ${normalizedFlight.price}`);
  console.log(`   Preço formatado: ${formattedPrice}`);
  
  // Verificar se há alguma divisão suspeita
  if (flight.ValorTotalComTaxa && normalizedFlight.price) {
    const ratio = flight.ValorTotalComTaxa / normalizedFlight.price;
    console.log(`   Ratio original/extraído: ${ratio.toFixed(4)}`);
    
    if (Math.abs(ratio - 21.56) < 0.1) {
      console.log(`   ⚠️  SUSPEITO: Ratio próximo a 21.56! Possível divisão incorreta.`);
    }
  }
  
  console.log(`\n${'='.repeat(50)}`);
});

console.log('\n🔍 Debug concluído! Verifique os logs acima para identificar discrepâncias.');
console.log('\n📝 Próximos passos sugeridos:');
console.log('1. Compare os preços extraídos com os preços esperados');
console.log('2. Verifique se há alguma divisão ou multiplicação inesperada');
console.log('3. Examine os dados brutos da API real no console do navegador');
console.log('4. Procure por transformações de preço não documentadas');
