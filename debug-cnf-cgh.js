import axios from 'axios';

// Configuração da API Moblix
const API_BASE_URL = 'https://api.moblix.com.br';
const CREDENTIALS = {
  username: 'TooGood',
  password: '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7'
};

// Função para obter token
async function getToken() {
  try {
    console.log('🔐 Obtendo token de acesso...');
    
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', CREDENTIALS.username);
    formData.append('password', CREDENTIALS.password);

    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/api/Token`,
      data: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Origin': 'externo'
      },
      timeout: 10000
    });

    console.log('✅ Token obtido com sucesso!');
    return response.data.access_token;
  } catch (error) {
    console.error('❌ Erro ao obter token:', error.response?.data || error.message);
    throw error;
  }
}

// Função para testar diferentes rotas e datas
async function testMultipleRoutes(token) {
  const testCases = [
    // Caso atual que está falhando
    {
      name: "CNF → CGH (hoje)",
      params: {
        "Origem": "CNF",
        "Destino": "CGH", 
        "Ida": "2025-07-10",
        "Adultos": 1,
        "Criancas": 0,
        "Bebes": 0,
        "Companhia": -1
      }
    },
    // Teste com data futura
    {
      name: "CNF → CGH (futuro)",
      params: {
        "Origem": "CNF",
        "Destino": "CGH",
        "Ida": "2025-07-20",
        "Adultos": 1,
        "Criancas": 0,
        "Bebes": 0,
        "Companhia": -1
      }
    },
    // Teste com rota mais comum
    {
      name: "CNF → GRU (comum)",
      params: {
        "Origem": "CNF",
        "Destino": "GRU",
        "Ida": "2025-07-20",
        "Adultos": 1,
        "Criancas": 0,
        "Bebes": 0,
        "Companhia": -1
      }
    },
    // Teste com rota que sabemos que funciona
    {
      name: "GRU → GIG (conhecida)",
      params: {
        "Origem": "GRU",
        "Destino": "GIG",
        "Ida": "2025-07-20",
        "Adultos": 1,
        "Criancas": 0,
        "Bebes": 0,
        "Companhia": 1
      }
    }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`\n🔍 TESTANDO: ${testCase.name}`);
      console.log('Parâmetros:', testCase.params);

      const response = await axios({
        method: 'post',
        url: `${API_BASE_URL}/api/ConsultaAereo/Consultar`,
        data: testCase.params,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        timeout: 30000
      });

      console.log('📊 Resultado:');
      console.log('  Success:', response.data.Success);
      console.log('  HasResult:', response.data.HasResult);
      console.log('  TotalItens:', response.data.TotalItens);
      console.log('  Data Length:', response.data.Data?.length || 0);

      if (response.data.Data && response.data.Data.length > 0) {
        const firstData = response.data.Data[0];
        
        // Verifica estrutura antiga (Ida)
        if (firstData.Ida && Array.isArray(firstData.Ida)) {
          console.log('  Estrutura ANTIGA - Ida:', firstData.Ida.length, 'voos');
        }
        
        // Verifica estrutura nova (flights)
        if (firstData.flights && Array.isArray(firstData.flights)) {
          console.log('  Estrutura NOVA - flights:', firstData.flights.length, 'voos');
        }
        
        // Verifica outras propriedades
        console.log('  ActiveProviders:', firstData.ActiveProviders?.length || 0);
        console.log('  Meta countFlights:', firstData.meta?.countFlights || 0);
      }

    } catch (error) {
      console.error(`❌ Erro no teste ${testCase.name}:`, error.message);
    }
  }
}

// Função principal
async function main() {
  try {
    console.log('🚀 Investigando problema CNF → CGH...');
    
    const token = await getToken();
    await testMultipleRoutes(token);
    
    console.log('\n📋 CONCLUSÕES:');
    console.log('1. Verificar se a rota CNF → CGH tem voos disponíveis');
    console.log('2. Testar com datas futuras em vez de hoje');
    console.log('3. Verificar se a API mudou a estrutura de resposta');
    console.log('4. Considerar rotas com conexões (CNF → GRU → CGH)');
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

main();
