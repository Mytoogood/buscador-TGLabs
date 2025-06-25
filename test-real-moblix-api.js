import axios from 'axios';

const API_BASE_URL = 'https://api.moblix.com.br';
const CREDENTIALS = {
  mbxUsername: 'TooGood',
  mbxPassword: '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7'
};

async function testRealMoblixAPI() {
  console.log('🚀 Iniciando teste real da API Moblix...\n');
  
  try {
    // 1. Testar autenticação
    console.log('1. 🔑 Tentando autenticar...');
    const authResponse = await axios.post(`${API_BASE_URL}/auth/login`, CREDENTIALS);
    
    if (!authResponse.data.bearerToken) {
      console.error('❌ Token não recebido na resposta');
      console.log('Resposta completa:', JSON.stringify(authResponse.data, null, 2));
      return;
    }
    
    const token = authResponse.data.bearerToken;
    console.log('✅ Autenticado com sucesso!');
    
    // Configurar headers com o token
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // 2. Testar endpoint de perfil do usuário
    console.log('\n2. 👤 Obtendo informações do perfil...');
    try {
      const profileResponse = await axios.get(`${API_BASE_URL}/api/usuario/me`, { headers });
      console.log('Perfil do usuário:', JSON.stringify(profileResponse.data, null, 2));
    } catch (error) {
      console.error('❌ Erro ao buscar perfil:', error.response?.data?.message || error.message);
    }
    
    // 3. Testar endpoint de pedidos
    console.log('\n3. 📋 Buscando pedidos recentes...');
    try {
      const ordersResponse = await axios.get(`${API_BASE_URL}/api/pedidos`, { 
        params: { limit: 5 }, // Limitar a 5 pedidos para teste
        headers 
      });
      console.log('Pedidos encontrados:', JSON.stringify(ordersResponse.data, null, 2));
    } catch (error) {
      console.error('❌ Erro ao buscar pedidos:', error.response?.data?.message || error.message);
      console.log('Status:', error.response?.status);
      console.log('Dados do erro:', error.response?.data);
    }
    
    // 4. Verificar endpoints disponíveis
    console.log('\n4. 🔍 Verificando endpoints disponíveis...');
    try {
      const apiInfo = await axios.get(API_BASE_URL, { headers });
      console.log('Informações da API:', JSON.stringify(apiInfo.data, null, 2));
    } catch (error) {
      console.log('Não foi possível obter informações da API raiz, tentando rota alternativa...');
      try {
        const apiInfo = await axios.get(`${API_BASE_URL}/api`, { headers });
        console.log('Informações da API (rota alternativa):', JSON.stringify(apiInfo.data, null, 2));
      } catch (e) {
        console.error('Não foi possível obter informações da API:', e.message);
      }
    }
    
  } catch (error) {
    console.error('\n❌ Erro durante o teste:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
      console.error('Headers:', JSON.stringify(error.response.headers, null, 2));
    } else if (error.request) {
      console.error('Nenhuma resposta recebida:', error.request);
    } else {
      console.error('Erro:', error.message);
    }
  }
}

// Executar o teste
testRealMoblixAPI().catch(console.error);

export default testRealMoblixAPI;
