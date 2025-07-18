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
            Ida: '2025-03-10',
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
        console.log('📊 Estrutura da resposta:', {
            hasData: !!response.data?.Data,
            dataLength: response.data?.Data?.length || 0,
            keys: Object.keys(response.data || {})
        });
        
        return response.data;
    } catch (error) {
        console.error('❌ Erro ao buscar voos:', error.response?.data || error.message);
        return null;
    }
}

function filterTop10PerCompany(flights) {
    if (!flights || flights.length === 0) {
        console.log('⚠️ Nenhum voo encontrado para filtrar');
        return [];
    }
    
    console.log(`📊 Filtrando ${flights.length} voos por companhia...`);
    
    const companyGroups = new Map();
    flights.forEach(flight => {
        // Tenta identificar a companhia de várias formas
        const airline = flight.Companhia || 
                       flight.companhia || 
                       flight.validatingBy?.name || 
                       flight.segments?.[0]?.legs?.[0]?.operatedBy?.name || 
                       'Outras';
        
        if (!companyGroups.has(airline)) {
            companyGroups.set(airline, []);
        }
        companyGroups.get(airline).push(flight);
    });

    console.log(`✈️ Companhias encontradas: ${Array.from(companyGroups.keys()).join(', ')}`);
    
    const topFlights = [];
    for (const [airline, airlineFlights] of companyGroups) {
        console.log(`📋 ${airline}: ${airlineFlights.length} voos disponíveis`);
        
        // Ordena por preço (menor primeiro)
        airlineFlights.sort((a, b) => {
            const priceA = a.priceWithTax || a.price || a.totalPrice || 0;
            const priceB = b.priceWithTax || b.price || b.totalPrice || 0;
            return priceA - priceB;
        });
        
        // Pega os 10 melhores de cada companhia
        const top10 = airlineFlights.slice(0, 10);
        topFlights.push(...top10);
        
        console.log(`✅ ${airline}: Selecionados ${top10.length} voos`);
    }
    
    console.log(`✨ Total de voos selecionados: ${topFlights.length}`);
    return topFlights;
}

(async function main() {
    const token = await getToken();
    if (!token) return;
    const flightsData = await fetchFlights(token);
    if (!flightsData || !flightsData.Data || flightsData.Data.length === 0) return console.log('Nenhum voo encontrado.');
    const allFlights = flightsData.Data.map(item => item.flights).flat();
    const topFlights = filterTop10PerCompany(allFlights);
    console.log('Top 10 voos por companhia:', topFlights);
})();

