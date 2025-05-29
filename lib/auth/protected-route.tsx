"use client"

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { Loader2, Shield, AlertCircle } from 'lucide-react'
import { useI18n } from "@/lib/i18n-context"

interface ProtectedRouteProps {
    children: React.ReactNode
    redirectTo?: string
    requiredRole?: string
    fallback?: React.ReactNode
    loadingComponent?: React.ReactNode
    errorComponent?: React.ReactNode
}

export function ProtectedRoute({
                                   children,
                                   redirectTo = '/login',
                                   requiredRole,
                                   fallback,
                                   loadingComponent,
                                   errorComponent
                               }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, user } = useAuth()
    const { t } = useI18n()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            // 認証されていない場合、現在のパスを保存してリダイレクト
            const returnUrl = encodeURIComponent(pathname)
            const redirectUrl = `${redirectTo}?returnUrl=${returnUrl}`
            router.replace(redirectUrl)
        }
    }, [isAuthenticated, isLoading, router, redirectTo, pathname])

    // ローディング中
    if (isLoading) {
        if (loadingComponent) {
            return <>{loadingComponent}</>
        }

        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto bg-emerald-500/10 rounded-full border border-emerald-400/20">
                        <Shield className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                        <span className="text-emerald-300 font-medium">{t("login.checkingAuth")}</span>
                    </div>
                    <p className="text-slate-400 text-sm">
                        {t("login.securingAccess")}
                    </p>
                </div>
            </div>
        )
    }

    // 認証されていない場合
    if (!isAuthenticated) {
        if (fallback) {
            return <>{fallback}</>
        }

        // リダイレクト中の表示
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-500/10 rounded-full border border-red-400/20">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Loader2 className="w-5 h-5 animate-spin text-red-400" />
                        <span className="text-red-300 font-medium">認証が必要です</span>
                    </div>
                    <p className="text-slate-400 text-sm">
                        ログインページにリダイレクトしています...
                    </p>
                </div>
            </div>
        )
    }

    // ロール確認
    if (requiredRole && user) {
        const userRole = user.role || user['custom:role'] || 'user'
        if (userRole !== requiredRole && userRole !== 'admin') {
            if (errorComponent) {
                return <>{errorComponent}</>
            }

            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
                    <div className="text-center space-y-4">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-yellow-500/10 rounded-full border border-yellow-400/20">
                            <AlertCircle className="w-8 h-8 text-yellow-400" />
                        </div>
                        <h2 className="text-xl font-bold text-yellow-300">アクセス権限がありません</h2>
                        <p className="text-slate-400 text-sm max-w-md">
                            このページにアクセスするには、{requiredRole} 権限が必要です。
                            <br />
                            現在の権限: {userRole}
                        </p>
                        <button
                            onClick={() => router.back()}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                        >
                            戻る
                        </button>
                    </div>
                </div>
            )
        }
    }

    // 認証成功 - 子コンポーネントをレンダリング
    return <>{children}</>
}

// 特定のロール用のショートカットコンポーネント
export function AdminRoute({ children, ...props }: Omit<ProtectedRouteProps, 'requiredRole'>) {
    return (
        <ProtectedRoute requiredRole="admin" {...props}>
            {children}
        </ProtectedRoute>
    )
}

export function UserRoute({ children, ...props }: Omit<ProtectedRouteProps, 'requiredRole'>) {
    return (
        <ProtectedRoute requiredRole="user" {...props}>
            {children}
        </ProtectedRoute>
    )
}

// ページレベルでのルート保護用HOC
export function withProtectedRoute<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    options?: {
        redirectTo?: string
        requiredRole?: string
        fallback?: React.ReactNode
    }
) {
    const ProtectedComponent = (props: P) => {
        return (
            <ProtectedRoute
                redirectTo={options?.redirectTo}
                requiredRole={options?.requiredRole}
                fallback={options?.fallback}
            >
                <WrappedComponent {...props} />
            </ProtectedRoute>
        )
    }

    ProtectedComponent.displayName = `withProtectedRoute(${WrappedComponent.displayName || WrappedComponent.name})`
    return ProtectedComponent
}

// ルート設定用のユーティリティ
export const RouteConfig = {
    public: [
        '/login',
        '/signup',
        '/forgot-password',
        '/reset-password',
        '/verify-email',
        '/terms',
        '/privacy',
        '/about'
    ],
    protected: [
        '/',
        '/dashboard',
        '/settings',
        '/profile'
    ],
    admin: [
        '/admin',
        '/admin/users',
        '/admin/settings',
        '/admin/analytics'
    ]
} as const

// ルート型の定義
export type PublicRoute = typeof RouteConfig.public[number]
export type ProtectedRoute = typeof RouteConfig.protected[number]
export type AdminRoute = typeof RouteConfig.admin[number]

// パスがどのタイプのルートかを判定
export function getRouteType(path: string): 'public' | 'protected' | 'admin' | 'unknown' {
    if (RouteConfig.public.includes(path as PublicRoute)) {
        return 'public'
    }
    if (RouteConfig.admin.some(route => path.startsWith(route))) {
        return 'admin'
    }
    if (RouteConfig.protected.includes(path as ProtectedRoute) || path === '/') {
        return 'protected'
    }
    return 'unknown'
}

// パスが認証を必要とするかチェック
export function requiresAuth(path: string): boolean {
    const routeType = getRouteType(path)
    return routeType === 'protected' || routeType === 'admin'
}

// パスが管理者権限を必要とするかチェック
export function requiresAdmin(path: string): boolean {
    const routeType = getRouteType(path)
    return routeType === 'admin'
}