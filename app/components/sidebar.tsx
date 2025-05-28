"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Shield, FileKey, Settings, LogOut, X } from "lucide-react"
import Image from "next/image"
import { useI18n } from "@/lib/i18n-context"

interface SidebarProps {
    isMobile: boolean
    sidebarOpen: boolean
    setSidebarOpen: (open: boolean) => void
    handleLogout: () => void
}

export function Sidebar({
                            isMobile,
                            sidebarOpen,
                            setSidebarOpen,
                            handleLogout,
                        }: SidebarProps) {
    const { t } = useI18n()
    const router = useRouter()
    const pathname = usePathname()

    const handleNav = (path: string) => {
        router.push(path)
        if (isMobile) setSidebarOpen(false)
    }

    const isActive = (path: string) => pathname === path

    return (
        <>
            <div
                className={`${
                    isMobile
                        ? `fixed inset-y-0 left-0 z-50 w-64 theme-card-bg backdrop-blur-md border-r border-emerald-500/20 transform transition-transform duration-300 ease-in-out ${
                            sidebarOpen ? "translate-x-0" : "-translate-x-full"
                        }`
                        : `w-64 theme-card-bg backdrop-blur-md border-r border-emerald-500/20 flex-shrink-0 ${
                            sidebarOpen ? "block" : "hidden"
                        }`
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="p-4 border-b border-emerald-500/20">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-12 h-12 bg-emerald-500/10 rounded-lg border border-emerald-400/20 flex-shrink-0">
                                    <Image src="/sankey-logo.png" alt="SANKEY Logo" width={32} height={32} className="w-8 h-8" />
                                </div>
                                <h1 className="text-xl font-bold text-white truncate">SANKEY</h1>
                            </div>
                            {isMobile && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSidebarOpen(false)}
                                    className="text-emerald-100 hover:text-white hover:bg-emerald-500/20"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        <Button
                            variant={isActive("/dashboard") ? "default" : "ghost"}
                            className={`w-full justify-start ${
                                isActive("/dashboard")
                                    ? "bg-emerald-500/20 theme-text-primary"
                                    : "theme-text-secondary hover:theme-text-primary hover:bg-emerald-500/20"
                            }`}
                            onClick={() => handleNav("/dashboard")}
                        >
                            <Shield className="w-4 h-4 mr-2" />
                            {t("nav.dashboard")}
                        </Button>

                        <Button
                            variant={isActive("/developer") ? "default" : "ghost"}
                            className={`w-full justify-start ${
                                isActive("/developer")
                                    ? "bg-emerald-500/20 theme-text-primary"
                                    : "theme-text-secondary hover:theme-text-primary hover:bg-emerald-500/20"
                            }`}
                            onClick={() => handleNav("/developer")}
                        >
                            <FileKey className="w-4 h-4 mr-2" />
                            {t("nav.developer")}
                        </Button>

                        <Button
                            variant={isActive("/settings") ? "default" : "ghost"}
                            className={`w-full justify-start ${
                                isActive("/settings")
                                    ? "bg-emerald-500/20 theme-text-primary"
                                    : "theme-text-secondary hover:theme-text-primary hover:bg-emerald-500/20"
                            }`}
                            onClick={() => handleNav("/settings")}
                        >
                            <Settings className="w-4 h-4 mr-2" />
                            {t("nav.settings")}
                        </Button>
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-emerald-500/20">
                        <Button
                            variant="ghost"
                            className="w-full justify-start theme-text-secondary hover:theme-text-primary hover:bg-emerald-500/20"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            {t("nav.signOut")}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isMobile && sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
            )}
        </>
    )
}
