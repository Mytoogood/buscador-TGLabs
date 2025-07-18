#!/usr/bin/env python3
"""
Script para testar especificamente rotas da GOL
"""

import requests
import json
from datetime import datetime, timedelta

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

def testar_gol_rota(token, origem, destino, data, descricao):
    """Testa uma rota específica da GOL"""
    url = "https://api.moblix.com.br/api/ConsultaAereo/Consultar"
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    }
    
    # Diferentes variações de payload para testar
    payloads = [
        {
            "nome": f"GOL Padrão - {descricao}",
            "payload": {
                "Origem": origem,
                "Destino": destino,
                "Ida": data,
                "Adultos": 1,
                "Criancas": 0,
                "Bebes": 0,
                "Companhia": 2  # GOL
            }
        },
        {
            "nome": f"GOL com Filtros - {descricao}",
            "payload": {
                "Origem": origem,
                "Destino": destino,
                "Ida": data,
                "Adultos": 1,
                "Criancas": 0,
                "Bebes": 0,
                "Companhia": 2,
                "Filtros": {
                    "Cias": ["Gol"]
                }
            }
        },
        {
            "nome": f"GOL Todas Companhias - {descricao}",
            "payload": {
                "Origem": origem,
                "Destino": destino,
                "Ida": data,
                "Adultos": 1,
                "Criancas": 0,
                "Bebes": 0,
                "Companhia": -1  # Todas, mas deve incluir GOL
            }
        }
    ]
    
    for config in payloads:
        print(f"\n🔍 {config['nome']}")
        print(f"📦 Payload: {json.dumps(config['payload'], indent=2)}")
        
        try:
            response = requests.post(url, headers=headers, json=config['payload'])
            print(f"📊 Status: {response.status_code}")
            
            if response.status_code == 200:
                resultado = response.json()
                
                # Salvar resultado
                filename = f"gol_teste_{origem}_{destino}_{data.replace('-', '')}_{config['nome'].replace(' ', '_').replace('-', '_')}.json"
                with open(filename, 'w', encoding='utf-8') as f:
                    json.dump(resultado, f, indent=2, ensure_ascii=False)
                
                # Analisar resultado
                analisar_resultado_gol(resultado, config['nome'])
                
            else:
                print(f"❌ Erro HTTP: {response.status_code}")
                print(f"Resposta: {response.text}")
                
        except Exception as e:
            print(f"❌ Erro: {e}")

def analisar_resultado_gol(resultado, nome_config):
    """Analisa o resultado específico da GOL"""
    print(f"📊 Análise para {nome_config}:")
    print(f"  ✅ Sucesso: {resultado.get('Success', 'N/A')}")
    print(f"  📈 Total itens: {resultado.get('TotalItens', 'N/A')}")
    
    if 'Data' in resultado and isinstance(resultado['Data'], list):
        for i, data_item in enumerate(resultado['Data']):
            print(f"  📦 Item {i+1}:")
            print(f"    - Companhia: {data_item.get('Companhia', 'N/A')}")
            print(f"    - Token: {data_item.get('TokenConsulta', 'N/A')}")
            print(f"    - SemDisponibilidade: {data_item.get('SemDisponibilidade', 'N/A')}")
            
            # Verificar estrutura Ida
            if 'Ida' in data_item:
                ida_voos = data_item['Ida']
                print(f"    - Voos Ida: {len(ida_voos)} voos")
                
                if ida_voos:
                    print(f"    - Primeiro voo: {json.dumps(ida_voos[0], indent=6, ensure_ascii=False)[:300]}...")
                else:
                    print(f"    - ⚠️ Array Ida está vazio")
            
            # Verificar se há flights em outras estruturas
            if 'flights' in data_item:
                flights = data_item['flights']
                print(f"    - Flights: {len(flights)} voos")

def main():
    print("🚀 Testando rotas específicas da GOL")
    
    # Obter token
    token = obter_token()
    if not token:
        print("❌ Falha ao obter token")
        return
    
    print("✅ Token obtido com sucesso")
    
    # Datas para testar (mais próximas)
    hoje = datetime.now()
    datas_teste = [
        (hoje + timedelta(days=1)).strftime('%Y-%m-%d'),   # Amanhã
        (hoje + timedelta(days=7)).strftime('%Y-%m-%d'),   # Próxima semana
        (hoje + timedelta(days=14)).strftime('%Y-%m-%d'),  # 2 semanas
        "2025-07-20",  # Data que sabemos que funcionou antes
    ]
    
    # Rotas para testar (incluindo códigos específicos)
    rotas_teste = [
        ("CNF", "SDU", "CNF → Santos Dumont"),
        ("CNF", "GIG", "CNF → Galeão"),
        ("CNF", "RIO", "CNF → Rio (genérico)"),
        ("GRU", "SDU", "Guarulhos → Santos Dumont (rota conhecida da GOL)"),
        ("CGH", "SDU", "Congonhas → Santos Dumont (rota executiva GOL)"),
    ]
    
    voos_encontrados = 0
    total_testes = 0
    
    for data in datas_teste[:2]:  # Testar apenas primeiras 2 datas
        for origem, destino, descricao in rotas_teste[:3]:  # Testar apenas primeiras 3 rotas
            total_testes += 1
            print(f"\n{'='*60}")
            print(f"📅 Data: {data}")
            testar_gol_rota(token, origem, destino, data, descricao)
    
    print(f"\n📈 Resumo dos testes concluído!")

if __name__ == "__main__":
    main()
