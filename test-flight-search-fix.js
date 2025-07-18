import moblixApiService from './src/services/moblixApiService.js';

async function testFlightSearch() {
  console.log('🧪 === TESTE DE BUSCA DE VOOS - CORREÇÕES ===');
  console.log('');
  
  // Teste 1: Busca CNF → RIO (mesmo caso do problema)
  console.log('📍 Teste 1: CNF → RIO (12/07/2025)');
  try {
    const result1 = await moblixApiService.consultarVoos({
      origem: 'CNF',
      destino: 'RIO', // Será mapeado para SDU
      ida: '2025-07-12',
      adultos: 1,
      criancas: 0,
      bebes: 0,
      companhia: 2 // GOL
    });
    
    console.log('✅ Resultado:', {
      success: result1.Success,
      hasResult: result1.HasResult,
      totalItens: result1.TotalItens,
      dataLength: result1.Data?.length || 0,
      firstItem: result1.Data?.[0] ? {
        flights: result1.Data[0].flights?.length || 0,
        ida: result1.Data[0].Ida?.length || 0,
        companhia: result1.Data[0].Companhia,
        semDisponibilidade: result1.Data[0].SemDisponibilidade,
        activeProviders: result1.Data[0].ActiveProviders?.length || 0
      } : null
    });
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
  
  console.log('');
  
  // Teste 2: Busca com Todas as companhias
  console.log('📍 Teste 2: CNF → SDU - Todas as companhias');
  try {
    const result2 = await moblixApiService.consultarVoos({
      origem: 'CNF',
      destino: 'SDU',
      ida: '2025-07-12',
      adultos: 1,
      criancas: 0,
      bebes: 0,
      companhia: -1 // Todas
    });
    
    console.log('✅ Resultado:', {
      success: result2.Success,
      hasResult: result2.HasResult,
      totalItens: result2.TotalItens,
      dataLength: result2.Data?.length || 0,
      firstItem: result2.Data?.[0] ? {
        flights: result2.Data[0].flights?.length || 0,
        ida: result2.Data[0].Ida?.length || 0,
        companhia: result2.Data[0].Companhia,
        semDisponibilidade: result2.Data[0].SemDisponibilidade,
        activeProviders: result2.Data[0].ActiveProviders?.length || 0
      } : null
    });
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
  
  console.log('');
  
  // Teste 3: Busca com Azul (requer internacional=true)
  console.log('📍 Teste 3: CNF → SDU - Azul (com internacional=true)');
  try {
    const result3 = await moblixApiService.consultarVoos({
      origem: 'CNF',
      destino: 'SDU',
      ida: '2025-07-12',
      adultos: 1,
      criancas: 0,
      bebes: 0,
      companhia: 3 // Azul
    });
    
    console.log('✅ Resultado:', {
      success: result3.Success,
      hasResult: result3.HasResult,
      totalItens: result3.TotalItens,
      dataLength: result3.Data?.length || 0,
      firstItem: result3.Data?.[0] ? {
        flights: result3.Data[0].flights?.length || 0,
        ida: result3.Data[0].Ida?.length || 0,
        companhia: result3.Data[0].Companhia,
        semDisponibilidade: result3.Data[0].SemDisponibilidade,
        activeProviders: result3.Data[0].ActiveProviders?.length || 0
      } : null
    });
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
  
  console.log('');
  
  // Teste 4: Busca com rota popular (GRU → BSB)
  console.log('📍 Teste 4: GRU → BSB - GOL');
  try {
    const result4 = await moblixApiService.consultarVoos({
      origem: 'GRU',
      destino: 'BSB',
      ida: '2025-07-15',
      adultos: 1,
      criancas: 0,
      bebes: 0,
      companhia: 2 // GOL
    });
    
    console.log('✅ Resultado:', {
      success: result4.Success,
      hasResult: result4.HasResult,
      totalItens: result4.TotalItens,
      dataLength: result4.Data?.length || 0,
      firstItem: result4.Data?.[0] ? {
        flights: result4.Data[0].flights?.length || 0,
        ida: result4.Data[0].Ida?.length || 0,
        companhia: result4.Data[0].Companhia,
        semDisponibilidade: result4.Data[0].SemDisponibilidade,
        activeProviders: result4.Data[0].ActiveProviders?.length || 0
      } : null
    });
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
  
  console.log('');
  console.log('🏁 === TESTE CONCLUÍDO ===');
}

// Executa o teste
testFlightSearch().catch(console.error);
