<template>
  <BaseModal @close="$emit('close')" @submit="handleSubmit">
    <template #title>Transferir Milhas</template>
    
    <template #content>
      <div class="space-y-4">
        <div>
          <label for="originProgram" class="block text-sm font-medium text-gray-700">Origem</label>
          <select
            id="originProgram"
            v-model="form.originProgramId"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option v-for="program in loyaltyPrograms" :key="program.id" :value="program.id">
              {{ program.name }} ({{ program.miles }} milhas)
            </option>
          </select>
        </div>
        
        <div>
          <label for="destinationType" class="block text-sm font-medium text-gray-700">Tipo de Destino</label>
          <select
            id="destinationType"
            v-model="form.destinationType"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="program">Outro Programa</option>
            <option value="client">Cliente</option>
            <option value="external">Conta Externa</option>
          </select>
        </div>
        
        <div v-if="form.destinationType === 'program'">
          <label for="destinationProgram" class="block text-sm font-medium text-gray-700">Programa de Destino</label>
          <select
            id="destinationProgram"
            v-model="form.destinationProgramId"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option v-for="program in destinationPrograms" :key="program.id" :value="program.id">
              {{ program.name }}
            </option>
          </select>
        </div>
        
        <div v-else-if="form.destinationType === 'client'">
          <label for="clientSearch" class="block text-sm font-medium text-gray-700">Cliente</label>
          <div class="mt-1 relative">
            <input
              id="clientSearch"
              v-model="clientSearch"
              type="text"
              class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Buscar cliente..."
              @input="searchClients"
            />
            <ul v-if="filteredClients.length > 0" class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              <li 
                v-for="client in filteredClients" 
                :key="client.id"
                class="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-blue-100"
                @click="selectClient(client)"
              >
                <div class="flex items-center">
                  <span class="font-normal ml-3 block truncate">{{ client.name }}</span>
                  <span class="ml-2 text-xs text-gray-500">{{ client.email }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div v-else>
          <label for="externalAccount" class="block text-sm font-medium text-gray-700">Conta Externa</label>
          <input
            id="externalAccount"
            v-model="form.externalAccount"
            type="text"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Número da conta ou e-mail"
          />
        </div>
        
        <div>
          <label for="amount" class="block text-sm font-medium text-gray-700">Quantidade de Milhas</label>
          <div class="mt-1 relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500 sm:text-sm">✈️</span>
            </div>
            <input
              id="amount"
              v-model.number="form.amount"
              type="number"
              min="1000"
              step="1000"
              class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0"
            />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span class="text-gray-500 sm:text-sm" id="price-currency">milhas</span>
            </div>
          </div>
          <p class="mt-1 text-sm text-gray-500">Mínimo: 1.000 milhas</p>
        </div>
        
        <div>
          <label for="notes" class="block text-sm font-medium text-gray-700">Observações (Opcional)</label>
          <textarea
            id="notes"
            v-model="form.notes"
            rows="3"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Alguma informação adicional sobre esta transferência..."
          ></textarea>
        </div>
        
        <div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md mt-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-blue-700">
                Taxa de transferência: <span class="font-medium">0%</span> para este mês.
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <template #footer>
      <button 
        type="button" 
        @click="$emit('close')"
        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
      >
        Cancelar
      </button>
      <button 
        type="button" 
        @click="handleSubmit"
        :disabled="!isFormValid || isSubmitting"
        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ isSubmitting ? 'Processando...' : 'Confirmar Transferência' }}
      </button>
    </template>
  </BaseModal>
</template>

<script>
import BaseModal from './BaseModal.vue';

export default {
  name: 'TransferModal',
  components: {
    BaseModal
  },
  emits: ['close', 'submit'],
  data() {
    return {
      isSubmitting: false,
      clientSearch: '',
      form: {
        originProgramId: 1,
        destinationType: 'program',
        destinationProgramId: 2,
        clientId: null,
        externalAccount: '',
        amount: 1000,
        notes: ''
      },
      clients: [
        { id: 1, name: 'João Silva', email: 'joao@exemplo.com' },
        { id: 2, name: 'Maria Santos', email: 'maria@exemplo.com' },
        { id: 3, name: 'Carlos Oliveira', email: 'carlos@exemplo.com' },
      ],
      filteredClients: [],
      loyaltyPrograms: [
        { id: 1, name: 'LATAM Fidelidade', miles: '25,000' },
        { id: 2, name: 'Smiles', miles: '18,500' },
        { id: 3, name: 'TudoAzul', miles: '32,100' },
        { id: 4, name: 'Azul Fidelidade', miles: '14,200' }
      ]
    };
  },
  computed: {
    isFormValid() {
      if (this.form.amount < 1000) return false;
      
      if (this.form.destinationType === 'program') {
        return this.form.originProgramId && this.form.destinationProgramId && this.form.originProgramId !== this.form.destinationProgramId;
      } else if (this.form.destinationType === 'client') {
        return this.form.clientId !== null;
      } else if (this.form.destinationType === 'external') {
        return this.form.externalAccount.trim() !== '';
      }
      
      return false;
    },
    destinationPrograms() {
      return this.loyaltyPrograms.filter(program => program.id !== this.form.originProgramId);
    }
  },
  watch: {
    'form.destinationType'() {
      // Reset destination values when type changes
      this.form.destinationProgramId = null;
      this.form.clientId = null;
      this.form.externalAccount = '';
      
      // Set default program if switching to program type
      if (this.form.destinationType === 'program' && this.destinationPrograms.length > 0) {
        this.form.destinationProgramId = this.destinationPrograms[0].id;
      }
    },
    'form.originProgramId'(newVal, oldVal) {
      // If the origin program was the same as the destination, update destination
      if (newVal === this.form.destinationProgramId) {
        const otherProgram = this.destinationPrograms.find(p => p.id !== newVal);
        if (otherProgram) {
          this.form.destinationProgramId = otherProgram.id;
        } else {
          this.form.destinationProgramId = null;
        }
      }
    }
  },
  created() {
    // Set initial values
    if (this.loyaltyPrograms.length >= 2) {
      this.form.originProgramId = this.loyaltyPrograms[0].id;
      this.form.destinationProgramId = this.loyaltyPrograms[1].id;
    }
    this.filteredClients = [...this.clients];
  },
  methods: {
    searchClients() {
      if (!this.clientSearch.trim()) {
        this.filteredClients = [...this.clients];
        return;
      }
      
      const searchTerm = this.clientSearch.toLowerCase();
      this.filteredClients = this.clients.filter(
        client => 
          client.name.toLowerCase().includes(searchTerm) || 
          client.email.toLowerCase().includes(searchTerm)
      );
    },
    selectClient(client) {
      this.form.clientId = client.id;
      this.clientSearch = client.name;
      this.filteredClients = [];
    },
    async handleSubmit() {
      if (!this.isFormValid || this.isSubmitting) return;
      
      this.isSubmitting = true;
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Emit the submit event with form data
        this.$emit('submit', { ...this.form });
        
        // Close the modal
        this.$emit('close');
      } catch (error) {
        console.error('Erro ao processar transferência:', error);
        // Aqui você pode adicionar lógica para exibir mensagens de erro
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>
