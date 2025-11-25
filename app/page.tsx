"use client"

import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, DollarSign, Package, Receipt, Users, LogIn, FileText, Briefcase, AlertCircle } from 'lucide-react'
import { PageHeader } from "@/components/page-header"
import { useAppContext } from "@/app/context/AppContext"
import { useSPANavigation } from "@/hooks/use-spa-navigation"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts"

// Mock Data for Charts
const revenueData = [
  { name: "Jan", total: 15000 },
  { name: "Fev", total: 22000 },
  { name: "Mar", total: 18000 },
  { name: "Abr", total: 28000 },
  { name: "Mai", total: 24000 },
  { name: "Jun", total: 35000 },
]

const contractStatusData = [
  { name: "Ativos", value: 12, color: "#22c55e" }, // green-500
  { name: "Finalizados", value: 8, color: "#3b82f6" }, // blue-500
  { name: "Cancelados", value: 2, color: "#ef4444" }, // red-500
  { name: "Pendentes", value: 4, color: "#eab308" }, // yellow-500
]

const reimbursementCategoryData = [
  { name: "Transporte", value: 4500 },
  { name: "Alimentação", value: 3200 },
  { name: "Hospedagem", value: 2100 },
  { name: "Outros", value: 800 },
]

export default function Dashboard() {
  const { addNotification, userInfo, setUserInfo } = useAppContext()
  const { navigate } = useSPANavigation()

  const handleWelcomeUser = () => {
    if (!userInfo) {
      setUserInfo({
        id: "1",
        name: "João Silva",
        email: "joao@empresa.com",
        role: "admin"
      })
      addNotification({
        type: "success",
        message: "Bem-vindo ao Sistema ERP!"
      })
    }
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        description="Visão geral de Contratos, Clientes e Reembolsos"
        actions={
          <div className="flex gap-2">
            <Button onClick={() => navigate("/login", true)}
              className="bg-gray-700 hover:bg-gray-600 text-white">
              <div className="flex items-center gap-2">
              {userInfo ? `Olá, ${userInfo.name}` : <><LogIn className="h-4 w-4" /> Login</>}
              </div></Button>

            <Link href="/transacao/nova" passHref>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20">
                Nova Transação
              </Button>
            </Link>
          </div>
        }
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Dashboard" }]}
      />

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
            <div className="text-2xl font-bold text-white">R$ 142.000,00</div>
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
            <div className="text-2xl font-bold text-white">12</div>
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
            <div className="text-2xl font-bold text-white">8</div>
            <p className="text-xs text-gray-400">
              Valor total: R$ 3.240,50
            </p>
          </CardContent>
        </Card>
        <Card className="border-gray-800 bg-black">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Clientes Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">24</div>
            <p className="text-xs text-gray-400">
              +2 novos clientes este mês
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
              {[
                { nome: "João Silva", desc: "Combustível - Visita Cliente", valor: "R$ 120,00", status: "Pendente", time: "2h atrás" },
                { nome: "Maria Santos", desc: "Almoço Corporativo", valor: "R$ 85,50", status: "Aprovado", time: "5h atrás" },
                { nome: "Pedro Costa", desc: "Material de Escritório", valor: "R$ 245,30", status: "Pendente", time: "1 dia atrás" },
                { nome: "Ana Oliveira", desc: "Hospedagem - Conferência", valor: "R$ 1.200,00", status: "Em Análise", time: "2 dias atrás" },
              ].map((item, i) => (
                <div key={i} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-white">{item.nome}</p>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                  <div className="ml-auto font-medium text-white">{item.valor}</div>
                  <div className={`ml-4 text-xs px-2 py-1 rounded-full ${item.status === 'Aprovado' ? 'bg-green-500/20 text-green-400' :
                      item.status === 'Pendente' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                    }`}>
                    {item.status}
                  </div>
                </div>
              ))}
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
            <Button className="w-full justify-start bg-orange-500 text-white hover:bg-orange-600" asChild>
              <Link href="/reembolsos/novo">
                <Receipt className="mr-2 h-4 w-4" />
                Solicitar Reembolso
              </Link>
            </Button>
            <Button className="w-full justify-start border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-white bg-transparent border" asChild>
              <Link href="/contratos/novo">
                <FileText className="mr-2 h-4 w-4" />
                Novo Contrato
              </Link>
            </Button>
            <Button className="w-full justify-start border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-white bg-transparent border" asChild>
              <Link href="/clientes/novo">
                <Users className="mr-2 h-4 w-4" />
                Cadastrar Cliente
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
