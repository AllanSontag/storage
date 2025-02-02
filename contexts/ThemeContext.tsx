"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

type Theme = "dark"

interface ThemeContextType {
  theme: Theme
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme] = useState<Theme>("dark")

  return (
    <ThemeContext.Provider value={{ theme }}>
      <div className="dark">{children}</div>
    </ThemeContext.Provider>
  )
}

