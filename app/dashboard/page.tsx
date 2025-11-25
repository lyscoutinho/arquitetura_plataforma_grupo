"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, DollarSign, Package, Receipt, Users, LogIn, FileText, Briefcase, AlertCircle, Loader2 } from 'lucide-react'
import { PageHeader } from "@/components/page-header"
import { useAppContext } from "@/app/context/AppContext"
import { useSPANavigation } from "@/hooks/use-spa-navigation"
import { apiGetDashboardData } from "@/lib/api"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts"

// Mock Data for Charts (fallback)
const revenueData = [
  { name: "Jan", total: 15000 },
  { name: "Fev", total: 22000 },
  { name: "Mar", total: 18000 },
  { name: "Abr", total: 28000 },
  { name: "Mai", total: 24000 },
  { name: "Jun", total: 35000 },
]

const contractStatusData = [
  { name: "Ativos", value: 12, color: "#22c55e" },
  { name: "Finalizados", value: 8, color: "#3b82f6" },
  { name: "Cancelados", value: 2, color: "#ef4444" },
  { name: "Pendentes", value: 4, color: "#eab308" },
]

export default function Dashboard() {
  const { addNotification, userInfo } = useAppContext()
  const { navigate } = useSPANavigation()
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    setLoading(true)
    try {
      const dados = await apiGetDashboardData()
      setDashboardData(dados)
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error)
      addNotification({
        type: "error",
        message: "Erro ao carregar dados do dashboard"
      })
    } finally {
      setLoading(false)
    }
  }

  const kpis = dashboardData?.kpis || {
    receitaTotal: 142000,
    reembolsosPendentes: { total: 3240.50, quantidade: 8 },
    funcionariosAtivos: 24,
    totalContratos: 12
  }

  const recentReembolsos = dashboardData?.reembolsosRecentes || []

  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        description="Visão geral de Contratos, Clientes e Reembolsos"
        actions={
          <div className="flex gap-2">
            <Button className="bg-gray-700 hover:bg-gray-600 text-white">
              <div className="flex items-center gap-2">
                {userInfo ? `Olá, ${userInfo.nome}` : <><LogIn className="h-4 w-4" /> Login</>}
              </div>
            </Button>
          </div>
        }
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Dashboard" }]}
      />

      {loading ? (
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-gray-800 bg-black">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Receita de Contratos
                </CardTitle>
                <DollarSign className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  R$ {(kpis.receitaTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-gray-400">
                  +20.1% em relação ao mês passado
                </p>
              </CardContent>
            </Card>
            <Card className="border-gray-800 bg-black">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Contratos Ativos
                </CardTitle>
                <Briefcase className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{kpis.totalContratos || 0}</div>
                <p className="text-xs text-gray-400">
                  4 contratos finalizando este mês
                </p>
              </CardContent>
            </Card>
            <Card className="border-gray-800 bg-black">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Reembolsos Pendentes
                </CardTitle>
                <Receipt className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{kpis.reembolsosPendentes?.quantidade || 0}</div>
                <p className="text-xs text-gray-400">
                  Valor total: R$ {(kpis.reembolsosPendentes?.total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </CardContent>
            </Card>
            <Card className="border-gray-800 bg-black">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Funcionários Ativos
                </CardTitle>
                <Users className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{kpis.funcionariosAtivos || 0}</div>
                <p className="text-xs text-gray-400">
                  +2 novos este mês
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
            <Card className="col-span-4 border-gray-800 bg-black">
              <CardHeader>
                <CardTitle className="text-white">Receita Mensal</CardTitle>
                <CardDescription className="text-gray-400">
                  Faturamento dos últimos 6 meses
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={revenueData}>
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `R$${value}`}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                      cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                    />
                    <Bar dataKey="total" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3 border-gray-800 bg-black">
              <CardHeader>
                <CardTitle className="text-white">Status dos Contratos</CardTitle>
                <CardDescription className="text-gray-400">
                  Distribuição atual dos contratos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={contractStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {contractStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
            <Card className="col-span-2 border-gray-800 bg-black">
              <CardHeader>
                <CardTitle className="text-white">Últimos Reembolsos</CardTitle>
                <CardDescription className="text-gray-400">
                  Solicitações recentes que precisam de atenção
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {recentReembolsos.length > 0 ? (
                    recentReembolsos.map((item: any, i: number) => (
                      <div key={i} className="flex items-center">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none text-white">{item.funcionario}</p>
                          <p className="text-sm text-gray-400">{item.categoria}</p>
                        </div>
                        <div className="ml-auto font-medium text-white">
                          R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className={`ml-4 text-xs px-2 py-1 rounded-full ${item.status === 'Aprovado' ? 'bg-green-500/20 text-green-400' :
                          item.status === 'Pendente' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                          {item.status}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-center py-4">Nenhum reembolso recente</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-black">
              <CardHeader>
                <CardTitle className="text-white">Ações Rápidas</CardTitle>
                <CardDescription className="text-gray-400">
                  Atalhos para as tarefas mais comuns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/reembolsos/novo" className="block">
                  <Button className="w-full justify-start bg-orange-500 text-white hover:bg-orange-600">
                    <Receipt className="mr-2 h-4 w-4" />
                    Solicitar Reembolso
                  </Button>
                </Link>
                <Link href="/contratos/novo" className="block">
                  <Button className="w-full justify-start border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-white bg-transparent border">
                    <FileText className="mr-2 h-4 w-4" />
                    Novo Contrato
                  </Button>
                </Link>
                <Link href="/clientes/novo" className="block">
                  <Button className="w-full justify-start border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-white bg-transparent border">
                    <Users className="mr-2 h-4 w-4" />
                    Cadastrar Cliente
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
