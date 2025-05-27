"use client"

import { Button } from "@/components/ui/button"
import { Shield, FileKey, Settings, User, LogOut, X, Mail } from "lucide-react"
import Image from "next/image"
import {useI18n} from "@/lib/i18n-context";

interface SidebarProps {
    isMobile: boolean
    sidebarOpen: boolean
    setSidebarOpen: (open: boolean) => void
    currentView: string
    setCurrentView: (view: string) => void
    handleLogout: () => void
}

export function Sidebar({
                            isMobile,
                            sidebarOpen,
                            setSidebarOpen,
                            currentView,
                            setCurrentView,
                            handleLogout,
                        }: SidebarProps) {
    const { t } = useI18n()

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
                    {/* Logo Section - PC only */}
                    {!isMobile && (
                        <div className="p-4 border-b border-emerald-500/20">
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-12 h-12 bg-emerald-500/10 rounded-lg border border-emerald-400/20 flex-shrink-0">
                                    <Image src="/sankey-logo.png" alt="SANKEY Logo" width={32} height={32} className="w-8 h-8" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h1 className="text-xl font-bold text-white truncate">SANKEY</h1>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Menu Header - Mobile only */}
                    {isMobile && (
                        <div className="p-4 border-b border-emerald-500/20">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-white">Menu</h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSidebarOpen(false)}
                                    className="text-emerald-100 hover:text-white hover:bg-emerald-500/20"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    <nav className="flex-1 p-4 space-y-2">
                        <Button
                            variant={currentView === "dashboard" ? "default" : "ghost"}
                            className={`w-full justify-start ${
                                currentView === "dashboard"
                                    ? "bg-emerald-500/20 theme-text-primary"
                                    : "theme-text-secondary hover:theme-text-primary hover:bg-emerald-500/20"
                            }`}
                            onClick={() => {
                                setCurrentView("dashboard")
                                if (isMobile) setSidebarOpen(false)
                            }}
                        >
                            <Shield className="w-4 h-4 mr-2" />
                            {t("nav.dashboard")}
                        </Button>

                        <Button
                            variant={currentView === "developer" ? "default" : "ghost"}
                            className={`w-full justify-start ${
                                currentView === "developer"
                                    ? "bg-emerald-500/20 theme-text-primary"
                                    : "theme-text-secondary hover:theme-text-primary hover:bg-emerald-500/20"
                            }`}
                            onClick={() => {
                                setCurrentView("developer")
                                if (isMobile) setSidebarOpen(false)
                            }}
                        >
                            <FileKey className="w-4 h-4 mr-2" />
                            {t("nav.developer")}
                        </Button>

                        <Button
                            variant={currentView === "settings" ? "default" : "ghost"}
                            className={`w-full justify-start ${
                                currentView === "settings"
                                    ? "bg-emerald-500/20 theme-text-primary"
                                    : "theme-text-secondary hover:theme-text-primary hover:bg-emerald-500/20"
                            }`}
                            onClick={() => {
                                setCurrentView("settings")
                                if (isMobile) setSidebarOpen(false)
                            }}
                        >
                            <Settings className="w-4 h-4 mr-2" />
                            {t("nav.settings")}
                        </Button>
                    </nav>

                    {/* User Section */}
                    <div className="p-4 border-t border-emerald-500/20">
                        <div className="space-y-2">
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
            </div>

            {/* Overlay for mobile */}
            {isMobile && sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
            )}
        </>
    )
}