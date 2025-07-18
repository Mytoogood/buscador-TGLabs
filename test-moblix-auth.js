import fetch from 'node-fetch';

const testMoblixAuth = async () => {
  console.log('🧪 Testando autenticação direta com a API Moblix...');
  
  const formData = new URLSearchParams();
  formData.append('grant_type', 'password');
  formData.append('username', 'TooGood');
  formData.append('password', '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7');

  try {
    const response = await fetch('https://api.moblix.com.br/api/Token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: formData
    });

    console.log('📊 Status da resposta:', response.status);
    console.log('📊 Headers da resposta:', Object.fromEntries(response.headers));
    
    const responseText = await response.text();
    console.log('📊 Resposta bruta:', responseText);
    
    if (response.ok) {
      const data = JSON.parse(responseText);
      console.log('✅ Autenticação bem-sucedida!');
      console.log('🔑 Token:', data.access_token?.substring(0, 50) + '...');
      console.log('⏰ Expira em:', data.expires_in, 'segundos');
      return data.access_token;
    } else {
      console.log('❌ Falha na autenticação');
      const errorData = JSON.parse(responseText);
      console.log('💥 Erro:', errorData);
    }
  } catch (error) {
    console.error('💥 Erro na requisição:', error.message);
  }
};

// Teste de busca de aeroportos com token
const testAirportSearch = async (token) => {
  if (!token) {
    console.log('❌ Sem token para testar busca de aeroportos');
    return;
  }

  console.log('\n🛫 Testando busca de aeroportos...');
  
  try {
    const response = await fetch('https://api.moblix.com.br/aereo/api/aeroporto?filtro=sao', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    console.log('📊 Status da busca:', response.status);
    const responseText = await response.text();
    console.log('📊 Resposta da busca:', responseText.substring(0, 500) + '...');
    
    if (response.ok) {
      const data = JSON.parse(responseText);
      console.log('✅ Busca de aeroportos bem-sucedida!');
      console.log('🛫 Aeroportos encontrados:', data.length || 'N/A');
    }
  } catch (error) {
    console.error('💥 Erro na busca de aeroportos:', error.message);
  }
};

// Executa os testes
(async () => {
  const token = await testMoblixAuth();
  if (token) {
    await testAirportSearch(token);
  }
})();
