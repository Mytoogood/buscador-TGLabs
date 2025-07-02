<template>
  <div class="flight-offers min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">
              Ofertas de Voos - Júlio Martins API
            </h1>
          </div>
          <div class="space-x-2">
            <router-link 
              to="/flights" 
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Buscar Voos
            </router-link>
            <router-link 
              to="/dashboard" 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Voltar para o Dashboard
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Filtros -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Filtrar Ofertas</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="flex items-center">
              <input 
                type="checkbox" 
                v-model="filters.international" 
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              >
              <span class="ml-2 text-sm text-gray-700">Apenas voos internacionais</span>
            </label>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
            <input 
              type="number" 
              v-model.number="filters.quantidade" 
              min="1" 
              max="50"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
          </div>
          <div class="flex items-end">
            <button 
              @click="loadOffers" 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              :disabled="isLoading"
            >
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isLoading ? 'Carregando...' : 'Atualizar Ofertas' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Resultados -->
      <div v-if="offers.length > 0">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">
            {{ offers.length }} ofertas disponíveis
          </h2>
        </div>

        <div class="grid grid-cols-1 gap-6">
          <div v-for="(offer, index) in offers" :key="index" class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <!-- Cabeçalho da oferta -->
              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                <div class="mb-4 sm:mb-0">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    {{ offer.Origem.Cidade }} ({{ offer.IataOrigem }}) 
                    <span class="text-gray-500">→</span> 
                    {{ offer.Destino.Cidade }} ({{ offer.IataDestino }})
                  </h3>
                  <p class="mt-1 text-sm text-gray-500">
                    {{ formatDate(offer.Ida) }} 
                    <span v-if="!offer.SoIda">
                      - {{ formatDate(offer.Volta) }}
                    </span>
                    <span v-else class="text-blue-600 font-medium"> (Só ida)</span>
                  </p>
                </div>
                <div class="bg-blue-50 px-3 py-2 rounded-lg">
                  <p class="text-2xl font-bold text-blue-600">
                    R$ {{ formatPrice(offer.ValorAdulto) }}
                  </p>
                  <p v-if="offer.TaxaEmbarque > 0" class="text-xs text-gray-500">
                    + R$ {{ formatPrice(offer.TaxaEmbarque) }} taxa de embarque
                  </p>
                </div>
              </div>

              <!-- Detalhes do voo -->
              <div class="mt-6 border-t border-gray-200 pt-4">
                <div class="flex flex-col space-y-4">
                  <!-- Ida -->
                  <div>
                    <h4 class="text-sm font-medium text-gray-900 mb-2">Ida</h4>
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </div>
                      <div class="ml-4">
                        <p class="text-sm font-medium text-gray-900">{{ offer.Origem.Nome }}</p>
                        <p class="text-sm text-gray-500">{{ offer.Origem.Cidade }}, {{ offer.Origem.Estado }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Destino -->
                  <div>
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div class="ml-4">
                        <p class="text-sm font-medium text-gray-900">{{ offer.Destino.Nome }}</p>
                        <p class="text-sm text-gray-500">{{ offer.Destino.Cidade }}, {{ offer.Destino.Estado }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Ações -->
                <div class="mt-6 flex justify-end">
                  <button 
                    @click="viewFlightDetails(offer)"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                    </svg>
                    Ver Detalhes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-else-if="isLoading" class="text-center py-12">
        <div class="flex justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
        <p class="mt-4 text-sm text-gray-500">Carregando ofertas disponíveis...</p>
      </div>

      <!-- Sem resultados -->
      <div v-else class="text-center py-12 bg-white shadow rounded-lg">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhuma oferta encontrada</h3>
        <p class="mt-1 text-sm text-gray-500">Tente ajustar os filtros ou tente novamente mais tarde.</p>
        <div class="mt-6">
          <button 
            @click="loadOffers" 
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
            </svg>
            Tentar novamente
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import moblixApiService from '@/services/moblixApiService';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

export default {
  name: 'FlightOffers',
  
  setup() {
    const router = useRouter();
    const toast = useToast();
    const isLoading = ref(false);
    const offers = ref([]);
    
    const filters = ref({
      international: false,
      quantidade: 10,
      shuffle: false
    });

    // Carrega as ofertas ao montar o componente
    onMounted(() => {
      loadOffers();
    });

    // Formata o preço para exibição
    const formatPrice = (value) => {
      if (!value) return '0,00';
      return value.toFixed(2).replace('.', ',');
    };

    // Formata a data para exibição
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    // Carrega as ofertas da API
    const loadOffers = async () => {
      try {
        isLoading.value = true;
        offers.value = [];
        
        const response = await moblixApiService.listarOfertas({
          international: filters.value.international,
          quantidade: filters.value.quantidade,
          shuffle: filters.value.shuffle
        });
        
        if (response && response.Data) {
          offers.value = response.Data;
        } else {
          toast.warning('Nenhuma oferta encontrada com os filtros selecionados.');
        }
      } catch (error) {
        console.error('Erro ao carregar ofertas:', error);
        toast.error('Erro ao carregar ofertas. Tente novamente mais tarde.');
      } finally {
        isLoading.value = false;
      }
    };

    // Navega para a página de detalhes do voo
    const viewFlightDetails = (offer) => {
      // Aqui você pode implementar a navegação para uma página de detalhes
      // ou abrir um modal com mais informações sobre a oferta
      console.log('Visualizar oferta:', offer);
      toast.info('Funcionalidade de detalhes em desenvolvimento');
    };

    return {
      isLoading,
      offers,
      filters,
      loadOffers,
      formatPrice,
      formatDate,
      viewFlightDetails
    };
  }
};
</script>

<style scoped>
/* Estilos específicos do componente */
.flight-offers {
  background-color: #f9fafb;
}

/* Estilo para o card de oferta */
.bg-blue-50 {
  background-color: #eff6ff;
}

/* Animações */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>
