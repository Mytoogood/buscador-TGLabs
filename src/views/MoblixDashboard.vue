<template>
  <div class="moblix-dashboard min-h-screen bg-gray-50 p-6">
    <!-- Cabeçalho -->
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Painel Moblix</h1>
          <p class="text-gray-600">Gerencie suas operações de milhas e fidelidade</p>
        </div>
        <div class="flex items-center space-x-4">
          <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            {{ authStatus }}
          </span>
          <button 
            @click="refreshData"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            :disabled="isLoading"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Atualizando...' : 'Atualizar Dados' }}
          </button>
        </div>
      </div>

      <!-- Cartões de Resumo -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard 
          title="Saldo Total" 
          :value="formatCurrency(dashboardData.totalBalance || 0)" 
          icon="💳" 
          :trend="dashboardData.balanceTrend"
          trendLabel="em relação ao mês passado"
        />
        <DashboardCard 
          title="Milhas Disponíveis" 
          :value="formatNumber(dashboardData.availableMiles || 0)" 
          icon="✈️"
          :trend="dashboardData.milesTrend"
          trendLabel="últimos 30 dias"
        />
        <DashboardCard 
          title="Transações" 
          :value="dashboardData.totalTransactions || 0" 
          icon="🔄"
          :trend="dashboardData.transactionsTrend"
          trendLabel="este mês"
        />
        <DashboardCard 
          title="Clientes Ativos" 
          :value="dashboardData.activeClients || 0" 
          icon="👥"
          :trend="dashboardData.clientsTrend"
          trendLabel="último mês"
        />
      </div>

      <!-- Gráficos e Tabelas -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Gráfico de Saldo Mensal -->
        <div class="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Saldo Mensal</h3>
          <div class="h-64">
            <LineChart v-if="monthlyBalance.labels.length > 0" :chartData="monthlyBalance" />
            <div v-else class="h-full flex items-center justify-center text-gray-500">
              Nenhum dado disponível
            </div>
          </div>
        </div>

        <!-- Programas de Fidelidade -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Programas de Fidelidade</h3>
          <div class="space-y-4">
            <div v-for="program in loyaltyPrograms" :key="program.id" class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span class="text-lg">{{ program.icon }}</span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ program.name }}</p>
                  <p class="text-sm text-gray-500">{{ program.miles }} milhas</p>
                </div>
              </div>
              <span class="text-sm font-medium" :class="program.trend >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ program.trend >= 0 ? '+' : '' }}{{ program.trend }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Últimas Transações -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Últimas Transações</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="transaction in recentTransactions" :key="transaction.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(transaction.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ transaction.description }}</div>
                  <div class="text-sm text-gray-500">{{ transaction.program }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getTypeBadgeClass(transaction.type)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ transaction.type }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm" :class="transaction.amount >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'">
                  {{ transaction.amount >= 0 ? '+' : '' }}{{ formatCurrency(transaction.amount) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusBadgeClass(transaction.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ transaction.status }}
                  </span>
                </td>
              </tr>
              <tr v-if="recentTransactions.length === 0">
                <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
                  Nenhuma transação encontrada
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div class="flex-1 flex justify-between sm:hidden">
            <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"> Anterior </a>
            <a href="#" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"> Próximo </a>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Mostrando <span class="font-medium">1</span> a <span class="font-medium">10</span> de <span class="font-medium">20</span> resultados
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">Anterior</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </a>
                <a href="#" aria-current="page" class="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"> 1 </a>
                <a href="#" class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"> 2 </a>
                <a href="#" class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"> 3 </a>
                <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">Próximo</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <!-- Seção de Ações Rápidas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <ActionCard 
          title="Transferir Milhas"
          description="Transfira milhas entre contas"
          icon="🔄"
          buttonText="Transferir"
          @click="openTransferModal"
        />
        <ActionCard 
          title="Comprar Milhas"
          description="Adquira mais milhas"
          icon="🛒"
          buttonText="Comprar"
          @click="openBuyModal"
        />
        <ActionCard 
          title="Resgatar Prêmios"
          description="Troque suas milhas por prêmios"
          icon="🎁"
          buttonText="Resgatar"
          @click="openRedeemModal"
        />
        <ActionCard 
          title="Relatórios"
          description="Acesse relatórios detalhados"
          icon="📊"
          buttonText="Visualizar"
          @click="openReportsModal"
        />
      </div>
    </div>

    <!-- Modais -->
    <TransferModal 
      v-if="showTransferModal" 
      @close="closeTransferModal" 
      @submit="handleTransfer"
    />
    <BuyModal 
      v-if="showBuyModal" 
      @close="closeBuyModal" 
      @submit="handleBuy"
    />
    <RedeemModal 
      v-if="showRedeemModal" 
      @close="closeRedeemModal" 
      @submit="handleRedeem"
    />
    <ReportsModal 
      v-if="showReportsModal" 
      @close="closeReportsModal"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import moblixService from '@/services/moblixService';
import DashboardCard from '@/components/moblix/DashboardCard.vue';
import ActionCard from '@/components/moblix/ActionCard.vue';
import LineChart from '@/components/moblix/LineChart.vue';
import TransferModal from '@/components/moblix/modals/TransferModal.vue';
import BuyModal from '@/components/moblix/modals/BuyModal.vue';
import RedeemModal from '@/components/moblix/modals/RedeemModal.vue';
import ReportsModal from '@/components/moblix/modals/ReportsModal.vue';

export default {
  name: 'MoblixDashboard',
  components: {
    DashboardCard,
    ActionCard,
    LineChart,
    TransferModal,
    BuyModal,
    RedeemModal,
    ReportsModal
  },
  setup() {
    const router = useRouter();
    const authStatus = ref('Carregando...');
    const isLoading = ref(false);
    const dashboardData = ref({
      totalBalance: 0,
      availableMiles: 0,
      totalTransactions: 0,
      activeClients: 0,
      balanceTrend: 0,
      milesTrend: 0,
      transactionsTrend: 0,
      clientsTrend: 0
    });

    // Dados para o gráfico de saldo mensal
    const monthlyBalance = ref({
      labels: [],
      datasets: [
        {
          label: 'Saldo (R$)',
          data: [],
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.3,
          fill: true
        }
      ]
    });

    // Programas de fidelidade
    const loyaltyPrograms = ref([
      { id: 1, name: 'LATAM Fidelidade', miles: '25,000', icon: '✈️', trend: 5.2 },
      { id: 2, name: 'Smiles', miles: '18,500', icon: '😊', trend: 12.7 },
      { id: 3, name: 'TudoAzul', miles: '32,100', icon: '🔵', trend: -2.3 },
      { id: 4, name: 'Azul Fidelidade', miles: '14,200', icon: '🔷', trend: 8.9 }
    ]);

    // Transações recentes
    const recentTransactions = ref([
      { 
        id: 1, 
        date: new Date(), 
        description: 'Compra de milhas', 
        program: 'Smiles', 
        type: 'Crédito', 
        amount: 5000, 
        status: 'Concluído' 
      },
      { 
        id: 2, 
        date: new Date(Date.now() - 86400000), 
        description: 'Transferência para cliente', 
        program: 'TudoAzul', 
        type: 'Débito', 
        amount: -2000, 
        status: 'Concluído' 
      },
      { 
        id: 3, 
        date: new Date(Date.now() - 172800000), 
        description: 'Resgate de prêmio', 
        program: 'LATAM Fidelidade', 
        type: 'Débito', 
        amount: -4500, 
        status: 'Pendente' 
      },
      { 
        id: 4, 
        date: new Date(Date.now() - 259200000), 
        description: 'Bônus de fidelidade', 
        program: 'Azul Fidelidade', 
        type: 'Crédito', 
        amount: 1000, 
        status: 'Concluído' 
      },
      { 
        id: 5, 
        date: new Date(Date.now() - 345600000), 
        description: 'Compra de milhas', 
        program: 'Smiles', 
        type: 'Crédito', 
        amount: 3000, 
        status: 'Concluído' 
      }
    ]);

    // Estados dos modais
    const showTransferModal = ref(false);
    const showBuyModal = ref(false);
    const showRedeemModal = ref(false);
    const showReportsModal = ref(false);

    // Funções para abrir/fechar modais
    const openTransferModal = () => showTransferModal.value = true;
    const closeTransferModal = () => showTransferModal.value = false;
    const openBuyModal = () => showBuyModal.value = true;
    const closeBuyModal = () => showBuyModal.value = false;
    const openRedeemModal = () => showRedeemModal.value = true;
    const closeRedeemModal = () => showRedeemModal.value = false;
    const openReportsModal = () => showReportsModal.value = true;
    const closeReportsModal = () => showReportsModal.value = false;

    // Funções para lidar com as ações dos modais
    const handleTransfer = async (transferData) => {
      try {
        // Implementar lógica de transferência
        console.log('Transferindo:', transferData);
        closeTransferModal();
        await refreshData();
      } catch (error) {
        console.error('Erro ao transferir:', error);
      }
    };

    const handleBuy = async (buyData) => {
      try {
        // Implementar lógica de compra
        console.log('Comprando:', buyData);
        closeBuyModal();
        await refreshData();
      } catch (error) {
        console.error('Erro ao comprar:', error);
      }
    };

    const handleRedeem = async (redeemData) => {
      try {
        // Implementar lógica de resgate
        console.log('Resgatando:', redeemData);
        closeRedeemModal();
        await refreshData();
      } catch (error) {
        console.error('Erro ao resgatar:', error);
      }
    };

    // Funções auxiliares
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      }).format(value);
    };

    const formatNumber = (value) => {
      return new Intl.NumberFormat('pt-BR').format(value);
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('pt-BR');
    };

    const getTypeBadgeClass = (type) => {
      const classes = {
        'Crédito': 'bg-green-100 text-green-800',
        'Débito': 'bg-red-100 text-red-800',
        'Bônus': 'bg-yellow-100 text-yellow-800',
        'Taxa': 'bg-gray-100 text-gray-800'
      };
      return classes[type] || 'bg-gray-100 text-gray-800';
    };

    const getStatusBadgeClass = (status) => {
      const classes = {
        'Concluído': 'bg-green-100 text-green-800',
        'Pendente': 'bg-yellow-100 text-yellow-800',
        'Cancelado': 'bg-red-100 text-red-800',
        'Processando': 'bg-blue-100 text-blue-800'
      };
      return classes[status] || 'bg-gray-100 text-gray-800';
    };

    // Função para carregar dados da API
    const loadDashboardData = async () => {
      try {
        isLoading.value = true;
        authStatus.value = 'Autenticado';
        
        // Simulando chamadas à API
        // Na implementação real, substitua por chamadas reais à API Moblix
        setTimeout(() => {
          dashboardData.value = {
            totalBalance: 12500.75,
            availableMiles: 85600,
            totalTransactions: 42,
            activeClients: 18,
            balanceTrend: 7.5,
            milesTrend: 12.3,
            transactionsTrend: 15.8,
            clientsTrend: 5.2
          };

          // Dados simulados para o gráfico de saldo mensal
          const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
          const currentMonth = new Date().getMonth();
          const labels = [];
          const data = [];
          
          for (let i = 5; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12;
            labels.push(months[monthIndex]);
            data.push(Math.floor(Math.random() * 10000) + 5000);
          }
          
          monthlyBalance.value = {
            labels,
            datasets: [{
              ...monthlyBalance.value.datasets[0],
              data
            }]
          };

          isLoading.value = false;
        }, 1000);
        
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        authStatus.value = 'Erro de autenticação';
        isLoading.value = false;
      }
    };

    // Função para atualizar os dados
    const refreshData = async () => {
      await loadDashboardData();
    };

    // Carrega os dados ao montar o componente
    onMounted(() => {
      loadDashboardData();
    });

    return {
      authStatus,
      isLoading,
      dashboardData,
      monthlyBalance,
      loyaltyPrograms,
      recentTransactions,
      showTransferModal,
      showBuyModal,
      showRedeemModal,
      showReportsModal,
      openTransferModal,
      closeTransferModal,
      openBuyModal,
      closeBuyModal,
      openRedeemModal,
      closeRedeemModal,
      openReportsModal,
      closeReportsModal,
      handleTransfer,
      handleBuy,
      handleRedeem,
      formatCurrency,
      formatNumber,
      formatDate,
      getTypeBadgeClass,
      getStatusBadgeClass,
      refreshData
    };
  }
};
</script>

<style scoped>
.moblix-dashboard {
  background-color: #f9fafb;
}
</style>
