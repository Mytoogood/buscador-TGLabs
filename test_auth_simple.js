import axios from 'axios';

// Configuração direta da API Moblix
const API_BASE_URL = 'https://api.moblix.com.br';
const TOKEN_ENDPOINT = '/api/Token';

// Credenciais
const CREDENTIALS = {
  username: 'TooGood',
  password: '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7'
};

async function testAuth() {
  try {
    console.log('🔑 Testando autenticação na API Moblix...');
    
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', CREDENTIALS.username);
    formData.append('password', CREDENTIALS.password);

    console.log('URL:', `${API_BASE_URL}${TOKEN_ENDPOINT}`);
    console.log('Dados:', formData.toString().replace(CREDENTIALS.password, '***'));

    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}${TOKEN_ENDPOINT}`,
      data: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Autenticação bem-sucedida!');
    console.log('Token type:', response.data.token_type);
    console.log('Expires in:', response.data.expires_in, 'seconds');
    
    return response.data.access_token;
  } catch (error) {
    console.error('❌ Erro na autenticação:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    throw error;
  }
}

// Executa o teste
testAuth()
  .then(token => {
    console.log('✅ Token obtido com sucesso');
    console.log('Token (primeiros 20 chars):', token.substring(0, 20) + '...');
  })
  .catch(error => {
    console.error('💥 Falha no teste de autenticação');
    process.exit(1);
  });
