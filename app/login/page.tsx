"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/useToast"
//import { PostgrestError } from "@supabase/supabase-js" // Removed as not used

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userNotFound, setUserNotFound] = useState(false)
  // const router = useRouter()
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUserNotFound(false)
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get("email") as string
      const password = formData.get("password") as string

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message === "Invalid login credentials") {
          setUserNotFound(true)
          showToast("The email or password could be wrong, or sign up if you don't have an account.", "error")
        } else if (error.message === "Email not confirmed") {
          setUserNotFound(false)
          showToast("The email was not confirmed, please see your inbox and try again.", "error")
        } else {
          showToast(error.message, "error")
        }
        return
      }

      if (data.user) {
        showToast("Login successful!", "success")
        // Set both the localStorage flag and the actual session
        localStorage.setItem("isLoggedIn", "true")
        window.location.href = "/home"
      } else {
        showToast("An unexpected error occurred. Please try again.", "error")
      }
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#10002B] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-2">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%20Bruspy%20Gradiente-JEYEyp8zcXpakc46Dg7sxeVdTzVjCP.png"
            alt="Bruspy Logo"
            width={200}
            height={50}
            className="mb-4"
            priority
          />
          <h1 className="text-2xl font-bold">Bem-vindo ao Bruspy</h1>
          <p className="text-[#6d7589] text-center">Entre com suas credenciais para acessar sua conta</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Digite seu email"
              required
              className="bg-[#3C096C] border-none text-white placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                required
                className="bg-[#3C096C] border-none text-white placeholder-gray-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {userNotFound && (
            <p className="text-red-500 text-sm mt-2">
              The email or password could be wrong, or sign up if you don&eapos;t have an account.
            </p>
          )}

          <div className="flex items-center justify-end">
            <Link href="/recuperar-senha" className="text-sm text-[#F65C47] hover:underline">
              Esqueceu sua senha?
            </Link>
          </div>

          <Button type="submit" className="w-full bg-[#3C096C] text-white hover:bg-[#3C096C]/80" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-[#6d7589]">
            Ainda não tem uma conta?{" "}
            <Link href="/criar-conta" className="text-[#F65C47] hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

