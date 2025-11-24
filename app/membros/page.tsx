"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "@/components/page-header"
import { ArrowUp, ArrowDown, Users, UserPlus, Star, MapPin } from 'lucide-react'
import { useState } from "react"
export default function MembrosPage() {
  
  const [openModal, setOpenModal] = useState(false);
  return (
    // Layout compartilhado com sidebar e estrutura padrão
    <DashboardLayout>
      {/* Cabeçalho específico da seção de membros */}
      <PageHeader
        title="Membros"
        description="Gerencie e acompanhe todos os membros"
        actions={
          <div className="flex gap-2">
            <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setOpenModal(true)}>
            Novo Membro
            </Button>
          </div>
        }
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Membros" }]}
      />
      {openModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-[400px] shadow-xl">
      <h2 className="text-white text-xl font-semibold mb-4 text-center">Registrar Novo Membro</h2>


      <div className="flex flex-col gap-4">
      <Input placeholder="Nome completo" className="bg-black border-gray-700 text-white" />
      <Input placeholder="Email" className="bg-black border-gray-700 text-white" />
      <Input placeholder="Senha Original" className="bg-black border-gray-700 text-white" />
      <Input placeholder="Diretoria" className="bg-black border-gray-700 text-white" />
      <Input placeholder="Status" className="bg-black border-gray-700 text-white" />
      </div>


      <div className="flex justify-end gap-3 mt-6">
      <Button variant="outline" className="border-gray-600 text-gray-300" onClick={() => setOpenModal(false)}>
      Cancelar
      </Button>
      <Button className="bg-orange-500 hover:bg-orange-600">Salvar</Button>
      </div>
      </div>
      </div>
      )}
          {/* Dashboard com os números principais da base de clientes */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card className="border-gray-800 bg-black">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-300">Total de Membros</CardTitle>
                  <Users className="h-4 w-4 text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-white">200</div>
                <p className="mt-1 flex items-center text-xs text-green-400">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  +12 novos este semestre
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-black">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-300">Membros Ativos</CardTitle>
                  <UserPlus className="h-4 w-4 text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-white">26</div>
                <p className="mt-1 flex items-center text-xs text-green-400">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  +8% em comparação com a última gestão
                </p>
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
                <div className="text-2xl font-semibold text-white">24</div>
                <p className="mt-1 flex items-center text-xs text-blue-400">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  +3% em comparação com a última gestão
                </p>
              </CardContent>
            </Card>

           
          </div>

          {/* Diretório completo de clientes com informações de contato e histórico */}
          <Card className="border-gray-800 bg-black">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Lista de Membros</CardTitle>
                {/* Ferramentas de busca para encontrar clientes rapidamente */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Buscar membros..."
                    className="w-64 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
                  />
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    Filtrar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Estrutura da tabela com todas as informações relevantes */}
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-gray-300">ID</TableHead>
                    <TableHead className="text-gray-300">Nome</TableHead>
                    <TableHead className="text-gray-300">Email</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Projetos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Dados de exemplo dos membros - normalmente viriam de uma API */}
                  {[
                    { id: "M001", nome: "João Costa", email: "joao.costa@engenetconsultoria.com.br",  status: "Ativo", projetos: "Projeto A" },
                    { id: "M002", nome: "Maria Santos", email: "maria.santos@engnetconsultoria.com.br", status: "Ativo", projetos: "Projeto B" },
                    { id: "M003", nome: "Pedro Costa", email: "pedro.costa@engnetconsultoria.com.br", status: "Ativo", projetos: "Projeto A" },
                    { id: "M004", nome: "Ana Lima", email: "ana.lima@engnetconsultoria.com.br", status: "Ativo" , projetos: "" },
                    { id: "M005", nome: "Carlos Oliveira", email: "carlos.oliveira@engnetconsultoria.com.br",  status: "Inativo" },
                    { id: "M006", nome: "Fernanda Rocha", email: "fernanda.rocha@engnetconsultoria.com", status: "Inativo" },
                    { id: "M007", nome: "Roberto Alves", email: "roberto.alves@engnetconsultoria.com.br", status: "Ativo", projetos: "Projeto B" },
                  ].map((membro) => (
                    <TableRow key={membro.id} className="border-gray-800 hover:bg-gray-900">
                      <TableCell className="text-white font-medium">{membro.id}</TableCell>
                      <TableCell className="text-white">{membro.nome}</TableCell>
                      <TableCell className="text-gray-300">{membro.email}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            membro.status === "Trainee" 
                              ? "bg-purple-500/15 text-purple-400 border-purple-500/20" 
                              : membro.status === "Ativo"
                              ? "bg-green-500/15 text-green-400 border-green-500/20"
                              : membro.status === "Inativo"
                              ? "bg-red-500/15 text-red-400 border-red-500/20"
                              : "bg-blue-500/15 text-yellow-400 border-yellow-500/20"
                          }
                        >
                          {membro.status}
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
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </DashboardLayout>
      )
    }
