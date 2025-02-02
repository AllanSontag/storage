"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, User, DollarSign, Globe, LogOut, Bell, Lock, Smartphone, HelpCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/useToast"
import { supabase } from "@/lib/supabase"

interface SettingItem {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
  href?: string
}

export default function ConfiguracoesPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // Clear localStorage
      localStorage.removeItem("isLoggedIn")

      // Force navigation to login page
      window.location.href = "/login"
    } catch (error) {
      console.error("Error logging out:", error)
      showToast("Failed to logout", "error")
    } finally {
      setIsLoggingOut(false)
    }
  }

  const settingItems: SettingItem[] = [
    {
      icon: <User className="w-6 h-6 text-[#3b46f1]" />,
      title: "Perfil",
      description: "Gerenciar informações pessoais",
      href: "/configuracoes/perfil",
    },
    {
      icon: <Bell className="w-6 h-6 text-[#3b46f1]" />,
      title: "Notificações",
      description: "Gerenciar preferências de notificação",
      href: "/configuracoes/notificacoes",
    },
    {
      icon: <Lock className="w-6 h-6 text-[#3b46f1]" />,
      title: "Privacidade e Segurança",
      description: "Configurações de segurança da conta",
      href: "/configuracoes/privacidade-seguranca",
    },
    {
      icon: <DollarSign className="w-6 h-6 text-[#3b46f1]" />,
      title: "Moeda",
      description: "Alterar moeda padrão",
      href: "/configuracoes/moeda",
    },
    {
      icon: <Globe className="w-6 h-6 text-[#3b46f1]" />,
      title: "Idioma",
      description: "Alterar o idioma do aplicativo",
      href: "/configuracoes/idioma",
    },
    {
      icon: <Smartphone className="w-6 h-6 text-[#3b46f1]" />,
      title: "Som e Vibração",
      description: "Ajustar configurações de som",
      href: "/configuracoes/som-vibracao",
    },
    {
      icon: <HelpCircle className="w-6 h-6 text-[#3b46f1]" />,
      title: "Ajuda e Suporte",
      description: "Obter ajuda e informações",
      href: "/configuracoes/ajuda-suporte",
    },
    {
      icon: <LogOut className="w-6 h-6 text-[#e46962]" />,
      title: "Sair",
      description: "Encerrar sessão na conta",
      action: (
        <Button
          onClick={(e) => {
            e.stopPropagation()
            handleLogout()
          }}
          variant="ghost"
          className="text-[#e46962] hover:text-[#e46962]/80 p-0"
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Saindo..." : "Sair"}
        </Button>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-[#10002B] text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#10002B] shadow-md">
        <div className="flex items-center gap-4 p-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-white/10">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-semibold">Configurações</h1>
        </div>
      </div>

      {/* Settings List */}
      <div className="px-6 py-4 space-y-4">
        {settingItems.map((item, index) => (
          <div
            key={index}
            className="w-full text-white hover:bg-white/10 p-4 rounded-md cursor-pointer transition-colors"
            onClick={() => item.href && router.push(item.href)}
          >
            <div className="flex items-center gap-4 w-full">
              <div className="flex-shrink-0">{item.icon}</div>
              <div className="flex-grow text-left">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-300">{item.description}</p>
              </div>
              {item.action && <div className="flex-shrink-0">{item.action}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

