import { getSupabase } from '@/config/supabase'

// Obtém o cliente Supabase
const getClient = () => {
  try {
    const client = getSupabase()
    if (!client) {
      throw new Error('Cliente Supabase não disponível')
    }
    return client
  } catch (error) {
    console.error('Erro ao obter cliente Supabase:', error)
    throw error
  }
}

// Serviço para gerenciar clientes
const clientService = {
  // Criar um novo cliente
  async createClient(clientData) {
    const supabase = getClient()
    
    try {
      console.log('[ClientService] Criando novo cliente:', clientData)
      
      // Preparar dados do cliente
      const newClient = {
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone || null,
        cpf: clientData.cpf || null,
        birth_date: clientData.birthDate || null,
        address: clientData.address || null,
        city: clientData.city || null,
        state: clientData.state || null,
        cep: clientData.cep || null,
        notes: clientData.notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Inserir cliente na tabela
      const { data, error } = await supabase
        .from('clients')
        .insert([newClient])
        .select()
        .single()

      if (error) {
        console.error('[ClientService] Erro ao criar cliente:', error)
        
        // Tratamento específico para diferentes tipos de erro
        if (error.code === '23505') { // Violação de chave única (email duplicado)
          throw new Error('Este email já está cadastrado. Por favor, use outro email.')
        }
        
        if (error.code === '23502') { // Violação de NOT NULL
          throw new Error('Dados obrigatórios estão faltando. Verifique o nome e email.')
        }
        
        throw new Error(error.message || 'Erro ao criar cliente')
      }

      console.log('[ClientService] Cliente criado com sucesso:', data)
      return {
        success: true,
        data: data,
        error: null
      }

    } catch (error) {
      console.error('[ClientService] Erro inesperado ao criar cliente:', error)
      return {
        success: false,
        data: null,
        error: error.message || 'Erro inesperado ao criar cliente'
      }
    }
  },

  // Buscar todos os clientes
  async getClients(filters = {}) {
    const supabase = getClient()
    
    try {
      console.log('[ClientService] Buscando clientes com filtros:', filters)
      
      let query = supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      // Aplicar filtros se fornecidos
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
      }

      if (filters.state) {
        query = query.eq('state', filters.state)
      }

      if (filters.city) {
        query = query.eq('city', filters.city)
      }

      const { data, error } = await query

      if (error) {
        console.error('[ClientService] Erro ao buscar clientes:', error)
        throw new Error(error.message || 'Erro ao buscar clientes')
      }

      console.log('[ClientService] Clientes encontrados:', data?.length || 0)
      return {
        success: true,
        data: data || [],
        error: null
      }

    } catch (error) {
      console.error('[ClientService] Erro inesperado ao buscar clientes:', error)
      return {
        success: false,
        data: [],
        error: error.message || 'Erro inesperado ao buscar clientes'
      }
    }
  },

  // Buscar cliente por ID
  async getClientById(clientId) {
    const supabase = getClient()
    
    try {
      console.log('[ClientService] Buscando cliente por ID:', clientId)
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') { // No rows found
          console.log('[ClientService] Cliente não encontrado')
          return {
            success: false,
            data: null,
            error: 'Cliente não encontrado'
          }
        }
        
        console.error('[ClientService] Erro ao buscar cliente:', error)
        throw new Error(error.message || 'Erro ao buscar cliente')
      }

      console.log('[ClientService] Cliente encontrado:', data)
      return {
        success: true,
        data: data,
        error: null
      }

    } catch (error) {
      console.error('[ClientService] Erro inesperado ao buscar cliente:', error)
      return {
        success: false,
        data: null,
        error: error.message || 'Erro inesperado ao buscar cliente'
      }
    }
  },

  // Atualizar cliente
  async updateClient(clientId, clientData) {
    const supabase = getClient()
    
    try {
      console.log('[ClientService] Atualizando cliente:', clientId, clientData)
      
      const updatedClient = {
        ...clientData,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('clients')
        .update(updatedClient)
        .eq('id', clientId)
        .select()
        .single()

      if (error) {
        console.error('[ClientService] Erro ao atualizar cliente:', error)
        
        if (error.code === '23505') { // Violação de chave única
          throw new Error('Este email já está cadastrado. Por favor, use outro email.')
        }
        
        throw new Error(error.message || 'Erro ao atualizar cliente')
      }

      console.log('[ClientService] Cliente atualizado com sucesso:', data)
      return {
        success: true,
        data: data,
        error: null
      }

    } catch (error) {
      console.error('[ClientService] Erro inesperado ao atualizar cliente:', error)
      return {
        success: false,
        data: null,
        error: error.message || 'Erro inesperado ao atualizar cliente'
      }
    }
  },

  // Deletar cliente
  async deleteClient(clientId) {
    const supabase = getClient()
    
    try {
      console.log('[ClientService] Deletando cliente:', clientId)
      
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId)

      if (error) {
        console.error('[ClientService] Erro ao deletar cliente:', error)
        throw new Error(error.message || 'Erro ao deletar cliente')
      }

      console.log('[ClientService] Cliente deletado com sucesso')
      return {
        success: true,
        error: null
      }

    } catch (error) {
      console.error('[ClientService] Erro inesperado ao deletar cliente:', error)
      return {
        success: false,
        error: error.message || 'Erro inesperado ao deletar cliente'
      }
    }
  },

  // Buscar clientes por email
  async getClientByEmail(email) {
    const supabase = getClient()
    
    try {
      console.log('[ClientService] Buscando cliente por email:', email)
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('email', email.toLowerCase())
        .single()

      if (error) {
        if (error.code === 'PGRST116') { // No rows found
          return {
            success: false,
            data: null,
            error: 'Cliente não encontrado'
          }
        }
        
        console.error('[ClientService] Erro ao buscar cliente por email:', error)
        throw new Error(error.message || 'Erro ao buscar cliente')
      }

      console.log('[ClientService] Cliente encontrado por email:', data)
      return {
        success: true,
        data: data,
        error: null
      }

    } catch (error) {
      console.error('[ClientService] Erro inesperado ao buscar cliente por email:', error)
      return {
        success: false,
        data: null,
        error: error.message || 'Erro inesperado ao buscar cliente'
      }
    }
  },

  // Verificar se email já existe
  async checkEmailExists(email) {
    const result = await this.getClientByEmail(email)
    return result.success
  },

  // Estatísticas dos clientes
  async getClientStats() {
    const supabase = getClient()
    
    try {
      console.log('[ClientService] Buscando estatísticas dos clientes')
      
      // Total de clientes
      const { count: totalClients, error: countError } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })

      if (countError) throw countError

      // Clientes criados nos últimos 30 dias
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const { count: recentClients, error: recentError } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString())

      if (recentError) throw recentError

      // Clientes por estado (top 5)
      const { data: clientsByState, error: stateError } = await supabase
        .from('clients')
        .select('state')
        .not('state', 'is', null)

      if (stateError) throw stateError

      // Contar clientes por estado
      const stateCount = {}
      clientsByState.forEach(client => {
        if (client.state) {
          stateCount[client.state] = (stateCount[client.state] || 0) + 1
        }
      })

      const topStates = Object.entries(stateCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([state, count]) => ({ state, count }))

      const stats = {
        totalClients: totalClients || 0,
        recentClients: recentClients || 0,
        topStates: topStates
      }

      console.log('[ClientService] Estatísticas calculadas:', stats)
      return {
        success: true,
        data: stats,
        error: null
      }

    } catch (error) {
      console.error('[ClientService] Erro ao buscar estatísticas:', error)
      return {
        success: false,
        data: null,
        error: error.message || 'Erro ao buscar estatísticas'
      }
    }
  }
}

export default clientService
