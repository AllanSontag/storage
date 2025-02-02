"use client"

import { ArrowLeft, HelpCircle, MessageCircle, FileText, Phone } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function AjudaSuportePage() {
  const router = useRouter()

  const supportOptions = [
    {
      icon: <HelpCircle className="w-6 h-6 text-[#3b46f1]" />,
      title: "Perguntas Frequentes",
      description: "Encontre respostas para dúvidas comuns",
      href: "/faq",
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-[#3b46f1]" />,
      title: "Chat de Suporte",
      description: "Converse com nossa equipe de suporte",
      href: "/chat-support",
    },
    {
      icon: <FileText className="w-6 h-6 text-[#3b46f1]" />,
      title: "Documentação",
      description: "Leia nossos guias e tutoriais",
      href: "/documentation",
    },
    {
      icon: <Phone className="w-6 h-6 text-[#3b46f1]" />,
      title: "Contato",
      description: "Entre em contato por telefone ou email",
      href: "/contact",
    },
  ]

  return (
    <div className="min-h-screen bg-[#10002B] text-white">
      <div className="flex items-center gap-4 p-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-white/10">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-semibold">Help and Support</h1>
      </div>

      <div className="px-6 space-y-4">
        {supportOptions.map((option, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full justify-start text-white hover:bg-[#3C096C] p-4"
            onClick={() => router.push(option.href)}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#240046] flex items-center justify-center flex-shrink-0">
                {option.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{option.title}</h3>
                <p className="text-[#aea9b1] text-sm">{option.description}</p>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}

