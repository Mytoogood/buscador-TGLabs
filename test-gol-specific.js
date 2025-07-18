import moblixApiService from './src/services/moblixApiService.js';

async function testGolSpecific() {
  console.log('🧪 === TESTE ESPECÍFICO GOL - CNF → RIO ===');
  console.log('');
  
  // Teste 1: Busca GOL direta CNF → SDU
  console.log('📍 Teste 1: GOL - CNF → SDU (mapeado do RIO)');
  try {
    const result1 = await moblixApiService.consultarVoos({
      origem: 'CNF',
      destino: 'SDU',
      ida: '2025-07-12',
      adultos: 1,
      criancas: 0,
      bebes: 0,
      companhia: 2 // GOL
    });
    
    console.log('✅ Resultado GOL CNF→SDU:', {
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
    console.log('❌ Erro GOL CNF→SDU:', error.message);
  }
  
  console.log('');
  
  // Teste 2: Busca GOL CNF → GIG
  console.log('📍 Teste 2: GOL - CNF → GIG (Galeão)');
  try {
    const result2 = await moblixApiService.consultarVoos({
      origem: 'CNF',
      destino: 'GIG',
      ida: '2025-07-12',
      adultos: 1,
      criancas: 0,
      bebes: 0,
      companhia: 2 // GOL
    });
    
    console.log('✅ Resultado GOL CNF→GIG:', {
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
    console.log('❌ Erro GOL CNF→GIG:', error.message);
  }
  
  console.log('');
  
  // Teste 3: Busca GOL CNF → CGH
  console.log('📍 Teste 3: GOL - CNF → CGH (Congonhas)');
  try {
    const result3 = await moblixApiService.consultarVoos({
      origem: 'CNF',
      destino: 'CGH',
      ida: '2025-07-12',
      adultos: 1,
      criancas: 0,
      bebes: 0,
      companhia: 2 // GOL
    });
    
    console.log('✅ Resultado GOL CNF→CGH:', {
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
    console.log('❌ Erro GOL CNF→CGH:', error.message);
  }
  
  console.log('');
  
  // Teste 4: Busca GOL CNF → GRU
  console.log('📍 Teste 4: GOL - CNF → GRU (Guarulhos)');
  try {
    const result4 = await moblixApiService.consultarVoos({
      origem: 'CNF',
      destino: 'GRU',
      ida: '2025-07-12',
      adultos: 1,
      criancas: 0,
      bebes: 0,
      companhia: 2 // GOL
    });
    
    console.log('✅ Resultado GOL CNF→GRU:', {
      success: result4.Success,
      hasResult: result4.HasResult,
      totalItens: result4.TotalItens,
      dataLength: result4.Data?.length || 0,
      firstItem: result4.Data?.[0] ? {
        flights: result4.Data[0].flights?.length || 0,
        ida: result4.Data[0].Ida?.length || 0,
        companhia: result4.Data[0].Companhia,
        semDisponibilidade: result4.Data[0].SemDisponibilidade
      } : null
    });
  } catch (error) {
    console.log('❌ Erro GOL CNF→GRU:', error.message);
  }
  
  console.log('');
  
  // Teste 5: Comparação com LATAM para ver a diferença
  console.log('📍 Teste 5: LATAM - CNF → SDU (para comparação)');
  try {
    const result5 = await moblixApiService.consultarVoos({
      origem: 'CNF',
      destino: 'SDU',
      ida: '2025-07-12',
      adultos: 1,
      criancas: 0,
      bebes: 0,
      companhia: 1 // LATAM
    });
    
    console.log('✅ Resultado LATAM CNF→SDU:', {
      success: result5.Success,
      hasResult: result5.HasResult,
      totalItens: result5.TotalItens,
      dataLength: result5.Data?.length || 0,
      firstItem: result5.Data?.[0] ? {
        flights: result5.Data[0].flights?.length || 0,
        ida: result5.Data[0].Ida?.length || 0,
        companhia: result5.Data[0].Companhia,
        semDisponibilidade: result5.Data[0].SemDisponibilidade
      } : null
    });
  } catch (error) {
    console.log('❌ Erro LATAM CNF→SDU:', error.message);
  }
  
  console.log('');
  console.log('🏁 === TESTE ESPECÍFICO GOL CONCLUÍDO ===');
}

// Executa o teste
testGolSpecific().catch(console.error);
