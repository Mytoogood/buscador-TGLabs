#!/usr/bin/env python3
"""
Script para buscar o voo mais barato de CNF (Confins) para Lisboa
usando a API da Moblix
"""

import requests
import json
from datetime import datetime, timedelta
import sys

class MoblixAPI:
    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.base_url = "https://api.moblix.com.br/api"
        self.access_token = None
        
    def obter_token(self):
        """Obtém o token de acesso da API"""
        url = f"{self.base_url}/Token"
        
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Origin': 'externo'
        }
        
        data = {
            'grant_type': 'password',
            'username': self.username,
            'password': self.password
        }
        
        try:
            response = requests.post(url, headers=headers, data=data)
            response.raise_for_status()
            
            token_data = response.json()
            self.access_token = token_data.get('access_token')
            
            if self.access_token:
                print("✅ Token obtido com sucesso!")
                return True
            else:
                print("❌ Erro: Token não encontrado na resposta")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Erro ao obter token: {e}")
            return False
            
    def buscar_voos(self, origem, destino, data_ida, adultos=1, criancas=0, bebes=0):
        """Busca voos disponíveis"""
        if not self.access_token:
            print("❌ Token não disponível. Execute obter_token() primeiro.")
            return None
            
        url = f"{self.base_url}/ConsultaAereo/Consultar"
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.access_token}'
        }
        
        payload = {
            "Origem": origem,
            "Destino": destino,
            "Ida": data_ida,
            "Adultos": adultos,
            "Criancas": criancas,
            "Bebes": bebes,
            "Companhia": -1  # Todas as companhias
        }
        
        try:
            print(f"🔍 Buscando voos de {origem} para {destino} em {data_ida}...")
            response = requests.post(url, headers=headers, json=payload)
            response.raise_for_status()
            
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Erro na consulta de voos: {e}")
            if hasattr(e, 'response') and e.response:
                print(f"Resposta do servidor: {e.response.text}")
            return None
            
    def encontrar_voo_mais_barato(self, resultado_busca):
        """Encontra o voo mais barato nos resultados"""
        if not resultado_busca:
            return None
            
        # A estrutura exata da resposta pode variar, adaptando conforme necessário
        voos = []
        
        # Tentando diferentes estruturas possíveis da resposta
        if 'Voos' in resultado_busca:
            voos = resultado_busca['Voos']
        elif 'voos' in resultado_busca:
            voos = resultado_busca['voos']
        elif 'data' in resultado_busca:
            voos = resultado_busca['data']
        elif 'flights' in resultado_busca:
            voos = resultado_busca['flights']
        elif isinstance(resultado_busca, list):
            voos = resultado_busca
        elif 'Data' in resultado_busca and isinstance(resultado_busca['Data'], list):
            # Para a estrutura da API Moblix
            for data_item in resultado_busca['Data']:
                if 'flights' in data_item:
                    voos.extend(data_item['flights'])
            
        if not voos:
            print("❌ Nenhum voo encontrado nos resultados")
            return None
            
        # Procurar pelo voo mais barato
        voo_mais_barato = None
        menor_preco = float('inf')
        
        for voo in voos:
            # Diferentes possíveis campos de preço
            preco = None
            for campo_preco in ['Preco', 'preco', 'Valor', 'valor', 'PrecoTotal', 'precoTotal']:
                if campo_preco in voo:
                    preco = float(voo[campo_preco])
                    break
                    
            if preco and preco < menor_preco:
                menor_preco = preco
                voo_mais_barato = voo
                
        return voo_mais_barato, menor_preco
        
    def exibir_detalhes_voo(self, voo, preco):
        """Exibe os detalhes do voo encontrado"""
        print("\n" + "="*50)
        print("🎯 VOO MAIS BARATO ENCONTRADO")
        print("="*50)
        print(f"💰 Preço: R$ {preco:.2f}")
        
        # Exibir outros detalhes disponíveis
        campos_interesse = [
            'Companhia', 'companhia', 'Cia',
            'Saida', 'saida', 'HoraSaida', 'horaSaida',
            'Chegada', 'chegada', 'HoraChegada', 'horaChegada',
            'Duracao', 'duracao', 'TempoVoo', 'tempoVoo',
            'Escalas', 'escalas', 'NumeroEscalas', 'numeroEscalas'
        ]
        
        for campo in campos_interesse:
            if campo in voo:
                print(f"📋 {campo}: {voo[campo]}")
                
        print("\n📄 Dados completos do voo:")
        print(json.dumps(voo, indent=2, ensure_ascii=False))

def main():
    # Configurações
    USERNAME = "TooGood"
    PASSWORD = "23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7"
    
    # Códigos dos aeroportos
    ORIGEM = "CNF"  # Confins/Belo Horizonte
    DESTINO = "SDU"  # Santos Dumont/Rio de Janeiro
    
    # Data da viagem fixada
    data_ida = "2025-07-19"
        
    print(f"📅 Data da viagem: {data_ida}")
    
    # Inicializar API
    api = MoblixAPI(USERNAME, PASSWORD)
    
    # Obter token
    if not api.obter_token():
        print("❌ Falha ao obter token. Verifique as credenciais.")
        sys.exit(1)
        
    # Buscar voos
    resultado = api.buscar_voos(ORIGEM, DESTINO, data_ida)
    
    if not resultado:
        print("❌ Falha na busca de voos.")
        sys.exit(1)
        
    # Salvar resultado completo para análise
    with open('resultado_busca_voos.json', 'w', encoding='utf-8') as f:
        json.dump(resultado, f, indent=2, ensure_ascii=False)
    print("💾 Resultado completo salvo em 'resultado_busca_voos.json'")
    
    # Encontrar voo mais barato
    voo_barato = api.encontrar_voo_mais_barato(resultado)
    
    if voo_barato:
        voo, preco = voo_barato
        api.exibir_detalhes_voo(voo, preco)
    else:
        print("❌ Não foi possível encontrar o voo mais barato.")
        print("📋 Estrutura da resposta:")
        print(json.dumps(resultado, indent=2, ensure_ascii=False)[:500] + "...\n(continua)")

if __name__ == "__main__":
    main()
