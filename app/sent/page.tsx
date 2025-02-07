"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Send, ArrowDownLeft, ArrowUpRight, Upload, TrendingUp, TrendingDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/useToast"
import { v4 as uuidv4 } from "uuid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"

interface Transaction {
  id: string
  type: "incoming" | "outgoing"
  amount: number
  date: string
  receipt_url?: string | null
  user_id: string
  confirmed: boolean
  confirmed_by?: string
  confirmed_when?: string
}

interface MonthlyData {
  month: string
  incoming: number
  outgoing: number
}

export default function SentPage() {
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [receipt, setReceipt] = useState<File | null>(null)
  const [formattedAmount, setFormattedAmount] = useState("")
  const [userId, setUserId] = useState<string | null>(null)
  const { showToast } = useToast()
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [netBalance, setNetBalance] = useState(0)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formattedAmount || !userId) return

    const parsedAmount = Number.parseFloat(formattedAmount.replace(/,/g, ""))
    if (isNaN(parsedAmount)) return

    try {
      setIsLoading(true)

      // Upload receipt if available
      let receiptUrl = null
      if (receipt) {
        const fileExt = receipt.name.split(".").pop()
        const fileName = `${uuidv4()}.${fileExt}`
        const filePath = `receipts/${fileName}`

        const { error: uploadError } = await supabase.storage.from("receipts").upload(filePath, receipt)

        if (uploadError) throw uploadError

        const { data: urlData } = await supabase.storage.from("receipts").getPublicUrl(filePath)

        receiptUrl = urlData.publicUrl
      }

      // Add transaction to the database
      const { data, error } = await supabase
        .from("transactions")
        .insert({
          type: "incoming",
          amount: parsedAmount,
          receipt_url: receiptUrl,
          date: new Date().toISOString(),
          user_id: userId,
          confirmed: false, // New transactions are not confirmed by default
        })
        .select()

      if (error) throw error

      showToast("Transaction added successfully", "success")
      setFormattedAmount("")
      setReceipt(null)
      fetchTransactions() // Refresh the transactions list
      fetchMonthlyData() // Refresh the chart data
    } catch (error) {
      console.error("Error adding transaction:", error)
      showToast("Failed to add transaction", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const confirmTransaction = async (transactionId: string) => {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) {
      showToast("Error getting user information", "error")
      return
    }

    const { error } = await supabase
      .from("transactions")
      .update({
        confirmed: true,
        confirmed_by: userData.user.id,
        confirmed_when: new Date().toISOString(),
      })
      .eq("id", transactionId)

    if (error) {
      showToast("Error confirming transaction", "error")
    } else {
      showToast("Transaction confirmed successfully", "success")
      fetchTransactions() // Refresh the transactions list
    }
  }

  const fetchTransactions = async () => {
    if (!userId) return

    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false })

      if (error) throw error

      setTransactions(data)
      calculateTotals(data)
    } catch (error) {
      console.error("Error fetching transactions:", error)
      showToast("Failed to fetch transactions", "error")
    }
  }

  const calculateTotals = (data: Transaction[]) => {
    const totals = data.reduce(
      (acc, transaction) => {
        if (transaction.type === "incoming") {
          acc.income += transaction.amount
        } else {
          acc.expenses += transaction.amount
        }
        return acc
      },
      { income: 0, expenses: 0 },
    )
    setTotalIncome(totals.income)
    setTotalExpenses(totals.expenses)
    setNetBalance(totals.income - totals.expenses)
  }

  const fetchMonthlyData = async () => {
    if (!userId) return

    try {
      const { data, error } = await supabase.from("transactions").select("*").eq("user_id", userId)

      if (error) throw error

      const monthlyData: { [key: string]: { incoming: number; outgoing: number } } = {}

      data.forEach((transaction) => {
        const date = new Date(transaction.date)
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = { incoming: 0, outgoing: 0 }
        }

        if (transaction.type === "incoming") {
          monthlyData[monthYear].incoming += transaction.amount
        } else {
          monthlyData[monthYear].outgoing += transaction.amount
        }
      })

      const chartData = Object.entries(monthlyData)
        .map(([month, data]) => ({
          month,
          incoming: data.incoming,
          outgoing: data.outgoing,
        }))
        .sort((a, b) => a.month.localeCompare(b.month))

      setMonthlyData(chartData)
    } catch (error) {
      console.error("Error fetching monthly data:", error)
      showToast("Failed to fetch monthly data", "error")
    }
  }

  useEffect(() => {
    const fetchUserId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUserId(user?.id || null)
    }
    fetchUserId()
  }, [])

  useEffect(() => {
    if (userId) {
      fetchTransactions()
      fetchMonthlyData()
    }
  }, [userId, fetchMonthlyData]) // Added fetchMonthlyData to dependencies

  return (
    <div className="min-h-screen bg-[#10002B] text-white">
      {/* Header */}
      <div className="p-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-semibold">Send Money</h1>
      </div>

      {/* Financial Summary Cards */}
      <div className="px-6 grid grid-cols-3 gap-4 mb-6">
        <Card className="bg-[#3C096C]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              ${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#3C096C]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              ${totalExpenses.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#3C096C]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            {netBalance >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netBalance >= 0 ? "text-green-500" : "text-red-500"}`}>
              ${Math.abs(netBalance).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Transactions Chart */}
      <div className="px-6 mb-6">
        <Card className="bg-[#3C096C]">
          <CardHeader>
            <CardTitle className="text-white">Financial Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                incoming: {
                  label: "Incoming",
                  color: "hsl(var(--chart-1))",
                },
                outgoing: {
                  label: "Outgoing",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="incoming" fill="var(--color-incoming)" name="Incoming" />
                  <Bar dataKey="outgoing" fill="var(--color-outgoing)" name="Outgoing" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Send Form */}
      <form onSubmit={handleSend} className="px-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={formattedAmount}
            onChange={(e) => setFormattedAmount(e.target.value)}
            className="bg-[#3C096C] border-none text-white placeholder-gray-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="receipt">Receipt (optional)</Label>
          <Input
            id="receipt"
            type="file"
            onChange={(e) => setReceipt(e.target.files?.[0] || null)}
            className="bg-[#3C096C] border-none text-white"
          />
        </div>
        <Button type="submit" className="w-full bg-[#F65C47] hover:bg-[#F65C47]/80" disabled={isLoading || !userId}>
          <Send className="w-4 h-4 mr-2" />
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </form>

      {/* Transactions List */}
      <div className="px-6 space-y-4 mt-6">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        {transactions.slice(0, 5).map((transaction) => (
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
                <p className="font-medium">{transaction.type === "incoming" ? "Received" : "Sent"}</p>
                <p className="text-sm text-[#aea9b1]">{new Date(transaction.date).toLocaleString()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${transaction.type === "incoming" ? "text-green-500" : "text-red-500"}`}>
                {transaction.type === "incoming" ? "+" : "-"}$
                {transaction.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              {transaction.receipt_url && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-1 text-[#F65C47] hover:text-[#F65C47]/80"
                  onClick={() => transaction.receipt_url && window.open(transaction.receipt_url, "_blank")}
                >
                  <Upload className="w-4 h-4 mr-1" />
                  View Receipt
                </Button>
              )}
              {!transaction.confirmed && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-1 text-green-500 hover:text-green-400"
                  onClick={() => confirmTransaction(transaction.id)}
                >
                  Confirm
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

