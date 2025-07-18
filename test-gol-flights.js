import axios from 'axios';

async function searchGolFlights() {
    try {
        console.log('🔍 Buscando voos da GOL...');
        console.log('📍 Origem: SAO → Destino: RIO');
        console.log('📅 Data: 11/07/2025');
        console.log('👥 Passageiros: 1 adulto');
        console.log('✈️ Companhia: GOL (ID: 2)');
        console.log('-----------------------------------');

        const response = await axios.post('https://api.moblix.com.br/api/ConsultaAereo/Consultar', {
            "Origem": "SAO",
            "Destino": "RIO", 
            "Ida": "2025-07-11",
            "Adultos": 1,
            "Criancas": 0,
            "Bebes": 0,
            "Companhia": 2  // GOL ID
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ Resposta da API recebida');
        console.log('📊 Status:', response.status);
        
        if (response.data && response.data.Voos) {
            const flights = response.data.Voos;
            console.log(`🛫 Total de voos encontrados: ${flights.length}`);
            
            // Separar voos por tipo de pagamento
            const milhasFlights = flights.filter(flight => {
                return flight.isMiles || 
                       flight.PontosAdulto > 0 || 
                       flight.flightType === 'milhas' || 
                       flight.flightType === 'award' ||
                       flight.Miles > 0 ||
                       flight.Points > 0;
            });
            
            const dinheiroFlights = flights.filter(flight => {
                return !flight.isMiles && 
                       (!flight.PontosAdulto || flight.PontosAdulto === 0) && 
                       flight.flightType !== 'milhas' && 
                       flight.flightType !== 'award' &&
                       (!flight.Miles || flight.Miles === 0) &&
                       (!flight.Points || flight.Points === 0);
            });

            console.log(`💰 Voos pagos com dinheiro: ${dinheiroFlights.length}`);
            console.log(`🏆 Voos pagos com milhas: ${milhasFlights.length}`);
            console.log('-----------------------------------');

            // Mostrar detalhes dos primeiros voos de cada tipo
            console.log('💰 VOOS PAGOS COM DINHEIRO:');
            dinheiroFlights.slice(0, 10).forEach((flight, index) => {
                console.log(`${index + 1}. ${flight.CodigoVoo || 'N/A'} - R$ ${flight.ValorAdulto || flight.Price || 'N/A'}`);
                console.log(`   Horário: ${flight.HoraSaida || 'N/A'} → ${flight.HoraChegada || 'N/A'}`);
                console.log(`   Duração: ${flight.DuracaoVoo || 'N/A'}`);
                console.log(`   Aeroportos: ${flight.AeroportoOrigem || 'N/A'} → ${flight.AeroportoDestino || 'N/A'}`);
                console.log('   ---');
            });

            console.log('🏆 VOOS PAGOS COM MILHAS:');
            milhasFlights.slice(0, 10).forEach((flight, index) => {
                console.log(`${index + 1}. ${flight.CodigoVoo || 'N/A'} - ${flight.PontosAdulto || flight.Miles || flight.Points || 'N/A'} pontos`);
                console.log(`   Horário: ${flight.HoraSaida || 'N/A'} → ${flight.HoraChegada || 'N/A'}`);
                console.log(`   Duração: ${flight.DuracaoVoo || 'N/A'}`);
                console.log(`   Aeroportos: ${flight.AeroportoOrigem || 'N/A'} → ${flight.AeroportoDestino || 'N/A'}`);
                console.log('   ---');
            });

            // Mostrar estrutura de um voo para debug
            if (flights.length > 0) {
                console.log('🔍 ESTRUTURA DO PRIMEIRO VOO (para debug):');
                console.log(JSON.stringify(flights[0], null, 2));
            }

        } else {
            console.log('❌ Nenhum voo encontrado na resposta');
            console.log('📄 Resposta completa:', JSON.stringify(response.data, null, 2));
        }

    } catch (error) {
        console.error('❌ Erro na busca:', error.message);
        if (error.response) {
            console.error('📄 Resposta de erro:', error.response.data);
            console.error('📊 Status de erro:', error.response.status);
        }
    }
}

// Executar a busca
searchGolFlights();
