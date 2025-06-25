<template>
  <div class="hotels min-h-screen bg-gray-50">
    <!-- Cabeçalho -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <h1 class="text-xl font-semibold text-gray-900">Busca de Hotéis</h1>
        </div>
      </div>
    </header>

    <!-- Conteúdo principal -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Formulário de busca -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 class="text-lg font-medium text-gray-900 mb-6">Encontre o hotel perfeito</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Campo de localização -->
          <div class="md:col-span-2">
            <hotel-search 
              @select-location="onLocationSelected"
            />
          </div>
          
          <!-- Datas de check-in/check-out -->
          <div>
            <label for="checkin" class="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
            <input
              id="checkin"
              v-model="checkInDate"
              type="date"
              class="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 text-base focus:ring-blue-500 focus:border-blue-500"
              :min="today"
            />
          </div>
          
          <div>
            <label for="checkout" class="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
            <input
              id="checkout"
              v-model="checkOutDate"
              type="date"
              class="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 text-base focus:ring-blue-500 focus:border-blue-500"
              :min="checkInDate || today"
            />
          </div>
          
          <!-- Hóspedes -->
          <div>
            <label for="guests" class="block text-sm font-medium text-gray-700 mb-1">Hóspedes</label>
            <select
              id="guests"
              v-model="guests"
              class="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 text-base focus:ring-blue-500 focus:border-blue-500"
            >
              <option v-for="n in 10" :key="n" :value="n">
                {{ n }} {{ n === 1 ? 'hóspede' : 'hóspedes' }}
              </option>
            </select>
          </div>
          
          <!-- Botão de busca -->
          <div class="flex items-end">
            <button
              @click="searchHotels"
              :disabled="isSearching"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isSearching">Buscando...</span>
              <span v-else>Buscar Hotéis</span>
            </button>
          </div>
        </div>
        
        <!-- Filtros avançados (opcional) -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <button
            @click="showAdvancedFilters = !showAdvancedFilters"
            class="text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            {{ showAdvancedFilters ? 'Ocultar filtros' : 'Mostrar filtros avançados' }}
          </button>
          
          <div v-if="showAdvancedFilters" class="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Estrelas -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
              <div class="flex items-center space-x-2">
                <label v-for="stars in 5" :key="stars" class="flex items-center">
                  <input
                    type="checkbox"
                    :value="stars"
                    v-model="selectedCategories"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span class="ml-2 text-gray-700">
                    {{ stars }} <span v-if="stars === 1">estrela</span><span v-else>estrelas</span>
                  </span>
                </label>
              </div>
            </div>
            
            <!-- Faixa de preço -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Faixa de preço</label>
              <div class="flex items-center space-x-4">
                <div class="flex-1">
                  <label for="minPrice" class="sr-only">Preço mínimo</label>
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 sm:text-sm">R$</span>
                    </div>
                    <input
                      type="number"
                      id="minPrice"
                      v-model.number="minPrice"
                      placeholder="Mínimo"
                      class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <span class="text-gray-500">até</span>
                <div class="flex-1">
                  <label for="maxPrice" class="sr-only">Preço máximo</label>
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 sm:text-sm">R$</span>
                    </div>
                    <input
                      type="number"
                      id="maxPrice"
                      v-model.number="maxPrice"
                      placeholder="Máximo"
                      class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Comodidades -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Comodidades</label>
              <div class="grid grid-cols-2 gap-2">
                <label v-for="amenity in amenities" :key="amenity.id" class="flex items-center">
                  <input
                    type="checkbox"
                    :value="amenity.id"
                    v-model="selectedAmenities"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ amenity.name }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Resultados da busca -->
      <div v-if="searchResults !== null">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">
            {{ searchResults.length }} hotéis encontrados{{ selectedLocation ? ` em ${selectedLocation.Label}` : '' }}
          </h2>
          <div class="flex items-center">
            <label for="sort" class="mr-2 text-sm text-gray-700">Ordenar por:</label>
            <select
              id="sort"
              v-model="sortBy"
              class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            >
              <option value="relevance">Relevância</option>
              <option value="price_asc">Menor preço</option>
              <option value="price_desc">Maior preço</option>
              <option value="stars_desc">Mais estrelas</option>
              <option value="stars_asc">Menos estrelas</option>
            </select>
          </div>
        </div>
        
        <div v-if="isSearching" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        
        <div v-else-if="searchResults.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="mt-2 text-lg font-medium text-gray-900">Nenhum hotel encontrado</h3>
          <p class="mt-1 text-sm text-gray-500">Tente ajustar seus critérios de busca ou verifique se há disponibilidade para as datas selecionadas.</p>
        </div>
        
        <div v-else class="space-y-4">
          <!-- Resultados dos hotéis -->
          <div v-for="hotel in searchResults" :key="hotel.HotelId" class="bg-white overflow-hidden shadow rounded-lg">
            <div class="md:flex">
              <!-- Imagem do hotel -->
              <div class="md:flex-shrink-0">
                <img 
                  class="h-48 w-full object-cover md:w-48" 
                  :src="hotel.Images && hotel.Images.length > 0 ? hotel.Images[0].Url : 'https://via.placeholder.com/300x200?text=Sem+imagem'" 
                  :alt="`Imagem do ${hotel.Name}`"
                >
              </div>
              
              <!-- Detalhes do hotel -->
              <div class="p-6 flex-1">
                <div class="flex justify-between">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900">{{ hotel.Name }}</h3>
                    <div class="mt-1 flex items-center text-sm text-gray-500">
                      <span class="flex items-center">
                        <svg v-for="i in 5" :key="i" 
                          class="h-4 w-4" 
                          :class="i <= Math.floor(hotel.Category) ? 'text-yellow-400' : 'text-gray-300'" 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span class="ml-1">{{ hotel.Category?.toFixed(1) || 'N/A' }}</span>
                      </span>
                      <span class="mx-2">•</span>
                      <span>{{ hotel.Address?.City || 'Cidade não informada' }}, {{ hotel.Address?.Country || 'País não informado' }}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-2xl font-bold text-blue-600">
                      R$ {{ hotel.BestPrice?.Amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00' }}
                    </div>
                    <div class="text-sm text-gray-500">
                      por noite • {{ nights }} noite{{ nights > 1 ? 's' : '' }}
                    </div>
                  </div>
                </div>
                
                <div class="mt-3 text-sm text-gray-600">
                  <p class="line-clamp-2">{{ hotel.Description || 'Descrição não disponível.' }}</p>
                </div>
                
                <div class="mt-4 flex flex-wrap gap-2">
                  <span v-for="amenity in hotel.Amenities?.slice(0, 4)" :key="amenity" 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ amenity }}
                  </span>
                  <span v-if="hotel.Amenities?.length > 4" 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    +{{ hotel.Amenities.length - 4 }} mais
                  </span>
                </div>
                
                <div class="mt-4 flex justify-end">
                  <button 
                    @click="viewHotelDetails(hotel)" 
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Ver detalhes
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Paginação -->
          <div v-if="searchResults.length > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div class="flex-1 flex justify-between sm:hidden">
              <button 
                @click="currentPage > 1 ? currentPage-- : null" 
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Anterior
              </button>
              <button 
                @click="currentPage < totalPages ? currentPage++ : null"
                :disabled="currentPage === totalPages"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Próximo
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Mostrando <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                  a <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, searchResults.length) }}</span>
                  de <span class="font-medium">{{ searchResults.length }}</span> resultados
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    @click="currentPage > 1 ? currentPage-- : null"
                    :disabled="currentPage === 1"
                    :class="{
                      'opacity-50 cursor-not-allowed': currentPage === 1,
                      'hover:bg-gray-50': currentPage > 1
                    }"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500"
                  >
                    <span class="sr-only">Anterior</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button
                    v-for="page in pagesToShow"
                    :key="page"
                    @click="currentPage = page"
                    :class="{
                      'z-10 bg-blue-50 border-blue-500 text-blue-600': currentPage === page,
                      'bg-white border-gray-300 text-gray-500 hover:bg-gray-50': currentPage !== page
                    }"
                    class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    {{ page }}
                  </button>
                  <button
                    @click="currentPage < totalPages ? currentPage++ : null"
                    :disabled="currentPage === totalPages"
                    :class="{
                      'opacity-50 cursor-not-allowed': currentPage === totalPages,
                      'hover:bg-gray-50': currentPage < totalPages
                    }"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500"
                  >
                    <span class="sr-only">Próximo</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Mensagem inicial - mostrada quando não há busca -->
      <div v-if="searchResults === null" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">Busque hotéis pelo destino</h3>
        <p class="mt-1 text-sm text-gray-500">Use o campo de busca acima para encontrar hotéis disponíveis.</p>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import HotelSearch from '@/components/hotel/HotelSearch.vue';
import moblixApiService from '@/services/moblixApiService';

export default {
  name: 'HotelsView',
  
  components: {
    HotelSearch
  },
  
  setup() {
    const router = useRouter();
    const toast = useToast();
    
    // Estados do formulário
    const searchQuery = ref('');
    const selectedLocation = ref(null);
    const checkInDate = ref('');
    const checkOutDate = ref('');
    const guests = ref(2);
    const rooms = ref(1);
    const selectedCategories = ref([]);
    const minPrice = ref(null);
    const maxPrice = ref(null);
    const selectedAmenities = ref([]);
    const sortBy = ref('relevance');
    const showAdvancedFilters = ref(false);
    const isSearching = ref(false);
    const searchResults = ref([]);
    
    // Paginação
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    
    // Computed properties para paginação
    const totalPages = computed(() => {
      return Math.ceil(searchResults.value.length / itemsPerPage.value);
    });
    
    const paginatedResults = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return searchResults.value.slice(start, end);
    });
    
    const pagesToShow = computed(() => {
      const pages = [];
      const maxPagesToShow = 5; // Número máximo de páginas para mostrar na paginação
      
      if (totalPages.value <= maxPagesToShow) {
        // Se tivermos poucas páginas, mostre todas
        for (let i = 1; i <= totalPages.value; i++) {
          pages.push(i);
        }
      } else {
        // Se tivermos muitas páginas, mostre as primeiras, as últimas e as próximas
        const startPage = Math.max(1, currentPage.value - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages.value, startPage + maxPagesToShow - 1);
        
        // Adiciona a primeira página
        if (startPage > 1) {
          pages.push(1);
          if (startPage > 2) {
            pages.push('...');
          }
        }
        
        // Adiciona as páginas do meio
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
        
        // Adiciona a última página
        if (endPage < totalPages.value) {
          if (endPage < totalPages.value - 1) {
            pages.push('...');
          }
          pages.push(totalPages.value);
        }
      }
      
      return pages;
    });
    
    // Número de noites de estadia
    const nights = computed(() => {
      if (!checkInDate.value || !checkOutDate.value) return 0;
      
      const checkIn = new Date(checkInDate.value);
      const checkOut = new Date(checkOutDate.value);
      
      // Diferença em milissegundos
      const diffTime = Math.abs(checkOut - checkIn);
      // Converter para dias
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    });
    
    /**
     * Navega para a página de detalhes do hotel
     * @param {Object} hotel - Dados do hotel selecionado
     */
    const viewHotelDetails = (hotel) => {
      if (!hotel?.HotelId) {
        toast.error('Não foi possível carregar os detalhes do hotel');
        return;
      }
      
      // Navega para a rota de detalhes do hotel
      router.push({
        name: 'HotelDetails',
        params: { id: hotel.HotelId },
        query: {
          checkIn: checkInDate.value,
          checkOut: checkOutDate.value,
          guests: guests.value,
          rooms: rooms.value
        }
      });
    };
    
    // Comodidades disponíveis
    const amenities = [
      { id: 'wifi', name: 'Wi-Fi' },
      { id: 'pool', name: 'Piscina' },
      { id: 'parking', name: 'Estacionamento' },
      { id: 'breakfast', name: 'Café da manhã' },
      { id: 'gym', name: 'Academia' },
      { id: 'spa', name: 'SPA' },
      { id: 'restaurant', name: 'Restaurante' },
      { id: 'bar', name: 'Bar' },
    ];
    
    // Data atual para validação
    const today = new Date().toISOString().split('T')[0];
    
    // Quando uma localização é selecionada no componente de busca
    const onLocationSelected = (location) => {
      console.log('Localização recebida do componente de busca:', location);
      
      if (!location) {
        console.error('Nenhuma localização fornecida');
        toast.error('Erro ao selecionar o local. Tente novamente.');
        return;
      }
      
      // Formata o objeto de localização com estrutura consistente
      const formattedLocation = {
        // Copia todas as propriedades existentes
        ...location,
        
        // Garante que temos um CityId válido
        CityId: location.CityId || 
               (location.LocationDetails && location.LocationDetails.CityId) || 
               location.id || 
               null,
                
        // Garante que temos um Label para exibição
        Label: location.Label || location.label || location.name || 'Local desconhecido',
        
        // Formata os detalhes da localização
        LocationDetails: {
          // Copia os detalhes existentes ou cria um novo objeto
          ...(location.LocationDetails || {}),
          
          // Garante que os campos obrigatórios existam
          CityId: location.CityId || 
                 (location.LocationDetails && location.LocationDetails.CityId) || 
                 location.id || 
                 null,
                  
          CityName: location.CityName || 
                  (location.LocationDetails && location.LocationDetails.CityName) || 
                  location.city || 
                  '',
                  
          CountryCode: location.CountryCode || 
                     (location.LocationDetails && location.LocationDetails.CountryCode) || 
                     location.countryCode || 
                     'BR',
                     
          CountryName: location.CountryName || 
                     (location.LocationDetails && location.LocationDetails.CountryName) || 
                     location.country || 
                     'Brasil',
                     
          Type: location.Type || 
               (location.LocationDetails && location.LocationDetails.Type) || 
               location.type || 
               'City'
        }
      };
      
      // Atualiza a localização selecionada
      selectedLocation.value = formattedLocation;
      
      // Atualiza a busca com o texto formatado
      searchQuery.value = formattedLocation.Label;
      
      console.log('Localização formatada e armazenada:', selectedLocation.value);
      toast.success(`Local selecionado: ${formattedLocation.Label}`);
    };
    
    // Validação do formulário - localização é opcional
    const isFormValid = computed(() => {
      return checkInDate.value && checkOutDate.value;
    });
    
    // Inicialização
    onMounted(() => {
      // Definir datas padrão (amanhã e 2 dias depois)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      checkInDate.value = tomorrow.toISOString().split('T')[0];
      
      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
      checkOutDate.value = dayAfterTomorrow.toISOString().split('T')[0];
    });
    
    const searchHotels = async () => {
      // Validações iniciais
      if (!checkInDate.value || !checkOutDate.value) {
        toast.error('Por favor, selecione as datas de check-in e check-out');
        return;
      }
      
      // A localização é opcional, então definimos cityId como null se não houver localização
      let cityId = null;
      
      // Se houver uma localização selecionada, tenta obter o ID da cidade
      if (selectedLocation.value) {
        cityId = selectedLocation.value.CityId || 
               (selectedLocation.value.LocationDetails && selectedLocation.value.LocationDetails.CityId);
        
        if (!cityId) {
          console.warn('ID da cidade não encontrado na localização, mas continuando a busca sem filtro de localização');
        }
      }
      
      // Validação das datas
      const checkIn = new Date(checkInDate.value);
      const checkOut = new Date(checkOutDate.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (checkIn < today) {
        toast.error('A data de check-in não pode ser anterior a hoje');
        return;
      }
      
      if (checkOut <= checkIn) {
        toast.error('A data de check-out deve ser posterior à data de check-in');
        return;
      }
      
      // Inicia o estado de carregamento
      isSearching.value = true;
      searchResults.value = [];
      
      try {
        // Formata as datas para o formato YYYY-MM-DD
        const formatDate = (date) => {
          const d = new Date(date);
          return d.toISOString().split('T')[0];
        };
        
        const checkin = formatDate(checkInDate.value);
        const checkout = formatDate(checkOutDate.value);
        
        // Feedback para o usuário
        toast.info('Buscando hotéis disponíveis...');
        
        // Garante que o número de hóspedes seja um número inteiro válido
        const numAdults = Math.max(1, parseInt(guests.value, 10) || 1);
        
        // Valida as datas
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const checkInDateObj = new Date(checkin);
        const checkOutDateObj = new Date(checkout);
        
        if (checkInDateObj < today) {
          throw new Error('A data de check-in não pode ser anterior ao dia atual.');
        }
        
        if (checkOutDateObj <= checkInDateObj) {
          throw new Error('A data de check-out deve ser posterior à data de check-in.');
        }
        
        // Prepara os parâmetros da busca conforme API Moblix
        const searchParams = {
          checkin: checkInDateObj.toISOString().split('T')[0], // Formato YYYY-MM-DD
          checkout: checkOutDateObj.toISOString().split('T')[0], // Formato YYYY-MM-DD
          guests: numAdults, // Número de hóspedes
          rooms: 1 // Número de quartos (padrão: 1)
        };
        
        console.log('Parâmetros iniciais da busca:', {
          checkin: searchParams.checkin,
          checkout: searchParams.checkout,
          guests: searchParams.guests,
          rooms: searchParams.rooms,
          hasSelectedLocation: !!selectedLocation.value,
          locationLabel: selectedLocation.value?.Label || 'Busca global de hotéis'
        });
        
        // Adiciona a localização se estiver disponível
        if (selectedLocation.value) {
          // Primeiro tenta usar o ID da localização
          const locationId = selectedLocation.value.CityId || 
                            (selectedLocation.value.LocationDetails && selectedLocation.value.LocationDetails.CityId);
          
          if (locationId) {
            searchParams.idLocation = locationId;
            console.log(`Buscando hotéis na localização ID: ${locationId}`);
          }
          
          // Também adiciona o nome da cidade como fallback
          const cityName = selectedLocation.value.Label || 
                          (selectedLocation.value.LocationDetails && selectedLocation.value.LocationDetails.CityName);
          
          if (cityName) {
            searchParams.city = cityName;
            console.log(`Nome da cidade: ${cityName}`);
          }
        } else {
          console.log('Fazendo busca global de hotéis (sem filtro de localização)');
        }
        
        // Log detalhado para debug
        console.log('Parâmetros completos da busca:', JSON.stringify({
          ...searchParams,
          Rooms: `[Guests: ${searchParams.guests}, Rooms: ${searchParams.rooms}]`
        }, null, 2));
        
        console.log('Buscando hotéis com os seguintes parâmetros:', searchParams);
        
        try {
          console.log('Buscando hotéis com os parâmetros preparados...');
          
          // Faz a chamada para a API
          const response = await moblixApiService.buscarDisponibilidadeHoteis(searchParams);
          
          // Verifica se a busca foi bem-sucedida
          if (!response) {
            throw new Error('Não foi recebida uma resposta válida da API');
          }
          
          if (!response.Success) {
            throw new Error(response.MensagemErro || 'Não foi possível carregar a disponibilidade de hotéis');
          }
          
          // Processa os resultados para garantir que os dados estejam no formato correto
          const processedResults = (response.Data || []).map(hotel => ({
            ...hotel,
            // Garante que o endereço tenha os campos necessários
            Address: {
              City: hotel.Address?.City || hotel.City || '',
              Country: hotel.Address?.Country || hotel.Country || 'Brasil',
              ...hotel.Address
            },
            // Garante que a categoria seja um número
            Category: typeof hotel.Category === 'string' ? parseFloat(hotel.Category) : (hotel.Category || 0)
          }));
          
          // Atualiza os resultados da busca
          searchResults.value = processedResults;
          
          // Feedback para o usuário
          if (searchResults.value.length === 0) {
            const locationText = selectedLocation.value ? ` em ${selectedLocation.value.Label}` : '';
            toast.info(`Nenhum hotel encontrado${locationText} para as datas selecionadas.`);
          } else {
            const locationText = selectedLocation.value ? ` em ${selectedLocation.value.Label}` : '';
            toast.success(`Encontrados ${searchResults.value.length} hotéis disponíveis${locationText}!`);
          }
        } catch (apiError) {
          console.error('Erro na chamada da API de hotéis:', apiError);
          
          // Trata erros específicos de integração
          if (apiError.message && apiError.message.includes('integracao')) {
            // Para erros de integração, tenta novamente após um delay ou exibe mensagem específica
            console.warn('Erro de integração detectado, tentando fallback...');
            throw new Error('Serviço de hotéis temporariamente indisponível. Tente novamente em alguns instantes.');
          }
          
          throw apiError; // Re-lança o erro para ser tratado no bloco catch externo
        }
        
      } catch (error) {
        console.error('Erro ao buscar hotéis:', error);
        
        // Mensagens de erro mais amigáveis e específicas
        let errorMessage = 'Ocorreu um erro ao buscar hotéis. Tente novamente.';
        const errorMessageLower = error.message?.toLowerCase() || '';
        
        // Mapeamento de erros conhecidos para mensagens amigáveis
        const errorMappings = [
          { 
            keywords: ['timeout', 'network error', 'failed to fetch'], 
            message: 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.' 
          },
          { 
            keywords: ['401', '403', 'unauthorized', 'forbidden'], 
            message: 'Falha na autenticação. Por favor, faça login novamente ou verifique suas credenciais.' 
          },
          { 
            keywords: ['404', 'not found'], 
            message: 'O recurso solicitado não foi encontrado. Verifique os parâmetros da busca.' 
          },
          { 
            keywords: ['500', 'internal server error'], 
            message: 'Erro interno no servidor. Por favor, tente novamente mais tarde.' 
          },
          { 
            keywords: ['data de check-in', 'data de check-out'], 
            message: error.message // Mensagem específica de validação de datas
          },
          { 
            keywords: ['adulto', 'adultos'], 
            message: error.message // Mensagem específica sobre número de adultos
          }
        ];
        
        // Verifica se há uma mensagem de erro específica para o erro atual
        const matchedError = errorMappings.find(({ keywords }) => 
          keywords.some(keyword => errorMessageLower.includes(keyword))
        );
        
        // Usa a mensagem de erro correspondente ou a mensagem original
        errorMessage = matchedError?.message || error.message || errorMessage;
        
        // Exibe a mensagem de erro para o usuário
        toast.error(errorMessage, { 
          duration: 5000, // 5 segundos
          position: 'top-right',
          dismissible: true
        });
        
        // Log detalhado para debug (apenas em desenvolvimento)
        if (process.env.NODE_ENV === 'development') {
          console.error('Detalhes do erro (desenvolvimento):', {
            message: error.message,
            name: error.name,
            stack: error.stack,
            fullError: error,
            context: {
              selectedLocation: selectedLocation.value,
              checkInDate: checkInDate.value,
              checkOutDate: checkOutDate.value,
              guests: guests.value,
              rooms: rooms.value,
              timestamp: new Date().toISOString()
            }
          });
        }
      } finally {
        isSearching.value = false;
      }
    };
    
    // Inicialização
    onMounted(() => {
      // Definir datas padrão (amanhã e 2 dias depois)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      checkInDate.value = tomorrow.toISOString().split('T')[0];
      
      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
      checkOutDate.value = dayAfterTomorrow.toISOString().split('T')[0];
    });
    
    return {
      // Dados reativos
      searchQuery,
      selectedLocation,
      checkInDate,
      checkOutDate,
      guests,
      rooms,
      selectedCategories,
      minPrice,
      maxPrice,
      selectedAmenities,
      sortBy,
      showAdvancedFilters,
      isSearching,
      searchResults,
      currentPage,
      itemsPerPage,
      
      // Computed
      totalPages,
      paginatedResults,
      pagesToShow,
      nights,
      isFormValid,
      
      // Dados estáticos
      amenities,
      today: new Date().toISOString().split('T')[0],
      
      // Métodos
      searchHotels,
      onLocationSelected,
      viewHotelDetails,
    };
  },
};
</script>

<style scoped>
/* Estilos para garantir que o texto dos inputs fique preto */
input[type="date"],
input[type="number"],
select {
  color: #111827 !important;
}

/* Estilo específico para o placeholder dos inputs de data */
input[type="date"]::before {
  color: #6B7280;
  content: attr(placeholder);
  margin-right: 0.5em;
}

input[type="date"]:focus::before,
input[type="date"]:valid::before {
  content: '';
  margin-right: 0;
}

.hotels {
  min-height: calc(100vh - 4rem);
}

/* Estilos para a barra de rolagem personalizada */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
