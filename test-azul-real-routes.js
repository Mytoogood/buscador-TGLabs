import moblixApiService from './src/services/moblixApiService.js';

async function testAzulRealRoutes() {
  console.log('🔵 TESTANDO ROTAS REAIS DA AZUL');
  console.log('=====================================');
  
  // Rotas conhecidas da Azul que sabemos que existem
  const rotasConhecidas = [
    { origem: 'VCP', destino: 'SDU', descricao: 'Viracopos → Santos Dumont (rota principal Azul)' },
    { origem: 'CNF', destino: 'VCP', descricao: 'Confins → Viracopos (hub Azul)' },
    { origem: 'CNF', destino: 'CGH', descricao: 'Confins → Congonhas' },
    { origem: 'CNF', destino: 'GRU', descricao: 'Confins → Guarulhos' },
    { origem: 'CNF', destino: 'BSB', descricao: 'Confins → Brasília' },
    { origem: 'VCP', destino: 'GIG', descricao: 'Viracopos → Galeão' },
  ];
  
  // Data futura com mais disponibilidade
  const dataFutura = new Date();
  dataFutura.setDate(dataFutura.getDate() + 45); // 45 dias no futuro
  const dataIda = dataFutura.toISOString().split('T')[0];
  
  console.log(`📅 Testando para data: ${dataIda}`);
  console.log('');
  
  for (const rota of rotasConhecidas) {
    try {
      console.log(`🔍 Testando: ${rota.descricao}`);
      
      const params = {
        origem: rota.origem,
        destino: rota.destino,
        ida: dataIda,
        adultos: 1,
        criancas: 0,
        bebes: 0,
        companhia: 3, // Azul
        internacional: true, // Sempre para Azul
        soIda: true
      };
      
      console.log(`📡 Parâmetros: ${JSON.stringify(params)}`);
      
      const response = await moblixApiService.consultarVoos(params);
      
      if (response?.Data?.[0]?.Ida?.length > 0) {
        const voos = response.Data[0].Ida;
        console.log(`✅ ${voos.length} voos encontrados na rota ${rota.origem}→${rota.destino}!`);
        
        // Mostra detalhes dos primeiros 3 voos
        voos.slice(0, 3).forEach((voo, index) => {
          const numeroVoo = voo.Voos?.[0]?.Numero || voo.FlightCode || 'N/A';
          const preco = voo.ValorTotalComTaxa || voo.ValorTotal || 'N/A';
          const saida = voo.Voos?.[0]?.Saida || voo.Saida || 'N/A';
          const chegada = voo.Voos?.[0]?.Chegada || voo.Chegada || 'N/A';
          
          console.log(`  ${index + 1}. ${numeroVoo} - R$ ${preco} - ${saida?.slice(11, 16)} → ${chegada?.slice(11, 16)}`);
        });
      } else {
        console.log(`❌ Nenhum voo encontrado na rota ${rota.origem}→${rota.destino}`);
      }
      
    } catch (error) {
      console.log(`❌ Erro na rota ${rota.origem}→${rota.destino}:`, error.message);
    }
    
    console.log('');
    
    // Pequena pausa entre requisições
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('🏁 Teste de rotas reais da Azul concluído!');
}

// Executa o teste
testAzulRealRoutes().catch(console.error);
