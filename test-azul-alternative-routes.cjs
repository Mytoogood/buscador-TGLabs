// Script para testar voos da Azul em rotas alternativas
console.log('=== ANÁLISE DE ROTAS ALTERNATIVAS PARA AZUL ===\n');

// Função para analisar rotas da Azul
function analyzeAzulRoutes() {
  console.log('🔍 INVESTIGANDO POSSÍVEIS ROTAS DA AZUL\n');
  
  // Rotas populares que a Azul tipicamente opera
  const popularAzulRoutes = [
    {
      route: 'CGH-SDU',
      description: 'São Paulo (Congonhas) → Rio de Janeiro (Santos Dumont)',
      likelihood: 'ALTA',
      reason: 'Rota executiva popular, aeroportos centrais'
    },
    {
      route: 'GRU-GIG', 
      description: 'São Paulo (Guarulhos) → Rio de Janeiro (Galeão)',
      likelihood: 'MÉDIA',
      reason: 'Rota testada, sem resultados até agora'
    },
    {
      route: 'VCP-SDU',
      description: 'Campinas (Viracopos) → Rio de Janeiro (Santos Dumont)', 
      likelihood: 'ALTA',
      reason: 'Viracopos é hub da Azul'
    },
    {
      route: 'VCP-GIG',
      description: 'Campinas (Viracopos) → Rio de Janeiro (Galeão)',
      likelihood: 'ALTA', 
      reason: 'Viracopos é hub da Azul, conexões internacionais'
    },
    {
      route: 'BSB-GIG',
      description: 'Brasília → Rio de Janeiro (Galeão)',
      likelihood: 'MÉDIA',
      reason: 'Rota capital-RJ, demanda empresarial'
    },
    {
      route: 'CNF-GIG',
      description: 'Belo Horizonte (Confins) → Rio de Janeiro (Galeão)',
      likelihood: 'MÉDIA',
      reason: 'Confins é hub secundário da Azul'
    }
  ];
  
  console.log('📊 ROTAS RECOMENDADAS PARA TESTE:\n');
  
  popularAzulRoutes.forEach((route, index) => {
    const priority = route.likelihood === 'ALTA' ? '🔥' : 
                    route.likelihood === 'MÉDIA' ? '⚡' : '💡';
    
    console.log(`${index + 1}. ${priority} ${route.route}`);
    console.log(`   📍 ${route.description}`);
    console.log(`   🎯 Probabilidade: ${route.likelihood}`);
    console.log(`   💭 Motivo: ${route.reason}\n`);
  });
  
  // Análise específica do Viracopos como hub da Azul
  console.log('🏢 VIRACOPOS COMO HUB DA AZUL:\n');
  console.log('   ✈️ Viracopos (VCP) é o principal hub da Azul no Brasil');
  console.log('   🌍 Base para voos domésticos e internacionais');
  console.log('   🛫 Maior concentração de voos da Azul');
  console.log('   📈 Melhor chance de encontrar disponibilidade\n');
  
  // Datas recomendadas para teste
  console.log('📅 ESTRATÉGIA DE DATAS PARA TESTE:\n');
  
  const today = new Date();
  const testDates = [];
  
  // Próximas segundas, quartas e sextas (dias com mais voos executivos)
  for (let i = 1; i <= 14; i++) {
    const testDate = new Date(today);
    testDate.setDate(today.getDate() + i);
    const dayOfWeek = testDate.getDay();
    
    if ([1, 3, 5].includes(dayOfWeek)) { // Segunda, Quarta, Sexta
      const dayName = testDate.toLocaleDateString('pt-BR', { weekday: 'long' });
      const dateStr = testDate.toISOString().split('T')[0];
      testDates.push({ date: dateStr, day: dayName });
    }
  }
  
  console.log('   🎯 Datas prioritárias (dias úteis com mais demanda):');
  testDates.slice(0, 6).forEach(({ date, day }) => {
    console.log(`      📅 ${date} (${day})`);
  });
  
  console.log('\n🔧 PARÂMETROS RECOMENDADOS PARA TESTE:\n');
  console.log('   🕐 Horários preferenciais:');
  console.log('      • Manhã: 06:00 - 09:00 (voos executivos)');
  console.log('      • Final do dia: 18:00 - 21:00 (retorno)');
  console.log('   👥 Tipo de passageiro:');
  console.log('      • 1 adulto (melhor disponibilidade)');
  console.log('      • Classe econômica');
  console.log('   💳 Tipo de busca:');
  console.log('      • Apenas ida (maior flexibilidade)');
  console.log('      • Pagamento em dinheiro e milhas\n');
  
  return {
    recommendedRoutes: popularAzulRoutes.filter(r => r.likelihood === 'ALTA'),
    testDates: testDates.slice(0, 6),
    topPriority: 'VCP-SDU'
  };
}

// Função para gerar código de teste para o frontend
function generateTestCode(analysis) {
  console.log('💻 CÓDIGO PARA TESTE NO FRONTEND:\n');
  
  const topRoute = analysis.recommendedRoutes[0];
  const [origem, destino] = topRoute.route.split('-');
  const testDate = analysis.testDates[0];
  
  console.log('// Adicione este código no console do navegador na página de voos:');
  console.log('');
  console.log('// 1. Configurar parâmetros de teste para rota prioritária');
  console.log(`const testParams = {`);
  console.log(`  origem: '${origem}',`);
  console.log(`  destino: '${destino}',`);
  console.log(`  ida: '${testDate.date}',`);
  console.log(`  adultos: 1,`);
  console.log(`  criancas: 0,`);
  console.log(`  bebes: 0,`);
  console.log(`  companhia: 3, // Azul`);
  console.log(`  soIda: true`);
  console.log(`};`);
  console.log('');
  console.log('// 2. Executar busca usando o serviço configurado');
  console.log('try {');
  console.log('  console.log("🔍 Testando rota prioritária:", testParams);');
  console.log('  const response = await moblixApiService.consultarVoos(testParams);');
  console.log('  console.log("✅ Resposta da API:", response);');
  console.log('  ');
  console.log('  if (response?.Data?.[0]?.flights?.length > 0) {');
  console.log('    console.log(`🎉 SUCESSO! ${response.Data[0].flights.length} voos da Azul encontrados!`);');
  console.log('    console.log("Primeiro voo:", response.Data[0].flights[0]);');
  console.log('  } else {');
  console.log('    console.log("❌ Nenhum voo da Azul encontrado para esta rota/data");');
  console.log('  }');
  console.log('} catch (error) {');
  console.log('  console.error("❌ Erro na consulta:", error.message);');
  console.log('}');
  console.log('');
  
  console.log('// 3. Teste alternativo com múltiplas rotas');
  console.log('const routesToTest = [');
  analysis.recommendedRoutes.forEach(route => {
    const [orig, dest] = route.route.split('-');
    console.log(`  { origem: '${orig}', destino: '${dest}', description: '${route.description}' },`);
  });
  console.log('];');
  console.log('');
  console.log('// Executar teste em todas as rotas');
  console.log('for (const route of routesToTest) {');
  console.log('  try {');
  console.log('    console.log(`🔍 Testando ${route.description}...`);');
  console.log('    const params = { ...testParams, origem: route.origem, destino: route.destino };');
  console.log('    const response = await moblixApiService.consultarVoos(params);');
  console.log('    const flightCount = response?.Data?.[0]?.flights?.length || 0;');
  console.log('    console.log(`${flightCount > 0 ? "✅" : "❌"} ${route.origem}-${route.destino}: ${flightCount} voos`);');
  console.log('    ');
  console.log('    // Pausa entre requisições');
  console.log('    await new Promise(resolve => setTimeout(resolve, 2000));');
  console.log('  } catch (error) {');
  console.log('    console.error(`❌ Erro em ${route.origem}-${route.destino}:`, error.message);');
  console.log('  }');
  console.log('}');
}

// Função principal
function main() {
  const analysis = analyzeAzulRoutes();
  
  console.log('🎯 CONCLUSÕES E PRÓXIMOS PASSOS:\n');
  console.log('1. 🔄 A rota GRU-GIG pode não ser operada pela Azul');
  console.log('2. 🏢 Testar rotas que saem do hub VCP (Viracopos)');
  console.log('3. 📱 Verificar site/app oficial da Azul para confirmar rotas');
  console.log('4. 🛫 Considerar que a Azul pode ter foco em:');
  console.log('   • Voos regionais e de conexão');
  console.log('   • Rotas menos concorridas');
  console.log('   • Horários específicos (não o dia todo)');
  console.log('');
  console.log('💡 INSIGHT IMPORTANTE:');
  console.log('A ausência de voos da Azul na rota GRU-GIG pode ser estratégica,');
  console.log('já que GOL e LATAM dominam essa rota. A Azul pode focar em');
  console.log('rotas alternativas como VCP-SDU ou VCP-GIG.\n');
  
  generateTestCode(analysis);
  
  console.log('\n📋 CHECKLIST FINAL:');
  console.log('□ Testar rota VCP-SDU (prioridade máxima)');
  console.log('□ Testar rota VCP-GIG (segunda prioridade)'); 
  console.log('□ Verificar site oficial da Azul');
  console.log('□ Testar em dias úteis (segunda, quarta, sexta)');
  console.log('□ Considerar horários de pico (manhã e noite)');
  console.log('□ Implementar feedback melhorado no sistema');
}

// Executar análise
main();
