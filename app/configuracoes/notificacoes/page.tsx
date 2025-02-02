"use client"

import { useState } from "react"
import { ArrowLeft, Bell, MessageSquare, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/useToast"

export default function NotificacoesPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [pushNotifications, setPushNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)

  const handleSave = () => {
    showToast("Notification settings updated", "success")
  }

  return (
    <div className="min-h-screen bg-[#10002B] text-white">
      <div className="flex items-center gap-4 p-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-white/10">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-semibold">Notifications</h1>
      </div>

      <div className="px-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-[#3b46f1]" />
            <div>
              <h3 className="font-semibold">Push Notifications</h3>
              <p className="text-sm text-gray-300">Receive push notifications</p>
            </div>
          </div>
          <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="w-6 h-6 text-[#3b46f1]" />
            <div>
              <h3 className="font-semibold">Email Notifications</h3>
              <p className="text-sm text-gray-300">Receive email notifications</p>
            </div>
          </div>
          <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-[#3b46f1]" />
            <div>
              <h3 className="font-semibold">SMS Notifications</h3>
              <p className="text-sm text-gray-300">Receive SMS notifications</p>
            </div>
          </div>
          <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
        </div>

        <Button onClick={handleSave} className="w-full bg-[#3b46f1] hover:bg-[#3b46f1]/90 text-white mt-6">
          Save Changes
        </Button>
      </div>
    </div>
  )
}

