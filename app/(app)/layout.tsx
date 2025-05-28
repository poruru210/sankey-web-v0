"use client"

import React, { useState, useEffect } from "react"
import { Sidebar } from "@/app/components/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import ParticlesBackground from "@/app/components/ParticlesBackground"
import { useTheme } from "@/lib/theme-context"
import { MobileHeader } from "@/app/components/mobile-header"
import { ProtectedRoute } from "@/lib/auth/protected-route"
import { DebugAuthInfo } from "@/app/components/ debug-auth-info"

interface AppLayoutProps {
    children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const { theme } = useTheme()

    // モバイル検出とサイドバー制御
    useEffect(() => {
        if (typeof window === 'undefined') return

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
        <ProtectedRoute>
            <DebugAuthInfo />
            <ParticlesBackground theme={(theme as "light" | "dark") || "dark"} />
            <div className="min-h-screen flex relative z-0">
                <Sidebar
                    setSidebarOpen={setSidebarOpen}
                    sidebarOpen={sidebarOpen}
                    isMobile={isMobile}
                />
                <div className="flex-1 flex flex-col min-w-0 relative z-10">
                    {isMobile ? (
                        <MobileHeader
                            handleLogoClick={() => setSidebarOpen(true)}
                        />
                    ) : (
                        <header className="flex justify-between items-center p-4">
                            <div className="flex items-center space-x-1 sm:space-x-2 ml-auto">
                                <ThemeToggle />
                                <LanguageToggle />
                            </div>
                        </header>
                    )}
                    <main className="flex-1 flex flex-col">{children}</main>
                </div>
            </div>
        </ProtectedRoute>
    )
}