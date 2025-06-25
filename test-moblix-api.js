/**
 * Exemplo de teste da API da Moblix
 * Demonstra como usar a API criada com as credenciais fornecidas
 */

// Configuração da API
const API_BASE_URL = 'http://localhost:3001';
const CREDENTIALS = {
  mbxUsername: 'TooGood',
  mbxPassword: '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7'
};

/**
 * Função para fazer login e obter o Bearer Token
 */
async function authenticateAPI() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(CREDENTIALS)
    });

    const data = await response.json();
    
    if (data.Success) {
      console.log('✅ Autenticação realizada com sucesso!');
      console.log('🔑 Bearer Token:', data.Data.bearerToken);
      return data.Data.bearerToken;
    } else {
      console.error('❌ Erro na autenticação:', data.MensagemErro);
      return null;
    }
  } catch (error) {
    console.error('❌ Erro ao conectar com a API:', error.message);
    return null;
  }
}

/**
 * Função para criar um bilhete usando a API
 */
async function criarBilhete(bearerToken) {
  const bilheteData = {
    "RequestId": "Teste-api-demo",
    "Email": "testemoblix@gmail.com",
    "IdExterno": "",
    "Passageiros": [
      {
        "Email": "testemoblix@gmail.com",
        "DDI": "55",
        "DDD": "61",
        "Telefone": "999999999",
        "TipoDocumento": "cpf",
        "PaisResidencia": null,
        "EmissaoDocumento": null,
        "TipoPassageiro": null,
        "Id": 0,
        "Nome": "João Silva",
        "Sobrenome": "Santos",
        "Nascimento": "1987-04-21T00:00:00-03:00",
        "Rg": null,
        "Cpf": "11901654060",
        "Sexo": "M",
        "IdPedido": null,
        "PaisEmissor": null,
        "NumeroDocumento": null,
        "ValidadeDocumento": null
      }
    ],
    "Ida": {
      "Token": "fa1f1ab21aae4105ab0af2c3f658d7d8"
    },
    "Volta": {
      "Token": "d176e0f3eb5a41f9a240e346c134884a"
    },
    "pagante": {
      "id": 0,
      "name": "João Silva Santos",
      "address": {
        "street": "Rua das Flores",
        "number": "123",
        "additional_details": "Apt 101",
        "zipcode": "01234567",
        "neighborhood": "Centro",
        "city": "São Paulo",
        "state": "SP",
        "country": "Brasil"
      },
      "phones": [
        {
          "DDD": "11",
          "DDI": "55",
          "number": "987654321"
        }
      ],
      "Nascimento": "1987-04-21T00:00:00-03:00"
    },
    "TokenConsultaIda": "8_Gol_55f0fc93f46242c1a22c734ff2654a73",
    "TokenConsultaVolta": "8_Gol_55f0fc93f46242c1a22c734ff2654a73",
    "IdMeioPagamento": 4, // Transferência
    "ValorTotal": 850.50
  };

  try {
    const response = await fetch(`${API_BASE_URL}/moblix-api/api/Pedido/EmitirPedido`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`
      },
      body: JSON.stringify(bilheteData)
    });

    const data = await response.json();
    
    if (data.Success) {
      console.log('✈️ Bilhete criado com sucesso!');
      console.log('📋 ID do Pedido:', data.Data[0].Id);
      console.log('💰 Valor Total: R$', data.Data[0].Viagem[0].ValorAdulto);
      console.log('🎫 Número do Voo:', data.Data[0].Viagem[0].Trecho[0].NumeroVoo);
      console.log('🛫 Origem → Destino:', 
        data.Data[0].Viagem[0].Trecho[0].IataOrigem, 
        '→', 
        data.Data[0].Viagem[0].Trecho[0].IataDestino
      );
      return data.Data[0];
    } else {
      console.error('❌ Erro ao criar bilhete:', data.MensagemErro);
      return null;
    }
  } catch (error) {
    console.error('❌ Erro ao criar bilhete:', error.message);
    return null;
  }
}

/**
 * Função para listar todos os bilhetes criados
 */
async function listarBilhetes(bearerToken) {
  try {
    const response = await fetch(`${API_BASE_URL}/moblix-api/api/Pedido/ListarBilhetes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      }
    });

    const data = await response.json();
    
    if (data.Success) {
      console.log(`📋 Total de bilhetes encontrados: ${data.TotalItens}`);
      data.Data.forEach((bilhete, index) => {
        console.log(`\n--- Bilhete ${index + 1} ---`);
        console.log(`ID: ${bilhete.Id}`);
        console.log(`Cliente: ${bilhete.Passageiro[0].Nome} ${bilhete.Passageiro[0].Sobrenome}`);
        console.log(`Voo: ${bilhete.Viagem[0].Trecho[0].NumeroVoo}`);
        console.log(`Rota: ${bilhete.Viagem[0].Trecho[0].IataOrigem} → ${bilhete.Viagem[0].Trecho[0].IataDestino}`);
        console.log(`Data Criação: ${new Date(bilhete.Criacao).toLocaleString('pt-BR')}`);
      });
      return data.Data;
    } else {
      console.error('❌ Erro ao listar bilhetes:', data.MensagemErro);
      return [];
    }
  } catch (error) {
    console.error('❌ Erro ao listar bilhetes:', error.message);
    return [];
  }
}

/**
 * Função para verificar status da API
 */
async function verificarStatusAPI() {
  try {
    const response = await fetch(`${API_BASE_URL}/moblix-api/status`);
    const data = await response.json();
    
    console.log('🟢 Status da API:', data.status);
    console.log('📅 Timestamp:', new Date(data.timestamp).toLocaleString('pt-BR'));
    console.log('🔧 Versão:', data.version);
    console.log('\n📍 Endpoints disponíveis:');
    Object.entries(data.endpoints).forEach(([name, endpoint]) => {
      console.log(`  ${name}: ${endpoint}`);
    });
    
    console.log('\n💳 Meios de pagamento suportados:');
    Object.entries(data.meiosPagamento).forEach(([id, descricao]) => {
      console.log(`  ${id}: ${descricao}`);
    });
    
    return data;
  } catch (error) {
    console.error('❌ Erro ao verificar status da API:', error.message);
    return null;
  }
}

/**
 * Função principal de demonstração
 */
async function demonstrarAPI() {
  console.log('🚀 Iniciando demonstração da API da Moblix\n');
  
  // 1. Verificar status da API
  console.log('1️⃣ Verificando status da API...');
  await verificarStatusAPI();
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // 2. Fazer autenticação
  console.log('2️⃣ Realizando autenticação...');
  const bearerToken = await authenticateAPI();
  
  if (!bearerToken) {
    console.log('❌ Não foi possível autenticar. Encerrando demonstração.');
    return;
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // 3. Criar um bilhete
  console.log('3️⃣ Criando um novo bilhete...');
  const novoBilhete = await criarBilhete(bearerToken);
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // 4. Listar todos os bilhetes
  console.log('4️⃣ Listando todos os bilhetes...');
  await listarBilhetes(bearerToken);
  
  console.log('\n✅ Demonstração concluída com sucesso!');
}

// Executar demonstração se o arquivo for executado diretamente
if (typeof window === 'undefined') {
  // Ambiente Node.js
  demonstrarAPI().catch(console.error);
} else {
  // Ambiente Browser
  console.log('🌐 Demonstração da API da Moblix carregada no browser');
  console.log('Execute demonstrarAPI() para iniciar o teste');
  window.demonstrarAPI = demonstrarAPI;
  window.verificarStatusAPI = verificarStatusAPI;
  window.authenticateAPI = authenticateAPI;
  window.criarBilhete = criarBilhete;
  window.listarBilhetes = listarBilhetes;
}

export { 
  demonstrarAPI, 
  verificarStatusAPI, 
  authenticateAPI, 
  criarBilhete, 
  listarBilhetes,
  API_BASE_URL,
  CREDENTIALS 
};
