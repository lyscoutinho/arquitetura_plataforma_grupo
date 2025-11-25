"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "@/components/page-header"
import { useAppContext } from "@/app/context/AppContext"
import { apiGetUsers, apiCreateUser } from "@/lib/api"
import { Users, UserPlus, ArrowUp, Loader2, Plus } from 'lucide-react'

export default function MembrosPage() {
  const router = useRouter()
  const { addNotification } = useAppContext()
  const [openModal, setOpenModal] = useState(false)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    diretoria: ""
  })

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const res = await apiGetUsers()
      setMembers(res || [])
    } catch (err) {
      addNotification({
        type: "error",
        message: "Erro ao buscar membros"
      })
      console.error("Erro ao buscar membros:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const handleSave = async () => {
    if (!form.nome || !form.email || !form.senha || !form.diretoria) {
      addNotification({
        type: "warning",
        message: "Preencha todos os campos obrigatórios"
      })
      return
    }

    try {
      await apiCreateUser(form)
      addNotification({
        type: "success",
        message: "Membro criado com sucesso!"
      })
      setOpenModal(false)
      setForm({ nome: "", email: "", senha: "", diretoria: "" })
      fetchMembers()
    } catch (err: any) {
      addNotification({
        type: "error",
        message: err.message || "Erro ao salvar membro"
      })
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
            <Plus className="mr-2 h-4 w-4" />
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

              <Input
                placeholder="Nome completo"
                className="bg-black border-gray-700 text-white"
                value={form.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
              />

              <Input
                placeholder="Email"
                className="bg-black border-gray-700 text-white"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />

              <Input
                placeholder="Senha"
                type="password"
                className="bg-black border-gray-700 text-white"
                value={form.senha}
                onChange={(e) => handleChange("senha", e.target.value)}
              />

              {/* SELECT DE DIRETORIA */}
              <select
                className="p-3 rounded-lg bg-black border border-gray-700 text-white"
                value={form.diretoria}
                onChange={(e) => handleChange("diretoria", e.target.value)}
              >
                <option value="">Selecione a diretoria</option>
                <option value="comercial">Comercial</option>
                <option value="marketing">Marketing</option>
                <option value="operacoes">Operações</option>
                <option value="projetos">Projetos</option>
                <option value="presidencia organizacional">Presidência Organizacional</option>
                <option value="presidencia institucional">Presidência Institucional</option>
              </select>

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
              {members.filter((m: any) => m.ativo !== false).length}
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
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-300">ID</TableHead>
                  <TableHead className="text-gray-300">Nome</TableHead>
                  <TableHead className="text-gray-300">Email</TableHead>
                  <TableHead className="text-gray-300">Diretoria</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {members.map((membro: any) => (
                  <TableRow key={membro.id} className="border-gray-800 hover:bg-gray-900">
                    <TableCell className="text-white font-medium">{membro.id}</TableCell>
                    <TableCell className="text-white">{membro.nome}</TableCell>
                    <TableCell className="text-gray-300">{membro.email}</TableCell>
                    <TableCell className="text-gray-300">{membro.diretoria || '-'}</TableCell>
                    <TableCell>
                      <Badge className={membro.ativo !== false ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}>
                        {membro.ativo !== false ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          )}
        </CardContent>
      </Card>

    </DashboardLayout>
  )
}
