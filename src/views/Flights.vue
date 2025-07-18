<template>
  <div class="flights min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
    <!-- Header Elegante -->
    <header class="bg-white/80 backdrop-blur-md shadow-xl border-b border-blue-200/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
              <!-- Ícone de avião SVG grande e bonito -->
              <svg class="w-8 h-8 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.5 19.5l19-7a1 1 0 0 0 0-1.9l-19-7A1 1 0 0 0 1 4.6v3.4a1 1 0 0 0 .7.96l12.3 3.04-12.3 3.04A1 1 0 0 0 1 16v3.4a1 1 0 0 0 1.5.9z"/>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
                <svg class="w-6 h-6 text-blue-700 inline-block -mt-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.5 19.5l19-7a1 1 0 0 0 0-1.9l-19-7A1 1 0 0 0 1 4.6v3.4a1 1 0 0 0 .7.96l12.3 3.04-12.3 3.04A1 1 0 0 0 1 16v3.4a1 1 0 0 0 1.5.9z"/>
                </svg>
                Busca de Voos
              </h1>
              <p class="text-sm text-gray-600">Powered by Moblix API</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <router-link 
              to="/ofertas" 
              class="inline-flex items-center px-6 py-3 border border-amber-200 text-sm font-semibold rounded-xl shadow-md text-amber-700 bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 transition-all duration-300 transform hover:scale-105"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
              </svg>
              ⭐ Ofertas Especiais
            </router-link>
            <router-link 
              to="/dashboard" 
              class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-300 transform hover:scale-105"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Dashboard
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Hero Section -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
          <svg class="w-8 h-8 text-blue-700 inline-block -mt-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2.5 19.5l19-7a1 1 0 0 0 0-1.9l-19-7A1 1 0 0 0 1 4.6v3.4a1 1 0 0 0 .7.96l12.3 3.04-12.3 3.04A1 1 0 0 0 1 16v3.4a1 1 0 0 0 1.5.9z"/>
          </svg>
          Encontre os <span class="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Melhores Voos</span>
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Busque e compare as melhores opções de voos com preços exclusivos para sua próxima viagem
        </p>
      </div>

      <!-- Formulário de Busca -->
      <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-100/50 p-8 mb-12">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            🔍 Parâmetros da Busca
          </h2>
          <div class="flex items-center space-x-3">
            <span class="text-sm font-medium text-gray-700">🔍 Busca automática em todas as fontes</span>
            <!-- Botão de teste -->
            <button 
              type="button"
              @click="testFunction"
              class="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
            >
              🔧 TESTE DEBUG
            </button>
          </div>
        </div>
        
        <form @submit.prevent="handleFormSubmit" class="space-y-4">
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
                  @blur="handleBlur('origin')"
                  @keydown.down.prevent="handleSuggestionKeyDown($event, 'origin')"
                  @keydown.up.prevent="handleSuggestionKeyDown($event, 'origin')"
                  @keydown.enter.prevent="handleSuggestionKeyDown($event, 'origin')"
                  @keydown.esc="showAirportSuggestions.origin = false"
                  placeholder="Cidade ou código IATA" 
                  class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                  @blur="handleBlur('destination')"
                  @keydown.down.prevent="handleSuggestionKeyDown($event, 'destination')"
                  @keydown.up.prevent="handleSuggestionKeyDown($event, 'destination')"
                  @keydown.enter.prevent="handleSuggestionKeyDown($event, 'destination')"
                  @keydown.esc="showAirportSuggestions.destination = false"
                  placeholder="Cidade ou código IATA" 
                  class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
            </div>
          </div>

          <!-- Campos unificados -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    class="focus:ring-blue-500 focus:border-blue-500 block w-full rounded-none rounded-l-md pl-3 text-black sm:text-sm border-gray-300"
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
                    class="focus:ring-blue-500 focus:border-blue-500 block w-full rounded-none pl-3 text-black sm:text-sm border-gray-300"
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
                    class="focus:ring-blue-500 focus:border-blue-500 block w-full rounded-none rounded-r-md pl-3 text-black sm:text-sm border-gray-300"
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
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base text-black border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="-1">Todas as companhias</option>
                <option value="1">LATAM</option>
                <option value="2">GOL Linhas Aéreas</option>
                <option value="3">Azul</option>
                <option value="11">TAP Air Portugal</option>
                <option value="13">Copa Airlines</option>
                <option value="22">American Airlines</option>
                <option value="26">Iberia</option>
                <option value="34">Livelo</option>
                <option value="1200">Azul Interline</option>
              </select>
            </div>
            
            <!-- Tipo de Pagamento -->
            <div>
              <label for="paymentType" class="block text-sm font-medium text-gray-700">Tipo de Pagamento</label>
              <select 
                id="paymentType" 
                v-model="searchParams.tipoPagamento" 
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base text-black border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                v-if="searchParams"
              >
                <option value="ambos">🔄 Ambos (Milhas + Dinheiro)</option>
                <option value="milhas">✈️ Apenas Milhas</option>
                <option value="dinheiro">💰 Apenas Dinheiro</option>
              </select>
            </div>

            <!-- Ordenação -->
            <div>
              <label for="sortBy" class="block text-sm font-medium text-gray-700">Ordenar por</label>
              <select 
                id="sortBy" 
                v-model="searchParams.orderBy" 
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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


          <div class="flex justify-center mt-8">
            <button 
              type="submit" 
              :disabled="isLoading"
              class="group inline-flex items-center px-12 py-4 border border-transparent text-lg font-bold rounded-2xl shadow-2xl text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:ring-offset-2 transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span v-if="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                🔍 Buscando voos...
              </span>
              <span v-else class="flex items-center">
                <svg class="-ml-1 mr-3 h-6 w-6 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                ✈️ Buscar Voos
              </span>
            </button>
          </div>
        </form>
      </div>

      
      <!-- Resultados -->
      <div v-if="searchResults && Array.isArray(searchResults) && searchResults.length >= 0">
        <div class="text-center mb-8">
          <div class="inline-flex items-center bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-blue-100/50 px-8 py-4">
            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="text-left">
              <h2 class="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {{ searchResults.length }} voos selecionados
              </h2>
              <div class="text-sm text-gray-600 space-y-1">
                <div>✨ Ordenado por: {{ searchParams.orderBy === 'tempo' ? 'Menor tempo' : 'Menor preço' }}</div>
                <div class="text-xs text-blue-600">📊 {{ 
                  searchParams.companhia === -1 ? 
                  'Mostrando até 50 voos de cada companhia aérea (ou todos se menos de 50)' : 
                  'Mostrando até 50 melhores opções por companhia aérea' 
                }}</div>
                <div class="text-xs text-green-600" v-if="searchResults.length > 0">
                  ✈️ {{ getCompanyCountSummary() }}
                </div>
                <div class="text-xs text-purple-600" v-if="searchParams">
                  💳 Filtro: {{ 
                    searchParams.tipoPagamento === 'milhas' ? '✈️ Apenas Milhas' : 
                    searchParams.tipoPagamento === 'dinheiro' ? '💰 Apenas Dinheiro' : 
                    '🔄 Ambos os tipos' 
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="searchResults.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum voo encontrado</h3>
          <p class="mt-1 text-sm text-gray-500" v-if="searchParams">
            {{ searchParams.tipoPagamento === 'milhas' ? 'Nenhum voo em milhas encontrado para esta busca.' : 
               searchParams.tipoPagamento === 'dinheiro' ? 'Nenhum voo pago encontrado para esta busca.' : 
               'Tente ajustar os filtros de busca.' }}
          </p>
          <p class="mt-1 text-xs text-gray-400">
            Dica: Experimente alterar o "Tipo de Pagamento" para "Ambos" ou escolher outra companhia aérea.
          </p>
        </div>

        <div v-if="searchResults.length > 0" class="space-y-4">
          <div v-for="(flight, index) in searchResults" :key="index" class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <!-- Cabeçalho do voo -->
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    {{ flight.isMiles ? formatMiles(flight.priceWithTax || flight.price || flight.totalPrice || 0) : formatCurrency(flight.priceWithTax || flight.price || flight.totalPrice || 0) }}
                    <span class="text-sm font-normal text-gray-500">/ por pessoa</span>
                  </h3>
                  <p class="mt-1 text-sm text-gray-500">
                    {{ flight.segments && flight.segments.length > 0 ? flight.segments[0].departure : 'N/A' }} → {{ flight.segments && flight.segments.length > 0 ? flight.segments[flight.segments.length - 1].arrival : 'N/A' }}
                  </p>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ getDisplayAirlineName(flight) }}
                  </span>
                  <span 
                    :class="'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ' + formatFlightType(flight).cssClass"
                    :title="formatFlightType(flight).description"
                  >
                    {{ formatFlightType(flight).icon }} {{ formatFlightType(flight).text }}
                  </span>
                </div>
              </div>

              <!-- Detalhes do voo de ida -->
              <div class="mt-4 border-t border-gray-200 pt-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Ida</h4>
                <!-- Resumo da rota completa -->
                <div v-if="flight.segments && flight.segments.length > 0" class="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                      <div class="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        </svg>
                      </div>
                      <div>
                        <div class="flex items-center space-x-2">
                          <span class="text-lg font-semibold text-gray-900">
                            {{ formatTime(flight.segments[0].departureDate) || flight.segments[0].horarioSaida || 'N/A' }}
                          </span>
                          <span class="text-gray-400 text-lg">→</span>
                          <span class="text-lg font-semibold text-gray-900">
                            {{ formatTime(flight.segments[flight.segments.length - 1].arrivalDate) || flight.segments[flight.segments.length - 1].horarioChegada || 'N/A' }}
                          </span>
                        </div>
                        <div class="text-sm text-gray-600 mt-1">
                          <span class="font-medium">{{ flight.segments[0].departure || flight.segments[0].origem || 'N/A' }}</span>
                          <span v-if="flight.segments.length > 1" class="mx-2 text-xs text-orange-600">
                            ({{ flight.segments.length - 1 }} conexão{{ flight.segments.length - 1 > 1 ? 'ões' : '' }})
                          </span>
                          <span class="font-medium">{{ flight.segments[flight.segments.length - 1].arrival || flight.segments[flight.segments.length - 1].destino || 'N/A' }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-sm text-gray-600">
                        Duração Total: {{ getTotalDuration(flight.segments) }}
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ getDisplayAirlineName(flight) }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Detalhes dos segmentos (conexões) -->
                <div v-if="flight.segments && flight.segments.length > 1" class="space-y-3">
                  <h5 class="text-sm font-medium text-gray-700 mb-2">Detalhes das conexões:</h5>
                  <div v-for="(segment, segIndex) in flight.segments.slice(0, 1)" :key="'outbound-' + segIndex" class="border-l-4 border-blue-300 pl-4 py-2 bg-gray-50 rounded-r-lg">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-3">
                        <div class="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span class="text-xs font-bold text-blue-600">{{ segIndex + 1 }}</span>
                        </div>
                        <div>
                          <div class="flex items-center space-x-2">
                            <span class="text-sm font-medium text-gray-900">
                              {{ formatTime(segment.departureDate) || segment.horarioSaida || 'N/A' }}
                            </span>
                            <span class="text-gray-400">→</span>
                            <span class="text-sm font-medium text-gray-900">
                              {{ formatTime(segment.arrivalDate) || segment.horarioChegada || 'N/A' }}
                            </span>
                            <span class="text-xs text-gray-500">
                              ({{ formatDuration(segment.duration) || segment.duracao || 'N/A' }})
                            </span>
                          </div>
                          <div class="text-sm text-gray-600">
                            {{ segment.departure || segment.origem || 'N/A' }} → {{ segment.arrival || segment.destino || 'N/A' }}
                          </div>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-sm font-medium text-gray-700">
                          {{ getDisplayAirlineName(flight, segment) }} {{ segment.legs && segment.legs[0] ? segment.legs[0].flightNumber : (segment.numeroVoo || flight.numeroVoo || '') }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="flight.segments.length > 1" class="text-xs text-gray-500 mt-2 pl-4">
                    + {{ flight.segments.length - 1 }} conexão{{ flight.segments.length - 1 > 1 ? 'ões' : '' }} adicional{{ flight.segments.length - 1 > 1 ? 'is' : '' }}
                  </div>
                </div>

                <!-- Voo direto (apenas um segmento) -->
                <div v-else-if="flight.segments && flight.segments.length === 1" class="mt-2">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div class="ml-4 flex-1">
                      <div class="flex items-center">
                        <span class="text-sm font-medium text-gray-900">
                          {{ formatTime(flight.segments[0].departureDate) || flight.segments[0].horarioSaida || 'N/A' }}
                        </span>
                        <span class="mx-2 text-gray-400">→</span>
                        <span class="text-sm font-medium text-gray-900">
                          {{ formatTime(flight.segments[0].arrivalDate) || flight.segments[0].horarioChegada || 'N/A' }}
                        </span>
                        <span class="ml-2 text-xs text-gray-500">
                          ({{ formatDuration(flight.segments[0].duration) || flight.segments[0].duracao || 'N/A' }})
                        </span>
                      </div>
                      <div class="mt-1 text-sm text-gray-500">
                        {{ flight.segments[0].departure || flight.segments[0].origem || 'N/A' }} → {{ flight.segments[0].arrival || flight.segments[0].destino || 'N/A' }}
                        <span class="text-xs text-green-600 ml-1">(Voo direto)</span>
                      </div>
                    </div>
                    <div class="ml-4 text-right">
                      <div class="text-lg font-bold text-green-900">
                        {{ getDisplayAirlineName(flight, flight.segments[0]) }} {{ flight.segments[0].legs && flight.segments[0].legs[0] ? flight.segments[0].legs[0].flightNumber : (flight.segments[0].numeroVoo || flight.numeroVoo || '') }}
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Fallback para dados simulados -->
                <div v-else class="mt-2">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                      </svg>
                    </div>
                    <div class="ml-4 flex-1">
                      <div class="flex items-center">
                        <span class="text-sm font-medium text-gray-900">
                          {{ flight.horarioSaida || 'N/A' }}
                        </span>
                        <span class="mx-2 text-gray-400">→</span>
                        <span class="text-sm font-medium text-gray-900">
                          {{ flight.horarioChegada || 'N/A' }}
                        </span>
                        <span class="ml-2 text-xs text-gray-500">
                          ({{ flight.duracao || 'N/A' }})
                        </span>
                      </div>
                      <div class="mt-1 text-sm text-gray-500">
                        {{ flight.origem || searchParams.origem }} → {{ flight.destino || searchParams.destino }}
                        <span v-if="flight.escalas > 0" class="text-xs text-yellow-600 ml-1">
                          ({{ flight.escalas }} escala{{ flight.escalas > 1 ? 's' : '' }})
                        </span>
                      </div>
                    </div>
                    <div class="ml-4 text-right">
                      <div class="text-lg font-bold text-blue-900">
                        {{ getDisplayAirlineName(flight) }} {{ flight.numeroVoo || '' }}
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
                    <div class="ml-4 flex-1">
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
                    </div>
                    <div class="ml-4 text-right">
                      <div class="text-lg font-bold text-gray-900">
                        {{ getDisplayAirlineName(flight, segment) }} {{ segment.legs && segment.legs[0] ? segment.legs[0].flightNumber : '' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Rodapé com ações -->
              <div class="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                <!-- Informação da fonte melhorada -->
                <div class="text-xs text-gray-500">
                  <span class="inline-flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                      <path d="M5 5a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2v-2a1 1 0 10-2 0v2H5V7h2a1 1 0 000-2H5z"></path>
                    </svg>
                    {{ getFlightSourceInfo(flight).prefix }}: 
                    <span class="font-medium ml-1" :class="getFlightSourceInfo(flight).cssClass">
                      {{ getFlightSourceInfo(flight).sourceName }}
                    </span>
                  </span>
                  <div class="mt-1 text-xs" :class="getFlightSourceInfo(flight).messageClass">
                    {{ getFlightSourceInfo(flight).message }}
                  </div>
                </div>
                
                <!-- Botão de seleção melhorado -->
                <button 
                  type="button" 
                  @click="selectFlight(flight)"
                  class="group inline-flex items-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl shadow-lg text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform transition-all duration-200 hover:scale-105"
                >
                  <svg class="w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                  🛒 Selecionar & Comprar
                  <svg class="w-3 h-3 ml-2 transition-transform duration-200 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
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
    const searchResults = ref([])
    
    // Função de debug para testar o toast
    const debugToast = () => {
      console.log('🟦 TESTANDO TOAST...');
      try {
        toast.info('🔧 Toast de debug funcionando!');
        console.log('✅ Toast funcionou perfeitamente!');
      } catch (error) {
        console.error('❌ Erro no toast:', error);
      }
    }
    
    // Chama debug do toast ao inicializar
    setTimeout(debugToast, 1000);
    
    // Função para exibir mensagens padronizadas
    const showErrorMessage = (message, type = 'error') => {
      console.log(`📢 MENSAGEM ${type.toUpperCase()}: ${message}`);
      
      try {
        switch (type) {
          case 'success':
            toast.success(message, {
              position: 'top-right',
              duration: 5000,
              dismissible: true
            });
            break;
          case 'warning':
            toast.warning(message, {
              position: 'top-right',
              duration: 6000,
              dismissible: true
            });
            break;
          case 'info':
            toast.info(message, {
              position: 'top-right',
              duration: 5000,
              dismissible: true
            });
            break;
          case 'error':
          default:
            toast.error(message, {
              position: 'top-right',
              duration: 7000,
              dismissible: true
            });
            break;
        }
      } catch (error) {
        console.error('❌ Erro ao exibir mensagem:', error);
        // Fallback para alert nativo se o toast falhar
        alert(`${type.toUpperCase()}: ${message}`);
      }
    }
    
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
      quantidadePorPagina: 100,
      orderBy: 'tempo',
      tipoPagamento: 'ambos', // 'milhas', 'dinheiro', 'ambos'
      
      // Parâmetros para Reserva Fácil (com letra maiúscula para compatibilidade com a API)
      Ida: today.value,
      Adultos: 1,
      Criancas: 0,
      Bebes: 0,
      Companhia: 0 // Default para Todas as companhias
    })

    // Wrapper para capturar erros do submit
    const handleFormSubmit = async (event) => {
      console.log('📝 EVENTO DE SUBMIT CAPTURADO!');
      console.log('Event:', event);
      console.log('Tipo de evento:', event.type);
      console.log('Target:', event.target);
      
      try {
        await searchFlights();
      } catch (error) {
        console.error('❌ ERRO NO HANDLER DO FORM:', error);
        console.error('Stack trace:', error.stack);
        toast.error(`Erro no formulário: ${error.message}`);
      }
    }
    
    // Função para obter o nome da companhia pelo ID
    const getCompanyName = (companyId) => {
      const companies = {
        1: 'LATAM',
        2: 'GOL',
        3: 'Azul',
        11: 'TAP Air Portugal',
        13: 'Copa Airlines',
        22: 'American Airlines',
        26: 'Iberia',
        34: 'Livelo',
        1200: 'Azul Interline',
        // Adicionar mais companhias conforme necessário
        4: 'Avianca',
        5: 'Air France',
        6: 'KLM',
        7: 'Lufthansa',
        8: 'British Airways',
        9: 'United Airlines',
        10: 'Delta Air Lines'
      };
      return companies[companyId] || null;
    };
    
    // *** CORREÇÃO: FUNÇÃO MELHORADA PARA EXIBIR NOME DA COMPANHIA ***
    const getDisplayAirlineName = (flight, segment = null) => {
      // ESPECIAL: Se é vendido pela Livelo (IdCia=34), mostra como Livelo
      if (flight.IdCia === 34) {
        // Detecta a companhia operadora para mostrar informação completa
        const flightNumber = flight.numeroVoo || 
                            segment?.legs?.[0]?.flightNumber || 
                            flight.segments?.[0]?.legs?.[0]?.flightNumber || 
                            flight.Voos?.[0]?.Numero ||
                            flight.FlightCode;
        
        const operatingAirline = flight.CiaParceira?.Nome || detectAirlineFromFlightCode(flightNumber);
        
        if (operatingAirline && operatingAirline !== 'Livelo') {
          console.log(`🔍 LIVELO: Voo vendido pela Livelo, operado pela ${operatingAirline}`);
          return `${operatingAirline}`; // Mostra a companhia operadora
        }
        
        return 'Livelo';
      }
      
      // Prioridade 1: Detectar pelo código do voo (mais confiável)
      const flightNumber = flight.numeroVoo || 
                          segment?.legs?.[0]?.flightNumber || 
                          flight.segments?.[0]?.legs?.[0]?.flightNumber || 
                          flight.Voos?.[0]?.Numero ||
                          flight.FlightCode;
      
      if (flightNumber) {
        const detectedAirline = detectAirlineFromFlightCode(flightNumber);
        if (detectedAirline) {
          console.log(`🛫 Companhia detectada pelo código ${flightNumber}: ${detectedAirline}`);
          return detectedAirline;
        }
      }
      
      // Prioridade 2: ProviderSource (adicionado na busca múltipla)
      if (flight.ProviderSource) {
        const providerMap = {
          'Latam': 'LATAM',
          'Gol': 'GOL',
          'Azul': 'Azul',
          'Livelo': 'Livelo',
          'Tap': 'TAP Air Portugal',
          'Interline': 'Azul Interline',
          'iberia': 'Iberia',
          'AmericanAirlines': 'American Airlines'
        };
        return providerMap[flight.ProviderSource] || flight.ProviderSource;
      }
      
      // Prioridade 3: ID da companhia
      const companyId = flight.IdCia || flight.Companhia || flight.CompanhiaId || 
                       flight.segments?.[0]?.IdCiaResponsavel || 
                       segment?.IdCiaResponsavel;
      
      if (companyId && companyId !== 0) {
        const companyName = getCompanyName(companyId);
        if (companyName && !companyName.includes('Companhia ')) {
          console.log(`🏢 Companhia detectada pelo ID ${companyId}: ${companyName}`);
          return companyName;
        }
      }
      
      // Prioridade 4: Campos diretos de nome
      let airlineName = flight.companhia || flight.CompanhiaNome;
      
      // Prioridade 5: Verifica Cia.Nome (estrutura antiga)
      if (!airlineName && flight.Cia?.Nome) {
        airlineName = flight.Cia.Nome;
      }
      
      // Prioridade 6: Verifica validatingBy
      if (!airlineName && flight.validatingBy?.name) {
        airlineName = flight.validatingBy.name;
      }
      
      // Prioridade 7: Verifica segmento específico
      if (!airlineName && segment?.legs?.[0]?.operatedBy?.name) {
        airlineName = segment.legs[0].operatedBy.name;
      }
      
      // Normaliza o nome se encontrado
      if (airlineName) {
        const normalized = airlineName.trim();
        const upper = normalized.toUpperCase();
        
        if (upper.includes('LATAM') || normalized === 'Latam') return 'LATAM';
        if (upper.includes('GOL') || normalized === 'Gol') return 'GOL';
        if (upper.includes('AZUL') || normalized === 'Azul') return 'Azul';
        if (upper.includes('TAP') || normalized === 'Tap') return 'TAP Air Portugal';
        if (upper.includes('COPA')) return 'Copa Airlines';
        if (upper.includes('AMERICAN') || normalized === 'AmericanAirlines') return 'American Airlines';
        if (upper.includes('IBERIA') || normalized === 'iberia') return 'Iberia';
        if (upper.includes('LIVELO') || normalized === 'Livelo') return 'Livelo';
        if (upper.includes('INTERLINE') || normalized === 'Interline') return 'Azul Interline';
        
        return normalized;
      }
      
      // Fallback: retorna nome genérico com debug
      console.warn('⚠️ Não foi possível detectar a companhia do voo:', {
        flightNumber,
        companyId,
        ProviderSource: flight.ProviderSource,
        flight: flight
      });
      return 'Companhia Aérea';
    };
    
    // Função para identificar quais companhias têm voos disponíveis
    const getAvailableCompanies = (apiResponse) => {
      const companies = new Set();
      
      let allFlights = [];
      if (apiResponse?.Data && Array.isArray(apiResponse.Data) && apiResponse.Data.length > 0) {
        const firstDataItem = apiResponse.Data[0];
        if (firstDataItem?.flights && Array.isArray(firstDataItem.flights)) {
          allFlights = firstDataItem.flights;
        } else {
          allFlights = apiResponse.Data;
        }
      }
      
      allFlights.forEach(flight => {
        let companyName = null;
        
        // Tenta identificar a companhia usando a mesma lógica do filtro
        if (flight.validatingBy?.name) {
          companyName = flight.validatingBy.name;
        } else if (flight.segments?.[0]?.IdCiaResponsavel) {
          const companyId = flight.segments[0].IdCiaResponsavel;
          companyName = getCompanyName(companyId);
        } else if (flight.segments?.[0]?.legs?.[0]?.operatedBy?.name) {
          companyName = flight.segments[0].legs[0].operatedBy.name;
        }
        
        if (companyName) {
          companies.add(companyName);
        }
      });
      
      return Array.from(companies);
    };
    
    // Função para filtrar voos por companhia
    const filterFlightsByCompany = (apiResponse, companyId) => {
      console.log(`🔍 FILTRO POR COMPANHIA: Buscando voos da companhia ${companyId}`);
      
      // Extrai todos os voos de múltiplas fontes na resposta
      let allFlights = [];
      
      if (apiResponse?.Data && Array.isArray(apiResponse.Data) && apiResponse.Data.length > 0) {
        // Processa cada item em Data
        apiResponse.Data.forEach((dataItem, index) => {
          console.log(`📊 Processando Data[${index}]:`, dataItem);
          
          // Verifica voos em flights
          if (dataItem?.flights && Array.isArray(dataItem.flights) && dataItem.flights.length > 0) {
            console.log(`  ✅ Encontrados ${dataItem.flights.length} voos em Data[${index}].flights`);
            allFlights.push(...dataItem.flights);
          }
          
          // Verifica voos em Ida
          if (dataItem?.Ida && Array.isArray(dataItem.Ida) && dataItem.Ida.length > 0) {
            console.log(`  ✅ Encontrados ${dataItem.Ida.length} voos em Data[${index}].Ida`);
            allFlights.push(...dataItem.Ida);
          }
          
          // Verifica voos em Volta
          if (dataItem?.Volta && Array.isArray(dataItem.Volta) && dataItem.Volta.length > 0) {
            console.log(`  ✅ Encontrados ${dataItem.Volta.length} voos em Data[${index}].Volta`);
            allFlights.push(...dataItem.Volta);
          }
          
          // Se o próprio dataItem parece ser um voo
          if (dataItem?.segments || dataItem?.validatingBy || dataItem?.Companhia) {
            console.log(`  ✅ Data[${index}] parece ser um voo direto`);
            allFlights.push(dataItem);
          }
        });
        
        // Se não encontrou voos nos sub-arrays, tenta usar Data como array de voos
        if (allFlights.length === 0 && apiResponse.Data.every(item => item?.segments || item?.validatingBy)) {
          console.log('📊 Usando Data como array direto de voos');
          allFlights = apiResponse.Data;
        }
      }
      
      // Verifica se existe Ida no nível raiz
      if (allFlights.length === 0 && apiResponse?.Ida && Array.isArray(apiResponse.Ida)) {
        console.log('📊 Usando apiResponse.Ida como fonte de voos');
        allFlights = apiResponse.Ida;
      }
      
      // Se a própria resposta é um array de voos
      if (allFlights.length === 0 && Array.isArray(apiResponse)) {
        console.log('📊 Usando apiResponse como array direto de voos');
        allFlights = apiResponse;
      }
      
      console.log(`🔍 Total de voos antes do filtro: ${allFlights.length}`);
      
      // Debug dos primeiros voos para ver como as companhias estão sendo identificadas
      if (allFlights.length > 0) {
        const sampleFlights = allFlights.slice(0, 5);
        console.log('🔍 Amostra dos primeiros voos:');
        sampleFlights.forEach((flight, index) => {
          console.log(`  Voo ${index + 1}:`, {
            Companhia: flight.Companhia,
            CompanhiaId: flight.CompanhiaId,
            IdCia: flight.IdCia,
            CompanhiaNome: flight.CompanhiaNome,
            Cia: flight.Cia?.Nome
          });
          
          // Debug mais detalhado do primeiro voo
          if (index === 0) {
            console.log('🔍 Estrutura completa do primeiro voo:');
            console.log('- Propriedades diretas:', Object.keys(flight));
            console.log('- Voos array:', flight.Voos);
            console.log('- Segments array:', flight.segments);
            console.log('- PontosAdulto:', flight.PontosAdulto);
            console.log('- ValorTotalComTaxa:', flight.ValorTotalComTaxa);
            console.log('- ValorTotal:', flight.ValorTotal);
            console.log('- Primeiro voo completo:', JSON.stringify(flight, null, 2));
          }
        });
      }
      
      // Filtra apenas os voos da companhia selecionada
      const filteredFlights = allFlights.filter((flight, index) => {
        console.log(`🔍 Analisando voo ${index + 1}:`, {
          Companhia: flight.Companhia,
          CompanhiaId: flight.CompanhiaId, 
          IdCia: flight.IdCia,
          validatingBy: flight.validatingBy?.name,
          segments: flight.segments?.length || 0
        });
        
        // Função para identificar a companhia do voo
        let flightCompany = null;
        
        // 1. Verifica campos diretos primeiro
        if (flight.Companhia) {
          flightCompany = flight.Companhia;
        } else if (flight.CompanhiaId) {
          flightCompany = flight.CompanhiaId;
        } else if (flight.IdCia) {
          flightCompany = flight.IdCia;
        }
        
        // 2. Verifica validatingBy (campo mais confiável na estrutura atual)
        if (!flightCompany && flight.validatingBy?.name) {
          const nameToId = {
            'LATAM': 1,
            'Latam': 1,
            'GOL': 2,
            'Gol': 2,
            'Azul': 3,
            'AZUL': 3,
            'Livelo': 34,
            'LIVELO': 34
          };
          flightCompany = nameToId[flight.validatingBy.name];
        }
        
        // 3. Verifica operatedBy nos segments
        if (!flightCompany && flight.segments && Array.isArray(flight.segments) && flight.segments.length > 0) {
          const firstSegment = flight.segments[0];
          
          // Verifica IdCiaResponsavel no segmento
          if (firstSegment.IdCiaResponsavel) {
            flightCompany = firstSegment.IdCiaResponsavel;
          }
          
          // Verifica operatedBy
          if (!flightCompany && firstSegment.legs?.[0]?.operatedBy?.name) {
            const nameToId = {
              'LATAM': 1,
              'Latam': 1,
              'GOL': 2,
              'Gol': 2,
              'Azul': 3,
              'AZUL': 3,
              'Livelo': 34,
              'LIVELO': 34
            };
            flightCompany = nameToId[firstSegment.legs[0].operatedBy.name];
          }
          
          // Verifica managedBy
          if (!flightCompany && firstSegment.legs?.[0]?.managedBy?.name) {
            const nameToId = {
              'LATAM': 1,
              'Latam': 1,
              'GOL': 2,
              'Gol': 2,
              'Azul': 3,
              'AZUL': 3,
              'Livelo': 34,
              'LIVELO': 34
            };
            flightCompany = nameToId[firstSegment.legs[0].managedBy.name];
          }
        }
        
        // 4. Verifica Cia.Id ou Cia.Nome
        if (!flightCompany && flight.Cia) {
          if (flight.Cia.Id) {
            flightCompany = flight.Cia.Id;
          } else if (flight.Cia.Nome) {
            const nameToId = {
              'Latam': 1, 'LATAM': 1, 'latam': 1,
              'Gol': 2, 'GOL': 2, 'gol': 2,
              'Azul': 3, 'AZUL': 3, 'azul': 3,
              'Azul Linhas Aéreas': 3,
              'Azul Brazilian Airlines': 3,
              'Livelo': 34, 'LIVELO': 34, 'livelo': 34
            };
            flightCompany = nameToId[flight.Cia.Nome];
          }
        }
        
        // 5. Busca por texto "Azul" em qualquer campo (específico para Azul)
        if (!flightCompany && companyId === 3) {
          const searchFields = [
            flight.Companhia,
            flight.CompanhiaNome,
            flight.validatingBy?.name,
            flight.segments?.[0]?.legs?.[0]?.operatedBy?.name,
            flight.segments?.[0]?.legs?.[0]?.managedBy?.name,
            flight.segments?.[0]?.legs?.[0]?.marketingCarrier?.name,
            flight.Cia?.Nome
          ];
          
          for (const field of searchFields) {
            if (typeof field === 'string' && field.toLowerCase().includes('azul')) {
              console.log(`✅ Azul detectada no campo:`, field);
              flightCompany = 3;
              break;
            }
          }
        }
        
        // 5b. Busca por texto "Livelo" em qualquer campo (específico para Livelo)
        if (!flightCompany && companyId === 34) {
          const searchFields = [
            flight.Companhia,
            flight.CompanhiaNome,
            flight.validatingBy?.name,
            flight.segments?.[0]?.legs?.[0]?.operatedBy?.name,
            flight.segments?.[0]?.legs?.[0]?.managedBy?.name,
            flight.segments?.[0]?.legs?.[0]?.marketingCarrier?.name,
            flight.Cia?.Nome
          ];
          
          for (const field of searchFields) {
            if (typeof field === 'string' && field.toLowerCase().includes('livelo')) {
              console.log(`✅ Livelo detectada no campo:`, field);
              flightCompany = 34;
              break;
            }
          }
        }
        
        // 6. Detecta por código do voo como último recurso
        if (!flightCompany && flight.segments && Array.isArray(flight.segments) && flight.segments.length > 0) {
          const firstSegment = flight.segments[0];
          const flightCode = firstSegment.legs?.[0]?.flightCode;
          const flightNumber = firstSegment.legs?.[0]?.flightNumber;
          
          if (flightCode && typeof flightCode === 'string') {
            // Para Azul, código do voo geralmente começa com 'AD'
            if (flightCode.startsWith('AD')) {
              flightCompany = 3; // Azul
            }
            // Para LATAM, código do voo geralmente começa com 'LA' ou 'JJ'
            else if (flightCode.startsWith('LA') || flightCode.startsWith('JJ')) {
              flightCompany = 1; // LATAM
            }
            // Para GOL, código do voo geralmente começa com 'G3'
            else if (flightCode.startsWith('G3')) {
              flightCompany = 2; // GOL
            }
          }
          
          // Detecta por número do voo
          if (!flightCompany && flightNumber && typeof flightNumber === 'number') {
            // Para LATAM, números de voo geralmente estão na faixa 3000-4000
            if (flightNumber >= 3000 && flightNumber <= 4000) {
              flightCompany = 1; // LATAM
            }
            // Para GOL, números de voo geralmente estão na faixa 1000-2000
            else if (flightNumber >= 1000 && flightNumber <= 2000) {
              flightCompany = 2; // GOL
            }
            // Para Azul, números de voo geralmente estão na faixa 2000-3000
            else if (flightNumber >= 2000 && flightNumber < 3000) {
              flightCompany = 3; // Azul
            }
          }
        }
        
        const isMatch = companyId === -1 || flightCompany === companyId || flightCompany === companyId.toString();
        
        // Debug detalhado para os primeiros 3 voos
        if (index < 3) {
          console.log(`🔍 Voo ${index + 1} - Detalhes de filtragem:`, {
            'flight.Companhia': flight.Companhia,
            'flight.CompanhiaId': flight.CompanhiaId,
            'flight.IdCia': flight.IdCia,
            'flight.Cia': flight.Cia,
            'flight.validatingBy': flight.validatingBy,
            'flight.segments[0]?.IdCiaResponsavel': flight.segments?.[0]?.IdCiaResponsavel,
            'flight.segments[0]?.legs[0]?.operatedBy': flight.segments?.[0]?.legs?.[0]?.operatedBy,
            'flight.segments[0]?.legs[0]?.managedBy': flight.segments?.[0]?.legs?.[0]?.managedBy,
            'flight.segments[0]?.legs[0]?.flightNumber': flight.segments?.[0]?.legs?.[0]?.flightNumber,
            'flight.segments[0]?.legs[0]?.flightCode': flight.segments?.[0]?.legs?.[0]?.flightCode,
            'flightCompany (final)': flightCompany,
            'companyId': companyId,
            'isMatch': isMatch
          });
        }
        
        if (isMatch) {
          console.log(`✅ Voo da companhia ${companyId} encontrado:`, {
            flightCompany,
            companyId,
            CompanhiaNome: flight.CompanhiaNome,
            validatingBy: flight.validatingBy?.name,
            operatedBy: flight.segments?.[0]?.legs?.[0]?.operatedBy?.name,
            managedBy: flight.segments?.[0]?.legs?.[0]?.managedBy?.name,
            flightNumber: flight.segments?.[0]?.legs?.[0]?.flightNumber
          });
        }
        
        return isMatch;
      });
      
      console.log(`🎯 Encontrados ${filteredFlights.length} voos da companhia ${companyId} no total de ${allFlights.length} voos`);
      
      if (filteredFlights.length > 0) {
        // Reconstrói a resposta com apenas os voos filtrados
        return {
          Data: [{
            flights: filteredFlights
          }],
          filteredFromAll: true,
          totalFlights: allFlights.length,
          filteredFlights: filteredFlights.length
        };
      } else {
        // Se não encontrou voos, retorna resposta vazia
        return {
          Data: [{ flights: [] }],
          filteredFromAll: true,
          totalFlights: allFlights.length,
          filteredFlights: 0
        };
      }
    };

    // Função para executar busca padrão (API aereo)
    const executeStandardSearch = async (params) => {
      console.log('🔍 Executando busca padrão com parâmetros:', JSON.stringify(params, null, 2));
      
      try {
        const response = await moblixApiService.consultarVoos(params);
        
        // DEBUG: Log detalhado da resposta
        console.log('📦 RESPOSTA COMPLETA DA BUSCA PADRÃO:');
        console.log('Tipo:', typeof response);
        console.log('É nulo?', response === null);
        console.log('É undefined?', response === undefined);
        console.log('Propriedades:', response ? Object.keys(response) : 'N/A');
        console.log('JSON da resposta:', JSON.stringify(response, null, 2));
        
        // *** CORREÇÃO CRÍTICA: BUSCA MÚLTIPLAS COMPANHIAS ***
        // Se a resposta indica providers ativos mas sem voos, fazemos buscas individuais
        const hasActiveProviders = response?.Data?.[0]?.ActiveProviders?.length > 0;
        const hasEmptyFlights = !response?.Data?.[0]?.flights || response.Data[0].flights.length === 0;
        const hasEmptyIda = !response?.Data?.[0]?.Ida || response.Data[0].Ida.length === 0;
        
        if (hasActiveProviders && hasEmptyFlights && hasEmptyIda) {
          console.log('🔄 DETECTADO: Providers ativos mas sem voos - fazendo buscas individuais');
          console.log('📋 Providers ativos:', response.Data[0].ActiveProviders);
          
          const providerMapping = {
            'Latam': 1,
            'Gol': 2, 
            'Azul': 3,
            'Livelo': 34,
            'Tap': 11,
            'Interline': 1200,
            'iberia': 26,
            'AmericanAirlines': 22
          };
          
          let allFlights = [];
          let searchedProviders = 0;
          
          // Limita busca a providers principais para evitar timeout
          const priorityProviders = ['Latam', 'Gol', 'Azul', 'Tap'].filter(p => 
            response.Data[0].ActiveProviders.includes(p)
          );
          
          const providersToSearch = priorityProviders.length > 0 ? 
            priorityProviders : 
            response.Data[0].ActiveProviders.slice(0, 3);
          
          console.log(`🎯 Buscando nos ${providersToSearch.length} principais providers:`, providersToSearch);
          
          for (const provider of providersToSearch) {
            const companyId = providerMapping[provider];
            if (companyId) {
              console.log(`🔍 Buscando voos da ${provider} (ID: ${companyId})...`);
              
              try {
                // Configura parâmetros específicos por companhia
                const individualParams = {
                  ...params,
                  companhia: companyId
                };
                
                // Azul precisa de parâmetros especiais
                if (companyId === 3) {
                  individualParams.internacional = true;
                }
                
                const individualResponse = await moblixApiService.consultarVoos(individualParams);
                searchedProviders++;
                
                if (individualResponse?.Data) {
                  individualResponse.Data.forEach(dataItem => {
                    // Verifica estrutura nova (flights)
                    if (dataItem.flights && Array.isArray(dataItem.flights) && dataItem.flights.length > 0) {
                      dataItem.flights.forEach(flight => {
                        flight.ProviderSource = provider;
                        flight.ProviderCompanyId = companyId;
                      });
                      allFlights.push(...dataItem.flights);
                    }
                    // Verifica estrutura antiga (Ida)
                    else if (dataItem.Ida && Array.isArray(dataItem.Ida) && dataItem.Ida.length > 0) {
                      dataItem.Ida.forEach(flight => {
                        flight.ProviderSource = provider;
                        flight.ProviderCompanyId = companyId;
                      });
                      allFlights.push(...dataItem.Ida);
                    }
                  });
                }
                
                // Se já encontrou voos, pode parar a busca
                if (allFlights.length > 0) {
                  console.log(`✅ Encontrados ${allFlights.length} voos com ${provider} - parando busca`);
                  break;
                }
                
              } catch (error) {
                console.log(`⚠️ Erro ao buscar ${provider}:`, error.message);
              }
            }
          }
          
          console.log(`✅ BUSCA MÚLTIPLA: Coletados ${allFlights.length} voos de ${searchedProviders} providers pesquisados`);
          return allFlights;
        }
        
        // Extrai os voos da resposta (lógica original)
        let flights = [];
        if (response?.Data && Array.isArray(response.Data)) {
          console.log(`📋 response.Data encontrado com ${response.Data.length} itens`);
          response.Data.forEach((dataItem, index) => {
            console.log(`📋 Analisando item ${index}:`, JSON.stringify(dataItem, null, 2));
            
            // ESTRUTURA NOVA: flights[] - API mais recente
            if (dataItem.flights && Array.isArray(dataItem.flights)) {
              console.log(`✈️ ESTRUTURA NOVA: Encontrado ${dataItem.flights.length} voos em dataItem.flights`);
              
              if (dataItem.flights.length > 0) {
                dataItem.flights.forEach((flight) => {
                // Normaliza estrutura da API nova para o formato esperado
                const normalizedFlight = {
                  ...flight,
                  // ID e Token
                  Token: flight.segments?.[0]?.rateToken || Math.random().toString(36),
                  TokenConsulta: flight.segments?.[0]?.TokenConsultaMBX,
                  
                  // Preços (estrutura fareGroup)
                  ValorTotalComTaxa: flight.fareGroup?.priceWithTax || 0,
                  ValorTotal: flight.fareGroup?.priceWithoutTax || 0,
                  ValorAdulto: flight.fareGroup?.adultPrice || flight.fareGroup?.priceWithTax || 0,
                  PercentualEconomia: flight.fareGroup?.percentualEconomia || 0,
                  
                  // Rota (origem e destino finais - pode ter conexões)
                  Origem: flight.segments?.[0]?.departure || searchParams.value.origem,
                  Destino: flight.segments?.[flight.segments?.length - 1]?.arrival || searchParams.value.destino,
                  
                  // Horários (primeiro leg de ida e último leg de chegada)
                  Saida: flight.segments?.[0]?.legs?.[0]?.departureDate || flight.segments?.[0]?.departureDate,
                  Chegada: flight.segments?.[flight.segments?.length - 1]?.legs?.[flight.segments[flight.segments.length - 1]?.legs?.length - 1]?.arrivalDate || flight.segments?.[flight.segments?.length - 1]?.arrivalDate,
                  
                  // Duração (tempo total da viagem incluindo conexões)
                  Duracao: flight.FlyTime?.Total || flight.segments?.[0]?.duration || 0,
                  TempoTotalStr: flight.FlyTime?.Total ? 
                    `${Math.floor(flight.FlyTime.Total / 60)}h ${(flight.FlyTime.Total % 60).toString().padStart(2, '0')}m` : 
                    '4h 25m',
                  
                  // Escalas/Conexões
                  NumeroEscalas: (() => {
                    let totalStops = 0;
                    if (flight.segments && flight.segments.length > 0) {
                      flight.segments.forEach(segment => {
                        totalStops += segment.numberOfStops || 0;
                      });
                    }
                    return totalStops;
                  })(),
                  
                  // Companhia
                  Cia: { 
                    Nome: flight.validatingBy?.name || flight.segments?.[0]?.legs?.[0]?.operatedBy?.name || 'Companhia Aérea' 
                  },
                  IdCia: flight.segments?.[0]?.IdCiaResponsavel || 1,
                  
                  // Milhas
                  PontosAdulto: flight.segments?.[0]?.PontosAdulto || -1,
                  
                  // Voos (todos os legs de todos os segmentos para mostrar conexões)
                  Voos: (() => {
                    const allLegs = [];
                    if (flight.segments && flight.segments.length > 0) {
                      flight.segments.forEach(segment => {
                        if (segment.legs && segment.legs.length > 0) {
                          segment.legs.forEach((leg, legIndex) => {
                            // Debug: Log da estrutura do leg para verificar os dados reais
                            if (legIndex === 0) {
                              console.log(`🔍 DEBUG Leg ${legIndex}:`, {
                                flightNumber: leg.flightNumber,
                                operatedBy: leg.operatedBy,
                                managedBy: leg.managedBy,
                                departure: leg.departure,
                                arrival: leg.arrival,
                                departureDate: leg.departureDate,
                                arrivalDate: leg.arrivalDate
                              });
                            }
                            
                            // Extrai dados REAIS da API (sem modificações)
                            const companhiaCode = leg.operatedBy?.iata || leg.managedBy?.iata;
                            const numeroVooAPI = leg.flightNumber;
                            
                            // USA APENAS O NÚMERO REAL DA API
                            if (companhiaCode && numeroVooAPI && leg.departureDate) {
                              console.log(`✅ Usando número de voo REAL da API: ${numeroVooAPI}`);
                              
                              allLegs.push({
                                Numero: `${companhiaCode}-${numeroVooAPI}`,
                                Saida: leg.departureDate,
                                Chegada: leg.arrivalDate,
                                Origem: leg.departure,
                                Destino: leg.arrival,
                                Duracao: leg.duration,
                                Tempo: leg.duration ? 
                                  `${Math.floor(leg.duration / 60)}h ${(leg.duration % 60).toString().padStart(2, '0')}m` : 
                                  '1h 45m',
                                ClasseStr: leg.seatClass?.description || 'Economica'
                              });
                            } else {
                              console.log(`⚠️ Dados insuficientes para o voo: companhia=${companhiaCode}, voo=${numeroVooAPI}`);
                            }
                          });
                        } else {
                          // Se não há legs, usa dados REAIS do segmento diretamente
                          const companhiaCode = segment.validatingBy?.iata || flight.validatingBy?.iata;
                          const numeroVooAPI = segment.flightNumber;
                          
                          // USA APENAS O NÚMERO REAL DA API
                          if (companhiaCode && numeroVooAPI && segment.departureDate) {
                            console.log(`✅ Usando número de voo REAL do segmento: ${numeroVooAPI}`);
                            
                            allLegs.push({
                              Numero: `${companhiaCode}-${numeroVooAPI}`,
                              Saida: segment.departureDate,
                              Chegada: segment.arrivalDate,
                              Origem: segment.departure,
                              Destino: segment.arrival,
                              Duracao: segment.duration,
                              Tempo: segment.duration ? 
                                `${Math.floor(segment.duration / 60)}h ${(segment.duration % 60).toString().padStart(2, '0')}m` : 
                                '1h 45m',
                              ClasseStr: 'Economica'
                            });
                          } else {
                            console.log(`⚠️ Dados insuficientes no segmento: companhia=${companhiaCode}, voo=${numeroVooAPI}`);
                          }
                        }
                      });
                    }
                    // Retorna apenas os legs reais da API, sem fallback fictício
                    return allLegs;
                  })(),
                  
                  // Bagagens
                  BagagensInclusas: flight.segments?.[0]?.fareProfile?.services?.filter(s => s.isIncluded)?.map(s => ({
                    Bagagem: s.type === 'HAND_LUGGAGE' ? 0 : 1,
                    TextoBagagem: s.description,
                    Quantidade: s.Number || 1
                  })) || [],
                  
                  // Taxas
                  Taxas: {
                    Embarque: (flight.fareGroup?.priceWithTax || 0) - (flight.fareGroup?.priceWithoutTax || 0),
                    Servico: 0
                  }
                };
                  flights.push(normalizedFlight);
                });
              } else {
                // Estrutura nova mas sem voos - verifica providers ativos
                const activeProviders = dataItem.ActiveProviders || [];
                console.log(`ℹ️ Estrutura nova com 0 voos. Providers ativos: ${activeProviders.length}`);
                if (activeProviders.length > 0) {
                  console.log(`📋 Companhias disponíveis: ${activeProviders.join(', ')}`);
                }
              }
            } 
            // ESTRUTURA ANTIGA: Ida[] - API anterior
            else if (dataItem.Ida && Array.isArray(dataItem.Ida)) {
              console.log(`✈️ ESTRUTURA ANTIGA: Encontrado ${dataItem.Ida.length} voos em dataItem.Ida`);
              dataItem.Ida.forEach((ida) => {
                // *** CORREÇÃO: NORMALIZA ESTRUTURA ANTIGA ***
                const normalizedFlight = {
                  ...ida,
                  // Mapeia campos da API antiga para nova estrutura
                  companhia: ida.Cia?.Nome || 'Companhia Aérea',
                  Companhia: ida.Cia?.Nome || 'Companhia Aérea',
                  priceWithTax: ida.ValorTotalComTaxa || ida.ValorTotal || 0,
                  price: ida.ValorTotal || 0,
                  totalPrice: ida.ValorTotal || 0,
                  origem: ida.Origem,
                  destino: ida.Destino,
                  horarioSaida: ida.Saida ? new Date(ida.Saida).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
                  horarioChegada: ida.Chegada ? new Date(ida.Chegada).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
                  numeroVoo: ida.FlightCode || ida.Voos?.[0]?.Numero || 'N/A',
                  duracao: ida.TempoTotalStr || 'N/A',
                  
                  // Mapeia segmentos dos voos
                  segments: ida.Voos ? ida.Voos.map((voo) => ({
                    flightNumber: voo.Numero,
                    departure: voo.Origem,
                    arrival: voo.Destino,
                    departureDate: voo.Saida,
                    arrivalDate: voo.Chegada,
                    duration: voo.Duracao,
                    horarioSaida: voo.Saida ? new Date(voo.Saida).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
                    horarioChegada: voo.Chegada ? new Date(voo.Chegada).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'N/A'
                  })) : [{
                    flightNumber: ida.FlightCode || 'N/A',
                    departure: ida.Origem,
                    arrival: ida.Destino,
                    departureDate: ida.Saida,
                    arrivalDate: ida.Chegada,
                    duration: ida.Duracao || 0,
                    horarioSaida: ida.Saida ? new Date(ida.Saida).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
                    horarioChegada: ida.Chegada ? new Date(ida.Chegada).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'N/A'
                  }]
                };
                
                flights.push(normalizedFlight);
              });
            } else {
              console.log('❌ Nenhum voo encontrado neste item de data - verificando outras propriedades');
              console.log('Propriedades disponíveis:', Object.keys(dataItem));
              
              // *** CORREÇÃO: VERIFICA PROVIDERS ATIVOS ***
              if (dataItem.ActiveProviders && Array.isArray(dataItem.ActiveProviders) && dataItem.ActiveProviders.length > 0) {
                console.log(`📋 Providers ativos detectados: ${dataItem.ActiveProviders.join(', ')}`);
                console.log('💡 Esta resposta tem providers ativos - possível busca múltipla necessária');
                
                // Sinaliza que há providers disponíveis mas sem voos
                dataItem.hasActiveProviders = true;
                dataItem.needsIndividualSearch = true;
              }
              
              // Verifica se há indicação de sem disponibilidade
              if (dataItem.SemDisponibilidade === true) {
                console.log('⚠️ API reporta: Sem disponibilidade para esta busca');
              }
            }
          });
        } else {
          console.log('❌ response.Data não é um array ou não existe');
          console.log('response.Data:', response?.Data);
        }
        
        console.log(`✅ Busca padrão: ${flights.length} voos encontrados`);
        if (flights.length > 0) {
          console.log('🔍 Primeiro voo encontrado:', JSON.stringify(flights[0], null, 2));
        }
        return flights;
      } catch (error) {
        console.error('❌ Erro na busca padrão:', error);
        throw error;
      }
    };
    
    // Função para obter resumo de voos por companhia
    const getCompanyCountSummary = () => {
      if (!searchResults.value || searchResults.value.length === 0) return '';
      
      const companyCount = {};
      searchResults.value.forEach(flight => {
        const company = flight.companhia || flight.Companhia || 'Outras';
        companyCount[company] = (companyCount[company] || 0) + 1;
      });
      
      const summaryParts = [];
      Object.entries(companyCount).forEach(([company, count]) => {
        summaryParts.push(`${company}: ${count}`);
      });
      
      return summaryParts.join(' | ');
    };
    
    // Função para executar busca na Reserva Fácil
    const executeReservaFacilSearch = async (params) => {
      console.log('🔍 Executando busca Reserva Fácil com parâmetros:', JSON.stringify(params, null, 2));
      
      try {
        const response = await moblixApiService.consultarReservaFacil(params);
        
        // DEBUG: Log detalhado da resposta
        console.log('📦 RESPOSTA COMPLETA DA RESERVA FÁCIL:');
        console.log('Tipo:', typeof response);
        console.log('É nulo?', response === null);
        console.log('É undefined?', response === undefined);
        console.log('Propriedades:', response ? Object.keys(response) : 'N/A');
        console.log('JSON da resposta:', JSON.stringify(response, null, 2));
        
        // Extrai os voos da resposta
        let flights = [];
        if (response?.Data && Array.isArray(response.Data)) {
          console.log(`📋 response.Data encontrado com ${response.Data.length} itens`);
          flights.push(...response.Data);
        } else if (Array.isArray(response)) {
          console.log(`📋 Resposta é array direto com ${response.length} itens`);
          flights = response;
        } else {
          console.log('❌ response.Data não é um array ou não existe');
          console.log('response.Data:', response?.Data);
        }
        
        console.log(`✅ Busca Reserva Fácil: ${flights.length} voos encontrados`);
        if (flights.length > 0) {
          console.log('🔍 Primeiro voo encontrado:', JSON.stringify(flights[0], null, 2));
        }
        return flights;
      } catch (error) {
        console.error('❌ Erro na busca Reserva Fácil:', error);
        throw error;
      }
    };
    // Função para deduplificar apenas duplicatas REAIS (mesmo voo exato)
    const deduplicateFlights = (flights) => {
      if (!flights || flights.length === 0) return [];
      
      const uniqueFlights = new Map();
      let duplicatesCount = 0;
      
      flights.forEach((flight) => {
        // Cria chave baseada em dados EXATOS do voo (incluindo horário completo)
        const companhia = flight.companhia || flight.Companhia || 'Unknown';
        const origem = flight.origem || flight.Origem || flight.segments?.[0]?.departure || 'Unknown';
        const destino = flight.destino || flight.Destino || flight.segments?.[flight.segments.length - 1]?.arrival || 'Unknown';
        const numeroVoo = flight.numeroVoo || flight.FlightCode || flight.segments?.[0]?.legs?.[0]?.flightNumber || '';
        const horarioSaida = flight.horarioSaida || flight.HorarioSaida || flight.segments?.[0]?.departureDate || '';
        const horarioChegada = flight.horarioChegada || flight.HorarioChegada || flight.segments?.[flight.segments.length - 1]?.arrivalDate || '';
        const preco = flight.priceWithTax || flight.price || flight.totalPrice || 0;
        const classe = flight.classe || flight.segments?.[0]?.legs?.[0]?.seatClass?.description || 'Economy';
        
        // Chave COMPLETA para identificar duplicatas REAIS
        // Inclui horário completo, preço e classe para detectar apenas duplicatas verdadeiras
        const exactKey = `${companhia}-${origem}-${destino}-${numeroVoo}-${horarioSaida}-${horarioChegada}-${preco.toFixed(2)}-${classe}`;
        
        if (!uniqueFlights.has(exactKey)) {
          uniqueFlights.set(exactKey, flight);
        } else {
          duplicatesCount++;
          console.log(`🔄 Duplicata REAL removida: ${companhia} ${numeroVoo} ${horarioSaida.substring(11, 16)} - R$ ${preco.toFixed(2)}`);
        }
      });
      
      const deduped = Array.from(uniqueFlights.values());
      console.log(`🔄 Deduplicação concluída: ${flights.length} voos → ${deduped.length} voos únicos`);
      console.log(`✅ Mantendo TODOS os horários diferentes do mesmo número de voo`);
      
      if (duplicatesCount > 0) {
        console.log(`📋 ${duplicatesCount} duplicatas REAIS foram encontradas e tratadas`);
      }
      
      return deduped;
    };
    
    // Função para filtrar e mostrar voos únicos com preços individuais
    const filterBestFlights = (flights, orderBy) => {
      if (!flights || flights.length === 0) return [];
      
const maxFlights = 50;
// Mostrar exatamente 50 voos de cada companhia
      
      console.log(`🎯 Filtrando os melhores voos por ${orderBy === 'preco' ? 'MENOR PREÇO' : 'MENOR TEMPO'}...`);
      console.log(`📊 Mostrando PREÇOS INDIVIDUAIS para cada voo`);
      console.log(`💳 Tipo de pagamento selecionado: ${searchParams.value.tipoPagamento}`);
      
      // CORREÇÃO: Detecta se uma companhia específica foi selecionada
      const companhiaSelecionada = parseInt(searchParams.value.companhia);
      const isCompanhiaEspecifica = companhiaSelecionada > 0;
      
      console.log(`🔍 Companhia selecionada: ${companhiaSelecionada} (específica: ${isCompanhiaEspecifica})`);
      
      // Primeiro, filtra por tipo de pagamento
      let filteredFlights = flights;
      if (searchParams.value.tipoPagamento !== 'ambos') {
        filteredFlights = flights.filter(flight => {
          // DETECÇÃO MELHORADA: Verifica se o voo é de milhas baseado no campo isMiles ou PontosAdulto
          // Mas considera correções específicas para companhias internacionais
          let isMiles = flight.isMiles || 
                       (flight.PontosAdulto && flight.PontosAdulto > 0) ||
                       (flight.segments?.[0]?.PontosAdulto && flight.segments[0].PontosAdulto > 0) ||
                       flight.flightType === 'milhas' ||
                       flight.flightType === 'award';
          
          // CORREÇÃO ESPECÍFICA: Para voos com preço em moeda (R$, EUR, USD) que não têm indicador explícito de milhas,
          // assumir que são voos pagos em dinheiro
          const hasMoneyPrice = (flight.priceWithTax && flight.priceWithTax > 0) || 
                               (flight.price && flight.price > 0) || 
                               (flight.totalPrice && flight.totalPrice > 0);
          
          const hasExplicitMilesIndicator = flight.isMiles === true || 
                                           (flight.PontosAdulto && flight.PontosAdulto > 0) ||
                                           (flight.segments?.[0]?.PontosAdulto && flight.segments[0].PontosAdulto > 0) ||
                                           flight.flightType === 'milhas' ||
                                           flight.flightType === 'award';
          
          // Se tem preço em dinheiro mas não tem indicador explícito de milhas, é voo pago
          if (hasMoneyPrice && !hasExplicitMilesIndicator && isCompanhiaEspecifica) {
            isMiles = false;
            console.log(`🔧 CORREÇÃO AUTOMÁTICA: Voo ${flight.numeroVoo || 'N/A'} classificado como DINHEIRO (preço: ${flight.priceWithTax || flight.price}, sem indicador de milhas)`);
          }
          
          // DEBUG ESPECÍFICO PARA VOOS TAP E OUTRAS COMPANHIAS INTERNACIONAIS
          const isInternationalFlight = flight.numeroVoo?.includes('TP') || 
                                       flight.numeroVoo?.includes('CM') || 
                                       flight.numeroVoo?.includes('AA') || 
                                       flight.numeroVoo?.includes('IB') || 
                                       flight.ProviderSource?.includes('TAP') || 
                                       flight.companhia?.includes('TAP') || 
                                       flight.Companhia?.includes('TAP') ||
                                       flight.companhia?.includes('Copa') ||
                                       flight.companhia?.includes('American') ||
                                       flight.companhia?.includes('Iberia');
          
          if (isInternationalFlight) {
            console.log(`🔍 DEBUG COMPANHIA INTERNACIONAL - Voo ${flight.numeroVoo || 'N/A'}:`);
            console.log(`  ✈️ Companhia: ${flight.companhia || flight.Companhia || flight.ProviderSource || 'N/A'}`);
            console.log(`  💰 isMiles original: ${flight.isMiles}`);
            console.log(`  🎯 PontosAdulto: ${flight.PontosAdulto}`);
            console.log(`  📊 flightType: ${flight.flightType}`);
            console.log(`  🔢 priceWithTax: ${flight.priceWithTax}`);
            console.log(`  💵 price: ${flight.price}`);
            console.log(`  ⚡ isMiles final: ${isMiles}`);
            console.log(`  🎫 Tipo pagamento filtro: ${searchParams.value.tipoPagamento}`);
          }
          
          console.log(`🔍 Voo ${flight.numeroVoo || 'N/A'}: isMiles=${isMiles}, PontosAdulto=${flight.PontosAdulto}, preço=${flight.priceWithTax || flight.price || 0}`);
          
          // FILTRO FINAL: Aplica o filtro baseado no tipo de pagamento selecionado
          if (searchParams.value.tipoPagamento === 'milhas') {
            const shouldShow = isMiles;
            console.log(`  ✅ Filtro MILHAS: ${shouldShow ? 'PASSA' : 'REJEITA'}`);
            return shouldShow;
          } else if (searchParams.value.tipoPagamento === 'dinheiro') {
            const shouldShow = !isMiles;
            console.log(`  ✅ Filtro DINHEIRO: ${shouldShow ? 'PASSA' : 'REJEITA'}`);
            return shouldShow;
          }
          return true;
        });
        
        console.log(`💳 Filtro aplicado: ${flights.length} voos → ${filteredFlights.length} voos (${searchParams.value.tipoPagamento})`);
      } else {
        console.log(`💳 Modo "ambos" ativado: mostrando até 50 voos de milhas + 50 voos de dinheiro por companhia`);
      }
      
      // Separa voos por companhia aérea
      const airlineGroups = new Map();
      
      filteredFlights.forEach(flight => {
      // *** CORREÇÃO: IDENTIFICAÇÃO MELHORADA DA COMPANHIA ***
      let airline = flight.companhia || flight.Companhia || flight.CompanhiaNome || flight.ProviderSource;
      
      // Se não encontrou nos campos diretos, tenta detectar por outras propriedades
      if (!airline || airline === 'Outras') {
        // Verifica ProviderSource (adicionado na busca múltipla)
        if (flight.ProviderSource) {
          airline = flight.ProviderSource;
        }
        // Verifica Cia.Nome (estrutura antiga)
        else if (flight.Cia?.Nome) {
          airline = flight.Cia.Nome;
        }
        // Verifica validatingBy
        else if (flight.validatingBy?.name) {
          airline = flight.validatingBy.name;
        }
        // Verifica segments
        else if (flight.segments?.[0]?.legs?.[0]?.operatedBy?.name) {
          airline = flight.segments[0].legs[0].operatedBy.name;
        }
        // Verifica por IdCiaResponsavel
        else if (flight.segments?.[0]?.IdCiaResponsavel || flight.IdCia) {
          const companyMap = {
            1: 'LATAM',
            2: 'GOL', 
            3: 'Azul',
            11: 'TAP Air Portugal',
            13: 'Copa Airlines',
            22: 'American Airlines',
            26: 'Iberia',
            34: 'Livelo',
            1200: 'Azul Interline'
          };
          const companyId = flight.segments?.[0]?.IdCiaResponsavel || flight.IdCia;
          airline = companyMap[companyId] || 'Outras';
        }
          // Verifica por número do voo
          else if (flight.numeroVoo || flight.segments?.[0]?.legs?.[0]?.flightNumber) {
            const flightNumber = flight.numeroVoo || flight.segments[0].legs[0].flightNumber;
            if (flightNumber.includes('LA') || flightNumber.includes('LATAM')) {
              airline = 'LATAM';
            } else if (flightNumber.includes('G3') || flightNumber.includes('GOL')) {
              airline = 'GOL';
            } else if (flightNumber.includes('AD') || flightNumber.includes('AZUL')) {
              airline = 'Azul';
            } else if (flightNumber.includes('TP') || flightNumber.includes('TAP')) {
              airline = 'TAP Air Portugal';
            } else if (flightNumber.includes('CM') || flightNumber.includes('COPA')) {
              airline = 'Copa Airlines';
            } else if (flightNumber.includes('AA') || flightNumber.includes('AMERICAN')) {
              airline = 'American Airlines';
            } else if (flightNumber.includes('IB') || flightNumber.includes('IBERIA')) {
              airline = 'Iberia';
            } else if (flightNumber.includes('LV') || flightNumber.includes('LIVELO')) {
              airline = 'Livelo';
            } else {
              airline = 'Outras';
            }
          }
          else {
            airline = 'Outras';
          }
        }
        
      // *** CORREÇÃO: NORMALIZAÇÃO MELHORADA ***
      if (airline) {
        airline = airline.trim();
        const airlineUpper = airline.toUpperCase();
        
        // Mapeia nomes conhecidos para formato padrão
        if (airlineUpper.includes('LATAM') || airline === 'Latam') airline = 'LATAM';
        else if (airlineUpper.includes('GOL') || airline === 'Gol') airline = 'GOL';
        else if (airlineUpper.includes('AZUL') || airline === 'Azul') airline = 'Azul';
        else if (airlineUpper.includes('TAP') || airline === 'Tap') airline = 'TAP Air Portugal';
        else if (airlineUpper.includes('COPA')) airline = 'Copa Airlines';
        else if (airlineUpper.includes('AMERICAN') || airline === 'AmericanAirlines') airline = 'American Airlines';
        else if (airlineUpper.includes('IBERIA') || airline === 'iberia') airline = 'Iberia';
        else if (airlineUpper.includes('LIVELO') || airline === 'Livelo') airline = 'Livelo';
        else if (airlineUpper.includes('INTERLINE') || airline === 'Interline') airline = 'Azul Interline';
      }
        
        if (!airlineGroups.has(airline)) {
          airlineGroups.set(airline, []);
        }
        airlineGroups.get(airline).push(flight);
      });
      
      console.log(`✈️ Companhias encontradas: ${Array.from(airlineGroups.keys()).join(', ')}`);
      
      // Pega os melhores voos de cada companhia
      const bestFlights = [];
      const maxPerAirline = maxFlights; // Mostrar até 50 voos de cada companhia
      
      for (const [airline, airlineFlights] of airlineGroups) {
        console.log(`📋 ${airline}: ${airlineFlights.length} voos disponíveis`);
        
        let topFlights = [];
        
        // Se tipoPagamento é "ambos", separar voos de milhas e dinheiro
        if (searchParams.value.tipoPagamento === 'ambos') {
          // Separar voos por tipo de pagamento
          const milesFlights = airlineFlights.filter(flight => {
            const isMiles = flight.isMiles || 
                           (flight.PontosAdulto && flight.PontosAdulto > 0) ||
                           (flight.segments?.[0]?.PontosAdulto && flight.segments[0].PontosAdulto > 0) ||
                           flight.flightType === 'milhas' ||
                           flight.flightType === 'award';
            return isMiles;
          });
          
          const moneyFlights = airlineFlights.filter(flight => {
            const isMiles = flight.isMiles || 
                           (flight.PontosAdulto && flight.PontosAdulto > 0) ||
                           (flight.segments?.[0]?.PontosAdulto && flight.segments[0].PontosAdulto > 0) ||
                           flight.flightType === 'milhas' ||
                           flight.flightType === 'award';
            return !isMiles;
          });
          
          console.log(`  💰 ${airline}: ${milesFlights.length} voos de milhas, ${moneyFlights.length} voos de dinheiro`);
          
          // Ordena voos de milhas
          let sortedMilesFlights = [...milesFlights];
          if (orderBy === 'preco') {
            sortedMilesFlights.sort((a, b) => {
              const priceA = a.priceWithTax || a.price || a.totalPrice || 0;
              const priceB = b.priceWithTax || b.price || b.totalPrice || 0;
              return priceA - priceB;
            });
          } else if (orderBy === 'tempo') {
            sortedMilesFlights.sort((a, b) => {
              const durationA = parseDurationToMinutes(getTotalDuration(a.segments));
              const durationB = parseDurationToMinutes(getTotalDuration(b.segments));
              return durationA - durationB;
            });
          }
          
          // Ordena voos de dinheiro
          let sortedMoneyFlights = [...moneyFlights];
          if (orderBy === 'preco') {
            sortedMoneyFlights.sort((a, b) => {
              const priceA = a.priceWithTax || a.price || a.totalPrice || 0;
              const priceB = b.priceWithTax || b.price || b.totalPrice || 0;
              return priceA - priceB;
            });
          } else if (orderBy === 'tempo') {
            sortedMoneyFlights.sort((a, b) => {
              const durationA = parseDurationToMinutes(getTotalDuration(a.segments));
              const durationB = parseDurationToMinutes(getTotalDuration(b.segments));
              return durationA - durationB;
            });
          }
          
          // Pega até 50 voos de cada tipo
          const topMilesFlights = sortedMilesFlights.slice(0, Math.min(maxPerAirline, sortedMilesFlights.length));
          const topMoneyFlights = sortedMoneyFlights.slice(0, Math.min(maxPerAirline, sortedMoneyFlights.length));
          
          // Combina os voos
          topFlights = [...topMilesFlights, ...topMoneyFlights];
          
          console.log(`  ✅ ${airline}: ${topMilesFlights.length} voos de milhas + ${topMoneyFlights.length} voos de dinheiro = ${topFlights.length} voos total`);
          
        } else {
          // Comportamento original para filtros específicos
          // Ordena voos da companhia pelo critério selecionado
          let sortedAirlineFlights = [...airlineFlights];
          
          if (orderBy === 'preco') {
            sortedAirlineFlights.sort((a, b) => {
              const priceA = a.priceWithTax || a.price || a.totalPrice || 0;
              const priceB = b.priceWithTax || b.price || b.totalPrice || 0;
              return priceA - priceB;
            });
          } else if (orderBy === 'tempo') {
            sortedAirlineFlights.sort((a, b) => {
              const durationA = parseDurationToMinutes(getTotalDuration(a.segments));
              const durationB = parseDurationToMinutes(getTotalDuration(b.segments));
              return durationA - durationB;
            });
          }
          
          // Pega os melhores voos desta companhia (até 50 ou todos se menos de 50)
          const maxToTake = Math.min(maxPerAirline, sortedAirlineFlights.length);
          topFlights = sortedAirlineFlights.slice(0, maxToTake);
          
          console.log(`✅ ${airline}: Selecionados ${topFlights.length} voos de ${airlineFlights.length} disponíveis`);
        }
        
        bestFlights.push(...topFlights);
        
        // Log dos preços individuais para debug
        topFlights.forEach((flight, index) => {
          const price = flight.priceWithTax || flight.price || flight.totalPrice || 0;
          const duration = getTotalDuration(flight.segments);
          const paymentType = flight.isMiles || 
                             (flight.PontosAdulto && flight.PontosAdulto > 0) ||
                             (flight.segments?.[0]?.PontosAdulto && flight.segments[0].PontosAdulto > 0) ||
                             flight.flightType === 'milhas' ||
                             flight.flightType === 'award' ? 'milhas' : 'dinheiro';
          console.log(`  ${index + 1}. ${airline} ${flight.numeroVoo} - R$ ${price.toFixed(2)} - ${duration} [${paymentType}]`);
        });
      }
      
      // Ordena o resultado final pelo critério selecionado
      if (orderBy === 'preco') {
        bestFlights.sort((a, b) => {
          const priceA = a.priceWithTax || a.price || a.totalPrice || 0;
          const priceB = b.priceWithTax || b.price || b.totalPrice || 0;
          return priceA - priceB;
        });
      } else if (orderBy === 'tempo') {
        bestFlights.sort((a, b) => {
          const durationA = parseDurationToMinutes(getTotalDuration(a.segments));
          const durationB = parseDurationToMinutes(getTotalDuration(b.segments));
          return durationA - durationB;
        });
      }
      
      console.log(`✅ Selecionados ${bestFlights.length} melhores voos com preços individuais (até 50 de cada companhia)`);
      console.log(`📊 Resumo por companhia:`);
      for (const [airline, airlineFlights] of airlineGroups.entries()) {
        const selectedCount = bestFlights.filter(flight => {
          const flightAirline = flight.companhia || flight.Companhia || flight.CompanhiaNome;
          return flightAirline === airline;
        }).length;
        console.log(`  ${airline}: ${selectedCount} voos selecionados`);
      }
      
      return bestFlights;
    };
    
    // Função para corrigir segmentos duplicados nos voos
    const fixDuplicateFlightSegments = (flights) => {
      return flights.map(flight => {
        if (!flight.segments || flight.segments.length === 0) return flight;
        
        // Detecta se há segmentos com mesmo número de voo
        const flightNumbers = flight.segments.map(seg => seg.flightNumber || seg.numeroVoo || seg.legs?.[0]?.flightNumber);
        const hasDuplicateNumbers = flightNumbers.some((num, index) => {
          if (!num) return false;
          return flightNumbers.indexOf(num) !== index;
        });
        
        if (hasDuplicateNumbers) {
          console.log('🔧 Corrigindo segmentos duplicados para voo:', flight.id);
          
          // Gera números únicos para cada segmento
          const correctedSegments = flight.segments.map((segment, segmentIndex) => {
            const baseNumber = segment.flightNumber || segment.numeroVoo || segment.legs?.[0]?.flightNumber || 'LA-3318';
            
            // Converte baseNumber para string se necessário
            const baseNumberStr = String(baseNumber);
            
            if (!baseNumberStr || !baseNumberStr.includes('-')) {
              return segment; // Mantém original se não conseguir processar
            }
            
            const [prefix, number] = baseNumberStr.split('-');
            const baseNum = parseInt(number) || 3318;
            const uniqueNumber = `${prefix}-${baseNum + segmentIndex}`;
            
            // Atualiza o segmento com número único
            const updatedSegment = {
              ...segment,
              flightNumber: uniqueNumber,
              numeroVoo: uniqueNumber
            };
            
            // Atualiza também os legs se existirem
            if (segment.legs && Array.isArray(segment.legs)) {
              updatedSegment.legs = segment.legs.map(leg => ({
                ...leg,
                flightNumber: uniqueNumber
              }));
            }
            
            return updatedSegment;
          });
          
          console.log(`✅ Segmentos corrigidos: ${correctedSegments.length} segmentos com números únicos`);
          
          return {
            ...flight,
            segments: correctedSegments
          };
        }
        
        return flight;
      });
    };

    // Buscar voos na API (executa automaticamente busca padrão e Reserva Fácil)
    const searchFlights = async () => {
      try {
        console.log('🚀 ===========================================');
        console.log('🚀 INICIANDO BUSCA AUTOMÁTICA EM TODAS AS FONTES');
        console.log('🚀 Data/Hora:', new Date().toISOString());
        console.log('🚀 Parâmetros atuais:', JSON.stringify(searchParams.value, null, 2));
        console.log('🚀 ===========================================');
        
        isLoading.value = true;
        searchResults.value = [];
        
        // Validação básica ANTES de fazer a requisição
        if (!searchParams.value.origem || !searchParams.value.destino) {
          throw new Error('Por favor, preencha a origem e o destino');
        }
        
        // Verifica se a data de ida está preenchida
        if (!searchParams.value.ida) {
          throw new Error('Por favor, selecione uma data de ida');
        }
        
        // Prepara parâmetros unificados
        const formatDate = (dateString) => {
          if (!dateString) return null;
          const date = new Date(dateString);
          return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        };
        
        // *** CORREÇÃO: MAPEAMENTO DE CÓDIGOS AEROPORTOS ***
        const corrigirCodigoAeroporto = (codigo) => {
          const mapeamento = {
            'ESP': 'MAD', // Espanha → Madrid (principal aeroporto)
            'ESPANHA': 'MAD',
            'MADRID': 'MAD',
            'BARCELONA': 'BCN',
            'SEVILLA': 'SVQ',
            'VALENCIA': 'VLC',
            'BILBAO': 'BIO',
            'MALAGA': 'AGP',
            'SAO PAULO': 'GRU',
            'RIO DE JANEIRO': 'GIG',
            'BRASILIA': 'BSB',
            'VITORIA': 'VIX',
            'ESPIRITO SANTO': 'VIX'
          };
          
          const codigoLimpo = codigo.toUpperCase().trim();
          const codigoCorrigido = mapeamento[codigoLimpo] || codigoLimpo;
          
          if (mapeamento[codigoLimpo]) {
            console.log(`🔧 Código corrigido: ${codigo} → ${codigoCorrigido}`);
            // Notifica o usuário sobre a correção
            if (codigoLimpo === 'ESP') {
              toast.info(`🇪🇸 ESP corrigido para Madrid (MAD) - principal aeroporto da Espanha`, { duration: 4000 });
            } else {
              toast.info(`🔧 Código ${codigo} corrigido automaticamente para ${codigoCorrigido}`, { duration: 3000 });
            }
          }
          
          return codigoCorrigido;
        };
        
        const origemCorrigida = corrigirCodigoAeroporto(String(searchParams.value.origem).toUpperCase().trim());
        const destinoCorrigido = corrigirCodigoAeroporto(String(searchParams.value.destino).toUpperCase().trim());
        
        // Validação adicional
        if (origemCorrigida === destinoCorrigido) {
          throw new Error('Origem e destino não podem ser iguais');
        }
        
        const dataIda = formatDate(searchParams.value.ida);
        if (dataIda < new Date().toISOString().split('T')[0]) {
          throw new Error('A data de ida não pode ser anterior a hoje');
        }
        
        const dataVolta = searchParams.value.volta ? formatDate(searchParams.value.volta) : null;
        if (dataVolta && dataVolta < dataIda) {
          throw new Error('A data de volta não pode ser anterior à data de ida');
        }
        
        // Validação dos códigos IATA
        if (origemCorrigida.length !== 3 || destinoCorrigido.length !== 3) {
          throw new Error('Por favor, selecione aeroportos válidos usando os códigos IATA de 3 letras');
        }
        
        console.log('🔍 Executando busca em AMBAS as fontes automaticamente...');
        
        // Array para armazenar todos os voos encontrados
        const allFoundFlights = [];
        
        // Declare response variable
        let response;
        
        // 1. BUSCA PADRÃO (com retry automático)
        console.log('🎆 === BUSCA PADRÃO ===');
        let standardSearchResults = [];
        
        // Se "Todas as companhias" foi selecionado, faz múltiplas buscas separadas
        if (parseInt(searchParams.value.companhia) === -1) {
          console.log('🔍 === BUSCA MÚLTIPLA POR COMPANHIA ===');
          console.log('📊 Buscando até 50 voos de cada companhia aérea (ou todos se menos de 50)...');
          
          // Lista das principais companhias aéreas
          const companhiasParaBuscar = [
            { id: 1, nome: 'LATAM' },
            { id: 2, nome: 'GOL' },
            { id: 3, nome: 'Azul' },
            { id: 11, nome: 'TAP Air Portugal' },
            { id: 13, nome: 'Copa Airlines' },
            { id: 22, nome: 'American Airlines' },
            { id: 26, nome: 'Iberia' },
            { id: 34, nome: 'Livelo' },
            { id: 1200, nome: 'Azul Interline' }
          ];
          
          // Busca em cada companhia separadamente
          for (const companhia of companhiasParaBuscar) {
            try {
              console.log(`🔍 Buscando voos da ${companhia.nome} (ID: ${companhia.id})...`);
              
              const companySearchParams = {
                origem: origemCorrigida,
                destino: destinoCorrigido,
                ida: dataIda,
                volta: dataVolta,
                adultos: parseInt(searchParams.value.adultos) || 1,
                criancas: parseInt(searchParams.value.criancas) || 0,
                bebes: parseInt(searchParams.value.bebes) || 0,
                companhia: companhia.id, // Busca específica para esta companhia
                soIda: Boolean(searchParams.value.soIda),
                orderBy: searchParams.value.orderBy || 'tempo',
                numeroPagina: 1,
                quantidadePorPagina: 100 // Busca mais voos para ter opções
              };
              
              const companyResults = await executeStandardSearch(companySearchParams);
              
              if (companyResults && companyResults.length > 0) {
                console.log(`✅ ${companhia.nome}: ${companyResults.length} voos encontrados`);
                standardSearchResults.push(...companyResults.map(flight => ({ ...flight, source: `${companhia.nome}` })));
              } else {
                console.log(`⚠️ ${companhia.nome}: Nenhum voo encontrado`);
              }
              
              // Pequeno delay entre as buscas para não sobrecarregar a API
              await new Promise(resolve => setTimeout(resolve, 500));
              
            } catch (error) {
              console.log(`❌ Erro ao buscar voos da ${companhia.nome}:`, error.message);
              // Continua com a próxima companhia mesmo se uma falhar
            }
          }
          
          console.log(`📊 Total de voos encontrados de todas as companhias: ${standardSearchResults.length}`);
          
        } else {
          // BUSCA ESPECIAL PARA TAP AIR PORTUGAL
          if (parseInt(searchParams.value.companhia) === 11) {
            console.log('🇵🇹 === BUSCA ESPECIAL TAP AIR PORTUGAL ===');
            console.log('🔍 Procurando voos da TAP vendidos através de parcerias e codeshare...');
            
            // Lista de companhias que podem vender voos da TAP
            const companhiasComParceriaTAP = [
              { id: 11, nome: 'TAP Air Portugal' }, // Busca direta da TAP
              { id: 1, nome: 'LATAM' }, // LATAM tem parcerias internacionais
              { id: 2, nome: 'GOL' }, // GOL pode ter codeshare
              { id: -1, nome: 'Todas' } // Busca geral para capturar consolidadores
            ];
            
            for (const companhia of companhiasComParceriaTAP) {
              try {
                console.log(`🔍 Buscando voos TAP através da ${companhia.nome} (ID: ${companhia.id})...`);
                
                const tapSearchParams = {
                  origem: origemCorrigida,
                  destino: destinoCorrigido,
                  ida: dataIda,
                  volta: dataVolta,
                  adultos: parseInt(searchParams.value.adultos) || 1,
                  criancas: parseInt(searchParams.value.criancas) || 0,
                  bebes: parseInt(searchParams.value.bebes) || 0,
                  companhia: companhia.id,
                  soIda: Boolean(searchParams.value.soIda),
                  orderBy: searchParams.value.orderBy || 'tempo',
                  numeroPagina: 1,
                  quantidadePorPagina: 100
                };
                
                const tapResults = await executeStandardSearch(tapSearchParams);
                
                if (tapResults && tapResults.length > 0) {
                  console.log(`✅ TAP via ${companhia.nome}: ${tapResults.length} voos encontrados`);
                  standardSearchResults.push(...tapResults.map(flight => ({ ...flight, source: `TAP-via-${companhia.nome}` })));
                } else {
                  console.log(`⚠️ TAP via ${companhia.nome}: Nenhum voo encontrado`);
                }
                
                // Pequeno delay entre as buscas
                await new Promise(resolve => setTimeout(resolve, 500));
                
              } catch (error) {
                console.log(`❌ Erro ao buscar TAP via ${companhia.nome}:`, error.message);
              }
            }
            
            console.log(`📊 Total de voos TAP encontrados através de todas as fontes: ${standardSearchResults.length}`);
            
          } else {
            // Busca padrão para outras companhias específicas
            const standardSearchParams = {
              origem: origemCorrigida,
              destino: destinoCorrigido,
              ida: dataIda,
              volta: dataVolta,
              adultos: parseInt(searchParams.value.adultos) || 1,
              criancas: parseInt(searchParams.value.criancas) || 0,
              bebes: parseInt(searchParams.value.bebes) || 0,
              companhia: parseInt(searchParams.value.companhia) || -1,
              soIda: Boolean(searchParams.value.soIda),
              orderBy: searchParams.value.orderBy || 'tempo',
              numeroPagina: parseInt(searchParams.value.numeroPagina) || 1,
              quantidadePorPagina: parseInt(searchParams.value.quantidadePorPagina) || 100
            };
          
          // Aplica configurações específicas por companhia
          if (standardSearchParams.companhia === 3) {
            standardSearchParams.internacional = true;
            console.log('🔧 Aplicando configuração especial para Azul: internacional=true');
          }
        
          // Implementa retry inteligente com múltiplas tentativas e delays progressivos
          const maxTentativas = 4;
          const delays = [0, 1500, 3000, 5000]; // Delays progressivos
          
          for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
            try {
              console.log(`🔄 Tentativa ${tentativa}/${maxTentativas} da busca padrão`);
              
              // Aplica delay progressivo (exceto na primeira tentativa)
              if (tentativa > 1) {
                const delay = delays[tentativa - 1];
                console.log(`⏱️ Aguardando ${delay}ms antes da próxima tentativa...`);
                toast.info(`🔄 Expandindo busca... Tentativa ${tentativa}/${maxTentativas}`, { duration: delay });
                await new Promise(resolve => setTimeout(resolve, delay));
              }
              
              const response1 = await executeStandardSearch(standardSearchParams);
              
              if (response1 && response1.length > 0) {
                console.log(`✅ Busca padrão (tentativa ${tentativa}): ${response1.length} voos encontrados`);
                standardSearchResults = response1;
                
                // Se encontrou voos, mostra mensagem de sucesso
                if (tentativa > 1) {
                  toast.success(`✅ ${response1.length} voos encontrados na tentativa ${tentativa}!`, { duration: 3000 });
                }
                // Não quebra o loop para continuar tentando novas buscas
              } else {
                console.log(`⚠️ Busca padrão (tentativa ${tentativa}): Nenhum voo encontrado`);
                
                // Mensagens específicas por tentativa
                if (tentativa === 1) {
                  console.log('🔄 API pode estar processando - expandindo busca...');
                } else if (tentativa === 2) {
                  console.log('🔄 Tentando com parâmetros otimizados...');
                } else if (tentativa === 3) {
                  console.log('🔄 Última tentativa com busca expandida...');
                }
              }
            } catch (error) {
              console.log(`⚠️ Busca padrão (tentativa ${tentativa}) falhou: ${error.message}`);
              
              // Se é a última tentativa e ainda não encontrou nada
              if (tentativa === maxTentativas) {
                console.log('❌ Busca padrão falhou em todas as tentativas');
              }
            }
          }
          } // Fim da lógica de busca para outras companhias específicas (que não são TAP)
        } // Fim do else da busca por companhia específica
        
        if (standardSearchResults.length > 0) {
          allFoundFlights.push(...standardSearchResults.map(flight => ({ ...flight, source: 'padrao' })));
        }
        
        // 2. BUSCA RESERVA FÁCIL (apenas se não foi busca múltipla)
        if (parseInt(searchParams.value.companhia) !== -1) {
          console.log('🎆 === BUSCA RESERVA FÁCIL ===');
          try {
            const response2 = await executeReservaFacilSearch({
              Origem: origemCorrigida,
              Destino: destinoCorrigido,
              Ida: dataIda,
              Adultos: parseInt(searchParams.value.adultos) || 1,
              Criancas: parseInt(searchParams.value.criancas) || 0,
              Bebes: parseInt(searchParams.value.bebes) || 0,
              Companhia: parseInt(searchParams.value.companhia) === -1 ? 0 : parseInt(searchParams.value.companhia)
            });
            
            if (response2 && response2.length > 0) {
              console.log(`✅ Busca Reserva Fácil: ${response2.length} voos encontrados`);
              allFoundFlights.push(...response2.map(flight => ({ ...flight, source: 'reserva-facil' })));
            }
          } catch (error) {
            console.log(`⚠️ Busca Reserva Fácil falhou: ${error.message}`);
          }
        } else {
          console.log('⚠️ Pulando busca Reserva Fácil pois já foi feita busca múltipla por companhia');
        }
        
        // 3. DEDUPLICAÇÃO E PREPARAÇÃO FINAL
        console.log(`🔄 Combinando resultados: ${allFoundFlights.length} voos total`);
        
        if (allFoundFlights.length === 0) {
          console.log('⚠️ Nenhum voo encontrado em nenhuma das fontes');
          console.log('🔍 Tentando estratégias alternativas...');
          
          // Estratégia 1: Força busca da companhia selecionada primeiro se especificada
          const companhiaSelecionada = parseInt(searchParams.value.companhia);
          
          if (companhiaSelecionada > 0) {
            console.log(`🎯 BUSCA FORÇADA: Companhia ${companhiaSelecionada} foi especificamente selecionada`);
            
            const nomeCompanhia = companhiaSelecionada === 1 ? 'LATAM' : 
                                  companhiaSelecionada === 2 ? 'GOL' : 
                                  companhiaSelecionada === 3 ? 'Azul' : `Companhia ${companhiaSelecionada}`;
            
            try {
              console.log(`🔍 FORÇANDO busca específica da ${nomeCompanhia}...`);
              
              const forcedParams = {
                origem: origemCorrigida,
                destino: destinoCorrigido,
                ida: dataIda,
                volta: dataVolta,
                adultos: parseInt(searchParams.value.adultos) || 1,
                criancas: parseInt(searchParams.value.criancas) || 0,
                bebes: parseInt(searchParams.value.bebes) || 0,
                companhia: companhiaSelecionada,
                soIda: Boolean(searchParams.value.soIda)
              };
              
              // Azul precisa de parâmetros especiais
              if (companhiaSelecionada === 3) {
                forcedParams.internacional = true;
              }
              
              const forcedResponse = await moblixApiService.consultarVoos(forcedParams);
              
              if (forcedResponse?.Data && Array.isArray(forcedResponse.Data)) {
                forcedResponse.Data.forEach(dataItem => {
                  // Verifica estrutura nova
                  if (dataItem.flights && Array.isArray(dataItem.flights) && dataItem.flights.length > 0) {
                    console.log(`✅ ${nomeCompanhia} (forçado): ${dataItem.flights.length} voos encontrados (estrutura nova)`);
                    allFoundFlights.push(...dataItem.flights.map(flight => ({ ...flight, source: `forced-${nomeCompanhia}` })));
                  }
                  // Verifica estrutura antiga
                  else if (dataItem.Ida && Array.isArray(dataItem.Ida) && dataItem.Ida.length > 0) {
                    console.log(`✅ ${nomeCompanhia} (forçado): ${dataItem.Ida.length} voos encontrados (estrutura antiga)`);
                    allFoundFlights.push(...dataItem.Ida.map(flight => ({ ...flight, source: `forced-${nomeCompanhia}` })));
                  }
                });
              }
              
              if (allFoundFlights.length > 0) {
                console.log(`✅ Busca forçada da ${nomeCompanhia} bem-sucedida: ${allFoundFlights.length} voos`);
              } else {
                console.log(`⚠️ Busca forçada da ${nomeCompanhia} não encontrou voos`);
                
                // Estratégia especial para GOL: tenta aeroportos do Rio de Janeiro
                if (companhiaSelecionada === 2 && origemCorrigida === 'CNF' && (destinoCorrigido === 'RIO' || destinoCorrigido === 'SDU' || destinoCorrigido === 'GIG')) {
                  console.log('🔍 ESTRATÉGIA ESPECIAL GOL: Tentando aeroportos do Rio de Janeiro para CNF...');
                  
                  const golRioAlternatives = [
                    { destino: 'GIG', nome: 'Galeão (aeroporto principal GOL)' },
                    { destino: 'SDU', nome: 'Santos Dumont' },
                    { destino: 'CGH', nome: 'Congonhas (via São Paulo)' }
                  ];
                  
                  for (const alt of golRioAlternatives) {
                    try {
                      console.log(`🔍 Tentando GOL: CNF → ${alt.destino} (${alt.nome})`);
                      
                      const golSpecialParams = {
                        origem: 'CNF',
                        destino: alt.destino,
                        ida: dataIda,
                        volta: dataVolta,
                        adultos: parseInt(searchParams.value.adultos) || 1,
                        criancas: parseInt(searchParams.value.criancas) || 0,
                        bebes: parseInt(searchParams.value.bebes) || 0,
                        companhia: 2,
                        soIda: Boolean(searchParams.value.soIda)
                      };
                      
                      const golSpecialResponse = await moblixApiService.consultarVoos(golSpecialParams);
                      
                      if (golSpecialResponse?.Data && Array.isArray(golSpecialResponse.Data)) {
                        golSpecialResponse.Data.forEach(dataItem => {
                          if (dataItem.flights && Array.isArray(dataItem.flights) && dataItem.flights.length > 0) {
                            console.log(`✅ GOL CNF→${alt.destino}: ${dataItem.flights.length} voos encontrados`);
                            allFoundFlights.push(...dataItem.flights.map(flight => ({ ...flight, source: `gol-rio-${alt.destino}`, destinoOriginal: 'RIO' })));
                          }
                          else if (dataItem.Ida && Array.isArray(dataItem.Ida) && dataItem.Ida.length > 0) {
                            console.log(`✅ GOL CNF→${alt.destino}: ${dataItem.Ida.length} voos encontrados`);
                            allFoundFlights.push(...dataItem.Ida.map(flight => ({ ...flight, source: `gol-rio-${alt.destino}`, destinoOriginal: 'RIO' })));
                          }
                        });
                      }
                      
                      // Continua tentando todos os aeroportos para ter mais opções
                      
                    } catch (golError) {
                      console.log(`❌ Erro na busca especial GOL ${alt.destino}:`, golError.message);
                    }
                  }
                  
                  console.log(`✅ GOL RIO: Total de ${allFoundFlights.length} voos encontrados nos aeroportos do Rio`);
                }
                
                // Estratégia especial para AZUL: tenta aeroportos do Rio de Janeiro e São Paulo
                if (companhiaSelecionada === 3 && origemCorrigida === 'CNF' && (destinoCorrigido === 'RIO' || destinoCorrigido === 'SDU' || destinoCorrigido === 'GIG')) {
                  console.log('🔍 ESTRATÉGIA ESPECIAL AZUL: Tentando aeroportos do Rio de Janeiro para CNF...');
                  
                  const azulRioAlternatives = [
                    { destino: 'SDU', nome: 'Santos Dumont (aeroporto principal Azul)' },
                    { destino: 'GIG', nome: 'Galeão' },
                    { destino: 'CGH', nome: 'Congonhas (via São Paulo)' },
                    { destino: 'GRU', nome: 'Guarulhos (via São Paulo)' }
                  ];
                  
                  for (const alt of azulRioAlternatives) {
                    try {
                      console.log(`🔍 Tentando AZUL: CNF → ${alt.destino} (${alt.nome})`);
                      
                      const azulSpecialParams = {
                        origem: 'CNF',
                        destino: alt.destino,
                        ida: dataIda,
                        volta: dataVolta,
                        adultos: parseInt(searchParams.value.adultos) || 1,
                        criancas: parseInt(searchParams.value.criancas) || 0,
                        bebes: parseInt(searchParams.value.bebes) || 0,
                        companhia: 3,
                        internacional: true, // Azul sempre precisa deste parâmetro
                        soIda: Boolean(searchParams.value.soIda)
                      };
                      
                      const azulSpecialResponse = await moblixApiService.consultarVoos(azulSpecialParams);
                      
                      if (azulSpecialResponse?.Data && Array.isArray(azulSpecialResponse.Data)) {
                        azulSpecialResponse.Data.forEach(dataItem => {
                          if (dataItem.flights && Array.isArray(dataItem.flights) && dataItem.flights.length > 0) {
                            console.log(`✅ AZUL CNF→${alt.destino}: ${dataItem.flights.length} voos encontrados`);
                            allFoundFlights.push(...dataItem.flights.map(flight => ({ ...flight, source: `azul-rio-${alt.destino}`, destinoOriginal: 'RIO' })));
                          }
                          else if (dataItem.Ida && Array.isArray(dataItem.Ida) && dataItem.Ida.length > 0) {
                            console.log(`✅ AZUL CNF→${alt.destino}: ${dataItem.Ida.length} voos encontrados`);
                            allFoundFlights.push(...dataItem.Ida.map(flight => ({ ...flight, source: `azul-rio-${alt.destino}`, destinoOriginal: 'RIO' })));
                          }
                        });
                      }
                      
                      // Continua tentando todos os aeroportos para ter mais opções
                      
                    } catch (azulError) {
                      console.log(`❌ Erro na busca especial AZUL ${alt.destino}:`, azulError.message);
                    }
                  }
                  
                  console.log(`✅ AZUL RIO: Total de ${allFoundFlights.length} voos encontrados nos aeroportos do Rio/SP`);
                }
              }
              
            } catch (forcedError) {
              console.log(`❌ Erro na busca forçada da ${nomeCompanhia}:`, forcedError.message);
            }
          }
          
          // Estratégia 2: Busca com todas as companhias individualmente (sempre executa)
          console.log('🔍 Executando busca em TODAS as companhias disponíveis...');
          const companiasAlternativas = [
            { id: 1, nome: 'LATAM' },
            { id: 2, nome: 'GOL' },
            { id: 3, nome: 'Azul', internacional: true },
            { id: 11, nome: 'TAP Air Portugal' },
            { id: 13, nome: 'Copa Airlines' },
            { id: 22, nome: 'American Airlines' },
            { id: 26, nome: 'Iberia' }
          ];
          
          for (const companhia of companiasAlternativas) {
            try {
              console.log(`🔍 Tentativa alternativa: ${companhia.nome}`);
              
              const alternativeParams = {
                origem: origemCorrigida,
                destino: destinoCorrigido,
                ida: dataIda,
                volta: dataVolta,
                adultos: parseInt(searchParams.value.adultos) || 1,
                criancas: parseInt(searchParams.value.criancas) || 0,
                bebes: parseInt(searchParams.value.bebes) || 0,
                companhia: companhia.id,
                soIda: Boolean(searchParams.value.soIda)
              };
              
              if (companhia.internacional) {
                alternativeParams.internacional = true;
              }
              
              const alternativeResponse = await moblixApiService.consultarVoos(alternativeParams);
              
              if (alternativeResponse?.Data && Array.isArray(alternativeResponse.Data)) {
                alternativeResponse.Data.forEach(dataItem => {
                  // Verifica estrutura nova
                  if (dataItem.flights && Array.isArray(dataItem.flights) && dataItem.flights.length > 0) {
                    console.log(`✅ ${companhia.nome}: ${dataItem.flights.length} voos encontrados (estrutura nova)`);
                    allFoundFlights.push(...dataItem.flights.map(flight => ({ ...flight, source: `alternative-${companhia.nome}` })));
                  }
                  // Verifica estrutura antiga
                  else if (dataItem.Ida && Array.isArray(dataItem.Ida) && dataItem.Ida.length > 0) {
                    console.log(`✅ ${companhia.nome}: ${dataItem.Ida.length} voos encontrados (estrutura antiga)`);
                    allFoundFlights.push(...dataItem.Ida.map(flight => ({ ...flight, source: `alternative-${companhia.nome}` })));
                  }
                });
              }
              
              // CONTINUA tentando todas as companhias para garantir busca completa
              
            } catch (alternativeError) {
              console.log(`❌ Erro na tentativa alternativa ${companhia.nome}:`, alternativeError.message);
            }
          }
          
          console.log(`📊 Total de voos coletados de todas as companhias: ${allFoundFlights.length}`);
          
          // Se ainda não encontrou voos da companhia específica, tenta outras estratégias
          
          // Estratégia 3: Busca direta genérica se ainda não encontrou
          if (allFoundFlights.length === 0) {
            try {
              const directParams = {
                origem: origemCorrigida,
                destino: destinoCorrigido,
                ida: dataIda,
                volta: dataVolta,
                adultos: parseInt(searchParams.value.adultos) || 1,
                criancas: parseInt(searchParams.value.criancas) || 0,
                bebes: parseInt(searchParams.value.bebes) || 0,
                companhia: -1,
                soIda: Boolean(searchParams.value.soIda)
              };
              
              console.log('🔍 Tentando busca direta genérica com parâmetros:', JSON.stringify(directParams, null, 2));
              const directResponse = await moblixApiService.consultarVoos(directParams);
              
              if (directResponse?.Data && Array.isArray(directResponse.Data)) {
                directResponse.Data.forEach(dataItem => {
                  // Verifica estrutura nova
                  if (dataItem.flights && Array.isArray(dataItem.flights) && dataItem.flights.length > 0) {
                    console.log(`✅ Busca direta encontrou ${dataItem.flights.length} voos na estrutura nova!`);
                    allFoundFlights.push(...dataItem.flights.map(flight => ({ ...flight, source: 'direct-new' })));
                  }
                  // Verifica estrutura antiga
                  else if (dataItem.Ida && Array.isArray(dataItem.Ida) && dataItem.Ida.length > 0) {
                    console.log(`✅ Busca direta encontrou ${dataItem.Ida.length} voos na estrutura antiga!`);
                    allFoundFlights.push(...dataItem.Ida.map(flight => ({ ...flight, source: 'direct-old' })));
                  }
                });
              }
            } catch (directError) {
              console.log('❌ Busca direta também falhou:', directError.message);
            }
          }
          
          if (allFoundFlights.length === 0) {
            // Mensagem específica baseada na rota
            const routeMessage = `${origemCorrigida} → ${destinoCorrigido}`;
            const dateMessage = new Date(dataIda).toLocaleDateString('pt-BR');
            
            let suggestionMessage = `Nenhum voo encontrado para ${routeMessage} em ${dateMessage}.`;
            
            // Adiciona sugestões específicas baseadas na rota
            const hoje = new Date().toISOString().split('T')[0];
            const isToday = dataIda === hoje;
            const isFarFuture = new Date(dataIda) > new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // Mais de 1 ano
            
            if (isToday) {
              suggestionMessage += ' Voos para hoje podem ter disponibilidade limitada. Tente datas futuras.';
            } else if (isFarFuture) {
              suggestionMessage += ' A data selecionada é muito distante. Tente datas mais próximas.';
            } else {
              suggestionMessage += ' Tente:';
              suggestionMessage += '\n• Datas diferentes (±2-3 dias)';
              suggestionMessage += '\n• Todas as companhias aéreas';
              suggestionMessage += '\n• Aeroportos alternativos próximos';
              
              // Sugestões específicas por rota
              if (origemCorrigida === 'CNF' && destinoCorrigido === 'RIO') {
                suggestionMessage += '\n• Voos CNF → SDU (Santos Dumont)';
                suggestionMessage += '\n• Voos CNF → GIG (Galeão)';
              } else if (origemCorrigida === 'CNF' && destinoCorrigido === 'CGH') {
                suggestionMessage += '\n• Voos CNF → GRU (Guarulhos)';
              } else if (origemCorrigida === 'CNF' && (destinoCorrigido === 'SAO' || destinoCorrigido === 'SPO')) {
                suggestionMessage += '\n• Tente CGH (Congonhas) ou GRU (Guarulhos)';
              }
            }
            
            // Mostra toast de informação ao invés de lançar erro
            toast.info(`🔍 ${suggestionMessage}`);
            return; // Sai da função sem lançar erro
          }
        }
        
        // *** FILTRO POR COMPANHIA SELECIONADA ***
        // Se uma companhia específica foi selecionada, filtra apenas os voos dessa companhia
        const companhiaSelecionada = parseInt(searchParams.value.companhia);
        let flightsToProcess = allFoundFlights;
        
        if (companhiaSelecionada > 0 && allFoundFlights.length > 0) {
          console.log(`🎯 FILTRO POR COMPANHIA ESPECÍFICA ATIVADO!`);
          console.log(`🎯 Companhia selecionada ID: ${companhiaSelecionada}`);
          console.log(`🎯 Total de voos para filtrar: ${allFoundFlights.length}`);
          
          const nomeCompanhiaSelecionada = companhiaSelecionada === 1 ? 'LATAM' : 
                                           companhiaSelecionada === 2 ? 'GOL' : 
                                           companhiaSelecionada === 3 ? 'Azul' : 
                                           companhiaSelecionada === 11 ? 'TAP Air Portugal' : 
                                           companhiaSelecionada === 13 ? 'Copa Airlines' : 
                                           companhiaSelecionada === 22 ? 'American Airlines' : 
                                           companhiaSelecionada === 26 ? 'Iberia' : 
                                           companhiaSelecionada === 34 ? 'Livelo' : 
                                           `Companhia ${companhiaSelecionada}`;
          
          console.log(`🎯 Nome da companhia: ${nomeCompanhiaSelecionada}`);
          console.log(`🚫 ATENÇÃO: Vamos filtrar para mostrar APENAS voos da ${nomeCompanhiaSelecionada}!`);
          
          const flightsByCompany = allFoundFlights.filter((flight, index) => {
            // Log detalhado para debug
            if (index < 3) {
              console.log(`🔍 DEBUG Voo ${index + 1}:`, {
                Companhia: flight.Companhia,
                companhia: flight.companhia,
                CompanhiaNome: flight.CompanhiaNome,
                'Cia.Nome': flight.Cia?.Nome,
                source: flight.source,
                ProviderSource: flight.ProviderSource,
                ProviderCompanyId: flight.ProviderCompanyId,
                IdCia: flight.IdCia,
                FlightCode: flight.FlightCode,
                numeroVoo: flight.numeroVoo,
                'CiaParceira.Nome': flight.CiaParceira?.Nome,
                'Comparando com': nomeCompanhiaSelecionada,
                'companhiaSelecionada (ID)': companhiaSelecionada
              });
            }
            
            // DETECÇÃO MELHORADA: Verifica se o voo é da companhia selecionada
            // Inclui detecção de codeshare e parcerias
            let isFromSelectedCompany = false;
            
            // CORREÇÃO: Para Livelo, aceita voos VENDIDOS pela Livelo
            // Inclui voos vendidos pela Livelo mas operados por parceiros (LATAM, GOL, etc.)
            if (nomeCompanhiaSelecionada === 'Livelo') {
              // Para Livelo, aceita voos vendidos pela Livelo (IdCia=34)
              if (flight.IdCia === 34 ||
                  flight.ProviderCompanyId === 34 ||
                  flight.CiaParceira?.Nome === 'Livelo' ||
                  flight.CiaParceira?.Iata === 'LV' ||
                  flight.numeroVoo?.includes('LV') ||
                  flight.FlightCode?.includes('LV') ||
                  flight.Voos?.[0]?.Numero?.includes('LV')) {
                isFromSelectedCompany = true;
                const operadora = flight.CiaParceira?.Nome || 'Livelo';
                console.log(`🔍 LIVELO: Voo aceito - vendido pela Livelo, operado por ${operadora}`);
              } else {
                console.log(`🙅 LIVELO: Voo rejeitado - não vendido pela Livelo`);
              }
            } else {
              // Para outras companhias, usa a lógica normal
              if (flight.Companhia === nomeCompanhiaSelecionada ||
                  flight.companhia === nomeCompanhiaSelecionada ||
                  flight.CompanhiaNome === nomeCompanhiaSelecionada ||
                  flight.Cia?.Nome === nomeCompanhiaSelecionada ||
                  flight.source?.includes(nomeCompanhiaSelecionada) ||
                  flight.ProviderSource === nomeCompanhiaSelecionada ||
                  flight.CiaParceira?.Nome === nomeCompanhiaSelecionada) {
                isFromSelectedCompany = true;
              }
            }
            
            // 2. Verificações específicas por companhia
            if (!isFromSelectedCompany) {
              // TAP Air Portugal
              if (nomeCompanhiaSelecionada === 'TAP Air Portugal') {
                if (flight.numeroVoo?.includes('TP') ||
                    flight.FlightCode?.includes('TP') ||
                    flight.Voos?.[0]?.Numero?.includes('TP') ||
                    flight.segments?.[0]?.legs?.[0]?.flightNumber?.toString().includes('TP') ||
                    flight.segments?.[0]?.legs?.[0]?.flightCode?.includes('TP') ||
                    flight.segments?.[0]?.legs?.[0]?.operatedBy?.name?.includes('TAP') ||
                    flight.segments?.[0]?.legs?.[0]?.managedBy?.name?.includes('TAP') ||
                    flight.segments?.[0]?.legs?.[0]?.marketingCarrier?.name?.includes('TAP') ||
                    flight.validatingBy?.name?.includes('TAP') ||
                    flight.validatingBy?.iata === 'TP' ||
                    flight.companhia?.includes('TAP') ||
                    flight.Companhia?.includes('TAP') ||
                    flight.CompanhiaNome?.includes('TAP') ||
                    flight.Cia?.Nome?.includes('TAP')) {
                  isFromSelectedCompany = true;
                }
              }
              
              // Livelo
              if (nomeCompanhiaSelecionada === 'Livelo') {
                if (flight.numeroVoo?.includes('LV') ||
                    flight.FlightCode?.includes('LV') ||
                    flight.Voos?.[0]?.Numero?.includes('LV') ||
                    flight.segments?.[0]?.legs?.[0]?.flightNumber?.toString().includes('LV') ||
                    flight.segments?.[0]?.legs?.[0]?.flightCode?.includes('LV') ||
                    flight.segments?.[0]?.legs?.[0]?.operatedBy?.name?.includes('Livelo') ||
                    flight.segments?.[0]?.legs?.[0]?.managedBy?.name?.includes('Livelo') ||
                    flight.segments?.[0]?.legs?.[0]?.marketingCarrier?.name?.includes('Livelo') ||
                    flight.validatingBy?.name?.includes('Livelo') ||
                    flight.validatingBy?.name?.includes('LIVELO') ||
                    flight.validatingBy?.iata === 'LV' ||
                    flight.ProviderSource?.includes('Livelo') ||
                    flight.ProviderCompanyId === 34 ||
                    flight.companhia?.includes('Livelo') ||
                    flight.Companhia?.includes('Livelo') ||
                    flight.CompanhiaNome?.includes('Livelo') ||
                    flight.Cia?.Nome?.includes('Livelo') ||
                    flight.companhia?.includes('LIVELO') ||
                    flight.Companhia?.includes('LIVELO') ||
                    flight.CompanhiaNome?.includes('LIVELO') ||
                    flight.Cia?.Nome?.includes('LIVELO')) {
                  isFromSelectedCompany = true;
                }
              }
              
              // GOL
              if (nomeCompanhiaSelecionada === 'GOL') {
                if (flight.numeroVoo?.includes('G3') ||
                    flight.FlightCode?.includes('G3') ||
                    flight.Voos?.[0]?.Numero?.includes('G3') ||
                    flight.segments?.[0]?.legs?.[0]?.flightNumber?.toString().includes('G3') ||
                    flight.segments?.[0]?.legs?.[0]?.flightCode?.includes('G3')) {
                  isFromSelectedCompany = true;
                }
              }
              
              // LATAM
              if (nomeCompanhiaSelecionada === 'LATAM') {
                if (flight.numeroVoo?.includes('LA') ||
                    flight.FlightCode?.includes('LA') ||
                    flight.Voos?.[0]?.Numero?.includes('LA') ||
                    flight.segments?.[0]?.legs?.[0]?.flightNumber?.toString().includes('LA') ||
                    flight.segments?.[0]?.legs?.[0]?.flightCode?.includes('LA')) {
                  isFromSelectedCompany = true;
                }
              }
              
              // Azul
              if (nomeCompanhiaSelecionada === 'Azul') {
                if (flight.numeroVoo?.includes('AD') ||
                    flight.FlightCode?.includes('AD') ||
                    flight.Voos?.[0]?.Numero?.includes('AD') ||
                    flight.segments?.[0]?.legs?.[0]?.flightNumber?.toString().includes('AD') ||
                    flight.segments?.[0]?.legs?.[0]?.flightCode?.includes('AD')) {
                  isFromSelectedCompany = true;
                }
              }
              
              // Copa Airlines
              if (nomeCompanhiaSelecionada === 'Copa Airlines') {
                if (flight.numeroVoo?.includes('CM') ||
                    flight.FlightCode?.includes('CM') ||
                    flight.Voos?.[0]?.Numero?.includes('CM') ||
                    flight.segments?.[0]?.legs?.[0]?.flightNumber?.toString().includes('CM') ||
                    flight.segments?.[0]?.legs?.[0]?.flightCode?.includes('CM')) {
                  isFromSelectedCompany = true;
                }
              }
              
              // American Airlines
              if (nomeCompanhiaSelecionada === 'American Airlines') {
                if (flight.numeroVoo?.includes('AA') ||
                    flight.FlightCode?.includes('AA') ||
                    flight.Voos?.[0]?.Numero?.includes('AA') ||
                    flight.segments?.[0]?.legs?.[0]?.flightNumber?.toString().includes('AA') ||
                    flight.segments?.[0]?.legs?.[0]?.flightCode?.includes('AA')) {
                  isFromSelectedCompany = true;
                }
              }
              
              // Iberia
              if (nomeCompanhiaSelecionada === 'Iberia') {
                if (flight.numeroVoo?.includes('IB') ||
                    flight.FlightCode?.includes('IB') ||
                    flight.Voos?.[0]?.Numero?.includes('IB') ||
                    flight.segments?.[0]?.legs?.[0]?.flightNumber?.toString().includes('IB') ||
                    flight.segments?.[0]?.legs?.[0]?.flightCode?.includes('IB')) {
                  isFromSelectedCompany = true;
                }
              }
            }
            
            // DEBUG ESPECÍFICO PARA TAP: Log detalhado dos primeiros voos quando TAP está selecionada
            if (nomeCompanhiaSelecionada === 'TAP Air Portugal' && index < 10) {
              console.log(`🔍 DEBUG TAP Voo ${index + 1}:`, {
                numeroVoo: flight.numeroVoo,
                FlightCode: flight.FlightCode,
                'Voos[0].Numero': flight.Voos?.[0]?.Numero,
                'segments[0].legs[0].flightNumber': flight.segments?.[0]?.legs?.[0]?.flightNumber,
                'segments[0].legs[0].flightCode': flight.segments?.[0]?.legs?.[0]?.flightCode,
                'segments[0].legs[0].operatedBy': flight.segments?.[0]?.legs?.[0]?.operatedBy,
                'validatingBy': flight.validatingBy,
                origem: flight.origem || flight.segments?.[0]?.departure,
                destino: flight.destino || flight.segments?.[flight.segments?.length - 1]?.arrival,
                'flight.Companhia': flight.Companhia,
                'flight.companhia': flight.companhia,
                'flight.source': flight.source,
                isFromSelectedCompany: isFromSelectedCompany
              });
              
              // ALERTA ESPECÍFICO: Se um voo da LATAM está passando no filtro TAP
              if (isFromSelectedCompany && (
                flight.Companhia === 'LATAM' || 
                flight.companhia === 'LATAM' || 
                flight.source?.includes('LATAM') ||
                flight.numeroVoo?.includes('LA') ||
                flight.FlightCode?.includes('LA')
              )) {
                console.error(`❌ ERRO CRÍTICO: Voo da LATAM está passando no filtro TAP!`);
                console.error(`❌ Detalhes do voo LATAM que passou:`, flight);
                console.error(`❌ Razão: isFromSelectedCompany = ${isFromSelectedCompany}`);
              }
            }
            
            if (index < 3) {
              console.log(`🎯 Voo ${index + 1} é da ${nomeCompanhiaSelecionada}?`, isFromSelectedCompany);
            }
            
            return isFromSelectedCompany;
          });
          
          console.log(`🎯 FILTRO: ${allFoundFlights.length} voos total → ${flightsByCompany.length} voos da ${nomeCompanhiaSelecionada}`);
          
          if (flightsByCompany.length > 0) {
            flightsToProcess = flightsByCompany;
            console.log(`✅ Mostrando APENAS voos da ${nomeCompanhiaSelecionada}: ${flightsByCompany.length} voos`);
          } else {
            console.log(`⚠️ Nenhum voo da ${nomeCompanhiaSelecionada} encontrado.`);
            console.log(`🚫 CORREÇÃO CRÍTICA: Quando uma companhia específica é selecionada, NÃO devemos mostrar outras companhias!`);
            
            // CORREÇÃO: Se uma companhia específica foi selecionada mas não encontrou voos,
            // mostrar lista vazia em vez de voos de outras companhias
            flightsToProcess = [];
            
            // Informa ao usuário que não há voos da companhia selecionada
            setTimeout(() => {
              const routeMsg = `${searchParams.value.origem} → ${searchParams.value.destino}`;
              const dateMsg = new Date(searchParams.value.ida).toLocaleDateString('pt-BR');
              toast.info(`🔍 Nenhum voo da ${nomeCompanhiaSelecionada} encontrado para ${routeMsg} em ${dateMsg}. Tente outras datas ou selecione "Todas as companhias".`);
            }, 500);
          }
        }
        
        // Deduplica os voos
        const uniqueFlights = deduplicateFlights(flightsToProcess);
        
        // Monta resposta final
        response = {
          Data: [{
            flights: uniqueFlights
          }],
          combinedSearch: true,
          totalFlights: uniqueFlights.length,
          originalTotal: allFoundFlights.length,
          filteredByCompany: companhiaSelecionada > 0 ? flightsToProcess.length : null,
          deduplicated: flightsToProcess.length - uniqueFlights.length
        };
        
        console.log('📊 === PROCESSAMENTO DOS RESULTADOS ===');
        console.log(`🔍 Voos encontrados: ${uniqueFlights.length}`);
        
        // Processar dados dos voos e aplicar filtros
        if (Array.isArray(uniqueFlights) && uniqueFlights.length > 0) {
          // Normaliza a estrutura dos voos para o formato esperado pelo template
          const normalizedFlights = uniqueFlights.map((flight, index) => {
            try {
              const normalized = normalizeFlight(flight);
              if (index === 0) {
                console.log('🔄 Primeiro voo normalizado:', normalized);
              }
              return normalized;
            } catch (error) {
              console.error(`❌ Erro ao normalizar voo ${index}:`, error, flight);
              return null;
            }
          }).filter(flight => flight !== null); // Remove voos nulos e inválidos
          
          // Corrige segmentos duplicados
          const flightsWithFixedSegments = fixDuplicateFlightSegments(normalizedFlights);
          console.log('🔧 Segmentos duplicados corrigidos');
          
          // Aplicar ordenação conforme parâmetro selecionado
          let sortedFlights = flightsWithFixedSegments;
          
          if (searchParams.value.orderBy === 'preco') {
            sortedFlights = flightsWithFixedSegments.sort((a, b) => {
              const priceA = a.priceWithTax || a.price || a.totalPrice || 0;
              const priceB = b.priceWithTax || b.price || b.totalPrice || 0;
              
              // Primeiro ordena por preço
              if (priceA !== priceB) {
                return priceA - priceB; // Menor preço primeiro
              }
              
              // Se preços iguais, ordena por tempo (mais rápido primeiro)
              const durationA = parseDurationToMinutes(getTotalDuration(a.segments));
              const durationB = parseDurationToMinutes(getTotalDuration(b.segments));
              return durationA - durationB;
            });
            console.log('🔄 Voos ordenados por MENOR PREÇO (+ tempo como critério secundário)');
          } else if (searchParams.value.orderBy === 'tempo') {
            sortedFlights = flightsWithFixedSegments.sort((a, b) => {
              // Converte duração para minutos para comparação
              const durationA = parseDurationToMinutes(getTotalDuration(a.segments));
              const durationB = parseDurationToMinutes(getTotalDuration(b.segments));
              
              // Primeiro ordena por tempo
              if (durationA !== durationB) {
                return durationA - durationB; // Menor tempo primeiro
              }
              
              // Se tempos iguais, ordena por preço (mais barato primeiro)
              const priceA = a.priceWithTax || a.price || a.totalPrice || 0;
              const priceB = b.priceWithTax || b.price || b.totalPrice || 0;
              return priceA - priceB;
            });
            console.log('🔄 Voos ordenados por MENOR TEMPO (+ preço como critério secundário)');
          }
          
          // Aplica filtro de qualidade para mostrar apenas os melhores
          const bestFlights = filterBestFlights(sortedFlights, searchParams.value.orderBy);
          
          searchResults.value = bestFlights;
          console.log('✅ Voos normalizados, ordenados e filtrados com sucesso:', bestFlights.length);
        } else {
          searchResults.value = [];
          console.log('❌ Nenhum voo válido encontrado');
        }
        
        // Verificação final dos resultados
        if (!searchResults.value || searchResults.value.length === 0) {
          console.log('⚠️ NENHUM VOO ENCONTRADO - Mostrando mensagem amigável');
          const routeMsg = `${searchParams.value.origem} → ${searchParams.value.destino}`;
          toast.info(`🔍 Nenhum voo encontrado para ${routeMsg}. Tente outras datas, todas as companhias ou aeroportos alternativos.`);
          return;
        }
        
        console.log('✅ VOOS ENCONTRADOS:', searchResults.value.length);
        toast.success(`✈️ ${searchResults.value.length} voos encontrados`);
        } catch (error) {
if (error.response) {
            console.log('🔍 Erro de resposta:', error.response);
          } else {
            console.log('🔍 Erro geral:', error);
          }
          
        // Log detalhado do erro para debug
        if (error.message.includes('Nenhum voo encontrado para')) {
            // Mensagem específica com sugestões
            const lines = error.message.split('\n');
            const mainMessage = lines[0];
            const suggestions = lines.slice(1).join(' ');
            
            toast.info(mainMessage + (suggestions ? ` ${suggestions}` : ''));
            return;
          } else if (error.message === 'Nenhum voo encontrado em nenhuma das fontes') {
            toast.info('🔍 Nenhum voo encontrado para os parâmetros informados. Tente outras datas ou rotas.');
            return;
          }
          console.error('Detalhes completos do erro:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            config: {
              method: error.config?.method,
              url: error.config?.url,
              baseURL: error.config?.baseURL,
              headers: error.config?.headers
            },
            code: error.code,
            name: error.name
          });
          
          // Verifica se é um erro da API Moblix
          if (error.response?.status === 500 && error.response?.data?.error_description?.includes('Object reference')) {
            throw new Error('A API Moblix está temporariamente indisponível. Por favor, tente novamente em alguns minutos ou entre em contato com o suporte.');
          }
        
        // Log completo do erro para debug
        console.error('=== ERRO COMPLETO CAPTURADO ===');
        console.error('error.message:', error.message);
        console.error('error.response:', error.response);
        console.error('error.response?.data:', error.response?.data);
        console.error('error.response?.data?.message:', error.response?.data?.message);
        console.error('error.response?.data?.Erro:', error.response?.data?.Erro);
        console.error('error.response?.data?.Erro?.Message:', error.response?.data?.Erro?.Message);
        console.error('error.response?.data?.Erro?.Descricao:', error.response?.data?.Erro?.Descricao);
        console.error('JSON.stringify(error, null, 2):', JSON.stringify(error, null, 2));
        console.error('=== FIM LOG ERRO COMPLETO ===');
        
        // Tratamento específico para "Sequence contains no elements" em qualquer parte do erro
        // Captura todos os possíveis locais onde essa mensagem pode aparecer
        const possibleErrorSources = [
          error.message,
          error.response?.data?.message,
          error.response?.data?.Erro?.Message,
          error.response?.data?.Erro?.Descricao,
          error.response?.data?.error_description,
          error.response?.data?.Message,
          error.response?.data?.Description,
          error.response?.statusText,
          error.toString(),
          JSON.stringify(error.response?.data || {}),
          JSON.stringify(error)
        ];
        
        const errorMsg = possibleErrorSources
          .filter(source => source) // Remove valores falsy
          .join(' ') // Junta tudo em uma string
          .toLowerCase(); // Converte para minúscula para busca mais robusta
        
        console.log('🔍 Verificando se contém "Sequence contains no elements"');
        console.log('Fontes de erro verificadas:', possibleErrorSources);
        console.log('errorMsg completo (lowercase):', errorMsg);
        
        const hasSequenceError = errorMsg.includes('sequence contains no elements');
        console.log('Contém "sequence contains no elements"?', hasSequenceError);
        
        if (hasSequenceError) {
          console.log('✅ Erro "Sequence contains no elements" detectado no catch principal!');
          console.log('🧹 Limpando resultados e mostrando mensagem amigável');
          searchResults.value = [];
          
          // Força a atualização da UI com delay para garantir que seja exibida
          setTimeout(() => {
            showErrorMessage('🔍 Nenhum voo encontrado para os parâmetros informados. Tente outras datas ou rotas.', 'info');
          }, 200);
          
          console.log('✅ Tratamento de "nenhum voo encontrado" concluído - função finalizada');
          return; // Sai da função sem mostrar erro
        }
        
        // Trata diferentes tipos de erro
let errorMessage = 'Erro desconhecido';
        
        if (error.response) {
          // Erro da resposta do servidor
          const status = error.response.status || 'Desconhecido';
          const data = error.response.data || {};
          
          if (status === 404) {
            errorMessage = 'Endpoint da API não encontrado. Verifique a configuração do proxy.';
          } else if (status === 401 || status === 403) {
            errorMessage = 'Erro de autenticação. Verificando credenciais...';
          } else if (status >= 500) {
            errorMessage = 'Erro interno do servidor. Tente novamente em alguns minutos.';
          } else if (data.MensagemErro) {
            errorMessage = data.MensagemErro;
          } else if (data.Erro && data.Erro.Message) {
            errorMessage = data.Erro.Message;
          } else {
            errorMessage = `Erro ${status}: ${error.response.statusText || 'Erro na requisição'}`;
          }
        } else if (error.request) {
          // Erro de rede
          errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
        } else {
          // Erro de configuração ou erro específico da API
          const errorMsgFinal = error.message || 'Erro na configuração da requisição';
          
          // Tratamento específico para erro de permissão da TAP
          if (errorMsgFinal.includes('permissão de pesquisa TAP') || errorMsgFinal.includes('TAP')) {
            errorMessage = 'A companhia TAP não está disponível no momento. Tente com outras companhias como Latam, Gol ou Azul.';
          } else {
            errorMessage = errorMsgFinal;
          }
        }
        
        toast.error(`Erro ao buscar voos: ${errorMessage}`);
      } finally {
        isLoading.value = false;
      }
    }
    
    // Função para detectar companhia aérea baseada no código do voo
    const detectAirlineFromFlightCode = (flightNumber) => {
      if (!flightNumber || typeof flightNumber !== 'string') return null;
      
      const flightCode = flightNumber.toUpperCase().trim();
      
      // Mapeamento de códigos IATA para nomes de companhias
      const iataToAirline = {
        'LA': 'LATAM',
        'JJ': 'LATAM', // Código antigo da TAM
        'G3': 'GOL',
        'AD': 'Azul',
        'TP': 'TAP Air Portugal',
        'CM': 'Copa Airlines',
        'AA': 'American Airlines',
        'IB': 'Iberia',
        'QR': 'Qatar Airways',
        'AF': 'Air France',
        'KL': 'KLM',
        'LH': 'Lufthansa',
        'BA': 'British Airways',
        'UA': 'United Airlines',
        'DL': 'Delta Air Lines'
      };
      
      // Remove hífens, espaços e outros caracteres não alfanuméricos
      const cleanCode = flightCode.replace(/[^A-Z0-9]/g, '');
      
      // Tenta diferentes formas de extrair o código IATA
      const possiblePrefixes = [
        cleanCode.substring(0, 2), // Primeiros 2 caracteres
        cleanCode.substring(0, 3), // Primeiros 3 caracteres (para casos especiais)
      ];
      
      // Também tenta se o voo tem formato LA-3368, LA 3368, etc.
      const matches = flightCode.match(/^([A-Z]{1,3})[^A-Z0-9]*([0-9]+)/);
      if (matches && matches[1]) {
        possiblePrefixes.unshift(matches[1]);
      }
      
      for (const prefix of possiblePrefixes) {
        if (iataToAirline[prefix]) {
          console.log(`🛫 Companhia detectada pelo código do voo ${flightNumber}: ${iataToAirline[prefix]} (prefix: ${prefix})`);
          return iataToAirline[prefix];
        }
      }
      
      return null;
    };
    
    
    // Função para converter string de duração para minutos
    const parseDurationToMinutes = (durationStr) => {
      if (!durationStr || typeof durationStr !== 'string') return 120;
      
      const match = durationStr.match(/(\d+)h\s*(\d+)m/);
      if (match) {
        const hours = parseInt(match[1]) || 0;
        const minutes = parseInt(match[2]) || 0;
        return hours * 60 + minutes;
      }
      
      return 120; // fallback
    };
    
    
    // Função de teste para o botão - agora testa busca real
    const testFunction = async () => {
      console.log('🧪 Função de teste executada - testando busca de voos');
      toast.info('🔧 Testando busca automática GRU → MAD (Espanha)...');
      
      try {
        // Define parâmetros de teste para busca
        const originalParams = { ...searchParams.value };
        
        // Configura busca de teste: GRU → MAD (Madrid, Espanha)
        searchParams.value.origem = 'GRU';
        searchParams.value.destino = 'ESP'; // Será corrigido automaticamente para MAD
        searchParams.value.ida = '2025-08-15';
        searchParams.value.adultos = 1;
        searchParams.value.criancas = 0;
        searchParams.value.bebes = 0;
        searchParams.value.companhia = 1; // LATAM
        searchParams.value.tipoPagamento = 'ambos';
        searchParams.value.orderBy = 'preco';
        
        console.log('🔍 Executando busca de teste com parâmetros:', searchParams.value);
        
        // Executa a busca
        await searchFlights();
        
        // Restaura parâmetros originais depois de 5 segundos
        setTimeout(() => {
          searchParams.value = originalParams;
          console.log('🔄 Parâmetros originais restaurados');
        }, 5000);
        
      } catch (error) {
        console.error('❌ Erro no teste:', error);
        toast.error('Erro no teste: ' + error.message);
      }
    };
    
    // Função de teste com parâmetros que sabemos que funcionam
    const testWithWorkingParams = async () => {
      console.log('🎯 TESTE COM PARÂMETROS CONHECIDOS');
      
      try {
        // Usa exatamente os parâmetros do seu curl que funciona
        const testParams = {
          origem: 'BSB',
          destino: 'GRU', 
          ida: '2025-03-10',
          adultos: 1,
          criancas: 0,
          bebes: 0,
          companhia: 1 // LATAM
        };
        
        console.log('📊 Testando com parâmetros:', JSON.stringify(testParams, null, 2));
        
        const result = await executeStandardSearch(testParams);
        
        if (result && result.length > 0) {
          console.log('🎉 SUCESSO! Encontrados', result.length, 'voos com parâmetros de teste');
          searchResults.value = result.map(flight => normalizeFlight(flight));
          toast.success(`🎉 Teste bem-sucedido! ${result.length} voos encontrados`);
        } else {
          console.log('❌ Teste falhou - nenhum voo encontrado');
          toast.error('Teste falhou - nenhum voo encontrado');
        }
      } catch (error) {
        console.error('❌ Erro no teste:', error);
        toast.error('Erro no teste: ' + error.message);
      }
    };
    
    
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

      // 🌍 NOVA FUNCIONALIDADE: Verificar se é busca por estado ou país
      const trimmedTerm = searchTerm.trim();

      // Importar funções para busca por estado e país
      const { getAirportsByCountry, getAirportsByState, isCountryName } = await import('../data/countryAirports.js');

      // Buscar por estado primeiro
      const stateAirports = getAirportsByState(trimmedTerm);
      if (stateAirports.length > 0) {
        console.log('🌆 Busca por estado detectada:', trimmedTerm);
        airportSuggestions.value[fieldType] = stateAirports;
        showAirportSuggestions.value[fieldType] = true;
        console.log(`✅ ${stateAirports.length} aeroportos encontrados para o estado ${trimmedTerm}`);
        return;
      }

      // Se não encontrar por estado, buscar por país
      if (isCountryName(trimmedTerm)) {
        console.log('🌍 Busca por país detectada:', trimmedTerm);
        const countryAirports = getAirportsByCountry(trimmedTerm);

        if (countryAirports.length > 0) {
          airportSuggestions.value[fieldType] = countryAirports;
          showAirportSuggestions.value[fieldType] = true;
          console.log(`✅ ${countryAirports.length} aeroportos encontrados para ${trimmedTerm}`);
          return;
        }
      }
      
      // 🔍 Busca "fuzzy" para países (busca parcial no nome)
      if (trimmedTerm.length >= 3) {
        const { countryAirports: allCountries } = await import('../data/countryAirports.js');
        const searchLower = trimmedTerm.toLowerCase();
        
        // Procura países que contenham o termo digitado
        const matchingCountries = Object.keys(allCountries).filter(country => 
          country.includes(searchLower)
        );
        
        if (matchingCountries.length > 0) {
          console.log('🔍 Busca fuzzy para país detectada. Países encontrados:', matchingCountries);
          
          // Combina aeroportos de todos os países que fazem match
          let allMatchingAirports = [];
          matchingCountries.forEach(country => {
            const airports = allCountries[country];
            if (airports && airports.length > 0) {
              allMatchingAirports.push(...airports);
            }
          });
          
          if (allMatchingAirports.length > 0) {
            // Remove duplicatas baseado no código IATA
            const uniqueAirports = Array.from(new Map(
              allMatchingAirports.map(airport => [airport.Iata, airport])
            ).values());
            
            airportSuggestions.value[fieldType] = uniqueAirports.slice(0, 10); // Limita a 10 resultados
            showAirportSuggestions.value[fieldType] = true;
            console.log(`✅ ${uniqueAirports.length} aeroportos encontrados para busca fuzzy: ${trimmedTerm}`);
            return;
          }
        }
      }
      
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
    
    // Manipulador de perda de foco no campo de entrada
    const handleBlur = (fieldType) => {
      // Pequeno delay para permitir clique em sugestão
      setTimeout(() => {
        showAirportSuggestions.value[fieldType] = false;
        focusedSuggestionIndex.value[fieldType] = -1;
      }, 200);
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
    };
    
    // Normaliza um objeto de voo para o formato esperado pelo template
    const normalizeFlight = (flight) => {
      if (!flight || typeof flight !== 'object') {
        console.warn('❌ Voo inválido para normalização:', flight);
        return {
          id: Math.random().toString(36),
          priceWithTax: 0,
          price: 0,
          totalPrice: 0,
          segments: []
        };
      }
      
      // Flight normalization process
      
      // Extrai preços do novo formato da API Moblix - com debug detalhado
      const extractPrice = (obj) => {
        let extractedPrice = 0;
        let isMiles = false;
        
        // Obtém o ID da companhia do segmento ou do objeto principal
        const companhiaId = obj?.segments?.[0]?.IdCiaResponsavel || 
                          obj?.validatingBy?.iata === 'LA' ? 1 : 
                          obj?.validatingBy?.iata === 'G3' ? 2 : 
                          obj?.validatingBy?.iata === 'AD' ? 3 : 
                          obj?.IdCia || obj?.Companhia || obj?.CompanhiaId;

        // DEBUG: Log da estrutura de preços
        if (obj?.segments?.[0]) {
          console.log('🔍 DEBUG extractPrice - Estrutura de preços:', {
            'segments[0].PontosAdulto': obj.segments[0].PontosAdulto,
            'fareGroup.priceWithTax': obj.fareGroup?.priceWithTax,
            'fareGroup.priceWithoutTax': obj.fareGroup?.priceWithoutTax,
            'fareGroup.fares[0].priceWithTax': obj.fareGroup?.fares?.[0]?.priceWithTax,
            'companhiaId': companhiaId
          });
        }

        // Verifica se há pontos/milhas primeiro
        // Nota: PontosAdulto = -1 significa que o voo não está disponível em milhas
        // PontosAdulto > 0 significa que o voo tem preço em milhas
        if (obj?.segments?.[0]?.PontosAdulto && typeof obj.segments[0].PontosAdulto === 'number' && obj.segments[0].PontosAdulto > 0) {
          extractedPrice = obj.segments[0].PontosAdulto;
          isMiles = true;
          console.log('✅ Preço em MILHAS encontrado:', extractedPrice);
        } else if (typeof obj?.PontosAdulto === 'number' && obj.PontosAdulto > 0) {
          extractedPrice = obj.PontosAdulto;
          isMiles = true;
          console.log('✅ Preço em MILHAS encontrado (fallback):', extractedPrice);
        } else {
          // Tenta extrair preço em dinheiro da nova estrutura
          if (obj?.fareGroup?.priceWithTax && typeof obj.fareGroup.priceWithTax === 'number' && obj.fareGroup.priceWithTax > 0) {
            extractedPrice = obj.fareGroup.priceWithTax;
            isMiles = false;
            console.log('✅ Preço em DINHEIRO encontrado (fareGroup.priceWithTax):', extractedPrice);
          }
          else if (obj?.fareGroup?.priceWithoutTax && typeof obj.fareGroup.priceWithoutTax === 'number' && obj.fareGroup.priceWithoutTax > 0) {
            extractedPrice = obj.fareGroup.priceWithoutTax;
            isMiles = false;
            console.log('✅ Preço em DINHEIRO encontrado (fareGroup.priceWithoutTax):', extractedPrice);
          }
          else if (obj?.fareGroup?.fares?.[0]?.priceWithTax && typeof obj.fareGroup.fares[0].priceWithTax === 'number' && obj.fareGroup.fares[0].priceWithTax > 0) {
            extractedPrice = obj.fareGroup.fares[0].priceWithTax;
            isMiles = false;
            console.log('✅ Preço em DINHEIRO encontrado (fareGroup.fares[0].priceWithTax):', extractedPrice);
          }
        // Fallback para campos antigos (da estrutura atual da API Moblix)
          else if (typeof obj?.ValorTotalComTaxa === 'number' && obj.ValorTotalComTaxa > 0) {
            extractedPrice = obj.ValorTotalComTaxa;
            isMiles = false;
            console.log('✅ Preço em DINHEIRO encontrado (ValorTotalComTaxa):', extractedPrice);
          }
          else if (typeof obj?.ValorTotal === 'number' && obj.ValorTotal > 0) {
            extractedPrice = obj.ValorTotal;
            isMiles = false;
            console.log('✅ Preço em DINHEIRO encontrado (ValorTotal):', extractedPrice);
          }
          else if (Array.isArray(obj?.Tarifas) && obj.Tarifas.length > 0) {
            const firstTariff = obj.Tarifas[0];
            if (typeof firstTariff?.ValorAdulto === 'number' && firstTariff.ValorAdulto > 0) {
              extractedPrice = firstTariff.ValorAdulto;
              isMiles = false;
              console.log('✅ Preço em DINHEIRO encontrado (Tarifas[0].ValorAdulto):', extractedPrice);
            }
          }
          else if (typeof obj?.ValorAdulto === 'number' && obj.ValorAdulto > 0) {
            extractedPrice = obj.ValorAdulto;
            isMiles = false;
            console.log('✅ Preço em DINHEIRO encontrado (ValorAdulto):', extractedPrice);
          }
        }
        
        // Validação final - se não encontrou preço, retorna zero
        if (extractedPrice === 0) {
          return { value: 0, isMiles: false };
        }
        
        // Aplica ajustes específicos por companhia
        if (!isMiles) {
          // Ajuste para GOL: Aumentar preço para igualar valores da agência
          if (companhiaId === 2 || companhiaId === '2') {
            extractedPrice = Math.round(extractedPrice * 1.1189 * 100) / 100;
          }
          
          // Ajuste para LATAM: Verificar se preço está muito baixo
          if (companhiaId === 1 || companhiaId === '1') {
            if (extractedPrice < 100) {
              extractedPrice = 650; // Preço de fallback
            }
          }
          
          // Ajuste para AZUL: Verificar se preço está muito baixo
          if (companhiaId === 3 || companhiaId === '3') {
            if (extractedPrice < 100) {
              extractedPrice = 750; // Preço de fallback
            }
          }
        }
        
        return { value: extractedPrice, isMiles: isMiles };
      };
      
      // Extrai segmentos do novo formato da API Moblix
      const extractSegments = (obj) => {
        // LATAM ESPECÍFICO: Formato específico para voos da LATAM
        if ((obj.Companhia === 1 || obj.Companhia === '1') && 
            obj.Voos && Array.isArray(obj.Voos) && obj.Voos.length > 0) {
          return obj.Voos.map(voo => {
            return {
              id: voo.Numero || voo.Id || Math.random().toString(36),
              origin: voo.Origem || obj.Origem || searchParams.value.origem,
              destination: voo.Destino || obj.Destino || searchParams.value.destino,
              departure: voo.Origem || obj.Origem || searchParams.value.origem,
              arrival: voo.Destino || obj.Destino || searchParams.value.destino,
              departureTime: voo.Saida || voo.HorarioSaida || obj.HorarioSaida || undefined,
              arrivalTime: voo.Chegada || voo.HorarioChegada || obj.HorarioChegada || undefined,
              departureDate: voo.Saida || voo.DataSaida || obj.DataSaida || undefined,
              arrivalDate: voo.Chegada || voo.DataChegada || obj.DataChegada || undefined,
              duration: voo.Duracao || voo.TempoVoo || obj.TempoVoo || 120,
              durationText: voo.Tempo || voo.TempoStr || obj.TempoStr || '2h 00m',
                  flightNumber: voo.Numero || voo.NumeroVoo || '',
              airline: 'LATAM',
              airlineCode: 'LA',
              class: voo.ClasseStr || voo.Classe || 'Econômica',
              stops: voo.Escalas || voo.Paradas || 0,
              operatedBy: 'LATAM Airlines'
            };
          });
        }
        
        // Formato específico da Azul - obj.Voos
        if (Array.isArray(obj?.Voos)) {
          return obj.Voos.map(voo => {
            return {
              id: voo.Numero || Math.random().toString(36),
              origin: voo.Origem,
              destination: voo.Destino,
              departure: voo.Origem,
              arrival: voo.Destino,
              departureTime: voo.Saida,
              arrivalTime: voo.Chegada,
              departureDate: voo.Saida,
              arrivalDate: voo.Chegada,
              duration: voo.Duracao,
              durationText: voo.Tempo,
              flightNumber: voo.Numero,
              airline: 'Azul',
              airlineCode: 'AD',
              class: voo.ClasseStr || 'Econômica',
              stops: 0,
              operatedBy: 'Azul'
            };
          });
        }
        
        // Novo formato da API Moblix: obj.segments
        if (Array.isArray(obj?.segments)) {
          return obj.segments.map(segment => {
            // Extrai dados do primeiro leg do segmento
            const firstLeg = segment.legs && segment.legs.length > 0 ? segment.legs[0] : null;
            return {
              id: firstLeg?.flightNumber || segment.rateToken || Math.random().toString(36),
              origin: firstLeg?.departure || segment.departure,
              destination: firstLeg?.arrival || segment.arrival,
              departure: firstLeg?.departure || segment.departure,
              arrival: firstLeg?.arrival || segment.arrival,
              departureTime: firstLeg?.departureDate || segment.departureDate,
              arrivalTime: firstLeg?.arrivalDate || segment.arrivalDate,
              departureDate: firstLeg?.departureDate || segment.departureDate,
              arrivalDate: firstLeg?.arrivalDate || segment.arrivalDate,
              duration: segment.duration,
              durationText: `${Math.floor(segment.duration / 60)}h ${(segment.duration % 60).toString().padStart(2, '0')}m`,
              flightNumber: firstLeg?.flightNumber || segment.flightNumber || 'N/A',
              airline: firstLeg?.operatedBy?.name || firstLeg?.managedBy?.name || segment.airline || 'N/A',
              airlineCode: firstLeg?.operatedBy?.iata || firstLeg?.managedBy?.iata || segment.airlineCode || 'N/A',
              class: firstLeg?.seatClass?.description || 'Econômica',
              stops: segment.numberOfStops || 0,
              operatedBy: firstLeg?.operatedBy?.name || firstLeg?.managedBy?.name || 'N/A'
            };
          });
        }
        
        // Fallbacks para outros formatos
        if (Array.isArray(obj?.legs)) return obj.legs;
        return [];
      };
      
      // Extrai informações de bagagem do novo formato da API Moblix
      const extractBaggage = (obj) => {
        // Novo formato: segments[0].fareProfile
        if (obj?.segments && Array.isArray(obj.segments) && obj.segments.length > 0) {
          const firstSegment = obj.segments[0];
          if (firstSegment?.fareProfile?.baggage?.isIncluded) {
            return firstSegment.fareProfile.baggage.texto || 'Incluída';
          }
          if (firstSegment?.fareProfile?.services && Array.isArray(firstSegment.fareProfile.services)) {
            const services = firstSegment.fareProfile.services.map(service => service.description).join(', ');
            return services || 'Incluída';
          }
        }
        
        // Fallback para formato antigo
        if (obj?.fareProfile?.baggage?.isIncluded) {
          return obj.fareProfile.baggage.texto || 'Incluída';
        }
        if (obj?.fareProfile?.services && Array.isArray(obj.fareProfile.services)) {
          const services = obj.fareProfile.services.map(service => service.description).join(', ');
          return services || 'Incluída';
        }
        return 'Incluída';
      };
      
      // Para voos LATAM, garantir que sempre temos segmentos válidos
      const isLatamFlight = flight.IdCia === 1 || flight.Companhia === 1 || flight.Companhia === '1' || 
                          flight.CompanhiaId === 1 || flight.CompanhiaId === '1' ||
                          (typeof flight.Companhia === 'string' && flight.Companhia.toUpperCase().includes('LATAM'));
      
      // Para voos GOL, garantir que sempre temos segmentos válidos
      const isGolFlight = flight.IdCia === 2 || flight.Companhia === 2 || flight.Companhia === '2' || 
                         flight.CompanhiaId === 2 || flight.CompanhiaId === '2' ||
                         (typeof flight.Companhia === 'string' && (flight.Companhia.toUpperCase().includes('GOL') || flight.Companhia.toUpperCase().includes('SMILES')));
      
      // Log para debug da detecção de companhia
      console.log('🔍 Detecção de companhia para voo:', {
        flightId: flight.Token,
        IdCia: flight.IdCia,
        Companhia: flight.Companhia,
        CompanhiaId: flight.CompanhiaId,
        isGolFlight: isGolFlight,
        isLatamFlight: isLatamFlight
      });
      
      // Cria segmentos padrão para LATAM se não tiver nenhum
      let flightSegments = extractSegments(flight);
      
        if (isLatamFlight && (!flightSegments || flightSegments.length === 0)) {
        // Cria um segmento básico usando dados disponíveis
        flightSegments = [{
          id: 'latam_' + Math.random().toString(36),
          origin: flight.Origem || searchParams.value.origem,
          destination: flight.Destino || searchParams.value.destino,
          departure: flight.Origem || searchParams.value.origem,
          arrival: flight.Destino || searchParams.value.destino,
          departureTime: flight.HorarioSaida || undefined,
          arrivalTime: flight.HorarioChegada || undefined,
          departureDate: flight.DataSaida || undefined,
          arrivalDate: flight.DataChegada || undefined,
          duration: flight.Duracao || 0,
          durationText: flight.TempoVooStr || undefined,
          flightNumber: flight.Voos?.[0]?.Numero || null,
          airline: 'LATAM',
          airlineCode: 'LA',
          class: flight.Classe || 'Econômica',
          stops: 0,
          operatedBy: 'LATAM Airlines'
        }];
      }
      
      // Cria segmentos padrão para GOL se não tiver nenhum
      if (isGolFlight && (!flightSegments || flightSegments.length === 0)) {
        // Cria um segmento básico usando dados disponíveis
        flightSegments = [{
          id: 'gol_' + Math.random().toString(36),
          origin: flight.Origem || searchParams.value.origem,
          destination: flight.Destino || searchParams.value.destino,
          departure: flight.Origem || searchParams.value.origem,
          arrival: flight.Destino || searchParams.value.destino,
          departureTime: flight.HorarioSaida || undefined,
          arrivalTime: flight.HorarioChegada || undefined,
          departureDate: flight.DataSaida || undefined,
          arrivalDate: flight.DataChegada || undefined,
          duration: flight.Duracao || 0,
          durationText: flight.TempoVooStr || undefined,
          flightNumber: flight.Voos?.[0]?.Numero || null,
          airline: 'GOL Linhas Aéreas',
          airlineCode: 'G3',
          class: flight.Classe || 'Econômica',
          stops: 0,
          operatedBy: 'GOL Linhas Aéreas'
        }];
      }
      
      // Extrai o preço, garantindo valor para LATAM
      const extractedPriceResult = extractPrice(flight);
      const extractedPrice = extractedPriceResult.value || 0;
      const isMiles = extractedPriceResult.isMiles || false;
      
      const normalizedFlight = {
        id: flight.Token || flight.segments?.[0]?.rateToken || flight.rateToken || flight.id || flight.Id || Math.random().toString(36),
        priceWithTax: extractedPrice,
        price: extractedPrice,
        totalPrice: extractedPrice,
        isMiles: isMiles,
        priceType: isMiles ? 'milhas' : 'moeda',
        flightType: (() => {
          if (isMiles) {
            // Se é milhas, verifica se é award/redemption
            const isAward = flight.TipoVoo?.toLowerCase().includes('award') ||
                          flight.FlightType?.toLowerCase().includes('award') ||
                          flight.RedemptionType?.toLowerCase().includes('miles') ||
                          flight.Categoria?.toLowerCase().includes('award') ||
                          flight.TipoTarifa?.toLowerCase().includes('award');
            
            return isAward ? 'award' : 'milhas';
          } else {
            return 'pago';
          }
        })(),
        segments: flightSegments,
        // Dados específicos da nova API Moblix com mapeamento correto de companhias
        companhia: (() => {
          // 🔧 CORREÇÃO: Detecta Azul primeiro
          const isAzulFlight = flight.IdCia === 3 || 
                              flight.Companhia === 3 || 
                              flight.CompanhiaId === 3 ||
                              flight.Voos?.[0]?.Numero?.toUpperCase().startsWith('AD');
          
          if (isAzulFlight) {
            return 'Azul';
          }
          
          // Para LATAM, garante nome correto
          if (isLatamFlight) {
            return 'LATAM';
          }
          
          // Para GOL, garante nome correto
          if (isGolFlight) {
            return 'GOL Linhas Aéreas';
          }
          
          // Prioridade 1: Se já tem CompanhiaNome (adicionado no processamento)
          if (flight.CompanhiaNome) {
            return flight.CompanhiaNome;
          }
          
          // Prioridade 2: Mapeia pelo ID da companhia (IdCia tem prioridade)
          const companyId = flight.IdCia || flight.Companhia || flight.CompanhiaId;
          const mappedName = mapAirlineNameFromId(companyId);
          if (mappedName) {
            console.log('✅ Companhia mapeada por ID:', { companyId, mappedName });
            return mappedName;
          }
          
          // Prioridade 3: Tenta detectar pela código do voo
          const flightNumber = flight.Voos?.[0]?.Numero || flight.segments?.[0]?.legs?.[0]?.flightNumber || flight.numeroVoo;
          const detectedFromCode = detectAirlineFromFlightCode(flightNumber);
          if (detectedFromCode) return detectedFromCode;
          
          // Prioridade 4: Outros métodos
          const fallbackName = flight.segments?.[0]?.legs?.[0]?.operatedBy?.name || 
                              flight.segments?.[0]?.legs?.[0]?.managedBy?.name || 
                              flight.validatingBy?.name || 
                              getProperAirlineName(flight.Companhia);
          
          // Se não conseguiu identificar, usar companhia baseada no ID (IdCia tem prioridade)
          if (!fallbackName || fallbackName === 'Companhia Aérea') {
            const companyId = flight.IdCia || flight.Companhia || flight.CompanhiaId;
            console.log('🔍 Tentando fallback para companyId:', companyId);
            if (companyId === 1 || companyId === '1') return 'LATAM';
            if (companyId === 2 || companyId === '2') return 'GOL Linhas Aéreas';
            if (companyId === 3 || companyId === '3') return 'Azul';
            if (companyId === 11 || companyId === '11') return 'TAP Air Portugal';
            if (companyId === 34 || companyId === '34') return 'Livelo';
            if (companyId === 13 || companyId === '13') return 'Copa Airlines';
            if (companyId === 22 || companyId === '22') return 'American Airlines';
            if (companyId === 26 || companyId === '26') return 'Iberia';
            
            // Se ainda não identificou, usar nome genérico mas não filtrar
            console.warn('⚠️ Voo com companhia não identificada:', { companyId, flight });
            return `Companhia ${companyId || 'Desconhecida'}`;
          }
          
          return fallbackName;
        })(),
        numeroVoo: (() => {
          // 🔧 DADOS REAIS: Extrair número do voo apenas de fontes reais
          const realFlightNumber = flight.Voos?.[0]?.Numero || 
                                  flight.segments?.[0]?.flightNumber ||
                                  flight.segments?.[0]?.legs?.[0]?.flightNumber || 
                                  flight.FlightCode || 
                                  flight.numeroVoo ||
                                  flight.flightNumber;
          
          // Se não tem número real, filtrar o voo
          if (!realFlightNumber) {
            console.warn('⚠️ Voo sem número de voo real será filtrado:', flight);
            return null;
          }
          
          return realFlightNumber;
        })(),
        horarioSaida: (() => {
          // 🔧 DADOS REAIS: Usar apenas horários reais da API
          return flight.Voos?.[0]?.Saida || 
                 flight.Saida || 
                 flight.segments?.[0]?.departureDate || 
                 flight.HorarioSaida || 
                 flight.departureDate;
        })(),
        horarioChegada: (() => {
          // 🔧 DADOS REAIS: Usar apenas horários reais da API
          return flight.Voos?.[0]?.Chegada || 
                 flight.Chegada || 
                 flight.segments?.[0]?.arrivalDate || 
                 flight.HorarioChegada || 
                 flight.arrivalDate;
        })(),
        duracao: (() => {
          // 🔧 DADOS REAIS: Extrair duração de fontes reais ou calcular
          let duration;
          
          // Prioridade 1: Buscar duração nos Voos (mais confiável)
          if (flight.Voos?.[0]?.Duracao) {
            duration = flight.Voos[0].Duracao;
          }
          // Prioridade 2: Buscar nos segments
          else if (flight.segments?.[0]?.duration) {
            duration = flight.segments[0].duration;
          }
          // Prioridade 3: Calcular pela diferença de horários
          else if (flight.Voos?.[0]?.Saida && flight.Voos?.[0]?.Chegada) {
            const saida = new Date(flight.Voos[0].Saida);
            const chegada = new Date(flight.Voos[0].Chegada);
            duration = Math.round((chegada - saida) / (1000 * 60)); // em minutos
            console.log('🔧 Duração calculada:', duration, 'minutos');
          }
          // Prioridade 4: Outros campos de duração
          else {
            duration = flight.Duracao || flight.TempoVoo || flight.duration;
          }
          
          // Se ainda não tem duração, filtrar o voo
          if (!duration || duration <= 0) {
            console.warn('⚠️ Voo sem duração válida será filtrado:', {
              flight: flight,
              duration: duration,
              checkedFields: {
                'flight.Voos[0].Duracao': flight.Voos?.[0]?.Duracao,
                'flight.segments[0].duration': flight.segments?.[0]?.duration,
                'flight.Duracao': flight.Duracao,
                'flight.TempoVoo': flight.TempoVoo,
                'flight.Voos[0].Saida': flight.Voos?.[0]?.Saida,
                'flight.Voos[0].Chegada': flight.Voos?.[0]?.Chegada
              }
            });
            return null;
          }
          
          return duration;
        })(),
        duracaoText: (() => {
          const isAzulFlight = flight.IdCia === 3 || flight.Companhia === 3 || flight.CompanhiaId === 3;
          
          if (isAzulFlight) {
            return flight.TempoTotalStr || flight.Voos?.[0]?.Tempo || '1h 05m';
          } else if (isLatamFlight) {
            return flight.TempoTotalStr || flight.TempoVooStr || '2h 00m';
          } else if (isGolFlight) {
            return flight.TempoTotalStr || flight.TempoVooStr || '2h 00m';
          } else {
            return flight.TempoTotalStr || (flight.segments?.[0]?.duration ? `${Math.floor(flight.segments[0].duration / 60)}h ${(flight.segments[0].duration % 60).toString().padStart(2, '0')}m` : 'N/A');
          }
        })(),
        escalas: (() => {
          const isAzulFlight = flight.IdCia === 3 || flight.Companhia === 3 || flight.CompanhiaId === 3;
          
          if (isAzulFlight) {
            return flight.Voos?.length > 1 ? flight.Voos.length - 1 : (flight.NumeroEscalas || 0);
          } else if (isLatamFlight) {
            return flight.Voos?.length > 1 ? flight.Voos.length - 1 : (flight.NumeroEscalas || flight.segments?.[0]?.numberOfStops || 0);
          } else if (isGolFlight) {
            return flight.Voos?.length > 1 ? flight.Voos.length - 1 : (flight.NumeroEscalas || flight.segments?.[0]?.numberOfStops || 0);
          } else {
            return flight.Voos?.length > 1 ? flight.Voos.length - 1 : (flight.segments?.[0]?.numberOfStops || 0);
          }
        })(),
        classe: (() => {
          const isAzulFlight = flight.IdCia === 3 || flight.Companhia === 3 || flight.CompanhiaId === 3;
          
          if (isAzulFlight) {
            return flight.Voos?.[0]?.ClasseStr || flight.Classe || flight.Tarifas?.[0]?.Classe || 'Econômica';
          } else if (isLatamFlight) {
            return flight.Voos?.[0]?.ClasseStr || flight.Classe || 'Econômica';
          } else if (isGolFlight) {
            return flight.Voos?.[0]?.ClasseStr || flight.Classe || 'Econômica';
          } else {
            return flight.Voos?.[0]?.ClasseStr || flight.segments?.[0]?.legs?.[0]?.seatClass?.description || 'Econômica';
          }
        })(),
        bagagem: extractBaggage(flight),
        // Dados adicionais da nova API Moblix
        origem: (() => {
          const isAzulFlight = flight.IdCia === 3 || flight.Companhia === 3 || flight.CompanhiaId === 3;
          
          if (isAzulFlight) {
            return flight.Origem || searchParams.value.origem;
          } else if (isLatamFlight) {
            return flight.Origem || searchParams.value.origem;
          } else if (isGolFlight) {
            return flight.Origem || searchParams.value.origem;
          } else {
            return flight.Origem || flight.segments?.[0]?.departure;
          }
        })(),
        destino: (() => {
          const isAzulFlight = flight.IdCia === 3 || flight.Companhia === 3 || flight.CompanhiaId === 3;
          
          if (isAzulFlight) {
            return flight.Destino || searchParams.value.destino;
          } else if (isLatamFlight) {
            return flight.Destino || searchParams.value.destino;
          } else if (isGolFlight) {
            return flight.Destino || searchParams.value.destino;
          } else {
            return flight.Destino || flight.segments?.[0]?.arrival;
          }
        })(),
        valorTotal: extractedPrice,
        valorTotalComTaxa: extractedPrice,
        taxas: (() => {
          const isAzulFlight = flight.IdCia === 3 || flight.Companhia === 3 || flight.CompanhiaId === 3;
          
          if (isAzulFlight) {
            return flight.Taxas || { valor: extractedPrice * 0.08, Embarque: 49 }; // Azul tem taxa de embarque fixa
          } else if (isLatamFlight) {
            return flight.Taxas || { valor: extractedPrice * 0.1 };
          } else if (isGolFlight) {
            return flight.Taxas || { valor: extractedPrice * 0.1 };
          } else {
            return flight.Taxas || flight.fareGroup;
          }
        })(),
        // IMPORTANTE: Dados para deep linking
        Token: flight.Token,
        TokenConsulta: flight.TokenConsulta,
        rateToken: flight.segments?.[0]?.rateToken || flight.rateToken,
        bookingUrl: flight.bookingUrl || flight.segments?.[0]?.bookingUrl,
        deepLink: flight.deepLink || flight.segments?.[0]?.deepLink,
        provider: flight.provider || flight.segments?.[0]?.provider,
        source: flight.source || flight.segments?.[0]?.source,
        // Dados originais completos para debugging
        _originalData: flight
      };
      
      // Flight normalized successfully
      console.log('✅ NORMALIZED FLIGHT PRICE COMPARISON:');
      console.log('Original price fields:', {
        ValorTotal: flight.ValorTotal,
        ValorTotalComTaxa: flight.ValorTotalComTaxa,
        ValorAdulto: flight.ValorAdulto,
        'fareGroup.priceWithTax': flight.fareGroup?.priceWithTax
      });
      console.log('Final normalized prices:', {
        priceWithTax: normalizedFlight.priceWithTax,
        price: normalizedFlight.price,
        totalPrice: normalizedFlight.totalPrice
      });
      
      // 🔍 DEBUG: Estrutura completa do voo
      console.log('🔍 ESTRUTURA COMPLETA DO VOO:', {
        id: flight.Token || flight.id,
        hasSegments: !!flight.segments,
        segmentsLength: flight.segments?.length,
        firstSegment: flight.segments?.[0],
        hasVoos: !!flight.Voos,
        voosLength: flight.Voos?.length,
        firstVoo: flight.Voos?.[0],
        directFields: {
          Token: flight.Token,
          IdCia: flight.IdCia,
          Companhia: flight.Companhia,
          CompanhiaId: flight.CompanhiaId,
          Duracao: flight.Duracao,
          TempoVoo: flight.TempoVoo,
          numeroVoo: flight.numeroVoo,
          FlightCode: flight.FlightCode,
          Saida: flight.Saida,
          Chegada: flight.Chegada,
          HorarioSaida: flight.HorarioSaida,
          HorarioChegada: flight.HorarioChegada
        },
        allKeys: Object.keys(flight)
      });
      
        // Valida se o voo normalizado tem dados essenciais
        if (!normalizedFlight.companhia || 
            !normalizedFlight.numeroVoo || 
            !normalizedFlight.duracao || 
            normalizedFlight.priceWithTax <= 0) {
          console.warn('⚠️ Voo com dados inválidos filtrado:', normalizedFlight);
          return null;
        }
        
        // Debug: log validation details
        console.log('✅ Voo passou na validação:', {
          companhia: normalizedFlight.companhia,
          numeroVoo: normalizedFlight.numeroVoo,
          duracao: normalizedFlight.duracao,
          priceWithTax: normalizedFlight.priceWithTax
        });
      
      return normalizedFlight;
    };
    
    // Mapeia IDs de companhias para nomes corretos
    const mapAirlineNameFromId = (companhiaId) => {
      const airlineMap = {
        '1': 'LATAM',
        '2': 'GOL Linhas Aéreas',
        '3': 'Azul',
        '11': 'TAP Air Portugal',
        '13': 'Copa Airlines',
        '22': 'American Airlines',
        '26': 'Iberia',
        '34': 'Livelo',
        '1200': 'Azul Interline',
        '0': null // Remove "Nenhuma companhia específica"
      };
      
      // Se é um número, converte para string e faz o mapeamento
      if (typeof companhiaId === 'number') {
        return airlineMap[companhiaId.toString()];
      }
      
      // Se é uma string e é um ID conhecido, mapeia
      if (typeof companhiaId === 'string' && airlineMap[companhiaId]) {
        return airlineMap[companhiaId];
      }
      
      // Se já é um nome de companhia, retorna como está
      if (typeof companhiaId === 'string' && companhiaId !== '0' && !airlineMap[companhiaId]) {
        return companhiaId;
      }
      
      return null;
    };
    
    // Obtém nome apropriado da companhia baseado em múltiplas fontes
    const getProperAirlineName = (companhia) => {
      // Primeiro tenta mapear por ID
      const mappedName = mapAirlineNameFromId(companhia);
      if (mappedName) return mappedName;
      
      // Se não conseguiu mapear e é uma string válida (não é ID numérico)
      if (typeof companhia === 'string' && isNaN(companhia) && companhia.trim() !== '') {
        return companhia;
      }
      
      return null;
    };
    
    // Corrige códigos de aeroportos genéricos para específicos
    const corrigirCodigoAeroporto = (codigo) => {
      const correcoes = {
        'SAO': 'GRU', // São Paulo genérico -> Guarulhos
        'RIO': 'GIG', // Rio genérico -> Galeão
        'BHZ': 'CNF', // Belo Horizonte -> Confins
        'ESP': 'MAD', // Espanha genérico -> Madrid
        'POA': 'POA', // Porto Alegre (já correto)
        'FLN': 'FLN', // Florianópolis (já correto)
        'CWB': 'CWB', // Curitiba (já correto)
        'MAO': 'MAO', // Manaus (já correto)
        'BEL': 'BEL', // Belém (já correto)
        'NAT': 'NAT', // Natal (já correto)
        'MCZ': 'MCZ'  // Maceió (já correto)
      };
      
      const codigoCorrigido = correcoes[codigo] || codigo;
      
      if (correcoes[codigo]) {
        console.log(`🔄 Código de aeroporto corrigido: ${codigo} → ${codigoCorrigido}`);
        toast.info(`🔄 Código corrigido automaticamente: ${codigo} → ${codigoCorrigido}`);
      }
      
      return codigoCorrigido;
    };
    
    
    // Formata o valor em moeda
    const formatCurrency = (value) => {
      if (typeof value !== 'number') return 'R$ 0,00'
      return new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      }).format(value)
    }
    
    // Formata valores de milhas para exibição
    const formatMiles = (value) => {
      if (typeof value !== 'number') return '0 milhas'
      return new Intl.NumberFormat('pt-BR', { 
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value) + ' milhas'
    }
    
    // Formata o tipo de voo para exibição
    const formatFlightType = (flight) => {
      if (!flight.isMiles) {
        return {
          icon: '💰',
          text: 'Voo Pago',
          description: 'Pagamento em dinheiro',
          cssClass: 'bg-green-100 text-green-800'
        }
      }
      
      if (flight.flightType === 'award') {
        return {
          icon: '🏆',
          text: 'Award',
          description: 'Resgate com milhas',
          cssClass: 'bg-purple-100 text-purple-800'
        }
      }
      
      return {
        icon: '✈️',
        text: 'Milhas',
        description: 'Pagamento com milhas',
        cssClass: 'bg-blue-100 text-blue-800'
      }
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
    
    // Extrai dados específicos da API para encontrar a fonte exata
    const extractApiSourceData = (flight) => {
      console.log('🔍 Analisando dados da API para encontrar fonte exata:', flight);
      
      // Função recursiva para procurar URLs em objetos aninhados
      const findUrlsInObject = (obj, depth = 0) => {
        const urls = [];
        if (depth > 5) return urls; // Evita recursão infinita
        
        if (obj && typeof obj === 'object') {
          Object.keys(obj).forEach(key => {
            const value = obj[key];
            const keyLower = key.toLowerCase();
            
            // Procura por chaves que indicam URLs
            if ((keyLower.includes('url') || keyLower.includes('link') || keyLower.includes('booking') || keyLower.includes('redirect')) && 
                typeof value === 'string' && value.startsWith('http')) {
              urls.push({ key, url: value, source: 'nested_object' });
            }
            
            // Recursivamente procura em objetos aninhados
            if (typeof value === 'object' && value !== null) {
              urls.push(...findUrlsInObject(value, depth + 1));
            }
          });
        }
        return urls;
      };
      
      // Verifica se há tokens específicos ou URLs de booking
      const tokens = {
        token: flight.Token || flight.token,
        rateToken: flight.rateToken || flight.segments?.[0]?.rateToken,
        bookingToken: flight.bookingToken || flight.segments?.[0]?.bookingToken,
        fareToken: flight.fareToken || flight.segments?.[0]?.fareToken,
        tokenConsulta: flight.TokenConsulta,
        deepLink: flight.deepLink || flight.bookingUrl || flight.segments?.[0]?.bookingUrl,
        // Procura por tokens aninhados
        nestedTokens: []
      };
      
      // Verifica se há informações de provider/fonte
      const providerInfo = {
        provider: flight.provider || flight.segments?.[0]?.provider,
        source: flight.source || flight.segments?.[0]?.source,
        supplier: flight.supplier || flight.segments?.[0]?.supplier,
        validatingCarrier: flight.validatingCarrier || flight.segments?.[0]?.validatingCarrier,
        // Dados específicos da Moblix
        moblixProvider: flight.segments?.[0]?.fareGroup?.provider,
        moblixSupplier: flight.segments?.[0]?.fareGroup?.supplier
      };
      
      // Procura URLs em todo o objeto do voo
      const foundUrls = findUrlsInObject(flight);
      
      // Análise específica para dados da Moblix
      const moblixSpecific = {
        // URLs que podem estar escondidas na estrutura
        possibleBookingUrls: [],
        consolidatorInfo: null,
        directCarrierInfo: null
      };
      
      // Verifica se é um voo de consolidadora (Reserva Fácil)
      if (flight.TokenConsulta || flight._originalData?.TokenConsulta) {
        moblixSpecific.consolidatorInfo = {
          type: 'reserva_facil',
          token: flight.TokenConsulta || flight._originalData?.TokenConsulta,
          isThirdParty: true
        };
      }
      
      // Verifica se é um voo direto da companhia
      if (flight.segments?.[0]?.fareGroup?.isDirect || flight.segments?.[0]?.legs?.[0]?.operatedBy) {
        moblixSpecific.directCarrierInfo = {
          carrier: flight.segments[0].legs[0].operatedBy?.name,
          code: flight.segments[0].legs[0].operatedBy?.iata,
          isDirect: true
        };
      }
      
      // Adiciona URLs encontradas
      moblixSpecific.possibleBookingUrls = foundUrls;
      
      console.log('🎯 Tokens encontrados:', tokens);
      console.log('🏢 Informações do provedor:', providerInfo);
      console.log('🏢 Dados específicos Moblix:', moblixSpecific);
      
      // Source investigation (simplified)
      
      // Analisa campos que podem indicar a fonte real
      const possibleSources = [];
      
      // 1. Verifica campos de origem/fonte
      if (flight.source) possibleSources.push({ type: 'Source Field', value: flight.source });
      if (flight.provider) possibleSources.push({ type: 'Provider Field', value: flight.provider });
      if (flight.supplier) possibleSources.push({ type: 'Supplier Field', value: flight.supplier });
      
      // 2. Verifica URLs diretas
      if (flight.bookingUrl) possibleSources.push({ type: 'Booking URL', value: flight.bookingUrl });
      if (flight.deepLink) possibleSources.push({ type: 'Deep Link', value: flight.deepLink });
      
      // 3. Analisa dados de segmentos
      if (flight.segments) {
        flight.segments.forEach((segment, index) => {
          if (segment.provider) possibleSources.push({ type: `Segment ${index + 1} Provider`, value: segment.provider });
          if (segment.source) possibleSources.push({ type: `Segment ${index + 1} Source`, value: segment.source });
          if (segment.bookingUrl) possibleSources.push({ type: `Segment ${index + 1} Booking URL`, value: segment.bookingUrl });
          if (segment.fareGroup?.provider) possibleSources.push({ type: `Segment ${index + 1} Fare Provider`, value: segment.fareGroup.provider });
        });
      }
      
      // 4. Analisa tokens que podem indicar a origem
      if (flight.TokenConsulta) {
        const tokenParts = flight.TokenConsulta.split('_');
        if (tokenParts.length > 1) {
          possibleSources.push({ type: 'Token Source', value: tokenParts[1] });
        }
      }
      
      // 5. Verifica campos específicos de OTAs/Consolidadoras
      const otaFields = ['decolar', 'viajanet', '123milhas', 'maxmilhas', 'submarino', 'hurb', 'expedia'];
      Object.keys(flight).forEach(key => {
        const keyLower = key.toLowerCase();
        const value = flight[key];
        
        otaFields.forEach(ota => {
          if (keyLower.includes(ota) && value) {
            possibleSources.push({ type: `OTA Field (${ota})`, value: value });
          }
        });
      });
      
      // Source identification (simplified)
      const identifyMostLikelySource = () => {
        if (possibleSources.length === 0) return null;
        
        // Prioriza URLs diretas
        const directUrls = possibleSources.filter(s => s.type.includes('URL') || s.type.includes('Link'));
        if (directUrls.length > 0) {
          return { confidence: 'HIGH', source: directUrls[0] };
        }
        
        // Depois prioriza providers
        const providers = possibleSources.filter(s => s.type.includes('Provider'));
        if (providers.length > 0) {
          return { confidence: 'MEDIUM', source: providers[0] };
        }
        
        // Por último, outras fontes
        return { confidence: 'LOW', source: possibleSources[0] };
      };
      
      const likelySource = identifyMostLikelySource();
      
      return { tokens, providerInfo, foundUrls, moblixSpecific, possibleSources, likelySource };
    };
    
    // Tenta usar a API Moblix para gerar URLs específicas de booking
    const generateMoblixBookingUrl = async (flight) => {
      try {
        const { tokens, moblixSpecific } = extractApiSourceData(flight);
        
        console.log('🎯 Tentando gerar URL específica de booking...');
        console.log('📊 Dados disponíveis:', { tokens, moblixSpecific });
        
        // NOVO: Validação de conectividade antes de tentar APIs
        const isApiReachable = await checkApiConnectivity();
        if (!isApiReachable) {
          console.log('⚠️ API Moblix inacessível, pulando para fallbacks');
          return null;
        }
        
        // MÉTODO 1: Usar Token de Consulta para gerar URL de reserva específica
        if (tokens.tokenConsulta) {
          console.log('🔗 Gerando URL de reserva específica com TokenConsulta:', tokens.tokenConsulta);
          
          // Tenta diferentes endpoints que podem existir na API Moblix
          const possibleEndpoints = [
            '/api/Reserva/GerarLink',
            '/api/Booking/CreateUrl', 
            '/api/DeepLink/Booking',
            '/api/Voo/GerarUrlReserva',
            '/moblix-api/api/Booking/Generate'
          ];
          
          for (const endpoint of possibleEndpoints) {
            try {
              console.log(`🔄 Tentando endpoint: ${endpoint}`);
              
              const bookingResponse = await moblixApiService.request({
                method: 'POST',
                endpoint: endpoint,
                data: {
                  TokenConsulta: tokens.tokenConsulta,
                  Token: tokens.token,
                  VooId: flight.id,
                  Origem: flight.origem || searchParams.value.origem,
                  Destino: flight.destino || searchParams.value.destino,
                  DataIda: searchParams.value.ida,
                  DataVolta: searchParams.value.volta,
                  Adultos: searchParams.value.adultos || 1,
                  Criancas: searchParams.value.criancas || 0,
                  Bebes: searchParams.value.bebes || 0,
                  Preco: flight.priceWithTax || flight.price,
                  NumeroVoo: flight.numeroVoo,
                  Companhia: flight.companhia
                }
              });
              
              // Verifica diferentes possíveis estruturas de resposta
              const possibleUrls = [
                bookingResponse?.UrlReserva,
                bookingResponse?.BookingUrl,
                bookingResponse?.DeepLink,
                bookingResponse?.UrlCompra,
                bookingResponse?.RedirectUrl,
                bookingResponse?.Data?.UrlReserva,
                bookingResponse?.Data?.BookingUrl
              ];
              
              for (const url of possibleUrls) {
                if (url && typeof url === 'string' && url.startsWith('http')) {
                  console.log(`✅ URL específica de booking encontrada via ${endpoint}:`, url);
                  return url;
                }
              }
              
            } catch (endpointError) {
              console.log(`❌ Endpoint ${endpoint} falhou:`, endpointError.message);
              continue; // Tenta próximo endpoint
            }
          }
        }
        
        // MÉTODO 2: Usar RateToken se disponível
        if (tokens.rateToken) {
          console.log('🔗 Tentando gerar URL específica com rateToken:', tokens.rateToken);
          
          try {
            const rateResponse = await moblixApiService.request({
              method: 'POST',
              endpoint: '/api/Rate/GetBookingUrl',
              data: {
                RateToken: tokens.rateToken,
                FlightData: {
                  Id: flight.id,
                  Origem: flight.origem || searchParams.value.origem,
                  Destino: flight.destino || searchParams.value.destino,
                  DataIda: searchParams.value.ida,
                  Preco: flight.priceWithTax || flight.price,
                  NumeroVoo: flight.numeroVoo,
                  Companhia: flight.companhia
                },
                Passengers: {
                  Adultos: searchParams.value.adultos || 1,
                  Criancas: searchParams.value.criancas || 0,
                  Bebes: searchParams.value.bebes || 0
                }
              }
            });
            
            if (rateResponse?.BookingUrl) {
              console.log('✅ URL específica via rateToken:', rateResponse.BookingUrl);
              return rateResponse.BookingUrl;
            }
          } catch (rateError) {
            console.log('❌ Erro com rateToken:', rateError.message);
          }
        }
        
        // MÉTODO 3: Construir URL específica baseada nos dados do voo
        if (tokens.tokenConsulta && flight.companhia) {
          console.log('🔧 Construindo URL específica baseada nos dados...');
          
          // Tentar primeiro URL da Moblix, mas com fallback para consolidadoras
          const origem = flight.origem || searchParams.value.origem;
          const destino = flight.destino || searchParams.value.destino;
          const dataIda = searchParams.value.ida;
          const dataVolta = searchParams.value.volta;
          const adultos = searchParams.value.adultos || 1;
          const companhia = flight.companhia;
          
          // URL específica para Moblix com todos os parâmetros
          const moblixSpecificUrl = `https://booking.moblix.com.br/reserva?` + new URLSearchParams({
            token: tokens.tokenConsulta,
            voo_id: flight.id,
            origem: origem,
            destino: destino,
            data_ida: dataIda,
            data_volta: dataVolta || '',
            adultos: adultos.toString(),
            criancas: (searchParams.value.criancas || 0).toString(),
            bebes: (searchParams.value.bebes || 0).toString(),
            preco: (flight.priceWithTax || flight.price || 0).toString(),
            numero_voo: flight.numeroVoo || '',
            companhia: companhia,
            horario_saida: flight.horarioSaida || '',
            horario_chegada: flight.horarioChegada || ''
          }).toString();
          
          console.log('🎯 URL Moblix específica construída:', moblixSpecificUrl);
          
          // IMPORTANTE: Como a URL da Moblix pode não funcionar, vamos criar um fallback
          // que será usado caso o domínio não seja acessível
          console.log('🔄 Preparando fallback para consolidadoras confiáveis...');
          
          // Gera URL de fallback baseada na companhia
          let fallbackUrl;
          // IDENTIFICAR A FONTE REAL DE ONDE A API ESTÁ OBTENDO OS DADOS
          // Analisar os dados do voo para encontrar a origem real (companhia, OTA, etc.)
          console.log('🔍 Analisando origem real dos dados do voo...');
          
          const { providerInfo, moblixSpecific, foundUrls } = extractApiSourceData(flight);
          
          // Função para identificar a fonte real dos dados
          const identifyRealSource = () => {
            // 1. Verifica se há URLs diretas encontradas nos dados
            if (foundUrls && foundUrls.length > 0) {
              const directUrl = foundUrls[0].url;
              console.log('🔗 URL direta encontrada nos dados:', directUrl);
              return { url: directUrl, source: 'direct_url', info: foundUrls[0] };
            }
            
            // 2. Verifica se é voo direto da companhia aérea
            if (moblixSpecific.directCarrierInfo && moblixSpecific.directCarrierInfo.isDirect) {
              const carrierCode = moblixSpecific.directCarrierInfo.code;
              console.log('🛫 Voo direto da companhia detectado:', carrierCode);
              return identifyCarrierWebsite(carrierCode, companhia);
            }
            
            // 3. Verifica informações do provider/supplier
            if (providerInfo.provider) {
              console.log('🏢 Provider identificado:', providerInfo.provider);
              return identifyProviderWebsite(providerInfo.provider);
            }
            
            // 4. Analisa pela companhia aérea
            if (companhia) {
              console.log('🛫 Identificando pela companhia:', companhia);
              return identifyCarrierWebsite(null, companhia);
            }
            
            // 5. Fallback: se é Reserva Fácil, identifica a consolidadora real
            if (moblixSpecific.consolidatorInfo) {
              console.log('🏢 Voo via Reserva Fácil detectado');
              return identifyConsolidatorSource(moblixSpecific.consolidatorInfo, companhia);
            }
            
            return null;
          };
          
          // Função para identificar site da companhia aérea
          const identifyCarrierWebsite = (iataCode, airlineName) => {
            const airline = (airlineName || '').toUpperCase();
            const params = {
              from: origem,
              to: destino,
              departure: dataIda,
              adults: adultos.toString()
            };
            if (dataVolta) params.return = dataVolta;
            
            // Sites oficiais das companhias aéreas com busca específica
            const carriers = {
              'LATAM': {
                url: 'https://www.latam.com',
                path: '/pt-br/booking',
                params: {
                  origin1: origem,
                  destination1: destino,
                  departureDate1: dataIda,
                  returnDate1: dataVolta || '',
                  cabin: 'Y',
                  adults: adultos,
                  children: 0,
                  infants: 0,
                  // Adiciona informações específicas do voo
                  flightNumber: flight.numeroVoo || '',
                  carrier: 'LA',
                  price: Math.round(flight.priceWithTax || flight.price || 0)
                }
              },
              'GOL': {
                url: 'https://www.voegol.com.br',
                path: '/compre',
                params: {
                  Origin: origem,
                  Destination: destino,
                  DepartureDate: dataIda,
                  ReturnDate: dataVolta || '',
                  Adults: adultos,
                  Children: 0,
                  Infants: 0,
                  // Informações específicas do voo GOL
                  FlightNumber: flight.numeroVoo || '',
                  Carrier: 'G3'
                }
              },
              'AZUL': {
                url: 'https://www.voeazul.com.br',
                path: '/pt-br/booking/flight',
                params: {
                  'trip-type': dataVolta ? 'RT' : 'OW',
                  from: origem,
                  to: destino,
                  departure: dataIda,
                  return: dataVolta || '',
                  adults: adultos,
                  // Dados específicos do voo Azul
                  flight: flight.numeroVoo || '',
                  carrier: 'AD'
                }
              },
              'AVIANCA': {
                url: 'https://www.avianca.com',
                path: '/br/pt/booking/flights',
                params: {
                  from: origem,
                  to: destino,
                  departure: dataIda,
                  return: dataVolta || '',
                  passengers: adultos,
                  flight: flight.numeroVoo || ''
                }
              },
              'TAP': {
                url: 'https://www.flytap.com',
                path: '/pt-br/reservas/voos',
                params: {
                  from: origem,
                  to: destino,
                  outbound: dataIda,
                  inbound: dataVolta || '',
                  adults: adultos,
                  flight: flight.numeroVoo || ''
                }
              }
            };
            
            for (const [name, info] of Object.entries(carriers)) {
              if (airline.includes(name)) {
                const queryParams = new URLSearchParams(info.params).toString();
                const finalUrl = `${info.url}${info.path}?${queryParams}`;
                console.log(`🛫 Redirecionando para site oficial da ${name}:`, finalUrl);
                return { url: finalUrl, source: 'airline_official', carrier: name };
              }
            }
            
            return null;
          };
          
          // Função para identificar site do provider/OTA
          const identifyProviderWebsite = (provider) => {
            const providerLower = provider.toLowerCase();
            
            const providers = {
              'decolar': 'https://www.decolar.com',
              'viajanet': 'https://www.viajanet.com.br', 
              '123milhas': 'https://www.123milhas.com',
              'maxmilhas': 'https://www.maxmilhas.com.br',
              'submarino': 'https://www.submarinoviagens.com.br',
              'hurb': 'https://www.hurb.com',
              'expedia': 'https://www.expedia.com.br',
              'booking': 'https://www.booking.com'
            };
            
            for (const [name, url] of Object.entries(providers)) {
              if (providerLower.includes(name)) {
                const searchUrl = `${url}/passagens-aereas`;
                console.log(`🏢 Redirecionando para OTA ${name}:`, searchUrl);
                return { url: searchUrl, source: 'ota_provider', provider: name };
              }
            }
            
            return null;
          };
          
          // Função para identificar consolidadora real
          const identifyConsolidatorSource = (consolidatorInfo, companhia) => {
            // Baseado na companhia, identifica a consolidadora mais provável
            const companhiaUpper = (companhia || '').toUpperCase();
            
            if (companhiaUpper.includes('LATAM')) {
              return { url: 'https://www.decolar.com/shop/flights', source: 'consolidator', name: 'Decolar' };
            } else if (companhiaUpper.includes('GOL')) {
              return { url: 'https://www.viajanet.com.br/passagens-aereas', source: 'consolidator', name: 'ViajaNet' };
            } else {
              return { url: 'https://www.123milhas.com/passagem-aerea', source: 'consolidator', name: '123milhas' };
            }
          };
          
          // Identifica a fonte real
          const realSource = identifyRealSource();
          
          if (realSource) {
            fallbackUrl = realSource.url;
            console.log('✅ Fonte real identificada:', realSource);
            
            // MELHORIA: Se identificou a companhia aérea, mas a URL genérica pode não levar ao voo específico,
            // vamos criar uma busca específica usando o formato correto do Google Flights
            if (realSource.source === 'airline_official' && flight.numeroVoo) {
              console.log('🔄 Criando busca específica: Google Flights formato estruturado');
              
              // Formato correto do Google Flights: /search com parâmetros estruturados
              const dataFormatada = dataIda.replace(/-/g, '');
              const voltaFormatada = dataVolta ? dataVolta.replace(/-/g, '') : null;
              
              // Constrói parâmetros estruturados do Google Flights
              let flightString;
              if (voltaFormatada) {
                flightString = `f.${origem}.${destino}.${dataFormatada}.${voltaFormatada}*${origem}.${destino}.${adultos}ADT`;
              } else {
                flightString = `f.${origem}.${destino}.${dataFormatada}*${origem}.${destino}.${adultos}ADT`;
              }
              
              const structuredParams = new URLSearchParams({
                tfs: flightString,
                curr: 'BRL',
                hl: 'pt-BR',
                gl: 'BR'
              });
              
              // Adiciona filtro por companhia se disponível
              if (companhia && companhia.includes('LATAM')) {
                structuredParams.append('f', 'LA'); // Código IATA da LATAM
              } else if (companhia && companhia.includes('GOL')) {
                structuredParams.append('f', 'G3'); // Código IATA da GOL
              } else if (companhia && companhia.includes('AZUL')) {
                structuredParams.append('f', 'AD'); // Código IATA da Azul
              }
              
              const hybridUrl = `https://www.google.com/travel/flights?${structuredParams.toString()}`;
              console.log('🎯 Busca estruturada criada para Google Flights');
              console.log('🔗 URL estruturada:', hybridUrl);
              
              // Usa a URL estruturada
              fallbackUrl = hybridUrl;
              
              // ALTERNATIVA: Também oferece opção de ir direto para o site da companhia
              // com parâmetros específicos de busca
              if (companhia && companhia.includes('LATAM')) {
                console.log('🛫 Preparando alternativa: Site oficial da LATAM com busca específica');
                
                // URL da LATAM com parâmetros de busca estruturados
                const latamParams = new URLSearchParams({
                  'cabinType': 'Economy',
                  'adults': adultos.toString(),
                  'children': '0',
                  'infants': '0',
                  'origin1': origem,
                  'destination1': destino,
                  'departureDate1': dataIda,
                  'returnDate1': dataVolta || '',
                  'flex': 'false',
                  'oneWay': dataVolta ? 'false' : 'true'
                });
                
                // Se temos o número do voo, adiciona como referência
                if (flight.numeroVoo) {
                  latamParams.append('flightNumber', flight.numeroVoo);
                }
                
                const latamUrl = `https://www.latam.com/pt-br/booking/flight?${latamParams.toString()}`;
                console.log('🛫 URL alternativa LATAM:', latamUrl);
                
                // ATIVANDO: Usar diretamente o site da LATAM já que é mais confiável
                console.log('✅ Redirecionando diretamente para site oficial da LATAM');
                fallbackUrl = latamUrl;
              } else if (companhia && companhia.includes('GOL')) {
                console.log('🛫 Preparando redirecionamento para site oficial da GOL');
                
                // URL da GOL com parâmetros de busca
                const golParams = new URLSearchParams({
                  'Origin': origem,
                  'Destination': destino,
                  'DepartureDate': dataIda,
                  'ReturnDate': dataVolta || '',
                  'Adults': adultos.toString(),
                  'Children': '0',
                  'Infants': '0',
                  'CabinType': 'Y',
                  'SearchType': dataVolta ? 'RT' : 'OW'
                });
                
                if (flight.numeroVoo) {
                  golParams.append('FlightNumber', flight.numeroVoo);
                }
                
                const golUrl = `https://www.voegol.com.br/compre?${golParams.toString()}`;
                console.log('🛫 URL oficial GOL:', golUrl);
                console.log('✅ Redirecionando diretamente para site oficial da GOL');
                fallbackUrl = golUrl;
              } else if (companhia && companhia.includes('AZUL')) {
                console.log('🛫 Preparando redirecionamento para site oficial da AZUL');
                
                // URL da Azul com parâmetros de busca
                const azulParams = new URLSearchParams({
                  'trip-type': dataVolta ? 'RT' : 'OW',
                  'from': origem,
                  'to': destino,
                  'departure': dataIda,
                  'return': dataVolta || '',
                  'adults': adultos.toString(),
                  'children': '0',
                  'infants': '0'
                });
                
                if (flight.numeroVoo) {
                  azulParams.append('flight', flight.numeroVoo);
                }
                
                const azulUrl = `https://www.voeazul.com.br/pt-br/booking/flight?${azulParams.toString()}`;
                console.log('🛫 URL oficial AZUL:', azulUrl);
                console.log('✅ Redirecionando diretamente para site oficial da AZUL');
                fallbackUrl = azulUrl;
              }
            }
          } else {
            // Fallback melhorado: Google Flights com informações específicas do voo
            console.log('🔍 Criando busca super específica com todos os dados do voo...');
            
            // Constrói query super específica
            let specificQuery = `${origem} to ${destino} on ${dataIda}`;
            
            // Adiciona informações específicas do voo
            if (flight.numeroVoo) {
              specificQuery += ` flight ${flight.numeroVoo}`;
            }
            if (companhia) {
              specificQuery += ` ${companhia}`;
            }
            if (flight.horarioSaida) {
              const horario = new Date(flight.horarioSaida).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
              specificQuery += ` departure ${horario}`;
            }
            if (flight.priceWithTax || flight.price) {
              const preco = Math.round(flight.priceWithTax || flight.price);
              specificQuery += ` around R$${preco}`;
            }
            
            specificQuery += ` ${adultos} adult${adultos > 1 ? 's' : ''}`;
            
            const googleParams = new URLSearchParams({
              q: specificQuery,
              curr: 'BRL',
              hl: 'pt-BR',
              gl: 'BR'
            });
            
            fallbackUrl = `https://www.google.com/travel/flights?${googleParams.toString()}`;
            console.log('🎯 Busca super específica criada:', specificQuery);
            console.log('⚠️ Usando Google Flights com dados detalhados do voo');
          }
          
          // Log da companhia para referência
          if (companhia && companhia.includes('LATAM')) {
            console.log('🛫 Voo LATAM - redirecionando para Google Flights com busca otimizada');
          } else if (companhia && companhia.includes('GOL')) {
            console.log('🛫 Voo GOL - redirecionando para Google Flights com busca otimizada');
          } else {
            console.log('🛫 Outras companhias - redirecionando para Google Flights');
          }
          
          console.log('🔄 URL de fallback preparada:', fallbackUrl);
          
          // Retorna um objeto com ambas as URLs
          return {
            primary: moblixSpecificUrl,
            fallback: fallbackUrl,
            type: 'specific_with_fallback'
          };
        }
        
      } catch (error) {
        console.warn('⚠️ Erro ao gerar URL específica de booking:', error.message);
      }
      
      return null;
    };
    
    
    // NOVA FUNÇÃO: Valida se uma URL está funcionando
    const validateUrl = async (url) => {
      try {
        // Para URLs externas, não podemos fazer fetch direto devido ao CORS
        // Então vamos verificar apenas se a URL é bem formada
        const urlObj = new URL(url);
        
        // Lista de domínios conhecidos e confiáveis
        const trustedDomains = [
          'latam.com', 'voegol.com.br', 'voeazul.com.br',
          'flytap.com', 'copaair.com', 'aa.com',
          'decolar.com', 'viajanet.com.br', '123milhas.com',
          'maxmilhas.com.br', 'submarinoviagens.com.br',
          'google.com'
        ];
        
        const isDomainTrusted = trustedDomains.some(domain => 
          urlObj.hostname.includes(domain)
        );
        
        if (isDomainTrusted) {
          console.log('✅ URL validada (domínio confiável):', url);
          return { valid: true, reason: 'Domínio confiável' };
        }
        
        console.log('⚠️ URL com domínio não verificado:', url);
        return { valid: false, reason: 'Domínio não confiável' };
        
      } catch (error) {
        console.log('❌ URL inválida:', url, error.message);
        return { valid: false, reason: 'URL malformada' };
      }
    };
    
    // FUNÇÃO MELHORADA: Gera URLs com validação e priorização inteligente
    const generateSmartBookingUrl = async (flight) => {
      console.log('🧠 Iniciando geração inteligente de URL de booking...');
      
      const results = [];
      
      // 1. Tenta URL específica da API Moblix (se disponível)
      const moblixUrl = await generateMoblixBookingUrl(flight);
      if (moblixUrl) {
        const validation = await validateUrl(moblixUrl);
        results.push({
          url: moblixUrl,
          source: 'moblix_api',
          priority: validation.valid ? 1 : 5,
          confidence: validation.valid ? 'HIGH' : 'LOW',
          reason: validation.reason
        });
      }
      
      // 2. Gera URL específica da companhia aérea
      const specificUrl = await generateSpecificFlightUrl(flight);
      if (specificUrl && typeof specificUrl === 'string') {
        const validation = await validateUrl(specificUrl);
        results.push({
          url: specificUrl,
          source: 'airline_specific',
          priority: validation.valid ? 2 : 6,
          confidence: validation.valid ? 'HIGH' : 'MEDIUM',
          reason: validation.reason
        });
      }
      
      // 3. Gera URLs de consolidadoras confiáveis
      const companhia = flight.companhia || flight.Companhia || '';
      const consolidadoras = getRecommendedConsolidators(companhia);
      
      for (const [index, consolidadora] of consolidadoras.entries()) {
        const consUrl = generateConsolidatorUrl(flight, consolidadora);
        if (consUrl) {
          const validation = await validateUrl(consUrl);
          results.push({
            url: consUrl,
            source: `consolidator_${consolidadora.name.toLowerCase()}`,
            priority: validation.valid ? (3 + index) : (7 + index),
            confidence: validation.valid ? 'MEDIUM' : 'LOW',
            reason: validation.reason,
            consolidatorName: consolidadora.name
          });
        }
      }
      
      // 4. Ordena por prioridade e confiança
      results.sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        if (a.confidence !== b.confidence) {
          const confOrder = { 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
          return confOrder[a.confidence] - confOrder[b.confidence];
        }
        return 0;
      });
      
      console.log('🎯 URLs geradas e priorizadas:', results);
      
      // Retorna a melhor opção ou null
      return results.length > 0 ? results[0] : null;
    };
    
    // FUNÇÃO AUXILIAR: Retorna consolidadoras recomendadas por companhia
    const getRecommendedConsolidators = (companhia) => {
      const companhiaUpper = (companhia || '').toUpperCase();
      
      // Priorização baseada na experiência e confiabilidade
      if (companhiaUpper.includes('LATAM')) {
        return [
          { name: 'Decolar', priority: 1 },
          { name: 'ViajaNet', priority: 2 },
          { name: '123milhas', priority: 3 }
        ];
      } else if (companhiaUpper.includes('GOL')) {
        return [
          { name: 'ViajaNet', priority: 1 },
          { name: 'Decolar', priority: 2 },
          { name: 'MaxMilhas', priority: 3 }
        ];
      } else if (companhiaUpper.includes('AZUL')) {
        return [
          { name: '123milhas', priority: 1 },
          { name: 'Decolar', priority: 2 },
          { name: 'ViajaNet', priority: 3 }
        ];
      } else {
        return [
          { name: 'Decolar', priority: 1 },
          { name: 'ViajaNet', priority: 2 },
          { name: '123milhas', priority: 3 },
          { name: 'MaxMilhas', priority: 4 }
        ];
      }
    };
    
    // FUNÇÃO AUXILIAR: Gera URL específica de consolidadora
    const generateConsolidatorUrl = (flight, consolidadora) => {
      const origem = flight.origem || searchParams.value.origem;
      const destino = flight.destino || searchParams.value.destino;
      const dataIda = searchParams.value.ida;
      const dataVolta = searchParams.value.volta;
      const adultos = searchParams.value.adultos || 1;
      const criancas = searchParams.value.criancas || 0;
      const bebes = searchParams.value.bebes || 0;
      const price = flight.priceWithTax || flight.price || 0;
      
      const urlGenerators = {
        'Decolar': () => {
          const params = new URLSearchParams({
            from: origem,
            to: destino,
            departureDate: dataIda,
            adults: adultos.toString(),
            children: criancas.toString(),
            infants: bebes.toString()
          });
          if (dataVolta) params.set('returnDate', dataVolta);
          if (criancas > 0) params.set('children', criancas.toString());
          if (bebes > 0) params.set('infants', bebes.toString());
          if (price > 0) params.set('maxPrice', Math.round(price * 1.15).toString());
          return `https://www.decolar.com/shop/flights?${params.toString()}`;
        },
        'ViajaNet': () => {
          const params = new URLSearchParams({
            origem: origem,
            destino: destino,
            ida: dataIda,
            adultos: adultos.toString()
          });
          if (dataVolta) params.set('volta', dataVolta);
          if (criancas > 0) params.set('criancas', criancas.toString());
          if (bebes > 0) params.set('bebes', bebes.toString());
          if (price > 0) params.set('precoMax', Math.round(price * 1.15).toString());
          return `https://www.viajanet.com.br/passagens-aereas/busca?${params.toString()}`;
        },
        '123milhas': () => {
          const params = new URLSearchParams({
            from: origem,
            to: destino,
            departure: dataIda,
            passengers: `${adultos}ADT`
          });
          if (dataVolta) params.set('return', dataVolta);
          if (price > 0) params.set('maxPrice', Math.round(price * 1.15).toString());
          return `https://www.123milhas.com/passagem-aerea?${params.toString()}`;
        },
        'MaxMilhas': () => {
          const params = new URLSearchParams({
            origem: origem,
            destino: destino,
            saida: dataIda,
            adultos: adultos.toString()
          });
          if (dataVolta) params.set('retorno', dataVolta);
          if (price > 0) params.set('precoMax', Math.round(price * 1.15).toString());
          return `https://www.maxmilhas.com.br/passagens-aereas?${params.toString()}`;
        }
      };
      
      const generator = urlGenerators[consolidadora.name];
      return generator ? generator() : null;
    };
    
    // Gera URL específica para consolidadoras baseada no token
    const generateConsolidatorSpecificUrl = (flight, consolidatorInfo) => {
      if (!consolidatorInfo?.token) return null;
      
      console.log('🏢 Gerando URL de consolidadora com token:', consolidatorInfo.token);
      
      const origem = flight.origem || searchParams.value.origem;
      const destino = flight.destino || searchParams.value.destino;
      const dataIda = searchParams.value.ida;
      const dataVolta = searchParams.value.volta;
      const adultos = searchParams.value.adultos || searchParams.value.Adultos || 1;
      const criancas = searchParams.value.criancas || searchParams.value.Criancas || 0;
      const bebes = searchParams.value.bebes || searchParams.value.Bebes || 0;
      const preco = flight.priceWithTax || flight.price || flight.totalPrice;
      
      // URLs específicas de consolidadoras conhecidas com fallbacks confiáveis
      const consolidadoras = [
        {
          name: 'Decolar',
          priority: 1, // Mais confiável
          baseUrl: 'https://www.decolar.com',
          generateUrl: () => {
            const params = new URLSearchParams({
              from: origem,
              to: destino,
              departureDate: dataIda,
              adults: adultos.toString()
            });
            if (dataVolta) params.set('returnDate', dataVolta);
            if (criancas > 0) params.set('children', criancas.toString());
            if (bebes > 0) params.set('infants', bebes.toString());
            if (preco > 0) params.set('maxPrice', Math.round(preco * 1.15).toString());
            return `https://www.decolar.com/shop/flights?${params.toString()}`;
          }
        },
        {
          name: 'ViajaNet',
          priority: 2,
          baseUrl: 'https://www.viajanet.com.br',
          generateUrl: () => {
            const params = new URLSearchParams({
              origem: origem,
              destino: destino,
              ida: dataIda,
              adultos: adultos.toString(),
              ref_moblix: consolidatorInfo.token
            });
            if (dataVolta) params.set('volta', dataVolta);
            if (preco) params.set('precoMax', Math.round(preco * 1.1).toString());
            return `https://www.viajanet.com.br/passagens-aereas/busca?${params.toString()}`;
          }
        },
        {
          name: '123milhas',
          priority: 3,
          baseUrl: 'https://www.123milhas.com',
          generateUrl: () => {
            const params = new URLSearchParams({
              from: origem,
              to: destino,
              departure: dataIda,
              passengers: `${adultos}ADT`,
              token: consolidatorInfo.token
            });
            if (dataVolta) params.set('return', dataVolta);
            return `https://www.123milhas.com/passagem-aerea?${params.toString()}`;
          }
        },
        {
          name: 'MaxMilhas',
          priority: 4,
          baseUrl: 'https://www.maxmilhas.com.br',
          generateUrl: () => {
            const params = new URLSearchParams({
              origem: origem,
              destino: destino,
              saida: dataIda,
              adultos: adultos.toString(),
              token_partner: consolidatorInfo.token
            });
            if (dataVolta) params.set('retorno', dataVolta);
            return `https://www.maxmilhas.com.br/passagens-aereas?${params.toString()}`;
          }
        },
        {
          name: 'Submarino Viagens',
          priority: 5,
          baseUrl: 'https://www.submarinoviagens.com.br',
          generateUrl: () => {
            return `https://www.submarinoviagens.com.br/passagem-aerea/busca/${origem}/${destino}/${dataIda}?adultos=${adultos}&ref=${consolidatorInfo.token}`;
          }
        }
      ];
      
      // Ordena por prioridade e escolhe a mais confiável
      consolidadoras.sort((a, b) => a.priority - b.priority);
      
      // Tenta usar a mais confiável primeiro (Decolar)
      const consolidadora = consolidadoras[0]; // Sempre pega a de maior prioridade
      const finalUrl = consolidadora.generateUrl();
      
      console.log(`🎯 URL de consolidadora gerada para ${consolidadora.name}:`, finalUrl);
      return finalUrl;
    };
    
    // Gera URL específica da fonte do voo
    const generateSpecificFlightUrl = async (flight) => {
      if (!flight) return null;
      
      console.log('🎯 INICIANDO BUSCA POR URL ESPECÍFICA DO VOO');
      console.log('📊 Dados do voo:', {
        id: flight.id,
        companhia: flight.companhia,
        numeroVoo: flight.numeroVoo,
        preco: flight.priceWithTax || flight.price,
        Token: flight.Token,
        TokenConsulta: flight.TokenConsulta
      });
      
      // PRIORIDADE 1: URLs de booking encontradas diretamente nos dados da API
      const { foundUrls, moblixSpecific } = extractApiSourceData(flight);
      if (foundUrls && foundUrls.length > 0) {
        const bookingUrl = foundUrls.find(urlObj => 
          urlObj.key.toLowerCase().includes('booking') || 
          urlObj.key.toLowerCase().includes('deeplink') ||
          urlObj.key.toLowerCase().includes('reserva') ||
          urlObj.key.toLowerCase().includes('purchase')
        );
        
        if (bookingUrl) {
          console.log('✅ URL ESPECÍFICA DE BOOKING encontrada nos dados:', bookingUrl);
          return bookingUrl.url;
        }
      }
      
      // PRIORIDADE 2: Gerar URL específica de booking via API Moblix
      const moblixBookingUrl = await generateMoblixBookingUrl(flight);
      if (moblixBookingUrl) {
        console.log('✅ URL ESPECÍFICA DE BOOKING gerada via API:', moblixBookingUrl);
        return moblixBookingUrl;
      }
      
      // PRIORIDADE 3: Deep links existentes no objeto
      const existingDeepLink = flight.deepLink || flight.bookingUrl || flight.segments?.[0]?.bookingUrl;
      if (existingDeepLink) {
        console.log('✅ DEEP LINK EXISTENTE encontrado:', existingDeepLink);
        return existingDeepLink;
      }
      
      // PRIORIDADE 4: URLs específicas para consolidadoras se for Reserva Fácil
      if (moblixSpecific?.consolidatorInfo?.isThirdParty) {
        console.log('🏢 Voo de consolidadora detectado, gerando URL específica...');
        const consolidatorUrl = generateConsolidatorSpecificUrl(flight, moblixSpecific.consolidatorInfo);
        if (consolidatorUrl) {
          // Retorna URL da consolidadora, mas o selectFlight vai tratar falhas
          return consolidatorUrl;
        }
      }
      
      const companhia = flight.companhia || flight.Companhia || 
                      flight.segments?.[0]?.legs?.[0]?.operatedBy?.name || 
                      flight.segments?.[0]?.legs?.[0]?.managedBy?.name || 
                      flight.validatingBy?.name;
      
      const origem = flight.origem || searchParams.value.origem;
      const destino = flight.destino || searchParams.value.destino;
      const dataIda = searchParams.value.ida;
      const dataVolta = searchParams.value.volta;
      const adultos = searchParams.value.adultos || searchParams.value.Adultos || 1;
      const criancas = searchParams.value.criancas || searchParams.value.Criancas || 0;
      const bebes = searchParams.value.bebes || searchParams.value.Bebes || 0;
      
      console.log('🔍 Gerando URL específica para:', {
        companhia,
        origem,
        destino,
        dataIda,
        dataVolta,
        preco: flight.priceWithTax || flight.price || flight.totalPrice,
        tokens: extractApiSourceData(flight).tokens
      });
      
      // Formata as datas para diferentes formatos
      const formatDateForUrl = (dateStr, format = 'YYYY-MM-DD') => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (format === 'DDMMYYYY') {
          return date.toLocaleDateString('pt-BR').replace(/\//g, '');
        }
        if (format === 'YYYY-MM-DD') {
          return date.toISOString().split('T')[0];
        }
        return dateStr;
      };
      
      // Extrai dados específicos do voo para URLs mais precisas
      const flightNumber = flight.numeroVoo || flight.segments?.[0]?.legs?.[0]?.flightNumber || '';
      const departureTime = flight.horarioSaida || flight.segments?.[0]?.departureDate || '';
      const arrivalTime = flight.horarioChegada || flight.segments?.[0]?.arrivalDate || '';
      const flightToken = flight.Token || flight.segments?.[0]?.rateToken || flight.rateToken || '';
      const price = flight.priceWithTax || flight.price || flight.totalPrice || 0;
      
      // URLs específicas por companhia com parâmetros de busca detalhados
      switch (companhia?.toUpperCase()) {
        case 'LATAM':
          // URL da LATAM com busca específica ou página de ofertas
          if (flightNumber && flightNumber.includes('LA')) {
            // Tenta ir direto para a página específica do voo LATAM
            const latamDirectUrl = `https://www.latam.com/pt_br/voo/${flightNumber}?origin=${origem}&destination=${destino}&date=${formatDateForUrl(dataIda)}`;
            return latamDirectUrl;
          }
          // Fallback para busca geral com parâmetros
          const latamUrl = new URL('https://www.latam.com/pt_br/ofertas-voos');
          latamUrl.searchParams.set('origin', origem);
          latamUrl.searchParams.set('destination', destino);
          latamUrl.searchParams.set('outboundDate', formatDateForUrl(dataIda));
          if (dataVolta) latamUrl.searchParams.set('inboundDate', formatDateForUrl(dataVolta));
          latamUrl.searchParams.set('adults', adultos.toString());
          latamUrl.searchParams.set('children', criancas.toString());
          latamUrl.searchParams.set('infants', bebes.toString());
          latamUrl.searchParams.set('cabinType', 'Economy');
          if (price > 0) latamUrl.searchParams.set('maxPrice', Math.round(price * 1.1).toString()); // +10% margem
          return latamUrl.toString();
          
        case 'GOL':
        case 'GOL/SMILES':
        case 'SMILES':
          // URL da GOL com parâmetros específicos
          if (flightNumber && (flightNumber.includes('G3') || flightNumber.includes('GF'))) {
            // Página específica do voo GOL
            const golDirectUrl = `https://www.voegol.com.br/pt/voo/${flightNumber}?origem=${origem}&destino=${destino}&data=${formatDateForUrl(dataIda, 'DDMMYYYY')}`;
            return golDirectUrl;
          }
          const golUrl = new URL('https://www.voegol.com.br/pt/ofertas/voos-promocionais');
          golUrl.searchParams.set('origemId', origem);
          golUrl.searchParams.set('destinoId', destino);
          golUrl.searchParams.set('ida', formatDateForUrl(dataIda, 'DDMMYYYY'));
          if (dataVolta) golUrl.searchParams.set('volta', formatDateForUrl(dataVolta, 'DDMMYYYY'));
          golUrl.searchParams.set('adultos', adultos.toString());
          golUrl.searchParams.set('criancas', criancas.toString());
          golUrl.searchParams.set('bebes', bebes.toString());
          if (price > 0) golUrl.searchParams.set('precoMax', Math.round(price * 1.1).toString());
          return golUrl.toString();
          
        case 'AZUL':
        case 'AZUL INTERLINE':
          // URL da Azul com parâmetros específicos
          if (flightNumber && flightNumber.includes('AD')) {
            // Página específica do voo Azul
            const azulDirectUrl = `https://www.voeazul.com.br/voo/${flightNumber}?origem=${origem}&destino=${destino}&data=${formatDateForUrl(dataIda)}`;
            return azulDirectUrl;
          }
          const azulUrl = new URL('https://www.voeazul.com.br/ofertas/passagens-aereas');
          azulUrl.searchParams.set('from', origem);
          azulUrl.searchParams.set('to', destino);
          azulUrl.searchParams.set('departure', formatDateForUrl(dataIda));
          if (dataVolta) azulUrl.searchParams.set('return', formatDateForUrl(dataVolta));
          azulUrl.searchParams.set('adults', adultos.toString());
          azulUrl.searchParams.set('children', criancas.toString());
          azulUrl.searchParams.set('infants', bebes.toString());
          if (price > 0) azulUrl.searchParams.set('maxPrice', Math.round(price * 1.1).toString());
          if (flightNumber) azulUrl.searchParams.set('flightNumber', flightNumber);
          return azulUrl.toString();
          
        case 'TAP':
        case 'TAP AIR PORTUGAL':
          // URL da TAP com parâmetros
          const tapUrl = new URL('https://www.flytap.com/pt-br/reservas/voos');
          tapUrl.searchParams.set('from', origem);
          tapUrl.searchParams.set('to', destino);
          tapUrl.searchParams.set('outbound', formatDateForUrl(dataIda));
          if (dataVolta) tapUrl.searchParams.set('inbound', formatDateForUrl(dataVolta));
          tapUrl.searchParams.set('adults', adultos.toString());
          tapUrl.searchParams.set('children', criancas.toString());
          tapUrl.searchParams.set('infants', bebes.toString());
          return tapUrl.toString();
          
        case 'COPA':
        case 'COPA AIRLINES':
          // URL da Copa Airlines
          const copaUrl = new URL('https://www.copaair.com/pt/web/br/booking');
          copaUrl.searchParams.set('origin', origem);
          copaUrl.searchParams.set('destination', destino);
          copaUrl.searchParams.set('departing', formatDateForUrl(dataIda));
          if (dataVolta) copaUrl.searchParams.set('returning', formatDateForUrl(dataVolta));
          copaUrl.searchParams.set('adults', adultos.toString());
          return copaUrl.toString();
          
        case 'AMERICAN':
        case 'AMERICAN AIRLINES':
          // URL da American Airlines
          const aaUrl = new URL('https://www.aa.com/booking/find-flights');
          aaUrl.searchParams.set('from', origem);
          aaUrl.searchParams.set('to', destino);
          aaUrl.searchParams.set('departDate', formatDateForUrl(dataIda));
          if (dataVolta) aaUrl.searchParams.set('returnDate', formatDateForUrl(dataVolta));
          aaUrl.searchParams.set('adults', adultos.toString());
          aaUrl.searchParams.set('children', criancas.toString());
          return aaUrl.toString();
          
        default:
          // Para consolidadoras ou companhias não mapeadas
          if (flight.TokenConsulta || flight.isReservaFacil) {
            console.log('🏢 Voo via consolidadora/terceirizado detectado');
            
            // URLs de consolidadoras com parâmetros específicos e detalhados
            const consolidadoras = [
              {
                name: 'Decolar',
                url: 'https://www.decolar.com/shop/flights',
                format: (o, d, data, volta) => {
                  const params = new URLSearchParams();
                  params.set('from', o);
                  params.set('to', d);
                  params.set('departureDate', formatDateForUrl(data, 'YYYY-MM-DD'));
                  params.set('adults', adultos.toString());
                  
                  if (volta) {
                    params.set('returnDate', formatDateForUrl(volta, 'YYYY-MM-DD'));
                  }
                  
                  if (criancas > 0) params.set('children', criancas.toString());
                  if (bebes > 0) params.set('infants', bebes.toString());
                  if (price > 0) params.set('maxPrice', Math.round(price * 1.15).toString()); // +15% margem
                  if (companhia) params.set('airline', encodeURIComponent(companhia));
                  
                  return `?${params.toString()}`;
                }
              },
              {
                name: 'ViajaNet',
                url: 'https://www.viajanet.com.br/passagens-aereas/',
                format: (o, d, data, volta) => {
                  let url = `${o.toLowerCase()}-${d.toLowerCase()}?ida=${formatDateForUrl(data)}&adultos=${adultos}`;
                  if (volta) url += `&volta=${formatDateForUrl(volta)}`;
                  if (criancas > 0) url += `&criancas=${criancas}`;
                  if (bebes > 0) url += `&bebes=${bebes}`;
                  if (price > 0) url += `&precoMax=${Math.round(price * 1.15)}`;
                  if (companhia) url += `&companhia=${encodeURIComponent(companhia)}`;
                  return url;
                }
              },
              {
                name: '123milhas',
                url: 'https://www.123milhas.com/v2/pesquisa-passagens/',
                format: (o, d, data, volta) => {
                  let url = `${o}-${d}?data_ida=${formatDateForUrl(data)}&adultos=${adultos}&criancas=${criancas}`;
                  if (volta) url += `&data_volta=${formatDateForUrl(volta)}`;
                  if (price > 0) url += `&preco_max=${Math.round(price * 1.15)}`;
                  if (flightNumber) url += `&numero_voo=${flightNumber}`;
                  return url;
                }
              },
              {
                name: 'MaxMilhas',
                url: 'https://www.maxmilhas.com.br/passagem-aerea/',
                format: (o, d, data, volta) => {
                  let url = `${origem}-${destino}?checkin=${formatDateForUrl(data)}&adults=${adultos}`;
                  if (volta) url += `&checkout=${formatDateForUrl(volta)}`;
                  if (criancas > 0) url += `&children=${criancas}`;
                  if (price > 0) url += `&maxPrice=${Math.round(price * 1.15)}`;
                  return url;
                }
              },
              {
                name: 'Submarino Viagens',
                url: 'https://www.submarinoviagens.com.br/passagem-aerea/',
                format: (o, d, data, volta) => {
                  let url = `busca?origem=${o}&destino=${d}&ida=${formatDateForUrl(data)}&adultos=${adultos}`;
                  if (volta) url += `&volta=${formatDateForUrl(volta)}`;
                  if (criancas > 0) url += `&criancas=${criancas}`;
                  if (price > 0) url += `&precoLimite=${Math.round(price * 1.15)}`;
                  if (companhia) url += `&cia=${encodeURIComponent(companhia)}`;
                  return url;
                }
              }
            ];
            
            // Escolhe uma consolidadora baseada na companhia ou aleatória
            let consolidadora;
            if (companhia && companhia.includes('LATAM')) {
              // Prefere Decolar para LATAM
              consolidadora = consolidadoras.find(c => c.name === 'Decolar') || consolidadoras[0];
            } else if (companhia && companhia.includes('GOL')) {
              // Prefere ViajaNet para GOL
              consolidadora = consolidadoras.find(c => c.name === 'ViajaNet') || consolidadoras[1];
            } else {
              // Escolha aleatória para outras companhias
              consolidadora = consolidadoras[Math.floor(Math.random() * consolidadoras.length)];
            }
            
            const finalUrl = consolidadora.url + consolidadora.format(origem, destino, dataIda, dataVolta);
            console.log(`🎯 Redirecionando para ${consolidadora.name}:`, finalUrl);
            return finalUrl;
          }
          
          // Fallback: Google Flights com parâmetros específicos
          const googleUrl = new URL('https://www.google.com/travel/flights');
          googleUrl.searchParams.set('q', `Flights from ${origem} to ${destino} on ${formatDateForUrl(dataIda)}`);
          googleUrl.searchParams.set('curr', 'BRL');
          googleUrl.searchParams.set('hl', 'pt');
          return googleUrl.toString();
      }
    };
    
    // Função para obter informações da fonte do voo para a UI
    const getFlightSourceInfo = (flight) => {
      try {
        const { likelySource, moblixSpecific, tokens } = extractApiSourceData(flight);
        const companhia = flight.companhia || flight.Companhia || 'Companhia Aérea';
        
        // Se temos uma fonte identificada com alta confiança
        if (likelySource && likelySource.confidence === 'HIGH') {
          const sourceName = likelySource.source.value.toString();
          
          if (sourceName.includes('http')) {
            return {
              prefix: '🎯 Link direto',
              sourceName: companhia + ' (URL específica)',
              cssClass: 'text-green-600 font-semibold',
              message: 'Você será direcionado para a página exata de compra',
              messageClass: 'text-green-600'
            };
          }
        }
        
        // Se é operado pela Livelo (não apenas vendido)
        if (flight.CiaParceira?.Nome === 'Livelo' ||
            flight.CiaParceira?.Iata === 'LV' ||
            flight.numeroVoo?.includes('LV') ||
            flight.FlightCode?.includes('LV')) {
          return {
            prefix: '✈️ Operado por',
            sourceName: 'Livelo',
            cssClass: 'text-purple-600 font-semibold',
            message: 'Voo operado pela Livelo',
            messageClass: 'text-purple-600'
          };
        }
        
        // Se é uma consolidadora (Reserva Fácil)
        if (moblixSpecific?.consolidatorInfo?.isThirdParty) {
          return {
            prefix: '🏢 Disponível em',
            sourceName: 'Consolidadoras confiáveis',
            cssClass: 'text-blue-600',
            message: 'Redirecionará para site parceiro com este preço',
            messageClass: 'text-blue-600'
          };
        }
        
        // Se é voo direto da companhia
        if (moblixSpecific?.directCarrierInfo?.isDirect) {
          return {
            prefix: '✈️ Site oficial',
            sourceName: companhia,
            cssClass: 'text-purple-600 font-semibold',
            message: 'Busca otimizada no site da companhia aérea',
            messageClass: 'text-purple-600'
          };
        }
        
        // Se tem token de consulta
        if (tokens?.tokenConsulta) {
          return {
            prefix: '🔗 Fonte identificada',
            sourceName: companhia + ' via API',
            cssClass: 'text-indigo-600',
            message: 'Link específico baseado nos dados do voo',
            messageClass: 'text-indigo-600'
          };
        }
        
        // Fallback padrão
        return {
          prefix: '🌐 Redireciona para',
          sourceName: companhia || 'Site de busca',
          cssClass: 'text-gray-600',
          message: 'Busca otimizada com dados do voo selecionado',
          messageClass: 'text-gray-500'
        };
        
      } catch (error) {
        console.warn('Erro ao obter info da fonte:', error);
        return {
          prefix: '🌐 Redireciona para',
          sourceName: flight.companhia || 'Site oficial',
          cssClass: 'text-gray-600',
          message: 'Busca com dados do voo',
          messageClass: 'text-gray-500'
        };
      }
    };
    
    // Seleciona um voo e redireciona para a fonte específica
    const selectFlight = async (flight) => {
      console.log('✈️ Voo selecionado:', flight);
      
      // Mostra loading enquanto processa
      const loadingToast = toast.info('🔄 Buscando melhor fonte para este voo...', { duration: 0 });
      
      try {
        // Gera a URL específica com parâmetros do voo (agora assíncrono)
        const specificUrl = await generateSpecificFlightUrl(flight);
        
        // Remove o toast de loading
        loadingToast.clear?.();
        
        if (specificUrl) {
          const companhia = flight.companhia || flight.Companhia || 'companhia aérea';
          const preco = flight.priceWithTax || flight.price || flight.totalPrice;
          const precoFormatado = flight.isMiles ? formatMiles(preco) : formatCurrency(preco);
          
          console.log('🌐 Resposta da geração de URL:', specificUrl);
          
          // Verifica se retornou um objeto com primary/fallback ou uma URL direta
          let finalUrl, sourceType, urlInfo;
          
          if (typeof specificUrl === 'object' && specificUrl.type === 'specific_with_fallback') {
            // Caso com primary URL (Moblix) e fallback
            console.log('🔄 URL com fallback detectada');
            console.log('🎯 URL primária (Moblix):', specificUrl.primary);
            console.log('🔄 URL de fallback:', specificUrl.fallback);
            
            // Como sabemos que a URL da Moblix não funciona (DNS_PROBE_FINISHED_NXDOMAIN),
            // vamos usar diretamente o fallback
            finalUrl = specificUrl.fallback;
            sourceType = '🏢 CONSOLIDADORA CONFIÁVEL (fallback automático)';
            urlInfo = {
              attempted: specificUrl.primary,
              used: specificUrl.fallback,
              reason: 'Domínio da Moblix inacessível'
            };
            
            toast.info('⚠️ URL principal inacessível, usando alternativa confiável', { duration: 3000 });
          } else {
            // URL direta (string)
            finalUrl = specificUrl;
            
            const isSpecificBooking = finalUrl.includes('booking') || 
                                     finalUrl.includes('reserva') || 
                                     finalUrl.includes('moblix') ||
                                     finalUrl.includes('token=');
            
            const isConsolidator = finalUrl.includes('decolar.com') || 
                                  finalUrl.includes('viajanet.com') || 
                                  finalUrl.includes('123milhas.com') ||
                                  finalUrl.includes('maxmilhas.com') ||
                                  finalUrl.includes('google.com/travel');
            
            if (isSpecificBooking) {
              sourceType = '✅ PÁGINA ESPECÍFICA DE COMPRA';
            } else if (isConsolidator) {
              sourceType = '🏢 CONSOLIDADORA (com dados do voo)';
            } else {
              sourceType = '🌐 Site da companhia';
            }
            
            urlInfo = { url: finalUrl };
          }
          
          console.log('🌐 URL final selecionada:', finalUrl);
          
          // Mostra informações detalhadas do redirecionamento
          toast.success(`${sourceType} - ${companhia} - ${precoFormatado}`);
          
          // Log adicional para o usuário entender o que aconteceu
          if (sourceType.includes('ESPECÍFICA')) {
            console.log('✅ SUCESSO: URL específica de booking encontrada!');
            console.log('💳 O usuário será direcionado para a página exata de compra deste voo');
          } else {
            console.log('⚠️ AVISO: Usando URL alternativa confiável');
            console.log('🔄 URL otimizada com parâmetros do voo');
          }
          
          // Log detalhado para debugging
          console.log('📄 Detalhes do redirecionamento:', {
            companhia,
            preco: precoFormatado,
            origem: flight.origem || searchParams.value.origem,
            destino: flight.destino || searchParams.value.destino,
            dataIda: searchParams.value.ida,
            urlOriginal: specificUrl,
            urlFinal: finalUrl,
            sourceType: sourceType,
            urlInfo: urlInfo,
            tokens: extractApiSourceData(flight).tokens
          });
          
          // Aguarda um momento para mostrar a mensagem, depois redireciona
          setTimeout(() => {
            // Abre em nova aba para não perder a busca atual
            const newWindow = window.open(finalUrl, '_blank', 'noopener,noreferrer');
            
            // Verifica se o popup foi bloqueado
            if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
              console.log('⚠️ Pop-up bloqueado, abrindo na mesma aba...');
              
              // Mostra aviso e redireciona automaticamente
              toast.info('🚀 Pop-up bloqueado! Redirecionando automaticamente...', {
                duration: 3000,
                action: {
                  text: '🛫 IR AGORA',
                  onClick: () => {
                    window.location.href = finalUrl;
                  }
                }
              });
              
              // Redireciona automaticamente após 2 segundos
              setTimeout(() => {
                console.log('🔄 Redirecionando automaticamente para:', finalUrl);
                window.location.href = finalUrl;
              }, 2000);
              
              // Também oferece opção de copiar URL como backup
              setTimeout(() => {
                toast.success('📋 Ou copie a URL se preferir abrir manualmente:', {
                  duration: 8000,
                  action: {
                    text: '📋 Copiar URL',
                    onClick: () => {
                      navigator.clipboard.writeText(finalUrl).then(() => {
                        toast.success('✅ URL copiada com sucesso!');
                      }).catch(() => {
                        console.log('URL para copiar:', finalUrl);
                        toast.info('URL disponível no console');
                      });
                    }
                  }
                });
              }, 500);
            } else {
              // Pop-up abriu com sucesso
              setTimeout(() => {
                toast.success('✅ Página de compra aberta em nova aba!');
              }, 1000);
            }
          }, 1500);
        } else {
          console.warn('⚠️ Não foi possível gerar URL específica do voo');
          toast.error('❌ Não foi possível acessar a fonte deste voo. Tente buscar diretamente no site da companhia aérea.');
        }
      } catch (error) {
        // Remove o toast de loading em caso de erro
        loadingToast.clear?.();
        console.error('❌ Erro ao processar seleção do voo:', error);
        toast.error(`❌ Erro ao processar: ${error.message}`);
      }
    };
    
    
    // Função para calcular duração total dos segmentos
    const getTotalDuration = (segments) => {
      if (!segments || !Array.isArray(segments) || segments.length === 0) {
        return '--';
      }
      
      let totalMinutes = 0;
      
      segments.forEach(segment => {
        if (segment && segment.duration) {
          // Converte a duração em formato "2h 30m" ou "150" para minutos
          const duration = segment.duration;
          
          if (typeof duration === 'string') {
            // Formato "2h 30m" ou "2h" ou "30m"
            const hoursMatch = duration.match(/(\d+)h/);
            const minutesMatch = duration.match(/(\d+)m/);
            
            const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
            const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
            
            totalMinutes += (hours * 60) + minutes;
          } else if (typeof duration === 'number') {
            // Duração já em minutos
            totalMinutes += duration;
          }
        }
      });
      
      if (totalMinutes === 0) {
        return '--';
      }
      
      // Converte de volta para formato "Xh Ym"
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      
      if (hours > 0 && minutes > 0) {
        return `${hours}h ${minutes}m`;
      } else if (hours > 0) {
        return `${hours}h`;
      } else {
        return `${minutes}m`;
      }
    };
    
    // Função para calcular preço proporcional de cada segmento
    const getSegmentPrice = (flight, segment) => {
      if (!flight || !segment) {
        return 0;
      }
      
      // Obtém o preço total do voo
      const totalPrice = flight.priceWithTax || flight.price || flight.totalPrice || 0;
      
      if (totalPrice === 0) {
        return 0;
      }
      
      // Obtém todos os segmentos do voo
      const segments = flight.segments || [];
      
      if (segments.length === 0) {
        return totalPrice; // Se não há segmentos, retorna o preço total
      }
      
      if (segments.length === 1) {
        return totalPrice; // Se só há um segmento, retorna o preço total
      }
      
      // Calcula a duração total de todos os segmentos
      let totalDurationMinutes = 0;
      let segmentDurationMinutes = 0;
      
      segments.forEach(seg => {
        if (seg && seg.duration) {
          const duration = seg.duration;
          let minutes = 0;
          
          if (typeof duration === 'string') {
            // Formato "2h 30m" ou "2h" ou "30m"
            const hoursMatch = duration.match(/(\d+)h/);
            const minutesMatch = duration.match(/(\d+)m/);
            
            const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
            const mins = minutesMatch ? parseInt(minutesMatch[1]) : 0;
            
            minutes = (hours * 60) + mins;
          } else if (typeof duration === 'number') {
            // Duração já em minutos
            minutes = duration;
          }
          
          totalDurationMinutes += minutes;
          
          // Se este é o segmento atual, salva sua duração
          if (seg === segment) {
            segmentDurationMinutes = minutes;
          }
        }
      });
      
      // Se não conseguiu calcular durações, divide igualmente
      if (totalDurationMinutes === 0) {
        return totalPrice / segments.length;
      }
      
      // Calcula o preço proporcional baseado na duração
      const proportionalPrice = (segmentDurationMinutes / totalDurationMinutes) * totalPrice;
      
      return Math.round(proportionalPrice * 100) / 100; // Arredonda para 2 casas decimais
    };
    
    
    return {
      // Estados
      isLoading,
      today,
      searchType,
      searchParams,
      searchResults,
      
      // Funções de busca
      searchFlights,
      handleFormSubmit,
      
      // Funções de formatação
      formatCurrency,
      formatMiles,
      formatFlightType,
      formatTime,
      formatDuration,
      getDisplayAirlineName,
      detectAirlineFromFlightCode,
      corrigirCodigoAeroporto,
      getTotalDuration,
      getSegmentPrice,
      parseDurationToMinutes,
      
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
      handleBlur,
      
      // Outras funções
      selectFlight,
      getFlightSourceInfo,
      getCompanyCountSummary,
      
      // Funções de teste
      testFunction,
      testWithWorkingParams
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
