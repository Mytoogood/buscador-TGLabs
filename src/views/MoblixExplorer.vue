<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Explorador da API Moblix</h1>
    
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Informações de Autenticação</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Usuário</label>
          <div class="mt-1">
            <input 
              type="text" 
              v-model="username" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              readonly
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Status da Autenticação</label>
          <div class="mt-1">
            <span 
              :class="{
                'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full': true,
                'bg-green-100 text-green-800': authStatus === 'Autenticado',
                'bg-yellow-100 text-yellow-800': authStatus === 'Verificando...',
                'bg-red-100 text-red-800': authStatus === 'Não autenticado'
              }"
            >
              {{ authStatus }}
            </span>
          </div>
        </div>
      </div>
      
      <div class="mt-4 space-x-4">
        <button
          @click="testAuthentication"
          :disabled="isAuthTesting"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300"
        >
          <span v-if="isAuthTesting">Autenticando...</span>
          <span v-else>Testar Autenticação</span>
        </button>
        
        <button
          @click="testEndpoints"
          :disabled="isTesting"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          <span v-if="isTesting">Testando...</span>
          <span v-else>Testar Endpoints</span>
        </button>
        
        <button
          @click="logout"
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
    
    <div v-if="testResults.length > 0" class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">Resultados dos Testes</h2>
      
      <div v-for="(result, index) in testResults" :key="index" class="mb-6 border-b pb-4">
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-medium">
            {{ result.method }} {{ result.endpoint }}
          </h3>
          <span 
            :class="{
              'px-2 py-1 text-xs rounded': true,
              'bg-green-100 text-green-800': result.status === 'SUCESSO',
              'bg-red-100 text-red-800': result.status !== 'SUCESSO'
            }"
          >
            {{ result.status }}
          </span>
        </div>
        
        <div v-if="result.error" class="bg-red-50 p-3 rounded-md text-red-700 text-sm mb-2">
          {{ result.error }}
        </div>
        
        <div v-if="result.data" class="bg-gray-50 p-3 rounded-md overflow-x-auto">
          <pre class="text-xs">{{ formatData(result.data) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import moblixService from '@/services/moblixService';
import moblixAuth from '@/services/moblixAuth';

export default {
  name: 'MoblixExplorer',
  
  setup() {
    const username = ref('TooGood');
    const authStatus = ref('Verificando...');
    const isTesting = ref(false);
    const isAuthTesting = ref(false);
    const testResults = ref([]);
    
    // Endpoints para testar
    const endpointsToTest = [
      { method: 'get', endpoint: '/api/Account/Info', description: 'Informações da conta' },
      { method: 'get', endpoint: '/api/Milhas/Saldo', description: 'Saldo de milhas' },
      { method: 'get', endpoint: '/api/Transacoes/Ultimas', description: 'Últimas transações' },
      { method: 'get', endpoint: '/api/Cotacoes', description: 'Cotações de milhas' },
      { method: 'get', endpoint: '/api/Clientes', description: 'Lista de clientes' },
    ];
    
    // Formata os dados para exibição
    const formatData = (data) => {
      if (typeof data === 'string') return data;
      return JSON.stringify(data, null, 2);
    };
    
    // Testa os endpoints da API
    const testEndpoints = async () => {
      isTesting.value = true;
      testResults.value = [];
      
      try {
        // Verifica autenticação
        authStatus.value = 'Verificando...';
        const isAuthenticated = await moblixService.checkAuth();
        
        if (!isAuthenticated) {
          authStatus.value = 'Não autenticado';
          throw new Error('Não foi possível autenticar com a API Moblix');
        }
        
        authStatus.value = 'Autenticado';
        
        // Testa cada endpoint
        for (const { method, endpoint, description } of endpointsToTest) {
          try {
            const response = await moblixService.request(method, endpoint);
            testResults.value.push({
              method: method.toUpperCase(),
              endpoint,
              description,
              status: 'SUCESSO',
              data: response || 'Sem dados retornados'
            });
          } catch (error) {
            testResults.value.push({
              method: method.toUpperCase(),
              endpoint,
              description,
              status: `ERRO ${error.response?.status || 'DESCONHECIDO'}`,
              error: error.message,
              data: error.response?.data || null
            });
          }
        }
      } catch (error) {
        console.error('Erro ao testar API Moblix:', error);
        testResults.value.push({
          method: 'N/A',
          endpoint: 'Autenticação',
          description: 'Verificação de autenticação',
          status: 'ERRO',
          error: error.message
        });
      } finally {
        isTesting.value = false;
      }
    };
    
    // Inicializa o componente
    const init = async () => {
      try {
        const isAuthenticated = await moblixService.checkAuth();
        authStatus.value = isAuthenticated ? 'Autenticado' : 'Não autenticado';
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        authStatus.value = 'Erro ao verificar autenticação';
      }
    };
    
    // Testa a autenticação diretamente
    const testAuthentication = async () => {
      isAuthTesting.value = true;
      testResults.value = [];
      
      try {
        console.log('🔐 Iniciando teste de autenticação...');
        
        // Limpa autenticação anterior
        moblixAuth.logout();
        authStatus.value = 'Testando...';
        
        // Tenta fazer login
        const loginResult = await moblixAuth.login();
        
        if (loginResult.success) {
          authStatus.value = 'Autenticado';
          
          // Adiciona resultado do teste
          testResults.value.push({
            method: 'POST',
            endpoint: '/api/Token',
            description: 'Autenticação com a API Moblix',
            status: 'SUCESSO',
            data: {
              message: 'Login realizado com sucesso!',
              token: loginResult.token.substring(0, 50) + '...',
              expires_in: `${Math.floor(loginResult.expiresIn / 3600)} horas`,
              expires_at: new Date(loginResult.expiresAt).toLocaleString()
            }
          });
          
          console.log('✅ Autenticação realizada com sucesso!');
        } else {
          throw new Error('Falha na autenticação');
        }
        
      } catch (error) {
        console.error('❌ Erro na autenticação:', error);
        authStatus.value = 'Erro na autenticação';
        
        testResults.value.push({
          method: 'POST',
          endpoint: '/api/Token',
          description: 'Autenticação com a API Moblix',
          status: 'ERRO',
          error: error.message
        });
      } finally {
        isAuthTesting.value = false;
      }
    };
    
    // Função de logout
    const logout = () => {
      console.log('🚪 Fazendo logout...');
      moblixAuth.logout();
      authStatus.value = 'Não autenticado';
      testResults.value = [];
      
      // Adiciona resultado do logout
      testResults.value.push({
        method: 'LOGOUT',
        endpoint: 'Local',
        description: 'Logout da aplicação',
        status: 'SUCESSO',
        data: { message: 'Logout realizado com sucesso!' }
      });
      
      console.log('✅ Logout realizado!');
    };
    
    // Verifica autenticação ao montar o componente
    onMounted(async () => {
      try {
        const isAuthenticated = moblixAuth.isAuthenticated();
        authStatus.value = isAuthenticated ? 'Autenticado' : 'Não autenticado';
        
        if (isAuthenticated) {
          console.log('✅ Usuário já está autenticado');
        } else {
          console.log('ℹ️ Usuário não está autenticado');
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        authStatus.value = 'Erro ao verificar';
      }
    });
    
    return {
      username,
      authStatus,
      isTesting,
      isAuthTesting,
      testResults,
      testEndpoints,
      testAuthentication,
      logout,
      formatData
    };
  }
};
</script>
