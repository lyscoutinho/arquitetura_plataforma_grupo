"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter, Loader2, CheckCircle } from 'lucide-react'
import { PageHeader } from "@/components/page-header" // Verifique se este componente existe, se não, use um título simples
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/status-badge" // Verifique se existe
import { useAppContext } from "@/app/context/AppContext" // IMPORTANTE: Contexto da Arquitetura SPA
import { ReembolsoService } from "@/Services/reembolso-service"
import { Reembolso } from "@/Types/reembolso"

export default function ReembolsosPage() {
  // Integração com a arquitetura SPA do grupo
  const { addNotification } = useAppContext()

  const [reembolsos, setReembolsos] = useState<Reembolso[]>([])
  const [loading, setLoading] = useState(true)
  const [termoBusca, setTermoBusca] = useState("")

  // Função que busca os dados do nosso Service (Mock)
  const carregarDados = async () => {
    setLoading(true)
    try {
      const dados = await ReembolsoService.listarTodos()
      setReembolsos(dados)
    } catch (error) {
      addNotification({ type: "error", message: "Erro ao carregar reembolsos" })
    } finally {
      setLoading(false)
    }
  }

  // Carrega assim que a tela abre
  useEffect(() => {
    carregarDados()
  }, [])

  const handleAprovar = async (id: string) => {
    await ReembolsoService.atualizarStatus(id, 'Aprovado')
    addNotification({ type: "success", message: `Reembolso #${id} aprovado com sucesso!` })
    carregarDados() // Atualiza a lista
  }

  // Filtro local simples
  const listaFiltrada = reembolsos.filter(r => 
    r.descricao.toLowerCase().includes(termoBusca.toLowerCase()) ||
    r.nomeFuncionario.toLowerCase().includes(termoBusca.toLowerCase())
  )

  return (
    <DashboardLayout>
      {/* Se PageHeader não existir, troque por uma div com h1 */}
      <PageHeader
        title="Gestão de Reembolsos"
        description="Visualize e gerencie solicitações de despesas"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Reembolsos" }]}
        actions={
          <Button className="bg-orange-500 hover:bg-orange-600" asChild>
            <Link href="/reembolsos/novo">
              <Plus className="mr-2 h-4 w-4" />
              Nova Solicitação
            </Link>
          </Button>
        }
      />

      <Card className="border-gray-800 bg-black mt-6">
        <CardContent className="p-4">
          {/* Barra de Busca */}
          <div className="flex items-center gap-2 rounded-md border border-gray-800 bg-gray-950 px-2 py-1 mb-4">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar por descrição ou funcionário..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="h-8 border-0 bg-transparent text-sm placeholder:text-gray-500 focus-visible:ring-0 text-white"
            />
          </div>

          <Tabs defaultValue="todas">
            <TabsList className="grid w-full grid-cols-4 bg-gray-950">
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
              <TabsTrigger value="aprovadas">Aprovadas</TabsTrigger>
              <TabsTrigger value="rejeitadas">Rejeitadas</TabsTrigger>
            </TabsList>

            <TabsContent value="todas" className="mt-4">
              <div className="rounded-lg border border-gray-800">
                {loading ? (
                  <div className="flex h-40 items-center justify-center text-white">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader className="bg-gray-950">
                      <TableRow className="border-gray-800 hover:bg-gray-900">
                        <TableHead className="text-gray-400">Funcionário</TableHead>
                        <TableHead className="text-gray-400">Categoria</TableHead>
                        <TableHead className="text-gray-400">Valor</TableHead>
                        <TableHead className="text-gray-400">Status</TableHead>
                        <TableHead className="text-gray-400 text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {listaFiltrada.map((item) => (
                        <TableRow key={item.id} className="border-gray-800 hover:bg-gray-900/50">
                          <TableCell className="text-white font-medium">{item.nomeFuncionario}</TableCell>
                          <TableCell className="text-gray-300">{item.categoria}</TableCell>
                          <TableCell className="text-gray-300">
                            {item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </TableCell>
                          <TableCell>
                            {/* Se StatusBadge não existir, use um span simples */}
                            {item.status === 'Aprovado' ? (
                              <span className="px-2 py-1 rounded bg-green-900/30 text-green-400 text-xs">Aprovado</span>
                            ) : item.status === 'Rejeitado' ? (
                              <span className="px-2 py-1 rounded bg-red-900/30 text-red-400 text-xs">Rejeitado</span>
                            ) : (
                              <span className="px-2 py-1 rounded bg-yellow-900/30 text-yellow-400 text-xs">Pendente</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.status === 'Pendente' && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => handleAprovar(item.id)}
                                className="text-green-500 hover:text-green-400 hover:bg-green-950"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" /> Aprovar
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}