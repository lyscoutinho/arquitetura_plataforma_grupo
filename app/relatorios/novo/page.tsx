"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Loader2, ArrowLeft } from "lucide-react"
import { useAppContext } from "@/app/context/AppContext"
import { apiCreateRelatorio } from "@/lib/api"

export default function NovoRelatorioPage() {
  const router = useRouter()
  const { addNotification } = useAppContext()
  
  const [isLoading, setIsLoading] = useState(false)
  
  // Estados do formulário
  const [titulo, setTitulo] = useState("")
  const [tipo, setTipo] = useState("")
  const [periodo, setPeriodo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [dataCriacao] = useState(new Date().toISOString().split('T')[0])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!titulo || !tipo || !periodo) {
      addNotification({ type: "warning", message: "Preencha os campos obrigatórios!" })
      return
    }

    setIsLoading(true)

    try {
      await apiCreateRelatorio({
        titulo,
        tipo,
        periodo,
        descricao,
        dataCriacao,
        status: "Gerado"
      })

      addNotification({ type: "success", message: "Relatório criado com sucesso!" })
      router.push("/relatorios")

    } catch (err: any) {
      addNotification({ type: "error", message: err.message || "Erro ao criar relatório" })
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = "w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors"
  const labelClass = "block text-sm font-medium text-gray-300 mb-1"

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-6">
          <button 
            type="button"
            onClick={() => router.back()} 
            className="flex items-center text-gray-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
          </button>
          <h1 className="text-2xl font-bold text-white">Novo Relatório</h1>
          <p className="text-gray-400">Crie um novo relatório do sistema</p>
        </div>

        {/* Formulário */}
        <div className="bg-black border border-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-6 border-b border-gray-800 pb-2">Detalhes do Relatório</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label className={labelClass}>Título do Relatório *</label>
              <input 
                type="text" 
                placeholder="Ex: Relatório de Reembolsos Setembro"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tipo */}
              <div>
                <label className={labelClass}>Tipo de Relatório *</label>
                <select 
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className={inputClass}
                  required
                >
                  <option value="" disabled>Selecione...</option>
                  <option value="Reembolsos">Reembolsos</option>
                  <option value="Contratos">Contratos</option>
                  <option value="Clientes">Clientes</option>
                  <option value="Financeiro">Financeiro</option>
                  <option value="RH">Recursos Humanos</option>
                  <option value="Operacional">Operacional</option>
                </select>
              </div>

              {/* Período */}
              <div>
                <label className={labelClass}>Período *</label>
                <select 
                  value={periodo}
                  onChange={(e) => setPeriodo(e.target.value)}
                  className={inputClass}
                  required
                >
                  <option value="" disabled>Selecione...</option>
                  <option value="Janeiro">Janeiro</option>
                  <option value="Fevereiro">Fevereiro</option>
                  <option value="Março">Março</option>
                  <option value="Abril">Abril</option>
                  <option value="Maio">Maio</option>
                  <option value="Junho">Junho</option>
                  <option value="Julho">Julho</option>
                  <option value="Agosto">Agosto</option>
                  <option value="Setembro">Setembro</option>
                  <option value="Outubro">Outubro</option>
                  <option value="Novembro">Novembro</option>
                  <option value="Dezembro">Dezembro</option>
                  <option value="Anual">Anual</option>
                  <option value="Trimestral">Trimestral</option>
                  <option value="Semestral">Semestral</option>
                </select>
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className={labelClass}>Descrição/Observações</label>
              <textarea 
                placeholder="Adicione informações adicionais sobre o relatório..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className={`${inputClass} min-h-[150px]`}
              />
            </div>

            {/* Botões de Ação */}
            <div className="pt-4 flex gap-4">
              <button 
                type="submit" 
                disabled={isLoading}
                className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50 min-w-[160px] shadow-lg shadow-orange-500/20"
              >
                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Criar Relatório"}
              </button>
              
              <button 
                type="button" 
                onClick={() => router.back()}
                className="bg-transparent border border-gray-800 text-gray-300 hover:bg-gray-800/70 font-medium py-2 px-6 rounded-md transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
