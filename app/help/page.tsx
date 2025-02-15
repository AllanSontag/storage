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
      text: "Hello, How can i help you?",
      sent: false,
      time: "15:42",
    },
    // {
    //   id: 2,
    //   text: "Transfer Done $50",
    //   sent: true,
    //   time: "15:42",
    // },
    // {
    //   id: 3,
    //   text: "Please send me what type of tranfer you have done",
    //   sent: false,
    //   time: "15:42",
    // },
    // {
    //   id: 4,
    //   text: "Transfer from bank mobile app",
    //   sent: true,
    //   time: "15:42",
    // },
    // {
    //   id: 5,
    //   text: "You have been transfered $50",
    //   sent: false,
    //   time: "15:42",
    // },
    // {
    //   id: 6,
    //   text: "Transfer Done $50",
    //   sent: true,
    //   time: "15:42",
    // },
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
              <AvatarFallback>BS</AvatarFallback>
            </Avatar>
            <span className="font-semibold text-lg">Bruspy Support</span>
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




//////////////////////////////////////////////
// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { ArrowLeft, Send } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { useToast } from "@/hooks/useToast"
// import { useTheme } from "@/contexts/ThemeContext"
// // import { streamText } from "ai"
// // import { openai } from "@ai-sdk/openai"
// import Chat from "@/components/chat";

// export default function HelpPage() {
//   const [input, setInput] = useState("")
//   const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([])
//   const [isLoading, setIsLoading] = useState(false)
//   const router = useRouter()
//   const { showToast } = useToast()
//   const { theme } = useTheme()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!input.trim()) return

//     const userMessage = { role: "user" as const, content: input }
//     setMessages((prev) => [...prev, userMessage])
//     setInput("")
//     setIsLoading(true)

//     try {
//       const result = streamText({
//         model: openai("gpt-4o"),
//         prompt: `You are a helpful virtual assistant for a financial app. Please respond to the following question or request: ${input}`,
//         onChunk: ({ chunk }) => {
//           if (chunk.type === "text-delta") {
//             setMessages((prev) => {
//               console.log(prev);
//               const lastMessage = prev[prev.length - 1]
//               if (lastMessage && lastMessage.role === "assistant") {
//                 return [...prev.slice(0, -1), { ...lastMessage, content: lastMessage.content + chunk.text }]
//               } else {
//                 return [...prev, { role: "assistant", content: chunk.text }]
//               }
//             })
//           }
//         },
//       })

//       await result.text
//     } catch (error) {
//       console.error("Error generating response:", error)
//       showToast("Failed to generate response. Please try again.", "error")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div
//       className={`min-h-screen ${theme === "light" ? "bg-gradient-to-b from-[#F65C47] to-[#3E005B] text-white" : "bg-[#10002B] text-white"
//         } rounded-lg overflow-hidden`}
//     >
//       <div className="container mx-auto p-4 max-w-2xl">
//         <div className="flex items-center mb-4">
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => router.back()}
//             className="mr-2 text-white hover:bg-white/10 rounded-full"
//           >
//             <ArrowLeft className="h-6 w-6" />
//           </Button>
//           <h1 className="text-2xl font-bold">Help & Support</h1>
//         </div>

//         <Card className="mb-4 bg-[#3C096C] rounded-xl border-0">
//           <CardHeader>
//             <CardTitle className="text-white">Virtual Assistant</CardTitle>
//           </CardHeader>
//           <CardContent>

//             <Chat />

//             {/* <div className="space-y-4 mb-4 h-[400px] overflow-y-auto">
//               {messages.map((message, index) => (
//                 <div
//                   key={index}
//                   className={`p-2 rounded-lg ${message.role === "user" ? "bg-[#F65C47] ml-auto" : "bg-[#240046]"
//                     } max-w-[80%]`}
//                 >
//                   {message.content}
//                 </div>
//               ))}
//               {isLoading && <div className="bg-[#240046] p-2 rounded-lg max-w-[80%]">Thinking...</div>}
//             </div>
//             <form onSubmit={handleSubmit} className="flex gap-2">
//               <Input
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 placeholder="Ask a question..."
//                 className="flex-grow bg-[#240046] border-0 text-white placeholder-gray-400"
//               />
//               <Button type="submit" disabled={isLoading} className="bg-[#F65C47] text-white hover:bg-[#FF7F50]">
//                 <Send className="h-4 w-4 mr-2" />
//                 Send
//               </Button>
//             </form> */}
//           </CardContent>
//         </Card>

//         <Card className="bg-[#3C096C] rounded-xl border-0">
//           <CardHeader>
//             <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ul className="list-disc pl-5 space-y-2 text-white">
//               <li>How do I check my account balance?</li>
//               <li>How can I transfer money to another account?</li>
//               <li>What are the fees for international transfers?</li>
//               <li>How do I update my personal information?</li>
//               <li>What should I do if I forget my password?</li>
//             </ul>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

