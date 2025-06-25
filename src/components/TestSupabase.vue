<template>
  <div class="p-4 bg-gray-100 rounded-lg">
    <h2 class="text-xl font-bold mb-4">Teste de Conexão com Supabase</h2>
    
    <div v-if="loading" class="text-blue-600">
      Verificando conexão com o Supabase...
    </div>
    
    <div v-else-if="error" class="text-red-600">
      Erro ao conectar ao Supabase: {{ error }}
    </div>
    
    <div v-else-if="tables" class="space-y-4">
      <div class="text-green-600 font-semibold">
        ✅ Conexão com Supabase estabelecida com sucesso!
      </div>
      
      <div class="mt-4">
        <h3 class="font-bold mb-2">Tabelas disponíveis:</h3>
        <ul class="list-disc pl-5 space-y-1">
          <li v-for="table in tables" :key="table">{{ table }}</li>
        </ul>
      </div>
    </div>
    
    <div v-else class="text-yellow-600">
      Não foi possível verificar as tabelas do banco de dados.
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestSupabase',
  data() {
    return {
      loading: true,
      error: null,
      tables: null
    }
  },
  async mounted() {
    try {
      // Obtém a instância do Supabase usando a função getSupabase
      const supabase = this.$getSupabase?.() || this.supabase;
      
      if (!supabase) {
        throw new Error('Supabase não está disponível');
      }
      
      // Tenta buscar as tabelas do banco de dados
      const { data, error } = await supabase
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public');
      
      if (error) throw error;
      
      this.tables = data.map(item => item.tablename);
    } catch (err) {
      console.error('Erro ao testar conexão com Supabase:', err);
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  }
}
</script>
