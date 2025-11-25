'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">🧪 Teste de Rotas</h1>
        
        <p className="text-gray-400 mb-8">
          Use esta página para testar as rotas sem autenticação. 
          Clique nos botões abaixo para navegar.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="border-gray-800 bg-black">
            <CardHeader>
              <CardTitle className="text-orange-500">Autenticação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/login" className="block">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  → /login
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-black">
            <CardHeader>
              <CardTitle className="text-blue-500">Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dashboard" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  → /dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-black">
            <CardHeader>
              <CardTitle className="text-green-500">Clientes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/clientes" className="block">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  → /clientes
                </Button>
              </Link>
              <Link href="/clientes/novo" className="block">
                <Button className="w-full bg-green-700 hover:bg-green-800 text-sm">
                  → /clientes/novo
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-black">
            <CardHeader>
              <CardTitle className="text-purple-500">Contratos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/contratos" className="block">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  → /contratos
                </Button>
              </Link>
              <Link href="/contratos/novo" className="block">
                <Button className="w-full bg-purple-700 hover:bg-purple-800 text-sm">
                  → /contratos/novo
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-black">
            <CardHeader>
              <CardTitle className="text-yellow-500">Reembolsos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/reembolsos" className="block">
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                  → /reembolsos
                </Button>
              </Link>
              <Link href="/reembolsos/novo" className="block">
                <Button className="w-full bg-yellow-700 hover:bg-yellow-800 text-sm">
                  → /reembolsos/novo
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-black">
            <CardHeader>
              <CardTitle className="text-cyan-500">Relatórios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/relatorios" className="block">
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                  → /relatorios
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-black">
            <CardHeader>
              <CardTitle className="text-pink-500">Membros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/membros" className="block">
                <Button className="w-full bg-pink-600 hover:bg-pink-700">
                  → /membros
                </Button>
              </Link>
              <Link href="/users" className="block">
                <Button className="w-full bg-pink-700 hover:bg-pink-800 text-sm">
                  → /users (alias)
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Info Box */}
        <Card className="border-gray-800 bg-black">
          <CardHeader>
            <CardTitle className="text-white">ℹ️ Informações</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-400 space-y-2">
            <p>✅ Frontend está rodando em <code className="bg-gray-900 px-2 py-1 rounded">http://localhost:3000</code></p>
            <p>✅ Backend precisa estar em <code className="bg-gray-900 px-2 py-1 rounded">http://localhost:3001</code></p>
            <p>✅ Middleware em modo desenvolvimento (sem autenticação rigorosa)</p>
            <p>🔗 Confira o arquivo <code className="bg-gray-900 px-2 py-1 rounded">DEBUG_LOGIN.md</code> para resolver problemas</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
