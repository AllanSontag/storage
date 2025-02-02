"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/useToast"
import { useAuth } from "@/hooks/useAuth"

interface FinancialData {
  date: string
  income: number
  expenses: number
}

export default function BalancePage() {
  const router = useRouter()
  const { theme } = useTheme()
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [netIncome, setNetIncome] = useState(0)
  const [monthlyData, setMonthlyData] = useState<{ date: string; income: number; expenses: number }[]>([])

  useAuth()

  useEffect(() => {
    fetchTransactionData()
  }, [])

  const fetchTransactionData = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.from("transactions").select("*").order("date", { ascending: true })

      if (error) throw error

      const processedData = processTransactionData(data)
      setTotalIncome(processedData.totalIncome)
      setTotalExpenses(processedData.totalExpenses)
      setNetIncome(processedData.netIncome)
      setMonthlyData(processedData.monthlyData)
    } catch (error) {
      console.error("Error fetching transaction data:", error)
      showToast("Failed to load financial data", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const processTransactionData = (transactions: any[]) => {
    let totalIncome = 0
    let totalExpenses = 0
    const monthlyDataMap: { [key: string]: { income: number; expenses: number } } = {}

    transactions.forEach((transaction) => {
      const amount = transaction.amount
      const date = new Date(transaction.date)
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (transaction.type === "incoming") {
        totalIncome += amount
        monthlyDataMap[monthYear] = monthlyDataMap[monthYear] || { income: 0, expenses: 0 }
        monthlyDataMap[monthYear].income += amount
      } else {
        totalExpenses += amount
        monthlyDataMap[monthYear] = monthlyDataMap[monthYear] || { income: 0, expenses: 0 }
        monthlyDataMap[monthYear].expenses += amount
      }
    })

    const netIncome = totalIncome - totalExpenses
    const monthlyData = Object.entries(monthlyDataMap).map(([date, data]) => ({
      date,
      income: data.income,
      expenses: data.expenses,
    }))

    return { totalIncome, totalExpenses, netIncome, monthlyData }
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "light" ? "bg-gradient-to-b from-[#F65C47] to-[#3E005B] text-white" : "bg-[#10002B] text-white"
      }`}
    >
      {/* Header */}
      <div className="p-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-white/10">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-semibold">Financial Report</h1>
      </div>

      {/* Financial Summary Cards */}
      <div className="px-6 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-[#3C096C]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">${totalIncome.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#3C096C]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">${totalExpenses.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#3C096C]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            {netIncome >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netIncome >= 0 ? "text-green-500" : "text-red-500"}`}>
              ${Math.abs(netIncome).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Chart */}
      <div className="px-6 mb-6">
        <Card className="bg-[#3C096C] p-4">
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-[300px]">
                <p>Loading chart data...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="#4ade80" name="Income" />
                  <Bar dataKey="expenses" fill="#f87171" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

