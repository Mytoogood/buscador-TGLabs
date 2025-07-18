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

// Função para buscar voos com o token
function searchFlights(accessToken) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            "Origem": "BSB",
            "Destino": "GRU",
            "Ida": "2025-07-15",
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

// Função para analisar resposta detalhadamente
function analyzeFlightData(data) {
    console.log('\n📊 ANÁLISE DETALHADA DOS DADOS DE VOOS');
    console.log('=====================================');
    
    if (!data || typeof data !== 'object') {
        console.log('❌ Dados inválidos');
        return;
    }
    
    console.log('🔍 Estrutura principal:', Object.keys(data));
    
    if (data.Data && Array.isArray(data.Data)) {
        console.log(`\n✅ ${data.Data.length} item(s) encontrado(s) em Data`);
        
        let totalVoos = 0;
        let voosComMilhas = 0;
        let voosComPontos = [];
        
        data.Data.forEach((item, index) => {
            console.log(`\n📋 Analisando item ${index + 1}:`);
            console.log('  Propriedades:', Object.keys(item));
            
            // Verificar todas as propriedades que podem conter voos
            const possibleFlightArrays = ['Voos', 'Ida', 'Volta', 'Flights', 'Results'];
            let voosArray = null;
            
            for (const prop of possibleFlightArrays) {
                if (item[prop] && Array.isArray(item[prop])) {
                    voosArray = item[prop];
                    console.log(`  ✈️ ${voosArray.length} voo(s) encontrado(s) em '${prop}'`);
                    break;
                }
            }
            
            if (voosArray) {
                totalVoos += voosArray.length;
                
                voosArray.forEach((voo, vooIndex) => {
                    console.log(`\n    🛫 Voo ${vooIndex + 1}:`);
                    
                    // Analisar todos os campos do voo
                    const campos = Object.keys(voo);
                    console.log(`    📝 Campos disponíveis: ${campos.join(', ')}`);
                    
                    // Verificar campos específicos de milhas/pontos
                    const camposMilhas = campos.filter(campo => 
                        campo.toLowerCase().includes('ponto') || 
                        campo.toLowerCase().includes('mile') || 
                        campo.toLowerCase().includes('award') ||
                        campo.toLowerCase().includes('redemption')
                    );
                    
                    if (camposMilhas.length > 0) {
                        console.log(`    🎯 Campos relacionados a milhas: ${camposMilhas.join(', ')}`);
                        camposMilhas.forEach(campo => {
                            console.log(`      ${campo}: ${voo[campo]}`);
                        });
                    }
                    
                    // Verificar PontosAdulto especificamente
                    if (voo.hasOwnProperty('PontosAdulto')) {
                        console.log(`    💰 PontosAdulto: ${voo.PontosAdulto}`);
                        if (voo.PontosAdulto > 0) {
                            console.log(`    ✅ VOO EM MILHAS ENCONTRADO! (${voo.PontosAdulto} pontos)`);
                            voosComMilhas++;
                            voosComPontos.push({
                                numero: voo.Numero,
                                pontos: voo.PontosAdulto,
                                preco: voo.Preco,
                                horario: voo.Horario
                            });
                        } else {
                            console.log(`    💸 Voo pago (${voo.Preco || 'N/A'})`);
                        }
                    }
                    
                    // Mostrar dados básicos do voo
                    console.log(`    ✈️ Número: ${voo.Numero || 'N/A'}`);
                    console.log(`    🏢 Companhia: ${voo.Companhia || 'N/A'}`);
                    console.log(`    💵 Preço: R$ ${voo.Preco || 'N/A'}`);
                    console.log(`    ⏰ Horário: ${voo.Horario || 'N/A'}`);
                    console.log(`    🕒 Duração: ${voo.Duracao || 'N/A'}`);
                });
            }
        });
        
        // Resumo final
        console.log('\n📊 RESUMO FINAL:');
        console.log(`✈️ Total de voos analisados: ${totalVoos}`);
        console.log(`🎯 Voos em milhas encontrados: ${voosComMilhas}`);
        console.log(`💸 Voos pagos: ${totalVoos - voosComMilhas}`);
        
        if (voosComMilhas > 0) {
            console.log('\n🎉 RESPOSTA: SIM! A API retorna voos em milhas!');
            console.log('✅ Voos em milhas encontrados:');
            voosComPontos.forEach((voo, index) => {
                console.log(`  ${index + 1}. ${voo.numero} - ${voo.pontos} pontos`);
            });
        } else {
            console.log('\n❌ RESPOSTA: Não foram encontrados voos em milhas nesta consulta');
            console.log('💡 Possíveis razões:');
            console.log('  - Não há voos em milhas disponíveis para esta rota/data');
            console.log('  - Voos em milhas podem aparecer em outras consultas');
            console.log('  - Pode precisar de parâmetros específicos para milhas');
        }
        
    } else {
        console.log('❌ Nenhum dado de voos encontrado na resposta');
        console.log('🔍 Estrutura completa da resposta:');
        console.log(JSON.stringify(data, null, 2));
    }
}

// Função principal
async function testMoblixAPI() {
    console.log('🔐 TESTE COMPLETO DA API MOBLIX COM AUTENTICAÇÃO');
    console.log('===============================================');
    
    try {
        // Passo 1: Obter token
        console.log('📡 Passo 1: Obtendo token de autenticação...');
        const tokenResponse = await getAuthToken();
        console.log('✅ Token obtido com sucesso!');
        console.log('📝 Tipo de token:', tokenResponse.token_type);
        console.log('⏰ Expira em:', tokenResponse.expires_in, 'segundos');
        
        // Passo 2: Buscar voos
        console.log('\n📡 Passo 2: Buscando voos (BSB → GRU, 2025-03-10)...');
        const flightResponse = await searchFlights(tokenResponse.access_token);
        
        console.log('📊 Status da resposta:', flightResponse.statusCode);
        
        if (flightResponse.statusCode === 200) {
            console.log('✅ Voos encontrados com sucesso!');
            analyzeFlightData(flightResponse.data);
        } else {
            console.log('❌ Erro ao buscar voos:', flightResponse.statusCode);
            console.log('Resposta:', flightResponse.data);
        }
        
    } catch (error) {
        console.error('❌ Erro no teste:', error.message);
    }
}

// Executar teste
testMoblixAPI();
