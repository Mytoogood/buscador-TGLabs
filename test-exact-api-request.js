import https from 'https';

// Função para fazer a requisição exata da API
function makeApiRequest() {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            "Origem": "BSB",
            "Destino": "GRU", 
            "Ida": "2025-03-10",
            "Adultos": 1,
            "Criancas": 0,
            "Bebes": 0,
            "Companhia": 1
        });

        const options = {
            hostname: 'api.moblix.com.br',
            port: 443,
            path: '/api/ConsultaAereo/Consultar',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
                'User-Agent': 'curl/7.68.0',
                'Accept': '*/*'
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
                        headers: res.headers,
                        data: response
                    });
                } catch (error) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
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

// Função para analisar a resposta
function analyzeResponse(response) {
    console.log('📊 ANÁLISE DA RESPOSTA DA API');
    console.log('============================');
    
    console.log('Status Code:', response.statusCode);
    console.log('Content-Type:', response.headers['content-type']);
    
    if (response.statusCode !== 200) {
        console.log('❌ Erro na requisição');
        console.log('Resposta:', response.data);
        return;
    }
    
    const data = response.data;
    
    if (!data || typeof data !== 'object') {
        console.log('❌ Resposta inválida');
        console.log('Resposta:', data);
        return;
    }
    
    console.log('\n🔍 ESTRUTURA DA RESPOSTA:');
    console.log('Propriedades principais:', Object.keys(data));
    
    // Verificar se há dados de voos
    if (data.Data && Array.isArray(data.Data)) {
        console.log('\n✅ Dados de voos encontrados');
        console.log('Número de itens em Data:', data.Data.length);
        
        // Analisar cada item
        data.Data.forEach((item, index) => {
            console.log(`\n📋 Item ${index + 1}:`);
            console.log('Propriedades:', Object.keys(item));
            
            // Verificar se há voos
            if (item.Voos && Array.isArray(item.Voos)) {
                console.log(`✈️ ${item.Voos.length} voos encontrados`);
                
                // Analisar cada voo para verificar dados de milhas
                item.Voos.forEach((voo, vooIndex) => {
                    console.log(`\n  🛫 Voo ${vooIndex + 1}:`);
                    console.log('  Propriedades:', Object.keys(voo));
                    
                    // Verificar campos relacionados a milhas
                    const milhasFields = [];
                    Object.keys(voo).forEach(key => {
                        if (key.toLowerCase().includes('ponto') || 
                            key.toLowerCase().includes('mile') || 
                            key.toLowerCase().includes('award') ||
                            key.toLowerCase().includes('redemption')) {
                            milhasFields.push(`${key}: ${voo[key]}`);
                        }
                    });
                    
                    if (milhasFields.length > 0) {
                        console.log('  🎯 CAMPOS RELACIONADOS A MILHAS:');
                        milhasFields.forEach(field => {
                            console.log(`    ${field}`);
                        });
                    }
                    
                    // Verificar especificamente campos comuns
                    if (voo.PontosAdulto !== undefined) {
                        console.log(`  💰 PontosAdulto: ${voo.PontosAdulto}`);
                        if (voo.PontosAdulto > 0) {
                            console.log('  ✅ VOO EM MILHAS ENCONTRADO!');
                        } else {
                            console.log('  💸 Voo pago (não em milhas)');
                        }
                    }
                    
                    if (voo.ValorTotal !== undefined) {
                        console.log(`  💵 ValorTotal: R$ ${voo.ValorTotal}`);
                    }
                    
                    // Mostrar alguns campos importantes
                    console.log(`  ✈️ Número: ${voo.Numero || 'N/A'}`);
                    console.log(`  🏢 Companhia: ${voo.Companhia || 'N/A'}`);
                    console.log(`  💰 Preço: R$ ${voo.Preco || 'N/A'}`);
                });
            }
        });
        
        // Resumo final
        console.log('\n📊 RESUMO FINAL:');
        let totalVoos = 0;
        let voosEmMilhas = 0;
        
        data.Data.forEach(item => {
            if (item.Voos && Array.isArray(item.Voos)) {
                totalVoos += item.Voos.length;
                voosEmMilhas += item.Voos.filter(voo => voo.PontosAdulto > 0).length;
            }
        });
        
        console.log(`✈️ Total de voos: ${totalVoos}`);
        console.log(`🎯 Voos em milhas: ${voosEmMilhas}`);
        console.log(`💸 Voos pagos: ${totalVoos - voosEmMilhas}`);
        
        if (voosEmMilhas > 0) {
            console.log('\n🎉 CONCLUSÃO: SIM, a API pode retornar voos em milhas!');
            console.log('Os voos em milhas têm PontosAdulto > 0');
        } else {
            console.log('\n❌ CONCLUSÃO: Não foram encontrados voos em milhas nesta consulta');
            console.log('Todos os voos têm PontosAdulto = 0 (voos pagos)');
        }
        
    } else {
        console.log('❌ Nenhum dado de voos encontrado');
        console.log('Estrutura da resposta:', JSON.stringify(data, null, 2));
    }
}

// Executar teste
async function runTest() {
    console.log('🔍 TESTANDO REQUISIÇÃO EXATA DA API MOBLIX');
    console.log('==========================================');
    console.log('Endpoint: https://api.moblix.com.br/api/ConsultaAereo/Consultar');
    console.log('Parâmetros: BSB → GRU, 2025-03-10, LATAM');
    
    try {
        const response = await makeApiRequest();
        analyzeResponse(response);
    } catch (error) {
        console.error('❌ Erro na requisição:', error.message);
    }
}

runTest();
