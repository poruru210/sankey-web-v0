"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { authService, type AuthUser, type SignInResult } from './auth-service'

interface AuthContextType {
    // 認証状態
    isAuthenticated: boolean
    isLoading: boolean
    user: AuthUser | null

    // 認証操作
    signIn: (email: string, password: string) => Promise<SignInResult>
    signOut: () => Promise<void>
    refreshAuth: () => Promise<void>

    // ユーザー情報
    updateUser: (user: Partial<AuthUser>) => void

    // 状態チェック
    checkAuthStatus: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export interface AuthProviderProps {
    children: React.ReactNode
    redirectTo?: string
    publicPaths?: string[]
}

export function AuthProvider({
                                 children,
                                 redirectTo = '/login',
                                 publicPaths = ['/login', '/signup', '/forgot-password', '/reset-password']
                             }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<AuthUser | null>(null)

    const router = useRouter()
    const initializeRef = useRef(false)
    const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const signOutRef = useRef(false) // サインアウト中フラグ（シンプル化）

    // 状態をクリアする統一関数
    const clearAuthState = useCallback(() => {
        setUser(null)
        setIsAuthenticated(false)
        sessionStorage.removeItem('isLoggedIn')
    }, [])

    // 認証状態を設定する統一関数
    const setAuthState = useCallback((userInfo: AuthUser) => {
        setUser(userInfo)
        setIsAuthenticated(true)
        sessionStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
    }, [])

    // 認証状態の初期化
    const initializeAuth = useCallback(async () => {
        if (initializeRef.current) return
        initializeRef.current = true

        try {
            setIsLoading(true)

            // トークンの存在確認
            const accessToken = localStorage.getItem('accessToken')
            const refreshToken = localStorage.getItem('refreshToken')

            if (!accessToken || !refreshToken) {
                clearAuthState()
                await authService.signOut() // localStorage のクリーンアップ
                return
            }

            // 認証状態をチェック
            const isAuth = await authService.isAuthenticated()

            if (isAuth) {
                const userInfo = await authService.getCurrentUser()
                if (userInfo) {
                    setAuthState(userInfo)
                    scheduleTokenRefresh()
                } else {
                    clearAuthState()
                    await authService.signOut()
                }
            } else {
                clearAuthState()
                await authService.signOut()
            }
        } catch (error) {
            console.error('Auth initialization error:', error)
            clearAuthState()
            await authService.signOut()
        } finally {
            setIsLoading(false)
        }
    }, [clearAuthState, setAuthState])

    // ログイン処理
    const signIn = useCallback(async (email: string, password: string): Promise<SignInResult> => {
        try {
            setIsLoading(true)
            const result = await authService.signIn(email, password)

            if (result.success && result.tokens) {
                // トークンを保存
                localStorage.setItem('accessToken', result.tokens.accessToken)
                localStorage.setItem('idToken', result.tokens.idToken)
                localStorage.setItem('refreshToken', result.tokens.refreshToken)

                // ユーザー情報を取得して状態設定
                try {
                    const userInfo = await authService.getCurrentUser()
                    if (userInfo) {
                        setAuthState(userInfo)
                        scheduleTokenRefresh()
                    }
                } catch (userError) {
                    console.warn('Failed to get user info after login:', userError)
                }
            }

            return result
        } catch (error: any) {
            console.error('Sign in error:', error)
            return {
                success: false,
                error: error.message || 'login.loginFailed'
            }
        } finally {
            setIsLoading(false)
        }
    }, [setAuthState])

    // ログアウト処理（統一化）
    const signOut = useCallback(async () => {
        // 重複実行防止
        if (signOutRef.current) return
        signOutRef.current = true

        try {
            setIsLoading(true)

            // リフレッシュタイマーをクリア
            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current)
                refreshTimeoutRef.current = null
            }

            // 状態クリア
            clearAuthState()

            // localStorage クリーンアップ
            await authService.signOut()

            // リダイレクト
            router.push(redirectTo)
        } catch (error) {
            console.error('Sign out error:', error)
        } finally {
            setIsLoading(false)
            signOutRef.current = false
        }
    }, [clearAuthState, router, redirectTo])

    // 認証状態の手動更新
    const refreshAuth = useCallback(async () => {
        try {
            setIsLoading(true)

            const isAuth = await authService.isAuthenticated()

            if (isAuth) {
                const userInfo = await authService.getCurrentUser()
                if (userInfo) {
                    setAuthState(userInfo)
                } else {
                    await signOut()
                }
            } else {
                await signOut()
            }
        } catch (error) {
            console.error('Refresh auth error:', error)
            await signOut()
        } finally {
            setIsLoading(false)
        }
    }, [setAuthState, signOut])

    // ユーザー情報の更新
    const updateUser = useCallback((updatedUser: Partial<AuthUser>) => {
        setUser(prev => {
            if (!prev) return null
            const newUser = { ...prev, ...updatedUser }
            localStorage.setItem('userInfo', JSON.stringify(newUser))
            return newUser
        })
    }, [])

    // 認証状態チェック
    const checkAuthStatus = useCallback(async (): Promise<boolean> => {
        try {
            return await authService.isAuthenticated()
        } catch (error) {
            console.error('Auth status check error:', error)
            return false
        }
    }, [])

    // 自動トークンリフレッシュのスケジューリング
    const scheduleTokenRefresh = useCallback(() => {
        if (refreshTimeoutRef.current) {
            clearTimeout(refreshTimeoutRef.current)
        }

        refreshTimeoutRef.current = setTimeout(async () => {
            try {
                const refreshResult = await authService.refreshAccessToken()

                if (refreshResult.success) {
                    scheduleTokenRefresh() // 次のリフレッシュをスケジュール
                } else {
                    await signOut() // リフレッシュ失敗時はサインアウト
                }
            } catch (error) {
                console.error('Scheduled token refresh error:', error)
                await signOut()
            }
        }, 50 * 60 * 1000) // 50分
    }, [signOut])

    // 初期化
    useEffect(() => {
        initializeAuth()
    }, [initializeAuth])

    // トークンリフレッシュスケジューリング
    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            scheduleTokenRefresh()
        }

        return () => {
            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current)
            }
        }
    }, [isAuthenticated, isLoading, scheduleTokenRefresh])

    // 認証済みでログインページにいる場合のリダイレクト
    useEffect(() => {
        if (!isLoading && isAuthenticated && window.location.pathname === '/login') {
            router.push('/')
        }
    }, [isAuthenticated, isLoading, router])

    // ページフォーカス時の認証チェック（簡素化）
    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (!document.hidden && isAuthenticated && !isLoading) {
                const isStillAuth = await checkAuthStatus()
                if (!isStillAuth) {
                    await signOut()
                }
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [isAuthenticated, isLoading, checkAuthStatus, signOut])

    // クリーンアップ
    useEffect(() => {
        return () => {
            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current)
            }
        }
    }, [])

    const contextValue: AuthContextType = {
        isAuthenticated,
        isLoading,
        user,
        signIn,
        signOut,
        refreshAuth,
        updateUser,
        checkAuthStatus
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

// 認証状態に基づく条件付きレンダリング用コンポーネント
export function AuthGuard({
                              children,
                              fallback = null,
                              requireAuth = true
                          }: {
    children: React.ReactNode
    fallback?: React.ReactNode
    requireAuth?: boolean
}) {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
    }

    const shouldRender = requireAuth ? isAuthenticated : !isAuthenticated

    return shouldRender ? <>{children}</> : <>{fallback}</>
}

// HOC: 認証が必要なコンポーネントをラップ
export function withAuth<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    options?: {
        redirectTo?: string
        fallback?: React.ComponentType
    }
) {
    const ComponentWithAuth = (props: P) => {
        const { isAuthenticated, isLoading } = useAuth()
        const router = useRouter()

        useEffect(() => {
            if (!isLoading && !isAuthenticated) {
                router.push(options?.redirectTo || '/login')
            }
        }, [isLoading, isAuthenticated, router])

        if (isLoading) {
            if (options?.fallback) {
                const FallbackComponent = options.fallback
                return <FallbackComponent />
            }
            return <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
        }

        if (!isAuthenticated) {
            return null
        }

        return <WrappedComponent {...props} />
    }

    ComponentWithAuth.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`
    return ComponentWithAuth
}