import moblixApiService from './src/services/moblixApiService.js';

async function testCNFtoRio() {
  console.log('🧪 === TESTE CNF → RIO - TODAS AS COMPANHIAS ===');
  console.log('');
  
  // Teste 1: GOL CNF → RIO (deve mapear para GIG)
  console.log('📍 Teste 1: GOL - CNF → RIO (deve mapear para GIG)');
  try {
    const result1 = await moblixApiService.consultarVoos({
      origem: 'CNF',
      destino: 'RIO',
      ida: '2025-07-12',
      adultos: 1,
      criancas: 0,
      bebes: 0,
      companhia: 2 // GOL
    });
    
    console.log('✅ Resultado GOL CNF→RIO:', {
      success: result1.Success,
      hasResult: result1.HasResult,
      totalItens: result1.TotalItens,
      dataLength: result1.Data?.length || 0,
      firstItem: result1.Data?.[0] ? {
        flights: result1.Data[0].flights?.length || 0,
        ida: result1.Data[0].Ida?.length || 0,
        companhia: result1.Data[0].Companhia,
        semDisponibilidade: result1.Data[0].SemDisponibilidade
      } : null
    });
  } catch (error) {
    console.log('❌ Erro GOL CNF→RIO:', error.message);
  }
  
  console.log('');
  
  // Teste 2: LATAM CNF → RIO (deve mapear para SDU)
  console.log('📍 Teste 2: LATAM - CNF → RIO (deve mapear para SDU)');
  try {
    const result2 = await moblixApiService.consultarVoos({
      origem: 'CNF',
      destino: 'RIO',
      ida: '2025-07-12',
      adultos: 1,
      criancas: 0,
      bebes: 0,
      companhia: 1 // LATAM
    });
    
    console.log('✅ Resultado LATAM CNF→RIO:', {
      success: result2.Success,
      hasResult: result2.HasResult,
      totalItens: result2.TotalItens,
      dataLength: result2.Data?.length || 0,
      firstItem: result2.Data?.[0] ? {
        flights: result2.Data[0].flights?.length || 0,
        ida: result2.Data[0].Ida?.length || 0,
        companhia: result2.Data[0].Companhia,
        semDisponibilidade: result2.Data[0].SemDisponibilidade
      } : null
    });
  } catch (error) {
    console.log('❌ Erro LATAM CNF→RIO:', error.message);
  }
  
  console.log('');
  
  // Teste 3: Azul CNF → RIO (deve mapear para SDU)
  console.log('📍 Teste 3: Azul - CNF → RIO (deve mapear para SDU)');
  try {
    const result3 = await moblixApiService.consultarVoos({
      origem: 'CNF',
      destino: 'RIO',
      ida: '2025-07-12',
      adultos: 1,
      criancas: 0,
      bebes: 0,
      companhia: 3 // Azul
    });
    
    console.log('✅ Resultado Azul CNF→RIO:', {
      success: result3.Success,
      hasResult: result3.HasResult,
      totalItens: result3.TotalItens,
      dataLength: result3.Data?.length || 0,
      firstItem: result3.Data?.[0] ? {
        flights: result3.Data[0].flights?.length || 0,
        ida: result3.Data[0].Ida?.length || 0,
        companhia: result3.Data[0].Companhia,
        semDisponibilidade: result3.Data[0].SemDisponibilidade
      } : null
    });
  } catch (error) {
    console.log('❌ Erro Azul CNF→RIO:', error.message);
  }
  
  console.log('');
  
  // Teste 4: Todas as companhias CNF → RIO
  console.log('📍 Teste 4: TODAS - CNF → RIO');
  try {
    const result4 = await moblixApiService.consultarVoos({
      origem: 'CNF',
      destino: 'RIO',
      ida: '2025-07-12',
      adultos: 1,
      criancas: 0,
      bebes: 0,
      companhia: -1 // Todas
    });
    
    console.log('✅ Resultado TODAS CNF→RIO:', {
      success: result4.Success,
      hasResult: result4.HasResult,
      totalItens: result4.TotalItens,
      dataLength: result4.Data?.length || 0,
      firstItem: result4.Data?.[0] ? {
        flights: result4.Data[0].flights?.length || 0,
        ida: result4.Data[0].Ida?.length || 0,
        activeProviders: result4.Data[0].ActiveProviders?.length || 0,
        providers: result4.Data[0].ActiveProviders
      } : null
    });
  } catch (error) {
    console.log('❌ Erro TODAS CNF→RIO:', error.message);
  }
  
  console.log('');
  console.log('🏁 === TESTE CNF → RIO CONCLUÍDO ===');
  console.log('');
  console.log('📋 RESUMO DOS MAPEAMENTOS:');
  console.log('• GOL: CNF → RIO é mapeado para CNF → GIG (Galeão)');
  console.log('• LATAM/Azul: CNF → RIO é mapeado para CNF → SDU (Santos Dumont)');
  console.log('• Todas: CNF → RIO mapeia para SDU por padrão, mas busca individual pode encontrar ambos');
}

// Executa o teste
testCNFtoRio().catch(console.error);
