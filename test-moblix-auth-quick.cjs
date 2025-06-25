// Teste rápido da autenticação Moblix usando a requisição curl que funciona
const https = require('https');
const querystring = require('querystring');

// Dados de autenticação
const authData = {
  grant_type: 'password',
  username: 'TooGood', 
  password: '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7'
};

// Converte os dados para formato URL-encoded
const postData = querystring.stringify(authData);

// Opções da requisição
const options = {
  hostname: 'api.moblix.com.br',
  port: 443,
  path: '/api/Token',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Origin': 'externo',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🔐 Testando autenticação da API Moblix...');
console.log('📡 Enviando requisição para:', `https://${options.hostname}${options.path}`);

// Faz a requisição
const req = https.request(options, (res) => {
  console.log(`📊 Status Code: ${res.statusCode}`);
  console.log('📋 Headers:', res.headers);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      
      if (res.statusCode === 200 && response.access_token) {
        console.log('✅ SUCESSO! Token obtido com sucesso!');
        console.log('🎫 Token:', response.access_token.substring(0, 50) + '...');
        console.log('⏰ Expira em:', response.expires_in, 'segundos (', Math.floor(response.expires_in / 3600), 'horas )');
        console.log('🏷️ Tipo:', response.token_type);
        
        // Decodifica o JWT para ver as informações (apenas a parte payload)
        try {
          const tokenParts = response.access_token.split('.');
          const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
          console.log('📄 Informações do token:');
          console.log('  - ID Agência:', payload.IdAgencia);
          console.log('  - Nome:', payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']);
          console.log('  - Data Login:', payload.DataLogin);
          console.log('  - Roles:', payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
        } catch (e) {
          console.log('⚠️ Não foi possível decodificar o token JWT');
        }
        
      } else {
        console.log('❌ ERRO! Falha na autenticação');
        console.log('📄 Resposta:', response);
      }
    } catch (error) {
      console.log('❌ ERRO! Resposta inválida:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ ERRO na requisição:', error);
});

// Envia os dados
req.write(postData);
req.end();

console.log('⏳ Aguardando resposta...');
