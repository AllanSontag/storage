import { useState } from "react"

interface ToastProps {
  title: string
  description?: string
  duration?: number
}

export function useToast() {
  const [isVisible, setIsVisible] = useState(false)

  const showToast = ({ title, description, duration = 3000 }: ToastProps) => {
    setIsVisible(true)
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, duration)

    return () => clearTimeout(timer)
  }

  return {
    isVisible,
    showToast,
  }
}

