#!/usr/bin/env python3
"""
Script simples para testar a API da Moblix
"""

import requests
import json

def testar_token():
    """Testa se conseguimos obter o token"""
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
    
    print("🔄 Testando obtenção de token...")
    
    try:
        response = requests.post(url, headers=headers, data=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            token_data = response.json()
            access_token = token_data.get('access_token')
            if access_token:
                print("✅ Token obtido com sucesso!")
                print(f"Token: {access_token[:50]}...")
                return access_token
            else:
                print("❌ Token não encontrado na resposta")
        else:
            print(f"❌ Erro HTTP: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Erro na requisição: {e}")
    
    return None

def testar_busca_voos(token):
    """Testa a busca de voos"""
    if not token:
        print("❌ Token não disponível para teste de busca")
        return
        
    url = "https://api.moblix.com.br/api/ConsultaAereo/Consultar"
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    }
    
    # Teste com BSB-GRU primeiro (como no exemplo)
    payload = {
        "Origem": "BSB",
        "Destino": "GRU", 
        "Ida": "2025-03-10",
        "Adultos": 1,
        "Criancas": 0,
        "Bebes": 0,
        "Companhia": 1
    }
    
    print("\n🔄 Testando busca de voos BSB -> GRU...")
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            resultado = response.json()
            print("✅ Busca realizada com sucesso!")
            
            # Salvar resultado para análise
            with open('teste_busca_voos.json', 'w', encoding='utf-8') as f:
                json.dump(resultado, f, indent=2, ensure_ascii=False)
            print("💾 Resultado salvo em 'teste_busca_voos.json'")
            
            # Mostrar estrutura básica
            print("\n📋 Estrutura da resposta:")
            print(json.dumps(resultado, indent=2, ensure_ascii=False)[:500] + "...")
            
        else:
            print(f"❌ Erro HTTP: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Erro na requisição: {e}")

if __name__ == "__main__":
    print("🚀 Iniciando teste da API Moblix...")
    
    # Testar token
    token = testar_token()
    
    # Testar busca de voos
    testar_busca_voos(token)
    
    print("\n✅ Teste concluído!")
