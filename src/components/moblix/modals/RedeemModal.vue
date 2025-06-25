<template>
  <BaseModal @close="$emit('close')" @submit="handleSubmit">
    <template #title>Resgatar Prêmios</template>
    
    <template #content>
      <div class="space-y-4">
        <div>
          <label for="program" class="block text-sm font-medium text-gray-700">Programa de Fidelidade</label>
          <select
            id="program"
            v-model="form.programId"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            @change="loadRewards"
          >
            <option v-for="program in loyaltyPrograms" :key="program.id" :value="program.id">
              {{ program.name }} ({{ program.miles }} milhas)
            </option>
          </select>
        </div>
        
        <div v-if="rewards.length > 0">
          <label class="block text-sm font-medium text-gray-700 mb-2">Prêmios Disponíveis</label>
          <div class="space-y-3">
            <div 
              v-for="reward in filteredRewards" 
              :key="reward.id"
              class="relative flex items-start p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
              :class="{ 'border-blue-500 bg-blue-50': form.rewardId === reward.id }"
              @click="selectReward(reward)"
            >
              <div class="flex items-center h-5">
                <input 
                  :id="`reward-${reward.id}`" 
                  :name="`reward-${form.programId}`" 
                  type="radio" 
                  class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  :checked="form.rewardId === reward.id"
                >
              </div>
              <div class="ml-3 flex-1">
                <label :for="`reward-${reward.id}`" class="block text-sm font-medium text-gray-900 cursor-pointer">
                  {{ reward.name }}
                </label>
                <p class="text-sm text-gray-500 mt-1">
                  {{ reward.description }}
                </p>
                <div class="mt-2 flex justify-between items-center">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ formatNumber(reward.points) }} milhas
                  </span>
                  <span class="text-xs text-gray-500">
                    {{ reward.available ? 'Disponível' : 'Indisponível' }}
                  </span>
                </div>
              </div>
            </div>
            
            <div v-if="filteredRewards.length === 0" class="text-center py-4">
              <p class="text-sm text-gray-500">Nenhum prêmio disponível para resgate neste programa.</p>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-4">
          <p class="text-sm text-gray-500">Selecione um programa para ver os prêmios disponíveis.</p>
        </div>
        
        <div v-if="selectedReward" class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md mt-4">
          <h4 class="text-sm font-medium text-blue-800">Detalhes do Resgate</h4>
          <div class="mt-2 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Prêmio selecionado:</span>
              <span class="font-medium">{{ selectedReward.name }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Custo em milhas:</span>
              <span class="font-medium text-blue-700">{{ formatNumber(selectedReward.points) }} milhas</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Saldo após resgate:</span>
              <span class="font-medium">
                {{ formatNumber(selectedProgramBalance - selectedReward.points) }} milhas
              </span>
            </div>
          </div>
        </div>
        
        <div v-if="selectedReward && selectedReward.terms" class="mt-4 text-sm text-gray-500">
          <p class="font-medium text-gray-700">Termos e condições:</p>
          <p class="mt-1">{{ selectedReward.terms }}</p>
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
        {{ isSubmitting ? 'Processando...' : 'Confirmar Resgate' }}
      </button>
    </template>
  </BaseModal>
</template>

<script>
import BaseModal from './BaseModal.vue';

export default {
  name: 'RedeemModal',
  components: {
    BaseModal
  },
  emits: ['close', 'submit'],
  data() {
    return {
      isSubmitting: false,
      form: {
        programId: 1,
        rewardId: null,
        recipientName: '',
        recipientEmail: ''
      },
      loyaltyPrograms: [
        { id: 1, name: 'LATAM Fidelidade', miles: '25,000' },
        { id: 2, name: 'Smiles', miles: '18,500' },
        { id: 3, name: 'TudoAzul', miles: '32,100' },
        { id: 4, name: 'Azul Fidelidade', miles: '14,200' }
      ],
      rewards: [],
      // Dados simulados de prêmios por programa
      programRewards: {
        1: [
          { id: 101, name: 'Passagem Nacional', description: 'Passagem aérea para qualquer destino nacional', points: 15000, available: true, terms: 'Válido para voos nacionais em classe econômica. Taxas de embarque não inclusas.' },
          { id: 102, name: 'Upgrade de Classe', description: 'Upgrade para classe executiva em voos nacionais', points: 10000, available: true, terms: 'Sujeito à disponibilidade. Apenas para voos operados pela LATAM.' },
          { id: 103, name: 'Bagagem Extra', description: 'Direito a uma bagagem extra de 23kg', points: 5000, available: false, terms: 'Válido por 6 meses a partir da data do resgate.' }
        ],
        2: [
          { id: 201, name: 'Cupom de Desconto', description: '20% de desconto em sua próxima compra', points: 8000, available: true, terms: 'Válido por 30 dias a partir do resgate.' },
          { id: 202, name: 'Noite em Hotel', description: 'Diária em hotel parceiro', points: 12000, available: true, terms: 'Sujeito à disponibilidade. Válido por 6 meses.' }
        ],
        3: [
          { id: 301, name: 'Milhas Extras', description: 'Bônus de 10% em milhas na próxima compra', points: 5000, available: true, terms: 'Válido para compras acima de 5.000 milhas.' },
          { id: 302, name: 'Check-in Especial', description: 'Check-in prioritário e embarque antecipado', points: 3000, available: true, terms: 'Válido por 1 ano a partir do resgate.' }
        ],
        4: [
          { id: 401, name: 'Milhas do Bem', description: 'Doe milhas para instituições beneficentes', points: 10000, available: true, terms: 'As milhas doadas são convertidas em doações para instituições parceiras.' }
        ]
      }
    };
  },
  computed: {
    isFormValid() {
      return this.form.rewardId !== null && 
             this.selectedReward && 
             this.selectedReward.available &&
             this.selectedProgramBalance >= (this.selectedReward?.points || 0);
    },
    selectedProgram() {
      return this.loyaltyPrograms.find(p => p.id === this.form.programId) || this.loyaltyPrograms[0];
    },
    selectedProgramBalance() {
      // Remove os pontos e converte para número
      return parseInt(this.selectedProgram.miles.replace(/\./g, ''));
    },
    selectedReward() {
      return this.rewards.find(r => r.id === this.form.rewardId);
    },
    filteredRewards() {
      return this.rewards.filter(reward => reward.available);
    }
  },
  created() {
    // Carrega os prêmios do programa inicial
    this.loadRewards();
  },
  methods: {
    formatNumber(value) {
      return new Intl.NumberFormat('pt-BR').format(value);
    },
    loadRewards() {
      // Limpa a seleção de prêmio ao trocar de programa
      this.form.rewardId = null;
      
      // Simula carregamento dos prêmios do programa selecionado
      // Na implementação real, isso seria uma chamada à API
      setTimeout(() => {
        this.rewards = this.programRewards[this.form.programId] || [];
      }, 300);
    },
    selectReward(reward) {
      if (reward.available) {
        this.form.rewardId = reward.id;
      }
    },
    async handleSubmit() {
      if (!this.isFormValid || this.isSubmitting) return;
      
      this.isSubmitting = true;
      
      try {
        // Simula o processamento do resgate
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Emite o evento de submissão com os dados do resgate
        this.$emit('submit', { 
          ...this.form,
          reward: this.selectedReward,
          programName: this.selectedProgram.name
        });
        
        // Fecha o modal
        this.$emit('close');
      } catch (error) {
        console.error('Erro ao processar resgate:', error);
        // Aqui você pode adicionar lógica para exibir mensagens de erro
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>
