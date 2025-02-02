"use client"

import { useState } from "react"
import { ArrowLeft, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/useToast"

const languages = [
  { code: "pt", name: "Português" },
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
]

export default function IdiomaPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [selectedLanguage, setSelectedLanguage] = useState("pt")

  const handleSave = () => {
    showToast(`Language updated to ${languages.find((lang) => lang.code === selectedLanguage)?.name}`, "success")
    router.back()
  }

  return (
    <div className="min-h-screen bg-[#10002B] text-white">
      <div className="flex items-center gap-4 p-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-white/10">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-semibold">Language</h1>
      </div>

      <div className="px-6 space-y-4">
        {languages.map((lang) => (
          <button
            key={lang.code}
            className="w-full p-4 bg-[#3C096C] rounded-2xl flex items-center justify-between"
            onClick={() => setSelectedLanguage(lang.code)}
          >
            <span className="text-lg">{lang.name}</span>
            {selectedLanguage === lang.code && <Check className="w-6 h-6 text-[#3b46f1]" />}
          </button>
        ))}
      </div>

      <div className="px-6 mt-6">
        <Button onClick={handleSave} className="w-full bg-[#3b46f1] hover:bg-[#3b46f1]/90 text-white">
          Save Changes
        </Button>
      </div>
    </div>
  )
}

