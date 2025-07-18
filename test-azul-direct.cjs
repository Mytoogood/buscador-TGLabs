// Script para testar se a API tem voos da Azul diretamente
const https = require('https');

// Configuração da API Moblix (baseada nos logs)
const API_CONFIG = {
  baseUrl: 'https://api.moblix.com.br',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Função para fazer requisição à API
function makeRequest(path, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'api.moblix.com.br',
      port: 443,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': postData.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const jsonResponse = JSON.parse(body);
          resolve(jsonResponse);
        } catch (error) {
          reject(new Error(`Erro ao parsear JSON: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Teste da API
async function testAzulFlights() {
  console.log('🔍 TESTANDO BUSCA DIRETA POR VOOS DA AZUL...\n');
  
  // Parâmetros da busca (baseados nos logs)
  const searchParams = {
    Origem: 'GRU',
    Destino: 'GIG',
    Ida: '2025-07-10',
    Adultos: 1,
    Criancas: 0,
    Bebes: 0,
    companhia: 3  // Azul
  };
  
  console.log('📊 Parâmetros da busca:');
  console.log(JSON.stringify(searchParams, null, 2));
  
  try {
    console.log('\n🚀 Fazendo requisição para /aereo/api/consulta...');
    const response = await makeRequest('/aereo/api/consulta', searchParams);
    
    console.log('\n✅ Resposta recebida da API:');
    console.log('Status:', response.Success ? 'Sucesso' : 'Erro');
    console.log('Tem resultados:', response.HasResult);
    console.log('Mensagem de erro:', response.MensagemErro || 'Nenhuma');
    
    if (response.Data && Array.isArray(response.Data)) {
      console.log(`\n📊 Total de itens em Data: ${response.Data.length}`);
      
      if (response.Data.length > 0) {
        const firstItem = response.Data[0];
        console.log('Primeiro item:', JSON.stringify(firstItem, null, 2));
        
        if (firstItem.flights && Array.isArray(firstItem.flights)) {
          console.log(`\n✈️ Voos da Azul encontrados: ${firstItem.flights.length}`);
          
          if (firstItem.flights.length > 0) {
            console.log('\n🔍 Primeiro voo da Azul:');
            console.log(JSON.stringify(firstItem.flights[0], null, 2));
          }
        } else {
          console.log('\n❌ Nenhum voo encontrado na estrutura flights');
        }
      }
    }
    
  } catch (error) {
    console.error('\n❌ Erro na requisição:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 Dica: Verifique se você está conectado à internet e se a URL da API está correta.');
    }
  }
}

// Executar o teste
console.log('=== TESTE DE BUSCA DIRETA POR VOOS DA AZUL ===');
testAzulFlights().then(() => {
  console.log('\n✅ Teste concluído');
}).catch((error) => {
  console.error('\n❌ Erro no teste:', error.message);
});
