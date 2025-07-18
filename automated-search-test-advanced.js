/**
 * Script de Teste Automatizado para Busca de Voos
 * 
 * Este script executa múltiplas buscas automaticamente com os mesmos parâmetros
 * para detectar inconsistências de preço, contagem de voos ou companhias.
 * 
 * COMO USAR:
 * 1. Abra a aplicação no navegador (http://localhost:5173)
 * 2. Abra o console do navegador (F12)
 * 3. Cole este script inteiro e pressione Enter
 * 4. Use os comandos abaixo para iniciar os testes
 * 
 * COMANDOS DISPONÍVEIS:
 * - startAutomatedTest() - Iniciar teste automatizado
 * - stopAutomatedTest() - Parar teste automatizado
 * - getTestResults() - Ver resultados dos testes
 * - clearTestResults() - Limpar resultados
 */

// Configuração do teste automatizado
window.automatedTest = {
    isRunning: false,
    interval: null,
    testCount: 0,
    maxTests: 10,
    results: [],
    
    // Configuração padrão da busca
    defaultSearchParams: {
        origem: 'GRU', // Guarulhos
        destino: 'SDU', // Santos Dumont
        dataIda: '2024-12-20',
        dataVolta: '2024-12-27',
        adultos: 1,
        criancas: 0,
        bebes: 0,
        classeServico: 'Y' // Econômica
    },
    
    // Iniciar teste automatizado
    start: function(searchParams = null, maxTests = 10, intervalMs = 10000) {
        if (this.isRunning) {
            console.log('⚠️ Teste automatizado já está em execução');
            return;
        }
        
        this.isRunning = true;
        this.testCount = 0;
        this.maxTests = maxTests;
        this.results = [];
        
        const params = searchParams || this.defaultSearchParams;
        
        console.log('🚀 Iniciando teste automatizado...');
        console.log('📋 Parâmetros:', params);
        console.log(`🔢 Número de testes: ${maxTests}`);
        console.log(`⏱️ Intervalo: ${intervalMs}ms`);
        
        // Executar primeira busca imediatamente
        this.executeSearch(params);
        
        // Agendar próximas buscas
        this.interval = setInterval(() => {
            if (this.testCount >= this.maxTests) {
                this.stop();
                return;
            }
            
            this.executeSearch(params);
        }, intervalMs);
    },
    
    // Parar teste automatizado
    stop: function() {
        if (!this.isRunning) {
            console.log('⚠️ Nenhum teste automatizado em execução');
            return;
        }
        
        this.isRunning = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        
        console.log('🛑 Teste automatizado parado');
        console.log(`📊 Total de testes executados: ${this.testCount}`);
        
        // Analisar resultados
        this.analyzeResults();
    },
    
    // Executar uma busca
    executeSearch: async function(params) {
        try {
            this.testCount++;
            console.log(`🔍 Executando teste ${this.testCount}/${this.maxTests}...`);
            
            // Tentar encontrar e preencher o formulário de busca
            const searchResult = await this.performSearch(params);
            
            if (searchResult) {
                this.results.push({
                    testNumber: this.testCount,
                    timestamp: new Date().toISOString(),
                    params: { ...params },
                    ...searchResult
                });
                
                console.log(`✅ Teste ${this.testCount} concluído:`, searchResult);
            } else {
                console.log(`❌ Teste ${this.testCount} falhou`);
            }
            
        } catch (error) {
            console.error(`❌ Erro no teste ${this.testCount}:`, error);
        }
    },
    
    // Realizar busca na interface
    performSearch: async function(params) {
        return new Promise((resolve) => {
            // Verificar se estamos na página correta
            if (!window.location.href.includes('localhost:5173')) {
                console.warn('⚠️ Não estamos na página da aplicação');
                resolve(null);
                return;
            }
            
            // Tentar encontrar a instância Vue
            const vueInstance = this.findVueInstance();
            if (!vueInstance) {
                console.warn('⚠️ Não foi possível encontrar a instância Vue');
                resolve(null);
                return;
            }
            
            // Preencher parâmetros de busca
            try {
                if (vueInstance.searchParams) {
                    Object.assign(vueInstance.searchParams, params);
                }
                
                // Executar busca
                if (vueInstance.searchFlights) {
                    const originalFlights = vueInstance.flights ? [...vueInstance.flights] : [];
                    
                    // Aguardar resultado da busca
                    const checkResult = () => {
                        setTimeout(() => {
                            const newFlights = vueInstance.flights || [];
                            
                            if (newFlights.length > 0) {
                                const result = this.analyzeFlights(newFlights);
                                resolve(result);
                            } else {
                                resolve({
                                    flightCount: 0,
                                    avgPrice: 0,
                                    minPrice: 0,
                                    maxPrice: 0,
                                    airlines: [],
                                    prices: []
                                });
                            }
                        }, 5000); // Aguardar 5 segundos para carregar
                    };
                    
                    vueInstance.searchFlights();
                    checkResult();
                } else {
                    resolve(null);
                }
            } catch (error) {
                console.error('Erro ao executar busca:', error);
                resolve(null);
            }
        });
    },
    
    // Encontrar instância Vue
    findVueInstance: function() {
        // Tentar diferentes formas de encontrar a instância Vue
        const selectors = [
            '#app',
            '.flights-container',
            '[data-v-app]',
            '.main-container'
        ];
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.__vue__) {
                return element.__vue__;
            }
            if (element && element._vnode && element._vnode.componentInstance) {
                return element._vnode.componentInstance;
            }
        }
        
        // Tentar através do Vue global
        if (window.Vue && window.Vue.prototype) {
            const apps = document.querySelectorAll('[data-v-app]');
            for (const app of apps) {
                if (app.__vue__) {
                    return app.__vue__;
                }
            }
        }
        
        return null;
    },
    
    // Analisar voos retornados
    analyzeFlights: function(flights) {
        if (!Array.isArray(flights) || flights.length === 0) {
            return {
                flightCount: 0,
                avgPrice: 0,
                minPrice: 0,
                maxPrice: 0,
                airlines: [],
                prices: []
            };
        }
        
        // Extrair preços
        const prices = flights.map(flight => {
            const price = flight.price || flight.totalPrice || flight.fare || 0;
            return parseFloat(price) || 0;
        }).filter(price => price > 0);
        
        // Extrair companhias aéreas
        const airlines = [...new Set(flights.map(flight => 
            flight.airline || flight.companhia || flight.company || 'Desconhecida'
        ))];
        
        // Calcular estatísticas
        const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
        const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
        
        return {
            flightCount: flights.length,
            avgPrice: parseFloat(avgPrice.toFixed(2)),
            minPrice,
            maxPrice,
            airlines,
            prices
        };
    },
    
    // Analisar resultados dos testes
    analyzeResults: function() {
        if (this.results.length < 2) {
            console.log('📊 Poucos resultados para análise');
            return;
        }
        
        console.log('📊 ANÁLISE DOS RESULTADOS:');
        console.log('=' .repeat(50));
        
        // Estatísticas gerais
        const flightCounts = this.results.map(r => r.flightCount);
        const avgPrices = this.results.map(r => r.avgPrice);
        
        console.log(`📈 Variação na contagem de voos: ${Math.min(...flightCounts)} - ${Math.max(...flightCounts)}`);
        console.log(`💰 Variação no preço médio: R$ ${Math.min(...avgPrices).toFixed(2)} - R$ ${Math.max(...avgPrices).toFixed(2)}`);
        
        // Detectar inconsistências
        const inconsistencies = this.detectInconsistencies();
        if (inconsistencies.length > 0) {
            console.log('');
            console.log('🚨 INCONSISTÊNCIAS DETECTADAS:');
            inconsistencies.forEach((inc, index) => {
                console.log(`${index + 1}. ${inc.description}`);
            });
        } else {
            console.log('✅ Nenhuma inconsistência detectada');
        }
        
        // Mostrar dados detalhados
        console.log('');
        console.log('📋 DADOS DETALHADOS:');
        this.results.forEach((result, index) => {
            console.log(`Teste ${index + 1}: ${result.flightCount} voos, preço médio R$ ${result.avgPrice.toFixed(2)}`);
        });
    },
    
    // Detectar inconsistências
    detectInconsistencies: function() {
        const inconsistencies = [];
        
        if (this.results.length < 2) return inconsistencies;
        
        // Verificar variação na contagem de voos
        const flightCounts = this.results.map(r => r.flightCount);
        const minCount = Math.min(...flightCounts);
        const maxCount = Math.max(...flightCounts);
        
        if (maxCount - minCount > 5) {
            inconsistencies.push({
                type: 'flight_count',
                description: `Variação significativa na contagem de voos: ${minCount} - ${maxCount}`
            });
        }
        
        // Verificar variação nos preços
        const avgPrices = this.results.map(r => r.avgPrice).filter(p => p > 0);
        if (avgPrices.length > 1) {
            const minPrice = Math.min(...avgPrices);
            const maxPrice = Math.max(...avgPrices);
            const variation = ((maxPrice - minPrice) / minPrice) * 100;
            
            if (variation > 10) {
                inconsistencies.push({
                    type: 'price_variation',
                    description: `Variação significativa nos preços: ${variation.toFixed(1)}% (R$ ${minPrice.toFixed(2)} - R$ ${maxPrice.toFixed(2)})`
                });
            }
        }
        
        // Verificar variação nas companhias aéreas
        const allAirlines = new Set();
        this.results.forEach(result => {
            result.airlines.forEach(airline => allAirlines.add(airline));
        });
        
        const airlineVariations = this.results.map(result => result.airlines.length);
        const minAirlines = Math.min(...airlineVariations);
        const maxAirlines = Math.max(...airlineVariations);
        
        if (maxAirlines - minAirlines > 2) {
            inconsistencies.push({
                type: 'airline_variation',
                description: `Variação na quantidade de companhias aéreas: ${minAirlines} - ${maxAirlines}`
            });
        }
        
        return inconsistencies;
    },
    
    // Comandos para uso no console
    getResults: function() {
        return this.results;
    },
    
    clearResults: function() {
        this.results = [];
        console.log('✅ Resultados dos testes limpos');
    },
    
    exportResults: function() {
        const data = {
            results: this.results,
            summary: {
                totalTests: this.results.length,
                inconsistencies: this.detectInconsistencies()
            },
            exportedAt: new Date().toISOString()
        };
        
        console.log('📊 RESULTADOS EXPORTADOS:', JSON.stringify(data, null, 2));
        return data;
    }
};

// Funções globais para facilitar uso
window.startAutomatedTest = function(searchParams, maxTests = 10, intervalMs = 10000) {
    window.automatedTest.start(searchParams, maxTests, intervalMs);
};

window.stopAutomatedTest = function() {
    window.automatedTest.stop();
};

window.getTestResults = function() {
    return window.automatedTest.getResults();
};

window.clearTestResults = function() {
    window.automatedTest.clearResults();
};

window.exportTestResults = function() {
    return window.automatedTest.exportResults();
};

console.log('✅ Script de teste automatizado carregado!');
console.log('📋 Comandos disponíveis:');
console.log('   startAutomatedTest() - Iniciar teste automatizado');
console.log('   stopAutomatedTest() - Parar teste automatizado');
console.log('   getTestResults() - Ver resultados dos testes');
console.log('   clearTestResults() - Limpar resultados');
console.log('   exportTestResults() - Exportar resultados');
console.log('');
console.log('🔧 Exemplo de uso:');
console.log('   startAutomatedTest(null, 5, 8000) // 5 testes com 8 segundos de intervalo');
console.log('');
console.log('🎯 Certifique-se de que a aplicação está aberta em http://localhost:5173');
