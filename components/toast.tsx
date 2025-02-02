"use client"

import { useToast } from "@/contexts/ToastContext"

export function Toast() {
  const { toast } = useToast()

  if (!toast) return null

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-sm ${
        toast.type === "success" ? "bg-green-500" : "bg-red-500"
      } text-white z-50`}
    >
      {toast.message}
    </div>
  )
}

