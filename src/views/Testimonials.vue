<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Cabeçalho -->
    <div class="text-center mb-16">
      <h1 class="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary-400 via-accent-light to-white mb-6">
        Depoimentos
      </h1>
      <p class="text-xl text-accent-light/90 max-w-3xl mx-auto">
        Veja o que nossos clientes e alunos estão falando sobre as experiências com as milhas e viagens
      </p>
    </div>

    <!-- Status da API -->
    <div class="mb-12 bg-primary-800/30 p-6 rounded-xl border border-primary-700/50">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-semibold text-white">Status da API</h2>
        <button 
          @click="testApiConnection" 
          class="px-4 py-2 bg-secondary-600 hover:bg-secondary-500 text-white rounded-md transition-colors"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">Testar Conexão</span>
          <span v-else>Testando...</span>
        </button>
      </div>

      <div v-if="isLoading" class="flex items-center space-x-2 text-accent-light">
        <div class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-accent-light"></div>
        <span>Conectando à API Moblix...</span>
      </div>

      <div v-else-if="error" class="bg-red-900/30 border-l-4 border-red-500 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-300" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-300">
              {{ error }}
            </p>
          </div>
        </div>
      </div>

      <div v-else-if="apiData" class="space-y-4">
        <div class="bg-green-900/30 border-l-4 border-green-500 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-300" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-green-300">
                Conexão com a API Moblix estabelecida com sucesso!
              </p>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <h3 class="text-lg font-medium text-white mb-3">Dados Recebidos:</h3>
          <div class="bg-primary-900/50 rounded-lg p-4 overflow-x-auto">
            <pre class="text-sm text-accent-light">{{ JSON.stringify(apiData, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid de Depoimentos -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
      <!-- Depoimento 1 -->
      <div class="bg-primary-800/50 p-6 rounded-2xl border border-primary-700/30 shadow-lg transform transition-all duration-300 hover:scale-105">
        <div class="flex items-center mb-4">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center text-xl font-bold text-primary-900 mr-4">AM</div>
          <div>
            <h3 class="font-bold text-white">Ana M.</h3>
            <div class="flex text-yellow-400">
              <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        </div>
        <p class="text-accent-light/90">"Graças às estratégias do Júlio, consegui viajar para a Europa em primeira classe com minha família. Nunca imaginei que seria possível!"</p>
      </div>

      <!-- Depoimento 2 -->
      <div class="bg-primary-800/50 p-6 rounded-2xl border border-primary-700/30 shadow-lg transform transition-all duration-300 hover:scale-105">
        <div class="flex items-center mb-4">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center text-xl font-bold text-primary-900 mr-4">RC</div>
          <div>
            <h3 class="font-bold text-white">Ricardo C.</h3>
            <div class="flex text-yellow-400">
              <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        </div>
        <p class="text-accent-light/90">"O curso do Júlio mudou completamente minha forma de ver as milhas. Em 6 meses já acumulei milhas suficientes para viajar para o Caribe!"</p>
      </div>

      <!-- Depoimento 3 -->
      <div class="bg-primary-800/50 p-6 rounded-2xl border border-primary-700/30 shadow-lg transform transition-all duration-300 hover:scale-105">
        <div class="flex items-center mb-4">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center text-xl font-bold text-primary-900 mr-4">FS</div>
          <div>
            <h3 class="font-bold text-white">Fernanda S.</h3>
            <div class="flex text-yellow-400">
              <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        </div>
        <p class="text-accent-light/90">"Depois de anos tentando entender como funcionavam as milhas, encontrei o Júlio. Em 3 meses já tinha milhas para viajar para a Disney com meus filhos!"</p>
      </div>

      <!-- Mais depoimentos podem ser adicionados aqui -->
    </div>

    <!-- CTA Final -->
    <div class="text-center bg-gradient-to-r from-secondary-500/10 to-primary-800/30 rounded-2xl p-12 border border-primary-700/30">
      <h2 class="text-3xl font-bold text-white mb-6">Quer fazer parte dessa jornada?</h2>
      <p class="text-xl text-accent-light/90 mb-8 max-w-2xl mx-auto">Junte-se a milhares de pessoas que já estão transformando seus sonhos de viagem em realidade com as estratégias do Júlio Martins.</p>
      <router-link 
        to="/register" 
        class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-400 hover:to-secondary-500 text-primary-900 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-900 focus:ring-secondary-500/50"
      >
        <span>Começar Agora</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import moblixAuth from '@/services/moblixAuth';

export default {
  name: 'TestimonialsView',
  setup() {
    const isLoading = ref(false);
    const apiData = ref(null);
    const error = ref(null);

    // Função para testar a conexão com a API
    const testApiConnection = async () => {
      isLoading.value = true;
      error.value = null;
      apiData.value = null;
      
      try {
        console.log('Iniciando teste de autenticação com a API Moblix...');
        
        // Usando o novo serviço de autenticação Moblix
        console.log('Iniciando autenticação com moblixAuth...');
        const authResult = await moblixAuth.login();
        
        if (authResult && authResult.success) {
          console.log('Autenticação bem-sucedida!', authResult);
          
          // Mostra informações do token de forma segura
          const tokenStr = String(authResult.token);
          
          // Decodifica informações básicas do JWT
          let userInfo = {};
          try {
            const tokenParts = authResult.token.split('.');
            const payload = JSON.parse(atob(tokenParts[1]));
            userInfo = {
              agencia_id: payload.IdAgencia,
              usuario: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
              data_login: payload.DataLogin,
              roles: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']?.slice(0, 3) || [] // Primeiras 3 roles
            };
          } catch (e) {
            console.warn('Não foi possível decodificar o token JWT');
          }
          
          apiData.value = { 
            message: 'Conexão com API Moblix estabelecida com sucesso!',
            status: 'Conectado',
            token_type: authResult.tokenType,
            expires_in: `${Math.floor(authResult.expiresIn / 3600)} horas`,
            expires_at: new Date(authResult.expiresAt).toLocaleString('pt-BR'),
            token_preview: tokenStr.substring(0, 15) + '...' + tokenStr.slice(-10),
            user_info: userInfo
          };
          
          return true;
        } else {
          throw new Error('Falha na autenticação com a API Moblix');
        }
      } catch (err) {
        console.error('Erro ao conectar com a API Moblix:', err);
        
        if (err.code === 'ECONNABORTED') {
          error.value = 'A requisição demorou muito. Verifique sua conexão e tente novamente.';
        } else if (err.response) {
          // Erro de resposta do servidor
          const status = err.response.status;
          console.error('Detalhes da resposta de erro:', {
            status: status,
            statusText: err.response.statusText,
            data: err.response.data,
            headers: err.response.headers
          });
          
          if (status === 500) {
            error.value = `Erro interno do servidor (500): ${err.response.data?.message || 'Detalhes não disponíveis'}`;
          }
          if (status === 401) {
            error.value = 'Não autorizado. Verifique suas credenciais de acesso.';
          } else if (status === 404) {
            error.value = 'Endpoint não encontrado. Verifique o caminho da API.';
          } else if (status >= 500) {
            error.value = `Erro no servidor (${status}). Tente novamente mais tarde.`;
          } else {
            error.value = `Erro na requisição: ${err.response.statusText || 'Erro desconhecido'}`;
          }
        } else if (err.request) {
          // A requisição foi feita mas não houve resposta
          error.value = 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.';
        } else {
          // Erro ao configurar a requisição
          error.value = `Erro ao processar a requisição: ${err.message}`;
        }
      } finally {
        isLoading.value = false;
      }
    };

    return {
      isLoading,
      apiData,
      error,
      testApiConnection
    };
  },
  data() {
    return {
      // Seus dados locais existentes aqui
    };
  },
  methods: {
    formatKey(key) {
      if (!key) return '';
      // Converte snake_case para Title Case
      return key
        .toString()
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },
    
    // Método para formatar valores específicos
    formatValue(key, value) {
      if (value === null || value === undefined || value === '') return 'N/A';
      if (typeof value === 'object') return JSON.stringify(value, null, 2);
      return value.toString();
    }
  },
  // Meta tags para SEO
  metaInfo: {
    title: 'Depoimentos - Júlio Martins | Milhas & Viagens',
    meta: [
      { name: 'description', content: 'Leia depoimentos reais de pessoas que transformaram sua forma de viajar com as estratégias de milhas do Júlio Martins.' },
      { property: 'og:title', content: 'Depoimentos - Júlio Martins | Milhas & Viagens' },
      { property: 'og:description', content: 'Leia depoimentos reais de pessoas que transformaram sua forma de viajar com as estratégias de milhas do Júlio Martins.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Depoimentos - Júlio Martins | Milhas & Viagens' },
      { name: 'twitter:description', content: 'Leia depoimentos reais de pessoas que transformaram sua forma de viajar com as estratégias de milhas do Júlio Martins.' }
    ]
  }
}
</script>

<style scoped>
/* Animações personalizadas */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

/* Efeito de hover nos cards de depoimento */
.bg-primary-800\/50:hover {
  background-color: rgba(30, 41, 59, 0.7);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Responsividade */
@media (max-width: 768px) {
  .text-4xl {
    font-size: 2rem;
    line-height: 2.25rem;
  }
  
  .text-xl {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
  
  .p-12 {
    padding: 2rem 1.5rem;
  }
}
</style>
