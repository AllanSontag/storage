'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from 'next/image'

export default function RecoverPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsEmailSent(true)
    setIsLoading(false)
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
          <p className="text-[#6d7589] text-center">
            Enter your email to receive password reset instructions
          </p>
        </div>

        {!isEmailSent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
                className="bg-[#240046] border-none text-white placeholder-gray-300"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#240046] text-white hover:bg-[#240046]/90"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send reset instructions"}
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-[#F65C47]">
              ✓ Email sent successfully!
            </p>
            <p className="text-[#6d7589]">
              Please check your inbox and follow the instructions to reset your password.
            </p>
            <Button
              onClick={() => router.push('/login')}
              variant="outline"
              className="mt-4 bg-[#240046] text-white hover:bg-[#240046]/90"
            >
              Return to login
            </Button>
          </div>
        )}

        <div className="text-center">
          <p className="text-[#6d7589]">
            Remember your password?{' '}
            <Link href="/login" className="text-[#F65C47] hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

