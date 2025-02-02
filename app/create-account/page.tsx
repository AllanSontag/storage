"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/useToast"
import type { PostgrestError } from "@supabase/supabase-js"

export default function CreateAccountPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get("email") as string
      const password = formData.get("password") as string
      const name = formData.get("name") as string

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (error) {
        throw error
      }

      if (data.user) {
        showToast("Account created successfully. Please check your email to confirm your account.", "success")
        router.push("/login")
      } else {
        showToast("An error occurred during sign up. Please try again.", "error")
      }
    } catch (error: any) {
      console.error("Sign up error:", error)
      showToast(error.message || "An error occurred during sign up. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#10002B] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-[#F65C47] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center space-y-2">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%20Bruspy%20Gradiente-JEYEyp8zcXpakc46Dg7sxeVdTzVjCP.png"
            alt="Bruspy Logo"
            width={200}
            height={50}
            className="mb-4"
          />
          <p className="text-[#6d7589] text-center">Create your account to get started</p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              required
              className="bg-[#240046] border-none text-white placeholder-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              className="bg-[#240046] border-none text-white placeholder-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                required
                className="bg-[#240046] border-none text-white placeholder-gray-300 pr-10"
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

          <Button type="submit" className="w-full bg-[#240046] text-white hover:bg-[#240046]/90" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-[#6d7589]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#F65C47] hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

