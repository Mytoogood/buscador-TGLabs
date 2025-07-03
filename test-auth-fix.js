import axios from 'axios';

// Teste da URL corrigida
async function testAuthFix() {
  try {
    console.log('🧪 Testando correção da URL de autenticação...');
    
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', 'TooGood');
    formData.append('password', '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7');

    // URL corrigida: /api/Token (não mais /api/api/Token)
    const response = await axios({
      method: 'post',
      url: 'http://localhost:3000/api/Token',
      data: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    });

    console.log('✅ Autenticação funcionou!');
    console.log('Status:', response.status);
    console.log('Token obtido:', response.data.access_token ? 'Sim' : 'Não');
    
    if (response.data.access_token) {
      console.log('Token (primeiros 20 chars):', response.data.access_token.substring(0, 20) + '...');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Erro na autenticação:');
    console.error('Status:', error.response?.status);
    console.error('URL tentada:', error.config?.url);
    console.error('Mensagem:', error.message);
    
    if (error.response?.data) {
      console.error('Resposta do servidor:', error.response.data);
    }
    
    throw error;
  }
}

// Executa o teste
testAuthFix()
  .then(() => {
    console.log('🎉 Teste concluído com sucesso!');
    process.exit(0);
  })
  .catch(() => {
    console.log('💥 Teste falhou!');
    process.exit(1);
  }); 