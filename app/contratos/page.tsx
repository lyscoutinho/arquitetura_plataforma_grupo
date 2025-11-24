"use client"

import { useState } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, MoreHorizontal, FileText, Filter, ArrowUpDown } from "lucide-react"

// Mock Data based on Backend Entity Structure
// Entity: Contrato
// Fields: id, descricao, dataInicio, dataFim, status, valor, cliente (relation)
const contracts = [
    {
        id: "1",
        descricao: "Desenvolvimento de Software ERP",
        cliente: "Tech Solutions Ltda",
        dataInicio: "2024-01-15",
        dataFim: "2024-12-15",
        valor: 125000.00,
        status: "Ativo",
    },
    {
        id: "2",
        descricao: "Consultoria de Infraestrutura",
        cliente: "Indústrias Reunidas S.A.",
        dataInicio: "2024-03-01",
        dataFim: "2024-06-30",
        valor: 45000.00,
        status: "Finalizado",
    },
    {
        id: "3",
        descricao: "Manutenção de Servidores",
        cliente: "Hospital Central",
        dataInicio: "2024-02-10",
        dataFim: "2025-02-10",
        valor: 8400.00, // Mensal
        status: "Ativo",
    },
    {
        id: "4",
        descricao: "Auditoria de Segurança",
        cliente: "Banco Financeiro",
        dataInicio: "2024-05-01",
        dataFim: "2024-05-30",
        valor: 22000.00,
        status: "Pendente",
    },
    {
        id: "5",
        descricao: "Treinamento Corporativo",
        cliente: "Escola Futuro",
        dataInicio: "2024-04-15",
        dataFim: "2024-04-20",
        valor: 15000.00,
        status: "Cancelado",
    },
]

export default function ContractsPage() {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredContracts = contracts.filter(contract =>
        contract.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.cliente.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Ativo":
                return "bg-green-500/15 text-green-500 hover:bg-green-500/25"
            case "Finalizado":
                return "bg-blue-500/15 text-blue-500 hover:bg-blue-500/25"
            case "Pendente":
                return "bg-yellow-500/15 text-yellow-500 hover:bg-yellow-500/25"
            case "Cancelado":
                return "bg-red-500/15 text-red-500 hover:bg-red-500/25"
            default:
                return "bg-gray-500/15 text-gray-500"
        }
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR')
    }

    return (
        <DashboardLayout>
            <PageHeader
                title="Contratos"
                description="Gerencie os contratos da empresa, prazos e valores."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Contratos" },
                ]}
                actions={
                    <Link href="/contratos/novo">
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Contrato
                        </Button>
                    </Link>
                }
            />

            <div className="space-y-4">
                {/* Filters & Search */}
                <Card className="bg-black border-gray-800">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Buscar por descrição ou cliente..."
                                    className="pl-8 bg-gray-950 border-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-orange-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <Button variant="outline" className="w-full md:w-auto border-gray-800 text-gray-300 hover:bg-gray-900 hover:text-white bg-transparent">
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filtrar
                                </Button>
                                <Button variant="outline" className="w-full md:w-auto border-gray-800 text-gray-300 hover:bg-gray-900 hover:text-white bg-transparent">
                                    <ArrowUpDown className="mr-2 h-4 w-4" />
                                    Ordenar
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Contracts Table */}
                <Card className="bg-black border-gray-800">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-gray-900/50">
                                <TableRow className="border-gray-800 hover:bg-gray-900/50">
                                    <TableHead className="text-gray-400">Descrição</TableHead>
                                    <TableHead className="text-gray-400">Cliente</TableHead>
                                    <TableHead className="text-gray-400">Valor</TableHead>
                                    <TableHead className="text-gray-400">Vigência</TableHead>
                                    <TableHead className="text-gray-400">Status</TableHead>
                                    <TableHead className="text-right text-gray-400">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredContracts.length > 0 ? (
                                    filteredContracts.map((contract) => (
                                        <TableRow key={contract.id} className="border-gray-800 hover:bg-gray-900/30">
                                            <TableCell className="font-medium text-white">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-2 rounded bg-gray-800 text-orange-500">
                                                        <FileText className="h-4 w-4" />
                                                    </div>
                                                    {contract.descricao}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-300">{contract.cliente}</TableCell>
                                            <TableCell className="text-gray-300 font-medium">
                                                {formatCurrency(contract.valor)}
                                            </TableCell>
                                            <TableCell className="text-gray-400 text-sm">
                                                {formatDate(contract.dataInicio)} - {formatDate(contract.dataFim)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`${getStatusColor(contract.status)} border-0`}>
                                                    {contract.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800">
                                                            <span className="sr-only">Abrir menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-gray-950 border-gray-800 text-gray-300">
                                                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                        <DropdownMenuItem className="hover:bg-gray-900 focus:bg-gray-900 cursor-pointer">
                                                            Ver detalhes
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="hover:bg-gray-900 focus:bg-gray-900 cursor-pointer">
                                                            Editar contrato
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-gray-800" />
                                                        <DropdownMenuItem className="text-red-500 hover:bg-red-950/30 focus:bg-red-950/30 cursor-pointer">
                                                            Cancelar contrato
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                                            Nenhum contrato encontrado.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
