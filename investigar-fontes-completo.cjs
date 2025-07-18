// Script completo para investigar as fontes exatas dos voos
const https = require('https');
const querystring = require('querystring');

let ACCESS_TOKEN = null;

// Função para obter token de autenticação
async function obterToken() {
  return new Promise((resolve, reject) => {
    const authData = {
      grant_type: 'password',
      username: 'TooGood', 
      password: '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7'
    };

    const postData = querystring.stringify(authData);

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

    console.log('🔐 Obtendo token de autenticação...');

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (res.statusCode === 200 && response.access_token) {
            console.log('✅ Token obtido com sucesso!');
            ACCESS_TOKEN = response.access_token;
            resolve(response.access_token);
          } else {
            console.log('❌ Erro ao obter token:', response);
            reject(new Error('Falha na autenticação'));
          }
        } catch (error) {
          console.log('❌ Erro ao processar resposta:', data);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Erro na requisição de token:', error);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Função para buscar voos com token
async function buscarVoos() {
  return new Promise((resolve, reject) => {
    const searchData = JSON.stringify({
      Origem: 'CGH',
      Destino: 'GIG',
      Ida: '2025-07-15',
      Adultos: 1,
      Criancas: 0,
      Bebes: 0,
      Companhia: 1
    });

    const options = {
      hostname: 'api.moblix.com.br',
      port: 443,
      path: '/api/ConsultaAereo/Consultar',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Origin': 'externo',
        'Referer': 'https://moblix.com.br/',
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(searchData)
      }
    };

    console.log('🛫 Buscando voos...');

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (res.statusCode === 200) {
            console.log('✅ Voos encontrados!');
            resolve(response);
          } else {
            console.log('❌ Erro na busca de voos:', response);
            reject(new Error(`Status: ${res.statusCode}`));
          }
        } catch (error) {
          console.log('❌ Erro ao processar resposta:', data);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Erro na requisição de voos:', error);
      reject(error);
    });

    req.write(searchData);
    req.end();
  });
}

// Função para analisar fontes dos voos
function analisarFontesVoos(voos) {
  console.log('\n🔍 ANALISANDO FONTES DOS VOOS');
  console.log('==========================================\n');
  
  // Primeiro, vamos ver a estrutura completa da resposta
  console.log('📋 ESTRUTURA COMPLETA DA RESPOSTA:');
  console.log('Chaves principais:', Object.keys(voos));
  console.log('Resposta completa:', JSON.stringify(voos, null, 2));
  
  // Verificar diferentes possíveis estruturas
  let flightData = null;
  if (voos.Data && Array.isArray(voos.Data)) {
    flightData = voos.Data;
  } else if (voos.data && Array.isArray(voos.data)) {
    flightData = voos.data;
  } else if (voos.flights && Array.isArray(voos.flights)) {
    flightData = voos.flights;
  } else if (voos.results && Array.isArray(voos.results)) {
    flightData = voos.results;
  } else if (Array.isArray(voos)) {
    flightData = voos;
  }

  if (!flightData || !Array.isArray(flightData)) {
    console.log('❌ Nenhum voo encontrado para análise');
    console.log('🔍 Tentando encontrar voos em outras estruturas...');
    
    // Busca recursiva por arrays que possam conter voos
    function findArrays(obj, path = '') {
      if (Array.isArray(obj) && obj.length > 0) {
        console.log(`📦 Array encontrado em '${path}' com ${obj.length} itens:`);
        console.log('Primeiro item:', JSON.stringify(obj[0], null, 2));
      }
      
      if (typeof obj === 'object' && obj !== null) {
        Object.entries(obj).forEach(([key, value]) => {
          findArrays(value, path ? `${path}.${key}` : key);
        });
      }
    }
    
    findArrays(voos);
    return;
  }

  console.log(`📊 Total de voos encontrados: ${voos.Data.length}\n`);

  voos.Data.forEach((flight, index) => {
    console.log(`--- VOO ${index + 1} ---`);
    
    // Dados básicos
    const preco = flight.ValorTotalComTaxa || flight.ValorTotal || flight.Preco || 0;
    const numeroVoo = flight.NumeroVoo || flight.CodigoVoo || 'N/A';
    const companhia = flight.Companhia || flight.CompanhiaAerea || 'N/A';
    
    console.log(`💰 Preço: R$ ${preco.toFixed(2)}`);
    console.log(`✈️ Voo: ${numeroVoo}`);
    console.log(`🏢 Companhia: ${companhia}`);
    
    // Análise de fontes - INVESTIGAÇÃO DETALHADA
    console.log('\n🔍 FONTES IDENTIFICADAS:');
    
    const fontes = [];
    
    // 1. Campos diretos
    if (flight.Provider) fontes.push(`Provider: ${flight.Provider}`);
    if (flight.Source) fontes.push(`Source: ${flight.Source}`);
    if (flight.Supplier) fontes.push(`Supplier: ${flight.Supplier}`);
    if (flight.BookingUrl) fontes.push(`Booking URL: ${flight.BookingUrl}`);
    if (flight.DeepLink) fontes.push(`Deep Link: ${flight.DeepLink}`);
    if (flight.UrlReserva) fontes.push(`URL Reserva: ${flight.UrlReserva}`);
    
    // 2. Campos de origem específicos
    if (flight.Origem) fontes.push(`Sistema Origem: ${flight.Origem}`);
    if (flight.FonteDados) fontes.push(`Fonte Dados: ${flight.FonteDados}`);
    if (flight.Consolidadora) fontes.push(`Consolidadora: ${flight.Consolidadora}`);
    
    // 3. Tokens que podem indicar origem
    if (flight.TokenConsulta) {
      const tokenParts = flight.TokenConsulta.split('_');
      fontes.push(`Token Consulta: ${flight.TokenConsulta}`);
      if (tokenParts.length > 1) {
        fontes.push(`Token Source Parts: ${tokenParts.join(' | ')}`);
      }
    }
    
    if (flight.Token) fontes.push(`Token: ${flight.Token}`);
    if (flight.RateToken) fontes.push(`Rate Token: ${flight.RateToken}`);
    
    // 4. Campos de segmentos
    if (flight.Segmentos && Array.isArray(flight.Segmentos)) {
      flight.Segmentos.forEach((segment, sIndex) => {
        if (segment.Provider) fontes.push(`Segmento ${sIndex + 1} Provider: ${segment.Provider}`);
        if (segment.Source) fontes.push(`Segmento ${sIndex + 1} Source: ${segment.Source}`);
        if (segment.BookingUrl) fontes.push(`Segmento ${sIndex + 1} Booking: ${segment.BookingUrl}`);
        if (segment.Consolidadora) fontes.push(`Segmento ${sIndex + 1} Consolidadora: ${segment.Consolidadora}`);
      });
    }
    
    // 5. Busca por OTAs em todos os campos
    const otas = ['decolar', 'viajanet', '123milhas', 'maxmilhas', 'submarino', 'hurb', 'expedia', 'booking', 'latam', 'gol', 'azul'];
    Object.entries(flight).forEach(([key, value]) => {
      if (typeof value === 'string') {
        otas.forEach(ota => {
          if (value.toLowerCase().includes(ota)) {
            fontes.push(`Campo "${key}" contém "${ota}": ${value}`);
          }
        });
      }
    });
    
    // 6. Campos específicos de reserva/booking
    const camposReserva = ['IsReservaFacil', 'IsThirdParty', 'IsConsolidator', 'IsExternal', 'IsDirect'];
    camposReserva.forEach(campo => {
      if (flight[campo] !== undefined) {
        fontes.push(`${campo}: ${flight[campo]}`);
      }
    });
    
    // Mostrar fontes encontradas
    if (fontes.length > 0) {
      fontes.forEach((fonte, fIndex) => {
        console.log(`   ${fIndex + 1}. ${fonte}`);
      });
      
      // Identificar a fonte mais provável
      const urlSources = fontes.filter(f => f.includes('http'));
      const providerSources = fontes.filter(f => f.includes('Provider') && !f.includes('Segmento'));
      const otaSources = fontes.filter(f => f.includes('contém'));
      
      console.log('\n🎯 FONTE MAIS PROVÁVEL:');
      if (urlSources.length > 0) {
        console.log(`   📍 ${urlSources[0]}`);
      } else if (providerSources.length > 0) {
        console.log(`   🏢 ${providerSources[0]}`);
      } else if (otaSources.length > 0) {
        console.log(`   🛒 ${otaSources[0]}`);
      } else if (fontes.length > 0) {
        console.log(`   📌 ${fontes[0]}`);
      }
      
      // Recomendação de onde procurar
      console.log('\n🛍️ ONDE PROCURAR ESTE VOO:');
      if (fontes.some(f => f.toLowerCase().includes('decolar'))) {
        console.log('   📍 Decolar.com - Busque pelo voo específico');
      } else if (fontes.some(f => f.toLowerCase().includes('viajanet'))) {
        console.log('   📍 ViajaNet.com.br - Procure pelo número do voo');
      } else if (fontes.some(f => f.toLowerCase().includes('123milhas'))) {
        console.log('   📍 123milhas.com - Busque pelo voo');
      } else if (companhia.toLowerCase().includes('latam')) {
        console.log('   📍 Site oficial da LATAM (latam.com) ou consolidadoras');
      } else if (companhia.toLowerCase().includes('gol')) {
        console.log('   📍 Site oficial da GOL (voegol.com.br) ou consolidadoras');
      } else {
        console.log('   📍 Site oficial da companhia ou consolidadoras principais');
      }
      
    } else {
      console.log('   ❌ Nenhuma fonte específica identificada');
      console.log('\n🛍️ RECOMENDAÇÃO PADRÃO:');
      console.log('   📍 Site oficial da companhia aérea');
      console.log('   📍 Decolar.com, ViajaNet.com.br, 123milhas.com');
    }
    
    // Se for o voo que estamos procurando especificamente (LA-9058)
    if (numeroVoo.includes('9058') || (preco > 500 && preco < 4000)) {
      console.log('\n⭐ ESTE PODE SER O VOO PROCURADO! ⭐');
      console.log('📝 DADOS COMPLETOS DESTE VOO:');
      console.log(JSON.stringify(flight, null, 2));
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
  });
}

// Função principal
async function investigarCompleto() {
  try {
    console.log('🔍 INVESTIGAÇÃO COMPLETA DAS FONTES DOS VOOS');
    console.log('='.repeat(50));
    
    // Passo 1: Obter token
    await obterToken();
    
    // Passo 2: Buscar voos
    const voos = await buscarVoos();
    
    // Passo 3: Analisar fontes
    analisarFontesVoos(voos);
    
    console.log('\n✅ INVESTIGAÇÃO CONCLUÍDA!');
    
  } catch (error) {
    console.error('❌ Erro na investigação:', error.message);
  }
}

// Executar investigação completa
investigarCompleto();
