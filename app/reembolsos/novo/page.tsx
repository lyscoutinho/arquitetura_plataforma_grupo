"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Loader2, ArrowLeft } from "lucide-react"
import { useAppContext } from "@/app/context/AppContext"
import { apiCreateReembolso, apiGetContratos } from "@/lib/api"

export default function NovoReembolsoPage() {
  const router = useRouter()
  const { addNotification } = useAppContext()
  
  const [isLoading, setIsLoading] = useState(false)
  const [loadingContratos, setLoadingContratos] = useState(true)
  const [contratos, setContratos] = useState<any[]>([])
  
  // Estados do formulário
  const [contratoId, setContratoId] = useState("")
  const [categoria, setCategoria] = useState("")
  const [valor, setValor] = useState("")
  const [dataGasto, setDataGasto] = useState("")
  const [descricao, setDescricao] = useState("")
  const [justificativa, setJustificativa] = useState("")

  useEffect(() => {
    carregarContratos()
  }, [])

  const carregarContratos = async () => {
    try {
      const dados = await apiGetContratos()
      setContratos(dados || [])
    } catch (error) {
      addNotification({
        type: "error",
        message: "Erro ao carregar contratos"
      })
    } finally {
      setLoadingContratos(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!contratoId || !categoria || !valor || !dataGasto) {
      addNotification({ type: "warning", message: "Preencha os campos obrigatórios!" })
      return
    }

    setIsLoading(true)

    try {
      const valorNumerico = parseFloat(valor.replace(',', '.'))

      await apiCreateReembolso({
        contratoId,
        categoria,
        valor: isNaN(valorNumerico) ? 0 : valorNumerico,
        dataGasto,
        descricao,
        justificativa,
        status: "Pendente"
      })

      addNotification({ type: "success", message: "Reembolso solicitado com sucesso!" })
      router.push("/reembolsos")

    } catch (err: any) {
      addNotification({ type: "error", message: err.message || "Erro ao solicitar reembolso" })
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
          <h1 className="text-2xl font-bold text-white">Novo Reembolso</h1>
          <p className="text-gray-400">Solicit uma reembolso relacionado a um contrato</p>
        </div>

        {/* Formulário */}
        <div className="bg-black border border-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-6 border-b border-gray-800 pb-2">Detalhes do Reembolso</h2>
          
          {loadingContratos ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin h-8 w-8 text-orange-500" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contrato */}
              <div>
                <label className={labelClass}>Contrato Associado *</label>
                <select 
                  value={contratoId}
                  onChange={(e) => setContratoId(e.target.value)}
                  className={inputClass}
                  required
                >
                  <option value="" disabled>Selecione um contrato...</option>
                  {contratos.map(contrato => (
                    <option key={contrato.id} value={contrato.id}>
                      {contrato.descricao} - {contrato.cliente?.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Categoria */}
                <div>
                  <label className={labelClass}>Categoria *</label>
                  <select 
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className={inputClass}
                    required
                  >
                    <option value="" disabled>Selecione...</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Hospedagem">Hospedagem</option>
                    <option value="Material">Material de Escritório</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                {/* Data do Gasto */}
                <div>
                  <label className={labelClass}>Data do Gasto *</label>
                  <input 
                    type="date" 
                    value={dataGasto}
                    onChange={(e) => setDataGasto(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {/* Valor */}
              <div>
                <label className={labelClass}>Valor (R$) *</label>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="0.00"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              {/* Descrição */}
              <div>
                <label className={labelClass}>Descrição</label>
                <textarea 
                  placeholder="Descreva o gasto..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className={`${inputClass} min-h-[100px]`}
                />
              </div>

              {/* Justificativa */}
              <div>
                <label className={labelClass}>Justificativa Comercial</label>
                <textarea 
                  placeholder="Por que esse reembolso foi necessário?"
                  value={justificativa}
                  onChange={(e) => setJustificativa(e.target.value)}
                  className={`${inputClass} min-h-[100px]`}
                />
              </div>

              {/* Botões de Ação */}
              <div className="pt-4 flex gap-4">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50 min-w-[160px] shadow-lg shadow-orange-500/20"
                >
                  {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Solicitar Reembolso"}
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
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}