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

    return response.data.access_token;
  } catch (error) {
    console.error('❌ Erro ao obter token:', error.message);
    throw error;
  }
}

// Função para investigar a estrutura real
async function investigateStructure() {
  try {
    console.log('🔍 Investigando estrutura real dos dados...');
    
    const token = await getToken();
    
    const searchParams = {
      "Origem": "CNF",
      "Destino": "CGH",
      "Ida": "2025-07-10",
      "Adultos": 1,
      "Criancas": 0,
      "Bebes": 0,
      "Companhia": -1
    };
    
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
    
    console.log('\n📊 ESTRUTURA COMPLETA DA RESPOSTA:');
    console.log('Success:', response.data.Success);
    console.log('TotalItens:', response.data.TotalItens);
    
    if (response.data.Data && response.data.Data.length > 0) {
      const firstDataItem = response.data.Data[0];
      
      console.log('\n🔍 PROPRIEDADES DO PRIMEIRO DATA ITEM:');
      Object.keys(firstDataItem).forEach(key => {
        const value = firstDataItem[key];
        if (Array.isArray(value)) {
          console.log(`${key}: [Array com ${value.length} itens]`);
        } else if (typeof value === 'object' && value !== null) {
          console.log(`${key}: [Objeto com ${Object.keys(value).length} propriedades]`);
        } else {
          console.log(`${key}: ${typeof value} = ${value}`);
        }
      });
      
      if (firstDataItem.flights && firstDataItem.flights.length > 0) {
        console.log('\n✈️ ESTRUTURA DO PRIMEIRO VOO:');
        const firstFlight = firstDataItem.flights[0];
        console.log('Primeiro voo completo:', JSON.stringify(firstFlight, null, 2));
        
        console.log('\n📋 PROPRIEDADES DO PRIMEIRO VOO:');
        Object.keys(firstFlight).forEach(key => {
          const value = firstFlight[key];
          if (Array.isArray(value)) {
            console.log(`${key}: [Array com ${value.length} itens]`);
            if (value.length > 0) {
              console.log(`  Primeiro item: ${JSON.stringify(value[0], null, 2)}`);
            }
          } else if (typeof value === 'object' && value !== null) {
            console.log(`${key}: [Objeto] ${JSON.stringify(value, null, 2)}`);
          } else {
            console.log(`${key}: ${typeof value} = ${value}`);
          }
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Erro na investigação:', error.message);
  }
}

investigateStructure();
