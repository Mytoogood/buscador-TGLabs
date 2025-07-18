/**
 * Script para análise detalhada de preços
 * Analisa se há alguma divisão ou manipulação nos preços
 */

console.log('💰 Analisador de Preços iniciado!');

// Função para analisar preços
function analyzePrices(flights) {
    console.log('\n📊 === ANÁLISE DETALHADA DE PREÇOS ===');
    
    flights.forEach((flight, index) => {
        console.log(`\n🛫 VOO ${index + 1}:`);
        console.log('Companhia:', flight.CompanhiaAerea || flight.airline || 'N/A');
        
        // Buscar todos os possíveis campos de preço
        const possiblePriceFields = [
            'ValorTotalComTaxa', 'ValorTotal', 'ValorAdulto', 'Valor',
            'price', 'totalPrice', 'priceWithTax', 'cost', 'amount',
            'PrecoTotal', 'PrecoComTaxa', 'PrecoAdulto', 'PrecoBase'
        ];
        
        let foundPrices = [];
        
        // Buscar preços em todos os níveis do objeto
        function findPricesInObject(obj, prefix = '') {
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const value = obj[key];
                    const fullKey = prefix ? `${prefix}.${key}` : key;
                    
                    if (typeof value === 'number' && value > 0) {
                        // Verificar se o campo parece ser um preço
                        if (key.toLowerCase().includes('valor') || 
                            key.toLowerCase().includes('preco') || 
                            key.toLowerCase().includes('price') ||
                            key.toLowerCase().includes('cost') ||
                            key.toLowerCase().includes('amount')) {
                            foundPrices.push({
                                field: fullKey,
                                value: value,
                                formatted: value.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })
                            });
                        }
                    } else if (typeof value === 'object' && value !== null) {
                        findPricesInObject(value, fullKey);
                    }
                }
            }
        }
        
        findPricesInObject(flight);
        
        console.log('💸 Preços encontrados:');
        foundPrices.forEach(price => {
            console.log(`  ${price.field}: ${price.value} (${price.formatted})`);
        });
        
        // Analisar possíveis divisões
        if (foundPrices.length > 1) {
            console.log('🔍 Análise de proporções:');
            for (let i = 0; i < foundPrices.length; i++) {
                for (let j = i + 1; j < foundPrices.length; j++) {
                    const ratio = foundPrices[i].value / foundPrices[j].value;
                    console.log(`  ${foundPrices[i].field} / ${foundPrices[j].field} = ${ratio.toFixed(2)}`);
                }
            }
        }
        
        // Verificar se há campos relacionados a passageiros
        const passengerFields = ['passengers', 'passageiros', 'pax', 'adultos', 'adults'];
        passengerFields.forEach(field => {
            if (flight[field] !== undefined) {
                console.log(`👥 ${field}: ${flight[field]}`);
            }
        });
        
        console.log('-'.repeat(40));
    });
}

// Interceptar e analisar dados da API
const originalFetch = window.fetch;
window.fetch = function(...args) {
    const [resource, config] = args;
    
    return originalFetch.apply(this, args)
        .then(response => {
            const clonedResponse = response.clone();
            
            if (resource.includes('moblix') || resource.includes('flights') || resource.includes('search')) {
                clonedResponse.json().then(data => {
                    let flights = [];
                    
                    if (Array.isArray(data)) {
                        flights = data;
                    } else if (data && data.flights) {
                        flights = data.flights;
                    } else if (data && data.results) {
                        flights = data.results;
                    }
                    
                    if (flights.length > 0) {
                        analyzePrices(flights);
                    }
                }).catch(err => {
                    console.log('❌ Erro ao analisar dados:', err);
                });
            }
            
            return response;
        });
};

// Função para testar com dados mockados
function testWithMockData() {
    console.log('\n🧪 === TESTE COM DADOS MOCKADOS ===');
    
    const mockFlights = [
        {
            CompanhiaAerea: 'GOL',
            ValorTotalComTaxa: 3673.72,
            ValorTotal: 3500.00,
            ValorAdulto: 3673.72,
            passengers: 1,
            Origem: 'GRU',
            Destino: 'REC'
        },
        {
            CompanhiaAerea: 'LATAM',
            ValorTotalComTaxa: 4200.50,
            ValorTotal: 4000.00,
            ValorAdulto: 4200.50,
            passengers: 1,
            Origem: 'GRU',
            Destino: 'REC'
        }
    ];
    
    analyzePrices(mockFlights);
}

// Executar teste imediatamente
testWithMockData();

console.log('✅ Analisador de preços pronto!');
console.log('📝 Execute uma busca de voos para ver a análise em tempo real.');
console.log('🔬 Ou execute testWithMockData() para ver análise com dados de teste.');
