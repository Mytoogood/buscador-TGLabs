<template>
  <div class="moblix-demo">
    <!-- Header Section -->
    <section class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            ✈️ Moblix API Real - Bilhetes Aéreos
          </h1>
          <p class="text-xl text-blue-100 max-w-2xl mx-auto">
            Sistema real de gestão de viagens e bilhetes aéreos da Moblix
          </p>
          <div class="mt-6 flex justify-center items-center space-x-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <span class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              API Status: {{ apiStatus }}
            </span>
            <span class="text-sm text-blue-200">Porta: 3001</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Interactive Demo Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <!-- API Controls -->
          <div class="space-y-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-8">
              🎛️ Testar API Moblix Real
            </h2>

            <!-- Status API -->
            <div class="card">
              <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="w-6 h-6 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                Status da API
              </h3>
              
              <div class="space-y-4">
                <button 
                  @click="verificarStatus" 
                  :disabled="loading.status"
                  class="btn-primary w-full"
                >
                  <span v-if="loading.status" class="loading-spinner mr-2"></span>
                  {{ loading.status ? 'Verificando...' : 'Verificar Status' }}
                </button>
              </div>
            </div>

            <!-- Criar Bilhete Demo -->
            <div class="card">
              <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="w-6 h-6 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
                Criar Bilhete Aéreo
              </h3>
              
              <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    v-model="bilheteForm.nomePassageiro" 
                    type="text" 
                    placeholder="Nome do passageiro"
                    class="input-field"
                  />
                  <input 
                    v-model="bilheteForm.emailPassageiro" 
                    type="email" 
                    placeholder="Email do passageiro"
                    class="input-field"
                  />
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select v-model="bilheteForm.origem" class="input-field">
                    <option value="">Origem</option>
                    <option value="GRU">São Paulo (GRU)</option>
                    <option value="BSB">Brasília (BSB)</option>
                    <option value="RIO">Rio de Janeiro (RIO)</option>
                    <option value="CGH">São Paulo Congonhas (CGH)</option>
                  </select>
                  <select v-model="bilheteForm.destino" class="input-field">
                    <option value="">Destino</option>
                    <option value="GRU">São Paulo (GRU)</option>
                    <option value="BSB">Brasília (BSB)</option>
                    <option value="RIO">Rio de Janeiro (RIO)</option>
                    <option value="CGH">São Paulo Congonhas (CGH)</option>
                  </select>
                </div>
                <select v-model="bilheteForm.meioPagamento" class="input-field">
                  <option value="">Meio de Pagamento</option>
                  <option value="3">Boleto</option>
                  <option value="4">Transferência</option>
                  <option value="5">Na agência</option>
                  <option value="6">PayPal</option>
                  <option value="7">Pendente</option>
                </select>
                
                <button 
                  @click="criarBilhete" 
                  :disabled="loading.criarBilhete"
                  class="btn-primary w-full"
                >
                  <span v-if="loading.criarBilhete" class="loading-spinner mr-2"></span>
                  {{ loading.criarBilhete ? 'Criando Bilhete...' : 'Criar Bilhete' }}
                </button>
              </div>
            </div>

            <!-- Push Notifications Demo -->
            <div class="card">
              <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="w-6 h-6 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                </svg>
                Push Notifications
              </h3>
              
              <div class="space-y-4">
                <input 
                  v-model="notificationForm.title" 
                  type="text" 
                  placeholder="Título da notificação"
                  class="input-field"
                />
                <textarea 
                  v-model="notificationForm.message" 
                  placeholder="Mensagem da notificação"
                  rows="3"
                  class="input-field"
                ></textarea>
                
                <button 
                  @click="sendNotification" 
                  :disabled="loading.sendNotification"
                  class="btn-primary w-full"
                >
                  <span v-if="loading.sendNotification" class="loading-spinner mr-2"></span>
                  {{ loading.sendNotification ? 'Enviando...' : 'Enviar Notificação' }}
                </button>
              </div>
            </div>

            <!-- Analytics Demo -->
            <div class="card">
              <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="w-6 h-6 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                </svg>
                Analytics
              </h3>
              
              <div class="space-y-4">
                <select v-model="analyticsForm.eventType" class="input-field">
                  <option value="">Selecione o tipo de evento</option>
                  <option value="page_view">Visualização de Página</option>
                  <option value="user_signup">Cadastro de Usuário</option>
                  <option value="button_click">Clique em Botão</option>
                  <option value="purchase">Compra</option>
                </select>
                
                <button 
                  @click="trackEvent" 
                  :disabled="loading.trackEvent"
                  class="btn-primary w-full"
                >
                  <span v-if="loading.trackEvent" class="loading-spinner mr-2"></span>
                  {{ loading.trackEvent ? 'Enviando...' : 'Registrar Evento' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Results Display -->
          <div class="space-y-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-8">
              📊 Resultados
            </h2>

            <!-- API Response Display -->
            <div class="card">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">
                📋 Última Resposta da API
              </h3>
              
              <div class="bg-gray-100 rounded-lg p-4 overflow-auto max-h-96 custom-scrollbar">
                <pre v-if="lastResponse" class="text-sm text-gray-800">{{ JSON.stringify(lastResponse, null, 2) }}</pre>
                <p v-else class="text-gray-500 italic">Nenhuma resposta ainda...</p>
              </div>
            </div>

            <!-- Bilhetes Criados List -->
            <div class="card" v-if="bilhetesCriados.length > 0">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">
                ✈️ Bilhetes Criados
              </h3>
              
              <div class="space-y-3">
                <div 
                  v-for="bilhete in bilhetesCriados" 
                  :key="bilhete.Id"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p class="font-medium text-gray-900">{{ bilhete.Passageiro[0].Nome }} {{ bilhete.Passageiro[0].Sobrenome }}</p>
                    <p class="text-sm text-gray-600">Voo: {{ bilhete.Viagem[0].Trecho[0].NumeroVoo }} | ID: {{ bilhete.Id }}</p>
                  </div>
                  <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    R$ {{ bilhete.Viagem[0].ValorAdulto }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Analytics Chart -->
            <div class="card">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">
                📈 Eventos Registrados
              </h3>
              
              <div class="grid grid-cols-2 gap-4">
                <div 
                  v-for="(count, event) in eventCounts" 
                  :key="event"
                  class="text-center p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg"
                >
                  <p class="text-2xl font-bold text-purple-600">{{ count }}</p>
                  <p class="text-sm text-gray-600 capitalize">{{ event.replace('_', ' ') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Code Examples Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            💻 Exemplos de Código
          </h2>
          <p class="text-xl text-gray-600">
            Veja como integrar a Moblix API em suas aplicações
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- JavaScript Example -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span class="w-8 h-8 bg-yellow-400 rounded mr-3 flex items-center justify-center text-black font-bold text-sm">JS</span>
              JavaScript/Node.js
            </h3>
            
            <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre class="text-green-400 text-sm"><code>{{ jsCode }}</code></pre>
            </div>
          </div>

          <!-- React Native Example -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span class="w-8 h-8 bg-blue-500 rounded mr-3 flex items-center justify-center text-white font-bold text-sm">RN</span>
              React Native
            </h3>
            
            <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre class="text-green-400 text-sm"><code>{{ reactNativeCode }}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { moblixService } from '@/services/apiService'

export default {
  name: 'MoblixDemo',
  setup() {
    // Estado da API
    const apiStatus = ref('Verificando...')

    // Form states
    const bilheteForm = reactive({
      nomePassageiro: '',
      emailPassageiro: '',
      origem: '',
      destino: '',
      meioPagamento: ''
    })

    const notificationForm = reactive({
      title: '',
      message: ''
    })

    const analyticsForm = reactive({
      eventType: ''
    })

    // Loading states
    const loading = reactive({
      status: false,
      criarBilhete: false,
      listarBilhetes: false,
      sendNotification: false,
      trackEvent: false
    })

    // Data states
    const lastResponse = ref(null)
    const bilhetesCriados = ref([])
    const statusInfo = ref(null)
    const eventCounts = reactive({
      page_view: 0,
      user_signup: 0,
      button_click: 0,
      purchase: 0
    })

    // Funções da API Real da Moblix
    const verificarStatus = async () => {
      loading.status = true
      
      try {
        const response = await moblixService.getStatus()
        statusInfo.value = response
        lastResponse.value = response
        apiStatus.value = response.status || 'online'
        
        console.log('✅ Status da API verificado:', response)
      } catch (error) {
        console.error('❌ Erro ao verificar status:', error)
        apiStatus.value = 'offline'
        lastResponse.value = {
          success: false,
          error: error.message,
          message: 'Erro ao conectar com a API da Moblix. Verifique se ela está rodando na porta 3001.'
        }
      } finally {
        loading.status = false
      }
    }

    const criarBilhete = async () => {
      if (!bilheteForm.nomePassageiro || !bilheteForm.emailPassageiro || !bilheteForm.origem || !bilheteForm.destino || !bilheteForm.meioPagamento) {
        alert('Por favor, preencha todos os campos')
        return
      }

      loading.criarBilhete = true
      
      try {
        // Obter dados de exemplo e personalizar
        const bilheteData = moblixService.getBilheteExemplo()
        
        // Personalizar com dados do formulário
        bilheteData.Email = bilheteForm.emailPassageiro
        bilheteData.Passageiros[0].Nome = bilheteForm.nomePassageiro.split(' ')[0] || 'João'
        bilheteData.Passageiros[0].Sobrenome = bilheteForm.nomePassageiro.split(' ').slice(1).join(' ') || 'Silva'
        bilheteData.Passageiros[0].Email = bilheteForm.emailPassageiro
        bilheteData.IdMeioPagamento = parseInt(bilheteForm.meioPagamento)
        bilheteData.pagante.name = bilheteForm.nomePassageiro
        
        const response = await moblixService.criarBilhete(bilheteData)
        
        if (response.Success) {
          bilhetesCriados.value.push(response.Data[0])
          lastResponse.value = response
          
          console.log('✈️ Bilhete criado com sucesso:', response.Data[0])
          
          // Reset form
          bilheteForm.nomePassageiro = ''
          bilheteForm.emailPassageiro = ''
          bilheteForm.origem = ''
          bilheteForm.destino = ''
          bilheteForm.meioPagamento = ''
          
          alert(`Bilhete criado com sucesso! ID: ${response.Data[0].Id}`)
        } else {
          throw new Error(response.MensagemErro || 'Erro desconhecido')
        }
      } catch (error) {
        console.error('❌ Erro ao criar bilhete:', error)
        lastResponse.value = {
          success: false,
          error: error.message,
          message: 'Erro ao criar bilhete. Verifique os dados e tente novamente.'
        }
        alert('Erro ao criar bilhete: ' + error.message)
      } finally {
        loading.criarBilhete = false
      }
    }


    const sendNotification = async () => {
      if (!notificationForm.title || !notificationForm.message) return

      loading.sendNotification = true
      
      try {
        // Simulação de envio de notificação
        const response = {
          success: true,
          message: 'Notificação simulada enviada com sucesso!',
          data: {
            title: notificationForm.title,
            message: notificationForm.message,
            sent_at: new Date().toISOString()
          }
        }
        
        lastResponse.value = response
        
        // Reset form
        notificationForm.title = ''
        notificationForm.message = ''
        
        alert('Notificação simulada enviada!')
      } catch (error) {
        console.error('Erro ao enviar notificação:', error)
        lastResponse.value = {
          success: false,
          error: error.message,
          message: 'Erro ao enviar notificação.'
        }
      } finally {
        loading.sendNotification = false
      }
    }

    const trackEvent = async () => {
      if (!analyticsForm.eventType) return

      loading.trackEvent = true
      
      try {
        const response = await moblixService.getAnalytics({
          eventType: analyticsForm.eventType,
          timestamp: new Date().toISOString(),
          properties: {
            source: 'demo_app',
            userId: 'demo_user'
          }
        })
        
        eventCounts[analyticsForm.eventType]++
        lastResponse.value = response
      } catch (error) {
        console.error('Erro ao registrar evento:', error)
        lastResponse.value = {
          success: false,
          error: error.message,
          message: 'Erro ao registrar evento. Verifique as configurações da API.'
        }
      } finally {
        loading.trackEvent = false
      }
    }

    // Code examples
    const jsCode = `// Inicializar Moblix SDK
import MoblixSDK from '@moblix/sdk';

MoblixSDK.initialize({
  apiKey: 'YOUR_API_KEY',
  environment: 'production'
});

// Criar usuário
const user = await MoblixSDK.users.create({
  email: 'user@example.com',
  name: 'João Silva'
});

// Enviar notificação
await MoblixSDK.notifications.send({
  title: 'Nova mensagem!',
  message: 'Você tem uma nova mensagem',
  recipients: [user.id]
});

// Registrar evento
MoblixSDK.analytics.track('button_click', {
  buttonName: 'signup',
  page: 'home'
});`

    const reactNativeCode = `// App.js
import React from 'react';
import MoblixSDK from '@moblix/react-native-sdk';

// Inicializar no componente principal
useEffect(() => {
  MoblixSDK.initialize({
    apiKey: 'YOUR_API_KEY'
  });
}, []);

// Componente de cadastro
const SignupForm = () => {
  const handleSignup = async (userData) => {
    try {
      const user = await MoblixSDK.users.create(userData);
      
      // Registrar evento de cadastro
      MoblixSDK.analytics.track('user_signup', {
        source: 'app',
        userId: user.id
      });
      
      console.log('Usuário criado:', user);
    } catch (error) {
      console.error('Erro:', error);
    }
  };
  
  return (
    // Seu formulário aqui
  );
};`

    // Inicializar verificação de status ao montar o componente
    onMounted(() => {
      verificarStatus()
    })

    return {
      // Estados
      apiStatus,
      bilheteForm,
      notificationForm,
      analyticsForm,
      loading,
      lastResponse,
      bilhetesCriados,
      statusInfo,
      eventCounts,
      
      // Funções da API Moblix
      verificarStatus,
      criarBilhete,
      
      // Funções de demonstração (mantidas para compatibilidade)
      sendNotification,
      trackEvent,
      
      // Códigos de exemplo
      jsCode: `// API Real da Moblix - Criar Bilhete
import { moblixService } from './moblixService'

// Autenticar
const authResponse = await moblixService.login({
  mbxUsername: 'TooGood',
  mbxPassword: 'sua_senha_aqui'
})

// Criar bilhete aéreo
const bilheteData = {
  RequestId: 'REQ_001',
  Email: 'cliente@exemplo.com',
  Passageiros: [{
    Nome: 'João',
    Sobrenome: 'Silva', 
    Email: 'joao@exemplo.com',
    Cpf: '12345678901',
    Nascimento: '1990-01-01T00:00:00-03:00'
  }],
  Ida: { Token: 'token_ida' },
  IdMeioPagamento: 4, // Transferência
  ValorTotal: 599.90
}

const response = await moblixService.criarBilhete(bilheteData)
console.log('Bilhete criado:', response.Data[0])`,
      
      reactNativeCode: `// React Native - Integração Moblix
import { moblixService } from './services/moblixApi'

const BookingScreen = () => {
  const [loading, setLoading] = useState(false)
  const [bilhete, setBilhete] = useState(null)
  
  const criarBilhete = async (dadosPassageiro) => {
    setLoading(true)
    try {
      const bilheteData = moblixService.getBilheteExemplo()
      
      // Personalizar dados
      bilheteData.Passageiros[0] = {
        ...bilheteData.Passageiros[0],
        ...dadosPassageiro
      }
      
      const response = await moblixService.criarBilhete(bilheteData)
      
      if (response.Success) {
        setBilhete(response.Data[0])
        Alert.alert('Sucesso', 'Bilhete criado!')
      }
    } catch (error) {
      Alert.alert('Erro', error.message)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <BookingForm onSubmit={criarBilhete} loading={loading} />
  )
}`
    }
  }
}
</script>

