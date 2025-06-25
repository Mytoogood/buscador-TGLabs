// Teste da autenticação Moblix
import moblixAuth from './moblixAuth.js';

/**
 * Função para testar a autenticação
 */
async function testMoblixAuthentication() {
  console.log('🔐 Iniciando teste de autenticação da API Moblix...');
  console.log('=' * 50);
  
  try {
    // Teste 1: Login
    console.log('📝 Teste 1: Realizando login...');
    const loginResult = await moblixAuth.login();
    
    if (loginResult.success) {
      console.log('✅ Login realizado com sucesso!');
      console.log(`🎫 Token obtido: ${loginResult.token.substring(0, 50)}...`);
      console.log(`⏰ Expira em: ${Math.floor(loginResult.expiresIn / 3600)} horas`);
      console.log(`📅 Data de expiração: ${new Date(loginResult.expiresAt).toLocaleString()}`);
    } else {
      console.log('❌ Falha no login');
      return;
    }
    
    // Teste 2: Verificar se está autenticado
    console.log('\n📝 Teste 2: Verificando autenticação...');
    const isAuth = moblixAuth.isAuthenticated();
    console.log(`🔍 Está autenticado: ${isAuth ? '✅ Sim' : '❌ Não'}`);
    
    // Teste 3: Obter token
    console.log('\n📝 Teste 3: Obtendo token...');
    const token = moblixAuth.getToken();
    console.log(`🎫 Token obtido: ${token ? '✅ Sim' : '❌ Não'}`);
    
    // Teste 4: Obter cabeçalho de autorização
    console.log('\n📝 Teste 4: Obtendo cabeçalho de autorização...');
    const authHeader = moblixAuth.getAuthHeader();
    console.log('📋 Cabeçalhos:', {
      'Content-Type': authHeader['Content-Type'],
      'Origin': authHeader['Origin'],
      'Authorization': authHeader['Authorization'] ? `Bearer ${authHeader['Authorization'].substring(7, 50)}...` : 'Não definido'
    });
    
    console.log('\n🎉 Todos os testes concluídos com sucesso!');
    return true;
    
  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
    console.error('📋 Detalhes do erro:', error);
    return false;
  }
}

/**
 * Função para testar logout
 */
function testLogout() {
  console.log('\n🚪 Testando logout...');
  
  // Verifica o estado antes do logout
  const beforeLogout = moblixAuth.isAuthenticated();
  console.log(`🔍 Autenticado antes do logout: ${beforeLogout ? '✅ Sim' : '❌ Não'}`);
  
  // Realiza o logout
  moblixAuth.logout();
  
  // Verifica o estado após o logout
  const afterLogout = moblixAuth.isAuthenticated();
  console.log(`🔍 Autenticado após o logout: ${afterLogout ? '❌ Sim' : '✅ Não'}`);
  
  // Verifica se o token foi removido
  const token = moblixAuth.getToken();
  console.log(`🎫 Token após logout: ${token ? '❌ Ainda existe' : '✅ Removido'}`);
  
  console.log(afterLogout || token ? '❌ Logout falhou' : '✅ Logout realizado com sucesso!');
}

// Exporta as funções de teste
export { testMoblixAuthentication, testLogout };

// Se executado diretamente, roda os testes
if (typeof window !== 'undefined') {
  // Adiciona funções globais para teste no navegador
  window.testMoblixAuth = testMoblixAuthentication;
  window.testMoblixLogout = testLogout;
  
  console.log('🌐 Funções de teste disponíveis no console do navegador:');
  console.log('  • testMoblixAuth() - Testa autenticação');
  console.log('  • testMoblixLogout() - Testa logout');
}
