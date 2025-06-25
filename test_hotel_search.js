/**
 * Script para testar a busca de hotéis via API Moblix
 * Simula uma chamada real da aplicação
 */

import { MoblixApiService } from './src/services/moblixApiService.js';

async function testHotelSearch() {
  console.log('=== TESTE DE BUSCA DE HOTÉIS ===\n');
  
  try {
    // Cria uma instância do serviço
    const apiService = new MoblixApiService();
    
    // Parâmetros de teste similares aos que a aplicação usaria
    const searchParams = {
      idLocation: '6848', // ID de localização (São Paulo)
      checkin: '2025-01-25',
      checkout: '2025-01-26', 
      adults: 2,
      childrenAges: [], // Sem crianças
      currency: 'BRL'
    };
    
    console.log('Parâmetros da busca:', searchParams);
    console.log('\n--- Iniciando busca ---');
    
    // Faz a busca
    const result = await apiService.buscarDisponibilidadeHoteis(searchParams);
    
    console.log('\n--- RESULTADO ---');
    console.log('Sucesso:', result.Success);
    
    if (result.Success && result.Data) {
      console.log(`Hotéis encontrados: ${result.Data.length}`);
      
      // Mostra os primeiros 3 hotéis como exemplo
      const sampleHotels = result.Data.slice(0, 3);
      sampleHotels.forEach((hotel, index) => {
        console.log(`\n${index + 1}. ${hotel.Name}`);
        console.log(`   Rating: ${hotel.Rating || 'N/A'}`);
        console.log(`   Ofertas: ${hotel.Offers ? hotel.Offers.length : 0}`);
        if (hotel.Offers && hotel.Offers.length > 0) {
          const firstOffer = hotel.Offers[0];
          console.log(`   Preço: R$ ${firstOffer.TotalPrice || 'N/A'}`);
        }
      });
      
    } else {
      console.log('Erro na resposta:');
      console.log('- Código:', result.CodigoErro);
      console.log('- Mensagem:', result.MensagemErro);
      console.log('- Detalhes:', result.ExErro);
    }
    
  } catch (error) {
    console.error('\n--- ERRO NO TESTE ---');
    console.error('Tipo:', error.constructor.name);
    console.error('Mensagem:', error.message);
    
    if (error.response) {
      console.error('Status HTTP:', error.response.status);
      console.error('Dados da resposta:', error.response.data);
    }
    
    console.error('Stack:', error.stack);
  }
}

// Executa o teste
testHotelSearch().then(() => {
  console.log('\n=== TESTE FINALIZADO ===');
}).catch(error => {
  console.error('Erro fatal no teste:', error);
});
