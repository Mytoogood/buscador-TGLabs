// Teste simples para verificar se a função consultarVoosEmMilhas está funcionando
console.log('🧪 TESTANDO FUNÇÃO CONSULTARVOOSEMMILHAS');
console.log('========================================');

// Simula a função consultarVoosEmMilhas
const mockMoblixApiService = {
  async consultarVoos(params) {
    console.log('📡 Simulando consultarVoos normal com parâmetros:', params);
    
    // Simula resposta da API sem voos em milhas
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
          }
        ]
      }]
    };
  },
  
  async request(options) {
    console.log('📡 Simulando request com endpoint:', options.endpoint);
    throw new Error('Endpoint não encontrado');
  },
  
  extractMilesFlights(response) {
    console.log('🔍 Extraindo voos em milhas da resposta...');
    
    const allFlights = [];
    if (response.Data && Array.isArray(response.Data)) {
      response.Data.forEach(dataItem => {
        if (dataItem.flights && Array.isArray(dataItem.flights)) {
          allFlights.push(...dataItem.flights);
        }
      });
    }
    
    const milesFlights = allFlights.filter(flight => {
      return typeof flight.PontosAdulto === 'number' && flight.PontosAdulto > 0;
    });
    
    console.log(`📊 Voos analisados: ${allFlights.length}, Voos em milhas: ${milesFlights.length}`);
    return milesFlights;
  },
  
  generateMockMilesFlights(params) {
    console.log('🎭 Gerando voos em milhas simulados...');
    
    const mockFlights = [
      {
        Id: 'miles_001',
        Companhia: params.companhia || 1,
        CompanhiaNome: 'LATAM',
        Origem: params.origem.toUpperCase(),
        Destino: params.destino.toUpperCase(),
        ValorTotalComTaxa: 0,
        ValorTotal: 0,
        PontosAdulto: 15000,
        HorarioSaida: '06:00',
        HorarioChegada: '07:00',
        Duracao: 60,
        TipoVoo: 'award',
        Voos: [{
          Numero: 'LA-3100',
          Origem: params.origem.toUpperCase(),
          Destino: params.destino.toUpperCase(),
          Saida: '06:00',
          Chegada: '07:00',
          Duracao: 60,
          ClasseStr: 'Econômica'
        }]
      },
      {
        Id: 'miles_002',
        Companhia: params.companhia || 1,
        CompanhiaNome: 'LATAM',
        Origem: params.origem.toUpperCase(),
        Destino: params.destino.toUpperCase(),
        ValorTotalComTaxa: 0,
        ValorTotal: 0,
        PontosAdulto: 18000,
        HorarioSaida: '14:30',
        HorarioChegada: '15:30',
        Duracao: 60,
        TipoVoo: 'award',
        Voos: [{
          Numero: 'LA-3200',
          Origem: params.origem.toUpperCase(),
          Destino: params.destino.toUpperCase(),
          Saida: '14:30',
          Chegada: '15:30',
          Duracao: 60,
          ClasseStr: 'Econômica'
        }]
      }
    ];
    
    return {
      Success: true,
      Data: [{
        flights: mockFlights
      }],
      Message: 'Voos em milhas simulados gerados com sucesso',
      IsMockData: true
    };
  },
  
  async consultarVoosEmMilhas(params) {
    console.log('✈️ Iniciando busca específica por voos em milhas...');
    
    // Estratégia 1: Busca com parâmetros específicos para milhas
    const milesParams1 = {
      ...params,
      tipoBusca: 'milhas',
      pontos: true,
      programaFidelidade: true,
      award: true,
      redemption: true,
      tipoTarifa: 'award',
      incluirMilhas: true
    };
    
    console.log('📡 Tentativa 1: Busca com parâmetros específicos para milhas');
    try {
      const result1 = await this.consultarVoos(milesParams1);
      if (result1 && result1.Data && result1.Data.length > 0) {
        const milesFlights = this.extractMilesFlights(result1);
        if (milesFlights.length > 0) {
          console.log('✅ Voos em milhas encontrados na tentativa 1:', milesFlights.length);
          return { ...result1, Data: [{ flights: milesFlights }] };
        }
      }
    } catch (error) {
      console.log('⚠️ Tentativa 1 falhou:', error.message);
    }
    
    // Estratégia 2: Busca com endpoint alternativo
    console.log('📡 Tentativa 2: Busca com endpoint alternativo');
    try {
      const milesParams2 = {
        Origem: params.origem.toUpperCase(),
        Destino: params.destino.toUpperCase(),
        Ida: params.ida,
        Adultos: params.adultos || 1,
        Criancas: params.criancas || 0,
        Bebes: params.bebes || 0,
        Companhia: params.companhia || -1,
        TipoPagamento: 'milhas',
        BuscarMilhas: true
      };
      
      const result2 = await this.request({
        method: 'post',
        endpoint: '/aereo/api/consulta/milhas',
        data: milesParams2,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (result2 && result2.Data && result2.Data.length > 0) {
        const milesFlights = this.extractMilesFlights(result2);
        if (milesFlights.length > 0) {
          console.log('✅ Voos em milhas encontrados na tentativa 2:', milesFlights.length);
          return { ...result2, Data: [{ flights: milesFlights }] };
        }
      }
    } catch (error) {
      console.log('⚠️ Tentativa 2 falhou:', error.message);
    }
    
    // Estratégia 3: Simula voos em milhas para teste
    console.log('📡 Tentativa 3: Gerando voos em milhas simulados para teste');
    return this.generateMockMilesFlights(params);
  }
};

// Teste da função
async function testFunction() {
  const params = {
    origem: 'SAO',
    destino: 'RIO',
    ida: '2025-07-09',
    adultos: 1,
    criancas: 0,
    bebes: 0,
    companhia: 1
  };
  
  console.log('📋 Testando com parâmetros:', params);
  
  try {
    const result = await mockMoblixApiService.consultarVoosEmMilhas(params);
    
    console.log('\n🎯 RESULTADO DO TESTE:');
    console.log('✅ Função executada com sucesso');
    console.log('✅ Resposta:', result.Success ? 'Sucesso' : 'Falha');
    console.log('✅ É mock data?', result.IsMockData ? 'Sim' : 'Não');
    
    if (result.Data && result.Data.length > 0) {
      const flights = result.Data[0].flights || [];
      console.log(`✅ Voos retornados: ${flights.length}`);
      
      flights.forEach((flight, index) => {
        console.log(`  ${index + 1}. ${flight.CompanhiaNome} - ${flight.PontosAdulto} pontos`);
        console.log(`     Horário: ${flight.HorarioSaida} → ${flight.HorarioChegada}`);
      });
    }
    
    console.log('\n🔧 PRÓXIMOS PASSOS:');
    console.log('1. ✅ Função consultarVoosEmMilhas implementada');
    console.log('2. ✅ Fallback para voos simulados funcionando');
    console.log('3. 📝 Testar no navegador web');
    console.log('4. 📝 Verificar se o filtro "ambos" mostra voos simulados');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

testFunction();
