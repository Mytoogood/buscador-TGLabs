// Script para interceptar e analisar dados reais da API Moblix
// Execute no console do navegador ANTES de fazer a busca de voos
(function() {
  console.log('🔍 Iniciando interceptação de dados da API Moblix...');
  
  // Intercepta todas as requisições XMLHttpRequest
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;
  
  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    this._interceptedMethod = method;
    this._interceptedUrl = url;
    return originalXHROpen.apply(this, arguments);
  };
  
  XMLHttpRequest.prototype.send = function(data) {
    const xhr = this;
    
    // Intercepta apenas requisições para a API Moblix
    if (xhr._interceptedUrl && xhr._interceptedUrl.includes('/api/ConsultaAereo/Consultar')) {
      console.log('🛫 Interceptando requisição de voos:', xhr._interceptedUrl);
      
      if (data) {
        try {
          const requestData = JSON.parse(data);
          console.log('📤 Dados da requisição:', requestData);
          console.log('👥 Passageiros:', {
            adultos: requestData.Adultos,
            criancas: requestData.Criancas,
            bebes: requestData.Bebes,
            total: (requestData.Adultos || 0) + (requestData.Criancas || 0) + (requestData.Bebes || 0)
          });
        } catch (e) {
          console.log('📤 Dados da requisição (raw):', data);
        }
      }
      
      // Intercepta a resposta
      const originalOnReadyStateChange = xhr.onreadystatechange;
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          try {
            const responseData = JSON.parse(xhr.responseText);
            console.log('📥 Resposta completa da API:', responseData);
            
            if (responseData.Data && Array.isArray(responseData.Data)) {
              console.log('✈️ Analisando', responseData.Data.length, 'voos encontrados:');
              
              responseData.Data.forEach((flight, index) => {
                console.log(`\n--- VOO ${index + 1} ---`);
                console.log('🏢 Companhia:', flight.Companhia || 'N/A');
                console.log('🆔 ID:', flight.Id || 'N/A');
                
                // Analisa todos os campos de preço
                console.log('💰 ANÁLISE DE PREÇOS:');
                const priceFields = [
                  'ValorTotalComTaxa',
                  'ValorTotal', 
                  'ValorAdulto',
                  'ValorCrianca',
                  'ValorBebe',
                  'ValorTaxas',
                  'PrecoTotal',
                  'PrecoAdulto',
                  'Valor',
                  'Preco'
                ];
                
                priceFields.forEach(field => {
                  if (flight[field] !== undefined) {
                    console.log(`  ${field}:`, flight[field]);
                  }
                });
                
                // Analisa Tarifas se existir
                if (flight.Tarifas && Array.isArray(flight.Tarifas)) {
                  console.log('💳 TARIFAS:', flight.Tarifas.length);
                  flight.Tarifas.forEach((tarifa, tIndex) => {
                    console.log(`  Tarifa ${tIndex + 1}:`, {
                      ValorTotalComTaxa: tarifa.ValorTotalComTaxa,
                      ValorTotal: tarifa.ValorTotal,
                      ValorAdulto: tarifa.ValorAdulto,
                      ValorCrianca: tarifa.ValorCrianca,
                      ValorBebe: tarifa.ValorBebe
                    });
                  });
                }
                
                // Analisa segmentos
                if (flight.Segmentos && Array.isArray(flight.Segmentos)) {
                  console.log('🛣️ SEGMENTOS:', flight.Segmentos.length);
                  flight.Segmentos.forEach((segment, sIndex) => {
                    console.log(`  Segmento ${sIndex + 1}:`, {
                      origem: segment.Origem,
                      destino: segment.Destino,
                      companhia: segment.Companhia,
                      classe: segment.Classe
                    });
                    
                    // Analisa preços dos segmentos
                    const segmentPrices = [
                      'ValorTotalComTaxa',
                      'ValorTotal',
                      'ValorAdulto',
                      'Valor',
                      'Preco'
                    ];
                    
                    segmentPrices.forEach(field => {
                      if (segment[field] !== undefined) {
                        console.log(`    ${field}:`, segment[field]);
                      }
                    });
                  });
                }
                
                // Verifica se há divisão por número de passageiros
                const totalPassengers = xhr._requestPassengers || 1;
                console.log(`🧮 VERIFICAÇÃO DE DIVISÃO (${totalPassengers} passageiros):`);
                
                priceFields.forEach(field => {
                  if (flight[field] !== undefined && typeof flight[field] === 'number') {
                    const divided = flight[field] / totalPassengers;
                    console.log(`  ${field} ÷ ${totalPassengers} = ${divided.toFixed(2)}`);
                  }
                });
                
                console.log('---');
              });
              
              // Análise estatística dos preços
              console.log('\n📊 ANÁLISE ESTATÍSTICA DOS PREÇOS:');
              const allPrices = [];
              responseData.Data.forEach(flight => {
                if (flight.ValorTotalComTaxa) allPrices.push(flight.ValorTotalComTaxa);
                else if (flight.ValorTotal) allPrices.push(flight.ValorTotal);
                else if (flight.ValorAdulto) allPrices.push(flight.ValorAdulto);
              });
              
              if (allPrices.length > 0) {
                const min = Math.min(...allPrices);
                const max = Math.max(...allPrices);
                const avg = allPrices.reduce((a, b) => a + b, 0) / allPrices.length;
                
                console.log(`  Menor preço: R$ ${min.toFixed(2)}`);
                console.log(`  Maior preço: R$ ${max.toFixed(2)}`);
                console.log(`  Preço médio: R$ ${avg.toFixed(2)}`);
                console.log(`  Total de voos com preço: ${allPrices.length}`);
              }
            }
          } catch (e) {
            console.error('❌ Erro ao analisar resposta:', e);
            console.log('📥 Resposta bruta:', xhr.responseText);
          }
        }
        
        if (originalOnReadyStateChange) {
          originalOnReadyStateChange.apply(this, arguments);
        }
      };
    }
    
    return originalXHRSend.apply(this, arguments);
  };
  
  // Intercepta fetch também (caso seja usado)
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    if (url.includes('/api/ConsultaAereo/Consultar')) {
      console.log('🛫 Interceptando fetch para voos:', url);
      
      if (options && options.body) {
        try {
          const requestData = JSON.parse(options.body);
          console.log('📤 Dados da requisição (fetch):', requestData);
        } catch (e) {
          console.log('📤 Dados da requisição (fetch raw):', options.body);
        }
      }
    }
    
    return originalFetch.apply(this, arguments).then(response => {
      if (url.includes('/api/ConsultaAereo/Consultar') && response.ok) {
        return response.clone().json().then(data => {
          console.log('📥 Resposta da API (fetch):', data);
          return response;
        }).catch(() => response);
      }
      return response;
    });
  };
  
  console.log('✅ Interceptação configurada! Faça uma busca de voos para ver os dados.');
  console.log('ℹ️  Abra o console do navegador para ver os logs detalhados.');
})();
