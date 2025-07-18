const axios = require('axios');

async function testTapReservaFacil() {
  try {
    console.log('🔍 Testando TAP via ReservaFacil/Consultar...');
    
    // Primeiro, obter token
    const tokenResponse = await axios.post('http://localhost:3000/api/Token', {
      username: 'julio.martins@moblix.com.br',
      password: 'Moblix@2024'
    });
    
    const token = tokenResponse.data.access_token;
    console.log('✅ Token obtido:', token.substring(0, 50) + '...');
    
    // Testar com os parâmetros fornecidos pelo usuário - usando form-urlencoded
    const searchData = new URLSearchParams();
    searchData.append('Origem', 'GRU');
    searchData.append('Destino', 'BSB');
    searchData.append('Ida', '2025-05-10');
    searchData.append('Adultos', 1);
    searchData.append('Criancas', 0);
    searchData.append('Bebes', 0);
    searchData.append('Companhia', 11); // TAP
    
    console.log('📤 Enviando busca para TAP (ReservaFacil) - form-urlencoded:', searchData.toString());
    
    const flightResponse = await axios.post('http://localhost:3000/moblix-api/api/ReservaFacil/Consultar', searchData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    });
    
    console.log('📥 Resposta da API TAP (ReservaFacil):');
    console.log('Status:', flightResponse.status);
    
    const responseData = flightResponse.data;
    console.log('\n📊 Estrutura da resposta:');
    console.log('Keys:', Object.keys(responseData));
    
    if (responseData.Data) {
      console.log('\n📋 Data keys:', Object.keys(responseData.Data));
      console.log('Data length:', responseData.Data.length);
      
      if (responseData.Data.length > 0) {
        console.log('\n🔍 Primeiro item Data:');
        console.log('Keys:', Object.keys(responseData.Data[0]));
        console.log('Primeiro item:', JSON.stringify(responseData.Data[0], null, 2));
      }
    }
    
    // Verificar se há mensagens de erro
    if (responseData.Mensagem) {
      console.log('\n⚠️ Mensagem da API:', responseData.Mensagem);
    }
    
    if (responseData.Erro) {
      console.log('\n❌ Erro da API:', responseData.Erro);
    }
    
    if (responseData.Success !== undefined) {
      console.log('\n✅ Success:', responseData.Success);
    }
    
    // Verificar se a resposta está vazia
    if (!responseData.Data || responseData.Data.length === 0) {
      console.log('\n📭 Resposta vazia - nenhum voo encontrado para TAP');
    } else {
      console.log('\n🎉 Voos encontrados para TAP!');
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar TAP (ReservaFacil):', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Testar também com outras companhias para comparação
async function testOtherAirlines() {
  try {
    console.log('\n🔍 Testando outras companhias para comparação...');
    
    // Primeiro, obter token
    const tokenResponse = await axios.post('http://localhost:3000/api/Token', {
      username: 'julio.martins@moblix.com.br',
      password: 'Moblix@2024'
    });
    
    const token = tokenResponse.data.access_token;
    
    // Testar com Latam (ID 1) - usando form-urlencoded
    const latamData = new URLSearchParams();
    latamData.append('Origem', 'GRU');
    latamData.append('Destino', 'BSB');
    latamData.append('Ida', '2025-05-10');
    latamData.append('Adultos', 1);
    latamData.append('Criancas', 0);
    latamData.append('Bebes', 0);
    latamData.append('Companhia', 1); // Latam
    
    console.log('📤 Testando Latam...');
    const latamResponse = await axios.post('http://localhost:3000/moblix-api/api/ReservaFacil/Consultar', latamData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    });
    
    console.log('✅ Latam - Status:', latamResponse.status);
    console.log('✅ Latam - Data length:', latamResponse.data?.Data?.length || 0);
    
    // Testar com Gol (ID 2) - usando form-urlencoded
    const golData = new URLSearchParams();
    golData.append('Origem', 'GRU');
    golData.append('Destino', 'BSB');
    golData.append('Ida', '2025-05-10');
    golData.append('Adultos', 1);
    golData.append('Criancas', 0);
    golData.append('Bebes', 0);
    golData.append('Companhia', 2); // Gol
    
    console.log('📤 Testando Gol...');
    const golResponse = await axios.post('http://localhost:3000/moblix-api/api/ReservaFacil/Consultar', golData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    });
    
    console.log('✅ Gol - Status:', golResponse.status);
    console.log('✅ Gol - Data length:', golResponse.data?.Data?.length || 0);
    
    // Testar com Azul (ID 3) - usando form-urlencoded
    const azulData = new URLSearchParams();
    azulData.append('Origem', 'GRU');
    azulData.append('Destino', 'BSB');
    azulData.append('Ida', '2025-05-10');
    azulData.append('Adultos', 1);
    azulData.append('Criancas', 0);
    azulData.append('Bebes', 0);
    azulData.append('Companhia', 3); // Azul
    
    console.log('📤 Testando Azul...');
    const azulResponse = await axios.post('http://localhost:3000/moblix-api/api/ReservaFacil/Consultar', azulData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    });
    
    console.log('✅ Azul - Status:', azulResponse.status);
    console.log('✅ Azul - Data length:', azulResponse.data?.Data?.length || 0);
    
  } catch (error) {
    console.error('❌ Erro ao testar outras companhias:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

async function getProductionToken() {
  // Obtém o token de produção
  const tokenResponse = await axios.post('https://api.moblix.com.br/api/Token', {
    username: 'julio.martins@moblix.com.br',
    password: 'Moblix@2024'
  });
  return tokenResponse.data.access_token;
}

async function testAzulProduction() {
  try {
    console.log('🔍 Testando Azul na produção (ReservaFacil/Consultar)...');
    const token = await getProductionToken();
    console.log('✅ Token de produção obtido:', token.substring(0, 50) + '...');

    const azulData = {
      Origem: 'GRU',
      Destino: 'BSB',
      Ida: '2025-05-10',
      Adultos: 1,
      Criancas: 0,
      Bebes: 0,
      Companhia: 3 // Azul
    };

    console.log('📤 Enviando busca para Azul (produção):', JSON.stringify(azulData, null, 2));

    const response = await axios.post('https://api.moblix.com.br/api/ReservaFacil/Consultar', azulData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('📥 Resposta da API Azul (produção):');
    console.log('Status:', response.status);
    const responseData = response.data;
    console.log('\n📊 Estrutura da resposta:');
    console.log('Keys:', Object.keys(responseData));
    if (responseData.Data) {
      console.log('\n📋 Data keys:', Object.keys(responseData.Data));
      console.log('Data length:', responseData.Data.length);
      if (responseData.Data.length > 0) {
        console.log('\n🔍 Primeiro item Data:');
        console.log('Keys:', Object.keys(responseData.Data[0]));
        console.log('Primeiro item:', JSON.stringify(responseData.Data[0], null, 2));
      }
    }
    if (responseData.Mensagem) {
      console.log('\n⚠️ Mensagem da API:', responseData.Mensagem);
    }
    if (responseData.Erro) {
      console.log('\n❌ Erro da API:', responseData.Erro);
    }
    if (responseData.Success !== undefined) {
      console.log('\n✅ Success:', responseData.Success);
    }
    if (!responseData.Data || responseData.Data.length === 0) {
      console.log('\n📭 Resposta vazia - nenhum voo encontrado para Azul');
    } else {
      console.log('\n🎉 Voos encontrados para Azul!');
    }
  } catch (error) {
    console.error('❌ Erro ao testar Azul (produção):', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

async function testAllCompanies() {
  try {
    console.log('🔍 Testando todas as companhias na produção...');
    const token = await getProductionToken();
    console.log('✅ Token de produção obtido:', token.substring(0, 50) + '...');

    const companies = [
      { id: -1, name: 'Todas as companhias' },
      { id: 1, name: 'Latam' },
      { id: 2, name: 'Gol' },
      { id: 3, name: 'Azul' },
      { id: 11, name: 'TAP Air Portugal' },
      { id: 13, name: 'Copa Airlines' },
      { id: 22, name: 'American Airlines' },
      { id: 26, name: 'Iberia' },
      { id: 34, name: 'Livelo' },
      { id: 1200, name: 'Azul Interline' },
      { id: 0, name: 'Nenhuma companhia específica' }
    ];

    for (const company of companies) {
      console.log(`\n📤 Testando ${company.name} (ID: ${company.id})...`);
      
      const searchData = {
        Origem: 'GRU',
        Destino: 'BSB',
        Ida: '2025-05-10',
        Adultos: 1,
        Criancas: 0,
        Bebes: 0,
        Companhia: company.id
      };

      try {
        const response = await axios.post('https://api.moblix.com.br/api/ReservaFacil/Consultar', searchData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        console.log(`✅ ${company.name} - Status:`, response.status);
        console.log(`✅ ${company.name} - Dados:`, JSON.stringify(response.data, null, 2));
        
        // Verificar se há voos
        if (response.data && response.data.length > 0) {
          console.log(`✅ ${company.name} - Voo encontrado!`);
        } else {
          console.log(`❌ ${company.name} - Nenhum voo encontrado`);
        }
      } catch (error) {
        console.log(`❌ ${company.name} - Erro:`, error.response?.status, error.response?.statusText);
        if (error.response?.data) {
          console.log(`❌ ${company.name} - Detalhes:`, JSON.stringify(error.response.data, null, 2));
        }
      }
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    if (error.response) {
      console.error('❌ Status:', error.response.status);
      console.error('❌ Data:', error.response.data);
    }
  }
}

async function testIndividualCompanies() {
  try {
    console.log('🔍 Testando Livelo e Azul Interline individualmente...');
    
    // Primeiro, obter token
    const tokenResponse = await axios.post('http://localhost:3000/api/Token', {
      username: 'julio.martins@moblix.com.br',
      password: 'Moblix@2024'
    });
    
    const token = tokenResponse.data.access_token;
    console.log('✅ Token obtido:', token.substring(0, 50) + '...');

    const companies = [
      { id: 34, name: 'Livelo' },
      { id: 1200, name: 'Azul Interline' }
    ];

    for (const company of companies) {
      console.log(`\n📤 Testando ${company.name} (ID: ${company.id})...`);
      
      const searchData = {
        origem: 'GRU',
        destino: 'BSB',
        dataIda: '2025-05-10',
        dataVolta: null,
        adultos: 1,
        criancas: 0,
        bebes: 0,
        companhiaAerea: company.id,
        tipoBusca: 1
      };

      try {
        const response = await axios.post('http://localhost:3000/api/ConsultaAereo/Consultar', searchData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log(`✅ ${company.name} - Status:`, response.status);
        console.log(`✅ ${company.name} - Dados:`, JSON.stringify(response.data, null, 2));
        
        // Verificar se há voos
        if (response.data && response.data.Data && response.data.Data.length > 0) {
          console.log(`✅ ${company.name} - Voo encontrado!`);
        } else if (response.data && response.data.Ida && response.data.Ida.length > 0) {
          console.log(`✅ ${company.name} - Voo encontrado (formato Ida)!`);
        } else {
          console.log(`❌ ${company.name} - Nenhum voo encontrado`);
        }
      } catch (error) {
        console.log(`❌ ${company.name} - Erro:`, error.response?.status, error.response?.statusText);
        if (error.response?.data) {
          console.log(`❌ ${company.name} - Detalhes:`, JSON.stringify(error.response.data, null, 2));
        }
      }
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    if (error.response) {
      console.error('❌ Status:', error.response.status);
      console.error('❌ Data:', error.response.data);
    }
  }
}

// Executar os testes
async function runTests() {
  await testTapReservaFacil();
  await testOtherAirlines();
  await testAzulProduction();
  await testAllCompanies();
  await testIndividualCompanies();
}

runTests(); 