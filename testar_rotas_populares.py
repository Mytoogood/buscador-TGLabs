#!/usr/bin/env python3
"""
Script para testar rotas populares e verificar se a API está funcionando
"""

import requests
import json

def obter_token():
    """Obtém token de acesso"""
    url = "https://api.moblix.com.br/api/Token"
    
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'externo'
    }
    
    data = {
        'grant_type': 'password',
        'username': 'TooGood',
        'password': '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7'
    }
    
    try:
        response = requests.post(url, headers=headers, data=data)
        response.raise_for_status()
        token_data = response.json()
        return token_data.get('access_token')
    except Exception as e:
        print(f"Erro ao obter token: {e}")
        return None

def testar_rota(token, origem, destino, data, descricao):
    """Testa uma rota específica"""
    url = "https://api.moblix.com.br/api/ConsultaAereo/Consultar"
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    }
    
    payload = {
        "Origem": origem,
        "Destino": destino,
        "Ida": data,
        "Adultos": 1,
        "Criancas": 0,
        "Bebes": 0,
        "Companhia": -1  # Todas as companhias
    }
    
    try:
        print(f"\n🔍 Testando: {descricao} ({origem} → {destino}) - {data}")
        response = requests.post(url, headers=headers, json=payload)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            resultado = response.json()
            
            # Salvar resultado
            filename = f"resultado_{origem}_{destino}_{data.replace('-', '')}.json"
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(resultado, f, indent=2, ensure_ascii=False)
            
            # Verificar se há voos
            total_voos = 0
            if 'Data' in resultado and isinstance(resultado['Data'], list):
                for data_item in resultado['Data']:
                    if 'flights' in data_item:
                        total_voos += len(data_item['flights'])
            
            print(f"📊 Total de voos encontrados: {total_voos}")
            
            # Verificar provedores ativos
            if 'Data' in resultado and len(resultado['Data']) > 0:
                providers = resultado['Data'][0].get('ActiveProviders', [])
                print(f"✈️ Provedores ativos: {', '.join(providers)}")
            
            return total_voos > 0
        else:
            print(f"❌ Erro HTTP: {response.status_code}")
            print(f"Resposta: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def main():
    print("🚀 Testando rotas populares brasileiras")
    
    # Obter token
    token = obter_token()
    if not token:
        print("❌ Falha ao obter token")
        return
    
    print("✅ Token obtido com sucesso")
    
    # Rotas populares para testar
    rotas_teste = [
        ("GRU", "GIG", "2025-07-20", "São Paulo Guarulhos → Rio Galeão"),
        ("GRU", "SDU", "2025-07-20", "São Paulo Guarulhos → Rio Santos Dumont"),
        ("CGH", "GIG", "2025-07-20", "São Paulo Congonhas → Rio Galeão"),
        ("CGH", "SDU", "2025-07-20", "São Paulo Congonhas → Rio Santos Dumont"),
        ("GRU", "BSB", "2025-07-20", "São Paulo Guarulhos → Brasília"),
        ("GIG", "GRU", "2025-07-20", "Rio Galeão → São Paulo Guarulhos"),
        ("SDU", "GRU", "2025-07-20", "Rio Santos Dumont → São Paulo Guarulhos"),
        ("CNF", "GRU", "2025-07-20", "Belo Horizonte → São Paulo Guarulhos"),
        ("CNF", "BSB", "2025-07-20", "Belo Horizonte → Brasília"),
        ("CNF", "GIG", "2025-07-20", "Belo Horizonte → Rio Galeão"),
        ("CNF", "SDU", "2025-07-20", "Belo Horizonte → Rio Santos Dumont"),
    ]
    
    voos_encontrados = 0
    total_testes = len(rotas_teste)
    
    for origem, destino, data, descricao in rotas_teste:
        if testar_rota(token, origem, destino, data, descricao):
            voos_encontrados += 1
    
    print(f"\n📈 Resumo:")
    print(f"✅ Rotas com voos: {voos_encontrados}")
    print(f"❌ Rotas sem voos: {total_testes - voos_encontrados}")
    print(f"📊 Total de rotas testadas: {total_testes}")
    
    if voos_encontrados == 0:
        print("\n🔍 Nenhuma rota retornou voos. Possíveis causas:")
        print("   1. Problema com credenciais da API")
        print("   2. Problema com parâmetros da requisição")
        print("   3. API sem dados para estas datas")
        print("   4. Problema de conectividade")
    else:
        print(f"\n✅ {voos_encontrados} rotas funcionaram corretamente!")

if __name__ == "__main__":
    main()
