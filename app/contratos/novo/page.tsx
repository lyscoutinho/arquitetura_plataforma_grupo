"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/page-header"
import { useAppContext } from "@/app/context/AppContext"
import { apiCreateContrato, apiGetClientes } from "@/lib/api"
import { ChevronLeft, Loader2 } from 'lucide-react'

export default function NovoContratoPage() {
  const router = useRouter()
  const { addNotification } = useAppContext()
  const [loading, setLoading] = useState(false)
  const [clientes, setClientes] = useState<any[]>([])
  const [form, setForm] = useState({
    clienteId: "",
    descricao: "",
    dataInicio: "",
    dataFim: "",
    status: "Ativo",
    valor: ""
  })

  useEffect(() => {
    carregarClientes()
  }, [])

  const carregarClientes = async () => {
    try {
      const dados = await apiGetClientes()
      setClientes(dados || [])
    } catch (error) {
      addNotification({
        type: "error",
        message: "Erro ao carregar clientes"
      })
    }
  }

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const dados = {
        ...form,
        valor: parseFloat(form.valor),
        dataInicio: new Date(form.dataInicio),
        dataFim: form.dataFim ? new Date(form.dataFim) : undefined
      }
      await apiCreateContrato(dados)
      addNotification({
        type: "success",
        message: "Contrato criado com sucesso!"
      })
      router.push("/contratos")
    } catch (error: any) {
      addNotification({
        type: "error",
        message: error.message || "Erro ao criar contrato"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Novo Contrato"
        description="Cadastre um novo contrato no sistema"
        breadcrumbs={[
          { label: "Início", href: "/" },
          { label: "Contratos", href: "/contratos" },
          { label: "Novo" }
        ]}
      />

      <Card className="border-gray-800 bg-black max-w-2xl">
        <CardHeader>
          <CardTitle className="text-white">Informações do Contrato</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cliente *
              </label>
              <select
                required
                value={form.clienteId}
                onChange={(e) => handleChange("clienteId", e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Selecione um cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descrição *
              </label>
              <Input
                required
                value={form.descricao}
                onChange={(e) => handleChange("descricao", e.target.value)}
                className="bg-gray-900 border-gray-700 text-white"
                placeholder="Descrição do contrato"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Data Início *
                </label>
                <Input
                  required
                  type="date"
                  value={form.dataInicio}
                  onChange={(e) => handleChange("dataInicio", e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Data Fim
                </label>
                <Input
                  type="date"
                  value={form.dataFim}
                  onChange={(e) => handleChange("dataFim", e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Valor *
                </label>
                <Input
                  required
                  type="number"
                  step="0.01"
                  value={form.valor}
                  onChange={(e) => handleChange("valor", e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Finalizado">Finalizado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-6">
              <Link href="/contratos">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Contrato"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
