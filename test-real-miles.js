// Script para testar a API da Moblix para buscas reais de milhas
async function testRealMiles() {
    console.log('🔍 TESTANDO API MOBLIX PARA VOOS EM MILHAS REAIS...');
    
    const options = {
        hostname: 'api.moblix.com.br',
        port: 443,
        path: '/api/ConsultaAereo/Consultar',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Origin': 'https://localhost',
            'Referer': 'https://localhost'
        }
    };

    const postData = JSON.stringify({
        Origem: 'SAO',
        Destino: 'RIO',
        Ida: '2025-07-09',
        Adultos: 1,
        Criancas: 0,
        Bebes: 0,
        Companhia: 1, // Latam
        tipoBusca: 'milhas',
        pontos: true,
        programaFidelidade: true
    });
    
    try {
        const request = require('https').request;
        request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const response = JSON.parse(data);
                console.log('📊 Dados recebidos da API:');
                console.dir(response, { depth: null });
            });

        }).on('error', (e) => {
            console.error(`❌ Erro: ${e.message}`);
        }).end(postData);
    } catch (error) {
        console.error('❌ Erro ao executar teste:', error.message);
    }
}

// Executando Teste
testRealMiles();
