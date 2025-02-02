import { useState, useEffect } from 'react'

interface ToastProps {
  title: string
  description?: string
  duration?: number
}

export function toast({ title, description, duration = 3000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 bg-[#3b46f1] text-[#ffffff] p-4 rounded-lg shadow-lg max-w-sm">
      <h3 className="font-semibold">{title}</h3>
      {description && <p className="text-sm mt-1">{description}</p>}
    </div>
  )
}

