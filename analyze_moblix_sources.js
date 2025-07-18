import axios from 'axios';
import fs from 'fs';

// Configuração da API Moblix
const MOBLIX_API_URL = 'https://api.moblix.com.br/api/ConsultaAereo/Consultar';
const TOKEN_URL = 'https://api.moblix.com.br/api/Token';

// Credenciais da API Moblix (do .env.local)
const credentials = {
    usuario: 'TooGood',
    senha: '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7'
};

// Gerar datas dinâmicas (próximos 30-60 dias)
const today = new Date();
const departureDate = new Date(today);
departureDate.setDate(today.getDate() + 30); // 30 dias no futuro
const returnDate = new Date(departureDate);
returnDate.setDate(departureDate.getDate() + 7); // 7 dias após a ida

// Formatar datas no formato YYYY-MM-DD
const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

// Parâmetros de exemplo para busca de voos
const flightSearchParams = {
    Origem: 'CGH',
    Destino: 'GIG',
    Ida: formatDate(departureDate),
    Volta: formatDate(returnDate),
    Adultos: 1,
    Criancas: 0,
    Bebes: 0,
    Companhia: '' // Empty string to search all companies
};

async function getAuthToken() {
    try {
        console.log('🔐 Obtendo token de autenticação...');
        
        // Usar URLSearchParams para enviar dados como form-urlencoded
        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('username', credentials.usuario);
        params.append('password', credentials.senha);
        
        const response = await axios.post(TOKEN_URL, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Origin': 'externo'
            }
        });
        
        if (response.data && response.data.access_token) {
            console.log('✅ Token obtido com sucesso');
            return response.data.access_token;
        } else {
            throw new Error('Token não encontrado na resposta');
        }
    } catch (error) {
        console.error('❌ Erro ao obter token:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Response:', error.response.data);
        }
        throw error;
    }
}

async function searchFlights(token) {
    try {
        console.log('🔍 Buscando voos...');
        const response = await axios.post(MOBLIX_API_URL, flightSearchParams, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('❌ Erro ao buscar voos:', error.message);
        throw error;
    }
}

function analyzeDataSources(flightData) {
    console.log('\n📊 ANÁLISE DAS FONTES DE DADOS');
    console.log('================================');
    
    // Estrutura básica da resposta
    console.log('🔍 Estrutura da resposta:');
    console.log('- Voos encontrados:', flightData.voos ? flightData.voos.length : 0);
    console.log('- Companhias identificadas:', new Set(
        flightData.voos?.map(voo => voo.companhia) || []
    ).size);
    
    // Análise detalhada de cada voo
    if (flightData.voos && flightData.voos.length > 0) {
        console.log('\n📋 DETALHES DOS VOOS POR FONTE:');
        
        flightData.voos.forEach((voo, index) => {
            console.log(`\n--- Voo ${index + 1} ---`);
            console.log(`Companhia: ${voo.companhia || 'N/A'}`);
            console.log(`Preço: R$ ${voo.preco || 'N/A'}`);
            console.log(`Horário: ${voo.horarioSaida || 'N/A'} - ${voo.horarioChegada || 'N/A'}`);
            
            // Procurar por indicadores de fonte
            const possibleSources = [];
            
            // Verificar se há URLs de booking
            if (voo.urlReserva) {
                console.log(`URL de Reserva: ${voo.urlReserva}`);
                possibleSources.push(extractSourceFromURL(voo.urlReserva));
            }
            
            if (voo.deepLink) {
                console.log(`Deep Link: ${voo.deepLink}`);
                possibleSources.push(extractSourceFromURL(voo.deepLink));
            }
            
            // Verificar outros campos que possam indicar a fonte
            if (voo.fornecedor) {
                console.log(`Fornecedor: ${voo.fornecedor}`);
                possibleSources.push(voo.fornecedor);
            }
            
            if (voo.fonte) {
                console.log(`Fonte: ${voo.fonte}`);
                possibleSources.push(voo.fonte);
            }
            
            // Analisar códigos de identificação
            if (voo.codigoReserva) {
                console.log(`Código de Reserva: ${voo.codigoReserva}`);
            }
            
            if (voo.validatingCarrier) {
                console.log(`Validating Carrier: ${voo.validatingCarrier}`);
            }
            
            // Resumo das fontes identificadas
            const uniqueSources = [...new Set(possibleSources.filter(Boolean))];
            if (uniqueSources.length > 0) {
                console.log(`🎯 Fontes identificadas: ${uniqueSources.join(', ')}`);
            } else {
                console.log('🔍 Fonte não identificada explicitamente');
            }
            
            // Verificar se é direto da companhia ou de consolidador
            analyzeSourceType(voo);
        });
        
        // Resumo geral
        console.log('\n📈 RESUMO GERAL DAS FONTES:');
        const allSources = new Set();
        const allCarriers = new Set();
        
        flightData.voos.forEach(voo => {
            if (voo.companhia) allCarriers.add(voo.companhia);
            if (voo.fornecedor) allSources.add(voo.fornecedor);
            if (voo.fonte) allSources.add(voo.fonte);
        });
        
        console.log(`Companhias: ${Array.from(allCarriers).join(', ')}`);
        console.log(`Fontes de dados: ${Array.from(allSources).join(', ')}`);
    }
}

function extractSourceFromURL(url) {
    if (!url) return null;
    
    try {
        const domain = new URL(url).hostname.toLowerCase();
        
        // Mapear domínios conhecidos para fontes
        const sourceMap = {
            'latam.com': 'LATAM Direct',
            'voegol.com.br': 'GOL Direct',
            'voeazul.com.br': 'AZUL Direct',
            'avianca.com': 'Avianca Direct',
            'decolar.com': 'Decolar OTA',
            'expedia.com': 'Expedia OTA',
            'booking.com': 'Booking.com OTA',
            'kiwi.com': 'Kiwi.com OTA',
            'momondo.com': 'Momondo OTA',
            'kayak.com': 'Kayak OTA',
            'google.com': 'Google Flights'
        };
        
        for (const [domainPattern, source] of Object.entries(sourceMap)) {
            if (domain.includes(domainPattern)) {
                return source;
            }
        }
        
        return domain; // Retorna o domínio se não encontrar mapeamento
    } catch (error) {
        return null;
    }
}

function analyzeSourceType(voo) {
    // Heurísticas para determinar se é direto da companhia ou consolidador
    const indicators = {
        direct: [],
        consolidator: [],
        gds: []
    };
    
    // Verificar se tem características de venda direta
    if (voo.urlReserva && voo.urlReserva.includes(voo.companhia?.toLowerCase())) {
        indicators.direct.push('URL contém nome da companhia');
    }
    
    // Verificar se tem características de consolidador
    if (voo.tipoTarifa && voo.tipoTarifa.includes('consolidada')) {
        indicators.consolidator.push('Tarifa consolidada');
    }
    
    // Verificar códigos GDS
    if (voo.pnr || voo.recordLocator) {
        indicators.gds.push('Tem PNR/Record Locator');
    }
    
    // Imprimir análise
    console.log('🔍 Análise do tipo de fonte:');
    if (indicators.direct.length > 0) {
        console.log(`   ✈️  Direto: ${indicators.direct.join(', ')}`);
    }
    if (indicators.consolidator.length > 0) {
        console.log(`   🏢 Consolidador: ${indicators.consolidator.join(', ')}`);
    }
    if (indicators.gds.length > 0) {
        console.log(`   🌐 GDS: ${indicators.gds.join(', ')}`);
    }
}

async function main() {
    try {
        console.log('🚀 INICIANDO ANÁLISE DAS FONTES DE DADOS MOBLIX');
        console.log('===============================================\n');
        
        // Passo 1: Obter token
        const token = await getAuthToken();
        
        // Passo 2: Buscar voos
        const flightData = await searchFlights(token);
        
        // Passo 3: Analisar fontes
        analyzeDataSources(flightData);
        
        // Passo 4: Salvar dados brutos para análise adicional
fs.writeFileSync('moblix_flight_data.json', JSON.stringify(flightData, null, 2));
        console.log('\n💾 Dados salvos em moblix_flight_data.json para análise adicional');
        
    } catch (error) {
        console.error('❌ Erro durante a análise:', error.message);
        process.exit(1);
    }
}

// Executar o script
main();
