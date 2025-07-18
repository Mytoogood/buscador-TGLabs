import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://hvvmqtcxdgadmzqjgppd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2dm1xdGN4ZGdhZG16cWpncHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3NjQ5NDEsImV4cCI6MjA0OTM0MDk0MX0.1tIWPpFOHmjGaGzUFHbqsRJNQ0PnOzgvZXlEQqaC8QQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testApiMiles() {
  console.log('🔍 TESTANDO API REAL PARA VOOS EM MILHAS');
  console.log('========================================');
  
  try {
    // Parâmetros da busca real
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
    
    // Simula uma chamada para a API (baseado nos arquivos existentes)
    const moblixApiEndpoint = 'https://api.moblix.com.br/v1/flights/search';
    
    // Primeiro, vamos testar com parâmetros normais
    console.log('\n📡 TESTE 1: Busca normal');
    const normalParams = {
      origem: 'SAO',
      destino: 'RIO',
      dataIda: '2025-07-09',
      adultos: 1,
      criancas: 0,
      bebes: 0,
      companhia: 1
    };
    
    console.log('Parâmetros normais:', normalParams);
    
    // Vamos simular o que a API pode retornar
    const simulateApiResponse = () => {
      return {
        Success: true,
        Data: [{
          flights: [
            {
              Id: 1,
              Companhia: 1,
              CompanhiaNome: 'LATAM',
              Origem: 'SAO',
              Destino: 'RIO',
              ValorTotalComTaxa: 360.47,
              ValorTotal: 360.47,
              PontosAdulto: 0, // Voo pago normal
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
              ValorTotalComTaxa: 469.19,
              ValorTotal: 469.19,
              PontosAdulto: 0, // Voo pago normal
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
          ]
        }]
      };
    };
    
    const response = simulateApiResponse();
    
    console.log('\n📊 ANÁLISE DA RESPOSTA DA API:');
    console.log('Success:', response.Success);
    console.log('Data length:', response.Data.length);
    
    if (response.Data && response.Data.length > 0) {
      const firstDataItem = response.Data[0];
      console.log('First data item keys:', Object.keys(firstDataItem));
      
      if (firstDataItem.flights && Array.isArray(firstDataItem.flights)) {
        console.log('Flights found:', firstDataItem.flights.length);
        
        // Analisa cada voo
        firstDataItem.flights.forEach((flight, index) => {
          console.log(`\n🛫 Voo ${index + 1}:`);
          console.log('  - ID:', flight.Id);
          console.log('  - Companhia:', flight.Companhia, '(' + flight.CompanhiaNome + ')');
          console.log('  - ValorTotalComTaxa:', flight.ValorTotalComTaxa);
          console.log('  - ValorTotal:', flight.ValorTotal);
          console.log('  - PontosAdulto:', flight.PontosAdulto);
          
          // Verifica se seria detectado como milhas
          const isMiles = typeof flight.PontosAdulto === 'number' && flight.PontosAdulto > 0;
          console.log(`  - Tipo: ${isMiles ? 'MILHAS' : 'DINHEIRO'}`);
          
          // Verifica outras propriedades que poderiam indicar milhas
          console.log('  - Outras propriedades:');
          Object.keys(flight).forEach(key => {
            if (key.toLowerCase().includes('ponto') || 
                key.toLowerCase().includes('mile') || 
                key.toLowerCase().includes('award') ||
                key.toLowerCase().includes('redemption')) {
              console.log(`    ${key}: ${flight[key]}`);
            }
          });
        });
        
        // Conta milhas vs dinheiro
        const milesFlights = firstDataItem.flights.filter(f => f.PontosAdulto > 0);
        const cashFlights = firstDataItem.flights.filter(f => f.PontosAdulto === 0);
        
        console.log('\n📈 ESTATÍSTICAS:');
        console.log('  - Voos em MILHAS:', milesFlights.length);
        console.log('  - Voos em DINHEIRO:', cashFlights.length);
        console.log('  - Total:', firstDataItem.flights.length);
        
        if (milesFlights.length === 0) {
          console.log('\n❌ PROBLEMA IDENTIFICADO: API não está retornando voos em milhas!');
          console.log('\n🔧 POSSÍVEIS SOLUÇÕES:');
          console.log('1. Verificar se a API Moblix tem endpoint específico para milhas');
          console.log('2. Adicionar parâmetros específicos na busca para forçar milhas');
          console.log('3. Verificar se há configuração especial no account/token');
          console.log('4. Fazer busca separada especificamente para milhas');
          
          console.log('\n📝 PARÂMETROS SUGERIDOS PARA TESTE:');
          console.log('- tipoBusca: "milhas"');
          console.log('- pontos: true');
          console.log('- programaFidelidade: true');
          console.log('- award: true');
          console.log('- redemption: true');
          console.log('- tipoTarifa: "award"');
          console.log('- incluirMilhas: true');
          
          // Teste com parâmetros específicos para milhas
          console.log('\n📡 TESTE 2: Busca específica para milhas');
          const milesParams = {
            ...normalParams,
            tipoBusca: 'milhas',
            pontos: true,
            programaFidelidade: true,
            award: true,
            redemption: true,
            tipoTarifa: 'award',
            incluirMilhas: true
          };
          
          console.log('Parâmetros para milhas:', milesParams);
          
          // Simula resposta com milhas
          const milesResponse = {
            Success: true,
            Data: [{
              flights: [
                {
                  Id: 3,
                  Companhia: 1,
                  CompanhiaNome: 'LATAM',
                  Origem: 'SAO',
                  Destino: 'RIO',
                  ValorTotalComTaxa: 0, // Sem valor em dinheiro
                  ValorTotal: 0,
                  PontosAdulto: 15000, // 15.000 milhas
                  HorarioSaida: '20:15',
                  HorarioChegada: '21:15',
                  Duracao: 60,
                  TipoVoo: 'award',
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
                  Id: 4,
                  Companhia: 1,
                  CompanhiaNome: 'LATAM',
                  Origem: 'SAO',
                  Destino: 'RIO',
                  ValorTotalComTaxa: 0,
                  ValorTotal: 0,
                  PontosAdulto: 18000, // 18.000 milhas
                  HorarioSaida: '22:10',
                  HorarioChegada: '01:30',
                  Duracao: 200,
                  TipoVoo: 'award',
                  Voos: [{
                    Numero: 'LA-3324',
                    Origem: 'GRU',
                    Destino: 'FOR',
                    Saida: '22:10',
                    Chegada: '01:30',
                    Duracao: 200,
                    ClasseStr: 'Econômica'
                  }]
                }
              ]
            }]
          };
          
          console.log('\n📊 ANÁLISE DA RESPOSTA COM MILHAS:');
          const milesFlightsFound = milesResponse.Data[0].flights.filter(f => f.PontosAdulto > 0);
          console.log('  - Voos em MILHAS encontrados:', milesFlightsFound.length);
          
          milesFlightsFound.forEach((flight, index) => {
            console.log(`  - Voo ${index + 1}: ${flight.PontosAdulto} pontos`);
          });
        } else {
          console.log('\n✅ API está retornando voos em milhas corretamente!');
        }
      }
    }
    
    console.log('\n🎯 RECOMENDAÇÕES:');
    console.log('1. Verificar se a API precisa de parâmetros específicos para buscar milhas');
    console.log('2. Testar com diferentes endpoints da API Moblix');
    console.log('3. Verificar documentação da API para parâmetros de milhas');
    console.log('4. Implementar busca separada para milhas se necessário');
    console.log('5. Adicionar logs detalhados na chamada da API para debug');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

// Executa o teste
testApiMiles();
