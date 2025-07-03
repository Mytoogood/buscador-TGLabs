import axios from 'axios';

// Teste com diferentes parâmetros
async function testDifferentParams() {
  try {
    console.log('🧪 Testando diferentes parâmetros de busca...');
    
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

    // Diferentes combinações para testar
    const testCases = [
      {
        name: 'GRU -> GIG (amanhã)',
        params: {
          origem: 'GRU',
          destino: 'GIG',
          ida: new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0],
          volta: null,
          adultos: 1,
          criancas: 0,
          bebes: 0,
          companhia: 1, // LATAM
          soIda: true,
          orderBy: 'tempo',
          numeroPagina: 1,
          quantidadePorPagina: 10
        }
      },
      {
        name: 'BSB -> GRU (daqui 3 dias)',
        params: {
          origem: 'BSB',
          destino: 'GRU',
          ida: new Date(Date.now() + 3*24*60*60*1000).toISOString().split('T')[0],
          volta: null,
          adultos: 1,
          criancas: 0,
          bebes: 0,
          companhia: 1,
          soIda: true,
          orderBy: 'tempo',
          numeroPagina: 1,
          quantidadePorPagina: 10
        }
      },
      {
        name: 'CGH -> SDU (daqui 5 dias)',
        params: {
          origem: 'CGH',
          destino: 'SDU',
          ida: new Date(Date.now() + 5*24*60*60*1000).toISOString().split('T')[0],
          volta: null,
          adultos: 1,
          criancas: 0,
          bebes: 0,
          companhia: 1,
          soIda: true,
          orderBy: 'tempo',
          numeroPagina: 1,
          quantidadePorPagina: 10
        }
      },
      {
        name: 'GRU -> GIG (sem companhia específica)',
        params: {
          origem: 'GRU',
          destino: 'GIG',
          ida: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0],
          volta: null,
          adultos: 1,
          criancas: 0,
          bebes: 0,
          companhia: null,
          soIda: true,
          orderBy: 'tempo',
          numeroPagina: 1,
          quantidadePorPagina: 10
        }
      }
    ];

    for (const testCase of testCases) {
      console.log(`\n📡 Testando: ${testCase.name}`);
      console.log('Parâmetros:', testCase.params);
      
      try {
        const response = await axios({
          method: 'post',
          url: 'http://localhost:3000/api/ConsultaAereo/Consultar',
          data: testCase.params,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        console.log('Status:', response.status);
        console.log('Success:', response.data.Success);
        console.log('HasResult:', response.data.HasResult);
        console.log('TotalItens:', response.data.TotalItens);
        
        if (response.data.Success && response.data.HasResult) {
          console.log('🎉 ENCONTROU VOOS!');
          console.log('Data:', JSON.stringify(response.data.Data, null, 2));
          return testCase;
        } else {
          console.log('❌ Sem voos ou erro:', response.data.MensagemErro || 'Nenhum voo encontrado');
        }
      } catch (error) {
        console.log('❌ Erro:', error.response?.data?.MensagemErro || error.message);
      }
    }

    console.log('\n💥 Nenhum teste funcionou. A API pode estar com problemas.');
    return null;
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    throw error;
  }
}

// Executa o teste
testDifferentParams()
  .then((result) => {
    if (result) {
      console.log('\n🎉 Teste bem-sucedido com:', result.name);
    } else {
      console.log('\n💥 Nenhum parâmetro funcionou');
    }
    process.exit(0);
  })
  .catch(() => {
    console.log('\n💥 Teste falhou completamente');
    process.exit(1);
  }); 