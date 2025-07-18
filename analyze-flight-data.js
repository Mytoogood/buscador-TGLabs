// Análise dos dados de voo do JSON fornecido
const flightData = {
  "Ida": [
    {
      "Token": "608d7e2f64994b14a8c59b7e98f6b4c7",
      "IdCia": 1,
      "Cia": {
        "Nome": "Latam",
        "Iata": "LA"
      },
      "Voos": [
        {
          "Numero": "LA-3640",
          "Saida": "2025-07-13T09:25:00",
          "Chegada": "2025-07-13T10:55:00",
          "Origem": "CGH",
          "Destino": "VIX"
        },
        {
          "Numero": "LA-3689",
          "Saida": "2025-07-13T20:20:00",
          "Chegada": "2025-07-13T21:25:00",
          "Origem": "VIX",
          "Destino": "GIG"
        }
      ]
    },
    {
      "Token": "5fd25447fe70423391f6632d62cd5326",
      "IdCia": 1,
      "Cia": {
        "Nome": "Latam",
        "Iata": "LA"
      },
      "Voos": [
        {
          "Numero": "LA-3186",
          "Saida": "2025-07-13T22:10:00",
          "Chegada": "2025-07-14T01:35:00",
          "Origem": "CGH",
          "Destino": "FOR"
        },
        {
          "Numero": "LA-3887",
          "Saida": "2025-07-14T02:25:00",
          "Chegada": "2025-07-14T05:40:00",
          "Origem": "FOR",
          "Destino": "GIG"
        }
      ]
    },
    {
      "Token": "7420a8db3584476f97ce52fd7d2fc316",
      "IdCia": 1,
      "Cia": {
        "Nome": "Latam",
        "Iata": "LA"
      },
      "Voos": [
        {
          "Numero": "LA-3642",
          "Saida": "2025-07-13T07:35:00",
          "Chegada": "2025-07-13T09:05:00",
          "Origem": "CGH",
          "Destino": "VIX"
        },
        {
          "Numero": "LA-3667",
          "Saida": "2025-07-13T11:35:00",
          "Chegada": "2025-07-13T12:45:00",
          "Origem": "VIX",
          "Destino": "GIG"
        }
      ]
    },
    {
      "Token": "dc2854cd4c454484a1b771985d2957d1",
      "IdCia": 1,
      "Cia": {
        "Nome": "Latam",
        "Iata": "LA"
      },
      "Voos": [
        {
          "Numero": "LA-3640",
          "Saida": "2025-07-13T09:25:00",
          "Chegada": "2025-07-13T10:55:00",
          "Origem": "CGH",
          "Destino": "VIX"
        },
        {
          "Numero": "LA-3667",
          "Saida": "2025-07-13T11:35:00",
          "Chegada": "2025-07-13T12:45:00",
          "Origem": "VIX",
          "Destino": "GIG"
        }
      ]
    }
  ],
  "Companhia": "Latam"
};

function analyzeFlightData() {
  console.log("=== ANÁLISE DOS VOOS ENCONTRADOS ===\n");
  
  // Extrair companhias aéreas únicas
  const airlines = new Set();
  let totalFlights = 0;
  let totalRoutes = 0;
  const uniqueFlights = new Set();
  const routes = new Set();
  
  flightData.Ida.forEach(route => {
    // Adicionar companhia aérea
    airlines.add(route.Cia.Nome);
    
    // Contar rota
    totalRoutes++;
    
    // Extrair informações dos voos
    route.Voos.forEach(flight => {
      totalFlights++;
      uniqueFlights.add(flight.Numero);
      
      // Adicionar rota do voo
      routes.add(`${flight.Origem} → ${flight.Destino}`);
    });
  });
  
  console.log("🛫 COMPANHIAS AÉREAS ENCONTRADAS:");
  airlines.forEach(airline => {
    console.log(`   • ${airline}`);
  });
  
  console.log(`\n📊 ESTATÍSTICAS:`);
  console.log(`   • Total de companhias aéreas: ${airlines.size}`);
  console.log(`   • Total de opções de viagem: ${totalRoutes}`);
  console.log(`   • Total de voos (segmentos): ${totalFlights}`);
  console.log(`   • Voos únicos: ${uniqueFlights.size}`);
  
  console.log(`\n🗺️ ROTAS ENCONTRADAS:`);
  routes.forEach(route => {
    console.log(`   • ${route}`);
  });
  
  console.log(`\n✈️ DETALHES DOS VOOS ÚNICOS:`);
  const uniqueFlightsList = Array.from(uniqueFlights).sort();
  uniqueFlightsList.forEach(flightNumber => {
    console.log(`   • ${flightNumber}`);
  });
  
  console.log(`\n🕐 HORÁRIOS DAS OPÇÕES DE VIAGEM:`);
  flightData.Ida.forEach((route, index) => {
    console.log(`\n   Opção ${index + 1}:`);
    route.Voos.forEach((flight, flightIndex) => {
      const saida = new Date(flight.Saida).toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      const chegada = new Date(flight.Chegada).toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      console.log(`     ${flightIndex + 1}º voo: ${flight.Numero} | ${flight.Origem} → ${flight.Destino} | ${saida} - ${chegada}`);
    });
  });
}

// Executar análise
analyzeFlightData();
