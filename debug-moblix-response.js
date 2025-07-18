import axios from 'axios';

const API_BASE_URL = 'https://api.moblix.com.br';

// Configuração das credenciais e endpoint
const AUTH_CREDENTIALS = {
    username: 'TooGood',
    password: '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7'
};

async function getToken() {
    try {
        console.log('🔑 Obtendo token de autenticação...');
        const formData = new URLSearchParams();
        formData.append('grant_type', 'password');
        formData.append('username', AUTH_CREDENTIALS.username);
        formData.append('password', AUTH_CREDENTIALS.password);

        const response = await axios({
            method: 'post',
            url: `${API_BASE_URL}/api/Token`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Origin': 'externo'
            },
            data: formData
        });
        
        console.log('✅ Token obtido com sucesso!');
        return response.data;
    } catch (error) {
        console.error('❌ Erro ao obter token:', error.response?.data || error.message);
        return null;
    }
}

async function fetchFlights(token) {
    try {
        console.log('✈️ Buscando voos BSB → GRU...');
        const requestData = {
            Origem: 'BSB',
            Destino: 'GRU',
            Ida: '2025-07-15', // Data futura válida
            Adultos: 1,
            Criancas: 0,
            Bebes: 0,
            Companhia: -1 // Todas as companhias
        };

        console.log('📡 Enviando requisição para API:', requestData);
        
        const response = await axios({
            method: 'post',
            url: `${API_BASE_URL}/api/ConsultaAereo/Consultar`,
            data: requestData,
            headers: {
                'Authorization': `Bearer ${token.access_token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        console.log('✅ Resposta recebida com sucesso!');
        console.log('📊 Resposta completa:', JSON.stringify(response.data, null, 2));
        
        return response.data;
    } catch (error) {
        console.error('❌ Erro ao buscar voos:', error.response?.data || error.message);
        return null;
    }
}

async function testSpecificCompanies(token) {
    console.log('\n🎯 Testando companhias específicas...');
    
    const companies = [
        { id: 1, name: 'LATAM' },
        { id: 2, name: 'GOL' },
        { id: 3, name: 'Azul' },
        { id: 11, name: 'TAP Air Portugal' },
        { id: 13, name: 'Copa Airlines' },
        { id: 22, name: 'American Airlines' },
        { id: 26, name: 'Iberia' },
        { id: 34, name: 'Livelo' },
        { id: 1200, name: 'Azul Interline' },
        { id: 4, name: 'Avianca' },
        { id: 5, name: 'United Airlines' },
        { id: 6, name: 'Delta Air Lines' },
        { id: 7, name: 'Air France' },
        { id: 8, name: 'KLM' },
        { id: 9, name: 'Lufthansa' },
        { id: 10, name: 'British Airways' },
        { id: 12, name: 'Air Europa' },
        { id: 14, name: 'Alitalia' },
        { id: 15, name: 'Swiss' },
        { id: 16, name: 'Turkish Airlines' },
        { id: 17, name: 'Emirates' },
        { id: 18, name: 'Qatar Airways' },
        { id: 19, name: 'Etihad Airways' },
        { id: 20, name: 'Singapore Airlines' },
        { id: 21, name: 'Cathay Pacific' },
        { id: 23, name: 'Air Canada' },
        { id: 24, name: 'JetBlue' },
        { id: 25, name: 'Alaska Airlines' },
        { id: 27, name: 'Virgin Atlantic' },
        { id: 28, name: 'Finnair' },
        { id: 29, name: 'SAS' },
        { id: 30, name: 'Austrian Airlines' },
        { id: 31, name: 'Brussels Airlines' },
        { id: 32, name: 'LOT Polish Airlines' },
        { id: 33, name: 'Czech Airlines' }
    ];
    
    for (const company of companies) {
        console.log(`\n🔍 Testando ${company.name} (ID: ${company.id})...`);
        
        const requestData = {
            Origem: 'BSB',
            Destino: 'GRU',
            Ida: '2025-07-15', // Data futura válida
            Adultos: 1,
            Criancas: 0,
            Bebes: 0,
            Companhia: company.id
        };
        
        try {
            const response = await axios({
                method: 'post',
                url: `${API_BASE_URL}/api/ConsultaAereo/Consultar`,
                data: requestData,
                headers: {
                    'Authorization': `Bearer ${token.access_token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            console.log(`📊 ${company.name} - Success: ${response.data.Success}, HasResult: ${response.data.HasResult}`);
            console.log(`📊 ${company.name} - Data length: ${response.data.Data?.length || 0}`);
            
            if (response.data.Data && response.data.Data.length > 0) {
                console.log(`✅ ${company.name} - Encontrados dados!`);
                console.log(`📋 Primeira entrada:`, JSON.stringify(response.data.Data[0], null, 2));
            } else {
                console.log(`⚠️ ${company.name} - Nenhum dado encontrado`);
                if (response.data.MensagemErro) {
                    console.log(`🚫 ${company.name} - Erro: ${response.data.MensagemErro}`);
                }
            }
        } catch (error) {
            console.error(`❌ ${company.name} - Erro:`, error.response?.data || error.message);
        }
        
        // Pequena pausa entre as requisições
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

(async function main() {
    console.log('🚀 Iniciando debug da API Moblix...\n');
    
    const token = await getToken();
    if (!token) {
        console.log('❌ Não foi possível obter o token. Encerrando...');
        return;
    }
    
    console.log('🔑 Token obtido:', {
        access_token: token.access_token?.substring(0, 50) + '...',
        token_type: token.token_type,
        expires_in: token.expires_in
    });
    
    // Teste geral
    console.log('\n📋 === TESTE GERAL (TODAS AS COMPANHIAS) ===');
    const flightsData = await fetchFlights(token);
    
    // Teste por companhia específica
    console.log('\n📋 === TESTE POR COMPANHIA ESPECÍFICA ===');
    await testSpecificCompanies(token);
    
    console.log('\n✨ Debug concluído!');
})();
