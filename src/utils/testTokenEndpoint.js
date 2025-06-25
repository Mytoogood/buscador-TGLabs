import axios from 'axios';

// Credenciais para autenticação
const AUTH_CREDENTIALS = {
  username: 'TooGood',
  password: '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7'
};

/**
 * Testa o endpoint de autenticação da API Moblix
 */
async function testTokenEndpoint() {
  console.log('Iniciando teste do endpoint de autenticação...');
  
  try {
    // Cria os dados do formulário
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', AUTH_CREDENTIALS.username);
    formData.append('password', AUTH_CREDENTIALS.password);

    console.log('Enviando requisição POST para https://api.moblix.com.br/api/Token');
    console.log('Headers:', {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Origin': 'externo',
      'Accept': 'application/json'
    });
    console.log('Body:', {
      grant_type: 'password',
      username: AUTH_CREDENTIALS.username,
      password: '***' // Não mostramos a senha real nos logs
    });

    // Faz a requisição POST para obter o token
    const response = await axios({
      method: 'post',
      url: 'https://api.moblix.com.br/api/Token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'externo',
        'Accept': 'application/json'
      },
      data: formData,
      // Habilita o debug da requisição
      // transformRequest: [(data, headers) => {
      //   console.log('Request Headers:', headers);
      //   console.log('Request Data:', data.toString());
      //   return data;
      // }]
    });


    console.log('\n✅ Autenticação bem-sucedida!');
    console.log('Resposta da API:', {
      'Token de Acesso': response.data.access_token ? '*** (token recebido com sucesso)' : 'Não recebido',
      'Tipo de Token': response.data.token_type || 'Não informado',
      'Expira em (segundos)': response.data.expires_in || 'Não informado'
    });
    
    return {
      success: true,
      token: response.data.access_token,
      tokenType: response.data.token_type,
      expiresIn: response.data.expires_in
    };
  } catch (error) {
    console.error('\n❌ Erro na autenticação:');
    
    if (error.response) {
      // A requisição foi feita e o servidor respondeu com um status fora do intervalo 2xx
      console.error('Status:', error.response.status);
      console.error('Dados da resposta:', error.response.data);
      console.error('Cabeçalhos:', error.response.headers);
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('Sem resposta do servidor. Verifique sua conexão.');
      console.error('Detalhes do erro:', error.message);
    } else {
      // Ocorreu um erro ao configurar a requisição
      console.error('Erro ao configurar a requisição:', error.message);
    }
    
    return {
      success: false,
      error: error.message,
      status: error.response?.status,
      data: error.response?.data
    };
  }
}

// Executa o teste
testTokenEndpoint()
  .then(result => {
    if (result.success) {
      console.log('\n✅ Teste concluído com sucesso!');
      console.log('Token obtido com sucesso!');
    } else {
      console.error('\n❌ Falha no teste de autenticação');
    }
  })
  .catch(error => {
    console.error('\n❌ Erro inesperado ao testar autenticação:', error);
  });

export default testTokenEndpoint;
