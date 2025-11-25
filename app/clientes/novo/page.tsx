"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/page-header"
import { useAppContext } from "@/app/context/AppContext"
import { apiCreateCliente } from "@/lib/api"
import { ChevronLeft, Loader2 } from 'lucide-react'

export default function NovoClientePage() {
  const router = useRouter()
  const { addNotification } = useAppContext()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nome: "",
    email: "",
    cnpj: "",
    cpf: "",
    telefone: ""
  })

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await apiCreateCliente(form)
      addNotification({
        type: "success",
        message: "Cliente criado com sucesso!"
      })
      router.push("/clientes")
    } catch (error: any) {
      addNotification({
        type: "error",
        message: error.message || "Erro ao criar cliente"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Novo Cliente"
        description="Cadastre um novo cliente no sistema"
        breadcrumbs={[
          { label: "Início", href: "/" },
          { label: "Clientes", href: "/clientes" },
          { label: "Novo" }
        ]}
      />

      <Card className="border-gray-800 bg-black max-w-2xl">
        <CardHeader>
          <CardTitle className="text-white">Informações do Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome *
              </label>
              <Input
                required
                value={form.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                className="bg-gray-900 border-gray-700 text-white"
                placeholder="Nome da empresa ou pessoa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email *
              </label>
              <Input
                required
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="bg-gray-900 border-gray-700 text-white"
                placeholder="email@empresa.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CNPJ
                </label>
                <Input
                  value={form.cnpj}
                  onChange={(e) => handleChange("cnpj", e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white"
                  placeholder="00.000.000/0000-00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CPF
                </label>
                <Input
                  value={form.cpf}
                  onChange={(e) => handleChange("cpf", e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white"
                  placeholder="000.000.000-00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Telefone *
              </label>
              <Input
                required
                value={form.telefone}
                onChange={(e) => handleChange("telefone", e.target.value)}
                className="bg-gray-900 border-gray-700 text-white"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="flex gap-2 pt-6">
              <Link href="/clientes">
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
                  "Salvar Cliente"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
