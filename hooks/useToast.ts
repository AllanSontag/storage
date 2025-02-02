import { useState } from "react"

interface ToastProps {
  message: string
  type: "success" | "error"
}

export function useToast() {
  const [toast, setToast] = useState<ToastProps | null>(null)

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 3000)
  }

  return { toast, showToast }
}

