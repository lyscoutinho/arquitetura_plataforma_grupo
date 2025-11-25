#!/bin/bash
# Script para testar a conexão com o backend

echo "🔍 Testando conectividade com o backend..."
echo ""

# Testa se a API está respondendo
echo "1️⃣  Testando GET / (ou /health se existir)..."
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:3001/

echo ""
echo "2️⃣  Testando POST /auth/login com credenciais de teste..."
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@email.com",
    "password": "123456"
  }' \
  -s | jq '.' 2>/dev/null || echo "Resposta (raw):"

echo ""
echo "3️⃣  Testando GET /users..."
curl -X GET http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -s | jq '.' 2>/dev/null || echo "Resposta (raw):"

echo ""
echo "✅ Testes completos!"
