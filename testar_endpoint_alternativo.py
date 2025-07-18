#!/usr/bin/env python3
"""
Teste com endpoint alternativo da API
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

def testar_endpoint(token, endpoint, payload, descricao):
    """Testa um endpoint específico"""
    url = f"https://api.moblix.com.br{endpoint}"
    
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': f'Bearer {token}',
        'Origin': 'externo'
    }
    
    try:
        print(f"\n🔍 Testando: {descricao}")
        print(f"📡 Endpoint: {endpoint}")
        print(f"📦 Payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(url, headers=headers, json=payload)
        print(f"📊 Status: {response.status_code}")
        
        if response.status_code == 200:
            resultado = response.json()
            
            # Salvar resultado
            filename = f"teste_{descricao.replace(' ', '_').replace('/', '_')}.json"
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(resultado, f, indent=2, ensure_ascii=False)
            
            # Verificar se há voos
            total_voos = 0
            if 'Data' in resultado and isinstance(resultado['Data'], list):
                for data_item in resultado['Data']:
                    if 'flights' in data_item:
                        total_voos += len(data_item['flights'])
            
            print(f"✅ Total de voos encontrados: {total_voos}")
            print(f"🔍 Sucesso: {resultado.get('Success', 'N/A')}")
            
            return total_voos > 0
        else:
            print(f"❌ Erro HTTP: {response.status_code}")
            print(f"📝 Resposta: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def main():
    print("🚀 Testando endpoints alternativos da API Moblix")
    
    # Obter token
    token = obter_token()
    if not token:
        print("❌ Falha ao obter token")
        return
    
    print("✅ Token obtido com sucesso")
    
    # Payload base para CNF → SDU
    payload_base = {
        "Origem": "CNF",
        "Destino": "SDU",
        "Ida": "2025-07-20",
        "Adultos": 1,
        "Criancas": 0,
        "Bebes": 0
    }
    
    # Testar diferentes endpoints e variações de payload
    testes = [
        # Endpoint original
        {
            "endpoint": "/api/ConsultaAereo/Consultar",
            "payload": {**payload_base, "Companhia": -1},
            "descricao": "Endpoint original - Todas as companhias"
        },
        
        # Endpoint alternativo encontrado
        {
            "endpoint": "/aereo/api/consulta",
            "payload": {**payload_base, "companhia": -1},
            "descricao": "Endpoint alternativo - Todas as companhias"
        },
        
        # Endpoint alternativo com estrutura diferente
        {
            "endpoint": "/aereo/api/consulta",
            "payload": {
                "Origem": "CNF",
                "Destino": "SDU", 
                "Ida": "2025-07-20",
                "Adultos": 1,
                "Criancas": 0,
                "Bebes": 0,
                "companhia": 3  # Azul
            },
            "descricao": "Endpoint alternativo - Azul"
        },
        
        # Teste com VCP (hub da Azul)
        {
            "endpoint": "/aereo/api/consulta",
            "payload": {
                "Origem": "VCP",
                "Destino": "GIG",
                "Ida": "2025-07-20",
                "Adultos": 1,
                "Criancas": 0,
                "Bebes": 0,
                "companhia": 3  # Azul
            },
            "descricao": "Endpoint alternativo - VCP para GIG (Azul)"
        },
        
        # Teste com GRU → GIG (rota popular)
        {
            "endpoint": "/aereo/api/consulta",
            "payload": {
                "Origem": "GRU",
                "Destino": "GIG",
                "Ida": "2025-07-20",
                "Adultos": 1,
                "Criancas": 0,
                "Bebes": 0,
                "companhia": 1  # LATAM
            },
            "descricao": "Endpoint alternativo - GRU para GIG (LATAM)"
        }
    ]
    
    voos_encontrados = 0
    
    for teste in testes:
        if testar_endpoint(token, teste["endpoint"], teste["payload"], teste["descricao"]):
            voos_encontrados += 1
    
    print(f"\n📈 Resumo:")
    print(f"✅ Testes com voos: {voos_encontrados}")
    print(f"❌ Testes sem voos: {len(testes) - voos_encontrados}")
    print(f"📊 Total de testes: {len(testes)}")

if __name__ == "__main__":
    main()
