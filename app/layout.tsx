"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/lib/theme-context"
import { I18nProvider } from "@/lib/i18n-context"
import { Sidebar } from "@/app/components/sidebar"

const inter = Inter({ subsets: ["latin"] })
//
// export const metadata: Metadata = {
//   title: "SANKEY - EA License Management System",
//   description: "Professional EA license management and verification system",
//   generator: "v0.dev",
// }

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  const [currentView, setCurrentView] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const router = useRouter()

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn")
    router.push("/login")
  }

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      setSidebarOpen(!mobile)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
      <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
      <ThemeProvider>
        <I18nProvider>
          <div className="min-h-screen theme-bg-gradient flex relative">
            <Sidebar
                isMobile={isMobile}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                currentView={currentView}
                setCurrentView={setCurrentView}
                handleLogout={handleLogout}
            />
            <div className="flex-1 flex flex-col min-w-0">
              {children}
            </div>
          </div>
        </I18nProvider>
      </ThemeProvider>
      </body>
      </html>
  )
}