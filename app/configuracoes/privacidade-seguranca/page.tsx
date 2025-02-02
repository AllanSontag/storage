"use client"

import { useState } from "react"
import { ArrowLeft, Shield, Eye, Bell, Smartphone } from "lucide-react"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/useToast"

export default function PrivacidadeSegurancaPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [twoFactor, setTwoFactor] = useState(false)
  const [privacyMode, setPrivacyMode] = useState(false)
  const [securityAlerts, setSecurityAlerts] = useState(true)

  const handleSave = () => {
    showToast("Privacy and security settings updated", "success")
  }

  return (
    <div className="min-h-screen bg-[#10002B] text-white">
      <div className="flex items-center gap-4 p-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-white/10">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-semibold">Privacy and Security</h1>
      </div>

      <div className="px-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-[#3b46f1]" />
            <div>
              <h3 className="font-semibold">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-300">Enable additional authentication</p>
            </div>
          </div>
          <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="w-6 h-6 text-[#3b46f1]" />
            <div>
              <h3 className="font-semibold">Privacy Mode</h3>
              <p className="text-sm text-gray-300">Hide sensitive information</p>
            </div>
          </div>
          <Switch checked={privacyMode} onCheckedChange={setPrivacyMode} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-[#3b46f1]" />
            <div>
              <h3 className="font-semibold">Security Alerts</h3>
              <p className="text-sm text-gray-300">Receive security notifications</p>
            </div>
          </div>
          <Switch checked={securityAlerts} onCheckedChange={setSecurityAlerts} />
        </div>

        <Button
          onClick={() => router.push("/configuracoes/gerenciar-dispositivos")}
          variant="outline"
          className="w-full mt-6"
        >
          <Smartphone className="w-4 h-4 mr-2" />
          Manage Devices
        </Button>

        <Button onClick={handleSave} className="w-full bg-[#3b46f1] hover:bg-[#3b46f1]/90 text-white mt-6">
          Save Changes
        </Button>
      </div>
    </div>
  )
}

