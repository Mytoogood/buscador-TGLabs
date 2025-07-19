import axios from 'axios'

// Configuração da API Real da Moblix
const API_BASE_URL = 'http://localhost:3001'

// Credenciais da Moblix
const MOBLIX_CREDENTIALS = {
  mbxUsername: 'TooGood',
  mbxPassword: '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7'
}

// Instância do axios para a API da Moblix
const moblixApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Gerenciamento de token
let currentToken = null
let tokenExpiry = null

// Função para autenticar e obter Bearer Token
async function authenticate() {
  try {
    const response = await moblixApi.post('/auth/login', MOBLIX_CREDENTIALS)
    
    if (response.data.Success) {
      currentToken = response.data.Data.bearerToken
      // Token expira em 24 horas
      tokenExpiry = new Date().getTime() + (24 * 60 * 60 * 1000)
      
      // Adicionar token aos headers padrão
      moblixApi.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`
      
      console.log('✅ Autenticação Moblix realizada com sucesso!')
      return currentToken
    } else {
      throw new Error('Falha na autenticação: ' + response.data.MensagemErro)
    }
  } catch (error) {
    console.error('❌ Erro na autenticação Moblix:', error)
    throw error
  }
}

// Verificar se o token ainda é válido
function isTokenValid() {
  return currentToken && tokenExpiry && new Date().getTime() < tokenExpiry
}

// Garantir autenticação antes das requisições
async function ensureAuthenticated() {
  if (!isTokenValid()) {
    await authenticate()
  }
  return currentToken
}

// Serviços da API da Moblix
export const moblixService = {
  // Verificar status da API
  async getStatus() {
    try {
      const response = await moblixApi.get('/moblix-api/status')
      return response.data
    } catch (error) {
      console.error('Erro ao verificar status da API:', error)
      throw error
    }
  },

  // Fazer login manual
  async login(credentials = MOBLIX_CREDENTIALS) {
    try {
      const response = await moblixApi.post('/auth/login', credentials)
      return response.data
    } catch (error) {
      console.error('Erro no login:', error)
      throw error
    }
  },

  // Criar bilhete aéreo (endpoint principal)
  async criarBilhete(bilheteData) {
    try {
      await ensureAuthenticated()
      
      const response = await moblixApi.post('/moblix-api/api/Pedido/EmitirPedido', bilheteData)
      return response.data
    } catch (error) {
      console.error('Erro ao criar bilhete:', error)
      throw error
    }
  },

  // Listar bilhetes criados
  async listarBilhetes() {
    try {
      await ensureAuthenticated()
      
      const response = await moblixApi.get('/moblix-api/api/Pedido/ListarBilhetes')
      return response.data
    } catch (error) {
      console.error('Erro ao listar bilhetes:', error)
      throw error
    }
  },

  // Booking - Criar reserva
  async criarReserva(reservaData) {
    try {
      await ensureAuthenticated()
      
      const response = await moblixApi.post('/moblix-api/api/Booking/CriarReserva', reservaData)
      return response.data
    } catch (error) {
      console.error('Erro ao criar reserva:', error)
      throw error
    }
  },

  // Booking - Listar reservas
  async listarReservas() {
    try {
      await ensureAuthenticated()
      
      const response = await moblixApi.get('/moblix-api/api/Booking/ListarReservas')
      return response.data
    } catch (error) {
      console.error('Erro ao listar reservas:', error)
      throw error
    }
  },

  // Experiences - Criar experiência
  async criarExperiencia(experienciaData) {
    try {
      await ensureAuthenticated()
      
      const response = await moblixApi.post('/moblix-api/api/Experiences/CriarExperiencia', experienciaData)
      return response.data
    } catch (error) {
      console.error('Erro ao criar experiência:', error)
      throw error
    }
  },

  // Experiences - Listar experiências
  async listarExperiencias() {
    try {
      await ensureAuthenticated()
      
      const response = await moblixApi.get('/moblix-api/api/Experiences/ListarExperiencias')
      return response.data
    } catch (error) {
      console.error('Erro ao listar experiências:', error)
      throw error
    }
  },

  // Dados de exemplo para criar bilhete
  getBilheteExemplo() {
    return {
      RequestId: `REQ-${Date.now()}`,
      Email: 'cliente@exemplo.com',
      IdExterno: '',
      Passageiros: [{
        Email: 'cliente@exemplo.com',
        DDI: '55',
        DDD: '11',
        Telefone: '987654321',
        TipoDocumento: 'cpf',
        Id: 0,
        Nome: 'João',
        Sobrenome: 'Silva',
        Nascimento: '1990-01-01T00:00:00-03:00',
        Cpf: '12345678901',
        Sexo: 'M'
      }],
      Ida: {
        Token: 'ida_' + Math.random().toString(36).substring(7)
      },
      Volta: {
        Token: 'volta_' + Math.random().toString(36).substring(7)
      },
      pagante: {
        id: 0,
        name: 'João Silva',
        address: {
          street: 'Rua Exemplo',
          number: '123',
          additional_details: 'Apt 45',
          zipcode: '01234567',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          country: 'Brasil'
        },
        phones: [{
          DDD: '11',
          DDI: '55',
          number: '987654321'
        }],
        Nascimento: '1990-01-01T00:00:00-03:00'
      },
      TokenConsultaIda: '8_Latam_' + Math.random().toString(36).substring(7),
      TokenConsultaVolta: '8_Gol_' + Math.random().toString(36).substring(7),
      IdMeioPagamento: 4, // Transferência
      ValorTotal: Math.floor(Math.random() * 1000) + 200
    }
  },

  // Utilitários para obter dados da API
  async getAPIInfo() {
    try {
      const status = await this.getStatus()
      return {
        status: status.status,
        version: status.version,
        timestamp: status.timestamp,
        endpoints: status.endpoints,
        meiosPagamento: status.meiosPagamento,
        baseURL: API_BASE_URL
      }
    } catch (error) {
      throw error
    }
  },

  // Estatísticas da API
  async getEstatisticas() {
    try {
      const bilhetes = await this.listarBilhetes()
      const reservas = await this.listarReservas()
      const experiencias = await this.listarExperiencias()
      
      return {
        totalBilhetes: bilhetes.TotalItens || 0,
        totalReservas: reservas.TotalItens || 0,
        totalExperiencias: experiencias.TotalItens || 0,
        valorTotalVendas: bilhetes.Data ? bilhetes.Data.reduce((total, bilhete) => {
          return total + (bilhete.Viagem?.[0]?.ValorAdulto || 0)
        }, 0) : 0
      }
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error)
      return {
        totalBilhetes: 0,
        totalReservas: 0,
        totalExperiencias: 0,
        valorTotalVendas: 0
      }
    }
  },

  // Dados de exemplo para reserva
  getReservaExemplo() {
    return {
      clienteNome: 'Maria Santos',
      clienteEmail: 'maria@exemplo.com',
      dataReserva: new Date().toISOString(),
      tipoReserva: 'voo',
      detalhes: {
        origem: 'GRU',
        destino: 'BSB',
        dataIda: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        passageiros: 1
      }
    }
  },

  // Dados de exemplo para experiência
  getExperienciaExemplo() {
    return {
      nome: 'City Tour São Paulo',
      descricao: 'Tour completo pela cidade de São Paulo',
      preco: 150.00,
      duracao: '8 horas',
      categoria: 'turismo',
      disponibilidade: true,
      avaliacoes: {
        media: 4.5,
        total: 128
      }
    }
  },

  // Obter informações detalhadas de um bilhete
  async getBilheteDetalhes(bilheteId) {
    try {
      const bilhetes = await this.listarBilhetes()
      if (bilhetes.Success && bilhetes.Data) {
        return bilhetes.Data.find(b => b.Id === bilheteId)
      }
      return null
    } catch (error) {
      console.error('Erro ao obter detalhes do bilhete:', error)
      throw error
    }
  },

  // Busca de voos real na API
  async buscarVoos(origem, destino, dataIda, dataVolta = null) {
    try {
      await ensureAuthenticated()
      
      const consultaData = {
        origem: origem,
        destino: destino,
        dataIda: dataIda,
        dataVolta: dataVolta,
        quantidadeAdultos: 1,
        quantidadeCriancas: 0,
        quantidadeBebes: 0,
        classe: "ECONOMICA"
      }
      
      console.log('Realizando consulta real de voos:', consultaData)
      
      const response = await moblixApi.post('/api/ConsultaAereo/Consultar', consultaData)
      
      if (response.data && response.data.Success) {
        return {
          Success: true,
          Data: response.data.Voos || [],
          TotalItens: (response.data.Voos || []).length
        }
      } else {
        console.warn('Resposta da API sem dados de voos:', response.data)
        throw new Error('Falha na consulta de voos: ' + (response.data?.MensagemErro || 'Resposta sem dados'))
      }
    } catch (error) {
      console.error('Erro ao buscar voos:', error)
      throw error
    }
  }
}

// Error handling interceptor para Moblix API
moblixApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.error('Chave de API inválida para Moblix')
    } else if (error.response?.status === 429) {
      console.error('Limite de requisições excedido')
    } else if (error.response?.status === 403) {
      console.error('Acesso negado - verifique as permissões da API')
    } else if (error.response?.status === 500) {
      console.error('Erro interno do servidor Moblix')
    }
    return Promise.reject(error)
  }
)

