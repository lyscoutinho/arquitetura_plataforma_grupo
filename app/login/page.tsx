"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppContext } from "@/app/context/AppContext"
import { useSPANavigation } from "@/hooks/use-spa-navigation"

export default function LoginPage() {
  const { setUserInfo } = useAppContext()
  const { navigate } = useSPANavigation()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // validação real (API)
    if (email.length === 0 || password.length === 0) {
      alert("Preencha email e senha.")
      return
    }

    // Usuário falso só para testes
    setUserInfo({
      id: "1",
      name: "Usuário Teste",
      email,
      role: "admin",
    })

    navigate("/", true) // volta ao Dashboard
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <form 
        onSubmit={handleLogin}
        className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-sm border border-gray-800"
      >
        <h1 className="text-white text-2xl mb-6 text-center">Login</h1>

        <label className="text-gray-400 text-sm">Email</label>
        <Input
          type="email"
          className="bg-gray-800 border-gray-700 text-white mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="text-gray-400 text-sm">Senha</label>
        <Input
          type="password"
          className="bg-gray-800 border-gray-700 text-white mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button 
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        >
          Entrar
        </Button>
      </form>
    </div>
  )
}
