"use client"

import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useToast } from "@/hooks/useToast"
import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // const [rememberMe, setRememberMe] = useState(false);


  const [showPassword, setShowPassword] = useState(false)
  const { showToast } = useToast()


  async function handleSubmit(e) {
    try {

      e.preventDefault();
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      // Set both the localStorage flag and the actual session

      if (!error) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        });
        showToast("Login successful!", "success")
        // Set both the localStorage flag and the actual session
        localStorage.setItem("isLoggedIn", "true")
        window.location.href = '/home';
      } else {
        showToast("An unexpected error occurred. Please try again.", "error")
        console.error(`Login Error: ${error}`);
      }
      setLoading(false);

    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setLoading(false)
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
              onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#3C096C] border-none text-white placeholder-gray-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          {/* <div className="flex items-center space-x-2 mb-4">
            <Checkbox id="rememberMe" checked={rememberMe} onCheckedChange={setRememberMe} />
            <label
              htmlFor="rememberMe"
              className="text-sm text-gray-400 cursor-pointer"
            >
              Remember me
            </label>
          </div> */}
          {/* {userNotFound && (
            <p className="text-red-500 text-sm mt-2">
              The email or password could be wrong, or sign up if you don&eapos;t have an account.
            </p>
          )} */}

          <div className="flex items-center justify-end">
            <Link href="/recuperar-senha" className="text-sm text-[#F65C47] hover:underline">
              Esqueceu sua senha?
            </Link>
          </div>

          <Button type="submit" className="w-full bg-[#3C096C] text-white hover:bg-[#3C096C]/80" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
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

