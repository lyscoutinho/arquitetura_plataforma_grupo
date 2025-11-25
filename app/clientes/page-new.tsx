"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
// Imports para construir a interface de gestão de clientes
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "@/components/page-header"
import { useAppContext } from "@/app/context/AppContext"
import { apiGetClientes } from "@/lib/api"
// Ícones específicos para métricas de clientes - cada um representa um aspecto diferente
import { ArrowUp, ArrowDown, Users, UserPlus, Star, MapPin, Loader2 } from 'lucide-react'

export default function ClientesPage() {
  const { addNotification } = useAppContext()
  const [clientes, setClientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [termoBusca, setTermoBusca] = useState("")

  useEffect(() => {
    carregarClientes()
  }, [])

  const carregarClientes = async () => {
    setLoading(true)
    try {
      const dados = await apiGetClientes()
      setClientes(dados || [])
    } catch (error) {
      addNotification({
        type: "error",
        message: "Erro ao carregar clientes"
      })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nome?.toLowerCase().includes(termoBusca.toLowerCase()) ||
    cliente.email?.toLowerCase().includes(termoBusca.toLowerCase())
  )

  return (
    // Layout compartilhado com sidebar e estrutura padrão
    <DashboardLayout>
      {/* Cabeçalho específico da seção de clientes */}
      <PageHeader
        title="Clientes"
        description="Gerencie e acompanhe todos os clientes"
        actions={
          <div className="flex gap-2">
            <Link href="/clientes/novo">
              <Button className="bg-orange-500 hover:bg-orange-600">Novo Cliente</Button>
            </Link>
          </div>
        }
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Clientes" }]}
      />

      {/* Dashboard com os números principais da base de clientes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Total de Clientes</CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">{clientes.length}</div>
            <p className="mt-1 flex items-center text-xs text-green-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              Atualizado
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Clientes Ativos</CardTitle>
              <UserPlus className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">{clientes.filter(c => c.ativo !== false).length}</div>
            <p className="mt-1 flex items-center text-xs text-green-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              +0% desde ontem
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Clientes VIP</CardTitle>
              <Star className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">{clientes.filter(c => c.vip === true).length}</div>
            <p className="mt-1 flex items-center text-xs text-blue-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              +0 este mês
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Novos Hoje</CardTitle>
              <MapPin className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">0</div>
            <p className="mt-1 flex items-center text-xs text-green-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              +0 que ontem
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Diretório completo de clientes com informações de contato e histórico */}
      <Card className="border-gray-800 bg-black">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Lista de Clientes</CardTitle>
            {/* Ferramentas de busca para encontrar clientes rapidamente */}
            <div className="flex gap-2">
              <Input
                placeholder="Buscar clientes..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className="w-64 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Estrutura da tabela com todas as informações relevantes */}
          {loading ? (
            <div className="flex h-40 items-center justify-center text-white">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-300">ID</TableHead>
                  <TableHead className="text-gray-300">Nome</TableHead>
                  <TableHead className="text-gray-300">Email</TableHead>
                  <TableHead className="text-gray-300">Telefone</TableHead>
                  <TableHead className="text-gray-300">CNPJ/CPF</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Dados de exemplo dos clientes - normalmente viriam de uma API */}
                {clientesFiltrados.length > 0 ? (
                  clientesFiltrados.map((cliente) => (
                    <TableRow key={cliente.id} className="border-gray-800 hover:bg-gray-900">
                      <TableCell className="text-white font-medium">{cliente.id}</TableCell>
                      <TableCell className="text-white">{cliente.nome}</TableCell>
                      <TableCell className="text-gray-300">{cliente.email}</TableCell>
                      <TableCell className="text-gray-300">{cliente.telefone || '-'}</TableCell>
                      <TableCell className="text-gray-300">{cliente.cnpj || cliente.cpf || '-'}</TableCell>
                      <TableCell>
                        <Badge className={cliente.ativo !== false ? "bg-green-500/15 text-green-400 border-green-500/20" : "bg-red-500/15 text-red-400 border-red-500/20"}>
                          {cliente.ativo !== false ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                            Ver
                          </Button>
                          <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                            Editar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                      Nenhum cliente encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
