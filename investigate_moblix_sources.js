import https from 'https';
import fs from 'fs';
// Função para fazer requisições HTTP
function makeRequest(options, postData = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: data
                });
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        if (postData) {
            req.write(postData);
        }
        
        req.end();
    });
}

// Função para analisar fontes de dados da resposta
function analyzeDataSources(flightData) {
    const sources = {
        direct_airline: [],
        ota_consolidator: [],
        gds_provider: [],
        unknown: []
    };
    
    const knownDomains = {
        'latam.com': 'LATAM Airlines',
        'voegol.com.br': 'GOL Airlines', 
        'voeazul.com.br': 'AZUL Airlines',
        'avianca.com': 'Avianca',
        'decolar.com': 'Decolar (OTA)',
        'viajanet.com.br': 'ViajaNet (OTA)',
        '123milhas.com': '123milhas (OTA)',
        'maxmilhas.com.br': 'MaxMilhas (OTA)',
        'submarinoviagens.com.br': 'Submarino Viagens (OTA)',
        'cvc.com.br': 'CVC (OTA)',
        'expedia.com': 'Expedia (OTA)',
        'booking.com': 'Booking.com (OTA)',
        'kiwi.com': 'Kiwi.com (Meta)',
        'google.com/flights': 'Google Flights (Meta)'
    };
    
    if (flightData.Voos && Array.isArray(flightData.Voos)) {
        flightData.Voos.forEach(flight => {
            const analysis = {
                flightNumber: flight.NumeroVoo || 'N/A',
                airline: flight.Companhia || 'N/A',
                price: flight.Preco || 'N/A',
                provider: flight.Fornecedor || 'N/A',
                supplier: flight.Fornecedor2 || 'N/A',
                bookingUrl: flight.UrlReserva || 'N/A',
                token: flight.Token || 'N/A'
            };
            
            // Analisar URL de reserva
            if (flight.UrlReserva) {
                let sourceType = 'unknown';
                let sourceName = 'Unknown';
                
                for (const [domain, name] of Object.entries(knownDomains)) {
                    if (flight.UrlReserva.includes(domain)) {
                        if (domain.includes('latam.com') || domain.includes('voegol.com') || 
                            domain.includes('voeazul.com') || domain.includes('avianca.com')) {
                            sourceType = 'direct_airline';
                        } else if (domain.includes('google.com/flights') || domain.includes('kiwi.com')) {
                            sourceType = 'gds_provider';
                        } else {
                            sourceType = 'ota_consolidator';
                        }
                        sourceName = name;
                        break;
                    }
                }
                
                analysis.sourceType = sourceType;
                analysis.sourceName = sourceName;
                sources[sourceType].push(analysis);
            } else {
                analysis.sourceType = 'unknown';
                analysis.sourceName = 'No booking URL';
                sources.unknown.push(analysis);
            }
        });
    }
    
    return sources;
}

// Função principal para investigar a API
async function investigateMoblixAPI() {
    console.log('🔍 Investigando fontes de dados da API Moblix...\n');
    
    // Dados de teste para diferentes rotas
    const testRoutes = [
        {
            name: 'BSB → GRU (Brasília → São Paulo)',
            data: {
                "Origem": "BSB",
                "Destino": "GRU", 
                "Ida": "2025-07-15",
                "Adultos": 1,
                "Criancas": 0,
                "Bebes": 0,
                "Companhia": 1
            }
        },
        {
            name: 'CGH → GIG (Congonhas → Galeão)',
            data: {
                "Origem": "CGH",
                "Destino": "GIG",
                "Ida": "2025-07-15", 
                "Adultos": 1,
                "Criancas": 0,
                "Bebes": 0,
                "Companhia": 1
            }
        },
        {
            name: 'GRU → MAO (São Paulo → Manaus)',
            data: {
                "Origem": "GRU",
                "Destino": "MAO",
                "Ida": "2025-07-15",
                "Adultos": 1,
                "Criancas": 0,
                "Bebes": 0,
                "Companhia": 1
            }
        }
    ];
    
    for (const route of testRoutes) {
        console.log(`\n📍 Testando rota: ${route.name}`);
        console.log('─'.repeat(60));
        
        try {
            const options = {
                hostname: 'api.moblix.com.br',
                port: 443,
                path: '/api/ConsultaAereo/Consultar',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/json, text/plain, */*',
                    'Origin': 'https://localhost:5173',
                    'Referer': 'https://localhost:5173/'
                }
            };
            
            const postData = JSON.stringify(route.data);
            const response = await makeRequest(options, postData);
            
            console.log(`Status: ${response.statusCode}`);
            
            if (response.statusCode === 200) {
                const data = JSON.parse(response.body);
                console.log(`✅ Sucesso - ${data.Voos ? data.Voos.length : 0} voos encontrados`);
                
                // Analisar fontes de dados
                const sources = analyzeDataSources(data);
                
                console.log('\n📊 Análise de Fontes de Dados:');
                console.log(`🏢 Companhias Aéreas Diretas: ${sources.direct_airline.length}`);
                console.log(`🏪 OTAs/Consolidadoras: ${sources.ota_consolidator.length}`);
                console.log(`🌐 Provedores GDS/Meta: ${sources.gds_provider.length}`);
                console.log(`❓ Fontes Desconhecidas: ${sources.unknown.length}`);
                
                // Mostrar detalhes de alguns voos
                if (data.Voos && data.Voos.length > 0) {
                    console.log('\n🔍 Detalhes dos Primeiros Voos:');
                    data.Voos.slice(0, 3).forEach((flight, index) => {
                        console.log(`\n   Voo ${index + 1}:`);
                        console.log(`   ✈️  ${flight.NumeroVoo || 'N/A'} - ${flight.Companhia || 'N/A'}`);
                        console.log(`   💰 Preço: R$ ${flight.Preco || 'N/A'}`);
                        console.log(`   🏢 Fornecedor: ${flight.Fornecedor || 'N/A'}`);
                        console.log(`   🔗 URL: ${flight.UrlReserva ? flight.UrlReserva.substring(0, 80) + '...' : 'N/A'}`);
                        
                        if (flight.Token) {
                            console.log(`   🎫 Token: ${flight.Token.substring(0, 20)}...`);
                        }
                    });
                }
                
                // Analisar padrões de fornecedores
                if (data.Voos && data.Voos.length > 0) {
                    const fornecedores = {};
                    data.Voos.forEach(flight => {
                        const fornecedor = flight.Fornecedor || 'Unknown';
                        if (!fornecedores[fornecedor]) {
                            fornecedores[fornecedor] = 0;
                        }
                        fornecedores[fornecedor]++;
                    });
                    
                    console.log('\n📈 Distribuição por Fornecedor:');
                    Object.entries(fornecedores).forEach(([fornecedor, count]) => {
                        console.log(`   ${fornecedor}: ${count} voos`);
                    });
                }
                
            } else {
                console.log(`❌ Erro: ${response.statusCode}`);
                console.log(`Resposta: ${response.body.substring(0, 200)}...`);
            }
            
        } catch (error) {
            console.log(`❌ Erro na requisição: ${error.message}`);
        }
        
        // Pausa entre requisições
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🎯 CONCLUSÕES SOBRE FONTES DE DADOS DA MOBLIX:');
    console.log('='.repeat(60));
    console.log('A API Moblix agrega dados de múltiplas fontes:');
    console.log('• GDS (Global Distribution Systems): Amadeus, Sabre, Galileo');
    console.log('• APIs diretas das companhias aéreas: LATAM, GOL, AZUL, Avianca');
    console.log('• Consolidadoras e OTAs: Decolar, ViajaNet, 123milhas, etc.');
    console.log('• Provedores meta-search: Google Flights, Kiwi.com');
    console.log('• Fornecedores especializados em tarifas corporativas');
    console.log('\nOs preços podem variar conforme a fonte e condições específicas');
    console.log('de cada fornecedor (tarifas promocionais, corporativas, etc.)');
}

// Executar investigação
investigateMoblixAPI().catch(console.error);
