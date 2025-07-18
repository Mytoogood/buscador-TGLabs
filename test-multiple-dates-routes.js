import https from 'https';
import { URLSearchParams } from 'url';

// Função para obter token de autenticação
function getAuthToken() {
    return new Promise((resolve, reject) => {
        const formData = new URLSearchParams();
        formData.append('grant_type', 'password');
        formData.append('username', 'TooGood');
        formData.append('password', '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7');

        const postData = formData.toString();

        const options = {
            hostname: 'api.moblix.com.br',
            port: 443,
            path: '/api/Token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Origin': 'externo',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const response = JSON.parse(data);
                        resolve(response);
                    } catch (error) {
                        reject(new Error('Erro ao parsear resposta do token'));
                    }
                } else {
                    reject(new Error(`Erro ao obter token: ${res.statusCode} - ${data}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

// Função para buscar voos
function searchFlights(accessToken, origem, destino, data) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            "Origem": origem,
            "Destino": destino,
            "Ida": data,
            "Adultos": 1,
            "Criancas": 0,
            "Bebes": 0,
            "Companhia": 1 // LATAM
        });

        const options = {
            hostname: 'api.moblix.com.br',
            port: 443,
            path: '/api/ConsultaAereo/Consultar',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    resolve({
                        statusCode: res.statusCode,
                        data: response
                    });
                } catch (error) {
                    resolve({
                        statusCode: res.statusCode,
                        data: data
                    });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

// Função para analisar voos em milhas
function analyzeMilesFlights(data, origem, destino, data_voo) {
    let totalVoos = 0;
    let voosComMilhas = 0;
    let voosComPontos = [];
    
    if (data.Data && Array.isArray(data.Data)) {
        data.Data.forEach(item => {
            if (item.Ida && Array.isArray(item.Ida)) {
                item.Ida.forEach(voo => {
                    totalVoos++;
                    if (voo.PontosAdulto && voo.PontosAdulto > 0) {
                        voosComMilhas++;
                        voosComPontos.push({
                            numero: voo.Numero || 'N/A',
                            pontos: voo.PontosAdulto,
                            preco: voo.Preco || 'N/A',
                            horario: voo.Horario || 'N/A',
                            origem: origem,
                            destino: destino,
                            data: data_voo
                        });
                    }
                });
            }
        });
    }
    
    return {
        total: totalVoos,
        milhas: voosComMilhas,
        voos: voosComPontos
    };
}

// Função principal de teste
async function testMultipleDatesAndRoutes() {
    console.log('🌍 TESTE MÚLTIPLAS DATAS E ROTAS PARA VOOS EM MILHAS');
    console.log('==================================================');
    
    try {
        // Obter token
        console.log('📡 Obtendo token de autenticação...');
        const tokenResponse = await getAuthToken();
        console.log('✅ Token obtido com sucesso!');
        
        // Configurar diferentes rotas para testar
        const routes = [
            { origem: 'SAO', destino: 'RIO', nome: 'São Paulo → Rio de Janeiro' },
            { origem: 'BSB', destino: 'GRU', nome: 'Brasília → São Paulo' },
            { origem: 'GRU', destino: 'BSB', nome: 'São Paulo → Brasília' },
            { origem: 'RIO', destino: 'SAO', nome: 'Rio de Janeiro → São Paulo' },
            { origem: 'GRU', destino: 'REC', nome: 'São Paulo → Recife' },
            { origem: 'SAO', destino: 'FOR', nome: 'São Paulo → Fortaleza' },
            { origem: 'GRU', destino: 'SSA', nome: 'São Paulo → Salvador' },
            { origem: 'GRU', destino: 'BEL', nome: 'São Paulo → Belém' },
            { origem: 'GRU', destino: 'MAO', nome: 'São Paulo → Manaus' },
            { origem: 'GRU', destino: 'CWB', nome: 'São Paulo → Curitiba' }
        ];
        
        // Configurar diferentes datas para testar
        const dates = [
            '2025-07-15',
            '2025-07-20',
            '2025-07-25',
            '2025-08-01',
            '2025-08-05',
            '2025-08-10',
            '2025-08-15',
            '2025-08-20',
            '2025-09-01',
            '2025-09-15'
        ];
        
        let totalTestes = 0;
        let testesComVoos = 0;
        let testesComMilhas = 0;
        let todosVoosMilhas = [];
        
        console.log(`\n🧪 Iniciando testes: ${routes.length} rotas × ${dates.length} datas = ${routes.length * dates.length} testes`);
        console.log('⏳ Isso pode levar alguns minutos...\n');
        
        // Testar cada combinação de rota e data
        for (let i = 0; i < routes.length; i++) {
            const route = routes[i];
            
            console.log(`📍 Testando rota ${i + 1}/${routes.length}: ${route.nome}`);
            
            for (let j = 0; j < dates.length; j++) {
                const date = dates[j];
                totalTestes++;
                
                try {
                    console.log(`  📅 Data ${j + 1}/${dates.length}: ${date}`);
                    
                    const response = await searchFlights(
                        tokenResponse.access_token,
                        route.origem,
                        route.destino,
                        date
                    );
                    
                    if (response.statusCode === 200) {
                        const analysis = analyzeMilesFlights(response.data, route.origem, route.destino, date);
                        
                        if (analysis.total > 0) {
                            testesComVoos++;
                            console.log(`    ✅ ${analysis.total} voos encontrados`);
                            
                            if (analysis.milhas > 0) {
                                testesComMilhas++;
                                todosVoosMilhas.push(...analysis.voos);
                                console.log(`    🎯 ${analysis.milhas} voos em MILHAS encontrados!`);
                                
                                // Mostra detalhes dos voos em milhas
                                analysis.voos.forEach((voo, index) => {
                                    console.log(`      ${index + 1}. ${voo.numero} - ${voo.pontos} pontos (${voo.horario})`);
                                });
                            } else {
                                console.log(`    💸 Apenas voos pagos`);
                            }
                        } else {
                            console.log(`    ❌ Nenhum voo encontrado`);
                        }
                    } else {
                        console.log(`    ❌ Erro na busca: ${response.statusCode}`);
                    }
                    
                    // Pequena pausa entre requisições para não sobrecarregar a API
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                } catch (error) {
                    console.log(`    ❌ Erro: ${error.message}`);
                }
            }
            
            console.log(); // Linha em branco entre rotas
        }
        
        // Resumo final
        console.log('📊 RESUMO FINAL DOS TESTES:');
        console.log('==========================');
        console.log(`🧪 Total de testes realizados: ${totalTestes}`);
        console.log(`✅ Testes com voos encontrados: ${testesComVoos}`);
        console.log(`🎯 Testes com voos em MILHAS: ${testesComMilhas}`);
        console.log(`✈️ Total de voos em milhas encontrados: ${todosVoosMilhas.length}`);
        
        if (todosVoosMilhas.length > 0) {
            console.log('\n🎉 VOOS EM MILHAS ENCONTRADOS:');
            console.log('==============================');
            
            todosVoosMilhas.forEach((voo, index) => {
                console.log(`${index + 1}. ${voo.origem} → ${voo.destino} (${voo.data})`);
                console.log(`   Voo: ${voo.numero} - ${voo.pontos} pontos - ${voo.horario}`);
            });
            
            // Análise por rota
            const voosPorRota = {};
            todosVoosMilhas.forEach(voo => {
                const rota = `${voo.origem} → ${voo.destino}`;
                if (!voosPorRota[rota]) {
                    voosPorRota[rota] = [];
                }
                voosPorRota[rota].push(voo);
            });
            
            console.log('\n📈 ANÁLISE POR ROTA:');
            Object.keys(voosPorRota).forEach(rota => {
                console.log(`${rota}: ${voosPorRota[rota].length} voos em milhas`);
            });
            
            // Análise por data
            const voosPorData = {};
            todosVoosMilhas.forEach(voo => {
                if (!voosPorData[voo.data]) {
                    voosPorData[voo.data] = [];
                }
                voosPorData[voo.data].push(voo);
            });
            
            console.log('\n📅 ANÁLISE POR DATA:');
            Object.keys(voosPorData).sort().forEach(data => {
                console.log(`${data}: ${voosPorData[data].length} voos em milhas`);
            });
            
        } else {
            console.log('\n❌ NENHUM VOO EM MILHAS ENCONTRADO');
            console.log('===================================');
            console.log('🔍 Possíveis razões:');
            console.log('  - API não disponibiliza dados de milhas para esta conta');
            console.log('  - Milhas podem estar em endpoints específicos');
            console.log('  - Pode precisar de parâmetros especiais na requisição');
            console.log('  - Dados de milhas podem estar em outros campos');
            console.log('  - Permissões especiais podem ser necessárias');
        }
        
        console.log('\n💡 CONCLUSÃO:');
        if (testesComMilhas > 0) {
            console.log('✅ A API consegue retornar voos em milhas!');
            console.log('📝 Implemente a lógica no sistema para buscar essas rotas/datas');
        } else {
            console.log('❌ A API não retornou voos em milhas em nenhum teste');
            console.log('📞 Recomendo contatar o suporte da API Moblix');
        }
        
    } catch (error) {
        console.error('❌ Erro geral no teste:', error.message);
    }
}

// Executar teste
testMultipleDatesAndRoutes();
