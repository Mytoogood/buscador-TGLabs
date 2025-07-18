# Instruções para Debug da Discrepância de Preços

## Problema Relatado
- Preço exibido na API: R$ 283,44 / por pessoa
- Preço do original: R$ 317,14 
- Diferença: 9%
- Voo: GOL G3-1924 GRU → GIG 18:00 → 19:05

## Como Debugar

### 1. Abrir o Console do Browser
1. Abra o DevTools (F12)
2. Vá para a aba "Console"

### 2. Fazer uma Busca de Voos
1. Busque por: GRU → GIG
2. Data: qualquer data que tenha o voo G3-1924
3. Aguarde os resultados carregarem

### 3. Executar Scripts de Debug

#### Script 1: Debug Básico
```javascript
// Verifica os preços de todos os voos
const flights = searchResults.value;
console.log('=== ANÁLISE DE PREÇOS ===');
flights.forEach((flight, i) => {
  console.log(`Voo ${i+1}: ${flight.companhia} ${flight.numeroVoo}`);
  console.log(`  priceWithTax: ${flight.priceWithTax}`);
  console.log(`  price: ${flight.price}`);
  console.log(`  totalPrice: ${flight.totalPrice}`);
  console.log(`  Preço exibido: ${flight.priceWithTax || flight.price || flight.totalPrice}`);
  console.log('  ---');
});
```

#### Script 2: Debug do Voo GOL G3-1924
```javascript
// Encontra o voo específico
const golFlight = searchResults.value.find(f => 
  f.companhia && f.companhia.includes('GOL') && 
  f.numeroVoo && f.numeroVoo.includes('1924')
);

if (golFlight) {
  console.log('=== VOO GOL G3-1924 ENCONTRADO ===');
  console.log('priceWithTax:', golFlight.priceWithTax);
  console.log('price:', golFlight.price);
  console.log('totalPrice:', golFlight.totalPrice);
  console.log('valorTotal:', golFlight.valorTotal);
  console.log('valorTotalComTaxa:', golFlight.valorTotalComTaxa);
  console.log('Dados originais:', golFlight._originalData);
  console.log('===============================');
} else {
  console.log('❌ Voo GOL G3-1924 não encontrado');
}
```

#### Script 3: Debug da API Response
```javascript
// Verifica a resposta bruta da API
console.log('=== RESPOSTA BRUTA DA API ===');
// Procure por variáveis como 'response' ou 'rawFlights' no console
// Elas aparecem durante o processo de busca
```

### 4. Verificar os Logs do Console

Durante a busca, procure por estas mensagens importantes:

1. **"🔍 DEBUGANDO PREÇO - Objeto completo:"** - Mostra os dados brutos da API
2. **"💰 PREÇO ENCONTRADO - ValorTotalComTaxa:"** - Preço que será usado
3. **"🎯 ESTE É O PREÇO QUE SERÁ EXIBIDO NA UI!"** - Confirmação do preço

### 5. Possíveis Causas da Discrepância

1. **API retornando valores diferentes**: Verifique se ValorTotalComTaxa vs ValorTotal
2. **Taxas incluídas/não incluídas**: Diferença entre preço com e sem taxas
3. **Conversão de tipos**: Número vs string
4. **Arredondamento**: Verificar se não há arredondamento em algum lugar
5. **Cache**: Dados antigos sendo exibidos

### 6. Soluções Implementadas

✅ **Removido arredondamento forçado**: Linhas 1131-1133 agora preservam preços originais
✅ **Melhorado logging**: Função extractPrice agora mostra qual preço será usado
✅ **Preservação de dados originais**: Campo _originalData mantém dados brutos da API

### 7. Verificações Adicionais

Execute este script para verificar se a correção funcionou:

```javascript
// Verifica se há arredondamento sendo aplicado
const flights = searchResults.value;
flights.forEach((flight, i) => {
  const original = flight._originalData?.ValorTotalComTaxa || 0;
  const displayed = flight.priceWithTax || flight.price || flight.totalPrice || 0;
  const diff = Math.abs(original - displayed);
  
  if (diff > 0.01) {
    console.log(`⚠️ Voo ${i+1} - Discrepância detectada:`);
    console.log(`   Original: ${original}`);
    console.log(`   Exibido: ${displayed}`);
    console.log(`   Diferença: ${diff}`);
  }
});
```

## Resultado Esperado

Após a correção, o preço exibido deve ser exatamente igual ao preço retornado pela API, sem arredondamentos ou conversões desnecessárias.

**Status da Correção**: ✅ IMPLEMENTADA
- Removido arredondamento forçado no processamento dos voos
- Melhorado logging para facilitar debugging futuro
- Preservação dos dados originais da API
