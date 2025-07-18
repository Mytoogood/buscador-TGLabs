import axios from 'axios';

// Configuração da API Moblix
const API_BASE_URL = 'https://api.moblix.com.br';
const CREDENTIALS = {
  username: 'TooGood',
  password: '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7'
};

// Armazena o token de acesso
let accessToken = null;

// Companhias aéreas disponíveis
const COMPANHIAS = {
  '-1': 'Todas',
  '1': 'LATAM',
  '2': 'GOL',
  '3': 'AZUL',
  '11': 'TAP',
  '13': 'COPA',
  '22': 'AMERICAN',
  '26': 'IBERIA',
  '34': 'LIVELO'
};

// Destinos na Espanha
const DESTINOS_ESPANHA = {
  'MAD': 'Madrid-Barajas',
  'BCN': 'Barcelona-El Prat',
  'AGP': 'Málaga-Costa del Sol',
  'SVQ': 'Sevilla',
  'VLC': 'Valencia',
  'BIO': 'Bilbao'
};

/**
 * Obtém um token de acesso da API Moblix
 */
async function obterToken() {
  try {
    console.log('🔑 Obtendo token de acesso...');
    
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('username', CREDENTIALS.username);
    params.append('password', CREDENTIALS.password);

    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/api/Token`,
      data: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Origin': 'externo'
      },
      timeout: 15000
    });

    if (response.data && response.data.access_token) {
      accessToken = response.data.access_token;
      console.log('✅ Token obtido com sucesso!');
      return accessToken;
    }

    throw new Error('Token não encontrado na resposta');
  } catch (error) {
    console.error('❌ Erro ao obter token:', error.message);
    throw error;
  }
}

/**
 * Busca voos na API Moblix
 */
async function buscarVoos(parametros) {
  try {
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/api/ConsultaAereo/Consultar`,
      data: parametros,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      timeout: 30000
    });

    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao buscar voos ${parametros.Origem} → ${parametros.Destino}:`, error.message);
    return null;
  }
}

/**
 * Extrai voos dos resultados da API
 */
function extrairVoos(resultados) {
  let todosVoos = [];
  
  if (resultados && resultados.Data && Array.isArray(resultados.Data)) {
    resultados.Data.forEach(dataItem => {
      if (dataItem.Ida && Array.isArray(dataItem.Ida)) {
        todosVoos.push(...dataItem.Ida);
      }
      if (dataItem.flights && Array.isArray(dataItem.flights)) {
        todosVoos.push(...dataItem.flights);
      }
    });
  }
  
  return todosVoos;
}

/**
 * Encontra o voo mais barato
 */
function encontrarVooMaisBarato(voos) {
  let vooMaisBarato = null;
  let menorPreco = Infinity;
  
  voos.forEach(voo => {
    let precoVoo = null;
    
    // Tenta diferentes campos de preço
    if (typeof voo.PrecoAdulto === 'number' && voo.PrecoAdulto > 0) {
      precoVoo = voo.PrecoAdulto;
    } else if (typeof voo.Price === 'number' && voo.Price > 0) {
      precoVoo = voo.Price;
    } else if (typeof voo.TotalPrice === 'number' && voo.TotalPrice > 0) {
      precoVoo = voo.TotalPrice;
    } else if (voo.segments && Array.isArray(voo.segments)) {
      const segmentoComPreco = voo.segments.find(seg => 
        typeof seg.PrecoAdulto === 'number' && seg.PrecoAdulto > 0
      );
      if (segmentoComPreco) {
        precoVoo = segmentoComPreco.PrecoAdulto;
      }
    }
    
    if (precoVoo && precoVoo < menorPreco) {
      menorPreco = precoVoo;
      vooMaisBarato = voo;
    }
  });
  
  return { vooMaisBarato, menorPreco };
}

/**
 * Função principal para buscar voos
 */
async function buscarVoosEspanha() {
  try {
    console.log('🔍 BUSCA DE VOOS GRU → ESPANHA');
    console.log('===============================');
    console.log('📅 Data: 15/08/2025');
    console.log('👥 Passageiros: 1 adulto');
    console.log('🎯 Objetivo: Encontrar o voo mais barato');
    console.log('🌍 Destino: Espanha (vários aeroportos)');
    console.log('');

    // Obter token
    await obterToken();

    const resultadosGerais = [];
    
    // Testa diferentes destinos na Espanha
    for (const [codigoDestino, nomeDestino] of Object.entries(DESTINOS_ESPANHA)) {
      console.log(`\n🏙️ Testando destino: ${nomeDestino} (${codigoDestino})`);
      console.log('─'.repeat(50));
      
      // Testa diferentes companhias para cada destino
      for (const [codigoCompanhia, nomeCompanhia] of Object.entries(COMPANHIAS)) {
        // Pula algumas companhias que sabemos que não têm permissão
        if (codigoCompanhia === '11') { // TAP
          continue;
        }
        
        console.log(`  ✈️  Testando: ${nomeCompanhia}`);
        
        const parametros = {
          Origem: 'GRU',
          Destino: codigoDestino,
          Ida: '2025-08-15',
          Adultos: 1,
          Criancas: 0,
          Bebes: 0,
          Companhia: parseInt(codigoCompanhia)
        };
        
        const resultados = await buscarVoos(parametros);
        
        if (resultados && resultados.Success) {
          const voos = extrairVoos(resultados);
          
          if (voos.length > 0) {
            console.log(`      ✅ ${voos.length} voos encontrados!`);
            
            const { vooMaisBarato, menorPreco } = encontrarVooMaisBarato(voos);
            
            if (vooMaisBarato) {
              resultadosGerais.push({
                destino: nomeDestino,
                codigoDestino: codigoDestino,
                companhia: nomeCompanhia,
                codigoCompanhia: codigoCompanhia,
                voo: vooMaisBarato,
                preco: menorPreco,
                totalVoos: voos.length
              });
              
              console.log(`      💰 Menor preço: R$ ${menorPreco.toFixed(2)}`);
            } else {
              console.log(`      ⚠️  Voos encontrados mas sem preços válidos`);
            }
          } else {
            console.log(`      ❌ Nenhum voo encontrado`);
          }
        } else {
          console.log(`      ❌ Erro na busca ou sem resultados`);
        }
        
        // Pausa pequena entre requisições
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    // Mostra os resultados finais
    console.log('\n🏆 RESULTADOS FINAIS');
    console.log('===================');
    
    if (resultadosGerais.length === 0) {
      console.log('❌ Nenhum voo encontrado para a Espanha na data solicitada');
      console.log('💡 Possíveis motivos:');
      console.log('   - Data muito no futuro (15/08/2025)');
      console.log('   - Rotas não disponíveis nas companhias testadas');
      console.log('   - Necessário testar outras datas próximas');
      console.log('   - Alguns voos podem precisar de conexões');
      return;
    }
    
    // Ordena por preço
    resultadosGerais.sort((a, b) => a.preco - b.preco);
    
    console.log(`\n📊 Encontrados ${resultadosGerais.length} voos com preços válidos:\n`);
    
    resultadosGerais.forEach((resultado, index) => {
      console.log(`${index + 1}. ${resultado.destino} - ${resultado.companhia}`);
      console.log(`   💰 Preço: R$ ${resultado.preco.toFixed(2)}`);
      console.log(`   🎫 Total de voos: ${resultado.totalVoos}`);
      console.log('');
    });
    
    // Mostra o mais barato
    const maisBarato = resultadosGerais[0];
    console.log('🥇 VOO MAIS BARATO:');
    console.log('==================');
    console.log(`🏙️ Destino: ${maisBarato.destino} (${maisBarato.codigoDestino})`);
    console.log(`✈️ Companhia: ${maisBarato.companhia}`);
    console.log(`💰 Preço: R$ ${maisBarato.preco.toFixed(2)}`);
    console.log(`🎫 Total de opções: ${maisBarato.totalVoos}`);
    
    // Mostra detalhes do voo mais barato
    if (maisBarato.voo.segments && maisBarato.voo.segments.length > 0) {
      console.log('\n📋 Detalhes do voo:');
      const segmento = maisBarato.voo.segments[0];
      console.log(`🛫 Voo: ${segmento.NumeroVoo || segmento.FlightNumber || 'N/A'}`);
      console.log(`📍 Rota: ${segmento.Origem || 'N/A'} → ${segmento.Destino || 'N/A'}`);
      
      if (segmento.DataSaida) {
        console.log(`🕐 Saída: ${segmento.DataSaida}`);
      }
      if (segmento.DataChegada) {
        console.log(`🕑 Chegada: ${segmento.DataChegada}`);
      }
    }
    
  } catch (error) {
    console.error('\n💥 Erro durante a busca:', error.message);
  }
}

// Executar a busca
console.log('🚀 Iniciando busca de voos para a Espanha...\n');
buscarVoosEspanha();
