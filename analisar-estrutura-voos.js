import axios from 'axios';

// Configuração da API Moblix
const API_BASE_URL = 'https://api.moblix.com.br';
const CREDENTIALS = {
  username: 'TooGood',
  password: '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7'
};

let accessToken = null;

/**
 * Obtém token de acesso
 */
async function obterToken() {
  try {
    console.log('🔑 Obtendo token...');
    
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('username', CREDENTIALS.username);
    params.append('password', CREDENTIALS.password);

    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/api/Token`,
      data: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Origin': 'externo'
      },
      timeout: 15000
    });

    if (response.data && response.data.access_token) {
      accessToken = response.data.access_token;
      console.log('✅ Token obtido!');
      return accessToken;
    }
    throw new Error('Token não encontrado');
  } catch (error) {
    console.error('❌ Erro ao obter token:', error.message);
    throw error;
  }
}

/**
 * Busca voos e analisa estrutura
 */
async function analisarVoos() {
  try {
    console.log('🔍 ANÁLISE DE ESTRUTURA DE VOOS');
    console.log('===============================');
    
    await obterToken();
    
    // Busca voos para Madrid com LATAM (que sabemos que retorna 190 voos)
    const parametros = {
      Origem: 'GRU',
      Destino: 'MAD',
      Ida: '2025-08-15',
      Adultos: 1,
      Criancas: 0,
      Bebes: 0,
      Companhia: 1 // LATAM
    };
    
    console.log('📡 Buscando voos GRU → MAD com LATAM...');
    
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/api/ConsultaAereo/Consultar`,
      data: parametros,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      timeout: 30000
    });
    
    console.log('✅ Resposta recebida!');
    console.log('📊 Estrutura da resposta:');
    console.log('Keys principais:', Object.keys(response.data));
    console.log('');
    
    if (response.data.Data && response.data.Data.length > 0) {
      const primeiroItem = response.data.Data[0];
      console.log('🗂️ Primeiro item em Data:');
      console.log('Keys:', Object.keys(primeiroItem));
      console.log('');
      
      // Analisa o array Ida
      if (primeiroItem.Ida && primeiroItem.Ida.length > 0) {
        console.log(`📈 Array Ida contém ${primeiroItem.Ida.length} voos`);
        console.log('');
        
        // Analisa os primeiros 3 voos
        for (let i = 0; i < Math.min(3, primeiroItem.Ida.length); i++) {
          const voo = primeiroItem.Ida[i];
          console.log(`✈️ VOO ${i + 1}:`);
          console.log('Keys do voo:', Object.keys(voo));
          console.log('');
          
          // Procura por campos de preço
          const camposPreco = [];
          for (const [key, value] of Object.entries(voo)) {
            if (key.toLowerCase().includes('preco') || 
                key.toLowerCase().includes('price') || 
                key.toLowerCase().includes('valor') ||
                key.toLowerCase().includes('tarifa') ||
                key.toLowerCase().includes('fare') ||
                (typeof value === 'number' && value > 0 && value < 10000)) {
              camposPreco.push({ campo: key, valor: value });
            }
          }
          
          if (camposPreco.length > 0) {
            console.log('💰 Possíveis campos de preço encontrados:');
            camposPreco.forEach(campo => {
              console.log(`   ${campo.campo}: ${campo.valor}`);
            });
          } else {
            console.log('❌ Nenhum campo de preço óbvio encontrado');
          }
          
          // Analisa segmentos se existirem
          if (voo.segments && Array.isArray(voo.segments)) {
            console.log(`🔗 Voo tem ${voo.segments.length} segmento(s)`);
            const primeiroSegmento = voo.segments[0];
            console.log('Keys do primeiro segmento:', Object.keys(primeiroSegmento));
            
            // Procura preços nos segmentos
            const camposPrecoSegmento = [];
            for (const [key, value] of Object.entries(primeiroSegmento)) {
              if (key.toLowerCase().includes('preco') || 
                  key.toLowerCase().includes('price') || 
                  key.toLowerCase().includes('valor') ||
                  key.toLowerCase().includes('tarifa') ||
                  key.toLowerCase().includes('fare') ||
                  (typeof value === 'number' && value > 0 && value < 10000)) {
                camposPrecoSegmento.push({ campo: key, valor: value });
              }
            }
            
            if (camposPrecoSegmento.length > 0) {
              console.log('💰 Preços no segmento:');
              camposPrecoSegmento.forEach(campo => {
                console.log(`   ${campo.campo}: ${campo.valor}`);
              });
            }
          }
          
          console.log('─'.repeat(50));
        }
        
        // Mostra estrutura completa de um voo
        console.log('📋 ESTRUTURA COMPLETA DO PRIMEIRO VOO:');
        console.log(JSON.stringify(primeiroItem.Ida[0], null, 2));
        
      } else {
        console.log('❌ Nenhum voo encontrado no array Ida');
      }
    } else {
      console.log('❌ Nenhum dado encontrado');
    }
    
  } catch (error) {
    console.error('💥 Erro durante análise:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
    }
  }
}

// Executar análise
analisarVoos();
