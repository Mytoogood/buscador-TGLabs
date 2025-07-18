import axios from 'axios';

// Configuração da API Moblix
const API_BASE_URL = 'https://api.moblix.com.br';
const CREDENTIALS = {
  username: 'TooGood',
  password: '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7'
};

let accessToken = null;

// Destinos na Espanha
const DESTINOS_ESPANHA = {
  'MAD': 'Madrid-Barajas',
  'BCN': 'Barcelona-El Prat',
  'AGP': 'Málaga-Costa del Sol',
  'SVQ': 'Sevilla',
  'VLC': 'Valencia',
  'BIO': 'Bilbao'
};

// Companhias com bons resultados
const COMPANHIAS_PRIORITARIAS = {
  '1': 'LATAM',
  '2': 'GOL',
  '34': 'LIVELO'
};

/**
 * Obtém token de acesso
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
    throw new Error('Token não encontrado');
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
      timeout: 45000
    });

    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao buscar voos ${parametros.Origem} → ${parametros.Destino}:`, error.message);
    return null;
  }
}

/**
 * Extrai voos dos resultados e analisa preços
 */
function analisarVoos(resultados) {
  let todosVoos = [];
  
  if (resultados && resultados.Data && Array.isArray(resultados.Data)) {
    resultados.Data.forEach(dataItem => {
      if (dataItem.Ida && Array.isArray(dataItem.Ida)) {
        todosVoos.push(...dataItem.Ida);
      }
    });
  }
  
  // Adiciona informações de preço para cada voo
  const voosComPrecos = todosVoos.map(voo => ({
    ...voo,
    precoFinal: voo.ValorTotalComTaxa || voo.ValorTotal || voo.ValorAdulto || 0,
    precoBase: voo.ValorAdulto || voo.ValorTotal || 0,
    taxas: voo.ValorTotalTaxas || 0
  })).filter(voo => voo.precoFinal > 0);
  
  return voosComPrecos;
}

/**
 * Busca voos mais baratos para a Espanha
 */
async function buscarVooMaisBarato() {
  try {
    console.log('🔍 BUSCA DO VOO MAIS BARATO: GRU → ESPANHA');
    console.log('==========================================');
    console.log('📅 Data: 15/08/2025');
    console.log('👥 Passageiros: 1 adulto');
    console.log('🎯 Objetivo: Encontrar o voo mais barato');
    console.log('🌍 Testando múltiplos destinos na Espanha');
    console.log('');

    await obterToken();

    const resultadosGerais = [];
    
    // Testa os destinos principais
    for (const [codigoDestino, nomeDestino] of Object.entries(DESTINOS_ESPANHA)) {
      console.log(`\n🏙️ Analisando: ${nomeDestino} (${codigoDestino})`);
      console.log('─'.repeat(60));
      
      // Testa as companhias que sabemos que funcionam
      for (const [codigoCompanhia, nomeCompanhia] of Object.entries(COMPANHIAS_PRIORITARIAS)) {
        console.log(`  ✈️  ${nomeCompanhia}...`);
        
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
          const voos = analisarVoos(resultados);
          
          if (voos.length > 0) {
            // Encontra o voo mais barato desta companhia/destino
            const vooMaisBarato = voos.reduce((anterior, atual) => 
              atual.precoFinal < anterior.precoFinal ? atual : anterior
            );
            
            resultadosGerais.push({
              destino: nomeDestino,
              codigoDestino: codigoDestino,
              companhia: nomeCompanhia,
              codigoCompanhia: codigoCompanhia,
              voo: vooMaisBarato,
              precoFinal: vooMaisBarato.precoFinal,
              precoBase: vooMaisBarato.precoBase,
              taxas: vooMaisBarato.taxas,
              totalVoos: voos.length
            });
            
            console.log(`      ✅ ${voos.length} voos encontrados`);
            console.log(`      💰 Menor preço: R$ ${vooMaisBarato.precoFinal.toFixed(2)}`);
            console.log(`         (Base: R$ ${vooMaisBarato.precoBase.toFixed(2)} + Taxas: R$ ${vooMaisBarato.taxas.toFixed(2)})`);
          } else {
            console.log(`      ❌ Nenhum voo com preço encontrado`);
          }
        } else {
          console.log(`      ❌ Sem resultados`);
        }
        
        // Pausa entre requisições
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Exibe os resultados finais
    console.log('\n🏆 RESULTADOS FINAIS - VOOS MAIS BARATOS');
    console.log('========================================');
    
    if (resultadosGerais.length === 0) {
      console.log('❌ Nenhum voo com preço encontrado para a Espanha');
      return;
    }
    
    // Ordena por preço final
    resultadosGerais.sort((a, b) => a.precoFinal - b.precoFinal);
    
    console.log(`\n📊 Encontrados ${resultadosGerais.length} voos com preços:\n`);
    
    // Mostra top 10
    const top10 = resultadosGerais.slice(0, 10);
    top10.forEach((resultado, index) => {
      console.log(`${index + 1}. ${resultado.destino} - ${resultado.companhia}`);
      console.log(`   💰 Preço Total: R$ ${resultado.precoFinal.toFixed(2)}`);
      console.log(`   📊 Base: R$ ${resultado.precoBase.toFixed(2)} + Taxas: R$ ${resultado.taxas.toFixed(2)}`);
      console.log(`   🎫 Opções: ${resultado.totalVoos} voos`);
      console.log('');
    });
    
    // Destaca o mais barato
    const maisBarato = resultadosGerais[0];
    console.log('🥇 VOO MAIS BARATO ENCONTRADO:');
    console.log('==============================');
    console.log(`🏙️ Destino: ${maisBarato.destino} (${maisBarato.codigoDestino})`);
    console.log(`✈️ Companhia: ${maisBarato.companhia}`);
    console.log(`💰 Preço Final: R$ ${maisBarato.precoFinal.toFixed(2)}`);
    console.log(`📊 Detalhamento:`);
    console.log(`   - Preço Base: R$ ${maisBarato.precoBase.toFixed(2)}`);
    console.log(`   - Taxas: R$ ${maisBarato.taxas.toFixed(2)}`);
    console.log(`🎫 Total de opções: ${maisBarato.totalVoos}`);
    
    // Detalhes do voo
    const voo = maisBarato.voo;
    console.log('\n📋 DETALHES DO VOO:');
    console.log('==================');
    console.log(`🛫 Número do voo: ${voo.FlightCode || 'N/A'}`);
    console.log(`📍 Rota: ${voo.Origem} → ${voo.Destino}`);
    console.log(`🕐 Saída: ${voo.Saida}`);
    console.log(`🕑 Chegada: ${voo.Chegada}`);
    console.log(`⏱️ Duração: ${voo.TempoTotalStr || 'N/A'}`);
    console.log(`🎒 Bagagem: ${voo.BagagensInclusas?.[0]?.TextoBagagem || 'Consultar'}`);
    
    if (voo.Voos && voo.Voos.length > 0) {
      console.log('\n✈️ Detalhes dos trechos:');
      voo.Voos.forEach((trecho, index) => {
        console.log(`   ${index + 1}. ${trecho.Numero} - ${trecho.Origem} → ${trecho.Destino}`);
        console.log(`      Saída: ${trecho.Saida} | Chegada: ${trecho.Chegada}`);
        console.log(`      Duração: ${trecho.Tempo} | Classe: ${trecho.ClasseStr}`);
      });
    }
    
    console.log('\n🎉 Busca concluída com sucesso!');
    console.log(`💡 Encontrado o voo mais barato para a Espanha: R$ ${maisBarato.precoFinal.toFixed(2)}`);
    console.log(`📍 Destino: ${maisBarato.destino}`);
    console.log(`🏢 Companhia: ${maisBarato.companhia}`);
    
  } catch (error) {
    console.error('\n💥 Erro durante a busca:', error.message);
  }
}

// Executar a busca
console.log('🚀 Iniciando busca do voo mais barato para a Espanha...\n');
buscarVooMaisBarato();
