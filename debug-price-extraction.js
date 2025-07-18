/**
 * Script para debuggar extração de preços da API Moblix
 * Este script analisa como os preços estão sendo extraídos incorretamente
 */

// Dados de exemplo baseados no JSON real que vimos
const exemploVooGOL = {
  "Token": "3e8800705d1c4a8b8fe55c86830b6a1f",
  "IdCia": 2, // GOL
  "Cia": {
    "Nome": "GOL/Smiles",
    "Iata": "G3"
  },
  "ValorAdulto": 3803.26,
  "ValorTotal": 3803.26,
  "ValorTotalComTaxa": 3673.717,
  "ValorTotalTaxas": -129.543,
  "Tarifas": [
    {
      "Tipo": "LIGHT",
      "ValorAdulto": 3803.26,
      "ValorCrianca": 0,
      "TaxaEmbarque": 0,
      "Classe": "Economica"
    }
  ],
  "Voos": [
    {
      "Numero": "G3-1300",
      "Saida": "2025-07-30T06:30:00",
      "Chegada": "2025-07-30T07:55:00",
      "Origem": "CNF",
      "Destino": "CGH",
      "Duracao": 85,
      "Tempo": "01:25"
    }
  ]
};

const exemploVooLATAM = {
  "Token": "ac257fcaafb54347997cbe9438bb6bd9",
  "IdCia": 1, // LATAM
  "Cia": {
    "Nome": "Latam",
    "Iata": "LA"
  },
  "ValorAdulto": 3803.26,
  "ValorTotal": 3803.26,
  "ValorTotalComTaxa": 3673.717,
  "ValorTotalTaxas": -129.543,
  "Tarifas": [
    {
      "Tipo": "LIGHT",
      "ValorAdulto": 3803.26,
      "ValorCrianca": 0,
      "TaxaEmbarque": 0,
      "Classe": "Economica"
    }
  ],
  "Voos": [
    {
      "Numero": "LA-3052",
      "Saida": "2025-07-30T06:15:00",
      "Chegada": "2025-07-30T07:30:00",
      "Origem": "CNF",
      "Destino": "CGH",
      "Duracao": 75,
      "Tempo": "01:15"
    }
  ]
};

// Função de extração de preços atual (problemática)
function extractPriceProblematic(obj) {
  console.log('\n🔍 DEBUGANDO PREÇO - Função PROBLEMÁTICA');
  console.log('📋 Propriedades do objeto:', Object.keys(obj));
  
  // Esta é a versão que pode estar causando problemas
  if (typeof obj?.ValorTotalComTaxa === 'number') {
    console.log('💰 PREÇO ENCONTRADO - ValorTotalComTaxa:', obj.ValorTotalComTaxa);
    return obj.ValorTotalComTaxa;
  }
  if (typeof obj?.ValorTotal === 'number') {
    console.log('💰 PREÇO ENCONTRADO - ValorTotal:', obj.ValorTotal);
    return obj.ValorTotal;
  }
  if (typeof obj?.ValorAdulto === 'number') {
    console.log('💰 PREÇO ENCONTRADO - ValorAdulto:', obj.ValorAdulto);
    return obj.ValorAdulto;
  }
  
  return 0;
}

// Função de extração de preços corrigida
function extractPriceCorrect(obj) {
  console.log('\n✅ DEBUGANDO PREÇO - Função CORRIGIDA');
  console.log('📋 Propriedades do objeto:', Object.keys(obj));
  console.log('🔍 Objeto completo:', JSON.stringify(obj, null, 2));
  
  // PRIORIDADE 1: ValorTotalComTaxa (preço final com taxas)
  if (typeof obj?.ValorTotalComTaxa === 'number' && obj.ValorTotalComTaxa > 0) {
    console.log('💰 PREÇO CORRETO ENCONTRADO - ValorTotalComTaxa:', obj.ValorTotalComTaxa);
    return obj.ValorTotalComTaxa;
  }
  
  // PRIORIDADE 2: ValorTotal (preço total sem taxas)
  if (typeof obj?.ValorTotal === 'number' && obj.ValorTotal > 0) {
    console.log('💰 PREÇO CORRETO ENCONTRADO - ValorTotal:', obj.ValorTotal);
    return obj.ValorTotal;
  }
  
  // PRIORIDADE 3: ValorAdulto (preço por adulto)
  if (typeof obj?.ValorAdulto === 'number' && obj.ValorAdulto > 0) {
    console.log('💰 PREÇO CORRETO ENCONTRADO - ValorAdulto:', obj.ValorAdulto);
    return obj.ValorAdulto;
  }
  
  console.log('❌ NENHUM PREÇO ENCONTRADO');
  return 0;
}

// Testa as duas funções
console.log('=== TESTE DE EXTRAÇÃO DE PREÇOS ===');
console.log('\n🛫 TESTANDO VOO GOL/SMILES:');
console.log('Preço problemático GOL:', extractPriceProblematic(exemploVooGOL));
console.log('Preço correto GOL:', extractPriceCorrect(exemploVooGOL));

console.log('\n✈️ TESTANDO VOO LATAM:');
console.log('Preço problemático LATAM:', extractPriceProblematic(exemploVooLATAM));
console.log('Preço correto LATAM:', extractPriceCorrect(exemploVooLATAM));

// Simula uma possível situação onde o preço está vindo errado
console.log('\n\n=== ANÁLISE DE POSSÍVEL PROBLEMA ===');

// Verifica se pode haver divisão por número de passageiros
const numPassageiros = 1;
const precoRealGOL = exemploVooGOL.ValorTotalComTaxa;
const precoErradoMostrado = 170.39;

console.log(`Preço real GOL: R$ ${precoRealGOL.toFixed(2)}`);
console.log(`Preço errado mostrado: R$ ${precoErradoMostrado.toFixed(2)}`);
console.log(`Diferença: ${(precoRealGOL / precoErradoMostrado).toFixed(2)}x`);

// Testa possível divisão por data ou outro fator
console.log(`\nPossíveis operações incorretas:`);
console.log(`- Divisão por 21.56: ${(precoRealGOL / 21.56).toFixed(2)}`);
console.log(`- Divisão por 20: ${(precoRealGOL / 20).toFixed(2)}`);
console.log(`- Divisão por 10: ${(precoRealGOL / 10).toFixed(2)}`);
console.log(`- Percentual (4.6%): ${(precoRealGOL * 0.046).toFixed(2)}`);

// Verifica se pode estar pegando apenas taxas
console.log(`\nVerificando se está pegando apenas taxas:`);
console.log(`- Taxas: ${Math.abs(exemploVooGOL.ValorTotalTaxas).toFixed(2)}`);
console.log(`- Taxa de embarque: ${exemploVooGOL.Tarifas[0]?.TaxaEmbarque || 0}`);

console.log('\n=== FIM DO DEBUG ===');
