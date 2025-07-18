/**
 * Script de debug para verificar dados de voos na interface
 * Este script adiciona logs detalhados para diagnosticar por que os voos não aparecem na UI
 */

// Função para injetar logs de debug no componente Vue
function addDebugLogsToFlights() {
  console.log('=== DEBUG FLIGHT RESULTS ===');
  console.log('Iniciando debug da busca de voos...');
  
  // Verificar se o componente Vue está carregado
  if (typeof window !== 'undefined' && window.Vue) {
    console.log('Vue detectado na página');
    
    // Tentar acessar a instância do componente
    const app = document.getElementById('app');
    if (app && app.__vue__) {
      console.log('Componente Vue encontrado');
      
      // Interceptar a função searchFlights para adicionar logs
      const originalSearchFlights = app.__vue__.searchFlights;
      if (originalSearchFlights) {
        app.__vue__.searchFlights = async function(...args) {
          console.log('🔍 searchFlights chamado com argumentos:', args);
          
          const result = await originalSearchFlights.apply(this, args);
          
          console.log('✅ searchFlights concluído');
          console.log('📊 searchResults.value:', this.searchResults?.value);
          console.log('📊 Número de voos:', this.searchResults?.value?.length || 0);
          
          if (this.searchResults?.value?.length > 0) {
            console.log('📋 Primeiro voo:', this.searchResults.value[0]);
            console.log('📋 Estrutura do primeiro voo:', Object.keys(this.searchResults.value[0]));
          }
          
          return result;
        };
      }
    }
  }
  
  // Verificar localStorage para dados salvos
  const savedResults = localStorage.getItem('flight-search-results');
  if (savedResults) {
    console.log('💾 Dados salvos encontrados no localStorage:', JSON.parse(savedResults));
  }
  
  // Verificar se há dados no sessionStorage
  const sessionResults = sessionStorage.getItem('flight-results');
  if (sessionResults) {
    console.log('🔄 Dados de sessão encontrados:', JSON.parse(sessionResults));
  }
}

// Função para verificar DOM e elementos da interface
function checkDOMElements() {
  console.log('=== VERIFICANDO DOM ===');
  
  // Verificar se o formulário existe
  const form = document.querySelector('form');
  console.log('📝 Formulário encontrado:', !!form);
  
  // Verificar se a área de resultados existe
  const resultsArea = document.querySelector('.results-area') || 
                     document.querySelector('[data-testid="results"]') ||
                     document.querySelector('.flight-results');
  console.log('📊 Área de resultados encontrada:', !!resultsArea);
  
  // Verificar se há elementos de voo
  const flightCards = document.querySelectorAll('.flight-card') ||
                     document.querySelectorAll('[data-testid="flight-item"]') ||
                     document.querySelectorAll('.flight-item');
  console.log('✈️ Cards de voo encontrados:', flightCards.length);
  
  // Verificar mensagens de "nenhum voo encontrado"
  const noFlightsMessage = document.querySelector('.no-flights') ||
                          document.querySelector('[data-testid="no-flights"]');
  console.log('❌ Mensagem "nenhum voo" visível:', !!noFlightsMessage);
  
  // Verificar se há elementos de loading
  const loadingElements = document.querySelectorAll('[data-testid="loading"]') ||
                         document.querySelectorAll('.loading') ||
                         document.querySelectorAll('.spinner');
  console.log('⏳ Elementos de loading:', loadingElements.length);
}

// Função para verificar API calls
function interceptAPIcalls() {
  console.log('=== INTERCEPTANDO CHAMADAS API ===');
  
  // Interceptar fetch
  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    console.log('🌐 API Call:', args[0]);
    
    const response = await originalFetch.apply(this, args);
    const clonedResponse = response.clone();
    
    try {
      const data = await clonedResponse.json();
      console.log('📨 API Response:', data);
      
      if (data.Voos && Array.isArray(data.Voos)) {
        console.log('✈️ Voos encontrados na resposta:', data.Voos.length);
        if (data.Voos.length > 0) {
          console.log('📋 Estrutura do primeiro voo da API:', Object.keys(data.Voos[0]));
        }
      }
    } catch (error) {
      console.log('❌ Erro ao parsear resposta da API:', error);
    }
    
    return response;
  };
}

// Função para verificar dados de teste
function loadTestData() {
  console.log('=== CARREGANDO DADOS DE TESTE ===');
  
  // Simular dados de voo para teste
  const testFlightData = {
    id: 'test-flight-1',
    preco: 299.99,
    companhia: 'LATAM',
    origem: 'SAO',
    destino: 'RIO',
    dataPartida: '2025-07-13T08:00:00',
    dataChegada: '2025-07-13T09:30:00',
    duracao: '1h 30m',
    paradas: 0,
    segmentos: [{
      origem: 'SAO',
      destino: 'RIO',
      partida: '08:00',
      chegada: '09:30',
      voo: 'LA3001'
    }]
  };
  
  console.log('🧪 Dados de teste criados:', testFlightData);
  
  // Salvar no localStorage para verificar se a interface consegue ler
  localStorage.setItem('debug-flight-data', JSON.stringify([testFlightData]));
  console.log('💾 Dados de teste salvos no localStorage');
}

// Função principal de debug
function runDebug() {
  console.log('🚀 Iniciando debug completo...');
  
  // Aguardar DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        addDebugLogsToFlights();
        checkDOMElements();
        interceptAPIcalls();
        loadTestData();
      }, 1000);
    });
  } else {
    setTimeout(() => {
      addDebugLogsToFlights();
      checkDOMElements();
      interceptAPIcalls();
      loadTestData();
    }, 1000);
  }
}

// Função para verificar se há dados no console
function checkConsoleForData() {
  console.log('=== VERIFICANDO DADOS NO CONSOLE ===');
  
  // Verificar se há dados globais
  if (typeof window !== 'undefined') {
    console.log('🌐 Variáveis globais relacionadas a voos:');
    
    Object.keys(window).forEach(key => {
      if (key.toLowerCase().includes('flight') || 
          key.toLowerCase().includes('voo') || 
          key.toLowerCase().includes('search')) {
        console.log(`  ${key}:`, window[key]);
      }
    });
  }
}

// Executar debug
runDebug();
checkConsoleForData();

// Exportar funções para uso manual
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addDebugLogsToFlights,
    checkDOMElements,
    interceptAPIcalls,
    loadTestData,
    runDebug,
    checkConsoleForData
  };
}

console.log('🔧 Script de debug carregado. Use runDebug() para executar manualmente.');
