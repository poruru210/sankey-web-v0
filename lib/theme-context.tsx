"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// サーバーサイドでテーマを事前設定するスクリプト
const ThemeScript = () => {
  const script = `
    (function() {
      try {
        const savedTheme = localStorage.getItem("theme") || "dark";
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(savedTheme);
      } catch (e) {
        document.documentElement.classList.add("dark");
      }
    })()
  `
  
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    // Apply theme to document
    document.documentElement.classList.remove("light", "dark")
    document.documentElement.classList.add(theme)
    localStorage.setItem("theme", theme)
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  return (
    <>
      <ThemeScript />
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    </>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    // Provide fallback values when used outside of ThemeProvider
    return {
      theme: "dark" as Theme,
      toggleTheme: () => {},
    }
  }
  return context
}