import axios from 'axios';
import moblixService from '@/services/moblixService';

// Credenciais para autenticação
const AUTH_CREDENTIALS = {
  username: 'TooGood',
  password: '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7'
};

async function testMoblixEndpoints() {
  console.log('Iniciando teste de endpoints da API Moblix...');
  
  // Teste de autenticação
  console.log('Testando autenticação...');
  try {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', AUTH_CREDENTIALS.username);
    formData.append('password', AUTH_CREDENTIALS.password);

    const tokenResponse = await axios({
      method: 'post',
      url: 'https://api.moblix.com.br/auth/login',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://moblix.com.br',
        'Referer': 'https://moblix.com.br/',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      data: formData,
      withCredentials: true
    });

    console.log('Autenticação bem-sucedida! Token recebido.');
    console.log('Token de acesso:', tokenResponse.data.access_token);
    console.log('Tipo de token:', tokenResponse.data.token_type);
    console.log('Expira em (segundos):', tokenResponse.data.expires_in);
  } catch (error) {
    console.error('Erro na autenticação:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return; // Para o teste se a autenticação falhar
  }
  
  // Endpoints adicionais para testar (apenas se a autenticação for bem-sucedida)
  const endpointsToTest = [
    { method: 'get', url: '/api/Account/Info' },
    { method: 'get', url: '/api/Milhas/Saldo' },
    { method: 'get', url: '/api/Transacoes/Ultimas' },
    { method: 'get', url: '/api/Cotacoes' },
    { method: 'get', url: '/api/Clientes' },
  ];

  const results = [];
  
  for (const { method, url } of endpointsToTest) {
    try {
      console.log(`Testando ${method.toUpperCase()} ${url}`);
      const response = await moblixService.request(method, url);
      results.push({
        endpoint: url,
        status: 'SUCESSO',
        data: response || 'Sem dados retornados',
        method: method.toUpperCase()
      });
    } catch (error) {
      results.push({
        endpoint: url,
        status: `ERRO ${error.response?.status || 'DESCONHECIDO'}`,
        error: error.message,
        method: method.toUpperCase()
      });
    }
  }

  console.log('Resultados dos testes:', results);
  return results;
}

// Executa o teste
testMoblixEndpoints()
  .then(results => console.log('Teste concluído com sucesso!', results))
  .catch(error => console.error('Erro ao testar API Moblix:', error));

export default testMoblixEndpoints;
