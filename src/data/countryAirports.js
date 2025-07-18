// Mapeamento completo de cidades para aeroportos
export const cityToAirports = {
  // Brasil
  'são paulo': ['GRU', 'CGH'],
  'rio de janeiro': ['GIG', 'SDU'],
  'brasília': ['BSB'],
  'campinas': ['VCP'],
  'belo horizonte': ['CNF'],
  'salvador': ['SSA'],
  'fortaleza': ['FOR'],
  'recife': ['REC'],
  'porto alegre': ['POA'],
  'belém': ['BEL'],
  'manaus': ['MAO'],
  'curitiba': ['CWB'],
  'florianópolis': ['FLN'],
  'vitória': ['VIX'],
  'natal': ['NAT'],
  'maceió': ['MCZ'],
  'joão pessoa': ['JPA'],
  'aracaju': ['AJU'],
  // Portugal
  'lisboa': ['LIS'],
  'porto': ['OPO'],
  'faro': ['FAO'],
  // Espanha
  'madrid': ['MAD'],
  'barcelona': ['BCN'],
  'palma de maiorca': ['PMI'],
  // França
  'paris': ['CDG', 'ORY'],
  // Estados Unidos
  'nova york': ['JFK'],
  'los angeles': ['LAX'],
  'miami': ['MIA'],
  'chicago': ['ORD'],
  'dallas': ['DFW'],
  // Reino Unido
  'londres': ['LHR', 'LGW', 'STN'],
  // Itália
  'roma': ['FCO'],
  'milão': ['MXP'],
  // Alemanha
  'frankfurt': ['FRA'],
  // Holanda
  'amsterdã': ['AMS']
};

// Base de dados completa de aeroportos para busca local
export const airportsDatabase = [
  // Brasil
  { Iata: 'GRU', Nome: 'Aeroporto Internacional de São Paulo/Guarulhos', Cidade: 'São Paulo', Pais: 'Brasil' },
  { Iata: 'CGH', Nome: 'Aeroporto de São Paulo/Congonhas', Cidade: 'São Paulo', Pais: 'Brasil' },
  { Iata: 'VCP', Nome: 'Aeroporto Internacional de Viracopos', Cidade: 'Campinas', Pais: 'Brasil' },
  { Iata: 'BSB', Nome: 'Aeroporto Internacional de Brasília', Cidade: 'Brasília', Pais: 'Brasil' },
  { Iata: 'CNF', Nome: 'Aeroporto Internacional Tancredo Neves', Cidade: 'Belo Horizonte', Pais: 'Brasil' },
  { Iata: 'SDU', Nome: 'Aeroporto Santos Dumont', Cidade: 'Rio de Janeiro', Pais: 'Brasil' },
  { Iata: 'GIG', Nome: 'Aeroporto Internacional do Rio de Janeiro/Galeão', Cidade: 'Rio de Janeiro', Pais: 'Brasil' },
  { Iata: 'SSA', Nome: 'Aeroporto Internacional de Salvador', Cidade: 'Salvador', Pais: 'Brasil' },
  { Iata: 'FOR', Nome: 'Aeroporto Internacional de Fortaleza', Cidade: 'Fortaleza', Pais: 'Brasil' },
  { Iata: 'REC', Nome: 'Aeroporto Internacional do Recife', Cidade: 'Recife', Pais: 'Brasil' },
  { Iata: 'POA', Nome: 'Aeroporto Internacional de Porto Alegre', Cidade: 'Porto Alegre', Pais: 'Brasil' },
  { Iata: 'BEL', Nome: 'Aeroporto Internacional de Belém', Cidade: 'Belém', Pais: 'Brasil' },
  { Iata: 'MAO', Nome: 'Aeroporto Internacional de Manaus', Cidade: 'Manaus', Pais: 'Brasil' },
  { Iata: 'CWB', Nome: 'Aeroporto Internacional de Curitiba', Cidade: 'Curitiba', Pais: 'Brasil' },
  { Iata: 'FLN', Nome: 'Aeroporto Internacional de Florianópolis', Cidade: 'Florianópolis', Pais: 'Brasil' },
  { Iata: 'VIX', Nome: 'Aeroporto de Vitória', Cidade: 'Vitória', Pais: 'Brasil' },
  { Iata: 'NAT', Nome: 'Aeroporto Internacional de Natal', Cidade: 'Natal', Pais: 'Brasil' },
  { Iata: 'MCZ', Nome: 'Aeroporto Internacional de Maceió', Cidade: 'Maceió', Pais: 'Brasil' },
  { Iata: 'JPA', Nome: 'Aeroporto Internacional de João Pessoa', Cidade: 'João Pessoa', Pais: 'Brasil' },
  { Iata: 'AJU', Nome: 'Aeroporto Internacional de Aracaju', Cidade: 'Aracaju', Pais: 'Brasil' },
  
  // Portugal
  { Iata: 'LIS', Nome: 'Aeroporto de Lisboa', Cidade: 'Lisboa', Pais: 'Portugal' },
  { Iata: 'OPO', Nome: 'Aeroporto do Porto', Cidade: 'Porto', Pais: 'Portugal' },
  { Iata: 'FAO', Nome: 'Aeroporto de Faro', Cidade: 'Faro', Pais: 'Portugal' },
  
  // Espanha
  { Iata: 'MAD', Nome: 'Aeroporto de Madrid-Barajas', Cidade: 'Madrid', Pais: 'Espanha' },
  { Iata: 'BCN', Nome: 'Aeroporto de Barcelona-El Prat', Cidade: 'Barcelona', Pais: 'Espanha' },
  { Iata: 'PMI', Nome: 'Aeroporto de Palma de Maiorca', Cidade: 'Palma', Pais: 'Espanha' },
  
  // França
  { Iata: 'CDG', Nome: 'Aeroporto Charles de Gaulle', Cidade: 'Paris', Pais: 'França' },
  { Iata: 'ORY', Nome: 'Aeroporto de Orly', Cidade: 'Paris', Pais: 'França' },
  
  // Estados Unidos
  { Iata: 'JFK', Nome: 'Aeroporto Internacional John F. Kennedy', Cidade: 'Nova York', Pais: 'Estados Unidos' },
  { Iata: 'LAX', Nome: 'Aeroporto Internacional de Los Angeles', Cidade: 'Los Angeles', Pais: 'Estados Unidos' },
  { Iata: 'MIA', Nome: 'Aeroporto Internacional de Miami', Cidade: 'Miami', Pais: 'Estados Unidos' },
  { Iata: 'ORD', Nome: 'Aeroporto Internacional O\'Hare', Cidade: 'Chicago', Pais: 'Estados Unidos' },
  { Iata: 'DFW', Nome: 'Aeroporto Internacional Dallas/Fort Worth', Cidade: 'Dallas', Pais: 'Estados Unidos' },
  { Iata: 'ATL', Nome: 'Aeroporto Internacional Hartsfield-Jackson', Cidade: 'Atlanta', Pais: 'Estados Unidos' },
  
  // Reino Unido
  { Iata: 'LHR', Nome: 'Aeroporto de Heathrow', Cidade: 'Londres', Pais: 'Reino Unido' },
  { Iata: 'LGW', Nome: 'Aeroporto de Gatwick', Cidade: 'Londres', Pais: 'Reino Unido' },
  { Iata: 'STN', Nome: 'Aeroporto de Stansted', Cidade: 'Londres', Pais: 'Reino Unido' },
  
  // Itália
  { Iata: 'FCO', Nome: 'Aeroporto Leonardo da Vinci', Cidade: 'Roma', Pais: 'Itália' },
  { Iata: 'MXP', Nome: 'Aeroporto de Malpensa', Cidade: 'Milão', Pais: 'Itália' },
  
  // Alemanha
  { Iata: 'FRA', Nome: 'Aeroporto de Frankfurt', Cidade: 'Frankfurt', Pais: 'Alemanha' },
  
  // Holanda
  { Iata: 'AMS', Nome: 'Aeroporto de Schiphol', Cidade: 'Amsterdã', Pais: 'Holanda' }
];

// Função para buscar aeroportos localmente
export const searchAirportsLocally = (searchTerm) => {
  if (!searchTerm || searchTerm.length < 2) return [];
  
  const term = searchTerm.toLowerCase();
  return airportsDatabase.filter(airport => 
    airport.Iata.toLowerCase().includes(term) ||
    airport.Nome.toLowerCase().includes(term) ||
    airport.Cidade.toLowerCase().includes(term) ||
    airport.Pais.toLowerCase().includes(term)
  ).slice(0, 10);
};

// Função para buscar aeroportos por cidade
export const getAirportsByCity = (cityName) => {
  if (!cityName || typeof cityName !== 'string') {
    return [];
  }

  const normalizedCity = cityName.toLowerCase().trim();
  return cityToAirports[normalizedCity] || [];
};

// Função para buscar aeroportos por estado baseado nos aeroportos já mapeados
export const getAirportsByState = (stateName) => {
  if (!stateName || typeof stateName !== 'string') {
    return [];
  }

  const normalizedState = stateName.toLowerCase().trim();
  
  // Mapeamento de estados brasileiros e mundiais que têm aeroportos
  const stateAirports = {
    // Estados brasileiros
    'são paulo': [
      { Iata: 'GRU', Nome: 'Aeroporto Internacional de São Paulo/Guarulhos', Cidade: 'São Paulo', Pais: 'Brasil' },
      { Iata: 'CGH', Nome: 'Aeroporto de São Paulo/Congonhas', Cidade: 'São Paulo', Pais: 'Brasil' },
      { Iata: 'VCP', Nome: 'Aeroporto Internacional de Viracopos', Cidade: 'Campinas', Pais: 'Brasil' }
    ],
    'rio de janeiro': [
      { Iata: 'GIG', Nome: 'Aeroporto Internacional do Rio de Janeiro/Galeão', Cidade: 'Rio de Janeiro', Pais: 'Brasil' },
      { Iata: 'SDU', Nome: 'Aeroporto Santos Dumont', Cidade: 'Rio de Janeiro', Pais: 'Brasil' }
    ],
    'minas gerais': [
      { Iata: 'CNF', Nome: 'Aeroporto Internacional Tancredo Neves', Cidade: 'Belo Horizonte', Pais: 'Brasil' }
    ],
    'bahia': [
      { Iata: 'SSA', Nome: 'Aeroporto Internacional de Salvador', Cidade: 'Salvador', Pais: 'Brasil' }
    ],
    'ceará': [
      { Iata: 'FOR', Nome: 'Aeroporto Internacional de Fortaleza', Cidade: 'Fortaleza', Pais: 'Brasil' }
    ],
    'pernambuco': [
      { Iata: 'REC', Nome: 'Aeroporto Internacional do Recife', Cidade: 'Recife', Pais: 'Brasil' }
    ],
    'rio grande do sul': [
      { Iata: 'POA', Nome: 'Aeroporto Internacional de Porto Alegre', Cidade: 'Porto Alegre', Pais: 'Brasil' }
    ],
    'paraná': [
      { Iata: 'CWB', Nome: 'Aeroporto Internacional de Curitiba', Cidade: 'Curitiba', Pais: 'Brasil' }
    ],
    'distrito federal': [
      { Iata: 'BSB', Nome: 'Aeroporto Internacional de Brasília', Cidade: 'Brasília', Pais: 'Brasil' }
    ],
    'santa catarina': [
      { Iata: 'FLN', Nome: 'Aeroporto Internacional de Florianópolis', Cidade: 'Florianópolis', Pais: 'Brasil' }
    ],
    'espírito santo': [
      { Iata: 'VIX', Nome: 'Aeroporto de Vitória', Cidade: 'Vitória', Pais: 'Brasil' }
    ],
    'rio grande do norte': [
      { Iata: 'NAT', Nome: 'Aeroporto Internacional de Natal', Cidade: 'Natal', Pais: 'Brasil' }
    ],
    'alagoas': [
      { Iata: 'MCZ', Nome: 'Aeroporto Internacional de Maceió', Cidade: 'Maceió', Pais: 'Brasil' }
    ],
    'paraíba': [
      { Iata: 'JPA', Nome: 'Aeroporto Internacional de João Pessoa', Cidade: 'João Pessoa', Pais: 'Brasil' }
    ],
    'sergipe': [
      { Iata: 'AJU', Nome: 'Aeroporto Internacional de Aracaju', Cidade: 'Aracaju', Pais: 'Brasil' }
    ],
    'pará': [
      { Iata: 'BEL', Nome: 'Aeroporto Internacional de Belém', Cidade: 'Belém', Pais: 'Brasil' }
    ],
    'amazonas': [
      { Iata: 'MAO', Nome: 'Aeroporto Internacional de Manaus', Cidade: 'Manaus', Pais: 'Brasil' }
    ],
    
    // Estados americanos
    'florida': [
      { Iata: 'MIA', Nome: 'Aeroporto Internacional de Miami', Cidade: 'Miami', Pais: 'Estados Unidos' }
    ],
    'california': [
      { Iata: 'LAX', Nome: 'Aeroporto Internacional de Los Angeles', Cidade: 'Los Angeles', Pais: 'Estados Unidos' }
    ],
    'new york': [
      { Iata: 'JFK', Nome: 'Aeroporto Internacional John F. Kennedy', Cidade: 'Nova York', Pais: 'Estados Unidos' }
    ],
    'illinois': [
      { Iata: 'ORD', Nome: 'Aeroporto Internacional O\'Hare', Cidade: 'Chicago', Pais: 'Estados Unidos' }
    ],
    'texas': [
      { Iata: 'DFW', Nome: 'Aeroporto Internacional Dallas/Fort Worth', Cidade: 'Dallas', Pais: 'Estados Unidos' }
    ],
    'georgia': [
      { Iata: 'ATL', Nome: 'Aeroporto Internacional Hartsfield-Jackson', Cidade: 'Atlanta', Pais: 'Estados Unidos' }
    ],
    
    // Regiões europeias
    'madrid': [
      { Iata: 'MAD', Nome: 'Aeroporto de Madrid-Barajas', Cidade: 'Madrid', Pais: 'Espanha' }
    ],
    'catalunha': [
      { Iata: 'BCN', Nome: 'Aeroporto de Barcelona-El Prat', Cidade: 'Barcelona', Pais: 'Espanha' }
    ],
    'île-de-france': [
      { Iata: 'CDG', Nome: 'Aeroporto Charles de Gaulle', Cidade: 'Paris', Pais: 'França' },
      { Iata: 'ORY', Nome: 'Aeroporto de Orly', Cidade: 'Paris', Pais: 'França' }
    ],
    'lombardia': [
      { Iata: 'MXP', Nome: 'Aeroporto de Malpensa', Cidade: 'Milão', Pais: 'Itália' }
    ],
    'lazio': [
      { Iata: 'FCO', Nome: 'Aeroporto Leonardo da Vinci', Cidade: 'Roma', Pais: 'Itália' }
    ]
  };

  return stateAirports[normalizedState] || [];
};

// Mapeamento de países para aeroportos reais
// Apenas aeroportos que existem realmente na API Moblix

export const countryAirports = {
  // Brasil
  'brasil': [
    { Iata: 'GRU', Nome: 'Aeroporto Internacional de São Paulo/Guarulhos', Cidade: 'São Paulo', Pais: 'Brasil' },
    { Iata: 'CGH', Nome: 'Aeroporto de São Paulo/Congonhas', Cidade: 'São Paulo', Pais: 'Brasil' },
    { Iata: 'VCP', Nome: 'Aeroporto Internacional de Viracopos', Cidade: 'Campinas', Pais: 'Brasil' },
    { Iata: 'BSB', Nome: 'Aeroporto Internacional de Brasília', Cidade: 'Brasília', Pais: 'Brasil' },
    { Iata: 'CNF', Nome: 'Aeroporto Internacional Tancredo Neves', Cidade: 'Belo Horizonte', Pais: 'Brasil' },
    { Iata: 'SDU', Nome: 'Aeroporto Santos Dumont', Cidade: 'Rio de Janeiro', Pais: 'Brasil' },
    { Iata: 'GIG', Nome: 'Aeroporto Internacional do Rio de Janeiro/Galeão', Cidade: 'Rio de Janeiro', Pais: 'Brasil' },
    { Iata: 'SSA', Nome: 'Aeroporto Internacional de Salvador', Cidade: 'Salvador', Pais: 'Brasil' },
    { Iata: 'FOR', Nome: 'Aeroporto Internacional de Fortaleza', Cidade: 'Fortaleza', Pais: 'Brasil' },
    { Iata: 'REC', Nome: 'Aeroporto Internacional do Recife', Cidade: 'Recife', Pais: 'Brasil' },
    { Iata: 'POA', Nome: 'Aeroporto Internacional de Porto Alegre', Cidade: 'Porto Alegre', Pais: 'Brasil' },
    { Iata: 'BEL', Nome: 'Aeroporto Internacional de Belém', Cidade: 'Belém', Pais: 'Brasil' },
    { Iata: 'MAO', Nome: 'Aeroporto Internacional de Manaus', Cidade: 'Manaus', Pais: 'Brasil' },
    { Iata: 'CWB', Nome: 'Aeroporto Internacional de Curitiba', Cidade: 'Curitiba', Pais: 'Brasil' },
    { Iata: 'FLN', Nome: 'Aeroporto Internacional de Florianópolis', Cidade: 'Florianópolis', Pais: 'Brasil' },
    { Iata: 'VIX', Nome: 'Aeroporto de Vitória', Cidade: 'Vitória', Pais: 'Brasil' },
    { Iata: 'NAT', Nome: 'Aeroporto Internacional de Natal', Cidade: 'Natal', Pais: 'Brasil' },
    { Iata: 'MCZ', Nome: 'Aeroporto Internacional de Maceió', Cidade: 'Maceió', Pais: 'Brasil' },
    { Iata: 'JPA', Nome: 'Aeroporto Internacional de João Pessoa', Cidade: 'João Pessoa', Pais: 'Brasil' },
    { Iata: 'AJU', Nome: 'Aeroporto Internacional de Aracaju', Cidade: 'Aracaju', Pais: 'Brasil' }
  ],

  // Portugal
  'portugal': [
    { Iata: 'LIS', Nome: 'Aeroporto de Lisboa', Cidade: 'Lisboa', Pais: 'Portugal' },
    { Iata: 'OPO', Nome: 'Aeroporto do Porto', Cidade: 'Porto', Pais: 'Portugal' },
    { Iata: 'FAO', Nome: 'Aeroporto de Faro', Cidade: 'Faro', Pais: 'Portugal' },
    { Iata: 'FNC', Nome: 'Aeroporto da Madeira', Cidade: 'Funchal', Pais: 'Portugal' },
    { Iata: 'PDL', Nome: 'Aeroporto dos Açores', Cidade: 'Ponta Delgada', Pais: 'Portugal' }
  ],

  // Espanha
  'espanha': [
    { Iata: 'MAD', Nome: 'Aeroporto de Madrid-Barajas', Cidade: 'Madrid', Pais: 'Espanha' },
    { Iata: 'BCN', Nome: 'Aeroporto de Barcelona-El Prat', Cidade: 'Barcelona', Pais: 'Espanha' },
    { Iata: 'PMI', Nome: 'Aeroporto de Palma de Maiorca', Cidade: 'Palma', Pais: 'Espanha' },
    { Iata: 'LPA', Nome: 'Aeroporto de Las Palmas', Cidade: 'Las Palmas', Pais: 'Espanha' },
    { Iata: 'SVQ', Nome: 'Aeroporto de Sevilha', Cidade: 'Sevilha', Pais: 'Espanha' },
    { Iata: 'VLC', Nome: 'Aeroporto de Valência', Cidade: 'Valência', Pais: 'Espanha' }
  ],

  // França
  'frança': [
    { Iata: 'CDG', Nome: 'Aeroporto Charles de Gaulle', Cidade: 'Paris', Pais: 'França' },
    { Iata: 'ORY', Nome: 'Aeroporto de Orly', Cidade: 'Paris', Pais: 'França' },
    { Iata: 'NCE', Nome: 'Aeroporto de Nice', Cidade: 'Nice', Pais: 'França' },
    { Iata: 'LYS', Nome: 'Aeroporto de Lyon', Cidade: 'Lyon', Pais: 'França' },
    { Iata: 'MRS', Nome: 'Aeroporto de Marselha', Cidade: 'Marselha', Pais: 'França' }
  ],

  // Estados Unidos
  'estados unidos': [
    { Iata: 'JFK', Nome: 'Aeroporto Internacional John F. Kennedy', Cidade: 'Nova York', Pais: 'Estados Unidos' },
    { Iata: 'LAX', Nome: 'Aeroporto Internacional de Los Angeles', Cidade: 'Los Angeles', Pais: 'Estados Unidos' },
    { Iata: 'MIA', Nome: 'Aeroporto Internacional de Miami', Cidade: 'Miami', Pais: 'Estados Unidos' },
    { Iata: 'ORD', Nome: 'Aeroporto Internacional O\'Hare', Cidade: 'Chicago', Pais: 'Estados Unidos' },
    { Iata: 'DFW', Nome: 'Aeroporto Internacional Dallas/Fort Worth', Cidade: 'Dallas', Pais: 'Estados Unidos' },
    { Iata: 'ATL', Nome: 'Aeroporto Internacional Hartsfield-Jackson', Cidade: 'Atlanta', Pais: 'Estados Unidos' }
  ],

  'eua': [
    { Iata: 'JFK', Nome: 'Aeroporto Internacional John F. Kennedy', Cidade: 'Nova York', Pais: 'Estados Unidos' },
    { Iata: 'LAX', Nome: 'Aeroporto Internacional de Los Angeles', Cidade: 'Los Angeles', Pais: 'Estados Unidos' },
    { Iata: 'MIA', Nome: 'Aeroporto Internacional de Miami', Cidade: 'Miami', Pais: 'Estados Unidos' },
    { Iata: 'ORD', Nome: 'Aeroporto Internacional O\'Hare', Cidade: 'Chicago', Pais: 'Estados Unidos' },
    { Iata: 'DFW', Nome: 'Aeroporto Internacional Dallas/Fort Worth', Cidade: 'Dallas', Pais: 'Estados Unidos' },
    { Iata: 'ATL', Nome: 'Aeroporto Internacional Hartsfield-Jackson', Cidade: 'Atlanta', Pais: 'Estados Unidos' }
  ],

  // Argentina
  'argentina': [
    { Iata: 'EZE', Nome: 'Aeroporto Internacional Ezeiza', Cidade: 'Buenos Aires', Pais: 'Argentina' },
    { Iata: 'AEP', Nome: 'Aeroporto Jorge Newbery', Cidade: 'Buenos Aires', Pais: 'Argentina' },
    { Iata: 'COR', Nome: 'Aeroporto de Córdoba', Cidade: 'Córdoba', Pais: 'Argentina' },
    { Iata: 'MDZ', Nome: 'Aeroporto de Mendoza', Cidade: 'Mendoza', Pais: 'Argentina' },
    { Iata: 'BRC', Nome: 'Aeroporto de Bariloche', Cidade: 'Bariloche', Pais: 'Argentina' }
  ],

  // Chile
  'chile': [
    { Iata: 'SCL', Nome: 'Aeroporto Internacional de Santiago', Cidade: 'Santiago', Pais: 'Chile' },
    { Iata: 'IPC', Nome: 'Aeroporto de Ilha de Páscoa', Cidade: 'Ilha de Páscoa', Pais: 'Chile' },
    { Iata: 'CCP', Nome: 'Aeroporto de Concepción', Cidade: 'Concepción', Pais: 'Chile' }
  ],

  // Uruguai
  'uruguai': [
    { Iata: 'MVD', Nome: 'Aeroporto Internacional de Montevidéu', Cidade: 'Montevidéu', Pais: 'Uruguai' },
    { Iata: 'PDP', Nome: 'Aeroporto de Punta del Este', Cidade: 'Punta del Este', Pais: 'Uruguai' }
  ],

  // Paraguai
  'paraguai': [
    { Iata: 'ASU', Nome: 'Aeroporto Internacional Silvio Pettirossi', Cidade: 'Assunção', Pais: 'Paraguai' }
  ],

  // Colômbia
  'colombia': [
    { Iata: 'BOG', Nome: 'Aeroporto Internacional El Dorado', Cidade: 'Bogotá', Pais: 'Colômbia' },
    { Iata: 'MDE', Nome: 'Aeroporto Internacional José María Córdova', Cidade: 'Medellín', Pais: 'Colômbia' },
    { Iata: 'CTG', Nome: 'Aeroporto Internacional Rafael Núñez', Cidade: 'Cartagena', Pais: 'Colômbia' },
    { Iata: 'CLO', Nome: 'Aeroporto Internacional Alfonso Bonilla Aragón', Cidade: 'Cali', Pais: 'Colômbia' }
  ],

  // Peru
  'peru': [
    { Iata: 'LIM', Nome: 'Aeroporto Internacional Jorge Chávez', Cidade: 'Lima', Pais: 'Peru' },
    { Iata: 'CUZ', Nome: 'Aeroporto Internacional Alejandro Velasco Astete', Cidade: 'Cusco', Pais: 'Peru' }
  ],

  // Panamá
  'panama': [
    { Iata: 'PTY', Nome: 'Aeroporto Internacional de Tocumen', Cidade: 'Cidade do Panamá', Pais: 'Panamá' }
  ],

  // Costa Rica
  'costa rica': [
    { Iata: 'SJO', Nome: 'Aeroporto Internacional Juan Santamaría', Cidade: 'San José', Pais: 'Costa Rica' }
  ],

  // Reino Unido
  'reino unido': [
    { Iata: 'LHR', Nome: 'Aeroporto de Heathrow', Cidade: 'Londres', Pais: 'Reino Unido' },
    { Iata: 'LGW', Nome: 'Aeroporto de Gatwick', Cidade: 'Londres', Pais: 'Reino Unido' },
    { Iata: 'STN', Nome: 'Aeroporto de Stansted', Cidade: 'Londres', Pais: 'Reino Unido' },
    { Iata: 'MAN', Nome: 'Aeroporto de Manchester', Cidade: 'Manchester', Pais: 'Reino Unido' }
  ],

  'inglaterra': [
    { Iata: 'LHR', Nome: 'Aeroporto de Heathrow', Cidade: 'Londres', Pais: 'Reino Unido' },
    { Iata: 'LGW', Nome: 'Aeroporto de Gatwick', Cidade: 'Londres', Pais: 'Reino Unido' },
    { Iata: 'STN', Nome: 'Aeroporto de Stansted', Cidade: 'Londres', Pais: 'Reino Unido' },
    { Iata: 'MAN', Nome: 'Aeroporto de Manchester', Cidade: 'Manchester', Pais: 'Reino Unido' }
  ],

  // Itália
  'italia': [
    { Iata: 'FCO', Nome: 'Aeroporto Leonardo da Vinci', Cidade: 'Roma', Pais: 'Itália' },
    { Iata: 'MXP', Nome: 'Aeroporto de Malpensa', Cidade: 'Milão', Pais: 'Itália' },
    { Iata: 'VCE', Nome: 'Aeroporto Marco Polo', Cidade: 'Veneza', Pais: 'Itália' },
    { Iata: 'NAP', Nome: 'Aeroporto de Nápoles', Cidade: 'Nápoles', Pais: 'Itália' }
  ],

  // Alemanha
  'alemanha': [
    { Iata: 'FRA', Nome: 'Aeroporto de Frankfurt', Cidade: 'Frankfurt', Pais: 'Alemanha' },
    { Iata: 'MUC', Nome: 'Aeroporto de Munique', Cidade: 'Munique', Pais: 'Alemanha' },
    { Iata: 'BER', Nome: 'Aeroporto de Berlim Brandenburg', Cidade: 'Berlim', Pais: 'Alemanha' },
    { Iata: 'DUS', Nome: 'Aeroporto de Düsseldorf', Cidade: 'Düsseldorf', Pais: 'Alemanha' }
  ],

  // Holanda
  'holanda': [
    { Iata: 'AMS', Nome: 'Aeroporto de Schiphol', Cidade: 'Amsterdã', Pais: 'Holanda' }
  ],

  // Bélgica
  'belgica': [
    { Iata: 'BRU', Nome: 'Aeroporto de Bruxelas', Cidade: 'Bruxelas', Pais: 'Bélgica' }
  ],

  // Suíça
  'suica': [
    { Iata: 'ZUR', Nome: 'Aeroporto de Zurique', Cidade: 'Zurique', Pais: 'Suíça' },
    { Iata: 'GVA', Nome: 'Aeroporto de Genebra', Cidade: 'Genebra', Pais: 'Suíça' }
  ]
};

// Função para calcular similaridade usando a distância de Levenshtein
function calculateSimilarity(term1, term2) {
  const track = Array(term2.length + 1).fill(null).map(() =>
    Array(term1.length + 1).fill(null));
  for (let i = 0; i <= term1.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= term2.length; j += 1) {
    track[j][0] = j;
  }
  for (let j = 1; j <= term2.length; j += 1) {
    for (let i = 1; i <= term1.length; i += 1) {
      const indicator = term1[i - 1] === term2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // Delete
        track[j - 1][i] + 1, // Insert
        track[j - 1][i - 1] + indicator, // Substitute
      );
    }
  }
  return 1 - (track[term2.length][term1.length] / Math.max(term1.length, term2.length));
}

// Função para determinar o país mais similar
export const getMostSimilarCountry = (term) => {
  if (!term || typeof term !== 'string') {
    return null;
  }

  const normalizedTerm = term.toLowerCase().trim();
  let mostSimilar = null;
  let highestSimilarity = 0;

  Object.keys(countryAirports).forEach(country => {
    const similarity = calculateSimilarity(normalizedTerm, country);
    if (similarity > highestSimilarity) {
      highestSimilarity = similarity;
      mostSimilar = country;
    }
  });

  return mostSimilar;
};

// Função para buscar aeroportos por país
export const getAirportsByCountry = (countryName) => {
  if (!countryName || typeof countryName !== 'string') {
    return [];
  }

  const normalizedCountry = countryName.toLowerCase().trim();
  const airports = countryAirports[normalizedCountry] || [];
  if (airports.length === 0) {
    const similarCountry = getMostSimilarCountry(countryName);
    return similarCountry ? countryAirports[similarCountry] : [];
  }
  return airports;
};

// Função para buscar países similares (fuzzy search)
export const findSimilarCountries = (term, threshold = 0.6) => {
  if (!term || typeof term !== 'string') {
    return [];
  }

  const normalizedTerm = term.toLowerCase().trim();
  const similarCountries = [];

  Object.keys(countryAirports).forEach(country => {
    const similarity = calculateSimilarity(normalizedTerm, country);
    if (similarity >= threshold) {
      similarCountries.push({
        country,
        similarity,
        airports: countryAirports[country]
      });
    }
  });

  // Ordenar por similaridade (maior primeiro)
  return similarCountries.sort((a, b) => b.similarity - a.similarity);
};

// Função para verificar se um termo é um país ou similar
export const isCountryName = (term) => {
  if (!term || typeof term !== 'string') {
    return false;
  }

  const normalizedTerm = term.toLowerCase().trim();
  
  // Verifica se é um país exato
  if (Object.keys(countryAirports).includes(normalizedTerm)) {
    return true;
  }
  
  // Verifica se existe algum país similar com alta similaridade
  const similarCountries = findSimilarCountries(term, 0.7);
  return similarCountries.length > 0;
};

// Função para obter todos os aeroportos de países similares
export const getAirportsByCountryFuzzy = (term, threshold = 0.6) => {
  if (!term || typeof term !== 'string') {
    return [];
  }

  const normalizedTerm = term.toLowerCase().trim();
  
  // Primeiro, tenta busca exata
  const exactMatch = countryAirports[normalizedTerm];
  if (exactMatch) {
    return exactMatch;
  }
  
  // Se não encontrar, busca países similares
  const similarCountries = findSimilarCountries(term, threshold);
  if (similarCountries.length === 0) {
    return [];
  }
  
  // Retorna os aeroportos do país mais similar
  return similarCountries[0].airports;
};

export default countryAirports;
