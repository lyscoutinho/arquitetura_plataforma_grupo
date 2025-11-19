"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Plus, Search, Loader2, CheckCircle } from 'lucide-react'
import { useAppContext } from "@/app/context/AppContext"
import { ReembolsoService } from "@/Services/reembolso-service"
import { Reembolso } from "@/Types/reembolso"

// Componente Card Mock (substitui o Card UI - usando apenas Tailwind)
const CardMock = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`rounded-lg border border-gray-800 bg-black ${className}`}>{children}</div>
)

export default function ReembolsosPage() {
  const { addNotification } = useAppContext() 
  const [reembolsos, setReembolsos] = useState<Reembolso[]>([])
  const [loading, setLoading] = useState(true)
  const [termoBusca, setTermoBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState<string>("todas") // Estado para o filtro de status

  const carregarDados = async () => {
    setLoading(true)
    try {
      // Busca os dados do serviço
      const dados = await ReembolsoService.listarTodos()
      setReembolsos(dados)
    } catch (error) {
      addNotification({ type: "error", message: "Erro ao carregar reembolsos" }) 
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregarDados() }, [])

  const handleAprovar = async (id: string) => {
    try {
        await ReembolsoService.atualizarStatus(id, 'Aprovado')
        addNotification({ type: "success", message: `Reembolso #${id} aprovado com sucesso!` })
        carregarDados() 
    } catch (error) {
        addNotification({ type: "error", message: "Falha ao aprovar reembolso." })
    }
  }

  // Lógica de filtro combinada (busca + status)
  const listaFiltrada = reembolsos.filter(r => {
    const correspondeBusca = r.descricao.toLowerCase().includes(termoBusca.toLowerCase()) ||
                             r.nomeFuncionario.toLowerCase().includes(termoBusca.toLowerCase());
    
    const correspondeStatus = filtroStatus === "todas" || 
                              (filtroStatus === "pendentes" && r.status === "Pendente") ||
                              (filtroStatus === "aprovadas" && r.status === "Aprovado") ||
                              (filtroStatus === "rejeitadas" && r.status === "Rejeitado");

    return correspondeBusca && correspondeStatus;
  });

  return (
    <DashboardLayout>
      {}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestão de Reembolsos</h1>
          <p className="text-gray-400">Visualize e gerencie solicitações de despesas</p>
        </div>
        <div className="flex gap-2">
          <Link 
            href="/reembolsos/novo"
            // Botão com estilo Tailwind (Substitui <Button>)
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-lg shadow-orange-500/20"
          >
            <Plus className="h-4 w-4" /> Nova Solicitação
          </Link>
        </div>
      </div>

      <CardMock className="mt-6">
        <div className="p-4">
          
          {/* Barra de Busca (Substitui <Input>) */}
          <div className="flex items-center gap-2 rounded-md border border-gray-800 bg-gray-950 px-3 py-1 mb-4 max-w-lg">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por descrição ou funcionário..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="flex-1 h-8 border-0 bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
            />
          </div>

          {/* Tabs (Substitui <Tabs>) */}
          <div className="mb-4">
            <div className="grid w-full grid-cols-4 bg-gray-950 p-1 rounded-lg text-sm text-center">
              {['todas', 'pendentes', 'aprovadas', 'rejeitadas'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFiltroStatus(status)}
                  // Estilo da tab ativa/inativa
                  className={`py-2 px-4 rounded-md font-medium transition-colors ${
                    filtroStatus === status
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'text-gray-400 hover:bg-gray-800/70'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Tabela de Reembolsos (Substitui <Table>) */}
          <div className="rounded-lg border border-gray-800 overflow-x-auto">
            {loading ? (
              <div className="flex h-40 items-center justify-center text-white">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-800 text-sm text-left">
                <thead className="bg-gray-950 text-gray-400 uppercase font-medium">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">Funcionário</th>
                    <th className="px-4 py-3 whitespace-nowrap">Categoria</th>
                    <th className="px-4 py-3 whitespace-nowrap">Valor</th>
                    <th className="px-4 py-3 whitespace-nowrap">Status</th>
                    <th className="px-4 py-3 whitespace-nowrap text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {listaFiltrada.map((item) => (
                    <tr key={item.id} className="border-gray-800 hover:bg-gray-900/50 text-gray-300">
                      {/* CORREÇÃO APLICADA: Cor do nome do funcionário forçada para verde limão */}
                      <td className="px-4 py-3 text-lime-400 font-medium whitespace-nowrap">{item.nomeFuncionario}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{item.categoria}</td>
                      <td className="px-4 py-3 text-white whitespace-nowrap">
                        {item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {/* Simulação de StatusBadge */}
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          item.status === 'Aprovado' ? 'bg-green-900/30 text-green-400' :
                          item.status === 'Rejeitado' ? 'bg-red-900/30 text-red-400' :
                          'bg-yellow-900/30 text-yellow-400'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {item.status === 'Pendente' && (
                          <button 
                            onClick={() => handleAprovar(item.id)}
                            // Botão APROVAR - Estilizado com Tailwind (resolve erro size/variant)
                            className="inline-flex items-center text-green-500 hover:text-green-400 transition-colors text-xs font-medium px-3 py-1 rounded hover:bg-green-950/30"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" /> Aprovar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </CardMock>
    </DashboardLayout>
  )
}