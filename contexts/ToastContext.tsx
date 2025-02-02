"use client"

import React, { createContext, useContext, useState, type ReactNode } from "react"

interface ToastProps {
  message: string
  type: "success" | "error"
}

interface ToastContextType {
  toast: ToastProps | null
  showToast: (message: string, type: "success" | "error") => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastProps | null>(null)

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 3000)
  }

  return <ToastContext.Provider value={{ toast, showToast }}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

