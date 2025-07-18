/**
 * Script de Interceptação de API para Monitoramento de Requisições
 * 
 * Este script intercepta todas as requisições HTTP da aplicação para
 * monitorar dados das APIs de voos, detectar inconsistências e analisar
 * preços em tempo real.
 * 
 * COMO USAR:
 * 1. Abra a aplicação no navegador (http://localhost:5173)
 * 2. Abra o console do navegador (F12)
 * 3. Cole este script inteiro e pressione Enter
 * 4. O script começará a interceptar automaticamente
 * 
 * COMANDOS DISPONÍVEIS:
 * - startInterceptor() - Iniciar interceptação
 * - stopInterceptor() - Parar interceptação
 * - getInterceptedData() - Ver dados interceptados
 * - clearInterceptedData() - Limpar dados
 * - analyzeApiData() - Analisar dados coletados
 */

// Configuração do interceptador
window.apiInterceptor = {
    isActive: false,
    interceptedRequests: [],
    interceptedResponses: [],
    originalFetch: null,
    originalXMLHttpRequest: null,
    
    // Iniciar interceptação
    start: function() {
        if (this.isActive) {
            console.log('⚠️ Interceptador já está ativo');
            return;
        }
        
        this.isActive = true;
        this.interceptedRequests = [];
        this.interceptedResponses = [];
        
        // Salvar referências originais
        this.originalFetch = window.fetch;
        this.originalXMLHttpRequest = window.XMLHttpRequest;
        
        // Interceptar fetch
        this.interceptFetch();
        
        // Interceptar XMLHttpRequest
        this.interceptXMLHttpRequest();
        
        console.log('🔍 Interceptador de API iniciado');
        console.log('📡 Monitorando requisições HTTP...');
    },
    
    // Parar interceptação
    stop: function() {
        if (!this.isActive) {
            console.log('⚠️ Interceptador não está ativo');
            return;
        }
        
        this.isActive = false;
        
        // Restaurar funções originais
        if (this.originalFetch) {
            window.fetch = this.originalFetch;
        }
        if (this.originalXMLHttpRequest) {
            window.XMLHttpRequest = this.originalXMLHttpRequest;
        }
        
        console.log('🛑 Interceptador de API parado');
        console.log(`📊 Total de requisições interceptadas: ${this.interceptedRequests.length}`);
        console.log(`📋 Total de respostas interceptadas: ${this.interceptedResponses.length}`);
    },
    
    // Interceptar fetch
    interceptFetch: function() {
        const self = this;
        
        window.fetch = async function(...args) {
            const [url, options = {}] = args;
            const requestId = Date.now() + Math.random();
            
            // Registrar requisição
            const requestData = {
                id: requestId,
                url: url.toString(),
                method: options.method || 'GET',
                headers: options.headers || {},
                body: options.body || null,
                timestamp: new Date().toISOString(),
                type: 'fetch'
            };
            
            self.interceptedRequests.push(requestData);
            
            // Log da requisição
            if (self.shouldLogRequest(url)) {
                console.log('📤 REQUISIÇÃO INTERCEPTADA:');
                console.log(`   URL: ${url}`);
                console.log(`   Método: ${options.method || 'GET'}`);
                console.log(`   ID: ${requestId}`);
            }
            
            try {
                // Fazer requisição original
                const response = await self.originalFetch.apply(this, args);
                
                // Clonar resposta para interceptação
                const clonedResponse = response.clone();
                
                // Processar resposta
                self.processResponse(requestId, clonedResponse, url);
                
                return response;
                
            } catch (error) {
                console.error('❌ Erro na requisição interceptada:', error);
                throw error;
            }
        };
    },
    
    // Interceptar XMLHttpRequest
    interceptXMLHttpRequest: function() {
        const self = this;
        
        window.XMLHttpRequest = function() {
            const xhr = new self.originalXMLHttpRequest();
            const requestId = Date.now() + Math.random();
            
            // Interceptar método open
            const originalOpen = xhr.open;
            xhr.open = function(method, url, ...args) {
                xhr._interceptorData = {
                    id: requestId,
                    url: url.toString(),
                    method: method.toUpperCase(),
                    timestamp: new Date().toISOString(),
                    type: 'xhr'
                };
                
                return originalOpen.apply(this, [method, url, ...args]);
            };
            
            // Interceptar método send
            const originalSend = xhr.send;
            xhr.send = function(data) {
                if (xhr._interceptorData) {
                    xhr._interceptorData.body = data;
                    self.interceptedRequests.push(xhr._interceptorData);
                    
                    if (self.shouldLogRequest(xhr._interceptorData.url)) {
                        console.log('📤 REQUISIÇÃO XHR INTERCEPTADA:');
                        console.log(`   URL: ${xhr._interceptorData.url}`);
                        console.log(`   Método: ${xhr._interceptorData.method}`);
                        console.log(`   ID: ${requestId}`);
                    }
                }
                
                // Interceptar resposta
                const originalOnReadyStateChange = xhr.onreadystatechange;
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4 && xhr._interceptorData) {
                        self.processXHRResponse(requestId, xhr);
                    }
                    
                    if (originalOnReadyStateChange) {
                        originalOnReadyStateChange.apply(this, arguments);
                    }
                };
                
                return originalSend.apply(this, [data]);
            };
            
            return xhr;
        };
    },
    
    // Processar resposta fetch
    processResponse: async function(requestId, response, url) {
        try {
            let responseData = null;
            let contentType = response.headers.get('content-type');
            
            if (contentType && contentType.includes('application/json')) {
                responseData = await response.json();
            } else {
                responseData = await response.text();
            }
            
            const responseInfo = {
                id: requestId,
                url: url.toString(),
                status: response.status,
                statusText: response.statusText,
                headers: this.headersToObject(response.headers),
                data: responseData,
                timestamp: new Date().toISOString(),
                type: 'fetch'
            };
            
            this.interceptedResponses.push(responseInfo);
            
            // Log da resposta
            if (this.shouldLogRequest(url)) {
                console.log('📥 RESPOSTA INTERCEPTADA:');
                console.log(`   Status: ${response.status}`);
                console.log(`   URL: ${url}`);
                console.log(`   ID: ${requestId}`);
                
                // Analisar se é resposta de voos
                if (this.isFlightResponse(url, responseData)) {
                    this.analyzeFlightResponse(responseData, url);
                }
            }
            
        } catch (error) {
            console.error('❌ Erro ao processar resposta:', error);
        }
    },
    
    // Processar resposta XHR
    processXHRResponse: function(requestId, xhr) {
        try {
            let responseData = null;
            
            try {
                responseData = JSON.parse(xhr.responseText);
            } catch {
                responseData = xhr.responseText;
            }
            
            const responseInfo = {
                id: requestId,
                url: xhr._interceptorData.url,
                status: xhr.status,
                statusText: xhr.statusText,
                headers: this.parseXHRHeaders(xhr.getAllResponseHeaders()),
                data: responseData,
                timestamp: new Date().toISOString(),
                type: 'xhr'
            };
            
            this.interceptedResponses.push(responseInfo);
            
            // Log da resposta
            if (this.shouldLogRequest(xhr._interceptorData.url)) {
                console.log('📥 RESPOSTA XHR INTERCEPTADA:');
                console.log(`   Status: ${xhr.status}`);
                console.log(`   URL: ${xhr._interceptorData.url}`);
                console.log(`   ID: ${requestId}`);
                
                // Analisar se é resposta de voos
                if (this.isFlightResponse(xhr._interceptorData.url, responseData)) {
                    this.analyzeFlightResponse(responseData, xhr._interceptorData.url);
                }
            }
            
        } catch (error) {
            console.error('❌ Erro ao processar resposta XHR:', error);
        }
    },
    
    // Verificar se deve logar requisição
    shouldLogRequest: function(url) {
        const flightKeywords = [
            'flight', 'voo', 'search', 'busca', 'moblix', 'api'
        ];
        
        const urlStr = url.toString().toLowerCase();
        return flightKeywords.some(keyword => urlStr.includes(keyword));
    },
    
    // Verificar se é resposta de voos
    isFlightResponse: function(url, data) {
        if (!data || typeof data !== 'object') return false;
        
        const urlStr = url.toString().toLowerCase();
        const hasFlightKeyword = ['flight', 'voo', 'search', 'busca'].some(keyword => 
            urlStr.includes(keyword)
        );
        
        const hasFlightData = this.containsFlightData(data);
        
        return hasFlightKeyword || hasFlightData;
    },
    
    // Verificar se contém dados de voo
    containsFlightData: function(data) {
        if (!data || typeof data !== 'object') return false;
        
        const flightFields = [
            'flights', 'voos', 'trechos', 'segments', 'precos', 'prices',
            'ValorTotal', 'ValorAdulto', 'CompanhiaAerea', 'airline'
        ];
        
        const dataStr = JSON.stringify(data).toLowerCase();
        return flightFields.some(field => dataStr.includes(field.toLowerCase()));
    },
    
    // Analisar resposta de voos
    analyzeFlightResponse: function(data, url) {
        console.log('✈️ ANÁLISE DE DADOS DE VOOS:');
        console.log(`   URL: ${url}`);
        
        try {
            const flights = this.extractFlights(data);
            if (flights.length > 0) {
                console.log(`   🎯 Voos encontrados: ${flights.length}`);
                
                // Analisar preços
                const prices = this.extractPrices(flights);
                if (prices.length > 0) {
                    const minPrice = Math.min(...prices);
                    const maxPrice = Math.max(...prices);
                    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
                    
                    console.log(`   💰 Preços: R$ ${minPrice.toFixed(2)} - R$ ${maxPrice.toFixed(2)}`);
                    console.log(`   📊 Preço médio: R$ ${avgPrice.toFixed(2)}`);
                    
                    // Verificar divisão suspeita
                    const suspiciousDivision = this.checkSuspiciousDivision(prices);
                    if (suspiciousDivision.length > 0) {
                        console.log('🚨 POSSÍVEL DIVISÃO SUSPEITA DETECTADA:');
                        suspiciousDivision.forEach(item => {
                            console.log(`   ${item.description}`);
                        });
                    }
                }
                
                // Analisar companhias aéreas
                const airlines = this.extractAirlines(flights);
                if (airlines.length > 0) {
                    console.log(`   🏢 Companhias: ${airlines.join(', ')}`);
                }
                
                // Mostrar amostra de dados brutos
                console.log('📋 AMOSTRA DE DADOS BRUTOS:');
                console.log(JSON.stringify(flights.slice(0, 2), null, 2));
            }
            
        } catch (error) {
            console.error('❌ Erro ao analisar dados de voos:', error);
        }
        
        console.log('─'.repeat(50));
    },
    
    // Extrair voos dos dados
    extractFlights: function(data) {
        let flights = [];
        
        // Tentar diferentes estruturas de dados
        if (Array.isArray(data)) {
            flights = data;
        } else if (data.flights) {
            flights = Array.isArray(data.flights) ? data.flights : [data.flights];
        } else if (data.voos) {
            flights = Array.isArray(data.voos) ? data.voos : [data.voos];
        } else if (data.results) {
            flights = Array.isArray(data.results) ? data.results : [data.results];
        } else if (data.data) {
            flights = Array.isArray(data.data) ? data.data : [data.data];
        }
        
        return flights.filter(flight => flight && typeof flight === 'object');
    },
    
    // Extrair preços dos voos
    extractPrices: function(flights) {
        const prices = [];
        
        flights.forEach(flight => {
            // Tentar diferentes campos de preço
            const priceFields = [
                'ValorTotalComTaxa', 'ValorTotal', 'ValorAdulto', 'price', 'totalPrice',
                'fare', 'tariff', 'valor', 'preco'
            ];
            
            for (const field of priceFields) {
                if (flight[field] && !isNaN(parseFloat(flight[field]))) {
                    prices.push(parseFloat(flight[field]));
                    break;
                }
            }
            
            // Verificar dentro de tarifas
            if (flight.Tarifas && Array.isArray(flight.Tarifas)) {
                flight.Tarifas.forEach(tarifa => {
                    if (tarifa.ValorAdulto && !isNaN(parseFloat(tarifa.ValorAdulto))) {
                        prices.push(parseFloat(tarifa.ValorAdulto));
                    }
                });
            }
        });
        
        return prices.filter(price => price > 0);
    },
    
    // Extrair companhias aéreas
    extractAirlines: function(flights) {
        const airlines = new Set();
        
        flights.forEach(flight => {
            const airlineFields = [
                'CompanhiaAerea', 'airline', 'companhia', 'company', 'carrier'
            ];
            
            for (const field of airlineFields) {
                if (flight[field] && typeof flight[field] === 'string') {
                    airlines.add(flight[field]);
                    break;
                }
            }
        });
        
        return Array.from(airlines);
    },
    
    // Verificar divisão suspeita
    checkSuspiciousDivision: function(prices) {
        const suspiciousItems = [];
        
        // Verificar se há preços muito baixos comparados a outros
        if (prices.length > 1) {
            const sortedPrices = prices.sort((a, b) => a - b);
            const minPrice = sortedPrices[0];
            const maxPrice = sortedPrices[sortedPrices.length - 1];
            
            // Calcular possíveis divisores
            const ratio = maxPrice / minPrice;
            
            if (ratio > 10) {
                suspiciousItems.push({
                    description: `Diferença extrema entre preços: ${ratio.toFixed(2)}x (R$ ${minPrice.toFixed(2)} vs R$ ${maxPrice.toFixed(2)})`
                });
            }
            
            // Verificar divisores específicos conhecidos
            const knownDivisors = [21.56, 20, 21, 22, 100];
            knownDivisors.forEach(divisor => {
                const expectedPrice = minPrice * divisor;
                const closestPrice = sortedPrices.find(price => Math.abs(price - expectedPrice) < expectedPrice * 0.1);
                
                if (closestPrice) {
                    suspiciousItems.push({
                        description: `Possível divisão por ${divisor}: R$ ${closestPrice.toFixed(2)} / ${divisor} = R$ ${(closestPrice / divisor).toFixed(2)}`
                    });
                }
            });
        }
        
        return suspiciousItems;
    },
    
    // Converter headers para objeto
    headersToObject: function(headers) {
        const obj = {};
        if (headers && headers.entries) {
            for (const [key, value] of headers.entries()) {
                obj[key] = value;
            }
        }
        return obj;
    },
    
    // Parsear headers XHR
    parseXHRHeaders: function(headersString) {
        const headers = {};
        if (headersString) {
            headersString.split('\r\n').forEach(line => {
                const [key, value] = line.split(': ');
                if (key && value) {
                    headers[key.toLowerCase()] = value;
                }
            });
        }
        return headers;
    },
    
    // Obter dados interceptados
    getInterceptedData: function() {
        return {
            requests: this.interceptedRequests,
            responses: this.interceptedResponses
        };
    },
    
    // Limpar dados interceptados
    clearInterceptedData: function() {
        this.interceptedRequests = [];
        this.interceptedResponses = [];
        console.log('✅ Dados interceptados limpos');
    },
    
    // Analisar dados da API
    analyzeApiData: function() {
        console.log('📊 ANÁLISE COMPLETA DOS DADOS DA API:');
        console.log('='.repeat(50));
        
        const flightResponses = this.interceptedResponses.filter(response => 
            this.isFlightResponse(response.url, response.data)
        );
        
        console.log(`📈 Total de respostas de voos: ${flightResponses.length}`);
        
        if (flightResponses.length > 0) {
            // Analisar cada resposta
            flightResponses.forEach((response, index) => {
                console.log(`\n🔍 Resposta ${index + 1}:`);
                console.log(`   URL: ${response.url}`);
                console.log(`   Status: ${response.status}`);
                console.log(`   Timestamp: ${response.timestamp}`);
                
                const flights = this.extractFlights(response.data);
                const prices = this.extractPrices(flights);
                const airlines = this.extractAirlines(flights);
                
                console.log(`   Voos: ${flights.length}`);
                console.log(`   Preços: ${prices.length}`);
                console.log(`   Companhias: ${airlines.length}`);
                
                if (prices.length > 0) {
                    const minPrice = Math.min(...prices);
                    const maxPrice = Math.max(...prices);
                    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
                    
                    console.log(`   Preço min: R$ ${minPrice.toFixed(2)}`);
                    console.log(`   Preço max: R$ ${maxPrice.toFixed(2)}`);
                    console.log(`   Preço médio: R$ ${avgPrice.toFixed(2)}`);
                }
            });
            
            // Comparar respostas
            if (flightResponses.length > 1) {
                console.log('\n🔍 COMPARAÇÃO ENTRE RESPOSTAS:');
                this.compareFlightResponses(flightResponses);
            }
        }
        
        return flightResponses;
    },
    
    // Comparar respostas de voos
    compareFlightResponses: function(responses) {
        const comparison = responses.map(response => {
            const flights = this.extractFlights(response.data);
            const prices = this.extractPrices(flights);
            const airlines = this.extractAirlines(flights);
            
            return {
                url: response.url,
                timestamp: response.timestamp,
                flightCount: flights.length,
                priceCount: prices.length,
                avgPrice: prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0,
                minPrice: prices.length > 0 ? Math.min(...prices) : 0,
                maxPrice: prices.length > 0 ? Math.max(...prices) : 0,
                airlines: airlines
            };
        });
        
        // Detectar diferenças
        const differences = [];
        
        for (let i = 1; i < comparison.length; i++) {
            const prev = comparison[i - 1];
            const curr = comparison[i];
            
            if (Math.abs(curr.avgPrice - prev.avgPrice) > 10) {
                differences.push({
                    type: 'price_difference',
                    description: `Diferença de preço médio: R$ ${prev.avgPrice.toFixed(2)} → R$ ${curr.avgPrice.toFixed(2)}`
                });
            }
            
            if (Math.abs(curr.flightCount - prev.flightCount) > 5) {
                differences.push({
                    type: 'flight_count_difference',
                    description: `Diferença na contagem de voos: ${prev.flightCount} → ${curr.flightCount}`
                });
            }
        }
        
        if (differences.length > 0) {
            console.log('🚨 DIFERENÇAS DETECTADAS:');
            differences.forEach((diff, index) => {
                console.log(`   ${index + 1}. ${diff.description}`);
            });
        } else {
            console.log('✅ Nenhuma diferença significativa detectada');
        }
        
        return differences;
    }
};

// Funções globais para facilitar uso
window.startInterceptor = function() {
    window.apiInterceptor.start();
};

window.stopInterceptor = function() {
    window.apiInterceptor.stop();
};

window.getInterceptedData = function() {
    return window.apiInterceptor.getInterceptedData();
};

window.clearInterceptedData = function() {
    window.apiInterceptor.clearInterceptedData();
};

window.analyzeApiData = function() {
    return window.apiInterceptor.analyzeApiData();
};

// Iniciar automaticamente
window.apiInterceptor.start();

console.log('🔍 Script de interceptação de API carregado e iniciado!');
console.log('📋 Comandos disponíveis:');
console.log('   startInterceptor() - Iniciar interceptação');
console.log('   stopInterceptor() - Parar interceptação');
console.log('   getInterceptedData() - Ver dados interceptados');
console.log('   clearInterceptedData() - Limpar dados');
console.log('   analyzeApiData() - Analisar dados coletados');
console.log('');
console.log('🎯 O interceptador está monitorando automaticamente todas as requisições');
console.log('✈️ Agora faça algumas buscas de voos para ver os dados sendo capturados');
