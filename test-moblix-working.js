// Script para testar a API Moblix com debugging detalhado
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5173'; // Proxy local
const MOBLIX_DIRECT_URL = 'https://api.moblix.com.br'; // Direto para a API

// Credenciais corretas
const CREDENTIALS = {
  username: 'TooGood',
  password: '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7'
};

// Teste direto com a API Moblix (sem proxy)
async function testDirectAuth() {
  try {
    console.log('🔐 Testando autenticação DIRETA com API Moblix...');
    
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', CREDENTIALS.username);
    formData.append('password', CREDENTIALS.password);

    console.log('URL:', `${MOBLIX_DIRECT_URL}/api/Token`);
    console.log('Headers:', {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'Origin': 'externo'
    });
    console.log('Body:', formData.toString().replace(CREDENTIALS.password, '***'));

    const response = await axios.post(`${MOBLIX_DIRECT_URL}/api/Token`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Origin': 'externo'
      },
      timeout: 15000
    });

    console.log('✅ Autenticação direta FUNCIONOU!');
    console.log('Status:', response.status);
    console.log('Token:', response.data.access_token?.substring(0, 50) + '...');
    console.log('Expires in:', response.data.expires_in, 'segundos');
    return response.data.access_token;
  } catch (error) {
    console.error('❌ Erro na autenticação direta:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    return null;
  }
}

// Teste via proxy local
async function testProxyAuth() {
  try {
    console.log('\n🔐 Testando autenticação via PROXY local...');
    
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', CREDENTIALS.username);
    formData.append('password', CREDENTIALS.password);

    const response = await axios.post(`${API_BASE_URL}/api/Token`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      timeout: 15000
    });

    console.log('✅ Autenticação via proxy FUNCIONOU!');
    console.log('Status:', response.status);
    console.log('Token:', response.data.access_token?.substring(0, 50) + '...');
    return response.data.access_token;
  } catch (error) {
    console.error('❌ Erro na autenticação via proxy:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    return null;
  }
}

// Teste de busca de voos direta
async function testDirectFlightSearch(token) {
  try {
    console.log('\n✈️ Testando busca de voos DIRETA...');
    
    // Calcula uma data futura (7 dias a partir de hoje)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateString = futureDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    
    const searchData = {
      Origem: 'CGH',
      Destino: 'GIG',
      Ida: dateString,
      Adultos: 1,
      Criancas: 0,
      Bebes: 0,
      Companhia: 1 // LATAM
    };

    console.log('Parâmetros de busca:', searchData);

    const response = await axios.post(`${MOBLIX_DIRECT_URL}/api/ConsultaAereo/Consultar`, searchData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Origin': 'externo'
      },
      timeout: 30000
    });

    console.log('✅ Busca de voos direta FUNCIONOU!');
    console.log('Status:', response.status);
    console.log('Tipo da resposta:', typeof response.data);
    console.log('É array?', Array.isArray(response.data));
    
    if (response.data) {
      console.log('Propriedades da resposta:', Object.keys(response.data));
      console.log('Success:', response.data.Success);
      console.log('HasResult:', response.data.HasResult);
      console.log('TotalItens:', response.data.TotalItens);
      
      if (response.data.MensagemErro) {
        console.log('❌ Erro na resposta:', response.data.MensagemErro);
      }
      
      // Analisa a estrutura da resposta
      if (response.data.Data && Array.isArray(response.data.Data)) {
        console.log('Data é array com', response.data.Data.length, 'itens');
        if (response.data.Data.length > 0) {
          console.log('Primeiro item de Data:', JSON.stringify(response.data.Data[0], null, 2));
        } else {
          console.log('⚠️ Array Data está vazio');
        }
      } else if (response.data.Data) {
        console.log('Data não é array:', typeof response.data.Data, response.data.Data);
      } else {
        console.log('❌ Propriedade Data não encontrada');
      }
      
      if (response.data.Ida && Array.isArray(response.data.Ida)) {
        console.log('Ida é array com', response.data.Ida.length, 'voos');
        if (response.data.Ida.length > 0) {
          console.log('Primeiro voo de ida:', JSON.stringify(response.data.Ida[0], null, 2));
        }
      }
      
      // Log completo da resposta se não houver voos
      if ((!response.data.Data || response.data.Data.length === 0) && 
          (!response.data.Ida || response.data.Ida.length === 0)) {
        console.log('📋 RESPOSTA COMPLETA (sem voos):');
        console.log(JSON.stringify(response.data, null, 2));
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Erro na busca de voos direta:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    return null;
  }
}

// Teste de busca de voos via proxy
async function testProxyFlightSearch(token) {
  try {
    console.log('\n✈️ Testando busca de voos via PROXY...');
    
    // Calcula uma data futura (7 dias a partir de hoje)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateString = futureDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    
    const searchData = {
      Origem: 'CGH',
      Destino: 'GIG',
      Ida: dateString,
      Adultos: 1,
      Criancas: 0,
      Bebes: 0,
      Companhia: 1
    };

    const response = await axios.post(`${API_BASE_URL}/api/ConsultaAereo/Consultar`, searchData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      timeout: 30000
    });

    console.log('✅ Busca de voos via proxy FUNCIONOU!');
    console.log('Status:', response.status);
    console.log('Voos encontrados:', response.data?.Data?.length || 0);
    return response.data;
  } catch (error) {
    console.error('❌ Erro na busca de voos via proxy:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    return null;
  }
}

// Executar todos os testes
async function runAllTests() {
  console.log('🚀 INICIANDO TESTES COMPLETOS DA API MOBLIX\n');
  
  // Teste 1: Autenticação direta
  const directToken = await testDirectAuth();
  
  // Teste 2: Autenticação via proxy
  const proxyToken = await testProxyAuth();
  
  // Se pelo menos um token funcionou, testa a busca de voos
  if (directToken) {
    await testDirectFlightSearch(directToken);
  }
  
  if (proxyToken) {
    await testProxyFlightSearch(proxyToken);
  }
  
  if (!directToken && !proxyToken) {
    console.log('\n❌ NENHUMA AUTENTICAÇÃO FUNCIONOU - Verifique as credenciais');
  }
  
  console.log('\n🏁 TESTES CONCLUÍDOS!\n');
}

// Executar
runAllTests().catch(console.error);
