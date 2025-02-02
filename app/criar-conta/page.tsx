'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from 'next/image'

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-[#101012] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-[#6d7589] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center space-y-2">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Si%CC%81mbolo%20Bruspy%20Gradiente-pcEmR2Cb7XTveumiloFkhREmWGVq6q.jpeg"
            alt="Bruspy Logo"
            width={80}
            height={80}
            className="mb-4"
          />
          <h1 className="text-2xl font-bold">Criar nova conta</h1>
          <p className="text-[#6d7589] text-center">
            Preencha seus dados para criar sua conta
          </p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              type="text"
              placeholder="Digite seu nome completo"
              required
              className="bg-[#1c1e34] border-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Digite seu email"
              required
              className="bg-[#1c1e34] border-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                required
                className="bg-[#1c1e34] border-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#a5fe33] text-black hover:bg-[#a5fe33]/90"
            disabled={isLoading}
          >
            {isLoading ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-[#6d7589]">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-[#a5fe33] hover:underline">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

