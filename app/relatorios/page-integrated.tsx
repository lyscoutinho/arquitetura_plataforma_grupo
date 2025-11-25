"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "../../components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { PageHeader } from "../../components/page-header"
import { useAppContext } from "@/app/context/AppContext"
import { apiGetRelatorios } from "@/lib/api"
import { ArrowUp, ArrowDown, BarChart3, FileText, Download, Calendar, Loader2 } from 'lucide-react'

export default function RelatoriosPage() {
  const { addNotification } = useAppContext()
  const [relatorios, setRelatorios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [termoBusca, setTermoBusca] = useState("")

  useEffect(() => {
    carregarRelatorios()
  }, [])

  const carregarRelatorios = async () => {
    setLoading(true)
    try {
      const dados = await apiGetRelatorios()
      setRelatorios(dados || [])
    } catch (error) {
      addNotification({
        type: "error",
        message: "Erro ao carregar relatórios"
      })
    } finally {
      setLoading(false)
    }
  }

  const relatoriosFiltrados = relatorios.filter(rel =>
    rel.nome?.toLowerCase().includes(termoBusca.toLowerCase())
  )

  return (
    <DashboardLayout>
      <PageHeader
        title="Relatórios"
        description="Analise dados e gere relatórios do sistema"
        actions={
          <div className="flex gap-2">
            <Button className="bg-orange-500 hover:bg-orange-600">Novo Relatório</Button>
          </div>
        }
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Relatórios" }]}
      />

      {/* Métricas sobre a atividade de relatórios - uso e estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Relatórios Totais</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">{relatorios.length}</div>
            <p className="mt-1 flex items-center text-xs text-green-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              +5 desde ontem
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Disponíveis</CardTitle>
              <Download className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">
              {relatorios.filter(r => r.status === 'Disponível').length}
            </div>
            <p className="mt-1 flex items-center text-xs text-green-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              +18% este mês
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Processando</CardTitle>
              <Calendar className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">
              {relatorios.filter(r => r.status === 'Processando').length}
            </div>
            <p className="mt-1 flex items-center text-xs text-blue-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              Próximos 7 dias
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Tamanho Total</CardTitle>
              <FileText className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">
              {(relatorios.reduce((acc, r) => acc + (r.tamanho || 0), 0) / 1024).toFixed(1)} MB
            </div>
            <p className="mt-1 flex items-center text-xs text-green-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              +24 este mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Centro de relatórios - aqui ficam todos os documentos gerados */}
      <Card className="border-gray-800 bg-black">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Relatórios Disponíveis</CardTitle>
            {/* Sistema de busca para localizar relatórios específicos */}
            <div className="flex gap-2">
              <Input
                placeholder="Buscar relatórios..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className="w-64 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Tabela com informações detalhadas de cada relatório */}
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-300">Nome do Relatório</TableHead>
                  <TableHead className="text-gray-300">Tipo</TableHead>
                  <TableHead className="text-gray-300">Período</TableHead>
                  <TableHead className="text-gray-300">Tamanho</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {relatoriosFiltrados.length > 0 ? (
                  relatoriosFiltrados.map((relatorio) => (
                    <TableRow key={relatorio.id} className="border-gray-800 hover:bg-gray-900">
                      <TableCell className="text-white font-medium">{relatorio.nome}</TableCell>
                      <TableCell className="text-gray-300">{relatorio.tipo}</TableCell>
                      <TableCell className="text-gray-300">{relatorio.periodo}</TableCell>
                      <TableCell className="text-white">{(relatorio.tamanho / 1024).toFixed(1)} MB</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            relatorio.status === "Disponível" 
                              ? "bg-green-500/15 text-green-400 border-green-500/20" 
                              : relatorio.status === "Processando"
                              ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/20"
                              : "bg-red-500/15 text-red-400 border-red-500/20"
                          }
                        >
                          {relatorio.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {relatorio.status === "Disponível" ? (
                            <>
                              <Button className="bg-orange-500 hover:bg-orange-600 text-white text-xs py-1">
                                <Download className="h-3 w-3 mr-1" />
                                Download
                              </Button>
                              <Button 
                                className="border border-gray-700 bg-transparent text-gray-300 hover:bg-gray-800 text-xs py-1"
                              >
                                Ver
                              </Button>
                            </>
                          ) : (
                            <Button 
                              className="border border-gray-700 bg-transparent text-gray-500 text-xs py-1" 
                              disabled
                            >
                              Aguardar
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                      Nenhum relatório encontrado.
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
