import axios from 'axios';

// Teste de outros endpoints da API Moblix
async function testOtherEndpoints() {
  try {
    console.log('🧪 Testando outros endpoints da API Moblix...');
    
    // Obter token
    const authFormData = new URLSearchParams();
    authFormData.append('grant_type', 'password');
    authFormData.append('username', 'TooGood');
    authFormData.append('password', '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7');

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
    console.log('✅ Token obtido');

    // Testar diferentes endpoints
    const endpoints = [
      {
        name: 'Listar Aeroportos',
        url: 'http://localhost:3000/moblix-api/api/ConsultaAereo/Aeroportos?filtro=gru',
        method: 'post'
      },
      {
        name: 'Listar Companhias',
        url: 'http://localhost:3000/moblix-api/api/ConsultaAereo/Companhias',
        method: 'post'
      },
      {
        name: 'Listar Produtos',
        url: 'http://localhost:3000/product/api/products',
        method: 'get'
      },
      {
        name: 'Listar Inventário',
        url: 'http://localhost:3000/product/api/inventory',
        method: 'get'
      },
      {
        name: 'Listar Pessoas',
        url: 'http://localhost:3000/moblix-api/api/Pessoa/Listar',
        method: 'post'
      },
      {
        name: 'Busca de Voos (formato alternativo)',
        url: 'http://localhost:3000/api/ConsultaAereo/Consultar',
        method: 'post',
        data: {
          Origem: 'GRU',
          Destino: 'GIG',
          Ida: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0],
          Adultos: 1,
          Criancas: 0,
          Bebes: 0,
          Companhia: 1
        }
      }
    ];

    for (const endpoint of endpoints) {
      console.log(`\n📡 Testando: ${endpoint.name}`);
      console.log('URL:', endpoint.url);
      
      try {
        const config = {
          method: endpoint.method,
          url: endpoint.url,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        };

        if (endpoint.data) {
          config.data = endpoint.data;
        }

        const response = await axios(config);
        
        console.log('Status:', response.status);
        console.log('Success:', response.data?.Success);
        console.log('HasResult:', response.data?.HasResult);
        console.log('TotalItens:', response.data?.TotalItens);
        
        if (response.data && (response.data.Success || Array.isArray(response.data))) {
          console.log('✅ Endpoint funcionando!');
          if (Array.isArray(response.data)) {
            console.log('Array com', response.data.length, 'itens');
            if (response.data.length > 0) {
              console.log('Primeiro item:', JSON.stringify(response.data[0], null, 2));
            }
          } else if (response.data.Data && Array.isArray(response.data.Data)) {
            console.log('Data array com', response.data.Data.length, 'itens');
            if (response.data.Data.length > 0) {
              console.log('Primeiro item:', JSON.stringify(response.data.Data[0], null, 2));
            }
          }
        } else {
          console.log('❌ Sem dados ou erro:', response.data?.MensagemErro || 'Nenhum resultado');
        }
      } catch (error) {
        console.log('❌ Erro:', error.response?.data?.MensagemErro || error.message);
      }
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    throw error;
  }
}

// Executa o teste
testOtherEndpoints()
  .then(() => {
    console.log('\n🎉 Teste de endpoints concluído!');
    process.exit(0);
  })
  .catch(() => {
    console.log('\n💥 Teste falhou!');
    process.exit(1);
  }); 