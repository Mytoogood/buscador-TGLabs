import moblixService from '@/services/moblixService';

/**
 * Explora a API Moblix para descobrir endpoints disponíveis
 */
const apiExplorer = {
  /**
   * Lista os endpoints disponíveis na API
   */
  async discoverEndpoints() {
    console.log('Iniciando exploração da API Moblix...');
    
    // Endpoints comuns para testar
    const commonEndpoints = [
      '/',
      '/api',
      '/api/Home',
      '/api/Token/Info',
      '/api/Account/Info',
      '/api/Clientes',
      '/api/Milhas',
      '/api/Transacoes',
      '/api/Extrato',
      '/api/Cotacoes',
      '/api/Programas',
      '/api/Relatorios',
      '/swagger',
      '/swagger/v1/swagger.json'
    ];

    const availableEndpoints = [];
    
    for (const endpoint of commonEndpoints) {
      try {
        console.log(`Testando endpoint: ${endpoint}`);
        const response = await moblixService.request('get', endpoint);
        availableEndpoints.push({
          endpoint,
          status: 'OK',
          data: response ? 'Dados retornados' : 'Sem dados',
          method: 'GET'
        });
      } catch (error) {
        // Ignora erros 404/403, apenas registra outros erros
        if (error.response && error.response.status !== 404 && error.response.status !== 403) {
          availableEndpoints.push({
            endpoint,
            status: `Erro ${error.response?.status || 'Desconhecido'}`,
            error: error.message,
            method: 'GET'
          });
        }
      }
    }

    console.log('Endpoints disponíveis:', availableEndpoints);
    return availableEndpoints;
  },

  /**
   * Obtém informações da conta atual
   */
  async getAccountInfo() {
    try {
      console.log('Obtendo informações da conta...');
      const info = await moblixService.request('get', '/api/Account/Info');
      console.log('Informações da conta:', info);
      return info;
    } catch (error) {
      console.error('Erro ao obter informações da conta:', error);
      throw error;
    }
  },

  /**
   * Obtém informações sobre o token atual
   */
  async getTokenInfo() {
    try {
      console.log('Obtendo informações do token...');
      const info = await moblixService.request('get', '/api/Token/Info');
      console.log('Informações do token:', info);
      return info;
    } catch (error) {
      console.error('Erro ao obter informações do token:', error);
      throw error;
    }
  }
};

export default apiExplorer;
