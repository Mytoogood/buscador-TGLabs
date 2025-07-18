import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://hvvmqtcxdgadmzqjgppd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2dm1xdGN4ZGdhZG16cWpncHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3NjQ5NDEsImV4cCI6MjA0OTM0MDk0MX0.1tIWPpFOHmjGaGzUFHbqsRJNQ0PnOzgvZXlEQqaC8QQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugMilesFilter() {
  console.log('🔍 DEBUGANDO FILTRO DE MILHAS');
  console.log('=============================');
  
  try {
    // Simula uma busca real
    const searchParams = {
      origem: 'SAO',
      destino: 'RIO',
      ida: '2025-07-09',
      adultos: 1,
      criancas: 0,
      bebes: 0,
      companhia: 1, // LATAM
      tipoPagamento: 'ambos',
      orderBy: 'tempo'
    };
    
    console.log('📋 Parâmetros da busca:', searchParams);
    
    // Simula voos com dados reais que podem vir da API
    const mockFlights = [
      {
        Id: 1,
        Companhia: 1,
        CompanhiaNome: 'LATAM',
        Origem: 'SAO',
        Destino: 'RIO',
        ValorTotalComTaxa: 360.47,
        PontosAdulto: 0, // Voo pago
        HorarioSaida: '20:15',
        HorarioChegada: '21:15',
        Duracao: 60,
        Voos: [{
          Numero: 'LA-3368',
          Origem: 'GRU',
          Destino: 'GIG',
          Saida: '20:15',
          Chegada: '21:15',
          Duracao: 60,
          ClasseStr: 'Econômica'
        }]
      },
      {
        Id: 2,
        Companhia: 1,
        CompanhiaNome: 'LATAM',
        Origem: 'SAO',
        Destino: 'RIO',
        ValorTotalComTaxa: 0,
        PontosAdulto: 15000, // Voo em milhas
        HorarioSaida: '20:15',
        HorarioChegada: '21:15',
        Duracao: 60,
        Voos: [{
          Numero: 'LA-3368',
          Origem: 'GRU',
          Destino: 'GIG',
          Saida: '20:15',
          Chegada: '21:15',
          Duracao: 60,
          ClasseStr: 'Econômica'
        }]
      }
    ];
    
    console.log('\n📦 Voos simulados:', mockFlights.length);
    
    // Simula a função extractPrice
    const extractPrice = (obj) => {
      let extractedPrice = 0;
      let isMiles = false;
      
      console.log(`\n🔍 Analisando voo ID ${obj.Id}:`);
      console.log(`  - PontosAdulto: ${obj.PontosAdulto}`);
      console.log(`  - ValorTotalComTaxa: ${obj.ValorTotalComTaxa}`);
      
      if (typeof obj?.PontosAdulto === 'number' && obj.PontosAdulto > 0) {
        extractedPrice = obj.PontosAdulto;
        isMiles = true;
        console.log(`  ✅ Detectado como MILHAS: ${extractedPrice} pontos`);
      } else {
        if (typeof obj?.ValorTotalComTaxa === 'number' && obj.ValorTotalComTaxa > 0) {
          extractedPrice = obj.ValorTotalComTaxa;
          isMiles = false;
          console.log(`  ✅ Detectado como DINHEIRO: R$ ${extractedPrice}`);
        }
      }
      
      return { value: extractedPrice, isMiles: isMiles };
    };
    
    // Processa os voos
    const processedFlights = mockFlights.map(flight => {
      const priceResult = extractPrice(flight);
      
      return {
        id: flight.Id,
        companhia: flight.CompanhiaNome,
        priceWithTax: priceResult.value,
        isMiles: priceResult.isMiles,
        priceType: priceResult.isMiles ? 'milhas' : 'moeda',
        segments: flight.Voos.map(voo => ({
          flightNumber: voo.Numero,
          departureTime: voo.Saida,
          arrivalTime: voo.Chegada,
          duration: voo.Duracao
        }))
      };
    });
    
    console.log('\n📊 Voos processados:');
    processedFlights.forEach(flight => {
      console.log(`  - ID ${flight.id}: ${flight.isMiles ? 'MILHAS' : 'DINHEIRO'} - ${flight.priceWithTax} ${flight.isMiles ? 'pontos' : 'reais'}`);
    });
    
    // Testa filtros
    console.log('\n🧪 TESTANDO FILTROS:');
    
    // Filtro AMBOS
    const ambosFlights = processedFlights; // Sem filtro
    console.log(`\n🔄 Filtro AMBOS: ${ambosFlights.length} voos`);
    ambosFlights.forEach(flight => {
      console.log(`  - ${flight.companhia}: ${flight.isMiles ? 'MILHAS' : 'DINHEIRO'} - ${flight.priceWithTax}`);
    });
    
    // Filtro APENAS MILHAS
    const milesFlights = processedFlights.filter(flight => flight.isMiles === true);
    console.log(`\n✈️ Filtro APENAS MILHAS: ${milesFlights.length} voos`);
    milesFlights.forEach(flight => {
      console.log(`  - ${flight.companhia}: ${flight.priceWithTax} pontos`);
    });
    
    // Filtro APENAS DINHEIRO
    const cashFlights = processedFlights.filter(flight => flight.isMiles === false);
    console.log(`\n💰 Filtro APENAS DINHEIRO: ${cashFlights.length} voos`);
    cashFlights.forEach(flight => {
      console.log(`  - ${flight.companhia}: R$ ${flight.priceWithTax}`);
    });
    
    // Simula o filtro do código real para "ambos"
    console.log('\n🔄 SIMULANDO FILTRO "AMBOS" DO CÓDIGO REAL:');
    const sortedMilesFlights = milesFlights.slice(0, 10);
    const sortedCashFlights = cashFlights.slice(0, 10);
    const combinedFlights = [...sortedCashFlights, ...sortedMilesFlights];
    
    console.log(`  - Voos em DINHEIRO selecionados: ${sortedCashFlights.length}`);
    console.log(`  - Voos em MILHAS selecionados: ${sortedMilesFlights.length}`);
    console.log(`  - Total AMBOS: ${combinedFlights.length} voos`);
    
    // Diagnóstico do problema
    console.log('\n🩺 DIAGNÓSTICO:');
    if (milesFlights.length === 0) {
      console.log('❌ PROBLEMA: Nenhum voo em milhas foi detectado!');
      console.log('   Possíveis causas:');
      console.log('   1. API não está retornando voos com PontosAdulto > 0');
      console.log('   2. Lógica de detecção de milhas pode estar incorreta');
      console.log('   3. Dados da API podem ter estrutura diferente');
      
      // Verifica se há dados que poderiam ser milhas
      console.log('\n🔍 Verificando dados que poderiam ser milhas:');
      mockFlights.forEach(flight => {
        console.log(`  Voo ${flight.Id}:`);
        console.log(`    - PontosAdulto: ${flight.PontosAdulto} (${typeof flight.PontosAdulto})`);
        console.log(`    - ValorTotalComTaxa: ${flight.ValorTotalComTaxa} (${typeof flight.ValorTotalComTaxa})`);
        
        // Verifica outras propriedades que poderiam indicar milhas
        if (flight.TipoVoo) console.log(`    - TipoVoo: ${flight.TipoVoo}`);
        if (flight.Pontos) console.log(`    - Pontos: ${flight.Pontos}`);
        if (flight.Miles) console.log(`    - Miles: ${flight.Miles}`);
        if (flight.Award) console.log(`    - Award: ${flight.Award}`);
      });
    } else {
      console.log('✅ Voos em milhas detectados corretamente!');
    }
    
    // Teste adicional: verificar se o problema é na API
    console.log('\n🌐 TESTE: Verificando se a API está retornando voos em milhas');
    console.log('   Parâmetros que podem forçar busca de milhas:');
    console.log('   - tipoBusca: "milhas"');
    console.log('   - pontos: true');
    console.log('   - programaFidelidade: true');
    console.log('   - award: true');
    console.log('   - redemption: true');
    
  } catch (error) {
    console.error('❌ Erro no debug:', error);
  }
}

// Executa o debug
debugMilesFilter();
