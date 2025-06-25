<template>
  <div class="flights min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">
              Busca de Voos - Moblix API
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <router-link 
              to="/ofertas" 
              class="inline-flex items-center px-4 py-2 border border-yellow-200 text-sm font-medium rounded-md shadow-sm text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
              </svg>
              Ofertas Especiais
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
      <!-- Formulário de Busca -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">Parâmetros da Busca</h2>
          <div class="flex items-center">
            <span class="mr-2 text-sm text-gray-700">Tipo de Busca:</span>
            <select 
              v-model="searchType" 
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="padrao">Padrão</option>
              <option value="reserva-facil">Reserva Fácil (Rextur/Eferatur)</option>
            </select>
          </div>
        </div>
        
        <form @submit.prevent="searchFlights" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Origem -->
            <div class="relative">
              <label for="origin" class="block text-sm font-medium text-gray-700">Origem</label>
              <div class="relative mt-1">
                <input 
                  type="text" 
                  id="origin" 
                  v-model="searchParams.origem" 
                  @input="searchAirports('origin')"
                  @focus="handleInputFocus('origin')"
                  @blur="setTimeout(() => { showAirportSuggestions.origin = false }, 200)"
                  @keydown.down.prevent="handleSuggestionKeyDown($event, 'origin')"
                  @keydown.up.prevent="handleSuggestionKeyDown($event, 'origin')"
                  @keydown.enter.prevent="handleSuggestionKeyDown($event, 'origin')"
                  @keydown.esc="showAirportSuggestions.origin = false"
                  placeholder="Cidade ou código IATA" 
                  class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                  autocomplete="off"
                  aria-autocomplete="list"
                  :aria-expanded="showAirportSuggestions.origin && airportSuggestions.origin.length > 0"
                  aria-controls="origin-suggestions"
                  aria-haspopup="listbox"
                  role="combobox"
                >
                <div v-if="isLoadingAirports.origin" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg class="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <div 
                  v-if="airportSuggestions.origin.length > 0 && showAirportSuggestions.origin" 
                  id="origin-suggestions"
                  class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                  role="listbox"
                  aria-labelledby="origin-label"
                >
                  <div 
                    v-for="(airport, index) in airportSuggestions.origin" 
                    :key="'origin-'+index"
                    @mousedown="selectAirport(airport, 'origin')"
                    @mouseenter="focusedSuggestionIndex.origin = index"
                    @mouseleave="focusedSuggestionIndex.origin = -1"
                    class="suggestion-item cursor-default select-none relative py-2 pl-3 pr-9"
                    :class="{ 'bg-blue-50': focusedSuggestionIndex.origin === index }"
                    role="option"
                    :aria-selected="focusedSuggestionIndex.origin === index"
                    :id="'origin-suggestion-' + index"
                  >
                    <div class="flex items-center">
                      <span class="font-medium text-gray-900">{{ airport.Iata }}</span>
                      <span class="ml-2 text-gray-500 truncate">{{ airport.Nome }}</span>
                      <span class="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{{ airport.Pais }}</span>
                    </div>
                    <span 
                      v-if="focusedSuggestionIndex.origin === index" 
                      class="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600"
                    >
                      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Botão de troca -->
            <div class="flex items-end pb-2">
              <button 
                type="button" 
                @click="swapOriginDestination"
                class="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                :class="{ 'opacity-50 cursor-not-allowed': !searchParams.origem && !searchParams.destino }"
                :disabled="!searchParams.origem && !searchParams.destino"
                aria-label="Trocar origem e destino"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
            </div>

            <!-- Destino -->
            <div class="relative">
              <label for="destination" class="block text-sm font-medium text-gray-700 mb-1">Para</label>
              <div class="relative mt-1">
                <input 
                  type="text" 
                  id="destination" 
                  v-model="searchParams.destino" 
                  @input="searchAirports('destination')"
                  @focus="handleInputFocus('destination')"
                  @blur="setTimeout(() => { showAirportSuggestions.destination = false }, 200)"
                  @keydown.down.prevent="handleSuggestionKeyDown($event, 'destination')"
                  @keydown.up.prevent="handleSuggestionKeyDown($event, 'destination')"
                  @keydown.enter.prevent="handleSuggestionKeyDown($event, 'destination')"
                  @keydown.esc="showAirportSuggestions.destination = false"
                  placeholder="Cidade ou código IATA" 
                  class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                  autocomplete="off"
                  aria-autocomplete="list"
                  :aria-expanded="showAirportSuggestions.destination && airportSuggestions.destination.length > 0"
                  aria-controls="destination-suggestions"
                  aria-haspopup="listbox"
                  role="combobox"
                >
                <div v-if="isLoadingAirports.destination" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg class="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <div 
                  v-if="airportSuggestions.destination.length > 0 && showAirportSuggestions.destination" 
                  id="destination-suggestions"
                  class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                  role="listbox"
                  aria-labelledby="destination-label"
                >
                  <div 
                    v-for="(airport, index) in airportSuggestions.destination" 
                    :key="'dest-'+index"
                    @mousedown="selectAirport(airport, 'destination')"
                    @mouseenter="focusedSuggestionIndex.destination = index"
                    @mouseleave="focusedSuggestionIndex.destination = -1"
                    class="suggestion-item cursor-default select-none relative py-2 pl-3 pr-9"
                    :class="{ 'bg-blue-50': focusedSuggestionIndex.destination === index }"
                    role="option"
                    :aria-selected="focusedSuggestionIndex.destination === index"
                    :id="'destination-suggestion-' + index"
                  >
                    <div class="flex items-center">
                      <span class="font-medium text-gray-900">{{ airport.Iata }}</span>
                      <span class="ml-2 text-gray-500 truncate">{{ airport.Nome }}</span>
                      <span class="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{{ airport.Pais }}</span>
                    </div>
                    <span 
                      v-if="focusedSuggestionIndex.destination === index" 
                      class="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600"
                    >
                      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Data de Ida -->
            <div>
              <label for="departureDate" class="block text-sm font-medium text-gray-700">Data de Ida</label>
              <input 
                type="date" 
                id="departureDate" 
                v-model="searchParams.ida" 
                :min="today"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              >
            </div>

            <!-- Data de Volta -->
            <div>
              <label for="returnDate" class="block text-sm font-medium text-gray-700">Data de Volta (opcional)</label>
              <input 
                type="date" 
                id="returnDate" 
                v-model="searchParams.volta" 
                :min="searchParams.ida || today"
                :disabled="searchParams.soIda"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
            </div>
          </div>

          <!-- Campos específicos para cada tipo de busca -->
          <div v-if="searchType === 'padrao'" class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Passageiros -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Passageiros</label>
              <div class="mt-1 flex rounded-md shadow-sm">
                <div class="relative flex-1">
                  <label for="adults" class="sr-only">Adultos</label>
                  <input 
                    type="number" 
                    id="adults" 
                    v-model.number="searchParams.adultos" 
                    min="1" 
                    max="9"
                    class="focus:ring-blue-500 focus:border-blue-500 block w-full rounded-none rounded-l-md pl-3 sm:text-sm border-gray-300"
                  >
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">Adultos</span>
                  </div>
                </div>
                <div class="relative flex-1 -ml-px">
                  <label for="children" class="sr-only">Crianças</label>
                  <input 
                    type="number" 
                    id="children" 
                    v-model.number="searchParams.criancas" 
                    min="0" 
                    max="8"
                    class="focus:ring-blue-500 focus:border-blue-500 block w-full rounded-none pl-3 sm:text-sm border-gray-300"
                  >
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">Crianças</span>
                  </div>
                </div>
                <div class="relative flex-1 -ml-px">
                  <label for="infants" class="sr-only">Bebês</label>
                  <input 
                    type="number" 
                    id="infants" 
                    v-model.number="searchParams.bebes" 
                    min="0" 
                    max="8"
                    class="focus:ring-blue-500 focus:border-blue-500 block w-full rounded-none rounded-r-md pl-3 sm:text-sm border-gray-300"
                  >
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">Bebês</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Companhia Aérea -->
            <div>
              <label for="airline" class="block text-sm font-medium text-gray-700">Companhia Aérea</label>
              <select 
                id="airline" 
                v-model="searchParams.companhia" 
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="-1">Todas as companhias</option>
                <option value="1">LATAM</option>
                <option value="2">GOL/Smiles</option>
                <option value="3">Azul</option>
                <option value="11">TAP</option>
                <option value="34">Livelo</option>
                <option value="1200">Azul Interline</option>
              </select>
            </div>

            <!-- Ordenação -->
            <div>
              <label for="sortBy" class="block text-sm font-medium text-gray-700">Ordenar por</label>
              <select 
                id="sortBy" 
                v-model="searchParams.orderBy" 
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="tempo">Menor tempo</option>
                <option value="preco">Menor preço</option>
              </select>
            </div>

            <!-- Apenas Ida -->
            <div class="flex items-end">
              <div class="flex items-center h-5">
                <input 
                  id="oneWay" 
                  v-model="searchParams.soIda" 
                  type="checkbox" 
                  class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                >
                <label for="oneWay" class="ml-2 block text-sm text-gray-700">
                  Apenas ida
                </label>
              </div>
            </div>
          </div>

          <!-- Campos específicos para Reserva Fácil -->
          <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Passageiros Reserva Fácil -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Passageiros</label>
              <div class="mt-1 flex rounded-md shadow-sm">
                <div class="relative flex-1">
                  <label for="rf-adults" class="sr-only">Adultos</label>
                  <input 
                    type="number" 
                    id="rf-adults" 
                    v-model.number="searchParams.Adultos" 
                    min="1" 
                    max="9"
                    class="focus:ring-blue-500 focus:border-blue-500 block w-full rounded-none rounded-l-md pl-3 sm:text-sm border-gray-300"
                  >
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">Adultos</span>
                  </div>
                </div>
                <div class="relative flex-1 -ml-px">
                  <label for="rf-children" class="sr-only">Crianças</label>
                  <input 
                    type="number" 
                    id="rf-children" 
                    v-model.number="searchParams.Criancas" 
                    min="0" 
                    max="8"
                    class="focus:ring-blue-500 focus:border-blue-500 block w-full rounded-none pl-3 sm:text-sm border-gray-300"
                  >
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">Crianças</span>
                  </div>
                </div>
                <div class="relative flex-1 -ml-px">
                  <label for="rf-infants" class="sr-only">Bebês</label>
                  <input 
                    type="number" 
                    id="rf-infants" 
                    v-model.number="searchParams.Bebes" 
                    min="0" 
                    max="8"
                    class="focus:ring-blue-500 focus:border-blue-500 block w-full rounded-none rounded-r-md pl-3 sm:text-sm border-gray-300"
                  >
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">Bebês</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Companhia Aérea Reserva Fácil -->
            <div>
              <label for="rf-airline" class="block text-sm font-medium text-gray-700">Companhia Aérea</label>
              <select 
                id="rf-airline" 
                v-model="searchParams.Companhia" 
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="1">LATAM</option>
                <option value="2">GOL/Smiles</option>
                <option value="3">Azul</option>
                <option value="11">TAP</option>
                <option value="34">Livelo</option>
              </select>
            </div>

            <!-- Ordenação -->
            <div>
              <label for="sortBy" class="block text-sm font-medium text-gray-700">Ordenar por</label>
              <select 
                id="sortBy" 
                v-model="searchParams.orderBy" 
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="tempo">Menor tempo</option>
                <option value="preco">Menor preço</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end">
            <button 
              type="submit" 
              :disabled="isLoading"
              class="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Buscando...
              </span>
              <span v-else>
                <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                Buscar Voos
              </span>
            </button>
          </div>
        </form>
      </div>

      <!-- Resultados -->
      <div v-if="searchResults">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">
            {{ searchResults.length }} voos encontrados
          </h2>
          <div class="text-sm text-gray-500">
            Ordenado por: {{ searchParams.orderBy === 'tempo' ? 'Menor tempo' : 'Menor preço' }}
          </div>
        </div>

        <div v-if="searchResults.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum voo encontrado</h3>
          <p class="mt-1 text-sm text-gray-500">Tente ajustar os filtros de busca.</p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="(flight, index) in searchResults" :key="index" class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <!-- Cabeçalho do voo -->
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    {{ formatCurrency(flight.fareGroup.priceWithTax) }}
                    <span class="text-sm font-normal text-gray-500">/ por pessoa</span>
                  </h3>
                  <p class="mt-1 text-sm text-gray-500">
                    {{ flight.segments[0].departure }} → {{ flight.segments[flight.segments.length - 1].arrival }}
                  </p>
                </div>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ flight.segments[0].legs[0].operatedBy.name }}
                </span>
              </div>

              <!-- Detalhes do voo de ida -->
              <div class="mt-4 border-t border-gray-200 pt-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Ida</h4>
                <div v-for="(segment, segIndex) in flight.segments" :key="'outbound-' + segIndex" class="mt-2">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                      </svg>
                    </div>
                    <div class="ml-4">
                      <div class="flex items-center">
                        <span class="text-sm font-medium text-gray-900">
                          {{ formatTime(segment.departureDate) }}
                        </span>
                        <span class="mx-2 text-gray-400">→</span>
                        <span class="text-sm font-medium text-gray-900">
                          {{ formatTime(segment.arrivalDate) }}
                        </span>
                        <span class="ml-2 text-xs text-gray-500">
                          ({{ formatDuration(segment.duration) }})
                        </span>
                      </div>
                      <div class="mt-1 text-sm text-gray-500">
                        {{ segment.departure }} → {{ segment.arrival }}
                        <span v-if="segment.numberOfStops > 0" class="text-xs text-yellow-600 ml-1">
                          ({{ segment.numberOfStops }} escala{{ segment.numberOfStops > 1 ? 's' : '' }})
                        </span>
                      </div>
                      <div class="mt-1 text-xs text-gray-400">
                        {{ segment.legs[0].operatedBy.name }} {{ segment.legs[0].flightNumber }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Detalhes do voo de volta (se aplicável) -->
              <div v-if="flight.segmentsBack && flight.segmentsBack.length > 0" class="mt-4 border-t border-gray-200 pt-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Volta</h4>
                <div v-for="(segment, segIndex) in flight.segmentsBack" :key="'return-' + segIndex" class="mt-2">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                      </svg>
                    </div>
                    <div class="ml-4">
                      <div class="flex items-center">
                        <span class="text-sm font-medium text-gray-900">
                          {{ formatTime(segment.departureDate) }}
                        </span>
                        <span class="mx-2 text-gray-400">→</span>
                        <span class="text-sm font-medium text-gray-900">
                          {{ formatTime(segment.arrivalDate) }}
                        </span>
                        <span class="ml-2 text-xs text-gray-500">
                          ({{ formatDuration(segment.duration) }})
                        </span>
                      </div>
                      <div class="mt-1 text-sm text-gray-500">
                        {{ segment.departure }} → {{ segment.arrival }}
                        <span v-if="segment.numberOfStops > 0" class="text-xs text-yellow-600 ml-1">
                          ({{ segment.numberOfStops }} escala{{ segment.numberOfStops > 1 ? 's' : '' }})
                        </span>
                      </div>
                      <div class="mt-1 text-xs text-gray-400">
                        {{ segment.legs[0].operatedBy.name }} {{ segment.legs[0].flightNumber }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Rodapé com ações -->
              <div class="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                <button 
                  type="button" 
                  @click="selectFlight(flight)"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Selecionar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import moblixApiService from '@/services/moblixApiService'

// Função para debounce
function debounce(fn, delay) {
  let timeoutId
  return function(...args) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

export default {
  name: 'Flights',
  
  setup() {
    const router = useRouter()
    const toast = useToast()
    const isLoading = ref(false)
    const searchResults = ref(null)
    
    // Estados para busca de aeroportos
    const airportSuggestions = ref({
      origin: [],
      destination: []
    })
    
    const showAirportSuggestions = ref({
      origin: false,
      destination: false
    })
    
    const isLoadingAirports = ref({
      origin: false,
      destination: false
    })
    
    // Cache para resultados de busca de aeroportos
    const airportCache = new Map()
    
    // Data atual no formato YYYY-MM-DD
    const today = computed(() => {
      return new Date().toISOString().split('T')[0]
    })
    
    // Tipo de busca
    const searchType = ref('padrao') // 'padrao' ou 'reserva-facil'
    
    // Parâmetros de busca
    const searchParams = ref({
      // Parâmetros comuns
      origem: '',
      destino: '',
      
      // Parâmetros para busca padrão
      ida: today.value,
      volta: '',
      adultos: 1,
      criancas: 0,
      bebes: 0,
      companhia: -1,
      soIda: false,
      numeroPagina: 1,
      quantidadePorPagina: 10,
      orderBy: 'tempo',
      
      // Parâmetros para Reserva Fácil (com letra maiúscula para compatibilidade com a API)
      Ida: today.value,
      Adultos: 1,
      Criancas: 0,
      Bebes: 0,
      Companhia: 1 // Default para LATAM
    })

    // Buscar voos na API
    const searchFlights = async () => {
      try {
        console.log('Iniciando busca de voos...');
        isLoading.value = true;
        searchResults.value = null;
        
        // Validação básica
        if (!searchParams.value.origem || !searchParams.value.destino) {
          throw new Error('Por favor, preencha a origem e o destino');
        }
        
        // Verifica se a data de ida está preenchida para o tipo de busca selecionado
        const dataIda = searchType.value === 'padrao' ? searchParams.value.ida : searchParams.value.Ida;
        if (!dataIda) {
          throw new Error('Por favor, selecione uma data de ida');
        }
        
        let response;
        
        if (searchType.value === 'padrao') {
          // Busca padrão
          const params = { 
            origem: searchParams.value.origem.toUpperCase(),
            destino: searchParams.value.destino.toUpperCase(),
            ida: searchParams.value.ida,
            volta: searchParams.value.volta || null,
            adultos: searchParams.value.adultos || 1,
            criancas: searchParams.value.criancas || 0,
            bebes: searchParams.value.bebes || 0,
            companhia: searchParams.value.companhia || -1,
            soIda: searchParams.value.soIda || false,
            orderBy: searchParams.value.orderBy || 'tempo',
            numeroPagina: searchParams.value.numeroPagina || 1,
            quantidadePorPagina: searchParams.value.quantidadePorPagina || 10
          };
          
          console.log('Parâmetros da busca padrão:', params);
          response = await moblixApiService.consultarVoos(params);
          
          // Garante que temos um array para trabalhar
          searchResults.value = Array.isArray(response) ? response : (response?.Data || []);
          
        } else {
          // Busca via Reserva Fácil
          const params = {
            Origem: searchParams.value.origem.toUpperCase(),
            Destino: searchParams.value.destino.toUpperCase(),
            Ida: searchParams.value.Ida,
            Adultos: searchParams.value.Adultos || 1,
            Criancas: searchParams.value.Criancas || 0,
            Bebes: searchParams.value.Bebes || 0,
            Companhia: searchParams.value.Companhia || 1 // Default para LATAM
          };
          
          console.log('Parâmetros da busca Reserva Fácil:', params);
          response = await moblixApiService.consultarReservaFacil(params);
          
          // Verifica se há erro na resposta
          if (response && !response.Success && response.Erro) {
            throw new Error(response.Erro.Message || 'Erro na consulta de voos');
          }
          
          // Formata a resposta para o formato esperado pelo template
          searchResults.value = response?.Data || response || [];
        }
        
        console.log('Resultados da busca:', searchResults.value);
        
        if (!searchResults.value || searchResults.value.length === 0) {
          throw new Error('Nenhum voo encontrado para os parâmetros informados');
        }
        
        toast.success(`${searchResults.value.length} voos encontrados`);
      } catch (error) {
        console.error('Erro ao buscar voos:', error);
        const errorMessage = error.response?.data?.MensagemErro || error.message || 'Tente novamente mais tarde';
        toast.error(`Erro ao buscar voos: ${errorMessage}`);
      } finally {
        isLoading.value = false;
      }
    }
    
    // Buscar aeroportos com debounce
    const searchAirports = debounce(async (field) => {
      // Validação do parâmetro de entrada
      if (field !== 'origin' && field !== 'destination') {
        console.error('Tipo de campo inválido para busca de aeroportos:', field);
        return;
      }
      
      const fieldType = field; // Já validado acima
      const searchTerm = fieldType === 'origin' 
        ? searchParams.value.origem 
        : searchParams.value.destino;
      
      // Limpa sugestões se o campo estiver vazio ou muito curto
      if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim().length < 2) {
        airportSuggestions.value[fieldType] = [];
        showAirportSuggestions.value[fieldType] = false;
        return;
      }
      
      const trimmedTerm = searchTerm.trim();
      const cacheKey = `${fieldType}:${trimmedTerm.toLowerCase()}`;
      
      // Verifica cache primeiro
      if (airportCache.has(cacheKey)) {
        const cachedResults = airportCache.get(cacheKey);
        if (Array.isArray(cachedResults) && cachedResults.length > 0) {
          airportSuggestions.value[fieldType] = cachedResults;
          showAirportSuggestions.value[fieldType] = true;
          return;
        }
        // Se o cache existe mas está vazio, não faz nova requisição
        return;
      }
      
      // Configura timeout para a requisição
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de timeout
      
      try {
        isLoadingAirports.value[fieldType] = true;
        
        // Faz a chamada à API com timeout
        const results = await Promise.race([
          moblixApiService.buscarAeroportos(trimmedTerm, { signal: controller.signal }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Tempo de busca excedido')), 10000)
          )
        ]);
        
        clearTimeout(timeoutId);
        
        if (!Array.isArray(results)) {
          console.warn('A resposta da API não retornou um array:', results);
          // Armazena array vazio no cache para evitar novas buscas com o mesmo termo
          airportCache.set(cacheKey, []);
          airportSuggestions.value[fieldType] = [];
          showAirportSuggestions.value[fieldType] = false;
          return;
        }
        
        // Filtra e valida os aeroportos retornados
        const validAirports = results.filter(airport => {
          try {
            return airport && 
                   typeof airport === 'object' && 
                   airport.Iata && 
                   typeof airport.Iata === 'string' && 
                   /^[A-Z]{3}$/i.test(airport.Iata.trim()) && // Código IATA válido
                   airport.Nome && 
                   typeof airport.Nome === 'string';
          } catch (error) {
            console.warn('Erro ao validar aeroporto:', airport, error);
            return false;
          }
        });
        
        if (validAirports.length === 0) {
          console.log(`Nenhum aeroporto válido encontrado para: "${trimmedTerm}"`);
          // Armazena array vazio no cache para evitar novas buscas com o mesmo termo
          airportCache.set(cacheKey, []);
          airportSuggestions.value[fieldType] = [];
          showAirportSuggestions.value[fieldType] = false;
          return;
        }
        
        // Remove duplicados baseado no código IATA
        const uniqueAirports = Array.from(new Map(
          validAirports.map(airport => [airport.Iata.toUpperCase(), airport])
        ).values());
        
        // Ordena por prioridade (se disponível) e depois por nome
        const sortedResults = [...uniqueAirports].sort((a, b) => {
          try {
            const aPriority = Number.isInteger(a.Prioridade) ? a.Prioridade : 0;
            const bPriority = Number.isInteger(b.Prioridade) ? b.Prioridade : 0;
            
            if (aPriority !== bPriority) {
              return bPriority - aPriority; // Ordem decrescente de prioridade
            }
            
            // Se as prioridades forem iguais, ordena por nome
            return (a.Nome || '').localeCompare(b.Nome || '');
          } catch (error) {
            console.warn('Erro ao ordenar aeroportos:', error);
            return 0;
          }
        });
        
        // Limita a 10 resultados para melhor performance
        const limitedResults = sortedResults.slice(0, 10);
        
        // Atualiza cache e estado
        airportCache.set(cacheKey, limitedResults);
        airportSuggestions.value[fieldType] = limitedResults;
        showAirportSuggestions.value[fieldType] = true;
        
      } catch (error) {
        clearTimeout(timeoutId);
        console.error(`Erro ao buscar aeroportos (${fieldType}):`, error);
        
        // Não limpa as sugestões existentes em caso de erro para melhor UX
        if (!airportSuggestions.value[fieldType]?.length) {
          airportSuggestions.value[fieldType] = [];
          showAirportSuggestions.value[fieldType] = false;
        }
        
        // Mostra mensagem de erro apenas se for um erro de rede ou servidor
        if (error.name !== 'AbortError' && !error.message.includes('cancel')) {
          toast.error('Não foi possível carregar a lista de aeroportos. Tente novamente.');
        }
        
        // Não armazena erro no cache para permitir novas tentativas
      } finally {
        isLoadingAirports.value[fieldType] = false;
      }
    }, 300);
    
    // Índice da sugestão atualmente focada no teclado
    const focusedSuggestionIndex = ref({
      origin: -1,
      destination: -1
    });

    // Manipulador de teclado para navegação nas sugestões
    const handleSuggestionKeyDown = (event, fieldType) => {
      const suggestions = fieldType === 'origin' 
        ? airportSuggestions.value.origin 
        : airportSuggestions.value.destination;
      
      if (!suggestions || suggestions.length === 0) return;
      
      const currentIndex = focusedSuggestionIndex.value[fieldType];
      let newIndex = currentIndex;
      
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          newIndex = (currentIndex + 1) % suggestions.length;
          break;
          
        case 'ArrowUp':
          event.preventDefault();
          newIndex = (currentIndex <= 0 ? suggestions.length : currentIndex) - 1;
          break;
          
        case 'Enter':
          event.preventDefault();
          if (currentIndex >= 0 && currentIndex < suggestions.length) {
            selectAirport(suggestions[currentIndex], fieldType);
          }
          return;
          
        case 'Escape':
          event.preventDefault();
          showAirportSuggestions.value[fieldType] = false;
          return;
          
        default:
          return; // Não faz nada para outras teclas
      }
      
      // Atualiza o índice focado
      focusedSuggestionIndex.value[fieldType] = newIndex;
      
      // Rola a sugestão para a visualização
      const suggestionElements = document.querySelectorAll(`#${fieldType}-suggestions .suggestion-item`);
      if (suggestionElements[newIndex]) {
        suggestionElements[newIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    };
    
    // Manipulador de foco no campo de entrada
    const handleInputFocus = (fieldType) => {
      showAirportSuggestions.value[fieldType] = true;
      focusedSuggestionIndex.value[fieldType] = -1;
    };

    // Troca os valores entre origem e destino
    const swapOriginDestination = () => {
      if (!searchParams.value.origem && !searchParams.value.destino) return;
      
      // Salva os valores atuais
      const origem = searchParams.value.origem;
      const destino = searchParams.value.destino;
      
      // Troca os valores
      searchParams.value.origem = destino;
      searchParams.value.destino = origem;
      
      // Limpa as sugestões
      airportSuggestions.value.origin = [];
      airportSuggestions.value.destination = [];
      showAirportSuggestions.value.origin = false;
      showAirportSuggestions.value.destination = false;
      
      // Foca no campo de origem após a troca
      setTimeout(() => {
        document.getElementById('origin')?.focus();
      }, 50);
    };
    
    // Seleciona um aeroporto da lista de sugestões
    const selectAirport = (airport, fieldType) => {
      if (!airport || !airport.Iata) {
        console.error('Aeroporto inválido selecionado:', airport);
        return;
      }
      
      try {
        const iataCode = airport.Iata.toUpperCase().trim();
        
        if (fieldType === 'origin') {
          // Atualiza o valor do campo de origem
          searchParams.value.origem = iataCode;
          // Limpa as sugestões de origem
          airportSuggestions.value.origin = [];
          // Esconde o dropdown de sugestões
          showAirportSuggestions.value.origin = false;
          
          // Se o destino for o mesmo que a origem, limpa o destino
          if (searchParams.value.destino === iataCode) {
            searchParams.value.destino = '';
          }
        } else {
          // Atualiza o valor do campo de destino
          searchParams.value.destino = iataCode;
          // Limpa as sugestões de destino
          airportSuggestions.value.destination = [];
          // Esconde o dropdown de sugestões
          showAirportSuggestions.value.destination = false;
          
          // Se a origem for a mesma que o destino, limpa a origem
          if (searchParams.value.origem === iataCode) {
            searchParams.value.origem = '';
          }
        }
        
        // Reseta o índice focado
        focusedSuggestionIndex.value[fieldType] = -1;
        
        // Foca no próximo campo relevante
        setTimeout(() => {
          if (fieldType === 'origin' && !searchParams.value.destino) {
            document.getElementById('destination')?.focus();
          } else if (fieldType === 'destination' && !searchParams.value.ida) {
            document.getElementById('departureDate')?.focus();
          }
        }, 50);
      } catch (error) {
        console.error('Erro ao selecionar aeroporto:', error);
        toast.error('Ocorreu um erro ao selecionar o aeroporto. Tente novamente.');
      }
    }
    
    // Formata o valor em moeda
    const formatCurrency = (value) => {
      if (typeof value !== 'number') return 'R$ 0,00'
      return new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      }).format(value)
    }
    
    // Formata a data/hora para exibição
    const formatTime = (dateTimeString) => {
      if (!dateTimeString) return '--:--'
      const date = new Date(dateTimeString)
      return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      })
    }
    
    // Formata a duração em minutos para horas e minutos
    const formatDuration = (minutes) => {
      if (!minutes) return '--:--'
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      return `${hours}h ${mins.toString().padStart(2, '0')}m`
    }
    
    // Seleciona um voo
    const selectFlight = (flight) => {
      console.log('Voo selecionado:', flight)
      toast.success('Voo selecionado com sucesso!')
      // Aqui você pode adicionar a lógica para redirecionar para a página de detalhes ou fazer o checkout
    }
    
    return {
      // Estados
      isLoading,
      today,
      searchType,
      searchParams,
      searchResults,
      
      // Funções de busca
      searchFlights,
      
      // Funções de formatação
      formatCurrency,
      formatTime,
      formatDuration,
      
      // Gerenciamento de aeroportos
      airportSuggestions,
      showAirportSuggestions,
      isLoadingAirports,
      searchAirports,
      selectAirport,
      swapOriginDestination,
      focusedSuggestionIndex,
      handleSuggestionKeyDown,
      handleInputFocus,
      
      // Outras funções
      selectFlight
    };
  }
};
</script>

<style scoped>
/* Estilos específicos do componente */
.flights {
  min-height: calc(100vh - 4rem);
}
</style>
