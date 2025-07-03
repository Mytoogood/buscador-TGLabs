# Companhias Aéreas - API Moblix

Este documento lista todas as companhias aéreas disponíveis na API Moblix e seus respectivos IDs para consulta de voos.

## Lista Completa de Companhias

| Companhia | ID | Descrição |
|-----------|----|-----------|
| LATAM | 1 | Latam Airlines |
| GOL/Smiles | 2 | Gol Linhas Aéreas e Smiles |
| Azul | 3 | Azul Linhas Aéreas |
| TAP | 11 | TAP Air Portugal |
| Livelo | 34 | Livelo (Programa de fidelidade) |
| Azul Interline | 1200 | Azul Interline |

## Como Usar

### Busca Padrão
Para buscar voos de uma companhia específica, use o parâmetro `companhia` com o ID correspondente:

```javascript
{
  "origem": "GRU",
  "destino": "GIG", 
  "ida": "2024-01-15",
  "companhia": 1  // LATAM
}
```

### Reserva Fácil
Para reserva fácil, use o parâmetro `Companhia` (com C maiúsculo):

```javascript
{
  "origem": "GRU",
  "destino": "GIG",
  "Ida": "2024-01-15", 
  "Companhia": 2  // GOL/Smiles
}
```

### Buscar Todas as Companhias
Para buscar voos de todas as companhias, use o valor `-1`:

```javascript
{
  "companhia": -1  // Todas as companhias
}
```

## Implementação no Frontend

O componente `Flights.vue` já está configurado com todas essas opções nos selects de companhia aérea:

- **Busca Padrão**: Select com opção "Todas as companhias" (-1) + todas as companhias específicas
- **Reserva Fácil**: Select com todas as companhias específicas (sem a opção "Todas")

## Referência da API

Documentação completa da API Moblix: [https://documenter.getpostman.com/view/18112108/2s93z3fQfi#68702c2f-bdbb-49c4-89ac-b32b81cc4798](https://documenter.getpostman.com/view/18112108/2s93z3fQfi#68702c2f-bdbb-49c4-89ac-b32b81cc4798) 