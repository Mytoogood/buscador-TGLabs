// Script para testar e debugar a API Moblix
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5173'; // Usando o proxy local

// Função para testar autenticação
async function testAuth() {
  try {
    console.log('🔐 Testando autenticação...');
    
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', 'TooGood');
    formData.append('password', '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7');

    const response = await axios.post(`${API_BASE_URL}/api/Token`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      }
    });

    console.log('✅ Autenticação bem-sucedida!');
    console.log('Token:', response.data.access_token?.substring(0, 50) + '...');
    return response.data.access_token;
  } catch (error) {
    console.error('❌ Erro na autenticação:', error.response?.data || error.message);
    return null;
  }
}

// Função para testar busca de voos
async function testFlightSearch(token) {
  try {
    console.log('✈️ Testando busca de voos...');
    
    const searchData = {
      Origem: 'CGH',
      Destino: 'GIG', 
      Ida: '2025-01-15',
      Adultos: 1,
      Criancas: 0,
      Bebes: 0,
      Companhia: 1
    };

    const response = await axios.post(`${API_BASE_URL}/api/ConsultaAereo/Consultar`, searchData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Busca de voos bem-sucedida!');
    console.log('Voos encontrados:', response.data?.Data?.length || 0);
    
    if (response.data?.Data?.length > 0) {
      console.log('Primeiro voo:', {
        companhia: response.data.Data[0].CompanhiaAerea,
        preco: response.data.Data[0].PrecoAdulto,
        origem: response.data.Data[0].Origem,
        destino: response.data.Data[0].Destino
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Erro na busca de voos:', error.response?.data || error.message);
    return null;
  }
}

// Função para testar busca de aeroportos
async function testAirportSearch() {
  try {
    console.log('🛫 Testando busca de aeroportos...');
    
    const response = await axios.get(`${API_BASE_URL}/aereo/api/aeroporto?filtro=sao`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    console.log('✅ Busca de aeroportos bem-sucedida!');
    console.log('Aeroportos encontrados:', response.data?.length || 0);
    return response.data;
  } catch (error) {
    console.error('❌ Erro na busca de aeroportos:', error.response?.data || error.message);
    return null;
  }
}

// Executar todos os testes
async function runTests() {
  console.log('🚀 Iniciando testes da API Moblix...\n');
  
  // Teste 1: Autenticação
  const token = await testAuth();
  console.log('\n');
  
  // Teste 2: Busca de aeroportos (não precisa de token)
  await testAirportSearch();
  console.log('\n');
  
  // Teste 3: Busca de voos (precisa de token)
  if (token) {
    await testFlightSearch(token);
  } else {
    console.log('⚠️ Pulando teste de busca de voos (sem token)');
  }
  
  console.log('\n🏁 Testes concluídos!');
}

// Executar
runTests().catch(console.error);
