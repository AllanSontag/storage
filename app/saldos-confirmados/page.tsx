"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, CheckCircle, ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/useToast"
import { useAuth } from "@/hooks/useAuth"

interface ConfirmedTransaction {
  id: string
  type: "incoming" | "outgoing"
  amount: number
  date: string
  confirmed_when: string
}

export default function SaldosConfirmadosPage() {
  const router = useRouter()
  const { theme } = useTheme()
  const [confirmedTransactions, setConfirmedTransactions] = useState<ConfirmedTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { showToast } = useToast()
  const [totalConfirmedBalance, setTotalConfirmedBalance] = useState(0)
  useAuth()

  useEffect(() => {
    fetchConfirmedTransactions()
  }, [])

  const fetchConfirmedTransactions = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("transactions")
        .select("id, type, amount, date, confirmed_when")
        .eq("confirmed", true)
        .order("confirmed_when", { ascending: false })

      if (error) {
        throw error
      }

      setConfirmedTransactions(data || [])
      calculateTotalConfirmedBalance(data)
    } catch (error) {
      console.error("Error fetching confirmed transactions:", error)
      showToast("Failed to load confirmed transactions", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const calculateTotalConfirmedBalance = (transactions: ConfirmedTransaction[]) => {
    const total = transactions.reduce((acc, transaction) => {
      return transaction.type === "incoming" ? acc + transaction.amount : acc - transaction.amount
    }, 0)
    setTotalConfirmedBalance(total)
  }

  return (
    <div
      className={`min-h-screen ${theme === "light" ? "bg-gradient-to-b from-[#F65C47] to-[#3E005B] text-white" : "bg-[#10002B] text-white"
        }`}
    >
      {/* Header */}
      <div className="p-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-white/10">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-semibold">Saldos Confirmados</h1>
      </div>

      {/* Total Confirmed Balance */}
      <div className="px-6 mt-8">
        <div className="bg-[#3C096C] p-4 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">Saldo Total Confirmado</h2>
          <p className="text-2xl font-bold text-green-500" >
            $
            {totalConfirmedBalance.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      {/* Confirmed Transactions List */}
      <div className="px-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Transações Confirmadas</h2>
        {isLoading ? (
          <div className="text-center py-4">Carregando transações confirmadas...</div>
        ) : confirmedTransactions.length > 0 ? (
          confirmedTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between bg-[#3C096C] p-4 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#240046] flex items-center justify-center">
                  {transaction.type === "incoming" ? (
                    <ArrowDownLeft className="w-6 h-6 text-green-500" />
                  ) : (
                    <ArrowUpRight className="w-6 h-6 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{transaction.type === "incoming" ? "Recebido" : "Enviado"}</p>
                  <p className="text-sm text-[#aea9b1]">
                    Confirmado em: {new Date(transaction.confirmed_when).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${transaction.type === "incoming" ? "text-green-500" : "text-red-500"}`}>
                  {transaction.type === "incoming" ? "+" : "-"}$
                  {transaction.amount.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-sm text-[#aea9b1]">Data: {new Date(transaction.date).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-400">Nenhuma transação confirmada encontrada</div>
        )}
      </div>
    </div>
  )
}

