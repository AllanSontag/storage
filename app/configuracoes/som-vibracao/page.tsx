"use client"

import { useState } from "react"
import { ArrowLeft, Volume, Vibrate } from "lucide-react"
import { useRouter } from "next/navigation"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/useToast"

export default function SomVibracaoPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [volume, setVolume] = useState(50)
  const [notificationSound, setNotificationSound] = useState(true)
  const [transactionSound, setTransactionSound] = useState(true)
  const [notificationVibration, setNotificationVibration] = useState(true)
  const [transactionVibration, setTransactionVibration] = useState(true)

  const handleSave = () => {
    showToast("Sound and vibration settings updated", "success")
    router.back()
  }

  return (
    <div className="min-h-screen bg-[#10002B] text-white">
      <div className="flex items-center gap-4 p-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-white/10">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-semibold">Sound and Vibration</h1>
      </div>

      <div className="px-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">App Volume</h3>
          <div className="flex items-center gap-4">
            <Volume className="w-6 h-6 text-[#3b46f1]" />
            <Slider
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              max={100}
              step={1}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Sound Settings</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Notification Sound</span>
              <Switch checked={notificationSound} onCheckedChange={setNotificationSound} />
            </div>
            <div className="flex items-center justify-between">
              <span>Transaction Sound</span>
              <Switch checked={transactionSound} onCheckedChange={setTransactionSound} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Vibration Settings</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Notification Vibration</span>
              <Switch checked={notificationVibration} onCheckedChange={setNotificationVibration} />
            </div>
            <div className="flex items-center justify-between">
              <span>Transaction Vibration</span>
              <Switch checked={transactionVibration} onCheckedChange={setTransactionVibration} />
            </div>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full bg-[#3b46f1] hover:bg-[#3b46f1]/90 text-white mt-6">
          Save Changes
        </Button>
      </div>
    </div>
  )
}

