"use client"

import ParticlesBackground from "@/app/components/ParticlesBackground"
import { useTheme } from "@/lib/theme-context"

interface AuthLayoutProps {
    children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    const { theme } = useTheme()

    return (
        <>
            <ParticlesBackground theme={(theme as "light" | "dark") || "dark"} />
            <div className="min-h-screen flex items-center justify-center relative z-10">
                {children}
            </div>
        </>
    )
}