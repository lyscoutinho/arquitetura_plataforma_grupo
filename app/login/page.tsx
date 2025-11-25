"use client"
import { useState } from 'react'
import { apiLogin } from '@/lib/api'
import { useAppContext } from '@/app/context/AppContext'
import { useSPANavigation } from '@/hooks/use-spa-navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const { setUserInfo, setToken } = useAppContext()
  const { navigate } = useSPANavigation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    try {
      const res = await apiLogin(email, password)
      setUserInfo(res.user)
      setToken(res.access_token)
      navigate('/', true)
    } catch (err) {
      setError(err.message || 'Erro no login')
    }
  }

  return (
    <form onSubmit={handleLogin} className="...">
      <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <div className="text-red-400">{error}</div>}
      <Button type="submit">Entrar</Button>
    </form>
  )
}

