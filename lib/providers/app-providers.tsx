"use client"

import React from 'react'
import { AuthProvider } from '@/lib/auth/auth-context'
import { ThemeProvider } from '@/lib/theme-context'
import { I18nProvider } from '@/lib/i18n-context'

interface AppProvidersProps {
    children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
    return (
        <I18nProvider>
            <ThemeProvider>
                <AuthProvider
                    redirectTo="/login"
                    publicPaths={[
                        '/login',
                        '/signup',
                        '/forgot-password',
                        '/reset-password',
                        '/verify-email',
                        '/auth/callback'
                    ]}
                >
                    {children}
                </AuthProvider>
            </ThemeProvider>
        </I18nProvider>
    )
}

// 個別Provider用のエクスポート（必要に応じて）
export { AuthProvider } from '@/lib/auth/auth-context'
export { ThemeProvider } from '@/lib/theme-context'
export { I18nProvider } from '@/lib/i18n-context'