// Debug script para investigar discrepância de preços
// Executar no browser console após fazer uma busca de voos

console.log('🔍 === DEBUGGING PRICE DISCREPANCY ===');

// Verifica se há resultados de busca
if (typeof searchResults === 'undefined') {
  console.log('❌ searchResults não está definido. Execute uma busca primeiro.');
  console.log('💡 Tente executar este script após fazer uma busca de voos.');
} else {
  console.log('✅ searchResults encontrado:', searchResults.value);
  
  // Analisa os preços dos voos
  const flights = searchResults.value;
  
  if (flights && flights.length > 0) {
    console.log('📊 Analisando preços dos voos...');
    
    flights.forEach((flight, index) => {
      console.log(`\n--- VOO ${index + 1} ---`);
      console.log('🏢 Companhia:', flight.companhia);
      console.log('🛫 Número do voo:', flight.numeroVoo);
      console.log('💰 priceWithTax:', flight.priceWithTax);
      console.log('💰 price:', flight.price);
      console.log('💰 totalPrice:', flight.totalPrice);
      console.log('💰 valorTotal:', flight.valorTotal);
      console.log('💰 valorTotalComTaxa:', flight.valorTotalComTaxa);
      
      // Verifica se há discrepância
      const mainPrice = flight.priceWithTax || flight.price || flight.totalPrice || 0;
      const originalPrice = flight._originalData?.ValorTotalComTaxa || 
                          flight._originalData?.ValorTotal || 
                          flight._originalData?.ValorAdulto || 0;
      
      console.log('🔍 Preço exibido:', mainPrice);
      console.log('🔍 Preço original da API:', originalPrice);
      
      if (Math.abs(mainPrice - originalPrice) > 0.01) {
        console.log('⚠️ DISCREPÂNCIA DETECTADA!');
        console.log('📈 Diferença:', mainPrice - originalPrice);
        console.log('📊 Percentual:', ((mainPrice - originalPrice) / originalPrice * 100).toFixed(2) + '%');
        
        // Mostra dados originais completos
        console.log('📄 Dados originais completos:', flight._originalData);
      } else {
        console.log('✅ Preço consistente');
      }
    });
    
    // Análise específica para o voo GOL GRU → GIG
    const golFlight = flights.find(f => 
      f.companhia && f.companhia.includes('GOL') && 
      f.numeroVoo && f.numeroVoo.includes('1924')
    );
    
    if (golFlight) {
      console.log('\n🎯 === ANÁLISE ESPECÍFICA: GOL G3-1924 ===');
      console.log('💰 Preço exibido:', golFlight.priceWithTax || golFlight.price || golFlight.totalPrice);
      console.log('📊 Dados completos do voo:', golFlight);
      console.log('🔍 Dados originais da API:', golFlight._originalData);
      
      // Verifica se o preço está sendo formatado corretamente
      const displayPrice = golFlight.priceWithTax || golFlight.price || golFlight.totalPrice || 0;
      const formattedPrice = new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      }).format(displayPrice);
      
      console.log('💱 Preço formatado:', formattedPrice);
      
      // Verifica se o problema está na comparação de strings/números
      console.log('🔍 Tipo do preço:', typeof displayPrice);
      console.log('🔍 Valor exato:', displayPrice);
      console.log('🔍 Valor com 2 casas decimais:', displayPrice.toFixed(2));
      
      // Verifica se há diferença entre R$ 283,44 e R$ 317,14
      const expectedPrice1 = 283.44;
      const expectedPrice2 = 317.14;
      
      console.log('🎯 Comparação com preços esperados:');
      console.log('   R$ 283,44 vs atual:', Math.abs(displayPrice - expectedPrice1));
      console.log('   R$ 317,14 vs atual:', Math.abs(displayPrice - expectedPrice2));
      
      if (Math.abs(displayPrice - expectedPrice1) < 0.01) {
        console.log('✅ Preço atual corresponde a R$ 283,44');
      } else if (Math.abs(displayPrice - expectedPrice2) < 0.01) {
        console.log('✅ Preço atual corresponde a R$ 317,14');
      } else {
        console.log('❓ Preço atual não corresponde a nenhum dos valores esperados');
      }
    } else {
      console.log('\n⚠️ Voo GOL G3-1924 GRU → GIG não encontrado nos resultados');
    }
  } else {
    console.log('❌ Nenhum voo encontrado nos resultados');
  }
}

console.log('\n🔍 === FIM DO DEBUG ===');
