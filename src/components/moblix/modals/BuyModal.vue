<template>
  <BaseModal @close="$emit('close')" @submit="handleSubmit">
    <template #title>Comprar Milhas</template>
    
    <template #content>
      <div class="space-y-4">
        <div>
          <label for="program" class="block text-sm font-medium text-gray-700">Programa de Fidelidade</label>
          <select
            id="program"
            v-model="form.programId"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option v-for="program in loyaltyPrograms" :key="program.id" :value="program.id">
              {{ program.name }}
            </option>
          </select>
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
              @input="calculateTotal"
            />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span class="text-gray-500 sm:text-sm" id="price-currency">milhas</span>
            </div>
          </div>
          <p class="mt-1 text-sm text-gray-500">Mínimo: 1.000 milhas</p>
          
          <div class="mt-2 grid grid-cols-4 gap-2">
            <button 
              v-for="suggestion in amountSuggestions" 
              :key="suggestion"
              @click="setAmount(suggestion)"
              class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
              :class="{ 'bg-blue-50 border-blue-500': form.amount === suggestion }"
            >
              {{ formatNumber(suggestion) }}
            </button>
          </div>
        </div>
        
        <div class="pt-2 border-t border-gray-200">
          <div class="flex justify-between py-1">
            <span class="text-sm text-gray-600">Valor por milheiro:</span>
            <span class="text-sm font-medium">R$ {{ (selectedProgram.price / 1000).toFixed(4) }}</span>
          </div>
          <div class="flex justify-between py-1">
            <span class="text-sm text-gray-600">Bônus:</span>
            <span class="text-sm font-medium text-green-600">+{{ selectedProgram.bonus }}% ({{ formatNumber(bonusMiles) }} milhas)</span>
          </div>
          <div class="flex justify-between py-1 font-medium">
            <span class="text-sm">Total de milhas:</span>
            <span class="text-blue-600">{{ formatNumber(totalMiles) }} milhas</span>
          </div>
          <div class="flex justify-between py-1 border-t border-gray-200 mt-2 pt-2">
            <span class="text-base font-semibold">Valor total:</span>
            <span class="text-xl font-bold text-blue-700">R$ {{ formatCurrency(totalPrice) }}</span>
          </div>
        </div>
        
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mt-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700">
                As milhas adquiridas têm validade de 12 meses a partir da data da compra.
              </p>
            </div>
          </div>
        </div>
        
        <div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-blue-700">
                O crédito das milhas pode levar até 72 horas úteis após a confirmação do pagamento.
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
        {{ isSubmitting ? 'Processando...' : 'Ir para Pagamento' }}
      </button>
    </template>
  </BaseModal>
</template>

<script>
import BaseModal from './BaseModal.vue';

export default {
  name: 'BuyModal',
  components: {
    BaseModal
  },
  emits: ['close', 'submit'],
  data() {
    return {
      isSubmitting: false,
      form: {
        programId: 1,
        amount: 1000
      },
      loyaltyPrograms: [
        { id: 1, name: 'LATAM Fidelidade', price: 70.00, bonus: 100 },
        { id: 2, name: 'Smiles', price: 65.00, bonus: 80 },
        { id: 3, name: 'TudoAzul', price: 68.00, bonus: 90 },
        { id: 4, name: 'Azul Fidelidade', price: 67.50, bonus: 85 }
      ],
      amountSuggestions: [1000, 2000, 5000, 10000]
    };
  },
  computed: {
    isFormValid() {
      return this.form.amount >= 1000 && this.form.programId;
    },
    selectedProgram() {
      return this.loyaltyPrograms.find(p => p.id === this.form.programId) || this.loyaltyPrograms[0];
    },
    bonusMiles() {
      return Math.floor((this.form.amount * this.selectedProgram.bonus) / 100);
    },
    totalMiles() {
      return this.form.amount + this.bonusMiles;
    },
    totalPrice() {
      return (this.form.amount * (this.selectedProgram.price / 1000)).toFixed(2);
    }
  },
  methods: {
    formatNumber(value) {
      return new Intl.NumberFormat('pt-BR').format(value);
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('pt-BR', { 
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
      }).format(value);
    },
    setAmount(amount) {
      this.form.amount = amount;
      this.calculateTotal();
    },
    calculateTotal() {
      // Garante que o valor seja múltiplo de 1000 e não seja menor que 1000
      if (this.form.amount < 1000) {
        this.form.amount = 1000;
      } else {
        this.form.amount = Math.floor(this.form.amount / 1000) * 1000;
      }
    },
    async handleSubmit() {
      if (!this.isFormValid || this.isSubmitting) return;
      
      this.isSubmitting = true;
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Emit the submit event with form data
        this.$emit('submit', { 
          ...this.form,
          programName: this.selectedProgram.name,
          totalMiles: this.totalMiles,
          totalPrice: parseFloat(this.totalPrice)
        });
        
        // Close the modal
        this.$emit('close');
      } catch (error) {
        console.error('Erro ao processar compra:', error);
        // Aqui você pode adicionar lógica para exibir mensagens de erro
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>
