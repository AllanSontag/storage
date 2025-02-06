"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Send, ArrowDownLeft, CreditCard, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/useToast"

interface Activity {
  id: string
  type: "incoming" | "outgoing"
  recipient: string
  date: string
  amount: number
}

export default function AllActivitiesPage() {
  const router = useRouter()
  const { theme } = useTheme()
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { showToast } = useToast()
  useAuth()

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true)
        const { data, error } = await supabase.from("client_account").select("*").order("date", { ascending: false })

        if (error) {
          throw error
        }

        setActivities(data || [])
      } catch (error) {
        console.error("Error fetching activities:", error)
        showToast("Failed to load activities", "error")
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivities()
  }, [showToast])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "incoming":
        return <ArrowDownLeft className="w-6 h-6 text-green-500" />
      case "outgoing":
        return <Send className="w-6 h-6 text-red-500" />
      default:
        return <CreditCard className="w-6 h-6 text-blue-500" />
    }
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "light" ? "bg-gradient-to-b from-[#F65C47] to-[#3E005B] text-white" : "bg-[#10002B] text-white"
      }`}
    >
      {/* Header */}
      <div className="p-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-semibold">All Activities</h1>
      </div>

      {/* Activities List */}
      <div className="px-6 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between bg-[#3C096C] p-4 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#240046] flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p className="font-medium">
                    {activity.type === "incoming" ? "Received from" : "Sent to"} {activity.recipient}
                  </p>
                  <p className="text-sm text-[#aea9b1]">
                    {new Date(activity.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <p className={`font-semibold ${activity.type === "incoming" ? "text-green-500" : "text-red-500"}`}>
                {activity.type === "incoming" ? "+" : "-"}$
                {Math.abs(activity.amount).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">No activities found</div>
        )}
      </div>
    </div>
  )
}

