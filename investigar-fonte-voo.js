
async function investigarFonteVoo() {
  console.log('🔍 INVESTIGANDO: Onde o voo LA-9058 (R$ 3.187,17) está sendo vendido...\n');
  
  try {
    // 1. Buscar voos da mesma forma que o frontend faz
    console.log('📡 Fazendo requisição para a API Moblix...');
    
    const searchData = {
      origem: 'CGH',
      destino: 'GIG', 
      dataIda: '2025-07-06',
      dataVolta: null,
      adultos: 1,
      criancas: 0,
      bebes: 0,
      classe: 'Y'
    };
    
    // Primeiro endpoint - ConsultaAereo
    console.log('🔄 Testando /api/ConsultaAereo/Consultar...');
    
    const response1 = await axios.post('https://api.moblix.com.br/api/ConsultaAereo/Consultar', searchData, {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'externo',
        'Referer': 'https://moblix.com.br/',
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json'
      }
    });
    
    console.log('✅ Resposta recebida! Analisando voos...\n');
    
    if (response1.data && response1.data.Data && response1.data.Data.length > 0) {
      console.log(`📊 Total de voos encontrados: ${response1.data.Data.length}`);
      
      // Procurar especificamente pelo voo LA-9058
      const targetFlight = response1.data.Data.find(flight => {
        const numeroVoo = flight.numeroVoo || flight.FlightNumber || 
                         flight.segments?.[0]?.legs?.[0]?.flightNumber ||
                         (flight.segments?.[0]?.legs?.[0] && Object.values(flight.segments[0].legs[0]).find(v => 
                           typeof v === 'string' && v.includes('LA-9058')));
        
        const preco = flight.priceWithTax || flight.price || flight.totalPrice || flight.valorTotal;
        
        return numeroVoo && numeroVoo.includes('9058') && preco > 3000;
      });
      
      if (targetFlight) {
        console.log('🎯 VOO ALVO ENCONTRADO!');
        console.log('==========================================');
        
        // Análise detalhada do voo
        console.log('📋 DADOS BÁSICOS:');
        console.log(`   💰 Preço: R$ ${(targetFlight.priceWithTax || targetFlight.price || 0).toFixed(2)}`);
        console.log(`   ✈️ Voo: ${targetFlight.numeroVoo || 'N/A'}`);
        console.log(`   🏢 Companhia: ${targetFlight.companhia || 'N/A'}`);
        
        console.log('\n🔍 ANÁLISE DE FONTES:');
        
        // 1. Campos diretos de fonte
        const fontesCandidatas = [];
        
        if (targetFlight.provider) fontesCandidatas.push(`Provider: ${targetFlight.provider}`);
        if (targetFlight.source) fontesCandidatas.push(`Source: ${targetFlight.source}`);
        if (targetFlight.supplier) fontesCandidatas.push(`Supplier: ${targetFlight.supplier}`);
        if (targetFlight.bookingUrl) fontesCandidatas.push(`Booking URL: ${targetFlight.bookingUrl}`);
        if (targetFlight.deepLink) fontesCandidatas.push(`Deep Link: ${targetFlight.deepLink}`);
        
        // 2. Tokens que podem indicar origem
        if (targetFlight.TokenConsulta) {
          const tokenParts = targetFlight.TokenConsulta.split('_');
          if (tokenParts.length > 1) {
            fontesCandidatas.push(`Token Source: ${tokenParts.join(' | ')}`);
          }
        }
        
        // 3. Dados de segmentos
        if (targetFlight.segments && targetFlight.segments.length > 0) {
          targetFlight.segments.forEach((segment, index) => {
            if (segment.provider) fontesCandidatas.push(`Segment ${index + 1} Provider: ${segment.provider}`);
            if (segment.source) fontesCandidatas.push(`Segment ${index + 1} Source: ${segment.source}`);
            if (segment.fareGroup?.provider) fontesCandidatas.push(`Segment ${index + 1} Fare Provider: ${segment.fareGroup.provider}`);
            if (segment.bookingUrl) fontesCandidatas.push(`Segment ${index + 1} Booking: ${segment.bookingUrl}`);
          });
        }
        
        // 4. Busca por campos que contenham nomes de OTAs
        const otas = ['decolar', 'viajanet', '123milhas', 'maxmilhas', 'submarino', 'hurb', 'expedia', 'booking'];
        Object.entries(targetFlight).forEach(([key, value]) => {
          if (typeof value === 'string') {
            otas.forEach(ota => {
              if (value.toLowerCase().includes(ota)) {
                fontesCandidatas.push(`Campo ${key} contém "${ota}": ${value}`);
              }
            });
          }
        });
        
        // Mostrar todas as fontes encontradas
        if (fontesCandidatas.length > 0) {
          console.log('\n✅ FONTES IDENTIFICADAS:');
          fontesCandidatas.forEach((fonte, index) => {
            console.log(`   ${index + 1}. ${fonte}`);
          });
          
          // Identificar a mais provável
          const urlSources = fontesCandidatas.filter(f => f.includes('http'));
          const providerSources = fontesCandidatas.filter(f => f.includes('Provider'));
          
          if (urlSources.length > 0) {
            console.log(`\n🎯 FONTE MAIS PROVÁVEL (URL): ${urlSources[0]}`);
          } else if (providerSources.length > 0) {
            console.log(`\n🎯 FONTE MAIS PROVÁVEL (Provider): ${providerSources[0]}`);
          } else if (fontesCandidatas.length > 0) {
            console.log(`\n🎯 FONTE MAIS PROVÁVEL: ${fontesCandidatas[0]}`);
          }
        } else {
          console.log('\n❌ Nenhuma fonte específica identificada nos dados');
        }
        
        console.log('\n📝 DADOS COMPLETOS DO VOO:');
        console.log(JSON.stringify(targetFlight, null, 2));
        
      } else {
        console.log('❌ Voo LA-9058 com preço ~R$ 3.187 não encontrado');
        console.log('\n📋 Voos disponíveis:');
        response1.data.Data.slice(0, 5).forEach((flight, index) => {
          const preco = flight.priceWithTax || flight.price || flight.totalPrice || 0;
          const voo = flight.numeroVoo || flight.FlightNumber || 'N/A';
          console.log(`   ${index + 1}. ${voo} - R$ ${preco.toFixed(2)}`);
        });
      }
    } else {
      console.log('❌ Nenhum voo encontrado na resposta');
    }
    
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

// Executar investigação
investigarFonteVoo();
