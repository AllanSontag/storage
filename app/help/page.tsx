"use client"

import { useState } from "react"
import { ArrowLeft, MoreVertical, Paperclip, Mic, Smile, Send } from "lucide-react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "@/contexts/ThemeContext"
import { Button } from "@/components/ui/button"

interface Message {
  id: number
  text: string
  sent: boolean
  time: string
}

export default function HelpPage() {
  const router = useRouter()
  const { theme } = useTheme()
  const [messages] = useState<Message[]>([
    {
      id: 1,
      text: "You have been transfered $50",
      sent: false,
      time: "15:42",
    },
    {
      id: 2,
      text: "Transfer Done $50",
      sent: true,
      time: "15:42",
    },
    {
      id: 3,
      text: "Please send me what type of tranfer you have done",
      sent: false,
      time: "15:42",
    },
    {
      id: 4,
      text: "Transfer from bank mobile app",
      sent: true,
      time: "15:42",
    },
    {
      id: 5,
      text: "You have been transfered $50",
      sent: false,
      time: "15:42",
    },
    {
      id: 6,
      text: "Transfer Done $50",
      sent: true,
      time: "15:42",
    },
  ])

  return (
    <div
      className={`min-h-screen flex flex-col ${
        theme === "light" ? "bg-gradient-to-b from-[#F65C47] to-[#3E005B] text-white" : "bg-[#10002B] text-white"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-white/10">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>PP</AvatarFallback>
            </Avatar>
            <span className="font-semibold text-lg">Peter Parker</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
          <MoreVertical className="w-6 h-6" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sent ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.sent ? "bg-[#3C096C] text-white" : "bg-[#240046] text-white"
              }`}
            >
              <p className="mb-1">{message.text}</p>
              <p className={`text-xs ${message.sent ? "text-gray-300" : "text-gray-400"}`}>{message.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-[#3C096C]">
        <div className="flex items-center gap-2 bg-[#240046] rounded-full px-4 py-2">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Paperclip className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Mic className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Smile className="w-6 h-6" />
          </Button>
          <input
            type="text"
            placeholder="Type your message here.."
            className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder-gray-400"
          />
          <Button variant="ghost" size="icon" className="text-[#F65C47] hover:text-[#F65C47]/80">
            <Send className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}

