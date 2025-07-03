import axios from 'axios';

// Teste da busca de voos com parâmetros forçados
async function testFlightSearch() {
  try {
    console.log('🧪 Testando busca de voos com parâmetros forçados...');
    
    // Primeiro, obter token de autenticação
    const authFormData = new URLSearchParams();
    authFormData.append('grant_type', 'password');
    authFormData.append('username', 'TooGood');
    authFormData.append('password', '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7');

    console.log('🔐 Obtendo token de autenticação...');
    const authResponse = await axios({
      method: 'post',
      url: 'http://localhost:3000/api/Token',
      data: authFormData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    });

    const token = authResponse.data.access_token;
    console.log('✅ Token obtido:', token.substring(0, 20) + '...');

    // Parâmetros forçados para teste
    const hoje = new Date();
    const dataProxima = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 7);
    const dataProximaStr = dataProxima.toISOString().split('T')[0];

    const searchParams = {
      origem: 'GRU',
      destino: 'GIG',
      ida: dataProximaStr,
      volta: null,
      adultos: 1,
      criancas: 0,
      bebes: 0,
      companhia: -1,
      soIda: true,
      orderBy: 'tempo',
      numeroPagina: 1,
      quantidadePorPagina: 100
    };

    console.log('📡 Enviando busca de voos com parâmetros:', searchParams);

    // Buscar voos
    const flightResponse = await axios({
      method: 'post',
      url: 'http://localhost:3000/api/ConsultaAereo/Consultar',
      data: searchParams,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('✅ Resposta da API de voos:');
    console.log('Status:', flightResponse.status);
    console.log('Headers:', flightResponse.headers);
    console.log('Data:', JSON.stringify(flightResponse.data, null, 2));

    // Análise da resposta
    const responseData = flightResponse.data;
    console.log('\n🔍 Análise da resposta:');
    console.log('Tipo:', typeof responseData);
    console.log('É array?', Array.isArray(responseData));
    
    if (responseData && typeof responseData === 'object') {
      console.log('Propriedades:', Object.keys(responseData));
      
      // Procura por arrays que podem conter voos
      Object.keys(responseData).forEach(key => {
        if (Array.isArray(responseData[key])) {
          console.log(`Array "${key}": ${responseData[key].length} itens`);
          if (responseData[key].length > 0) {
            console.log(`Primeiro item de "${key}":`, JSON.stringify(responseData[key][0], null, 2));
          }
        }
      });
    }

    return flightResponse.data;
  } catch (error) {
    console.error('❌ Erro na busca de voos:');
    console.error('Status:', error.response?.status);
    console.error('URL:', error.config?.url);
    console.error('Mensagem:', error.message);
    
    if (error.response?.data) {
      console.error('Resposta do servidor:', JSON.stringify(error.response.data, null, 2));
    }
    
    throw error;
  }
}

// Executa o teste
testFlightSearch()
  .then((data) => {
    console.log('🎉 Teste concluído com sucesso!');
    console.log('Resposta final:', data);
    process.exit(0);
  })
  .catch((error) => {
    console.log('💥 Teste falhou!');
    process.exit(1);
  }); 