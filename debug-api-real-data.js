/**
 * Script para interceptar e analisar dados reais da API Moblix
 * Execute este script no console do navegador enquanto faz uma busca de voos
 */

console.log('🔍 Interceptador de API Moblix iniciado!');

// Interceptar todas as requisições fetch
const originalFetch = window.fetch;
window.fetch = function(...args) {
    const [resource, config] = args;
    
    console.log('📡 Requisição interceptada:', resource);
    
    return originalFetch.apply(this, args)
        .then(response => {
            // Clonar a response para poder ler o JSON
            const clonedResponse = response.clone();
            
            // Se for uma requisição para a API Moblix
            if (resource.includes('moblix') || resource.includes('flights') || resource.includes('search')) {
                console.log('✈️ Resposta da API de voos detectada!');
                
                clonedResponse.json().then(data => {
                    console.log('📋 === DADOS BRUTOS DA API ===');
                    console.log('URL:', resource);
                    console.log('Status:', response.status);
                    console.log('Data completa:', data);
                    
                    // Analisar estrutura dos voos
                    if (data && Array.isArray(data)) {
                        console.log(`📊 Total de voos: ${data.length}`);
                        
                        data.forEach((flight, index) => {
                            console.log(`\n🛫 VOO ${index + 1}:`);
                            console.log('  Companhia:', flight.CompanhiaAerea || flight.airline);
                            console.log('  Origem:', flight.Origem || flight.origin);
                            console.log('  Destino:', flight.Destino || flight.destination);
                            
                            // Analisar todos os campos de preço
                            const priceFields = [
                                'ValorTotalComTaxa', 'ValorTotal', 'ValorAdulto', 'Valor',
                                'price', 'totalPrice', 'priceWithTax', 'cost', 'amount'
                            ];
                            
                            console.log('  💰 PREÇOS ENCONTRADOS:');
                            priceFields.forEach(field => {
                                if (flight[field] !== undefined) {
                                    console.log(`    ${field}: ${flight[field]}`);
                                }
                            });
                            
                            // Mostrar todos os campos para análise
                            console.log('  🔍 Todos os campos:', Object.keys(flight));
                        });
                    } else if (data && data.flights) {
                        console.log('📊 Dados aninhados em "flights"');
                        console.log('Voos:', data.flights);
                    } else {
                        console.log('❓ Estrutura de dados desconhecida');
                    }
                    
                    console.log('='.repeat(50));
                }).catch(err => {
                    console.log('❌ Erro ao ler JSON:', err);
                });
            }
            
            return response;
        });
};

// Interceptar XMLHttpRequest também
const originalXHR = window.XMLHttpRequest;
window.XMLHttpRequest = function() {
    const xhr = new originalXHR();
    const originalOpen = xhr.open;
    const originalSend = xhr.send;
    
    xhr.open = function(method, url, ...args) {
        this._url = url;
        return originalOpen.apply(this, [method, url, ...args]);
    };
    
    xhr.send = function(...args) {
        this.addEventListener('load', function() {
            if (this._url && (this._url.includes('moblix') || this._url.includes('flights'))) {
                console.log('📡 XHR Response:', this._url);
                try {
                    const data = JSON.parse(this.responseText);
                    console.log('📋 XHR Data:', data);
                } catch (e) {
                    console.log('📋 XHR Raw:', this.responseText);
                }
            }
        });
        
        return originalSend.apply(this, args);
    };
    
    return xhr;
};

console.log('✅ Interceptadores instalados! Faça uma busca de voos agora.');
console.log('📝 Abra o console do navegador para ver os logs em tempo real.');
