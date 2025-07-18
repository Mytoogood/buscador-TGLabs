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

// Função para buscar voos com diferentes parâmetros
async function searchFlights(token, searchParams) {
  try {
    console.log('\n🔍 Buscando voos...');
    console.log('📡 Parâmetros:', searchParams);

    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/api/ConsultaAereo/Consultar`,
      data: searchParams,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      timeout: 30000
    });

    console.log('\n📊 RESPOSTA DA API:');
    console.log('Success:', response.data.Success);
    console.log('HasResult:', response.data.HasResult);
    console.log('TotalItens:', response.data.TotalItens);
    console.log('MensagemErro:', response.data.MensagemErro);
    console.log('Data Length:', response.data.Data?.length || 0);

    if (response.data.Success && response.data.Data && response.data.Data.length > 0) {
      console.log('\n📋 ESTRUTURA DOS DADOS:');
      console.log('Tipo de Data:', typeof response.data.Data);
      console.log('É array?', Array.isArray(response.data.Data));
      
      // Mostrar o primeiro elemento completo
      console.log('\n🔍 PRIMEIRO ELEMENTO COMPLETO:');
      console.log(JSON.stringify(response.data.Data[0], null, 2));
      
      // Explorar propriedades do primeiro elemento
      const firstElement = response.data.Data[0];
      console.log('\n🧭 PROPRIEDADES DO PRIMEIRO ELEMENTO:');
      Object.keys(firstElement).forEach(key => {
        const value = firstElement[key];
        const type = typeof value;
        const isArray = Array.isArray(value);
        
        if (isArray) {
          console.log(`${key}: [Array com ${value.length} itens]`);
          if (value.length > 0) {
            console.log(`  Primeiro item do array:`, JSON.stringify(value[0], null, 2));
          }
        } else if (type === 'object' && value !== null) {
          console.log(`${key}: [Objeto] ${JSON.stringify(value, null, 2)}`);
        } else {
          console.log(`${key}: ${type} = ${value}`);
        }
      });
    }

    return response.data;
  } catch (error) {
    console.error('❌ Erro na busca:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    return null;
  }
}

// Função principal
async function main() {
  try {
    console.log('🚀 Iniciando busca de voos na API Moblix...');
    
    // Obter token
    const token = await getToken();
    
    // Teste 1: Busca básica
    console.log('\n═══════════════════════════════════════');
    console.log('📍 TESTE 1: Busca básica GRU → GIG');
    console.log('═══════════════════════════════════════');
    
    const searchParams1 = {
      "Origem": "GRU",
      "Destino": "GIG",
      "Ida": "2025-07-20",
      "Adultos": 1,
      "Criancas": 0,
      "Bebes": 0,
      "Companhia": 1
    };
    
    const result1 = await searchFlights(token, searchParams1);
    
    // Teste 2: Busca com todas as companhias
    console.log('\n═══════════════════════════════════════');
    console.log('📍 TESTE 2: Busca com todas as companhias');
    console.log('═══════════════════════════════════════');
    
    const searchParams2 = {
      "Origem": "BSB",
      "Destino": "GRU",
      "Ida": "2025-07-25",
      "Adultos": 1,
      "Criancas": 0,
      "Bebes": 0,
      "Companhia": -1
    };
    
    const result2 = await searchFlights(token, searchParams2);
    
    // Teste 3: Busca com data mais próxima
    console.log('\n═══════════════════════════════════════');
    console.log('📍 TESTE 3: Busca com data mais próxima');
    console.log('═══════════════════════════════════════');
    
    const searchParams3 = {
      "Origem": "GRU",
      "Destino": "BSB",
      "Ida": "2025-07-12",
      "Adultos": 1,
      "Criancas": 0,
      "Bebes": 0,
      "Companhia": 2
    };
    
    const result3 = await searchFlights(token, searchParams3);
    
    // Resumo
    console.log('\n═══════════════════════════════════════');
    console.log('📊 RESUMO DOS TESTES:');
    console.log('═══════════════════════════════════════');
    console.log('Teste 1 (LATAM):', result1?.Success ? '✅ Sucesso' : '❌ Falhou');
    console.log('Teste 2 (Todas):', result2?.Success ? '✅ Sucesso' : '❌ Falhou');
    console.log('Teste 3 (GOL):', result3?.Success ? '✅ Sucesso' : '❌ Falhou');
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

main();
