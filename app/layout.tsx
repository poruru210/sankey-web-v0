import React from "react"
import {Inter} from "next/font/google"
import type {Metadata} from "next"
import "./globals.css"
import {AppProviders} from "@/lib/providers/app-providers"

const inter = Inter({subsets: ["latin"]})

export const metadata: Metadata = {
    title: "SANKEY - EA License Management System",
    description: "Enterprise Application License Management System",
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="ja">
        <body>
        <AppProviders>
            {children}
        </AppProviders>
        </body>
        </html>
    )
}