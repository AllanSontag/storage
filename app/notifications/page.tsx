// "use client"

// import { ArrowLeft, Receipt, ArrowDownLeft, ArrowUpLeft, ImageIcon } from "lucide-react"
// import { useRouter } from "next/navigation"
// import { useTheme } from "@/contexts/ThemeContext"
// import { Button } from "@/components/ui/button"

// interface Notification {
//   id: number
//   date: string
//   title: string
//   description: string
//   type: "deposit" | "bill" | "alert"
// }

// export default function NotificationsPage() {
//   const router = useRouter()
//   const { theme } = useTheme()

//   const notifications: Notification[] = [
//     {
//       id: 1,
//       date: "25 Jan 2023",
//       title: "New Deposit Received",
//       description: "Your account has been credited with $500",
//       type: "deposit",
//     },
//     {
//       id: 2,
//       date: "25 Jan 2023",
//       title: "Bill Payment Reminder",
//       description: "You have an outstanding bill payment of $100",
//       type: "bill",
//     },
//     {
//       id: 3,
//       date: "25 Jan 2023",
//       title: "Overdraft Alert",
//       description: "Your account balance is below $100",
//       type: "alert",
//     },
//     {
//       id: 4,
//       date: "25 Jan 2023",
//       title: "New Deposit Received",
//       description: "Your account balance is credited $100",
//       type: "deposit",
//     },
//     {
//       id: 5,
//       date: "25 Jan 2023",
//       title: "New Deposit Received",
//       description: "Your account has been credited with $500",
//       type: "deposit",
//     },
//   ]

//   const getIcon = (type: Notification["type"]) => {
//     switch (type) {
//       case "deposit":
//         return <ImageIcon className="w-6 h-6 text-[#0077fe]" />
//       case "bill":
//         return <Receipt className="w-6 h-6 text-[#1fb85c]" />
//       case "alert":
//         return <ArrowDownLeft className="w-6 h-6 text-[#e46962]" />
//     }
//   }

//   return (
//     <div
//       className={`min-h-screen ${
//         theme === "light" ? "bg-gradient-to-b from-[#F65C47] to-[#3E005B] text-white" : "bg-[#10002B] text-white"
//       }`}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between p-6">
//         <div className="flex items-center gap-4">
//           <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-white/10">
//             <ArrowLeft className="w-6 h-6" />
//           </Button>
//           <h1 className="text-2xl font-semibold">Notification</h1>
//         </div>
//         <button className="text-[#e46962] text-sm font-medium">Clear all</button>
//       </div>

//       {/* Notifications List */}
//       <div className="px-6 space-y-4">
//         {notifications.map((notification) => (
//           <div key={notification.id} className="p-4 bg-[#3C096C] rounded-2xl flex items-start gap-4">
//             <div className="w-12 h-12 rounded-xl bg-[#240046] flex items-center justify-center flex-shrink-0">
//               {getIcon(notification.type)}
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm text-gray-300 mb-1">{notification.date}</p>
//               <h3 className="font-semibold mb-1">{notification.title}</h3>
//               <p className="text-gray-300 text-sm">{notification.description}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Bell, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/useToast"
import { useTheme } from "@/contexts/ThemeContext"

interface Notification {
  id: string
  user_id: string
  message: string
  created_at: string
  read: boolean
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showRead, setShowRead] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { showToast } = useToast()
  const { theme } = useTheme()


  useEffect(() => {
    fetchNotifications()
  }, []) // Removed showRead from dependencies

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .eq("read", showRead)
        .order("created_at", { ascending: false })

      if (error) throw error

      setNotifications(data || [])
    } catch (error) {
      console.error("Error fetching notifications:", error)
      showToast("Failed to load notifications", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase.from("notifications").update({ read: true }).eq("id", notificationId)

      if (error) throw error

      setNotifications(notifications.filter((n) => n.id !== notificationId))
      showToast("Notification marked as read", "success")
    } catch (error) {
      console.error("Error marking notification as read:", error)
      showToast("Failed to mark notification as read", "error")
    }
  }

  return (
<div
      className={`min-h-screen ${
        theme === "light" ? "bg-gradient-to-b from-[#F65C47] to-[#3E005B] text-white" : "bg-[#10002B] text-white"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
        <Button onClick={() => setShowRead(!showRead)} variant="outline" className="rounded-full">
          {showRead ? "Show Unread" : "Show Read"}
        </Button>
      </div>

      {isLoading ? (
        <p className="text-center">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <Card className="bg-gray-100 rounded-xl border-0">
          <CardContent className="p-4 text-center">
            <Bell className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-600">{showRead ? "No read notifications" : "No new notifications"}</p>
          </CardContent>
        </Card>
      ) : (
        notifications.map((notification) => (
          <Card key={notification.id} className="mb-4 rounded-xl border-0">
            <CardContent className="flex justify-between items-center p-4">
              <div>
                <p className="font-medium">{notification.message}</p>
                <p className="text-sm text-gray-500">{new Date(notification.created_at).toLocaleString()}</p>
              </div>
              {!showRead && (
                <Button
                  onClick={() => markAsRead(notification.id)}
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <CheckCircle className="h-5 w-5" />
                </Button>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}


