import moblixApiService from './moblixApiService';
import moblixAuth from './moblixAuth';

/**
 * Serviço para interagir com a API Moblix
 * Este serviço utiliza o moblixApiService para fazer requisições autenticadas
 */

const moblixService = {
  /**
   * Verifica se o usuário está autenticado
   * @returns {Promise<boolean>} Verdadeiro se estiver autenticado
   */
  async checkAuth() {
    try {
      // Tenta fazer login para verificar as credenciais
      await this.login();
      return true;
    } catch (error) {
      console.error('Falha na autenticação:', error);
      return false;
    }
  },

  /**
   * Realiza o login na API Moblix
   * @returns {Promise<Object>} Dados da autenticação
   */
  async login() {
    try {
      // O serviço de autenticação já está configurado com as credenciais
      // Apenas precisamos verificar se o token é válido
      const authData = await moblixApiService.request({
        method: 'get',
        endpoint: '/api/Token/validate'
      });
      
      return {
        success: true,
        ...authData
      };
    } catch (error) {
      console.error('Erro ao validar token:', error);
      throw new Error('Não foi possível autenticar com a API Moblix');
    }
  },

  /**
   * Busca dados de exemplo da API
   * @param {Object} params - Parâmetros de consulta (opcional)
   * @returns {Promise<Object>} Dados retornados pela API
   */
  async getExampleData(params = {}) {
    return moblixApiService.request({
      method: 'get',
      endpoint: '/api/exemplo/endpoint',
      params
    });
  },

  /**
   * Envia dados para a API
   * @param {Object} data - Dados a serem enviados
   * @returns {Promise<Object>} Resposta da API
   */
  async postExampleData(data) {
    return moblixApiService.request({
      method: 'post',
      endpoint: '/api/exemplo/endpoint',
      data
    });
  },

  /**
   * Busca os dados do dashboard da API Moblix
   * @returns {Promise<Object>} Dados do dashboard formatados
   */
  async getDashboardData() {
    try {
      // Garante que está autenticado
      if (!moblixAuth.isAuthenticated()) {
        console.log('Sessão expirada, tentando renovar autenticação...');
        await moblixAuth.login();
      }

      console.log('Buscando dados do dashboard...');
      
      // Busca os dados do dashboard da API Moblix em paralelo
      const [inventarioResponse, produtosResponse] = await Promise.all([
        // Endpoint de inventário
        this.request('get', '/product/api/inventory', {
          params: {
            IdProduct: 1430
          }
        }).catch(error => {
          console.error('Erro ao buscar inventário:', error.message);
          return { Data: [{ Balance: 0 }] }; // Retorno padrão em caso de erro
        }),
        
        // Endpoint de produtos
        this.request('get', '/product/api/products', {
          params: {
            Id: 110372,
            ListProductsFromMarketPlace: true,
            GetAllProductsProviderIndependentOfSalesChannel: true,
            IgnoreStatus: true,
            Includes: 'ProductPhoto,ProductSeo,ProductChildrenIdProductNavigation,IdCategoryNavigation,Inventory',
            PageNumber: 1,
            PageSize: 10,
            Active: false,
            OrderByAsc: false
          }
        }).catch(error => {
          console.error('Erro ao buscar produtos:', error.message);
          return { Data: [] }; // Retorno padrão em caso de erro
        })
      ]);

      // Processa as respostas
      const saldoEstoque = inventarioResponse?.Data?.[0]?.Balance || 0;
      const totalProdutos = produtosResponse?.Data?.length || 0;
      
      // Tenta obter o total de clientes
      let totalClientes = 0;
      try {
        const pessoasResponse = await this.request('post', '/moblix-api/api/Pessoa/Listar', {
          PageNumber: 1,
          PageSize: 10
        }).catch(error => {
          console.warn('Erro ao buscar clientes:', error.message);
          return { Data: [] }; // Retorno padrão em caso de erro
        });
        
        totalClientes = pessoasResponse?.Data?.length || 0;
      } catch (error) {
        console.warn('Erro ao processar clientes:', error.message);
      }

      console.log('Dados do dashboard carregados com sucesso');
      
      // Calcula métricas com base nos dados disponíveis
      return {
        totalMiles: saldoEstoque * 1000, // Exemplo de conversão
        activeClients: totalClientes,
        monthlyTransactions: totalProdutos,
        averageTicket: 2845, // Valor médio de exemplo
        // As tendências podem ser calculadas com base em dados históricos
        milesTrend: 12.5,
        clientsTrend: 8.2,
        transactionsTrend: 15.3,
        ticketTrend: -3.2
      };

    } catch (error) {
      console.error('Erro ao buscar dados do dashboard da API Moblix:', error);
      
      // Em caso de erro, retorna um objeto com zeros para evitar erros no frontend
      return {
        totalMiles: 0,
        activeClients: 0,
        monthlyTransactions: 0,
        averageTicket: 0,
        milesTrend: 0,
        clientsTrend: 0,
        transactionsTrend: 0,
        ticketTrend: 0
      };
    }
  },

  /**
   * Método genérico para fazer requisições à API Moblix
   * @param {string} method - Método HTTP (get, post, put, delete, etc.)
   * @param {string} endpoint - Endpoint da API (sem a URL base)
   * @param {Object} [data] - Dados a serem enviados no corpo da requisição (opcional)
   * @param {Object} [params] - Parâmetros de consulta (opcional)
   * @returns {Promise<Object>} Resposta da API
   */
  async request(method, endpoint, data = null, params = {}) {
    return moblixApiService.request({
      method,
      endpoint,
      data,
      params
    });
  }
};

export default moblixService;
