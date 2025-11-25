'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { setCookie } from 'nookies' // npm install nookies
import { apiLogin } from '@/lib/api' // Sua função de API
import { useAppContext } from '@/app/context/AppContext' // Seu contexto corrigido

export default function LoginPage() {
  const router = useRouter()
  const { setUserInfo, setToken } = useAppContext()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
  e.preventDefault()
  setError('')
  setLoading(true)

  try {
    console.log('Tentando fazer login com:', { email, password: '***' })
    
    const res = await apiLogin(email, password)
    
    console.log("✅ Resposta do servidor:", res);
    console.log("Token recebido:", res.accessToken || res.token);

    // Salvar token e user no contexto e no cookie
    const token = res.accessToken || res.token
    const user = res.user || res.userData
    
    setUserInfo(user) 
    setToken(token) 

    // Salvar no cookie para o middleware validar
    document.cookie = `engnet.token=${token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;

    console.log('✅ Token salvo no cookie e contexto')

    // Redirecionar para dashboard usando router (SPA)
    router.push('/dashboard');

  } catch (err: any) {
    const mensagemErro = err.message || 'Email ou senha incorretos.';
    console.error(' Erro no login:', {
      mensagem: mensagemErro,
      erro: err
    });
    setError(mensagemErro)
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] p-4">
      <div className="w-full max-w-md bg-[#1E293B] rounded-lg shadow-xl p-8 border border-gray-700">
        
        {/* Cabeçalho */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">EngNet Plataforma</h1>
          <p className="text-gray-400">Entre com suas credenciais para acessar</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#0F172A] border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#0F172A] border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-md transition duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}