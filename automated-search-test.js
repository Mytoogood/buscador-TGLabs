// Script Automatizado para Teste de Consistência de Buscas de Voos
// Este script executa múltiplas buscas com os mesmos parâmetros para detectar inconsistências

(function() {
    'use strict';
    
    // Configuração do teste
    const testConfig = {
        // Parâmetros fixos da busca
        searchParams: {
            origem: 'GRU', // São Paulo
            destino: 'RIO', // Rio de Janeiro
            dataIda: '2024-12-20',
            dataVolta: '2024-12-27',
            adultos: 1,
            criancas: 0,
            bebes: 0,
            companhia: 'GOL' // ou deixe vazio para todas
        },
        
        // Número de buscas a realizar
        numberOfSearches: 5,
        
        // Intervalo entre buscas (em milissegundos)
        delayBetweenSearches: 3000
    };
    
    // Dados coletados dos testes
    window.automatedTestData = {
        searches: [],
        inconsistencies: [],
        summary: {}
    };
    
    console.log('🤖 Iniciando teste automatizado de consistência de buscas');
    console.log('📋 Configuração:', testConfig);
    
    // Função principal do teste
    async function runAutomatedTest() {
        try {
            // Limpar dados anteriores
            if (window.flightDebugUtils) {
                window.flightDebugUtils.clearData();
            }
            
            console.log(`🔄 Executando ${testConfig.numberOfSearches} buscas com os mesmos parâmetros...`);
            
            for (let i = 0; i < testConfig.numberOfSearches; i++) {
                console.log(`\n🔍 Busca ${i + 1}/${testConfig.numberOfSearches}`);
                
                // Executar busca
                await executeSearch(i);
                
                // Aguardar antes da próxima busca (exceto na última)
                if (i < testConfig.numberOfSearches - 1) {
                    console.log(`⏳ Aguardando ${testConfig.delayBetweenSearches}ms antes da próxima busca...`);
                    await delay(testConfig.delayBetweenSearches);
                }
            }
            
            // Analisar resultados
            console.log('\n📊 Analisando resultados...');
            analyzeTestResults();
            
        } catch (error) {
            console.error('❌ Erro durante o teste automatizado:', error);
        }
    }
    
    // Executar uma busca individual
    async function executeSearch(searchIndex) {
        try {
            // Preencher formulário
            await fillSearchForm();
            
            // Aguardar um momento para garantir que o formulário foi preenchido
            await delay(500);
            
            // Executar busca
            const searchStartTime = Date.now();
            await triggerSearch();
            
            // Aguardar resultados
            await waitForResults();
            
            // Coletar dados da busca
            const searchData = {
                searchIndex: searchIndex,
                timestamp: new Date().toISOString(),
                searchTime: Date.now() - searchStartTime,
                params: { ...testConfig.searchParams },
                results: collectSearchResults()
            };
            
            window.automatedTestData.searches.push(searchData);
            
            console.log(`✅ Busca ${searchIndex + 1} concluída:`, {
                timestamp: searchData.timestamp,
                flightCount: searchData.results.flightCount,
                priceRange: searchData.results.priceRange,
                companies: searchData.results.companies
            });
            
        } catch (error) {
            console.error(`❌ Erro na busca ${searchIndex + 1}:`, error);
        }
    }
    
    // Preencher formulário de busca
    async function fillSearchForm() {
        const params = testConfig.searchParams;
        
        // Função auxiliar para definir valor em input
        const setInputValue = (selector, value) => {
            const element = document.querySelector(selector);
            if (element) {
                element.value = value;
                element.dispatchEvent(new Event('input', { bubbles: true }));
                element.dispatchEvent(new Event('change', { bubbles: true }));
                return true;
            }
            return false;
        };
        
        // Função auxiliar para clicar em elemento
        const clickElement = (selector) => {
            const element = document.querySelector(selector);
            if (element) {
                element.click();
                return true;
            }
            return false;
        };
        
        // Tentar preencher campos com diferentes seletores possíveis
        const selectors = {
            origem: [
                'input[placeholder*="origem"]',
                'input[placeholder*="Origem"]',
                'input[name*="origem"]',
                '#origem',
                '.origem input'
            ],
            destino: [
                'input[placeholder*="destino"]',
                'input[placeholder*="Destino"]',
                'input[name*="destino"]',
                '#destino',
                '.destino input'
            ],
            dataIda: [
                'input[type="date"]',
                'input[placeholder*="ida"]',
                'input[name*="ida"]',
                '#dataIda',
                '.data-ida input'
            ],
            dataVolta: [
                'input[placeholder*="volta"]',
                'input[name*="volta"]',
                '#dataVolta',
                '.data-volta input'
            ],
            adultos: [
                'input[name*="adultos"]',
                'select[name*="adultos"]',
                '#adultos'
            ],
            companhia: [
                'select[name*="companhia"]',
                'select[name*="airline"]',
                '#companhia'
            ]
        };
        
        // Preencher cada campo
        for (const [field, value] of Object.entries(params)) {
            if (selectors[field]) {
                let filled = false;
                for (const selector of selectors[field]) {
                    if (setInputValue(selector, value)) {
                        console.log(`✓ Campo ${field} preenchido com: ${value}`);
                        filled = true;
                        break;
                    }
                }
                if (!filled) {
                    console.warn(`⚠️ Não foi possível preencher o campo: ${field}`);
                }
            }
        }
        
        console.log('📝 Formulário preenchido');
    }
    
    // Disparar busca
    async function triggerSearch() {
        // Tentar encontrar e clicar no botão de busca
        const searchSelectors = [
            'button[type="submit"]',
            'button:contains("Buscar")',
            'button:contains("Pesquisar")',
            '.btn-search',
            '#btnBuscar',
            '.search-button'
        ];
        
        let searchTriggered = false;
        
        for (const selector of searchSelectors) {
            try {
                const element = document.querySelector(selector);
                if (element) {
                    element.click();
                    console.log('🔍 Busca disparada');
                    searchTriggered = true;
                    break;
                }
            } catch (error) {
                continue;
            }
        }
        
        // Se não conseguiu encontrar o botão, tentar submeter form
        if (!searchTriggered) {
            const form = document.querySelector('form');
            if (form) {
                form.submit();
                console.log('📤 Formulário submetido');
                searchTriggered = true;
            }
        }
        
        if (!searchTriggered) {
            throw new Error('Não foi possível disparar a busca');
        }
    }
    
    // Aguardar resultados
    async function waitForResults() {
        const maxWaitTime = 30000; // 30 segundos
        const checkInterval = 1000; // 1 segundo
        const startTime = Date.now();
        
        while (Date.now() - startTime < maxWaitTime) {
            // Verificar se há resultados na tela
            const hasResults = 
                document.querySelector('.flight-result') ||
                document.querySelector('.voo-item') ||
                document.querySelector('[class*="flight"]') ||
                document.querySelector('[class*="resultado"]') ||
                (window.flightDebugData && window.flightDebugData.priceAnalysis.length > 0);
                
            if (hasResults) {
                console.log('✅ Resultados carregados');
                // Aguardar mais um pouco para garantir que todos os dados foram processados
                await delay(2000);
                return;
            }
            
            await delay(checkInterval);
        }
        
        throw new Error('Timeout aguardando resultados');
    }
    
    // Coletar resultados da busca
    function collectSearchResults() {
        const results = {
            timestamp: new Date().toISOString(),
            flightCount: 0,
            priceRange: { min: null, max: null, avg: null },
            companies: [],
            flights: [],
            debugData: null
        };
        
        // Tentar coletar dados do interceptor de debug se disponível
        if (window.flightDebugData && window.flightDebugData.priceAnalysis.length > 0) {
            const latestAnalysis = window.flightDebugData.priceAnalysis[window.flightDebugData.priceAnalysis.length - 1];
            results.debugData = latestAnalysis;
            results.flightCount = latestAnalysis.totalFlights;
            results.priceRange = latestAnalysis.priceStats;
            results.companies = latestAnalysis.companies;
        }
        
        // Tentar coletar dados diretamente do DOM
        const flightElements = document.querySelectorAll('.flight-result, .voo-item, [class*="flight"], [class*="resultado"]');
        
        flightElements.forEach((element, index) => {
            const flightData = {
                index: index,
                company: extractTextFromElement(element, '[class*="company"], [class*="companhia"], .airline'),
                price: extractPriceFromElement(element),
                route: extractTextFromElement(element, '[class*="route"], [class*="rota"]'),
                time: extractTextFromElement(element, '[class*="time"], [class*="hora"]')
            };
            
            results.flights.push(flightData);
        });
        
        if (results.flights.length > 0) {
            results.flightCount = Math.max(results.flightCount, results.flights.length);
        }
        
        return results;
    }
    
    // Extrair texto de elemento
    function extractTextFromElement(parent, selector) {
        try {
            const element = parent.querySelector(selector);
            return element ? element.textContent.trim() : null;
        } catch (error) {
            return null;
        }
    }
    
    // Extrair preço de elemento
    function extractPriceFromElement(parent) {
        try {
            const priceSelectors = [
                '[class*="price"]',
                '[class*="preco"]',
                '[class*="valor"]',
                '.currency',
                '[data-price]'
            ];
            
            for (const selector of priceSelectors) {
                const element = parent.querySelector(selector);
                if (element) {
                    const text = element.textContent || element.getAttribute('data-price') || '';
                    const priceMatch = text.match(/[\d.,]+/);
                    if (priceMatch) {
                        return parseFloat(priceMatch[0].replace(',', '.'));
                    }
                }
            }
            return null;
        } catch (error) {
            return null;
        }
    }
    
    // Analisar resultados do teste
    function analyzeTestResults() {
        const searches = window.automatedTestData.searches;
        
        if (searches.length < 2) {
            console.log('❌ Não há dados suficientes para análise');
            return;
        }
        
        console.log(`\n📊 ANÁLISE DE CONSISTÊNCIA - ${searches.length} buscas realizadas`);
        console.log('='.repeat(60));
        
        // Resumo básico
        searches.forEach((search, index) => {
            console.log(`\n🔍 Busca ${index + 1}:`);
            console.log(`  ⏰ Horário: ${search.timestamp}`);
            console.log(`  ✈️ Voos encontrados: ${search.results.flightCount}`);
            console.log(`  💰 Faixa de preços: R$ ${search.results.priceRange.min} - R$ ${search.results.priceRange.max}`);
            console.log(`  🏢 Companhias: ${search.results.companies.join(', ')}`);
        });
        
        // Detectar inconsistências
        const inconsistencies = [];
        
        for (let i = 1; i < searches.length; i++) {
            const current = searches[i];
            const previous = searches[i - 1];
            
            const issues = [];
            
            // Verificar mudança na contagem de voos
            if (current.results.flightCount !== previous.results.flightCount) {
                issues.push(`Contagem de voos: ${previous.results.flightCount} → ${current.results.flightCount}`);
            }
            
            // Verificar mudança nos preços
            if (current.results.priceRange.min !== previous.results.priceRange.min ||
                current.results.priceRange.max !== previous.results.priceRange.max) {
                issues.push(`Preços: R$ ${previous.results.priceRange.min}-${previous.results.priceRange.max} → R$ ${current.results.priceRange.min}-${current.results.priceRange.max}`);
            }
            
            // Verificar mudança nas companhias
            const prevCompanies = new Set(previous.results.companies);
            const currCompanies = new Set(current.results.companies);
            const companiesChanged = prevCompanies.size !== currCompanies.size || 
                                   ![...prevCompanies].every(c => currCompanies.has(c));
            
            if (companiesChanged) {
                issues.push(`Companhias: ${previous.results.companies.join(', ')} → ${current.results.companies.join(', ')}`);
            }
            
            if (issues.length > 0) {
                inconsistencies.push({
                    searchPair: `${i} vs ${i + 1}`,
                    issues: issues
                });
            }
        }
        
        // Relatório de inconsistências
        console.log(`\n⚠️ INCONSISTÊNCIAS DETECTADAS: ${inconsistencies.length}`);
        console.log('='.repeat(60));
        
        if (inconsistencies.length === 0) {
            console.log('✅ Todas as buscas retornaram resultados consistentes!');
        } else {
            inconsistencies.forEach((inc, index) => {
                console.log(`\n❌ Inconsistência ${index + 1} (Buscas ${inc.searchPair}):`);
                inc.issues.forEach(issue => console.log(`  • ${issue}`));
            });
        }
        
        // Salvar dados para análise posterior
        window.automatedTestData.inconsistencies = inconsistencies;
        window.automatedTestData.summary = {
            totalSearches: searches.length,
            inconsistencyCount: inconsistencies.length,
            consistencyRate: ((searches.length - inconsistencies.length) / searches.length * 100).toFixed(2) + '%'
        };
        
        console.log(`\n📈 RESUMO FINAL:`);
        console.log(`  • Total de buscas: ${window.automatedTestData.summary.totalSearches}`);
        console.log(`  • Inconsistências: ${window.automatedTestData.summary.inconsistencyCount}`);
        console.log(`  • Taxa de consistência: ${window.automatedTestData.summary.consistencyRate}`);
        
        // Exportar dados
        console.log(`\n💾 Para exportar os dados: automatedTestUtils.exportData()`);
    }
    
    // Função auxiliar de delay
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Utilitários do teste automatizado
    window.automatedTestUtils = {
        // Executar teste
        runTest: runAutomatedTest,
        
        // Configurar parâmetros do teste
        configure: (newConfig) => {
            Object.assign(testConfig, newConfig);
            console.log('⚙️ Configuração atualizada:', testConfig);
        },
        
        // Obter dados coletados
        getData: () => window.automatedTestData,
        
        // Obter resumo
        getSummary: () => window.automatedTestData.summary,
        
        // Exportar dados
        exportData: () => {
            const data = JSON.stringify(window.automatedTestData, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `automated-test-results-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            console.log('💾 Dados exportados com sucesso!');
        },
        
        // Limpar dados
        clearData: () => {
            window.automatedTestData = {
                searches: [],
                inconsistencies: [],
                summary: {}
            };
            console.log('🧹 Dados do teste limpos');
        }
    };
    
    console.log('✅ Script de teste automatizado carregado!');
    console.log('\n📋 Comandos disponíveis:');
    console.log('  automatedTestUtils.runTest() - Executar teste completo');
    console.log('  automatedTestUtils.configure({...}) - Configurar parâmetros');
    console.log('  automatedTestUtils.getData() - Obter dados coletados');
    console.log('  automatedTestUtils.getSummary() - Obter resumo dos resultados');
    console.log('  automatedTestUtils.exportData() - Exportar dados para arquivo');
    console.log('  automatedTestUtils.clearData() - Limpar dados coletados');
    
    console.log('\n🔧 Configuração atual:');
    console.table(testConfig);
    
    console.log('\n🚀 Para começar o teste: automatedTestUtils.runTest()');
    
})();
