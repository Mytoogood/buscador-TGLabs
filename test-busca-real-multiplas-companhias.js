import moblixApiService from './src/services/moblixApiService.js';

// Teste de busca real em múltiplas companhias
async function testRealMultipleCompanies() {
  console.log('🔍 === TESTE DE BUSCA REAL EM MÚLTIPLAS COMPANHIAS ===');
  console.log('📅 Testando busca: SAO → RIO em 11/07/2025');
  console.log('');
  
  const searchParams = {
    origem: 'SAO',
    destino: 'RIO',
    ida: '2025-07-11',
    adultos: 1,
    criancas: 0,
    bebes: 0,
    soIda: true
  };
  
  // Lista das principais companhias aéreas para testar
  const companhiasParaTestar = [
    { id: 1, nome: 'LATAM' },
    { id: 2, nome: 'GOL' },
    { id: 3, nome: 'Azul' },
    { id: 11, nome: 'TAP Air Portugal' },
    { id: 34, nome: 'Livelo' }
  ];
  
  const resultadosPorCompanhia = new Map();
  
  // Busca em cada companhia separadamente
  for (const companhia of companhiasParaTestar) {
    try {
      console.log(`🔍 Buscando voos da ${companhia.nome} (ID: ${companhia.id})...`);
      
      const companySearchParams = {
        ...searchParams,
        companhia: companhia.id
      };
      
      const response = await moblixApiService.consultarVoos(companySearchParams);
      
      if (response && response.Data && Array.isArray(response.Data)) {
        let totalVoos = 0;
        
        response.Data.forEach(dataItem => {
          if (dataItem.flights && Array.isArray(dataItem.flights)) {
            totalVoos += dataItem.flights.length;
          } else if (dataItem.Ida && Array.isArray(dataItem.Ida)) {
            totalVoos += dataItem.Ida.length;
          }
        });
        
        resultadosPorCompanhia.set(companhia.nome, {
          id: companhia.id,
          voos: totalVoos,
          resposta: response
        });
        
        console.log(`✅ ${companhia.nome}: ${totalVoos} voos encontrados`);
        
        // Mostra detalhes dos primeiros 3 voos
        if (totalVoos > 0) {
          console.log(`   📋 Primeiros voos da ${companhia.nome}:`);
          let count = 0;
          
          for (const dataItem of response.Data) {
            if (count >= 3) break;
            
            const flights = dataItem.flights || dataItem.Ida || [];
            
            for (const flight of flights) {
              if (count >= 3) break;
              
              const preco = flight.priceWithTax || flight.price || flight.totalPrice || 0;
              const milhas = flight.PontosAdulto || 0;
              const companhiaVoo = flight.companhia || flight.Companhia || 
                                 flight.validatingBy?.name || 
                                 flight.segments?.[0]?.legs?.[0]?.operatedBy?.name ||
                                 companhia.nome;
              
              console.log(`   ${count + 1}. ${companhiaVoo} - ${milhas > 0 ? `${milhas} milhas` : `R$ ${preco.toFixed(2)}`}`);
              count++;
            }
          }
        }
        
      } else {
        console.log(`⚠️ ${companhia.nome}: Nenhum voo encontrado ou resposta inválida`);
        resultadosPorCompanhia.set(companhia.nome, {
          id: companhia.id,
          voos: 0,
          resposta: null
        });
      }
      
      // Pequeno delay entre as buscas
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`❌ Erro ao buscar voos da ${companhia.nome}: ${error.message}`);
      resultadosPorCompanhia.set(companhia.nome, {
        id: companhia.id,
        voos: 0,
        erro: error.message
      });
    }
  }
  
  // Resumo final
  console.log('\n📊 === RESUMO FINAL ===');
  let totalVoosEncontrados = 0;
  let companhiasComVoos = 0;
  
  for (const [nome, resultado] of resultadosPorCompanhia) {
    console.log(`${nome}: ${resultado.voos} voos ${resultado.voos > 0 ? '✅' : '❌'}`);
    totalVoosEncontrados += resultado.voos;
    if (resultado.voos > 0) companhiasComVoos++;
  }
  
  console.log(`\n🎯 Total: ${totalVoosEncontrados} voos encontrados`);
  console.log(`📈 Companhias com voos: ${companhiasComVoos}/${companhiasParaTestar.length}`);
  
  // Verifica se pelo menos uma companhia retornou voos
  if (totalVoosEncontrados > 0) {
    console.log('\n✅ TESTE PASSOU: Pelo menos uma companhia retornou voos reais');
    
    // Testa agora a busca com "Todas as companhias"
    console.log('\n🔍 === TESTE COM "TODAS AS COMPANHIAS" ===');
    
    try {
      const allCompaniesParams = {
        ...searchParams,
        companhia: -1 // Todas as companhias
      };
      
      const allResponse = await moblixApiService.consultarVoos(allCompaniesParams);
      
      if (allResponse && allResponse.Data && Array.isArray(allResponse.Data)) {
        let totalVoosTodasCompanhias = 0;
        
        allResponse.Data.forEach(dataItem => {
          if (dataItem.flights && Array.isArray(dataItem.flights)) {
            totalVoosTodasCompanhias += dataItem.flights.length;
          } else if (dataItem.Ida && Array.isArray(dataItem.Ida)) {
            totalVoosTodasCompanhias += dataItem.Ida.length;
          }
        });
        
        console.log(`✅ Busca "Todas as companhias": ${totalVoosTodasCompanhias} voos encontrados`);
        
        // Agrupa por companhia
        const voosAgrupadosPorCompanhia = new Map();
        
        for (const dataItem of allResponse.Data) {
          const flights = dataItem.flights || dataItem.Ida || [];
          
          for (const flight of flights) {
            const companhiaVoo = flight.companhia || flight.Companhia || 
                               flight.validatingBy?.name || 
                               flight.segments?.[0]?.legs?.[0]?.operatedBy?.name ||
                               'Outras';
            
            if (!voosAgrupadosPorCompanhia.has(companhiaVoo)) {
              voosAgrupadosPorCompanhia.set(companhiaVoo, 0);
            }
            voosAgrupadosPorCompanhia.set(companhiaVoo, voosAgrupadosPorCompanhia.get(companhiaVoo) + 1);
          }
        }
        
        console.log('\n📋 Voos por companhia na busca "Todas":');
        for (const [companhia, quantidade] of voosAgrupadosPorCompanhia) {
          console.log(`   ${companhia}: ${quantidade} voos`);
        }
        
        if (voosAgrupadosPorCompanhia.size > 1) {
          console.log('\n✅ SUCESSO: Múltiplas companhias retornadas na busca "Todas"');
        } else {
          console.log('\n⚠️ ATENÇÃO: Apenas uma companhia retornada na busca "Todas"');
        }
        
      } else {
        console.log('❌ Busca "Todas as companhias" não retornou dados válidos');
      }
      
    } catch (error) {
      console.log(`❌ Erro na busca "Todas as companhias": ${error.message}`);
    }
    
  } else {
    console.log('\n❌ TESTE FALHOU: Nenhuma companhia retornou voos');
    console.log('💡 Possíveis causas:');
    console.log('   - API sem dados para esta rota/data');
    console.log('   - Problemas de conectividade');
    console.log('   - Parâmetros incorretos');
  }
}

// Executa o teste
testRealMultipleCompanies().catch(console.error);
