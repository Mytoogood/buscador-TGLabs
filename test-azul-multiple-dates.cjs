// Script para testar voos da Azul em diferentes datas
const https = require('https');

// Função para fazer requisição à API
function makeRequest(path, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'api.moblix.com.br',
      port: 443,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': postData.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const jsonResponse = JSON.parse(body);
          resolve(jsonResponse);
        } catch (error) {
          reject(new Error(`Erro ao parsear JSON: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Timeout na requisição'));
    });

    req.write(postData);
    req.end();
  });
}

// Função para gerar datas futuras
function getTestDates() {
  const dates = [];
  const today = new Date();
  
  // Testa os próximos 14 dias
  for (let i = 1; i <= 14; i++) {
    const testDate = new Date(today);
    testDate.setDate(today.getDate() + i);
    dates.push(testDate.toISOString().split('T')[0]);
  }
  
  return dates;
}

// Função para testar uma data específica
async function testDateForAzul(date) {
  const searchParams = {
    Origem: 'GRU',
    Destino: 'GIG',
    Ida: date,
    Adultos: 1,
    Criancas: 0,
    Bebes: 0,
    companhia: 3  // Azul
  };
  
  try {
    console.log(`📅 Testando ${date}...`);
    const response = await makeRequest('/aereo/api/consulta', searchParams);
    
    let flightCount = 0;
    let hasFlights = false;
    
    if (response.Success && response.Data && Array.isArray(response.Data)) {
      if (response.Data.length > 0 && response.Data[0].flights) {
        flightCount = response.Data[0].flights.length;
        hasFlights = flightCount > 0;
      }
    }
    
    return {
      date,
      success: response.Success,
      hasResult: response.HasResult,
      flightCount,
      hasFlights,
      error: response.MensagemErro || null
    };
    
  } catch (error) {
    return {
      date,
      success: false,
      hasResult: false,
      flightCount: 0,
      hasFlights: false,
      error: error.message
    };
  }
}

// Função principal
async function testMultipleDates() {
  console.log('🔍 TESTANDO VOOS DA AZUL EM MÚLTIPLAS DATAS');
  console.log('Rota: GRU → GIG (São Paulo → Rio de Janeiro)');
  console.log('Companhia: Azul (ID: 3)\n');
  
  const testDates = getTestDates();
  console.log(`📅 Testando ${testDates.length} datas: ${testDates[0]} até ${testDates[testDates.length - 1]}\n`);
  
  const results = [];
  
  // Testa uma data por vez para não sobrecarregar a API
  for (const date of testDates) {
    const result = await testDateForAzul(date);
    results.push(result);
    
    // Pausa de 1 segundo entre requisições
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Análise dos resultados
  console.log('\n📊 RESULTADOS DO TESTE:\n');
  
  const successfulDates = results.filter(r => r.success && r.hasFlights);
  const availableDates = results.filter(r => r.hasFlights);
  const errorDates = results.filter(r => !r.success);
  
  console.log('✅ DATAS COM VOOS DA AZUL:');
  if (availableDates.length > 0) {
    availableDates.forEach(result => {
      console.log(`   📅 ${result.date}: ${result.flightCount} voos encontrados`);
    });
  } else {
    console.log('   ❌ Nenhuma data com voos da Azul encontrada');
  }
  
  console.log('\n❌ DATAS SEM VOOS DA AZUL:');
  const noFlightDates = results.filter(r => r.success && !r.hasFlights);
  if (noFlightDates.length > 0) {
    noFlightDates.forEach(result => {
      console.log(`   📅 ${result.date}: Sem voos`);
    });
  }
  
  console.log('\n⚠️ ERROS DE REQUISIÇÃO:');
  if (errorDates.length > 0) {
    errorDates.forEach(result => {
      console.log(`   📅 ${result.date}: ${result.error}`);
    });
  } else {
    console.log('   ✅ Nenhum erro de requisição');
  }
  
  // Resumo estatístico
  console.log('\n📈 RESUMO ESTATÍSTICO:');
  console.log(`   🎯 Total de datas testadas: ${results.length}`);
  console.log(`   ✅ Datas com voos da Azul: ${availableDates.length}`);
  console.log(`   ❌ Datas sem voos da Azul: ${noFlightDates.length}`);
  console.log(`   ⚠️ Erros de requisição: ${errorDates.length}`);
  console.log(`   📊 Taxa de sucesso: ${((results.length - errorDates.length) / results.length * 100).toFixed(1)}%`);
  console.log(`   ✈️ Taxa de disponibilidade: ${(availableDates.length / results.length * 100).toFixed(1)}%`);
  
  // Recomendações
  console.log('\n💡 RECOMENDAÇÕES:');
  if (availableDates.length > 0) {
    const bestDate = availableDates.sort((a, b) => b.flightCount - a.flightCount)[0];
    console.log(`   🏆 Melhor data: ${bestDate.date} (${bestDate.flightCount} voos)`);
    console.log(`   📅 Datas recomendadas: ${availableDates.slice(0, 3).map(r => r.date).join(', ')}`);
  } else {
    console.log('   🔄 Tente outras rotas ou companhias aéreas');
    console.log('   📞 Verifique com a Azul se há voos diretos nesta rota');
    console.log('   🛫 Considere voos com conexão');
  }
}

// Executar o teste
console.log('=== TESTE DE MÚLTIPLAS DATAS PARA VOOS DA AZUL ===\n');
testMultipleDates().then(() => {
  console.log('\n✅ Teste concluído com sucesso!');
}).catch((error) => {
  console.error('\n❌ Erro durante o teste:', error.message);
});
