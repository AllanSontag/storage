"use client"

import { useState } from "react"
import { ArrowLeft, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/useToast"

const currencies = [
  { code: "BRL", name: "Real Brasileiro", symbol: "R$" },
  { code: "USD", name: "Dólar Americano", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "Libra Esterlina", symbol: "£" },
]

export default function MoedaPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [selectedCurrency, setSelectedCurrency] = useState("BRL")

  const handleSave = () => {
    showToast(`Currency updated to ${selectedCurrency}`, "success")
    router.back()
  }

  return (
    <div className="min-h-screen bg-[#10002B] text-white">
      <div className="flex items-center gap-4 p-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-white/10">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-semibold">Currency</h1>
      </div>

      <div className="px-6 space-y-4">
        {currencies.map((currency) => (
          <button
            key={currency.code}
            className="w-full p-4 bg-[#3C096C] rounded-2xl flex items-center justify-between"
            onClick={() => setSelectedCurrency(currency.code)}
          >
            <div>
              <span className="text-lg">{currency.name}</span>
              <span className="text-[#aea9b1] ml-2">({currency.symbol})</span>
            </div>
            {selectedCurrency === currency.code && <Check className="w-6 h-6 text-[#3b46f1]" />}
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

