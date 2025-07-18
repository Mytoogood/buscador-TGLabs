#!/usr/bin/env node

/**
 * Script para testar a busca múltipla de companhias aéreas
 * Este script simula a lógica implementada no frontend para garantir que
 * todas as companhias sejam encontradas e exibidas corretamente.
 * 
 * ATUALIZAÇÃO: Agora usa os valores disponíveis para Companhia/CompanhiaVolta
 * conforme documentação da API, em vez de IDs hardcoded.
 * 
 * Valores Disponíveis:
 * - Todas: -1 (Busca em todas as companhias disponíveis)
 * - Latam: 1, Gol: 2, Azul: 3, etc.
 */

import https from 'https';

// Configuração da API
const API_CONFIG = {
  baseUrl: 'https://api.moblix.com.br',
  username: 'TooGood',
  password: '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7'
};

// Função para fazer requisição HTTP
function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({ statusCode: res.statusCode, data: response });
        } catch (error) {
          resolve({ statusCode: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => reject(error));
    if (postData) req.write(postData);
    req.end();
  });
}

// Função para autenticar
async function authenticate() {
  const authOptions = {
    hostname: 'api.moblix.com.br',
    port: 443,
    path: '/api/Token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'Origin': 'externo'
    }
  };

  const authData = `grant_type=password&username=${API_CONFIG.username}&password=${API_CONFIG.password}`;

  try {
    const response = await makeRequest(authOptions, authData);
    if (response.statusCode === 200 && response.data.access_token) {
      return response.data.access_token;
    }
    throw new Error('Falha na autenticação');
  } catch (error) {
    throw new Error(`Erro na autenticação: ${error.message}`);
  }
}

// Função para buscar voos (simula a lógica do frontend)
async function searchFlights(token, params) {
  const searchOptions = {
    hostname: 'api.moblix.com.br',
    port: 443,
    path: '/api/ConsultaAereo/Consultar',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Origin': 'externo'
    }
  };

  const searchData = JSON.stringify(params);

  try {
    const response = await makeRequest(searchOptions, searchData);
    return response;
  } catch (error) {
    console.error('Erro na busca:', error.message);
    return null;
  }
}

// Função principal que implementa a nova lógica
async function testMultipleAirlinesLogic() {
  console.log('🚀 TESTANDO NOVA LÓGICA DE BUSCA MÚLTIPLA');
  console.log('===============================================\n');

  try {
    // Autenticar
    console.log('🔐 Autenticando...');
    const token = await authenticate();
    console.log('✅ Autenticação realizada com sucesso\n');

    // Valores disponíveis para Companhia/CompanhiaVolta
    // Conforme documentação da API
    const companhiaValues = {
      'Todas': -1,      // Busca em todas as companhias disponíveis
      'Latam': 1,       // LATAM Airlines
      'Gol': 2,         // GOL Linhas Aéreas
      'Azul': 3,        // Azul Linhas Aéreas
      'Tap': 11,        // TAP Air Portugal
      'AmericanAirlines': 22,  // American Airlines
      'Iberia': 26,     // Iberia
      'Livelo': 34,     // Livelo
      'Interline': 1200 // Interline
    };
    
    // Parâmetros de busca
    const searchParams = {
      Origem: 'CGH',
      Destino: 'GIG', 
      Ida: '2025-07-15',
      Adultos: 1,
      Criancas: 0,
      Bebes: 0,
      Companhia: companhiaValues['Todas']  // Busca por todas usando valor disponível
    };

    console.log('📋 Parâmetros de busca:', searchParams);
    console.log('🔍 Fazendo busca inicial por "Todas as companhias"...\n');

    // Busca inicial
    const initialResponse = await searchFlights(token, searchParams);
    
    if (!initialResponse || initialResponse.statusCode !== 200) {
      console.log('❌ Falha na busca inicial');
      return;
    }

    console.log('📦 RESPOSTA DA BUSCA INICIAL:');
    console.log('Status:', initialResponse.statusCode);
    console.log('Success:', initialResponse.data.Success);
    console.log('HasResult:', initialResponse.data.HasResult);

    if (initialResponse.data.Data && initialResponse.data.Data[0]) {
      const dataItem = initialResponse.data.Data[0];
      console.log('ActiveProviders:', dataItem.ActiveProviders);
      console.log('Flights length:', dataItem.flights?.length || 0);

      // *** IMPLEMENTA A NOVA LÓGICA ***
      // Quando usuário escolhe "Todas as companhias" e a busca inicial não retorna voos
      // mas há providers ativos, fazemos buscas individuais por cada companhia
      if (dataItem.ActiveProviders?.length > 0 && (!dataItem.flights || dataItem.flights.length === 0)) {
        console.log('\n🔄 APLICANDO NOVA LÓGICA: Busca por providers ativos sem voos');
        console.log('📋 Providers encontrados:', dataItem.ActiveProviders.join(', '));

        // Usar valores disponíveis para Companhia/CompanhiaVolta
        // Mapeamento dos providers para os valores disponíveis
        const providerMapping = {
          'Latam': 'Latam',
          'Gol': 'Gol', 
          'Azul': 'Azul',
          'Livelo': 'Livelo',
          'Tap': 'Tap',
          'Interline': 'Interline',
          'iberia': 'Iberia',
          'AmericanAirlines': 'AmericanAirlines'
        };

        let allFlights = [];
        const results = [];

        for (const provider of dataItem.ActiveProviders) {
          const companyValue = providerMapping[provider];
          if (companyValue) {
            const companyId = companhiaValues[companyValue];
            console.log(`\n🔍 Buscando voos da ${provider} (Valor: ${companyValue}, ID: ${companyId})...`);
            
            try {
              const individualResponse = await searchFlights(token, {
                ...searchParams,
                Companhia: companyId
              });

              if (individualResponse?.statusCode === 200 && individualResponse.data?.Success) {
                let flightCount = 0;
                
                if (individualResponse.data.Data) {
                  individualResponse.data.Data.forEach(dataItem => {
                    if (dataItem.Ida && Array.isArray(dataItem.Ida)) {
                      // Adiciona identificação da companhia
                      dataItem.Ida.forEach(flight => {
                        flight.ProviderSource = provider;
                        flight.ProviderCompanyId = companyId;
                      });
                      allFlights.push(...dataItem.Ida);
                      flightCount += dataItem.Ida.length;
                    }
                  });
                }

                results.push({
                  provider: provider,
                  companyValue: companyValue,
                  companyId: companyId,
                  flightCount: flightCount,
                  success: true
                });

                console.log(`   ✅ ${provider}: ${flightCount} voos encontrados`);
              } else {
                results.push({
                  provider: provider,
                  companyValue: companyValue,
                  companyId: companyId,
                  flightCount: 0,
                  success: false
                });
                console.log(`   ❌ ${provider}: Nenhum voo encontrado`);
              }
            } catch (error) {
              console.log(`   ⚠️ ${provider}: Erro - ${error.message}`);
              results.push({
                provider: provider,
                companyValue: companyValue,
                companyId: companyId,
                flightCount: 0,
                success: false,
                error: error.message
              });
            }

            // Delay entre requisições
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }

        console.log('\n===============================================');
        console.log('📊 RESUMO FINAL:');
        console.log('===============================================');
        console.log(`Total de voos coletados: ${allFlights.length}`);
        console.log(`Providers testados: ${results.length}`);

        results.forEach(result => {
          const status = result.success ? '✅' : '❌';
          console.log(`${status} ${result.provider}: ${result.flightCount} voos`);
        });

        const successfulProviders = results.filter(r => r.success && r.flightCount > 0);
        console.log(`\n🎯 Companhias com voos: ${successfulProviders.length} de ${results.length}`);
        
        if (successfulProviders.length > 0) {
          console.log('\n✅ NOVA LÓGICA FUNCIONOU!');
          console.log('🎉 Agora o usuário verá voos de múltiplas companhias');
        } else {
          console.log('\n⚠️ Nenhuma companhia retornou voos para esta rota/data');
        }

      } else if (dataItem.flights && dataItem.flights.length > 0) {
        console.log('\n✅ Busca inicial já retornou voos, nova lógica não necessária');
        console.log(`📊 ${dataItem.flights.length} voos encontrados na busca inicial`);
      } else {
        console.log('\n❌ Nenhum provider ativo encontrado');
      }
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

// Executar teste
testMultipleAirlinesLogic();
