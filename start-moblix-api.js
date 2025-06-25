#!/usr/bin/env node

/**
 * Script para inicializar a API da Moblix
 * Execute: node start-moblix-api.js
 */

import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

const API_PORT = 3001;

async function verificarDependencias() {
  console.log('📦 Verificando dependências...');
  
  try {
    const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
    
    const dependenciasNecessarias = [
      'express',
      'cors',
      'jsonwebtoken',
      'uuid'
    ];
    
    const dependenciasFaltando = dependenciasNecessarias.filter(dep => 
      !packageJson.dependencies || !packageJson.dependencies[dep]
    );
    
    if (dependenciasFaltando.length > 0) {
      console.log('❌ Dependências faltando:', dependenciasFaltando.join(', '));
      console.log('💡 Execute: npm install express cors jsonwebtoken uuid');
      return false;
    }
    
    console.log('✅ Todas as dependências estão instaladas');
    return true;
  } catch (error) {
    console.log('❌ Erro ao verificar package.json:', error.message);
    return false;
  }
}

function verificarPorta() {
  return new Promise((resolve) => {
    const comando = process.platform === 'win32' 
      ? `netstat -an | findstr :${API_PORT}`
      : `lsof -i :${API_PORT}`;
    
    exec(comando, (error, stdout) => {
      if (stdout.trim()) {
        console.log(`⚠️  Porta ${API_PORT} já está em uso`);
        resolve(false);
      } else {
        console.log(`✅ Porta ${API_PORT} está disponível`);
        resolve(true);
      }
    });
  });
}

async function iniciarAPI() {
  console.log('🚀 Iniciando API da Moblix...\n');
  
  // Verificar dependências
  const dependenciasOk = await verificarDependencias();
  if (!dependenciasOk) {
    process.exit(1);
  }
  
  // Verificar porta
  const portaDisponivel = await verificarPorta();
  if (!portaDisponivel) {
    console.log('💡 Tente matar o processo ou usar outra porta');
    process.exit(1);
  }
  
  console.log('🔧 Configurações da API:');
  console.log(`   📍 Porta: ${API_PORT}`);
  console.log(`   🔐 Username: TooGood`);
  console.log(`   🎯 Endpoint principal: /moblix-api/api/Pedido/EmitirPedido`);
  console.log('');
  
  // Importar e executar a API
  try {
    const { default: app } = await import('./src/moblix-api.js');
    console.log('✅ API da Moblix iniciada com sucesso!');
    console.log('');
    console.log('📋 URLs importantes:');
    console.log(`   Status: http://localhost:${API_PORT}/moblix-api/status`);
    console.log(`   Login: POST http://localhost:${API_PORT}/auth/login`);
    console.log(`   Criar Bilhete: POST http://localhost:${API_PORT}/moblix-api/api/Pedido/EmitirPedido`);
    console.log('');
    console.log('🧪 Para testar a API, execute em outro terminal:');
    console.log('   node test-moblix-api.js');
    console.log('');
    console.log('⏹️  Para parar a API: Ctrl+C');
    
  } catch (error) {
    console.error('❌ Erro ao iniciar a API:', error.message);
    process.exit(1);
  }
}

// Capturar sinais de interrupção
process.on('SIGINT', () => {
  console.log('\n🛑 Parando API da Moblix...');
  console.log('👋 API encerrada com sucesso!');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Parando API da Moblix...');
  console.log('👋 API encerrada com sucesso!');
  process.exit(0);
});

// Iniciar a API
iniciarAPI().catch(console.error);
