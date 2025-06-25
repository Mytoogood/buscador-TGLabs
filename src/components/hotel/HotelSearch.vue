<template>
  <div class="hotel-search">
    <div class="relative">
      <div class="flex items-center justify-between mb-1">
        <label for="hotel-location" class="block text-sm font-medium text-gray-700">
          Localização do Hotel <span class="text-xs text-gray-500 font-normal">(opcional)</span>
        </label>
      </div>
      <div class="relative">
        <input
          id="hotel-location"
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          class="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 text-base focus:ring-blue-500 focus:border-blue-500 bg-white"
          :class="{ 'text-gray-900': !isInputFocused && !searchQuery, 'text-gray-900': isInputFocused || searchQuery }"
          :placeholder="isInputFocused ? 'Digite o nome da cidade ou hotel (opcional)' : ''"
          style="color: #111827;"
          @input="onSearchInput"
          @focus="onInputFocus"
          @blur="onInputBlur"
          @keydown.down.prevent="navigateSuggestions('down')"
          @keydown.up.prevent="navigateSuggestions('up')"
          @keydown.enter.prevent="selectCurrentSuggestion"
          @keydown.esc="closeSuggestions"
          aria-haspopup="listbox"
          :aria-expanded="showSuggestions"
          aria-autocomplete="list"
          aria-controls="suggestions-list"
          :aria-activedescendant="focusedSuggestionIndex >= 0 ? `suggestion-${focusedSuggestionIndex}` : null"
        />
        <div v-if="isLoading" class="absolute inset-y-0 right-0 flex items-center pr-3">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        </div>
      </div>

      <!-- Lista de sugestões -->
      <ul
        v-if="showSuggestions && suggestions.length > 0"
        id="suggestions-list"
        class="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-60"
        tabindex="-1"
        role="listbox"
        aria-labelledby="hotel-location"
      >
        <li
          v-for="(suggestion, index) in suggestions"
          :key="suggestion.CityId || index"
          :id="`suggestion-${index}`"
          class="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-blue-100"
          :class="{ 'bg-blue-100': index === focusedSuggestionIndex }"
          role="option"
          @mousedown="selectSuggestion(suggestion)"
          @mouseenter="focusedSuggestionIndex = index"
        >
          <div class="flex items-center">
            <span class="block truncate font-medium">
              {{ suggestion.Label }}
            </span>
          </div>
          <span v-if="index === focusedSuggestionIndex" class="absolute inset-y-0 right-0 flex items-center pr-4">
            <svg class="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </span>
        </li>
      </ul>
      <div v-else-if="showSuggestions && searchQuery && !isLoading" class="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-2 px-3 text-sm text-gray-500">
        Nenhum local encontrado para "{{ searchQuery }}"
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onUnmounted, onMounted } from 'vue';
import { debounce } from 'lodash';
import moblixApiService from '@/services/moblixApiService';

export default {
  name: 'HotelSearch',
  
  emits: ['select-location'],
  
  setup(props, { emit }) {
    const searchQuery = ref('');
    const typingPreview = ref('');
    const suggestions = ref([]);
    const isLoading = ref(false);
    const showSuggestions = ref(false);
    const focusedSuggestionIndex = ref(-1);
    const isInputFocused = ref(false);
    const searchInput = ref(null);
    const typingTexts = [
      'Rio de Janeiro, Brasil',
      'São Paulo, Brasil',
      'Salvador, Bahia',
      'Fortaleza, Ceará',
      'Florianópolis, Santa Catarina'
    ];
    let currentTypingIndex = 0;
    let typingInterval;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100; // Velocidade de digitação em ms
    let pauseEnd = 0; // Tempo de pausa no final
    let pauseStart = 0; // Tempo de pausa no início
    let isPaused = false; // Se está em pausa

    // Efeito de digitação
    const typeEffect = () => {
      if (isInputFocused.value || searchQuery.value) {
        return; // Não executar se o input estiver com foco ou já tiver texto
      }

      const currentText = typingTexts[currentTypingIndex];
      
      if (isDeleting) {
        // Apagando texto
        charIndex--;
        searchQuery.value = currentText.substring(0, charIndex);
        typingSpeed = 30; // Velocidade mais rápida para apagar
      } else {
        // Escrevendo texto
        searchQuery.value = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100; // Velocidade normal de digitação
      }

      // Verifica se terminou de escrever
      if (!isDeleting && charIndex === currentText.length) {
        // Pausa no final do texto
        if (pauseEnd === 0) {
          pauseEnd = Date.now();
          typingSpeed = 1000; // Pausa de 1 segundo
        } else if ((Date.now() - pauseEnd) > 1000) {
          isDeleting = true;
          pauseEnd = 0;
        }
      } else if (isDeleting && charIndex === 0) {
        // Terminou de apagar, vai para o próximo texto
        isDeleting = false;
        currentTypingIndex = (currentTypingIndex + 1) % typingTexts.length;
        pauseStart = Date.now();
        isPaused = true;
        typingSpeed = 500; // Pausa antes de começar a digitar o próximo
      } else if (isPaused && (Date.now() - pauseStart) > 500) {
        // Terminou a pausa no início
        isPaused = false;
        pauseStart = 0;
      }

      // Se não estiver em pausa, agenda o próximo ciclo
      if (!isPaused || (isPaused && (Date.now() - pauseStart) > 500)) {
        clearTimeout(typingInterval);
        typingInterval = setTimeout(typeEffect, typingSpeed);
      }
    };

    // Inicia o efeito de digitação quando o componente é montado
    onMounted(() => {
      // Pequeno atraso para garantir que o DOM foi renderizado
      setTimeout(() => {
        typeEffect();
      }, 1000);
    });

    // Limpa o intervalo quando o componente é desmontado
    onUnmounted(() => {
      clearTimeout(typingInterval);
    });
    
    // Debounce a busca para evitar muitas requisições
    const searchLocations = debounce(async (query) => {
      if (!query) {
        suggestions.value = [];
        return;
      }
      
      isLoading.value = true;
      try {
        const results = await moblixApiService.buscarLocalizacaoHoteis(query);
        console.log('Resultados da busca de localização:', results);
        
        // Verifica se os resultados são válidos e mapeia para o formato esperado
        const formattedResults = Array.isArray(results) 
          ? results.map(item => ({
              ...item,
              // Garante que temos pelo menos um ID de cidade válido
              CityId: item.CityId || (item.LocationDetails && item.LocationDetails.CityId) || item.id || null,
              // Garante que temos um label para exibição
              Label: item.Label || item.label || item.name || 'Local desconhecido',
              // Mantém os detalhes da localização se existirem
              LocationDetails: item.LocationDetails || {
                CityId: item.CityId || item.id || null,
                CityName: item.CityName || item.city || '',
                CountryCode: item.CountryCode || item.countryCode || 'BR',
                CountryName: item.CountryName || item.country || 'Brasil',
                Type: item.Type || item.type || 'City'
              }
            }))
          : [];
          
        console.log('Sugestões formatadas:', formattedResults);
        suggestions.value = formattedResults;
      } catch (error) {
        console.error('Erro ao buscar localizações:', error);
        suggestions.value = [];
      } finally {
        isLoading.value = false;
      }
    }, 200); // Reduzido o tempo de debounce para uma resposta mais rápida
    
    // Função para formatar o texto, permitindo apenas letras, espaços e alguns caracteres especiais
    const formatText = (text) => {
      // Remove números e caracteres não permitidos, mantendo letras, espaços, acentos e alguns caracteres especiais
      return text.replace(/[^\p{L}\s'-]/gu, '');
    };

    const onSearchInput = (event) => {
      // Aplica a formatação ao texto
      const formattedText = formatText(event.target.value);
      searchQuery.value = formattedText;
      
      const query = formattedText.trim();
      
      // Mostra sugestões imediatamente quando o usuário começa a digitar
      showSuggestions.value = true;
      
      if (query.length >= 1) {  // Reduzido de 2 para 1 para mostrar sugestões mais cedo
        searchLocations(query);
      } else {
        suggestions.value = [];
        showSuggestions.value = false;
      }
    };
    
    const onInputFocus = () => {
      isInputFocused.value = true;
      showSuggestions.value = true;
      // Limpa o efeito de digitação quando o input recebe foco
      clearTimeout(typingInterval);
      // Foca no input quando o placeholder é clicado
      if (searchInput.value) {
        searchInput.value.focus();
      }
      // Aplica a formatação ao texto atual ao receber foco
      if (searchQuery.value) {
        searchQuery.value = formatText(searchQuery.value);
        // Busca sugestões mesmo com texto curto quando o input recebe foco
        if (searchQuery.value.length >= 1) {
          searchLocations(searchQuery.value);
        }
      } else {
        // Se o input estiver vazio, mostra sugestões recentes ou vazio
        showSuggestions.value = true;
      }
    };
    
    const onInputBlur = () => {
      isInputFocused.value = false;
      // Pequeno atraso para permitir o clique em uma sugestão
      setTimeout(() => {
        if (!isInputFocused.value) {
          closeSuggestions();
          // Se o campo estiver vazio, recomeça o efeito de digitação
          if (!searchQuery.value) {
            currentTypingIndex = 0;
            charIndex = 0;
            isDeleting = false;
            typeEffect();
          }
        }
      }, 200);
    };
    
    const selectSuggestion = (suggestion) => {
      searchQuery.value = suggestion.Label;
      emit('select-location', suggestion);
      closeSuggestions();
    };
    
    const selectCurrentSuggestion = () => {
      if (focusedSuggestionIndex.value >= 0 && focusedSuggestionIndex.value < suggestions.value.length) {
        selectSuggestion(suggestions.value[focusedSuggestionIndex.value]);
      }
    };
    
    const navigateSuggestions = (direction) => {
      if (!showSuggestions.value || suggestions.value.length === 0) return;
      
      if (direction === 'down') {
        focusedSuggestionIndex.value = 
          focusedSuggestionIndex.value < suggestions.value.length - 1 
            ? focusedSuggestionIndex.value + 1 
            : 0;
      } else if (direction === 'up') {
        focusedSuggestionIndex.value = 
          focusedSuggestionIndex.value > 0 
            ? focusedSuggestionIndex.value - 1 
            : suggestions.value.length - 1;
      }
      
      // Rolagem automática para o item focado
      const focusedElement = document.getElementById(`suggestion-${focusedSuggestionIndex.value}`);
      if (focusedElement) {
        focusedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    };
    
    const closeSuggestions = () => {
      showSuggestions.value = false;
      focusedSuggestionIndex.value = -1;
    };
    
    // Limpar o debounce quando o componente for desmontado
    onUnmounted(() => {
      searchLocations.cancel();
      clearTimeout(typingInterval);
    });
    
    return {
      searchQuery,
      typingPreview,
      searchInput,
      suggestions,
      isLoading,
      showSuggestions,
      focusedSuggestionIndex,
      onSearchInput,
      onInputFocus,
      onInputBlur,
      selectSuggestion,
      selectCurrentSuggestion,
      navigateSuggestions,
      closeSuggestions,
    };
  },
};
</script>

<style scoped>
.hotel-search {
  position: relative;
  width: 100%;
}

/* Efeito de cursor piscante */
.text-gray-900::after {
  content: '|';
  animation: blink 1s step-end infinite;
  margin-left: 2px;
  color: #111827;
}

@keyframes blink {
  from, to { opacity: 1; }
  50% { opacity: 0; }
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
