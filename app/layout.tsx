import React from "react"
import {Inter} from "next/font/google"
import type {Metadata} from "next"
import "./globals.css"
import {ThemeProvider} from "@/lib/theme-context"
import {I18nProvider} from "@/lib/i18n-context"
import ClientLayout from "@/app/components/ClientLayout"

const inter = Inter({subsets: ["latin"]})

export const metadata: Metadata = {
    title: "Your App Name",
    description: "Your app description",
}

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
        <ThemeProvider>
            <I18nProvider>
                <ClientLayout>
                    {children}
                </ClientLayout>
            </I18nProvider>
        </ThemeProvider>
        </body>
        </html>
    )
}