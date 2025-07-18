#!/usr/bin/env python3
"""
Script para buscar voos de CNF para RIO em 15/08/2025
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

def buscar_voos_cnf_rio(token):
    """Busca voos de CNF para RIO"""
    url = "https://api.moblix.com.br/api/ConsultaAereo/Consultar"
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    }
    
    # Testando diferentes datas (limitando para evitar muitas requisições)
    datas_teste = [
        "2025-07-15",  # Próxima semana
        "2025-07-20",  # Daqui a 8 dias
        "2025-08-15",  # Meio de agosto
    ]
    
    # Testando diferentes destinos no Rio
    destinos_teste = [
        "SDU",  # Santos Dumont
        "GIG",  # Galeão
    ]
    
    # Testando diferentes configurações
    configs = []
    
    for data in datas_teste:
        for destino in destinos_teste:
            configs.extend([
                {
                    "nome": f"Todas as companhias - {data} - {destino}",
                    "payload": {
                        "Origem": "CNF",
                        "Destino": destino,
                        "Ida": data,
                        "Adultos": 1,
                        "Criancas": 0,
                        "Bebes": 0,
                        "Companhia": -1  # Todas
                    }
                },
                {
                    "nome": f"GOL - {data} - {destino}",
                    "payload": {
                        "Origem": "CNF",
                        "Destino": destino,
                        "Ida": data,
                        "Adultos": 1,
                        "Criancas": 0,
                        "Bebes": 0,
                        "Companhia": 2,  # GOL é ID 2
                        "Filtros": {
                            "Cias": ["Gol"]
                        }
                    }
                },
                {
                    "nome": f"LATAM - {data} - {destino}",
                    "payload": {
                        "Origem": "CNF",
                        "Destino": destino,
                        "Ida": data,
                        "Adultos": 1,
                        "Criancas": 0,
                        "Bebes": 0,
                        "Companhia": 1,  # LATAM é ID 1
                        "Filtros": {
                            "Cias": ["Latam"]
                        }
                    }
                },
                {
                    "nome": f"AZUL - {data} - {destino}",
                    "payload": {
                        "Origem": "CNF",
                        "Destino": destino,
                        "Ida": data,
                        "Adultos": 1,
                        "Criancas": 0,
                        "Bebes": 0,
                        "Companhia": 3,  # AZUL é ID 3
                        "Filtros": {
                            "Cias": ["Azul"]
                        }
                    }
                }
            ])
    
    for config in configs:
        print(f"\n🔍 Testando: {config['nome']}")
        
        try:
            response = requests.post(url, headers=headers, json=config['payload'])
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                resultado = response.json()
                
                # Salvar resultado
                filename = f"resultado_{config['nome'].lower().replace(' ', '_')}.json"
                with open(filename, 'w', encoding='utf-8') as f:
                    json.dump(resultado, f, indent=2, ensure_ascii=False)
                
                # Analisar resultado
                analisar_resultado(resultado, config['nome'])
                
            else:
                print(f"❌ Erro HTTP: {response.status_code}")
                print(f"Resposta: {response.text}")
                
        except Exception as e:
            print(f"❌ Erro: {e}")

def analisar_resultado(resultado, nome_config):
    """Analisa o resultado da busca"""
    print(f"📊 Análise para {nome_config}:")
    
    if 'Data' in resultado and isinstance(resultado['Data'], list):
        for i, data_item in enumerate(resultado['Data']):
            if 'flights' in data_item:
                flights = data_item['flights']
                print(f"  📦 Grupo {i+1}: {len(flights)} voos")
                
                if flights:
                    # Mostrar primeiro voo como exemplo
                    primeiro_voo = flights[0]
                    print(f"  ✈️ Exemplo: {json.dumps(primeiro_voo, indent=4, ensure_ascii=False)[:200]}...")
                    
                    # Procurar preços
                    for voo in flights[:3]:  # Mostrar até 3 voos
                        preco = encontrar_preco(voo)
                        if preco:
                            print(f"  💰 Preço encontrado: R$ {preco}")
                        else:
                            print(f"  💰 Preço não encontrado em: {list(voo.keys())}")
            else:
                print(f"  📦 Grupo {i+1}: sem voos")
    
    # Verificar se há voos em outras estruturas
    if 'flights' in resultado:
        print(f"  📦 Voos diretos: {len(resultado['flights'])}")
    
    print(f"  ✅ Sucesso: {resultado.get('Success', 'N/A')}")
    print(f"  📈 Total itens: {resultado.get('TotalItens', 'N/A')}")

def encontrar_preco(voo):
    """Tenta encontrar o preço no voo"""
    campos_preco = ['price', 'Price', 'preco', 'Preco', 'valor', 'Valor', 'PrecoTotal', 'precoTotal']
    
    for campo in campos_preco:
        if campo in voo:
            return voo[campo]
    
    return None

def main():
    print("🚀 Buscando voos CNF → RIO para 15/08/2025")
    
    # Obter token
    token = obter_token()
    if not token:
        print("❌ Falha ao obter token")
        return
    
    print("✅ Token obtido com sucesso")
    
    # Buscar voos
    buscar_voos_cnf_rio(token)
    
    print("\n✅ Busca concluída!")

if __name__ == "__main__":
    main()
