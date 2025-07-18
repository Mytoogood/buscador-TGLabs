import axios from 'axios';

// Configuração da API Moblix
const API_BASE_URL = 'https://api.moblix.com.br';
const CREDENTIALS = {
  username: 'TooGood',
  password: '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7'
};

// Armazena o token de acesso
let accessToken = null;

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
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
    }
    throw error;
  }
}

/**
 * Busca voos na API Moblix
 */
async function buscarVoos(parametros) {
  try {
    console.log(`🔍 Buscando voos: ${parametros.Origem} → ${parametros.Destino}`);
    console.log(`📅 Data: ${parametros.Ida}`);
    console.log(`👥 Passageiros: ${parametros.Adultos} adulto(s)`);
    
    if (parametros.Companhia && parametros.Companhia !== -1) {
      const companhias = {
        1: 'LATAM',
        2: 'GOL', 
        3: 'AZUL',
        11: 'TAP',
        13: 'COPA',
        22: 'AMERICAN',
        26: 'IBERIA',
        34: 'LIVELO'
      };
      console.log(`✈️ Companhia: ${companhias[parametros.Companhia] || parametros.Companhia}`);
    } else {
      console.log(`✈️ Companhia: Todas`);
    }

    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/api/ConsultaAereo/Consultar`,
      data: parametros,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      timeout: 60000 // 60 segundos para busca de voos
    });

    return response.data;
  } catch (error) {
    console.error('❌ Erro ao buscar voos:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
    }
    throw error;
  }
}

/**
 * Encontra o voo mais barato entre os resultados
 */
function encontrarVooMaisBarato(resultados) {
  console.log('💰 Analisando preços dos voos encontrados...');
  
  let vooMaisBarato = null;
  let menorPreco = Infinity;
  let todosVoos = [];

  // Extrai todos os voos dos resultados
  if (resultados.Data && Array.isArray(resultados.Data)) {
    resultados.Data.forEach(dataItem => {
      if (dataItem.flights && Array.isArray(dataItem.flights)) {
        todosVoos.push(...dataItem.flights);
      } else if (dataItem.Ida && Array.isArray(dataItem.Ida)) {
        todosVoos.push(...dataItem.Ida);
      }
    });
  }

  console.log(`📊 Total de voos encontrados: ${todosVoos.length}`);

  // Encontra o voo mais barato
  todosVoos.forEach((voo, index) => {
    let precoVoo = null;
    
    // Tenta diferentes campos de preço
    if (typeof voo.PrecoAdulto === 'number' && voo.PrecoAdulto > 0) {
      precoVoo = voo.PrecoAdulto;
    } else if (typeof voo.Price === 'number' && voo.Price > 0) {
      precoVoo = voo.Price;
    } else if (typeof voo.TotalPrice === 'number' && voo.TotalPrice > 0) {
      precoVoo = voo.TotalPrice;
    } else if (voo.segments && Array.isArray(voo.segments)) {
      // Procura preço nos segmentos
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
      console.log(`💸 Novo voo mais barato encontrado: R$ ${precoVoo.toFixed(2)} (Voo #${index + 1})`);
    }
  });

  return { vooMaisBarato, menorPreco, totalVoos: todosVoos.length };
}

/**
 * Exibe detalhes do voo
 */
function exibirDetalhesVoo(voo, preco) {
  console.log('\n🎯 VOOS MAIS BARATO ENCONTRADO:');
  console.log('================================');
  console.log(`💰 Preço: R$ ${preco.toFixed(2)}`);
  
  // Companhia aérea
  if (voo.segments && voo.segments.length > 0) {
    const primeiroSegmento = voo.segments[0];
    console.log(`✈️ Companhia: ${primeiroSegmento.CompanhiaAerea || primeiroSegmento.Airline || 'Não informado'}`);
    console.log(`🛫 Voo: ${primeiroSegmento.NumeroVoo || primeiroSegmento.FlightNumber || 'Não informado'}`);
    console.log(`📍 Rota: ${primeiroSegmento.Origem || 'N/A'} → ${primeiroSegmento.Destino || 'N/A'}`);
    
    if (primeiroSegmento.DataSaida) {
      console.log(`🕐 Saída: ${primeiroSegmento.DataSaida}`);
    }
    if (primeiroSegmento.DataChegada) {
      console.log(`🕑 Chegada: ${primeiroSegmento.DataChegada}`);
    }
  }
  
  // Mostra informações adicionais se disponíveis
  if (voo.Duration) {
    console.log(`⏱️ Duração: ${voo.Duration}`);
  }
  if (voo.Stops !== undefined) {
    console.log(`🔄 Conexões: ${voo.Stops}`);
  }
  
  console.log('\n📋 Estrutura completa do voo:');
  console.log(JSON.stringify(voo, null, 2));
}

/**
 * Função principal para buscar voos
 */
async function buscarVooGruEsp() {
  try {
    console.log('🔍 BUSCA DE VOOS GRU → MAD (ESPANHA)');
    console.log('====================================');
    console.log('📅 Data: 15/08/2025');
    console.log('👥 Passageiros: 1 adulto');
    console.log('🎯 Objetivo: Encontrar o voo mais barato');
    console.log('🌍 Destino: Madrid, Espanha');
    console.log('');

    // Passo 1: Obter token de acesso
    await obterToken();

    // Passo 2: Configurar parâmetros de busca
    const parametrosBusca = {
      Origem: 'GRU',
      Destino: 'MAD', // MAD é o código IATA para Madrid-Barajas, Espanha
      Ida: '2025-08-15',
      Adultos: 1,
      Criancas: 0,
      Bebes: 0,
      Companhia: -1, // Todas as companhias
      internacional: true // Marca como voo internacional
    };

    // Passo 3: Buscar voos
    console.log('🔄 Iniciando busca de voos...\n');
    const resultados = await buscarVoos(parametrosBusca);

    // Passo 4: Verificar se encontrou voos
    if (!resultados || !resultados.Data || resultados.Data.length === 0) {
      console.log('❌ Nenhum voo encontrado para os parâmetros especificados');
      console.log('💡 Possíveis motivos:');
      console.log('   - Código ESP pode não ser válido (verifique o código do aeroporto)');
      console.log('   - Não há voos disponíveis para esta data');
      console.log('   - Rota não é operada pelas companhias aéreas');
      return;
    }

    // Passo 5: Encontrar o voo mais barato
    const { vooMaisBarato, menorPreco, totalVoos } = encontrarVooMaisBarato(resultados);

    if (!vooMaisBarato) {
      console.log('❌ Não foi possível encontrar preços nos voos retornados');
      console.log('📊 Estrutura dos resultados:');
      console.log(JSON.stringify(resultados, null, 2));
      return;
    }

    // Passo 6: Exibir resultado
    exibirDetalhesVoo(vooMaisBarato, menorPreco);

    console.log(`\n✅ Busca concluída! Foram analisados ${totalVoos} voos`);
    console.log(`🏆 Voo mais barato: R$ ${menorPreco.toFixed(2)}`);

  } catch (error) {
    console.error('\n💥 Erro durante a busca:', error.message);
    
    // Sugestões de troubleshooting
    console.log('\n🔧 Possíveis soluções:');
    console.log('1. Verifique se o código ESP é válido para o aeroporto do Espírito Santo');
    console.log('2. Tente outros códigos como VIX (Vitória) se for o destino desejado');
    console.log('3. Verifique sua conexão com a internet');
    console.log('4. Confirme se as credenciais da API estão corretas');
  }
}

// Executar a busca
console.log('🚀 Iniciando busca de voos...\n');
buscarVooGruEsp();
