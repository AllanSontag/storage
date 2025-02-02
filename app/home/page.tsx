"use client"

import { useEffect, useState } from "react"
import { Bell, Send, DollarSign, FileText, Check, ChevronRight, CheckCircle, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "@/contexts/ThemeContext"
import { BottomNavigation } from "@/components/BottomNavigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/useToast"

interface Activity {
  id: number
  description: string
  date: string
  type: string
  value: number | null
}

interface BalanceData {
  sentBalance: number
  availableBalance: number
  totalBalance: number
}

export default function HomePage() {
  const router = useRouter()
  const { theme } = useTheme()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

        if (!isLoggedIn || !session) {
          localStorage.removeItem("isLoggedIn")
          router.push("/login")
          return
        }
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/login")
      }
    }
    checkAuth()
  }, [router])

  const [activities, setActivities] = useState<Activity[]>([])
  const [balanceData, setBalanceData] = useState<BalanceData>({
    sentBalance: 0,
    availableBalance: 0,
    totalBalance: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const { showToast } = useToast()
  const [firstName, setFirstName] = useState("User")
  const [userId, setUserId] = useState<string | null>(null)

  useAuth()

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.user_metadata?.full_name) {
        setFirstName(user.user_metadata.full_name.split(" ")[0])
      }
      setUserId(user?.id || null)
      if (user?.id) {
        fetchBalanceData(user.id)
        fetchActivities()
      }
    }
    fetchUserData()
  }, [])


  const fetchActivities = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("last_activity")
        .select("*")
        .order("date", { ascending: false })
        .limit(3)

      if (error) {
        throw error
      }

      setActivities(data || [])
    } catch (error) {
      console.error("Error fetching activities:", error)
      showToast("Failed to load activities", "error")
      setActivities([]) // Set empty array as fallback
    } finally {
      setIsLoading(false)
    }
  }
  const fetchBalanceData = async (userId: string | null) => {
    if (!userId) {
      console.log("User ID not available, skipping balance fetch")
      return
    }

    try {
      setIsLoading(true)

      // Fetch sent balance (sum of outgoing transactions)
      const { data: sentData, error: sentError } = await supabase
        .from("transactions")
        .select("amount")
        .eq("type", "outgoing")
        .eq("user_id", userId)

      if (sentError) throw sentError

      const sentBalance = sentData.reduce((sum, transaction) => sum + transaction.amount, 0)

      // Fetch confirmed invoices
      const { data: invoiceData, error: invoiceError } = await supabase
        .from("invoice_details")
        .select("amount")
        .eq("status", "paid")

      if (invoiceError) throw invoiceError

      const confirmedInvoices = invoiceData.reduce((sum, invoice) => sum + invoice.amount, 0)

      // Fetch expenses
      const { data: expenseData, error: expenseError } = await supabase
        .from("transactions")
        .select("amount")
        .eq("type", "outgoing")

      if (expenseError) throw expenseError

      const expenses = expenseData.reduce((sum, transaction) => sum + transaction.amount, 0)

      // Calculate available balance
      const availableBalance = confirmedInvoices - expenses

      // Calculate total balance
      const totalBalance = sentBalance + availableBalance

      setBalanceData({
        sentBalance,
        availableBalance,
        totalBalance,
      })
    } catch (error) {
      console.error("Error fetching balance data:", error)
      showToast("Failed to load balance data", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const balanceCards = [
    {
      title: "Saldo Enviado",
      amount: balanceData.sentBalance,
      icon: <Send className="w-6 h-6" />,
      color: "bg-blue-500",
    },
    {
      title: "Saldo Disponível",
      amount: balanceData.availableBalance,
      icon: <Wallet className="w-6 h-6" />,
      color: "bg-green-500",
    },
    {
      title: "Saldo Total",
      amount: balanceData.totalBalance,
      icon: <DollarSign className="w-6 h-6" />,
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="min-h-screen pb-20 bg-[#10002B] text-white">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12 cursor-pointer" onClick={() => router.push("/profile")}>
            <AvatarImage src="/placeholder.svg" alt="User avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <h1
              className="text-2xl font-semibold cursor-pointer hover:underline"
              onClick={() => router.push("/configuracoes/perfil")}
            >
              Hello {firstName}
            </h1>
            <p className="text-[#aea9b1]">Welcome back</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="relative p-2 rounded-full transition-colors hover:bg-[#1c1e34]"
            onClick={() => router.push("/notifications")}
            aria-label="Notifications"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#e46962] rounded-full" />
          </button>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="px-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Saldos</h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-32"></div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {balanceCards.map((card, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl ${theme === "light" ? "bg-[#10002B] text-white" : "bg-[#3C096C] text-white"}`}
              >
                <div className="flex justify-between items-center mb-2">
                  {card.icon}
                  <span className="text-xs font-medium">{card.title}</span>
                </div>
                <p className="text-lg font-bold">
                  ${card.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between px-6 mt-6 gap-4">
        <Button
          onClick={() => router.push("/sent")}
          className="flex-1 bg-[#3C096C] text-white hover:bg-[#3C096C]/80 rounded-full py-3 px-4 flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          <span>Enviar $</span>
        </Button>
        <Button
          className="flex-1 bg-[#3C096C] text-white hover:bg-[#3C096C]/80 rounded-full py-3 px-4 flex items-center justify-center gap-2"
          onClick={() => router.push("/saldos-confirmados")}
        >
          <CheckCircle className="w-5 h-5" />
          <span>Confirmados</span>
        </Button>
        <Button
          className="flex-1 bg-[#3C096C] text-white hover:bg-[#3C096C]/80 rounded-full py-3 px-4 flex items-center justify-center gap-2"
          onClick={() => router.push("/balance")}
        >
          <Wallet className="w-5 h-5" />
          <span>Balance</span>
        </Button>
      </div>

      {/* Last Activity */}
      <div className="px-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Last activity</h2>
          <Button
            variant="ghost"
            className="text-[#F65C47] hover:text-[#F65C47]/80"
            onClick={() => router.push("/all-activities")}
          >
            View All
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-4">Loading activities...</div>
          ) : activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between bg-[#3C096C] p-4 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#240046] flex items-center justify-center">
                    {activity.type === "money_sent" && <Send className="w-6 h-6 text-blue-500" />}
                    {activity.type === "balance_checked" && <Check className="w-6 h-6 text-green-500" />}
                    {activity.type === "invoice_created" && <FileText className="w-6 h-6 text-purple-500" />}
                  </div>
                  <div>
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-[#aea9b1]">
                      {new Date(activity.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                {activity.value !== null && (
                  <p className={`font-semibold ${activity.value > 0 ? "text-green-500" : "text-red-500"}`}>
                    {activity.value > 0 ? "+" : "-"}$
                    {Math.abs(activity.value).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-400">No activities found</div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}

