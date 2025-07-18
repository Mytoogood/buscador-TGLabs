// Script de Debug Avançado para Análise de Preços
// Cole este código no console do navegador durante o uso da aplicação

console.log('🔍 Script de Debug de Preços Ativado');

// Intercepta chamadas para a API
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('🌐 Interceptando fetch:', args[0]);
  
  return originalFetch.apply(this, args).then(response => {
    // Clone a resposta para poder lê-la
    const clonedResponse = response.clone();
    
    // Se for uma chamada para a API Moblix, analisa os dados
    if (args[0] && args[0].includes('moblix')) {
      clonedResponse.json().then(data => {
        console.log('📡 RESPOSTA DA API MOBLIX:');
        console.log('URL:', args[0]);
        console.log('Dados:', JSON.stringify(data, null, 2));
        
        // Analisa preços na resposta
        analyzeApiResponse(data);
      }).catch(e => {
        console.log('❌ Erro ao analisar resposta da API:', e);
      });
    }
    
    return response;
  });
};

// Função para analisar detalhadamente a resposta da API
function analyzeApiResponse(data) {
  console.log('\n=== ANÁLISE DETALHADA DE PREÇOS ===');
  
  let flights = [];
  
  // Extrai voos da resposta conforme a estrutura do código
  if (data?.Data && Array.isArray(data.Data) && data.Data.length > 0) {
    const firstDataItem = data.Data[0];
    if (firstDataItem?.flights && Array.isArray(firstDataItem.flights)) {
      flights = firstDataItem.flights;
      console.log('✅ Voos encontrados em Data[0].flights:', flights.length);
    } else {
      flights = data.Data;
      console.log('✅ Voos encontrados em Data:', flights.length);
    }
  } else if (data?.Ida && Array.isArray(data.Ida)) {
    flights = data.Ida;
    console.log('✅ Voos encontrados em Ida:', flights.length);
  } else if (Array.isArray(data)) {
    flights = data;
    console.log('✅ Voos encontrados como array direto:', flights.length);
  }
  
  if (flights.length > 0) {
    console.log('\n📊 ANÁLISE DE PREÇOS DOS PRIMEIROS 5 VOOS:');
    
    flights.slice(0, 5).forEach((flight, index) => {
      console.log(`\n--- VOO ${index + 1} ---`);
      console.log('Voo completo:', flight);
      
      // Analisa todos os campos que podem conter preço
      const priceFields = [
        'Valor', 'ValorTotal', 'ValorTotalComTaxa', 'ValorTotalSemTaxa',
        'price', 'priceWithTax', 'totalPrice', 'Preco', 'PrecoTotal',
        'valorAdulto', 'valorCrianca', 'valorBebe', 'tarifa', 'taxa'
      ];
      
      priceFields.forEach(field => {
        if (flight[field] !== undefined) {
          console.log(`💰 ${field}: ${flight[field]} (tipo: ${typeof flight[field]})`);
        }
      });
      
      // Verifica se há campos aninhados que podem conter preços
      if (flight.segments && Array.isArray(flight.segments)) {
        flight.segments.forEach((segment, segIndex) => {
          console.log(`📍 Segmento ${segIndex + 1}:`, segment);
          priceFields.forEach(field => {
            if (segment[field] !== undefined) {
              console.log(`  💰 ${field}: ${segment[field]} (tipo: ${typeof segment[field]})`);
            }
          });
        });
      }
      
      // Verifica informações de passageiros
      if (flight.passengers !== undefined) {
        console.log(`👥 Passageiros: ${flight.passengers}`);
      }
      
      // Calcula possíveis divisões
      const mainPrice = flight.ValorTotalComTaxa || flight.ValorTotal || flight.Valor || flight.price;
      if (mainPrice) {
        console.log(`🧮 Possíveis divisões do preço ${mainPrice}:`);
        [1, 2, 3, 4, 5, 21.56, 21.57, 21.55].forEach(divisor => {
          const result = mainPrice / divisor;
          console.log(`  ${mainPrice} ÷ ${divisor} = ${result.toFixed(2)}`);
        });
      }
    });
  }
  
  console.log('\n=== FIM DA ANÁLISE ===\n');
}

// Monitora mudanças no Vue store/state
let lastFlightResults = null;
setInterval(() => {
  // Tenta acessar o Vue app e seus dados
  const vueApp = document.querySelector('#app').__vue__;
  if (vueApp && vueApp.searchResults) {
    const currentResults = JSON.stringify(vueApp.searchResults);
    if (currentResults !== lastFlightResults) {
      console.log('\n🔄 MUDANÇA NOS RESULTADOS DE VOO DETECTADA:');
      console.log('Novos resultados:', vueApp.searchResults);
      
      if (vueApp.searchResults.length > 0) {
        console.log('\n💰 PREÇOS FINAIS EXIBIDOS:');
        vueApp.searchResults.forEach((flight, index) => {
          console.log(`Voo ${index + 1}:`, {
            companhia: flight.companhia,
            priceWithTax: flight.priceWithTax,
            price: flight.price,
            totalPrice: flight.totalPrice,
            precoExibido: flight.priceWithTax || flight.price || flight.totalPrice
          });
        });
      }
      
      lastFlightResults = currentResults;
    }
  }
}, 1000);

console.log('✅ Script de debug configurado! Faça uma busca de voos para ver os dados.');
