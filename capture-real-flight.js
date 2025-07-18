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

// Função para tentar capturar dados reais de voos
async function captureRealFlight() {
  try {
    console.log('🔍 Tentando capturar dados reais de voos...');
    
    const token = await getToken();
    
    // Tenta diferentes combinações de parâmetros
    const testCases = [
      {
        name: "CNF → CGH (hoje, todas companhias)",
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
      {
        name: "CNF → CGH (hoje, LATAM)",
        params: {
          "Origem": "CNF",
          "Destino": "CGH",
          "Ida": "2025-07-10",
          "Adultos": 1,
          "Criancas": 0,
          "Bebes": 0,
          "Companhia": 1
        }
      },
      {
        name: "CNF → CGH (amanhã)",
        params: {
          "Origem": "CNF",
          "Destino": "CGH",
          "Ida": "2025-07-11",
          "Adultos": 1,
          "Criancas": 0,
          "Bebes": 0,
          "Companhia": -1
        }
      },
      {
        name: "GRU → GIG (que sabemos que funciona)",
        params: {
          "Origem": "GRU",
          "Destino": "GIG",
          "Ida": "2025-07-15",
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
        console.log('  TotalItens:', response.data.TotalItens);
        
        if (response.data.Data && response.data.Data.length > 0) {
          const firstDataItem = response.data.Data[0];
          
          // Verifica estrutura nova (flights)
          if (firstDataItem.flights && Array.isArray(firstDataItem.flights)) {
            console.log(`  🆕 ESTRUTURA NOVA - flights: ${firstDataItem.flights.length} voos`);
            
            if (firstDataItem.flights.length > 0) {
              console.log('\n  ✈️ PRIMEIRO VOO (estrutura nova):');
              const firstFlight = firstDataItem.flights[0];
              console.log('    VOO COMPLETO:', JSON.stringify(firstFlight, null, 2));
              return; // Para aqui se encontrar voo
            }
          }
          
          // Verifica estrutura antiga (Ida)
          if (firstDataItem.Ida && Array.isArray(firstDataItem.Ida)) {
            console.log(`  🗂️ ESTRUTURA ANTIGA - Ida: ${firstDataItem.Ida.length} voos`);
            
            if (firstDataItem.Ida.length > 0) {
              console.log('\n  ✈️ PRIMEIRO VOO (estrutura antiga):');
              const firstFlight = firstDataItem.Ida[0];
              console.log('    VOO COMPLETO:', JSON.stringify(firstFlight, null, 2));
              return; // Para aqui se encontrar voo
            }
          }
          
          // Verifica outras propriedades
          console.log('  📋 Outras propriedades:');
          Object.keys(firstDataItem).forEach(key => {
            const value = firstDataItem[key];
            if (Array.isArray(value)) {
              console.log(`    ${key}: [Array com ${value.length} itens]`);
            } else if (typeof value === 'object' && value !== null) {
              console.log(`    ${key}: [Objeto]`);
            } else {
              console.log(`    ${key}: ${value}`);
            }
          });
        }
        
      } catch (error) {
        console.log(`  ❌ Erro: ${error.message}`);
      }
      
      // Espera um pouco entre as tentativas
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

captureRealFlight();
