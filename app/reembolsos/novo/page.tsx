"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
// REMOVIDO: importações de componentes de UI (Input, Button, Card, Select, etc.)
import { Loader2, ArrowLeft } from "lucide-react"
import { useAppContext } from "@/app/context/AppContext"
import { ReembolsoService } from "@/Services/reembolso-service"

export default function NovoReembolsoPage() {
  const router = useRouter()
  const { addNotification } = useAppContext()
  
  const [isLoading, setIsLoading] = useState(false)
  
  // Estados do formulário
  const [categoria, setCategoria] = useState("")
  const [valor, setValor] = useState("")
  const [data, setData] = useState("")
  const [descricao, setDescricao] = useState("")
  const [justificativa, setJustificativa] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!categoria || !valor || !data) {
      addNotification({ type: "warning", message: "Preencha os campos obrigatórios!" })
      return
    }

    setIsLoading(true)

    try {
      // Formata o valor: troca vírgula por ponto para parsear corretamente
      const valorNumerico = parseFloat(valor.replace(',', '.'))

      await ReembolsoService.criar({
        categoria,
        valor: isNaN(valorNumerico) ? 0 : valorNumerico,
        data,
        descricao,
        justificativa
      })

      addNotification({ type: "success", message: "Solicitação enviada com sucesso!" })
      router.push("/reembolsos")

    } catch (err) {
      addNotification({ type: "error", message: "Erro ao enviar solicitação." })
    } finally {
      setIsLoading(false)
    }
  }

  // Estilos comuns para inputs
  const inputClass = "w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors"
  const labelClass = "block text-sm font-medium text-gray-300 mb-1"

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho Simples */}
        <div className="mb-6">
          <button 
            type="button"
            onClick={() => router.back()} 
            className="flex items-center text-gray-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
          </button>
          <h1 className="text-2xl font-bold text-white">Nova Solicitação</h1>
          <p className="text-gray-400">Preencha os dados da despesa abaixo</p>
        </div>

        {/* Formulário */}
        <div className="bg-black border border-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-6 border-b border-gray-800 pb-2">Detalhes da Despesa</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Categoria */}
              <div>
                <label className={labelClass}>Categoria *</label>
                <select 
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className={inputClass}
                >
                  <option value="" disabled>Selecione...</option>
                  <option value="Alimentação">Alimentação</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Hospedagem">Hospedagem</option>
                  <option value="Material">Material de Escritório</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              {/* Data */}
              <div>
                <label className={labelClass}>Data da Despesa *</label>
                <input 
                  type="date" 
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className={inputClass}
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
              />
            </div>

            {/* Descrição */}
            <div>
              <label className={labelClass}>Descrição</label>
              <textarea 
                placeholder="Descreva o motivo da despesa..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className={`${inputClass} min-h-[100px]`}
              />
            </div>

            {/* Justificativa */}
            <div>
              <label className={labelClass}>Justificativa Comercial</label>
              <textarea 
                placeholder="Por que essa despesa foi necessária?"
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
                // Botão Principal
                className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50 min-w-[160px] shadow-lg shadow-orange-500/20"
              >
                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Enviar Solicitação"}
              </button>
              
              {/* Botão de Cancelar */}
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