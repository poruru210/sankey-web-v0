"use client"

import React, {useState, useEffect, useCallback} from "react"
import {useRouter} from "next/navigation"
import {Sidebar} from "@/app/components/sidebar"
import {ThemeToggle} from "@/components/theme-toggle";
import {LanguageToggle} from "@/components/language-toggle";
import ParticlesBackground from "@/app/components/ParticlesBackground";
import {useTheme} from "next-themes";
import type {Container, Engine} from "tsparticles-engine";
import {loadSlim} from "tsparticles-slim";
import {MobileHeader} from "@/app/components/mobile-header";

export default function ClientLayout({
                                         children,
                                     }: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    const router = useRouter()
    const {theme} = useTheme();

    const handleLogout = () => {
        sessionStorage.removeItem("isLoggedIn")
        router.push("/login")
    }

    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine)
    }, [])

    const particlesLoaded = useCallback(async (container: Container | undefined) => {
        // Particles loaded callback
    }, [])

    useEffect(() => {
        // windowオブジェクトの存在確認を追加
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
        <>
            <ParticlesBackground
                theme={(theme as "light" | "dark") || "dark"}
                particlesInit={particlesInit}
                particlesLoaded={particlesLoaded}
            />
            <div className="min-h-screen flex relative z-0">
                <Sidebar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} handleLogout={handleLogout}
                         isMobile={isMobile}/>
                <div className="flex-1 flex flex-col min-w-0 relative z-10">
                    {/* モバイル時はMobileHeader、デスクトップ時は通常のヘッダー */}
                    {isMobile ? (
                        <MobileHeader handleLogoClick={() => {
                            setSidebarOpen(true)
                        }}/>
                    ) : (
                        <header className="flex justify-between items-center p-4">
                            <div className="flex items-center space-x-1 sm:space-x-2 ml-auto">
                                <ThemeToggle/>
                                <LanguageToggle/>
                            </div>
                        </header>
                    )}
                    <main className="flex-1 flex flex-col">{children}</main>
                </div>
            </div>
        </>
    )
}