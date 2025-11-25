"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "@/components/page-header"
import { Users, UserPlus, Star, ArrowUp } from 'lucide-react'

export default function MembrosPage() {

  const [openModal, setOpenModal] = useState(false)
  const [members, setMembers] = useState([])

  // Campos do formulário
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    diretoria: "",
    status: "",
  })

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  // 🔥 Buscar membros reais da API
  const fetchMembers = async () => {
    try {
      const res = await fetch("http://localhost:3001/users")
      const data = await res.json()
      setMembers(data)
    } catch (err) {
      console.error("Erro ao buscar membros:", err)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  // 🔥 Enviar novo membro para API
  const handleSave = async () => {
    try {
      await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })

      setOpenModal(false)
      setForm({ name: "", email: "", password: "", diretoria: "", status: "" })
      fetchMembers()

    } catch (err) {
      console.error("Erro ao salvar membro:", err)
    }
  }

  return (
    <DashboardLayout>

      <PageHeader
        title="Membros"
        description="Gerencie e acompanhe todos os membros"
        actions={
          <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setOpenModal(true)}>
            Novo Membro
          </Button>
        }
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Membros" }]}
      />

      {/* Modal de Cadastro */}
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-[400px] shadow-xl">

            <h2 className="text-white text-xl font-semibold mb-4 text-center">Registrar Novo Membro</h2>

            <div className="flex flex-col gap-4">
              <Input placeholder="Nome completo" className="bg-black border-gray-700 text-white"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />

              <Input placeholder="Email" className="bg-black border-gray-700 text-white"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />

              <Input placeholder="Senha" className="bg-black border-gray-700 text-white"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />

              <Input placeholder="Diretoria" className="bg-black border-gray-700 text-white"
                value={form.diretoria}
                onChange={(e) => handleChange("diretoria", e.target.value)}
              />

              <Input placeholder="Status (Ativo, Inativo, Trainee)" className="bg-black border-gray-700 text-white"
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" className="border-gray-600 text-gray-300"
                onClick={() => setOpenModal(false)}
              >
                Cancelar
              </Button>

              <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleSave}>
                Salvar
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Total de Membros</CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">{members.length}</div>
            <p className="mt-1 flex items-center text-xs text-green-400">
              <ArrowUp className="mr-1 h-3 w-3" /> Atualizado automaticamente
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Ativos</CardTitle>
              <UserPlus className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">
              {members.filter(m => m.status?.toLowerCase() === "ativo").length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-black">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-300">Trainees</CardTitle>
              <Star className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-white">
              {members.filter(m => m.status?.toLowerCase() === "trainee").length}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Tabela */}
      <Card className="border-gray-800 bg-black">
        <CardHeader>
          <CardTitle className="text-white">Lista de Membros</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-300">ID</TableHead>
                <TableHead className="text-gray-300">Nome</TableHead>
                <TableHead className="text-gray-300">Email</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {members.map((membro: any) => (
                <TableRow key={membro.id} className="border-gray-800 hover:bg-gray-900">
                  <TableCell className="text-white font-medium">{membro.id}</TableCell>
                  <TableCell className="text-white">{membro.name}</TableCell>
                  <TableCell className="text-gray-300">{membro.email}</TableCell>

                  <TableCell>
                    <Badge
                      className={
                        membro.status === "Ativo"
                          ? "bg-green-500/15 text-green-400 border-green-500/20"
                          : membro.status === "Inativo"
                          ? "bg-red-500/15 text-red-400 border-red-500/20"
                          : "bg-yellow-500/15 text-yellow-400 border-yellow-500/20"
                      }
                    >
                      {membro.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </CardContent>
      </Card>

    </DashboardLayout>
  )
}

